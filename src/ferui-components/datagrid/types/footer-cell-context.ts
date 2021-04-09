import { Column } from '../components/entities/column';

export interface FuiDatagridFooterCellContext<C = any> {
  context: C;
  column: Column;
}
