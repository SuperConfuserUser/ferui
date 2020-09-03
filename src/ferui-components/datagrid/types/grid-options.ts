import { FuiDatagridApiService } from '../services/datagrid-api.service';
import { FuiDatagridColumnApiService } from '../services/datagrid-column-api.service';

import { FuiColumnDefinitions } from './column-definitions';
import { GetContextMenuItems } from './context-menu-items';
import { FuiIconDefinitions } from './icon-definitions';
import { FuiRowModel } from './row-model.enum';
import { FuiRowSelection } from './row-selection.enum';

export interface FuiGridOptions {
  // columns definition.
  columnDefs?: Array<FuiColumnDefinitions>;

  // contains column properties all columns will inherit.
  defaultColDef?: FuiColumnDefinitions;

  // specific column types containing properties that column definitions can inherit.
  columnTypes?: any;

  // Type of FuiRowSelection, set to either 'single' or 'multiple'.
  rowSelection?: FuiRowSelection;

  // The height for the row containing the column label header. If not specified the default is 40px
  headerHeight?: number;

  rowHeight?: number;

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
}
