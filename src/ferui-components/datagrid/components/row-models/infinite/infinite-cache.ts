import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { FeruiUtils } from '../../../../utils/ferui-utils';
import { FuiDatagridEvents, ServerSideRowDataChanged } from '../../../events';
import { FuiDatagridOptionsWrapperService } from '../../../services/datagrid-options-wrapper.service';
import { DatagridStateService } from '../../../services/datagrid-state.service';
import { FuiDatagridEventService } from '../../../services/event.service';
import { IServerSideDatasource, IServerSideGetRowsParams } from '../../../types/server-side-row-model';
import { DatagridUtils } from '../../../utils/datagrid-utils';
import { FuiDatagridRowNode } from '../../entities/fui-datagrid-row-node';

import { InfiniteBlock, InfiniteBlockState } from './infinite-block';

export interface FuiDgInfiniteCacheErrorIndexes {
  [rowId: string]: boolean;
}

export class InfiniteCache {
  blocks: { [blockNumber: string]: InfiniteBlock } = {};
  maxReachedRowIndex: number = 0;
  reachedLastIndex: boolean = false;
  errorIndexes: FuiDgInfiniteCacheErrorIndexes = {};

  private params: IServerSideGetRowsParams;
  private blockCount = 0;
  private lastOffset: number = 0;
  private blocksLoadDebounce = null;
  private blockLoadDebounceMillis: number = 50; // ms
  private subscriptions: Subscription[] = [];
  private loadedBlocksSubscriptions: Subscription[] = [];
  private loadedBlocksSub: BehaviorSubject<FuiDatagridRowNode[]> = new BehaviorSubject<FuiDatagridRowNode[]>([]);
  private rows: FuiDatagridRowNode[] = [];
  private limit: number = 0;

  constructor(
    private infiniteMaxSurroundingBlocksInCache: number,
    private infiniteInitialBlocksCount: number,
    private eventService: FuiDatagridEventService,
    private stateService: DatagridStateService,
    private optionsWrapper: FuiDatagridOptionsWrapperService
  ) {}

  /**
   * Init the cache of blocks.
   * @param limit
   * @param datasource
   * @param params
   */
  init(limit: number, datasource: IServerSideDatasource, params: IServerSideGetRowsParams) {
    this.params = params;
    this.limit = limit;
    if (DatagridUtils.isObjectEmpty(this.blocks)) {
      this.loadBlocks(0, this.limit, datasource);

      this.subscriptions.push(
        this.eventService
          .listenToEvent(FuiDatagridEvents.EVENT_SERVER_ROW_DATA_CHANGED)
          .subscribe((ev: ServerSideRowDataChanged) => {
            if (!ev.error && ev.rowNodes && ev.rowNodes.length >= 0) {
              const numberOfRows: number = ev.rowNodes.length;
              if (numberOfRows > 0) {
                const lastOffset: number = ev.pageIndex * this.limit + numberOfRows;
                if (ev.total && ev.total > 0) {
                  this.maxReachedRowIndex = ev.total;
                  this.reachedLastIndex = true;
                } else if (lastOffset > this.maxReachedRowIndex) {
                  this.maxReachedRowIndex = lastOffset;
                }
              } else {
                this.reachedLastIndex = true;
              }
            } else if (ev.error) {
              const maxReachedRowIndex = ev.pageIndex * this.limit + this.limit;
              this.maxReachedRowIndex = Math.max(maxReachedRowIndex, this.maxReachedRowIndex);
            }
          })
      );
    }
  }

  /**
   * We always load N blocks before and after the current block
   * @param currentBlockIndex
   * @param limit
   * @param datasource
   * @param forceUpdate
   */
  loadBlocks(currentBlockIndex: number, limit: number, datasource: IServerSideDatasource, forceUpdate: boolean = false): void {
    if (this.blocksLoadDebounce) {
      clearTimeout(this.blocksLoadDebounce);
    }
    this.blocksLoadDebounce = setTimeout(() => {
      const previousBlocks: number[] = [];
      const nextBlocks: number[] = [];
      this.limit = limit;
      for (let i = 1; i <= this.infiniteMaxSurroundingBlocksInCache; i++) {
        if (currentBlockIndex - i >= 0) {
          previousBlocks.push(currentBlockIndex - i);
        }
        nextBlocks.push(currentBlockIndex + i);
      }
      const blockIndexesToLoad: number[] = [...previousBlocks, currentBlockIndex, ...nextBlocks];

      // First we remove the not needed blocks
      for (const index in this.blocks) {
        if (this.blocks.hasOwnProperty(index) && blockIndexesToLoad.indexOf(Number(index)) === -1) {
          this.removeBlock(index);
        }
      }
      // Then we add the missing block(s)
      for (const index of blockIndexesToLoad) {
        const offset = index * limit;
        this.addBlock(offset, limit, datasource, forceUpdate);
      }
    }, this.blockLoadDebounceMillis);
  }

  /**
   * Return the currently loaded rows excluding the empty/error ones.
   * This is used by the selection service to select all loaded rows.
   */
  getCurrentlyLoadedRows(): FuiDatagridRowNode[] {
    return this.rows.filter(rowNode => {
      return !FeruiUtils.isNullOrUndefined(rowNode.data);
    });
  }

  /**
   * Get the rows observable that we're listening to in order to get the rows.
   */
  getRows(): Observable<FuiDatagridRowNode[]> {
    return this.loadedBlocksSub.asObservable();
  }

  /**
   * Get the max reached row index.
   * @param withHiddenRows Set this to false if you want to get the index without hidden rows being taken into account.
   * By default we take the hidden rows into account.
   */
  getMaxReachedRowIndex(withHiddenRows: boolean = true): number {
    let displayedRows = [];
    // No need to filter the rows if there is no error.
    if (this.hasErrorIndexes() && withHiddenRows) {
      displayedRows = this.rows.filter(row => !row.hidden);
      return displayedRows.length || 0;
    } else {
      return this.maxReachedRowIndex || 0;
    }
  }

  /**
   * Return true if there is at least one loading block.
   */
  hasLoadingBlock(): boolean {
    for (const blockKey in this.blocks) {
      if (this.blocks.hasOwnProperty(blockKey)) {
        const block: InfiniteBlock = this.blocks[blockKey];
        if (block.getState() === InfiniteBlockState.STATE_LOADING) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Set the server params.
   * @param params
   */
  setParams(params: IServerSideGetRowsParams): void {
    this.params = params;
  }

  /**
   * Reset the cache.
   */
  clear(): void {
    this.blocks = {};
    this.rows = [];
    this.blockCount = 0;
    this.lastOffset = 0;
    this.maxReachedRowIndex = 0;
    this.errorIndexes = {};
    this.reachedLastIndex = false;

    if (this.loadedBlocksSubscriptions.length > 0) {
      this.loadedBlocksSubscriptions.forEach(sub => sub.unsubscribe());
      this.loadedBlocksSubscriptions = [];
    }
  }

  /**
   * Clear all watcher.
   */
  destroy(): void {
    this.clear();
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions = null;
    }
  }

  /**
   * Check whether or not we have some error indexes (blocks that have error).
   * NB: The errorIndexes will only contains hidden error rows amount.
   * @private
   */
  private hasErrorIndexes(): boolean {
    return Object.keys(this.errorIndexes).length > 0;
  }

  /**
   * Add a new block.
   * @param offset
   * @param limit
   * @param datasource
   * @param forceUpdate
   * @private
   */
  private addBlock(offset: number, limit: number, datasource: IServerSideDatasource, forceUpdate: boolean = false) {
    const blockNumber: number = Math.floor(offset / limit);
    const blockNumberStr: string = blockNumber.toString();
    if (!this.blocks.hasOwnProperty(blockNumberStr) || forceUpdate) {
      const requestObj: IServerSideGetRowsParams = {
        request: {
          offset: offset,
          limit: limit
        }
      };
      const params: IServerSideGetRowsParams = DatagridUtils.mergeDeep<IServerSideGetRowsParams>({ ...this.params }, requestObj);
      const infiniteBlock: InfiniteBlock = new InfiniteBlock(this.eventService, this.stateService, this.optionsWrapper);
      infiniteBlock.init(offset, limit, datasource, params);

      this.loadedBlocksSubscriptions[blockNumber] = infiniteBlock.infiniteBlockObservable().subscribe(ib => {
        this.createDisplayedRowsArray(ib, this.rows);
      });
      this.blocks[blockNumberStr] = infiniteBlock;
      this.blockCount++;
    }
  }

  /**
   * Remove the specified block.
   * @param blockNumber
   * @private
   */
  private removeBlock(blockNumber: string) {
    if (this.blocks.hasOwnProperty(blockNumber)) {
      this.createDisplayedRowsArray(this.blocks[blockNumber], this.rows, true);
      delete this.blocks[blockNumber];
      this.blockCount--;
      const blockNumberInt: number = parseInt(blockNumber, 10);
      if (this.loadedBlocksSubscriptions[blockNumberInt]) {
        this.loadedBlocksSubscriptions[blockNumberInt].unsubscribe();
        this.loadedBlocksSubscriptions.splice(blockNumberInt, 1);
      }
    }
  }

  /**
   * Create an array of rows (including empty rows).
   * This function will mutate the global `this.rows` object.
   * @param block
   * @param rows
   * @param removeData
   * @private
   */
  private createDisplayedRowsArray(block: InfiniteBlock, rows: FuiDatagridRowNode[] = [], removeData: boolean = false): void {
    if (rows.length === 0) {
      for (let i = 0; i < this.getMaxReachedRowIndex(); i++) {
        const emptyRow: FuiDatagridRowNode = this.createEmptyRow(`${i}-empty-row`);
        rows.push(emptyRow);
      }
    }

    const startIndex: number = block.offset;
    // When the block is on failed state, we create a special error row to be displayed
    if (block.getState() === InfiniteBlockState.STATE_FAILED) {
      const errorRow = this.createErrorRow(`${startIndex}-error-row`, block.error);
      // We only replace the first error row and leave the others empty. They will not be displayed within the Datagrid.
      rows.splice(startIndex, 1, errorRow);
      for (let i = startIndex + 1; i < startIndex + block.limit; i++) {
        const errorHiddenRow: FuiDatagridRowNode = this.createErrorHiddenRow(`${i}-error-row`, block.error);
        rows.splice(i, 1, errorHiddenRow);
      }
    } else {
      const rowNodes: FuiDatagridRowNode[] = block.rowNodes;
      if (rowNodes.length > 0) {
        let rowCount = 0;
        for (const row of rowNodes) {
          // Here, we remove the row node data, we are not removing the entry in the global array. We set an empty row placeholder
          // (that act as a cache) then when the user scrolls we replace the empty entries by the new ones. That allows us to
          // keep track of the scroll size and also improve the user experience with infinite scrolling.
          // We are creating a cache of empty rows to mitigate the number of rows stored in memory, if we where caching the whole
          // row data that we've loaded so far the impact on the memory would be huge and will result in bad UX experience.
          const emptyRow: FuiDatagridRowNode = this.createEmptyRow(`${startIndex + rowCount}-empty-row`);
          const replace = removeData ? emptyRow : row;
          rows.splice(startIndex + rowCount, 1, replace);
          rowCount++;
        }

        // If there is some error indexes, we always want to have the 'block.limit' amount of rows to avoid having unnecessary
        // empty (loading) rows displayed between this block and the error-ing one.
        if (rowCount < block.limit && this.hasErrorIndexes()) {
          for (let i = startIndex + rowCount; i < startIndex + block.limit; i++) {
            const emptyHiddenRow: FuiDatagridRowNode = this.createEmptyHiddenRow(`${i}-empty-row`);
            rows.splice(i, 1, emptyHiddenRow);
          }
        }

        // If the current block is empty (but not failing) and there is error indexes already:
        // This block might be before the error-ing block (its offset is before the error-ing block offset).
        // We then replace its empty rows content by hidden error rows instead so that we don't see them displayed.
      } else if (block.getState() === InfiniteBlockState.STATE_EMPTY && this.hasErrorIndexes()) {
        for (let i = startIndex; i < startIndex + block.limit; i++) {
          // Here the error message could have been anything. It just need to not be empty.
          // No need for an enum or constant or translations.
          const errorHiddenRow: FuiDatagridRowNode = this.createEmptyHiddenRow(`${i}-empty-row`);
          rows.splice(i, 1, errorHiddenRow);
        }
      }
    }
    this.loadedBlocksSub.next(rows);
  }

  /**
   * Create an error FuiDatagridRowNode.
   * @param id
   * @param error
   * @private
   */
  private createErrorRow(id: string, error: string | Error): FuiDatagridRowNode {
    const errorRow: FuiDatagridRowNode = new FuiDatagridRowNode(this.optionsWrapper, this.eventService);
    errorRow.setDataAndId(null, id);
    errorRow.setError(error);
    return errorRow;
  }

  /**
   * Create an error hidden FuiDatagridRowNode. Those rows are not visible.
   * @param id
   * @param error
   * @private
   */
  private createErrorHiddenRow(id: string, error: string | Error): FuiDatagridRowNode {
    // We only want to track the hidden rows amount so we can remove them from the total amount of rows in pager.
    // Since the error row is displayed, it count as a row for the virtual scroller. So we don't want to remove the count
    // of displayed error row.
    if (!this.errorIndexes[id]) {
      this.errorIndexes[id] = true;
    }
    const errorRow: FuiDatagridRowNode = this.createErrorRow(id, error);
    errorRow.setRowHidden(true);
    return errorRow;
  }

  /**
   * Create an empty hidden FuiDatagridRowNode.
   * @param id
   * @private
   */
  private createEmptyHiddenRow(id: string): FuiDatagridRowNode {
    const emptyRow: FuiDatagridRowNode = this.createEmptyRow(id);
    emptyRow.setRowHidden(true);
    return emptyRow;
  }

  /**
   * Create an empty FuiDatagridRowNode.
   * @param id
   * @private
   */
  private createEmptyRow(id: string): FuiDatagridRowNode {
    const emptyRow: FuiDatagridRowNode = new FuiDatagridRowNode(this.optionsWrapper, this.eventService);
    emptyRow.setDataAndId(null, id);
    return emptyRow;
  }
}
