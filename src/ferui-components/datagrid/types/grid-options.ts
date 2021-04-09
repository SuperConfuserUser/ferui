import { FuiDatagridRowNode } from '../components/entities/fui-datagrid-row-node';
import { FuiDatagridApiService } from '../services/datagrid-api.service';
import { FuiDatagridColumnApiService } from '../services/datagrid-column-api.service';

import { FuiColumnDefinitions } from './column-definitions';
import { GetContextMenuItems } from './context-menu-items';
import { FuiIconDefinitions } from './icon-definitions';
import { FuiRowModel } from './row-model.enum';
import { FuiRowSelectionEnum } from './row-selection.enum';

export interface IsRowSelectable {
  (row: FuiDatagridRowNode): boolean;
}

export interface GetRowNodeIdFunc {
  (data: any): string;
}

export interface FuiGridOptions {
  // columns definition.
  columnDefs?: Array<FuiColumnDefinitions>;

  // contains column properties all columns will inherit.
  defaultColDef?: FuiColumnDefinitions;

  // specific column types containing properties that column definitions can inherit.
  columnTypes?: any;

  // Whether or not we want to display the select all checkbox in the header section.
  headerSelect?: boolean;

  // Type of FuiRowSelectionEnum, set to either 'single' or 'multiple'.
  rowSelection?: FuiRowSelectionEnum;

  // Boolean or Function. Set to true (or return true from function) to render a selection checkbox in the first column.
  checkboxSelection?: boolean;

  rowMultiSelectWithClick?: boolean;

  suppressRowClickSelection?: boolean;

  rowDeselection?: boolean;

  isRowSelectable?: IsRowSelectable;

  // The height for the row containing the column label header. If not specified the default is 50px
  headerHeight?: number;

  rowHeight?: number;

  footerHeight?: number;

  // Sets the Row Model type. Defaults to 'clientSide'. Valid options are [clientSide,infinite,serverSide].
  rowModelType?: FuiRowModel;

  // Client-side Row Model only - set the data to be displayed as rows in the grid.
  rowDataLength?: number;

  icons?: FuiIconDefinitions;

  getContextMenuItems?: GetContextMenuItems;

  api?: FuiDatagridApiService;

  columnApi?: FuiDatagridColumnApiService;

  autoSizePadding?: number;

  minColWidth?: number;

  maxColWidth?: number;

  colWidth?: number;

  suppressTouch?: boolean;

  suppressExport?: boolean;

  itemsPerPage?: number;

  infiniteMaxSurroundingBlocksInCache?: number;

  infiniteInitialBlocksCount?: number;

  // Get the unique identifier for the specific node data.
  getRowNodeId?: GetRowNodeIdFunc;
}
