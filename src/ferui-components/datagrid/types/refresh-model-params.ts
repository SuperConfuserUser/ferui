import { FuiDatagridRowNode } from '../components/entities/fui-datagrid-row-node';

export interface RefreshModelParams {
  // how much of the pipeline to execute
  step: number;
  newData?: boolean;
  keepRenderedRows?: boolean;
}

export interface ChangedPath {
  rowNodes: FuiDatagridRowNode[];
}
