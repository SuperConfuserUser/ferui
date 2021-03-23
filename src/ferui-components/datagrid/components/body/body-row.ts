import { Subscription } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  Self
} from '@angular/core';

import { FeruiUtils } from '../../../utils/ferui-utils';
import { FuiDatagridEvents, RowClickedEvent, RowDoubleClickedEvent } from '../../events';
import { FuiActionMenuUtils } from '../../services/action-menu/action-menu-utils';
import { FuiActionMenuService } from '../../services/action-menu/action-menu.service';
import { FuiDatagridOptionsWrapperService } from '../../services/datagrid-options-wrapper.service';
import { FuiDatagridEventService } from '../../services/event.service';
import { RowRendererService } from '../../services/rendering/row-renderer.service';
import { FuiDatagridRowSelectionService } from '../../services/selection/datagrid-row-selection.service';
import { Column } from '../entities/column';
import { FuiDatagridRowNode } from '../entities/fui-datagrid-row-node';

import { FuiBodyCellComponent } from './body-cell';

@Component({
  selector: 'fui-datagrid-body-row',
  template: `
    <ng-content *ngIf="!isRowError()" select="fui-datagrid-body-cell"></ng-content>
    <div *ngIf="isRowError()" class="fui-datagrid-row-error" [style.height.px]="rowHeight" [style.line-height.px]="rowHeight - 2">
      <clr-icon shape="fui-error" class="fui-datagrid-row-error-icon"></clr-icon>
      <span class="fui-error-message">{{ rowNode.error }}</span>
    </div>
  `,
  host: {
    '[class.fui-datagrid-body-row]': 'true',
    '[class.selectable]': 'rowNode.selectable',
    '[class.selected]': 'rowNode.selected',
    '[class.hovered]': 'isRowOrActionMenuHovered'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuiBodyRowComponent implements OnInit, OnDestroy {
  @HostBinding('attr.role') role: string = 'row';

  @HostBinding('style.height.px')
  @Input()
  rowHeight: number = 0;

  @Input() rowNode: FuiDatagridRowNode;
  @Input() hasActionMenu: boolean;

  @ContentChildren(FuiBodyCellComponent) cells: QueryList<FuiBodyCellComponent>;

  isRowOrActionMenuHovered: boolean = false;

  private _isFirstRow: boolean = false;
  private _rowIndex: number = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    @Self() public elementRef: ElementRef,
    private cd: ChangeDetectorRef,
    private rowRendererService: RowRendererService,
    private optionsWrapperService: FuiDatagridOptionsWrapperService,
    private eventService: FuiDatagridEventService,
    private actionMenuService: FuiActionMenuService,
    private rowSelectionService: FuiDatagridRowSelectionService
  ) {}

  get isFirstRow(): boolean {
    return this._isFirstRow;
  }

  @HostBinding('class.fui-datagrid-first-row')
  set isFirstRow(value: boolean) {
    this._isFirstRow = value;
    if (this.rowNode) {
      this.rowNode.setIsFirstRow(value);
    }
    this.cd.markForCheck();
  }

  @Input('rowIndex')
  set rowIndex(index) {
    this._rowIndex = index;
    this.isFirstRow = this._rowIndex === 0;
    if (this.rowNode) {
      this.rowNode.setRowIndex(index);
    }
    if (this.rowRendererService) {
      this.rowRendererService.storeRowElement(this.rowIndex, this);
    }
    this.cd.markForCheck();
  }

  get rowIndex(): number {
    return this._rowIndex;
  }

  @HostListener('click', ['$event.target'])
  onRowClick(target) {
    const evt: RowClickedEvent = {
      rowNode: this.rowNode,
      type: FuiDatagridEvents.EVENT_ROW_CLICKED
    };
    this.eventService.dispatchEvent(evt);

    // If we click on a checkbox/radio, we don't want to handle the row selection here.
    // Instead, we defer row selection to the form controls.
    if (FeruiUtils.getClosestDomElement(target, 'fui-datagrid-selection-box')) {
      return;
    }
    if (this.rowNode.rowSelection && this.rowNode.selectable && !this.optionsWrapperService.suppressRowClickSelection()) {
      this.rowNode.setSelected(!this.rowNode.selected);
    }
  }

  @HostListener('dblclick')
  onRowDblClick() {
    const evt: RowDoubleClickedEvent = {
      rowNode: this.rowNode,
      type: FuiDatagridEvents.EVENT_ROW_DOUBLE_CLICKED
    };
    this.eventService.dispatchEvent(evt);
  }

  @HostListener('mouseenter')
  onRowHovered() {
    if (this.hasActionMenu) {
      this.actionMenuService.setSelectedRowContext(
        FuiActionMenuUtils.getContextForActionMenu(this.rowNode, this.elementRef.nativeElement.offsetTop)
      );
      this.actionMenuService.isActionMenuVisible = true;
    }
  }

  ngOnInit(): void {
    this.rowNode.setRowHeight(this.rowHeight);

    if (!FeruiUtils.isNullOrUndefined(this.rowNode.rowSelection)) {
      this.rowNode.setSelected(this.rowSelectionService.isNodeSelected(this.rowNode.id));
    }

    // If we have enabled the action menu feature, we add some watchers to position/update the action menu context.
    if (this.hasActionMenu) {
      this.subscriptions.push(
        this.actionMenuService.actionMenuVisibilityChange().subscribe(this.onActionMenuVisibilityChange.bind(this)),
        this.actionMenuService.actionMenuOpenChange().subscribe(this.onActionMenuOpenChange.bind(this)),
        this.actionMenuService.actionMenuHoverChange().subscribe(this.onActionMenuHoverChange.bind(this))
      );
    }
  }

  ngOnDestroy(): void {
    this.rowRendererService.removeRowElement(this.rowIndex);
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = null;
  }

  getCellForCol(column: Column): FuiBodyCellComponent {
    return this.cells.find(cell => cell.column.getColId() === column.getColId());
  }

  isRowError(): boolean {
    return !!this.rowNode.error;
  }

  private onActionMenuHoverChange(isHovered: boolean): void {
    const isOpen: boolean = this.actionMenuService.isActionMenuDropdownOpen;
    const isVisible: boolean = this.actionMenuService.isActionMenuVisible;
    const context = this.actionMenuService.currentlySelectedRowContext || null;
    if (context) {
      this.isRowOrActionMenuHovered = this.rowIndex === context.rowNode.rowIndex && (isHovered || isOpen || isVisible);
    } else {
      this.isRowOrActionMenuHovered = false;
    }
    this.cd.markForCheck();
  }

  private onActionMenuOpenChange(isOpen: boolean): void {
    const isVisible: boolean = this.actionMenuService.isActionMenuVisible;
    const context = this.actionMenuService.currentlySelectedRowContext || null;
    if (context) {
      this.isRowOrActionMenuHovered = this.rowIndex === context.rowNode.rowIndex && (isOpen || isVisible);
    } else {
      this.isRowOrActionMenuHovered = false;
    }
    this.cd.markForCheck();
  }

  private onActionMenuVisibilityChange(isVisible: boolean): void {
    const context = this.actionMenuService.currentlySelectedRowContext || null;
    if (context) {
      this.isRowOrActionMenuHovered = this.rowIndex === context.rowNode.rowIndex && isVisible;
    } else {
      this.isRowOrActionMenuHovered = false;
    }
    this.cd.markForCheck();
  }
}
