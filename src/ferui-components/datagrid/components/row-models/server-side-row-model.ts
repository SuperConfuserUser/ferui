import { EventEmitter, Injectable } from '@angular/core';

import { FeruiUtils } from '../../../utils/ferui-utils';
import { FuiDatagridEvents, ServerSideRowDataChanged } from '../../events';
import { FuiDatagridApiService } from '../../services/datagrid-api.service';
import { FuiDatagridColumnApiService } from '../../services/datagrid-column-api.service';
import { FuiDatagridFilterService } from '../../services/datagrid-filter.service';
import { FuiDatagridOptionsWrapperService } from '../../services/datagrid-options-wrapper.service';
import { FuiDatagridSortService } from '../../services/datagrid-sort.service';
import { FuiDatagridEventService } from '../../services/event.service';
import { FuiColumnService } from '../../services/rendering/column.service';
import {
  FilterModel,
  IDatagridResultObject,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  ServerSideRowModelInterface,
  SortModel
} from '../../types/server-side-row-model';
import { DatagridUtils } from '../../utils/datagrid-utils';
import { RowNode } from '../entities/row-node';

@Injectable()
export class FuiDatagridServerSideRowModel implements ServerSideRowModelInterface {
  isReady: EventEmitter<boolean> = new EventEmitter<boolean>();
  datasource: IServerSideDatasource;
  params: IServerSideGetRowsParams;

  offset: number;
  limit: number;
  totalRows: number | null = null;
  currentlyLoadedRows: RowNode[];

  constructor(
    private sortService: FuiDatagridSortService,
    private filterService: FuiDatagridFilterService,
    private columnService: FuiColumnService,
    private eventService: FuiDatagridEventService,
    private gridApi: FuiDatagridApiService,
    private columnApi: FuiDatagridColumnApiService,
    private optionsWrapper: FuiDatagridOptionsWrapperService
  ) {}

  /**
   * Init the row model by setting its datasource.
   * @param datasource
   */
  init(datasource: IServerSideDatasource): void {
    this.datasource = datasource;
    this.updateRows().catch(error => {
      throw error;
    });
    // The isReady event emitter doesn't need to wait for the first load of data to send the event.
    // So we don't need to wait for the promise to succeed or fail.
    this.isReady.emit(true);
  }

  /**
   * Reset the row model.
   */
  reset(): void {
    this.offset = null;
    this.limit = null;
    this.totalRows = null;
    this.setParams();
  }

  /**
   * Refresh the row model. This will just update the limit without resetting everything.
   * @param limit
   * @param datasource
   */
  refresh(limit?: number, datasource?: IServerSideDatasource): Promise<IDatagridResultObject> {
    if (datasource) {
      this.datasource = datasource;
    }
    this.reset();
    if (limit !== undefined && limit !== null && typeof limit === 'number') {
      this.limit = limit;
    }
    return this.updateRows();
  }

  /**
   * Get the row count.
   */
  getRowCount(): number | null {
    return this.totalRows;
  }

  /**
   * Whether or not we have filters.
   */
  hasFilters(): boolean {
    return this.filterService.hasFilters();
  }

  /**
   * Update the rows to be displayed.
   * @param forceReset
   * @param pageIndex
   */
  updateRows(forceReset: boolean = false, pageIndex: number = null): Promise<IDatagridResultObject> {
    if (this.datasource) {
      if (forceReset) {
        this.reset();
        pageIndex = 0;
      } else {
        this.setParams();
      }
      const params: IServerSideGetRowsParams = this.getParams();

      return this.datasource.getRows
        .bind(this.datasource.context, params)()
        .then((resultObject: IDatagridResultObject) => {
          this.totalRows = !FeruiUtils.isNullOrUndefined(resultObject.total) ? resultObject.total : null;
          const rowNodes: RowNode[] = [];
          if (resultObject && resultObject.data && resultObject.data.length > 0) {
            resultObject.data.forEach(rowData => {
              const rowNode: RowNode = new RowNode(this.optionsWrapper, this.eventService);
              const hasRowNodeIdFunc =
                !FeruiUtils.isNullOrUndefined(this.optionsWrapper.getRowNodeIdFunc()) &&
                typeof this.optionsWrapper.getRowNodeIdFunc() === 'function';
              const rowId = hasRowNodeIdFunc ? this.optionsWrapper.getRowNodeIdFunc()(rowData) : DatagridUtils.findId(rowData);
              rowNode.setDataAndId(rowData, rowId);
              rowNodes.push(rowNode);
            });
          }

          const event: ServerSideRowDataChanged = {
            type: FuiDatagridEvents.EVENT_SERVER_ROW_DATA_CHANGED,
            rowNodes: rowNodes,
            total: resultObject.total || null,
            api: this.gridApi,
            columnApi: this.columnApi,
            pageIndex: pageIndex === null ? 0 : pageIndex
          };
          this.currentlyLoadedRows = rowNodes;

          if (resultObject.data.length === 0 && !resultObject.total) {
            this.eventService.dispatchEvent(event);
            return {
              total: null,
              data: null
            };
          }
          this.eventService.dispatchEvent(event);
          return resultObject;
        })
        .catch(error => {
          return error;
        });
    }
  }

  /**
   * Get server params.
   * @private
   */
  private getParams(): IServerSideGetRowsParams {
    return this.params;
  }

  /**
   * Set server params.
   * @param params
   * @private
   */
  private setParams(params?: IServerSideGetRowsParams): void {
    if (this.offset === undefined || this.offset === null) {
      this.offset = 0;
    }
    if (this.limit === undefined || this.limit === null) {
      this.limit = this.optionsWrapper.getItemPerPage();
    }
    if (params) {
      this.params = params;
    } else {
      const sortModel: SortModel[] =
        this.sortService.sortingColumns.length >= 0 ? this.sortService.sortingColumns.map(column => column.getSortModel()) : null;

      const filterModel: FilterModel[] =
        this.filterService.activeFilters.length >= 0
          ? this.filterService.activeFilters.map(aFilter => {
              const activeFilterParams = {
                filterValue: aFilter.filter.getFilterValue(),
                filterOption: aFilter.filter.getFilterOption(),
                filterParams: aFilter.filter.getFilterParams()
              };
              return { ...aFilter.filter.getColumn().getFilterModel(), ...activeFilterParams };
            })
          : null;

      if (this.filterService.globalSearchFilter && this.filterService.globalSearchFilter.filter) {
        const aFilter = this.filterService.globalSearchFilter.filter;
        const activeFilterParams = {
          id: this.filterService.globalSearchFilter.index,
          visible: this.filterService.globalSearchFilter.filter.isFilterActive(),
          name: null,
          field: null,
          filterable: true,
          filterType: this.filterService.globalSearchFilter.filter.getFilterType(),
          filterValue: aFilter.getFilterValue(),
          filterOption: aFilter.getFilterOption(),
          filterParams: aFilter.getFilterParams()
        };
        filterModel.push(activeFilterParams);
      }

      this.params = {
        request: {
          columns: this.columnService.getAllDisplayedColumns().map(column => {
            return {
              id: column.getColId(),
              displayName: column.name,
              field: column.getColId()
            };
          }),
          filterModel: filterModel,
          sortModel: sortModel,
          offset: this.offset,
          limit: this.limit
        }
      };
    }
  }
}
