import { Column } from '../components/entities/column';

import { FuiDatagridService } from './datagrid.service';
import { FuiColumnService } from './rendering/column.service';

export class FuiDatagridColumnApiService {
  private columnService: FuiColumnService;
  private gridPanel: FuiDatagridService;

  init(columnService: FuiColumnService, gridPanel: FuiDatagridService) {
    this.columnService = columnService;
    this.gridPanel = gridPanel;
  }
  // Some of the API methods take Column Key (named colKey) which has type Column|string.
  // This means you can pass either a Column object (that you receive from calling one of the other methods)
  // or you pass in the Column ID (which is a string). The Column ID is a property of the column definition.
  // If you do not provide the Column ID, the grid will create one for you
  // (first by trying to use the field if it is unique, otherwise it will generate and ID).

  // Move one column to specific index.
  moveColumn(key, toIndex) {}

  // Move list of columns to specific index.
  moveColumns(keys, toIndex) {}

  // Move column from fromIndex to toIndex.
  moveColumnByIndex(fromIndex, toIndex) {}

  // Gets the grid to size the columns to the specified with, eg sizeColumnsToFix(900).
  // To have the grid fit the columns to the grid's width, use the Grid API gridApi.sizeColumnsToFit() instead.
  sizeColumnsToFit(width) {}

  // Returns the column with the given 'key'.
  // The key can either be the colId (a string) or the colDef (an object).
  getColumn(colKey) {}

  // Sets the visibility of a column. Key can be the column id or Column object.
  setColumnVisible(colKey, visible) {}

  // Same as setColumnVisible, but provide a list of column keys.
  setColumnsVisible(colKeys, visible) {}

  // Auto-sizes a column based on its contents.
  autoSizeColumn(colKey: string | Column | null): void {
    this.columnService.autoSizeColumn(colKey, this.gridPanel.getCenterContainer());
  }

  // Same as autoSizeColumn, but provide a list of column keys.
  autoSizeColumns(colKeys: (string | Column)[]) {
    this.columnService.autoSizeColumns(colKeys, this.gridPanel.getCenterContainer());
  }

  autoSizeAllColumns() {
    this.columnService.autoSizeAllColumns(this.gridPanel.getCenterContainer());
  }

  // Returns all the columns, regardless of visible or not.
  getAllColumns(): Column[] {
    return this.columnService.getAllDisplayedColumns();
  }

  // Sets the column width. The finished flag gets included in the resulting event and not used internally by
  // the grid. The finished flag is intended for dragging, where a dragging action will
  // produce many 'columnWidth' events, so the consumer of events knows when it receives the last event in
  // a stream. The finished parameter is optional, it defaults to 'true'.
  setColumnWidth(column, newWidth, finished = true) {}
}
