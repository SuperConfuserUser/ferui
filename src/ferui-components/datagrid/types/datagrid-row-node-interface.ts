export interface FuiDatagridRowNodeInterface<D = any> {
  id: string; // The unique identifier for the row.
  // The index of the node in the grid, only valid if node is displayed in the grid,
  // otherwise it should be ignored as old index may be present.
  rowIndex: number;
  rowHeight: number; // The height, in pixels, of this row.
  selectable: boolean; // True by default - can be overridden via isRowSelectable(rowNode).
  selected: boolean;
  data: D; // The data for the row.
}
