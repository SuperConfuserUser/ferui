import { Observable, Subject, Subscription } from 'rxjs';

import { FeruiUtils } from '../../../../utils/ferui-utils';
import { FuiDatagridEvents, ServerSideRowDataChanged } from '../../../events';
import { FuiDatagridOptionsWrapperService } from '../../../services/datagrid-options-wrapper.service';
import { DatagridStateService } from '../../../services/datagrid-state.service';
import { FuiDatagridEventService } from '../../../services/event.service';
import { IServerSideDatasource, IServerSideGetRowsParams } from '../../../types/server-side-row-model';
import { DatagridUtils } from '../../../utils/datagrid-utils';
import { RowNode } from '../../entities/row-node';

import { InfiniteBlock, InfiniteBlockState } from './infinite-block';

export class InfiniteCache {
  blocks: { [blockNumber: string]: InfiniteBlock } = {};
  maxReachedRowIndex: number = 0;
  reachedLastIndex: boolean = false;

  private params: IServerSideGetRowsParams;
  private blockCount = 0;
  private lastOffset: number = 0;
  private blocksLoadDebounce = null;
  private blockLoadDebounceMillis: number = 50; // ms
  private subscriptions: Subscription[] = [];
  private loadedBlocksSubscriptions: Subscription[] = [];
  private loadedBlocksSub: Subject<RowNode[]> = new Subject<RowNode[]>();
  private rows: RowNode[] = [];
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
            if (ev.rowNodes && ev.rowNodes.length >= 0) {
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
  getCurrentlyLoadedRows(): RowNode[] {
    return this.rows.filter(rowNode => {
      return !FeruiUtils.isNullOrUndefined(rowNode.data);
    });
  }

  /**
   * Get the rows observable that we're listening to in order to get the rows.
   */
  getRows(): Observable<RowNode[]> {
    return this.loadedBlocksSub.asObservable();
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
        const remove: boolean = ib.getState() === InfiniteBlockState.STATE_FAILED;
        this.createDisplayedRowsArray(ib, this.rows, remove);
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
   * @param remove
   * @private
   */
  private createDisplayedRowsArray(block: InfiniteBlock, rows: RowNode[] = [], remove: boolean = false): void {
    if (rows.length === 0) {
      for (let i = 0; i < this.maxReachedRowIndex; i++) {
        const emptyRow: RowNode = this.createEmptyRow(`${i}-empty-row`);
        rows.push(emptyRow);
      }
    }

    const startIndex: number = block.offset;
    // When the block is on failed state, we create a special error row to be displayed
    if (block.getState() === InfiniteBlockState.STATE_FAILED) {
      const errorRow = this.createErrorRow(`${startIndex}-error-block`, block.error);
      rows.splice(startIndex, block.limit, errorRow);
    } else {
      const rowNodes: RowNode[] = block.rowNodes;
      let rowCount = 0;
      for (const row of rowNodes) {
        const emptyRow: RowNode = this.createEmptyRow(`${rowCount}-${startIndex}-empty-row`);
        const replace = remove ? emptyRow : row;
        rows.splice(startIndex + rowCount, 1, replace);
        rowCount++;
      }
    }
    this.loadedBlocksSub.next(rows);
  }

  /**
   * Create an error RowNode.
   * @param id
   * @param error
   * @private
   */
  private createErrorRow(id: string, error: string | Error): RowNode {
    const errorRow: RowNode = new RowNode(this.optionsWrapper, this.eventService);
    errorRow.setDataAndId(null, id);
    errorRow.setError(error);
    return errorRow;
  }

  /**
   * Create an empty RowNode.
   * @param id
   * @private
   */
  private createEmptyRow(id: string): RowNode {
    const emptyRow: RowNode = new RowNode(this.optionsWrapper, this.eventService);
    emptyRow.setDataAndId(null, id);
    return emptyRow;
  }
}
