import { Observable, Subject } from 'rxjs';

import { FeruiUtils } from '../../../../utils/ferui-utils';
import { FuiDatagridEvents, ServerSideRowDataChanged } from '../../../events';
import { FuiDatagridOptionsWrapperService } from '../../../services/datagrid-options-wrapper.service';
import { DatagridStateService } from '../../../services/datagrid-state.service';
import { FuiDatagridEventService } from '../../../services/event.service';
import { IDatagridResultObject, IServerSideDatasource, IServerSideGetRowsParams } from '../../../types/server-side-row-model';
import { DatagridUtils } from '../../../utils/datagrid-utils';
import { FuiDatagridRowNode } from '../../entities/fui-datagrid-row-node';

export enum InfiniteBlockState {
  STATE_EMPTY = 'empty',
  STATE_LOADING = 'loading',
  STATE_LOADED = 'loaded',
  STATE_FAILED = 'failed'
}

export class InfiniteBlock {
  offset: number;
  limit: number;
  rowCount: number = 0;
  rowNodes: FuiDatagridRowNode[] = [];
  error: any = null;

  private datasource: IServerSideDatasource;
  private params: IServerSideGetRowsParams;
  private blockNumber: number = 0;
  private state: InfiniteBlockState = InfiniteBlockState.STATE_EMPTY;
  private infiniteBlockSub: Subject<InfiniteBlock> = new Subject<InfiniteBlock>();

  constructor(
    private eventService: FuiDatagridEventService,
    private stateService: DatagridStateService,
    private optionsWrapper: FuiDatagridOptionsWrapperService
  ) {}

  /**
   * Init the block by setting its offset/limit and datasource..
   * @param offset
   * @param limit
   * @param datasource
   * @param params
   */
  init(offset: number, limit: number, datasource: IServerSideDatasource, params: IServerSideGetRowsParams) {
    this.offset = offset;
    this.limit = limit;
    this.blockNumber = Math.floor(offset / limit);
    this.datasource = datasource;
    this.params = params;
    this.state = InfiniteBlockState.STATE_LOADING;
    this.loadFromDatasource().catch(error => {
      console.warn(error);
    });
  }

  /**
   * Return all blocks (loaded/error/loading).
   */
  infiniteBlockObservable(): Observable<InfiniteBlock> {
    return this.infiniteBlockSub.asObservable();
  }

  /**
   * Get the current state of this block.
   */
  getState(): InfiniteBlockState {
    return this.state;
  }

  /**
   * Load data from datasource for this specific block.
   */
  loadFromDatasource(): Promise<FuiDatagridRowNode[]> {
    if (this.datasource) {
      return this.datasource.getRows
        .bind(this.datasource.context, this.params)()
        .then(resultObject => {
          if (resultObject.data.length === 0 && !resultObject.total) {
            this.state = InfiniteBlockState.STATE_EMPTY;
            this.rowCount = 0;
            this.setRowNodes([]);
            if (this.stateService) {
              this.stateService.setLoaded();
              this.stateService.setRefreshed();
            }
          } else {
            this.rowCount = resultObject.data.length;
            this.setRowNodes(resultObject.data);
            this.state = InfiniteBlockState.STATE_LOADED;
            // When at least the first block is loaded we remove the global loading.
            if (this.stateService) {
              this.stateService.setLoaded();
              this.stateService.setRefreshed();
            }
          }
          this.dispatchEvent(resultObject);
          this.infiniteBlockSub.next(this);
          return this.rowNodes;
        })
        .catch(error => {
          this.state = InfiniteBlockState.STATE_FAILED;
          if (this.stateService) {
            this.stateService.setLoaded();
            this.stateService.setRefreshed();
          }
          this.dispatchEvent(null);
          this.error = error;
          this.infiniteBlockSub.next(this);
          return error;
        });
    }
    return Promise.resolve([]);
  }

  /**
   * Dispatch the EVENT_SERVER_ROW_DATA_CHANGED event when we've loaded all rows.
   * @param resultObject
   * @private
   */
  private dispatchEvent(resultObject: IDatagridResultObject | null) {
    const event: ServerSideRowDataChanged = {
      type: FuiDatagridEvents.EVENT_SERVER_ROW_DATA_CHANGED,
      rowNodes: this.rowNodes,
      total: resultObject === null ? null : FeruiUtils.isNullOrUndefined(resultObject.total) ? null : resultObject.total,
      api: null,
      columnApi: null,
      pageIndex: this.blockNumber
    };
    this.eventService.dispatchEvent(event);
  }

  /**
   * Map every data to be a FuiDatagridRowNode object.
   * @param data
   * @private
   */
  private setRowNodes(data: any[]): void {
    if (data.length === 0) {
      this.rowNodes = [];
    } else {
      this.rowNodes = data.map(obj => {
        const rowNode = new FuiDatagridRowNode(this.optionsWrapper, this.eventService);
        const hasRowNodeIdFunc =
          !FeruiUtils.isNullOrUndefined(this.optionsWrapper.getRowNodeIdFunc()) &&
          typeof this.optionsWrapper.getRowNodeIdFunc() === 'function';
        const rowId = hasRowNodeIdFunc ? this.optionsWrapper.getRowNodeIdFunc()(obj) : DatagridUtils.findId(obj);
        rowNode.setDataAndId(obj, rowId);
        return rowNode;
      });
    }
  }
}
