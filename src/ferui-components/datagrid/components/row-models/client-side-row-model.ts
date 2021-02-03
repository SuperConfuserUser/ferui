import { Injectable } from '@angular/core';

import { FeruiUtils } from '../../../utils/ferui-utils';
import { Constants } from '../../constants';
import { FuiDatagridEvents, FuiFilterEvent, FuiModelUpdatedEvent, FuiSortEvent } from '../../events';
import { FuiDatagridApiService } from '../../services/datagrid-api.service';
import { FuiDatagridColumnApiService } from '../../services/datagrid-column-api.service';
import { FuiDatagridFilterService } from '../../services/datagrid-filter.service';
import { FuiDatagridSortService } from '../../services/datagrid-sort.service';
import { FuiDatagridEventService } from '../../services/event.service';
import { FuiColumnService } from '../../services/rendering/column.service';
import { DatagridRowNodeManagerService } from '../../services/row/datagrid-row-node-manager.service';
import { ChangedPath, RefreshModelParams } from '../../types/refresh-model-params';
import { RowModelInterface } from '../../types/row-model';
import { FuiDatagridRowNode } from '../entities/fui-datagrid-row-node';

@Injectable()
export class FuiDatagridClientSideRowModel implements RowModelInterface {
  private rowsToDisplay: FuiDatagridRowNode[]; // the rows mapped to rows to display

  constructor(
    private filterService: FuiDatagridFilterService,
    private sortService: FuiDatagridSortService,
    private columnService: FuiColumnService,
    private eventService: FuiDatagridEventService,
    private gridApi: FuiDatagridApiService,
    private columnApi: FuiDatagridColumnApiService,
    private rowNodeManagerService: DatagridRowNodeManagerService
  ) {}

  /**
   * Set the rowData for the grid.
   * @param rowData
   * @param selectedRows
   * @param keepRenderedRows
   */
  setRowData(rowData: any[], selectedRows: FuiDatagridRowNode[], keepRenderedRows: boolean = false) {
    this.rowNodeManagerService.setRowData(rowData, selectedRows);
    this.refreshModel({
      step: Constants.STEP_EVERYTHING,
      newData: true,
      keepRenderedRows: keepRenderedRows
    });
  }

  /**
   * Get a copy of all FuiDatagridRowNode loaded indexed by their own ID.
   */
  getCopyOfNodesMap(): { [id: string]: FuiDatagridRowNode } {
    return this.rowNodeManagerService.getCopyOfNodesMap();
  }

  /**
   * Get the list of all nodes to display on screen.
   */
  getRowNodesToDisplay(): FuiDatagridRowNode[] {
    return this.rowsToDisplay;
  }

  /**
   * Get the total amount of rows.
   */
  getTotalRowCount(): number {
    return Object.keys(this.getCopyOfNodesMap()).length;
  }

  /**
   * Get the amount of rows to be displayed. This count take the filters into account when getTotalRowCount() doesn't.
   */
  getRowCount(): number {
    if (this.rowsToDisplay) {
      return this.rowsToDisplay.length;
    }

    return 0;
  }

  /**
   * Check whether or not we have filters.
   */
  hasFilters(): boolean {
    return this.filterService.hasFilters();
  }

  /**
   * This method gets called each time we want to refresh the displayed rows.
   * It will run the filter/sort/rendering states depending on the RefreshModelParams.step asked.
   * @param params
   */
  refreshModel(params: RefreshModelParams): void {
    const changedPath: ChangedPath = {
      rowNodes: params.keepRenderedRows
        ? this.rowsToDisplay
        : FeruiUtils.flattenObject(this.rowNodeManagerService.getCopyOfNodesMap())
    };

    // Fallthrough in below switch is on purpose,
    // eg if STEP_FILTER, then all steps below this step get done
    // tslint:disable
    switch (params.step) {
      case Constants.STEP_EVERYTHING:
      case Constants.STEP_FILTER:
        this.doFilter(changedPath);
      case Constants.STEP_SORT:
        this.doSort(changedPath);
      case Constants.STEP_MAP:
        this.doRowsToDisplay(changedPath);
    }
    // tslint:enable
    const event: FuiModelUpdatedEvent = {
      type: FuiDatagridEvents.EVENT_MODEL_UPDATED,
      api: this.gridApi,
      columnApi: this.columnApi,
      newData: params.newData
    };
    this.eventService.dispatchEvent(event);
  }

  /**
   * Filter the rows.
   * @param changedPath
   * @private
   */
  private doFilter(changedPath: ChangedPath): void {
    if (!changedPath.rowNodes) {
      return;
    }
    this.filterService.filter(changedPath);
    const event: FuiFilterEvent = {
      api: null,
      columnApi: this.columnApi,
      type: FuiDatagridEvents.EVENT_FILTER_CHANGED
    };
    this.eventService.dispatchEvent(event);
  }

  /**
   * Sort the rows
   * @param changedPath
   * @private
   */
  private doSort(changedPath: ChangedPath): void {
    if (!changedPath.rowNodes) {
      return;
    }
    this.sortService.sort(changedPath);
    const event: FuiSortEvent = {
      api: this.gridApi,
      columnApi: this.columnApi,
      type: FuiDatagridEvents.EVENT_SORT_CHANGED
    };
    this.eventService.dispatchEvent(event);
  }

  /**
   * Render the rows.
   * @param changedPath
   * @private
   */
  private doRowsToDisplay(changedPath: ChangedPath): void {
    if (!changedPath.rowNodes) {
      this.rowsToDisplay = [];
      return;
    }
    this.rowsToDisplay = changedPath.rowNodes;
  }
}
