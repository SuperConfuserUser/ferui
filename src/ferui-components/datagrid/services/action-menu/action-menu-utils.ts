import { RowNode } from '../../components/entities/row-node';
import { FuiDatagridBodyRowContext } from '../../types/body-row-context';

/**
 * FuiActionMenuUtils class
 */
export class FuiActionMenuUtils {
  /**
   * Generate a simple action menu context to use.
   * This is used in place of the FuiDatagridBodyRow definition which is much more complex object.
   * This is for better memory consumption.
   */
  static getContextForActionMenu(row: RowNode, rowTopValue: number): FuiDatagridBodyRowContext {
    return {
      rowNode: row,
      rowTopValue: rowTopValue,
      appendTo: '#' + row.getDatagridId()
    };
  }
}
