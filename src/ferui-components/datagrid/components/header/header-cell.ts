import { Subscription } from 'rxjs';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Self,
  TemplateRef,
  ViewChild
} from '@angular/core';

import { FeruiUtils } from '../../../utils/ferui-utils';
import { ColumnEvent, ColumnResizedEvent, ColumnVisibleEvent, FuiDatagridEvents } from '../../events';
import { ColumnKeyCreator } from '../../services/column-key-creator';
import { FuiDatagridDragAndDropService } from '../../services/datagrid-drag-and-drop.service';
import { FuiDatagridOptionsWrapperService } from '../../services/datagrid-options-wrapper.service';
import { DatagridResizeParams, FuiDatagridResizeService } from '../../services/datagrid-resize.service';
import { FuiDatagridSortService } from '../../services/datagrid-sort.service';
import { DatagridStateService } from '../../services/datagrid-state.service';
import { FuiDatagridService } from '../../services/datagrid.service';
import { FuiDatagridEventService } from '../../services/event.service';
import { FuiColumnService } from '../../services/rendering/column.service';
import { FuiDatagridRowSelectionService } from '../../services/selection/datagrid-row-selection.service';
import { FuiColumnDefinitions } from '../../types/column-definitions';
import { DragItem, DragSource, DragSourceType } from '../../types/drag-and-drop';
import { FuiRowModel } from '../../types/row-model.enum';
import { FuiRowSelectionEnum } from '../../types/row-selection.enum';
import { FuiDatagridSortDirections } from '../../types/sort-directions.enum';
import { FuiDatagridBodyDropTarget } from '../entities/body-drop-target';
import { Column } from '../entities/column';
import { RowModel } from '../row-models/row-model';

export interface FuiDatagridSelectAllOption {
  action: string;
  label: string;
}

@Component({
  selector: 'fui-datagrid-header-cell',
  template: `
    <div class="fui-datagrid-header-label" #headerLabel role="presentation" unselectable="on" (click)="onHeaderClick($event)">
      <div class="fui-datagrid-header-text" role="presentation" unselectable="on" #datagridHeaderText>
        <div
          class="fui-datagrid-select-all-options-wrapper"
          *ngIf="rowSelection === rowSelectionEnum.MULTIPLE && column.isCheckboxSelection() && hasHeaderSelect()"
        >
          <fui-checkbox-wrapper class="fui-datagrid-selection-box">
            <input
              type="checkbox"
              fuiCheckbox
              name="datagrid-select-all"
              [indeterminate]="partialSelection"
              [(ngModel)]="selectAll"
              (ngModelChange)="selectRows()"
            />
          </fui-checkbox-wrapper>

          <fui-dropdown [forceClose]="forceDropdownClose" [fuiCloseMenuOnItemClick]="true" class="fui-datagrid-select-all-select">
            <button class="btn btn-link" fuiDropdownTrigger>
              <clr-icon class="fui-caret" shape="fui-caret down"></clr-icon>
            </button>
            <fui-dropdown-menu
              [class.fui-datagrid-dropdown]="true"
              fuiPosition="bottom-left"
              [appendTo]="dropdownAppendTo"
              *fuiIfOpen
            >
              <div
                *ngFor="let option of selectAllOptions"
                [class.disabled]="getDisableStateFor(option)"
                fuiDropdownItem
                (click)="!getDisableStateFor(option) && selectRows(option)"
              >
                {{ option.label }}
              </div>
            </fui-dropdown-menu>
          </fui-dropdown>
        </div>
        <ng-container [ngTemplateOutlet]="defaultCellRenderer" [ngTemplateOutletContext]="columnDefinition"></ng-container>
        <ng-template #defaultCellRenderer let-label="headerName">{{ label }}</ng-template>
      </div>
      <span class="fui-datagrid-sort" *ngIf="displayAscDescIcon() === fuiDatagridSortDirections.ASC">
        <ng-container [ngTemplateOutlet]="sortAscIcon"></ng-container>
      </span>
      <span class="fui-datagrid-sort" *ngIf="displayAscDescIcon() === fuiDatagridSortDirections.DESC">
        <ng-container [ngTemplateOutlet]="sortDescIcon"></ng-container>
      </span>
      <span class="fui-datagrid-sort-badge" *ngIf="displayAscDescIcon() !== fuiDatagridSortDirections.NONE && isMultisort()">
        <span class="badge badge-secondary">
          {{ column.sortOrder + 1 }}
        </span>
      </span>
    </div>

    <div class="fui-datagrid-header-cell-resize" (dblclick)="onColumnAutoResize()" #headerResize role="presentation"></div>

    <ng-template #sortAscIcon>
      <clr-icon class="fui-datagrid-sort-asc" shape="fui-arrow-thin up"></clr-icon>
    </ng-template>
    <ng-template #sortDescIcon>
      <clr-icon class="fui-datagrid-sort-desc" shape="fui-arrow-thin down"></clr-icon>
    </ng-template>
  `,
  host: {
    '[class.fui-datagrid-header-cell]': 'true',
    '[class.fui-datagrid-column-visible]': 'column.isVisible()',
    '[class.with-animation]': 'true',
    '[class.moving]': 'column.isMoving()',
    '[class.dragging]': 'isDragging()',
    '[class.lock-position]': 'column.isLockPosition()',
    '[class.checkbox-column]': 'column.isCheckboxSelection()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FuiDatagridResizeService, Column]
})
export class FuiHeaderCellComponent extends FuiDatagridBodyDropTarget implements OnInit, OnDestroy, AfterViewInit {
  @Output() readonly onResize: EventEmitter<ColumnResizedEvent> = new EventEmitter<ColumnResizedEvent>();
  @Output() readonly changeVisibility: EventEmitter<ColumnVisibleEvent> = new EventEmitter<ColumnVisibleEvent>();
  @Output() readonly changeWidth: EventEmitter<ColumnEvent> = new EventEmitter<ColumnEvent>();
  @Output() readonly changeLeft: EventEmitter<ColumnEvent> = new EventEmitter<ColumnEvent>();

  fuiDatagridSortDirections = FuiDatagridSortDirections;
  colId: string;
  selectAll: boolean = false;
  partialSelection: boolean = false;
  rowSelection: FuiRowSelectionEnum;
  selectAllOptions: FuiDatagridSelectAllOption[] = [];
  rowSelectionEnum: typeof FuiRowSelectionEnum = FuiRowSelectionEnum;
  forceDropdownClose: boolean = false;
  dropdownAppendTo: string = 'body';

  @Input() columnDefinition: FuiColumnDefinitions;

  @ViewChild('datagridHeaderText') datagridHeaderText: ElementRef;
  @ViewChild('headerLabel') headerLabel: ElementRef;
  @ViewChild('headerResize') headerResize: ElementRef;
  @ViewChild('sortAscIcon') sortAscIcon: TemplateRef<any>;
  @ViewChild('sortDescIcon') sortDescIcon: TemplateRef<any>;

  public readonly element: HTMLElement;

  private destroyFunctions: (() => void)[] = [];
  private subscriptions: Subscription[] = [];
  private dragging: boolean = false;
  private dragSource: DragSource;

  private _role: string = 'presentation';
  private _width: number = 0;
  private _minWidth: number = 0;
  private _maxWidth: number = null;
  private _left: number = 0;
  private _lineHeight: number = null;
  private _sortable: boolean;
  private _colIndex: number;
  private _columns: Column[];
  private _rowHeight: number;

  constructor(
    @Self() elementRef: ElementRef,
    private cd: ChangeDetectorRef,
    private sortService: FuiDatagridSortService,
    private resizeService: FuiDatagridResizeService,
    private eventService: FuiDatagridEventService,
    private columnKeyCreator: ColumnKeyCreator,
    public column: Column,
    private rowModel: RowModel,
    private stateService: DatagridStateService,
    private optionsWrapperService: FuiDatagridOptionsWrapperService,
    private rowSelectionService: FuiDatagridRowSelectionService,
    dragAndDropService: FuiDatagridDragAndDropService,
    columnService: FuiColumnService,
    gridPanel: FuiDatagridService
  ) {
    super(gridPanel.eHeaderViewport, dragAndDropService, columnService, gridPanel);
    this.element = elementRef.nativeElement;
  }

  get colIndex(): number {
    return this._colIndex;
  }

  @Input()
  set colIndex(value: number) {
    if (value !== this._colIndex) {
      this._colIndex = value;
      this.column.colIndex = this._colIndex;
      this.cd.markForCheck();
    }
  }

  get columns(): Array<Column> {
    return this._columns;
  }

  @Input()
  set columns(value: Array<Column>) {
    if (value !== this._columns) {
      this._columns = value;
      this.cd.markForCheck();
    }
  }

  get rowHeight(): number {
    return this._rowHeight;
  }

  @Input()
  set rowHeight(value: number) {
    if (value !== this._rowHeight) {
      this._rowHeight = value;
      this.cd.markForCheck();
    }
  }

  @HostBinding('attr.role')
  get role(): string {
    return this._role;
  }

  set role(value: string) {
    if (value !== this._role) {
      this._role = value;
      this.cd.markForCheck();
    }
  }

  @HostBinding('style.width.px')
  get width(): number {
    return this._width;
  }

  set width(value: number) {
    if (value !== this._width) {
      this._width = value;
      this.column.setActualWidth(this._width);
      this.cd.markForCheck();
    }
  }

  @HostBinding('style.min-width.px')
  get minWidth(): number {
    return this._minWidth;
  }

  set minWidth(value: number) {
    if (value !== this._minWidth) {
      this._minWidth = value;
      this.cd.markForCheck();
    }
  }

  @HostBinding('style.max-width.px')
  get maxWidth(): number {
    return this._maxWidth;
  }

  set maxWidth(value: number) {
    if (value !== this._maxWidth) {
      this._maxWidth = value;
      this.cd.markForCheck();
    }
  }

  @HostBinding('style.left.px')
  get left(): number {
    return this._left;
  }

  set left(value: number) {
    if (value !== this._left) {
      this._left = value;
      this.cd.markForCheck();
    }
  }

  @HostBinding('style.line-height.px')
  get lineHeight(): number {
    return this._lineHeight;
  }

  set lineHeight(value: number) {
    if (value !== this._lineHeight) {
      this._lineHeight = value;
      this.cd.markForCheck();
    }
  }

  @HostBinding('class.sortable')
  get sortable(): boolean {
    return this._sortable;
  }

  set sortable(value: boolean) {
    if (value !== this._sortable) {
      this._sortable = value;
      this.cd.markForCheck();
    }
  }

  ngOnInit(): void {
    // We update the Column.
    this.colId = this.columnKeyCreator.getUniqueKey(this.columnDefinition.colId, this.columnDefinition.field);
    this.column.initialise(this.columnDefinition, this.colId);
    this.column.colIndex = this.colIndex;
    this.column.nativeElement = this.element;
    this.columnService.addColumn(this.column);

    this.sortable = this.columnDefinition.sortable === true;
    this.left = this.column.getLeft();
    this.width = this.column.getActualWidth();
    this.minWidth = this.column.getMinWidth();
    this.maxWidth = this.column.getMaxWidth();

    if (this.rowHeight) {
      this.lineHeight = this.rowHeight - 1;
    }

    if (!FeruiUtils.isNullOrUndefined(this.optionsWrapperService.getRowSelection())) {
      this.rowSelection = this.optionsWrapperService.getRowSelection();
      if (this.rowSelection === FuiRowSelectionEnum.MULTIPLE) {
        const options: FuiDatagridSelectAllOption[] = [];
        if (this.isClientSideRowModel()) {
          options.push({ action: 'selectAll', label: 'All' });
        } else if (this.rowModel.isServerSideRowModel()) {
          options.push({ action: 'selectPage', label: 'Current page' });
          options.push({ action: 'deselectPage', label: 'Deselect current page' });
        } else {
          options.push({ action: 'selectVisible', label: 'Loaded pages' });
          options.push({ action: 'deselectPage', label: 'Deselect loaded pages' });
        }
        options.push({ action: 'selectNone', label: 'None' });

        this.selectAllOptions = options;
        this.subscriptions.push(
          this.eventService.listenToEvent(FuiDatagridEvents.EVENT_SELECTION_CHANGED).subscribe(() => {
            this.selectAll = this.rowSelectionService.getSelectionCount() > 0;
            this.partialSelection = this.rowSelectionService.isPartialSelection();
            this.cd.markForCheck();
          }),
          this.eventService.listenToEvent(FuiDatagridEvents.EVENT_FILTER_CHANGED).subscribe(() => {
            this.selectAll = this.rowSelectionService.getSelectionCount() > 0;
            this.partialSelection = this.rowSelectionService.isPartialSelection();
            if (this.rowModel.hasFilters()) {
              options.splice(
                2,
                0,
                { action: 'selectFiltered', label: 'Select filtered' },
                { action: 'deselectFiltered', label: 'Deselect filtered' }
              );
            } else {
              options.splice(2, 2);
            }
            this.cd.markForCheck();
          })
        );
      }
    }

    // If the Datagrid is within a FerUI modal, we append the dropdown menu within the modal instead of the body.
    if (this.rowSelection === this.rowSelectionEnum.MULTIPLE && this.column.isCheckboxSelection() && this.hasHeaderSelect()) {
      this.dropdownAppendTo = FeruiUtils.getClosestDomElement(this.element, 'fui-modal-anchor')
        ? '.fui-modal-anchor.fui-modal-open'
        : 'body';
    }

    this.cd.markForCheck();

    this.subscriptions.push(
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_COLUMN_RESIZED).subscribe(columnEvent => {
        const ev: ColumnResizedEvent = columnEvent as ColumnResizedEvent;
        if (ev && ev.column && ev.column.getColId() === this.column.getColId()) {
          this.updateWidth(ev.column);
          this.onResize.emit(ev);
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_WIDTH_CHANGED).subscribe(columnEvent => {
        const ev: ColumnEvent = columnEvent as ColumnEvent;
        if (ev && ev.column && ev.column.getColId() === this.column.getColId()) {
          this.updateWidth(ev.column);
          this.changeWidth.emit(ev);
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_LEFT_CHANGED).subscribe(columnEvent => {
        const ev: ColumnEvent = columnEvent as ColumnEvent;
        if (ev && ev.column && ev.column.getColId() === this.column.getColId()) {
          this.left = ev.column.getLeft();
          this.colIndex = ev.column.colIndex;
          this.changeLeft.emit(ev);
          this.cd.markForCheck();
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_VISIBLE_CHANGED).subscribe(columnEvent => {
        const ev: ColumnVisibleEvent = columnEvent as ColumnVisibleEvent;
        if (ev && ev.column && ev.column.getColId() === this.column.getColId()) {
          this.changeVisibility.emit(ev);
          this.cd.markForCheck();
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_SORT_COLUMN_CHANGED).subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions = undefined;
    }
    if (this.destroyFunctions.length > 0) {
      this.dragAndDropService.removeDropTarget(this);
      this.destroyFunctions.forEach(func => func());
    }
  }

  ngAfterViewInit(): void {
    this.setupMove(this.headerLabel.nativeElement);
    this.setupResize(this.headerResize.nativeElement);
  }

  /**
   * Get disable state for select all option menu.
   * @param option
   */
  getDisableStateFor(option: FuiDatagridSelectAllOption): boolean {
    const isNoneSelectable: boolean = (option.action === 'selectNone' || option.action === 'deselectPage') && !this.selectAll;
    const isAllSelectable: boolean =
      (option.action === 'selectAll' || option.action === 'selectPage' || option.action === 'selectVisible') &&
      this.selectAll &&
      !this.partialSelection;
    const isSelectFilteredSelectable: boolean =
      option.action === 'selectFiltered' && this.hasFilters() && this.selectAll && !this.partialSelection;
    const isDeselectFilteredSelectable: boolean = option.action === 'deselectFiltered' && this.hasFilters() && !this.selectAll;
    return isNoneSelectable || isAllSelectable || isSelectFilteredSelectable || isDeselectFilteredSelectable;
  }

  /**
   * Check if there are active filters.
   */
  hasFilters(): boolean {
    return this.rowModel.hasFilters();
  }

  /**
   * Check if we want to display the header checkbox or not.
   */
  hasHeaderSelect(): boolean {
    return this.optionsWrapperService.hasHeaderSelect();
  }

  /**
   * Select rows callback. This is called when you select an option or just check the checkbox.
   * @param option
   */
  selectRows(option?: FuiDatagridSelectAllOption): void {
    if (!option) {
      option = this.hasFilters()
        ? this.selectAll
          ? this.selectAllOptions.find(op => {
              return op.action === 'selectFiltered';
            })
          : this.selectAllOptions.find(op => {
              return op.action === 'deselectFiltered';
            })
        : this.selectAll
        ? this.isClientSideRowModel()
          ? this.selectAllOptions.find(op => {
              return op.action === 'selectAll';
            })
          : this.selectAllOptions.find(op => {
              return op.action === 'selectPage' || op.action === 'selectVisible';
            })
        : this.isClientSideRowModel()
        ? this.selectAllOptions.find(op => {
            return op.action === 'selectNone';
          })
        : this.selectAllOptions.find(op => {
            return op.action === 'deselectPage';
          });
    }

    switch (option.action) {
      case 'selectNone':
        this.rowSelectionService.deselectAll();
        break;
      case 'selectAll':
      case 'selectPage':
      case 'selectVisible':
        this.rowSelectionService.selectAll();
        break;
      case 'deselectFiltered':
      case 'deselectPage':
        this.rowSelectionService.deselectFiltered();
        break;
      case 'selectFiltered':
        this.rowSelectionService.selectFiltered();
        break;
      default:
        break;
    }
    this.selectAll = this.rowSelectionService.getSelectionCount() > 0;
    this.partialSelection = this.selectAll && this.rowSelectionService.isPartialSelection();
    this.onSelectAllRowsChange();
    this.cd.markForCheck();
  }

  /**
   * Get the datagrid unique ID.
   */
  getDatagridId(): string {
    return '#' + this.optionsWrapperService.getDatagridId();
  }

  onColumnAutoResize() {
    this.columnService.autoSizeColumn(this.column, this.gridPanel.getCenterContainer());
  }

  displayAscDescIcon(): FuiDatagridSortDirections {
    const hasCol = this.sortService.sortingColumns.findIndex(col => {
      return col.getColId() === this.column.getColId();
    });
    if (hasCol > -1 && this.column.getSort() === FuiDatagridSortDirections.ASC) {
      return FuiDatagridSortDirections.ASC;
    } else if (hasCol > -1 && this.column.getSort() === FuiDatagridSortDirections.DESC) {
      return FuiDatagridSortDirections.DESC;
    } else {
      return FuiDatagridSortDirections.NONE;
    }
  }

  isClientSideRowModel(): boolean {
    return this.optionsWrapperService.rowDataModel === FuiRowModel.CLIENT_SIDE;
  }

  isMultisort(): boolean {
    return this.sortService.isMultiSort();
  }

  onHeaderClick(event) {
    // If we can't sort this column, we just return void.
    if (!this.column.sortable) {
      return;
    }

    if (!this.rowModel.isClientSideRowModel()) {
      this.stateService.setLoading();
    }

    // TODO: Make the shift key a variable that can be changed by the developer in grid definition.
    const eventKey = event.shiftKey;

    if (eventKey && !this.column.isSorted()) {
      this.column.sortOrder = this.sortService.getNextSortOrder();
    }
    const dirIndex: number = this.sortService.sortList().indexOf(this.column.getSort());
    // The sort order is asc, we want to get the next type of ordering when we click on the header
    this.column.setSort(this.sortService.getSortOrderByIndex(dirIndex === 2 ? 0 : dirIndex + 1));
    if (eventKey) {
      this.sortService.updateColumn(this.column);
    } else {
      this.sortService.resetColumnsSortOrder();
      this.sortService.setSortForOtherColumnThan(this.column, FuiDatagridSortDirections.NONE);
      this.sortService.sortingColumns = [this.column];
    }
  }

  isDragging() {
    return this.dragging;
  }

  /**
   * Each time we are triggering the option change we make sure that the dropdown menu is closed after the click.
   * @private
   */
  private onSelectAllRowsChange(): void {
    // Since we are disabling the option at the same time we're clicking on it the dropdown popover doesn't get closed.
    // We then force the closure after row selection changes and reset the value to its initial value 100ms after.
    this.forceDropdownClose = true;
    setTimeout(() => {
      this.forceDropdownClose = false;
      this.cd.markForCheck();
    }, 100);
  }

  private getInnerText(): string {
    return this.datagridHeaderText.nativeElement.innerText;
  }

  private updateWidth(column: Column) {
    this.width = column.getActualWidth();
    this.cd.markForCheck();
  }

  private setupResize(eHeaderResizeCell: HTMLElement) {
    if (!this.column.isResizable()) {
      return;
    }

    if (eHeaderResizeCell) {
      const params: DatagridResizeParams = {
        eElement: eHeaderResizeCell,
        minWidth: this.minWidth,
        maxWidth: this.maxWidth,
        column: this.column,
        columnService: this.columnService
      };
      this.resizeService.addResizeFor(params);
      this.addDestroyFunc(() => this.resizeService.removeResize());
    }
  }

  private setupMove(eHeaderCell: HTMLElement): void {
    const suppressMove = this.column.isLockPosition();

    if (suppressMove) {
      return;
    }

    if (eHeaderCell) {
      this.dragSource = {
        type: DragSourceType.HEADER,
        eElement: eHeaderCell,
        dragSourceDropTarget: this,
        dragItemCallback: () => this.createDragItem(),
        dragItemName: () => this.getInnerText(),
        dragStarted: () => this.setColumnsMoving(true),
        dragStopped: () => this.setColumnsMoving(false)
      };
      this.dragAndDropService.addDragSource(this.dragSource, true);
      this.addDestroyFunc(() => this.dragAndDropService.removeDragSource(this.dragSource));
    }
  }

  private setColumnsMoving(value: boolean) {
    this.columnService.getVisibleColumns().forEach(column => {
      column.setMoving(value);
    });
    this.dragging = value;
    this.cd.markForCheck();
  }

  private createDragItem(): DragItem {
    const visibleState: { [key: string]: boolean } = {};
    visibleState[this.column.getId()] = this.column.isVisible();

    return {
      columns: [this.column],
      visibleState: visibleState
    };
  }

  private addDestroyFunc(func: () => void): void {
    this.destroyFunctions.push(func);
  }
}
