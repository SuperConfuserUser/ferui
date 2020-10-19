import { Injectable } from '@angular/core';

import { Column } from '../components/entities/column';
import { FuiDatagridEvents, FuiSortColumnsEvent } from '../events';
import { FuiColumnDefinitions } from '../types/column-definitions';
import { ChangedPath } from '../types/refresh-model-params';
import { FuiDatagridSortDirections } from '../types/sort-directions.enum';
import { sortRows } from '../utils/sort';

import { FuiDatagridApiService } from './datagrid-api.service';
import { FuiDatagridColumnApiService } from './datagrid-column-api.service';
import { FuiDatagridEventService } from './event.service';

@Injectable()
export class FuiDatagridSortService {
  private _sortingColumns: Column[] = [];
  private _initialSortingColumns: Column[] = [];
  private _initialSortingColumnDefs: FuiColumnDefinitions[] = [];

  constructor(
    private eventService: FuiDatagridEventService,
    private gridApi: FuiDatagridApiService,
    private columnApi: FuiDatagridColumnApiService
  ) {}

  get sortingColumns(): Column[] {
    return this._sortingColumns;
  }

  /**
   * Change the sorting columns. Each time a user update the sort.
   * @param columns
   */
  set sortingColumns(columns: Column[]) {
    // We first filter columns that need to be sort to.
    const sortedColumns = columns.filter(col => {
      return col.getSort() !== FuiDatagridSortDirections.NONE;
    });
    // If we didn't set any sorting columns, we just clean the sortingColumns.
    if (!sortedColumns) {
      this._sortingColumns = [];
    } else {
      this._sortingColumns = sortedColumns;
    }
    const event: FuiSortColumnsEvent = {
      api: this.gridApi,
      columnApi: this.columnApi,
      sortedColumns: this._sortingColumns,
      type: FuiDatagridEvents.EVENT_SORT_COLUMN_CHANGED
    };
    this.eventService.dispatchEvent(event);
  }

  /**
   * Add sorting column. This method is only called when a column is created. Basically durring the same time as the datagrid.
   * @param column
   */
  addSortingColumn(column: Column): void {
    // Only store columns that have a direction set.
    if (column.getSort() === FuiDatagridSortDirections.NONE) {
      return;
    }
    const columnIndex: number =
      this.sortingColumns.length > 0
        ? this.sortingColumns.findIndex(col => {
            return col.getColId() === column.getColId();
          })
        : -1;
    if (columnIndex >= 0) {
      this.sortingColumns.splice(columnIndex, 1, column);
    } else {
      this.sortingColumns.push(column);
    }
    this._initialSortingColumnDefs.push(column.getColumnDefinition());
    this._initialSortingColumns.push(column);
  }

  sort(changedPath: ChangedPath): void {
    if (!changedPath.rowNodes || !this.hasSortingColumns()) {
      return;
    }
    sortRows(changedPath, this.sortingColumns);
  }

  updateColumn(column: Column): void {
    const colIndex: number = this.sortingColumns.findIndex(col => {
      return col.getColId() === column.getColId();
    });
    // Here we need to reassign the value to this.sortingColumns each time to trigger the emitChange event from the setter.
    if (column.getSort() === FuiDatagridSortDirections.NONE && colIndex > -1) {
      const columns = [...this.sortingColumns];
      columns.splice(colIndex, 1);
      this.sortingColumns = columns;
    } else if (colIndex === -1) {
      this.sortingColumns = [...this.sortingColumns, column];
    } else {
      const columns = [...this.sortingColumns];
      columns[colIndex] = column;
      this.sortingColumns = columns;
    }
  }

  /**
   * Reset the sort order to its initial value.
   * @param initialSortingColumns
   */
  resetColumnsSortOrder(initialSortingColumns?: Column[]): void {
    // We get the initial sort value from the column definition.
    this._initialSortingColumns.forEach(col => {
      col.setSort(this._initialSortingColumnDefs.find(colDef => colDef.field === col.field).sort);
    });
    this.sortingColumns = initialSortingColumns || this._initialSortingColumns;
  }

  hasSortingColumns(): boolean {
    return this.sortingColumns.length > 0;
  }

  sortList(): FuiDatagridSortDirections[] {
    return [FuiDatagridSortDirections.ASC, FuiDatagridSortDirections.DESC, FuiDatagridSortDirections.NONE];
  }

  getNextSortOrder(): number {
    return this.sortingColumns.length;
  }

  getSortOrderByIndex(index: number): FuiDatagridSortDirections {
    return this.sortList()[index];
  }

  setSortForOtherColumnThan(column: Column, sort: FuiDatagridSortDirections): void {
    this._sortingColumns.forEach(col => {
      if (col.getColId() !== column.getColId()) {
        col.setSort(sort);
      }
    });
  }

  isMultiSort(): boolean {
    return this.sortingColumns.length > 1;
  }
}
