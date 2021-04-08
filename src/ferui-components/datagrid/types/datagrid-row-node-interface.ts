export interface FuiDatagridRowNodeInterface<D = any> {
  id: string; // The unique identifier for the row.
  // The index of the node in the grid, only valid if node is displayed in the grid,
  // otherwise it should be ignored as old index may be present.
  rowIndex: number;
  rowHeight: number; // The height, in pixels, of this row.
  selectable: boolean; // True by default - can be overridden via isRowSelectable(rowNode).
  selected: boolean;
  data: D; // The data for the row.
  hidden: boolean; // Whether the row is hidden or not. If the row is hidden, it won't be loaded into the DOM but it would still
  // be accessible. This is useful when building rows that are error-ing, we only display the first one and hide any subsequent
  // error-ing rows. It will help us to keep track on row size more accurately.
}
