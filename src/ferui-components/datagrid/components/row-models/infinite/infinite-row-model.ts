import { Observable } from 'rxjs';

import { EventEmitter, Injectable } from '@angular/core';

import { FuiDatagridApiService } from '../../../services/datagrid-api.service';
import { FuiDatagridColumnApiService } from '../../../services/datagrid-column-api.service';
import { FuiDatagridFilterService } from '../../../services/datagrid-filter.service';
import { FuiDatagridOptionsWrapperService } from '../../../services/datagrid-options-wrapper.service';
import { FuiDatagridSortService } from '../../../services/datagrid-sort.service';
import { DatagridStateService } from '../../../services/datagrid-state.service';
import { FuiDatagridEventService } from '../../../services/event.service';
import { FuiColumnService } from '../../../services/rendering/column.service';
import {
  FilterModel,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  ServerSideRowModelInterface,
  SortModel
} from '../../../types/server-side-row-model';
import { RowNode } from '../../entities/row-node';

import { InfiniteCache } from './infinite-cache';

@Injectable()
export class FuiDatagridInfinteRowModel implements ServerSideRowModelInterface {
  isReady: EventEmitter<boolean> = new EventEmitter<boolean>();

  datasource: IServerSideDatasource;
  params: IServerSideGetRowsParams;
  infiniteCache: InfiniteCache;
  initialized: boolean = false;
  limit: number;
  offset: number;
  infiniteMaxSurroundingBlocksInCache: number;
  infiniteInitialBlocksCount: number;
  totalRows: number | null = null;

  constructor(
    private sortService: FuiDatagridSortService,
    private filterService: FuiDatagridFilterService,
    private columnService: FuiColumnService,
    private eventService: FuiDatagridEventService,
    private gridApi: FuiDatagridApiService,
    private columnApi: FuiDatagridColumnApiService,
    private optionsWrapper: FuiDatagridOptionsWrapperService,
    private stateService: DatagridStateService
  ) {}

  /**
   * Init the row model
   * @param datasource
   */
  init(datasource: IServerSideDatasource): void {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    this.infiniteMaxSurroundingBlocksInCache = this.optionsWrapper.infiniteMaxSurroundingBlocksInCache;
    this.infiniteInitialBlocksCount = this.optionsWrapper.infiniteInitialBlocksCount;
    this.datasource = datasource;
    this.setParams();
    this.infiniteCache = new InfiniteCache(
      this.infiniteMaxSurroundingBlocksInCache,
      this.infiniteInitialBlocksCount,
      this.eventService,
      this.stateService,
      this.optionsWrapper
    );
    this.infiniteCache.init(this.limit, this.datasource, this.getParams());

    // The isReady event emitter doesn't need to wait for the first load of data to send the event.
    // So we don't need to wait for the promise to succeed or fail.
    this.isReady.emit(true);
  }

  /**
   * Reset all listeners and destroys all cache & blocks.
   */
  destroy(): void {
    if (this.infiniteCache) {
      this.infiniteCache.destroy();
      this.infiniteCache = null;
    }
  }

  /**
   * Load more blocks.
   * @param blockNumber
   * @param forceUpdate
   */
  loadBlocks(blockNumber: number, forceUpdate: boolean = false): void {
    this.setParams();
    this.infiniteCache.setParams(this.getParams());
    this.infiniteCache.loadBlocks(blockNumber, this.limit, this.datasource, forceUpdate);
  }

  /**
   * Get currently loaded blocks (blocks that have the 'loaded' state).
   */
  getCurrentlyLoadedRows(): RowNode[] {
    return this.infiniteCache.getCurrentlyLoadedRows();
  }

  /**
   * Get the observable of rows to be displayed.
   */
  getDisplayedRows(): Observable<RowNode[]> {
    return this.infiniteCache.getRows();
  }

  /**
   * Check whether or not the cache has at least one loading block (the state is loading).
   */
  hasLoadingBlock(): boolean {
    if (this.infiniteCache) {
      return this.infiniteCache.hasLoadingBlock();
    }
    return false;
  }

  /**
   * Reset the row model.
   */
  reset(): void {
    if (this.infiniteCache) {
      this.infiniteCache.clear();
    }
    this.limit = null;
    this.totalRows = null;
  }

  /**
   * Refresh the row model.
   * @param limit
   * @param datasource
   */
  refresh(limit: number, datasource?: IServerSideDatasource): void {
    this.reset();
    this.limit = limit;
    if (datasource) {
      this.datasource = datasource;
    }
    this.loadBlocks(0, true);
  }

  /**
   * Get the total amount of rows. If the server gives us this info, then this function will indeed return the total amount of
   * rows expected from the API. Otherwise, it will just return the currently loaded rows count.
   */
  getRowCount(): number | null {
    return this.totalRows;
  }

  /**
   * Check whether or not we have active filters.
   */
  hasFilters(): boolean {
    return this.filterService.hasFilters();
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
          offset: null,
          limit: this.limit
        }
      };
    }
  }
}
