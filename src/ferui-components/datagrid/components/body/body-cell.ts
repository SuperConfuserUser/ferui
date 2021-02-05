import { Subscription } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Self,
  TemplateRef
} from '@angular/core';

import { CellClickedEvent, CellContextMenuEvent, CellDoubleClickedEvent, ColumnEvent, FuiDatagridEvents } from '../../events';
import { FuiDatagridDragAndDropService } from '../../services/datagrid-drag-and-drop.service';
import { FuiDatagridOptionsWrapperService } from '../../services/datagrid-options-wrapper.service';
import { FuiDatagridService } from '../../services/datagrid.service';
import { FuiDatagridEventService } from '../../services/event.service';
import { FuiColumnService } from '../../services/rendering/column.service';
import { FuiDatagridRowSelectionService } from '../../services/selection/datagrid-row-selection.service';
import { FuiDatagridBodyCellContext } from '../../types/body-cell-context';
import { FuiRowSelectionEnum } from '../../types/row-selection.enum';
import { FuiDatagridBodyDropTarget } from '../entities/body-drop-target';
import { Column } from '../entities/column';
import { FuiDatagridRowNode } from '../entities/fui-datagrid-row-node';

@Component({
  selector: 'fui-datagrid-body-cell',
  template: `
    <fui-checkbox-wrapper
      class="fui-datagrid-selection-box"
      *ngIf="column.isCheckboxSelection() && rowNode.rowSelection === rowSelectionEnum.MULTIPLE"
    >
      <input
        type="checkbox"
        fuiCheckbox
        [name]="datagridId + 'MultipleSelection' + rowNode.id"
        [(ngModel)]="rowSelected"
        [disabled]="!rowNode.selectable"
        (ngModelChange)="rowSelectionMultipleChange($event)"
      />
    </fui-checkbox-wrapper>
    <fui-radio-wrapper
      class="fui-datagrid-selection-box"
      *ngIf="column.isCheckboxSelection() && rowNode.rowSelection === rowSelectionEnum.SINGLE"
    >
      <input
        type="radio"
        fuiRadio
        [name]="datagridId + 'SingleSelection'"
        [value]="rowNode.id"
        [(ngModel)]="rowSelected"
        [disabled]="!rowNode.selectable"
        (ngModelChange)="rowSelectionSingleChange($event)"
        (click)="rowSelectionSingleClicked()"
      />
    </fui-radio-wrapper>
    <ng-container
      *ngIf="!column.isCheckboxSelection() || !rowNode.rowSelection"
      [ngTemplateOutlet]="cellTemplate ? cellTemplate : defaultCellRenderer"
      [ngTemplateOutletContext]="templateContext"
    ></ng-container>
    <ng-template #defaultCellRenderer let-value="value">{{ value }}</ng-template>
  `,
  host: {
    '[class.fui-datagrid-body-cell]': 'true',
    '[class.fui-datagrid-column-visible]': 'column.isVisible()',
    '[class.with-animation]': 'true',
    '[class.moving]': 'column.isMoving()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuiBodyCellComponent extends FuiDatagridBodyDropTarget implements OnInit, OnDestroy {
  @HostBinding('attr.role') role: string = 'gridcell';
  @HostBinding('attr.tabindex') tabindex: string = '-1';
  @HostBinding('style.width.px') width: number = 0;
  @HostBinding('style.min-width.px') minWidth: number = 0;
  @HostBinding('style.max-width.px') maxWidth: number = null;
  @HostBinding('style.line-height.px') lineHeight: number = null;

  @Input() column: Column;
  @Input() rowNode: FuiDatagridRowNode;

  // ngModel for selection checkbox and radio.
  rowSelected: boolean | string = null;
  datagridId: string;

  // Default template variables.
  rowSelectionEnum: typeof FuiRowSelectionEnum = FuiRowSelectionEnum;
  cellTemplate: TemplateRef<FuiDatagridBodyCellContext>;
  templateContext: FuiDatagridBodyCellContext;

  private subscriptions: Subscription[] = [];
  private _left: number = 0;

  constructor(
    @Self() public elementRef: ElementRef,
    private cd: ChangeDetectorRef,
    private eventService: FuiDatagridEventService,
    private rowSelectionService: FuiDatagridRowSelectionService,
    private optionsWrapperService: FuiDatagridOptionsWrapperService,
    dragAndDropService: FuiDatagridDragAndDropService,
    columnService: FuiColumnService,
    gridPanel: FuiDatagridService
  ) {
    super(gridPanel.eBodyViewport, dragAndDropService, columnService, gridPanel);
  }

  @HostBinding('style.left.px')
  get left(): number {
    return this._left;
  }

  set left(value: number) {
    if (this._left !== value) {
      this._left = value;
      this.cd.markForCheck();
    }
  }

  @HostListener('click', ['$event'])
  onCellClick(event) {
    const evt: CellClickedEvent = {
      cellNode: this,
      column: this.column,
      value: this.templateContext.value,
      rowIndex: this.rowNode.rowIndex,
      rowData: this.rowNode.data,
      event: event,
      type: FuiDatagridEvents.EVENT_CELL_CLICKED
    };
    this.eventService.dispatchEvent(evt);
  }

  @HostListener('dblclick', ['$event'])
  onCellDblClick(event) {
    const evt: CellDoubleClickedEvent = {
      cellNode: this,
      column: this.column,
      value: this.templateContext.value,
      rowIndex: this.rowNode.rowIndex,
      rowData: this.rowNode.data,
      event: event,
      type: FuiDatagridEvents.EVENT_CELL_DOUBLE_CLICKED
    };
    this.eventService.dispatchEvent(evt);
  }

  @HostListener('contextmenu', ['$event'])
  onCellContextMenu(event) {
    const evt: CellContextMenuEvent = {
      cellNode: this,
      column: this.column,
      value: this.templateContext.value,
      rowIndex: this.rowNode.rowIndex,
      rowData: this.rowNode.data,
      event: event,
      type: FuiDatagridEvents.EVENT_CELL_CONTEXT_MENU
    };
    this.eventService.dispatchEvent(evt);
  }

  ngOnInit(): void {
    this.left = this.column.getLeft();
    this.width = this.column.getActualWidth();
    this.minWidth = this.column.getMinWidth();
    this.maxWidth = this.column.getMaxWidth();
    this.datagridId = this.optionsWrapperService.getDatagridId();

    if (this.rowNode.rowHeight) {
      this.lineHeight = this.rowNode.rowHeight - 1;
    }

    if (this.column.getRendererTemplate()) {
      this.cellTemplate = this.column.getRendererTemplate();
    }

    this.templateContext = {
      value: this.rowNode.data ? this.rowNode.data[this.column.field] : null,
      column: this.column,
      row: this.rowNode
    };

    // Selection feature only if we want the checkbox selection.
    if (this.optionsWrapperService.isCheckboxSelection() && this.column.isCheckboxSelection()) {
      this.toggleRowSelection();
      this.subscriptions.push(
        this.eventService.listenToEvent(FuiDatagridEvents.EVENT_SELECTION_CHANGED).subscribe(() => {
          this.toggleRowSelection();
          this.cd.markForCheck();
        })
      );
    }
    this.cd.markForCheck();

    this.subscriptions.push(
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_WIDTH_CHANGED).subscribe(columnEvent => {
        const ev: ColumnEvent = columnEvent as ColumnEvent;
        if (ev && ev.column.getColId() === this.column.getColId()) {
          this.width = ev.column.getActualWidth();
          this.cd.markForCheck();
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_LEFT_CHANGED).subscribe(columnEvent => {
        const ev: ColumnEvent = columnEvent as ColumnEvent;
        if (ev && ev.column.getColId() === this.column.getColId()) {
          this.left = ev.column.getLeft();
          this.cd.markForCheck();
        }
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions = undefined;
    }
  }

  /**
   * Select the row and add it to the global rowNode selection list.
   * @param checked
   */
  rowSelectionMultipleChange(checked: boolean): void {
    // If we can select a row by clicking on it, we do not need to mark the row as selected since it will be handle by the parent
    // row selection and we will get the event to update the this.rowSelected value. No need to send the event twice.
    if (!this.optionsWrapperService.suppressRowClickSelection()) {
      return;
    }
    this.rowNode.setSelected(checked === true);
    this.cd.markForCheck();
  }

  /**
   * Select the row and replace what is in the rowNode selection list. In this case, it can be only one selected item.
   * @param rowId
   */
  rowSelectionSingleChange(rowId: string): void {
    // If we can select a row by clicking on it, we do not need to mark the row as selected since it will be handle by the parent
    // row selection and we will get the event to update the this.rowSelected value. No need to send the event twice.
    if (!this.optionsWrapperService.suppressRowClickSelection()) {
      return;
    }
    this.rowNode.setSelected(!(this.rowSelectionService.isNodeSelected(rowId) === true));
    this.cd.markForCheck();
  }

  /**
   * When clicking on a selected radio it doesn't trigger the change (because it doesn't do any changes). So in that case,
   * we need to force the de-selection when clicking on a selected radio.
   */
  rowSelectionSingleClicked(): void {
    // If we can select a row by clicking on it, we do not need to mark the row as selected since it will be handle by the parent
    // row selection and we will get the event to update the this.rowSelected value. No need to send the event twice.
    if (!this.optionsWrapperService.suppressRowClickSelection()) {
      return;
    }
    if (this.rowSelectionService.isNodeSelected(this.rowNode.id)) {
      this.rowNode.setSelected(false);
      this.rowSelected = null;
      this.cd.markForCheck();
    }
  }

  /**
   * Handle the selection checkbox.
   * @private
   */
  private toggleRowSelection(): void {
    // This will always be up-to-date and in-sync.
    const isRowSelected = this.rowSelectionService.isNodeSelected(this.rowNode.id);
    // We ensure that the current rowNode is in sync with rowSelectionService.
    // Since the body cells are generated using *ngFor, when the parent array gets mutated, the children are not always
    // up-to-date. So we fix that by setting the current rowNode to the right state.
    if (isRowSelected !== this.rowNode.selected) {
      // No need to send the selection event again since this method is already called when a selection change event occurs.
      this.rowNode.setSelected(isRowSelected, false);
    }
    // For single selection, we use the rowNode ID when it is selected, but for multiple selection, we use a boolean.
    this.rowSelected =
      this.rowNode.rowSelection === FuiRowSelectionEnum.SINGLE ? (isRowSelected ? this.rowNode.id : null) : isRowSelected;
    this.cd.markForCheck();
  }
}
