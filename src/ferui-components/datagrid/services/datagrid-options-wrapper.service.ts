import { Injectable } from '@angular/core';

import { FeruiUtils } from '../../utils/ferui-utils';
import { FuiGridOptions, GetRowNodeIdFunc, IsRowSelectable } from '../types/grid-options';
import { FuiRowModel } from '../types/row-model.enum';
import { FuiRowSelectionEnum } from '../types/row-selection.enum';
import { DatagridUtils } from '../utils/datagrid-utils';

import { FuiDatagridApiService } from './datagrid-api.service';
import { FuiDatagridColumnApiService } from './datagrid-column-api.service';
import { ExportParams } from './exporter/export-params';

@Injectable()
export class FuiDatagridOptionsWrapperService {
  public static MIN_COLUMN_WIDTH = 100; // In pixels

  rowDataModel: FuiRowModel = FuiRowModel.CLIENT_SIDE;
  infiniteMaxSurroundingBlocksInCache: number = 4; // By default, we allow only 5 pages to be cached at the same time.
  infiniteInitialBlocksCount: number = 3; // By default, on first load, we load 3 blocks (pages).

  private defaultGridOption: FuiGridOptions = {
    // Grid defaults.
    headerHeight: 50,
    rowHeight: 50,
    minColWidth: FuiDatagridOptionsWrapperService.MIN_COLUMN_WIDTH,
    // Infinite scrolling defaults.
    infiniteMaxSurroundingBlocksInCache: this.infiniteMaxSurroundingBlocksInCache,
    infiniteInitialBlocksCount: this.infiniteInitialBlocksCount,
    // Selection defaults.
    checkboxSelection: true,
    rowMultiSelectWithClick: true,
    suppressRowClickSelection: false,
    headerSelect: true
  };

  private readonly _gridOptions: FuiGridOptions = {};

  constructor(private _gridApi: FuiDatagridApiService, private _columnApi: FuiDatagridColumnApiService) {
    this._gridOptions = this.defaultGridOption;
  }

  get gridOptions(): FuiGridOptions {
    return this._gridOptions;
  }

  get gridApi(): FuiDatagridApiService {
    return this._gridApi;
  }

  get columnApi(): FuiDatagridColumnApiService {
    return this._columnApi;
  }

  /**
   * Get auto size padding value. Used by the AutoWidthCalculator class to calculate the best width for a column.
   * We add padding as I found sometimes the gui still put '...' after some of the texts. so the
   * user can configure the grid to add a few more pixels after the calculated width.
   */
  getAutoSizePadding(): number {
    return this._gridOptions.autoSizePadding && this._gridOptions.autoSizePadding > 0 ? this._gridOptions.autoSizePadding : 40;
  }

  /**
   * Get the minimal value for column width. It depends on what the devs gives us
   * otherwise it will be set to MIN_COLUMN_WIDTH (100px).
   */
  getMinColWidth(): number {
    if (this.gridOptions.minColWidth && this.gridOptions.minColWidth !== FuiDatagridOptionsWrapperService.MIN_COLUMN_WIDTH) {
      return this.gridOptions.minColWidth;
    }

    return FuiDatagridOptionsWrapperService.MIN_COLUMN_WIDTH;
  }

  /**
   * Get the maximal value for column width. It depends on what the devs gives us. By default it is set to null.
   */
  getMaxColWidth(): number {
    if (this.gridOptions.maxColWidth && this.gridOptions.maxColWidth > this.getMinColWidth()) {
      return this.gridOptions.maxColWidth;
    }

    return null;
  }

  /**
   * Get the  width for the current column. It depends on what the devs gives us
   * otherwise it will be set to MIN_COLUMN_WIDTH (100px).
   */
  getColWidth(): number {
    if (typeof this.gridOptions.colWidth !== 'number' || this.gridOptions.colWidth < this.getMinColWidth()) {
      return this.getMinColWidth();
    }

    return this.gridOptions.colWidth;
  }

  /**
   * Whether or not we've suppressed the touch event (mobile/tablet events) from the column.
   */
  isSuppressTouch(): boolean {
    return this.gridOptions.suppressTouch === true;
  }

  /**
   * Get the item per page value.
   */
  getItemPerPage(): number {
    return DatagridUtils.isNumeric(this.gridOptions.itemsPerPage) ? this.gridOptions.itemsPerPage : 10;
  }

  /**
   * Whether or not we've suppressed the export to csv feature or not.
   */
  isSuppressCsvExport(): boolean {
    return this.gridOptions.suppressExport === true;
  }

  /**
   * Get the default ExportParams for exporting the Datagrid to file.
   */
  getDefaultExportParams<T>(): ExportParams<T> {
    return {
      skipHeader: false,
      skipFooters: false,
      suppressQuotes: false,
      fileName: 'fui-datagrid-export'
    };
  }

  /**
   * Set a Datagrid option.
   * @param option
   * @param value
   */
  setGridOption<K extends keyof FuiGridOptions>(option: K, value: FuiGridOptions[K]): void {
    if (!FeruiUtils.isNullOrUndefined(option)) {
      this._gridOptions[option] = value;
    }
  }

  /**
   * Whether or not we want to use a checkbox selection view.
   */
  isCheckboxSelection(): boolean {
    return this.gridOptions.checkboxSelection === true;
  }

  /**
   * Whether or not we want to select a row by clicking on it.
   */
  suppressRowClickSelection(): boolean {
    return this.gridOptions.suppressRowClickSelection === true;
  }

  /**
   * Return a function that accept a RowNode object as attribute and return whether or not the row is selected.
   */
  getIsRowSelectableFunc(): IsRowSelectable | undefined {
    return this.gridOptions.isRowSelectable;
  }

  /**
   * Return the row selection mode. Default to undefined (disable selection feature).
   */
  getRowSelection(): FuiRowSelectionEnum | undefined {
    return this.gridOptions.rowSelection;
  }

  /**
   * Get the datagrid ID.
   */
  getDatagridId(): string {
    return this.gridApi.getGridId();
  }

  /**
   * Return a function that accept a RowNode.data object as attribute and return the ID provided by the devs to use for this node.
   */
  getRowNodeIdFunc(): GetRowNodeIdFunc | undefined {
    return this.gridOptions.getRowNodeId;
  }

  /**
   * Get the row height.
   */
  getRowHeight(): number {
    return this.gridOptions.rowHeight || 50;
  }

  /**
   * Get the header row height.
   */
  getHeaderHeight(): number {
    return this.gridOptions.headerHeight || 50;
  }

  /**
   * Check if we want to display the header checkbox or not (only when selection feature is active).
   */
  hasHeaderSelect(): boolean {
    return this.gridOptions.headerSelect === true;
  }
}
