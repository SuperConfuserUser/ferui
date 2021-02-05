import { FeruiUtils } from '../../../utils/ferui-utils';
import { FuiDatagridEvents, RowSelectedEvent } from '../../events';
import { FuiDatagridOptionsWrapperService } from '../../services/datagrid-options-wrapper.service';
import { FuiDatagridEventService } from '../../services/event.service';
import { FuiDatagridRowNodeInterface } from '../../types/datagrid-row-node-interface';
import { FuiRowSelectionEnum } from '../../types/row-selection.enum';

export class FuiDatagridRowNode<D = any> implements FuiDatagridRowNodeInterface<D> {
  private _data: D;
  private _id: string;
  private _rowHeight: number;
  private _rowIndex: number;
  private _selectable: boolean = true;
  private _selected: boolean = false;
  private _rowSelection: FuiRowSelectionEnum;
  private _error: string | Error;
  private _isFirstRow: boolean;

  constructor(private datagridOptionsWrapper: FuiDatagridOptionsWrapperService, private eventService: FuiDatagridEventService) {}

  get data(): D {
    return this._data;
  }

  get id(): string {
    return this._id;
  }

  get rowHeight(): number {
    return this._rowHeight;
  }

  get rowIndex(): number {
    return this._rowIndex;
  }

  get selectable(): boolean {
    return this._selectable;
  }

  get selected(): boolean {
    return this._selected;
  }

  get rowSelection(): FuiRowSelectionEnum {
    return this._rowSelection;
  }

  get error(): string | Error {
    return this._error;
  }

  get isFirstRow(): boolean {
    return this._isFirstRow;
  }

  getDatagridId(): string {
    return this.datagridOptionsWrapper.getDatagridId();
  }

  setIsFirstRow(value: boolean) {
    this._isFirstRow = value;
  }

  setDataAndId(data: D, id: string | undefined): void {
    this._data = data;
    this.setId(id);
    this.checkRowSelectable();
    this.setRowSelection(this.datagridOptionsWrapper.getRowSelection());
  }

  setId(id: string): void {
    // see if user is providing the id's
    const getRowNodeId = this.datagridOptionsWrapper.getRowNodeIdFunc();

    if (getRowNodeId && this.data) {
      // if user is providing the id's, then we set the id only after the data has been set.
      this._id = getRowNodeId(this.data);
    } else {
      this._id = id;
    }
  }

  setRowSelectable(newVal: boolean) {
    if (this.selectable !== newVal) {
      this._selectable = newVal;
    }
  }

  setRowIndex(rowIndex: number): void {
    this._rowIndex = rowIndex;
  }

  setRowHeight(rowHeight: number | undefined | null): void {
    this._rowHeight = rowHeight;
  }

  setRowSelection(rowSelection: FuiRowSelectionEnum) {
    this._rowSelection = rowSelection;
  }

  setSelected(selected: boolean, emitEvent: boolean = true): void {
    if (this.id === undefined) {
      console.warn('[Ferui Datagrid] Error: cannot select node until id for node is known');
      return;
    }
    if (this.selectable && this._selected !== selected) {
      this._selected = selected;
      if (emitEvent) {
        const evt: RowSelectedEvent = {
          rowNode: this,
          type: FuiDatagridEvents.EVENT_ROW_SELECTED
        };
        this.eventService.dispatchEvent(evt);
      }
    }
  }

  setError(error: string | Error) {
    this._error = error;
  }

  private checkRowSelectable() {
    const isRowSelectableFunc = this.datagridOptionsWrapper.getIsRowSelectableFunc();
    const shouldInvokeIsRowSelectable = isRowSelectableFunc && FeruiUtils.exists(this);
    this.setRowSelectable(shouldInvokeIsRowSelectable ? isRowSelectableFunc(this) : true);
  }
}
