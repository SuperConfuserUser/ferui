import { isArray } from 'util';

import { Observable, Subscription, isObservable } from 'rxjs';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Self,
  TemplateRef,
  TrackByFunction,
  ViewChild
} from '@angular/core';

import { HilitorService } from '../../hilitor/hilitor';
import { DomObserver, ObserverInstance } from '../../utils/dom-observer/dom-observer';
import { FeruiUtils } from '../../utils/ferui-utils';
import { ScrollbarHelper } from '../../utils/scrollbar-helper/scrollbar-helper.service';
import { VirtualScrollerDefaultOptions } from '../../virtual-scroller/types/virtual-scroller-interfaces';
import { FuiVirtualScrollerComponent } from '../../virtual-scroller/virtual-scroller';
import {
  VIRTUAL_SCROLLER_DEFAULT_OPTIONS,
  VIRTUAL_SCROLLER_DEFAULT_OPTIONS_FACTORY
} from '../../virtual-scroller/virtual-scroller-factory';
import { Constants } from '../constants';
import {
  CellClickedEvent,
  CellContextMenuEvent,
  CellDoubleClickedEvent,
  ColumnEvent,
  ColumnResizedEvent,
  ColumnVisibleEvent,
  DatagridOnResizeEvent,
  FuiDatagridEvents,
  FuiModelUpdatedEvent,
  FuiPageChangeEvent,
  RowClickedEvent,
  RowDataChanged,
  RowDoubleClickedEvent,
  RowSelectedEvent,
  SelectionChangedEvent,
  ServerSideRowDataChanged
} from '../events';
import { FuiActionMenuService } from '../services/action-menu/action-menu.service';
import { ColumnKeyCreator } from '../services/column-key-creator';
import { FuiDatagridApiService } from '../services/datagrid-api.service';
import { FuiDatagridColumnApiService } from '../services/datagrid-column-api.service';
import { FuiDatagridDragAndDropService } from '../services/datagrid-drag-and-drop.service';
import { FuiDragEventsService } from '../services/datagrid-drag-events.service';
import { FuiDatagridFilterService } from '../services/datagrid-filter.service';
import { FuiDatagridOptionsWrapperService } from '../services/datagrid-options-wrapper.service';
import { FuiDatagridSortService } from '../services/datagrid-sort.service';
import { DatagridStateEnum, DatagridStateService } from '../services/datagrid-state.service';
import { FuiDatagridService } from '../services/datagrid.service';
import { FuiDatagridEventService } from '../services/event.service';
import { CsvCreator } from '../services/exporter/csv-creator';
import { Downloader } from '../services/exporter/downloader';
import { BaseExportParams } from '../services/exporter/export-params';
import { GridSerializer } from '../services/exporter/grid-serializer';
import { AutoWidthCalculator } from '../services/rendering/autoWidthCalculator';
import { FuiColumnService } from '../services/rendering/column.service';
import { FuiCssClassApplierService } from '../services/rendering/css-class-applier.service';
import { HeaderRendererService } from '../services/rendering/header-renderer.service';
import { RowRendererService } from '../services/rendering/row-renderer.service';
import { DatagridRowNodeManagerService } from '../services/row/datagrid-row-node-manager.service';
import { FuiDatagridRowSelectionService } from '../services/selection/datagrid-row-selection.service';
import { FuiDatagridBodyRowContext } from '../types/body-row-context';
import { FuiColumnDefinitions } from '../types/column-definitions';
import { GetRowNodeIdFunc, IsRowSelectable } from '../types/grid-options';
import { FuiPagerPage } from '../types/pager';
import { FuiRowModel } from '../types/row-model.enum';
import { FuiRowSelectionEnum } from '../types/row-selection.enum';
import { IServerSideDatasource } from '../types/server-side-row-model';
import { ColumnUtilsService } from '../utils/column-utils.service';
import { DatagridUtils } from '../utils/datagrid-utils';

import { Column } from './entities/column';
import { FuiDatagridRowNode } from './entities/fui-datagrid-row-node';
import { FuiDatagridFiltersComponent } from './filters/filters';
import { FuiDatagridPagerComponent } from './pager/pager';
import { FuiDatagridClientSideRowModel } from './row-models/client-side-row-model';
import { FuiDatagridInfinteRowModel } from './row-models/infinite/infinite-row-model';
import { RowModel } from './row-models/row-model';
import { FuiDatagridServerSideRowModel } from './row-models/server-side-row-model';

export function VIRTUAL_SCROLLER_DATAGRID_OPTIONS_FACTORY(): VirtualScrollerDefaultOptions {
  const defaults: VirtualScrollerDefaultOptions = VIRTUAL_SCROLLER_DEFAULT_OPTIONS_FACTORY();
  defaults.pxErrorValue = 1;
  return defaults;
}

@Component({
  selector: 'fui-datagrid',
  template: `
    <fui-datagrid-filters
      [displayFilters]="withFilters"
      [displayColumnVisibility]="withColumnVisibility"
      [hidden]="!withHeader"
      (heightChange)="onFilterPagerHeightChange()"
    >
      <ng-content></ng-content>
    </fui-datagrid-filters>

    <div class="fui-datagrid-root-wrapper" [style.height]="rootWrapperHeight" #rootWrapper>
      <div class="fui-datagrid-root-body-wrapper">
        <div class="fui-datagrid-root-body" role="grid" unselectable="on">
          <fui-datagrid-header unselectable="on" [style.height.px]="rowHeight" [style.min-height.px]="rowHeight">
            <fui-datagrid-header-viewport>
              <fui-datagrid-header-container [style.width.px]="totalWidth + scrollSize">
                <fui-datagrid-header-row [style.width.px]="totalWidth + scrollSize">
                  <fui-datagrid-header-cell
                    unselectable="on"
                    *ngFor="let hColumn of columns; index as i; trackBy: columnTrackByFn"
                    [colIndex]="i"
                    (changeVisibility)="onColumnChangeVisibility($event)"
                    (changeWidth)="onColumnChangeWidth($event)"
                    (onResize)="onColumnResize($event)"
                    [rowHeight]="rowHeight"
                    [columnDefinition]="hColumn"
                  ></fui-datagrid-header-cell>
                </fui-datagrid-header-row>
              </fui-datagrid-header-container>
            </fui-datagrid-header-viewport>
          </fui-datagrid-header>

          <fui-datagrid-body
            [isFixedheight]="fixedHeight"
            [id]="virtualBodyId"
            [rowHeight]="rowHeight"
            [headerHeight]="rowHeight"
            [hasActionMenu]="!!actionMenuTemplate"
            unselectable="on"
          >
            <fui-virtual-scroller
              #scroll
              class="fui-datagrid-body-viewport"
              [hideXScrollbar]="true"
              [bufferAmount]="virtualScrollBufferAmount"
              (verticalScroll)="onVerticalScroll($event)"
              (horizontalScroll)="onCenterViewportScroll()"
              [items]="displayedRows"
              role="presentation"
              unselectable="on"
            >
              <fui-datagrid-action-menu
                *ngIf="actionMenuTemplate"
                [actionMenuTemplate]="actionMenuTemplate"
                [style.height.px]="rowHeight - 2"
                [maxDisplayedRows]="maxDisplayedRows"
                fuiVirtualScrollClipperContent
              ></fui-datagrid-action-menu>

              <fui-datagrid-body-row
                *ngFor="let row of scroll.viewPortItems; index as idx; trackBy: rowTrackByFn"
                [rowNode]="row"
                [rowHeight]="rowHeight"
                [rowIndex]="idx + scroll.viewPortInfo.startIndexWithBuffer"
                [style.width.px]="totalWidth"
                [hasActionMenu]="!!actionMenuTemplate"
              >
                <fui-datagrid-body-cell
                  *ngFor="let column of getVisibleColumns(); trackBy: columnTrackByIndexFn"
                  unselectable="on"
                  [column]="column"
                  [rowNode]="row"
                ></fui-datagrid-body-cell>
              </fui-datagrid-body-row>
            </fui-virtual-scroller>

            <div
              class="fui-datagrid-infinite-loader"
              *ngIf="isInfiniteLoading || isServerSidePageLoading"
              [style.width]="'calc(100% - ' + scrollSize + 'px)'"
              [style.bottom.px]="0"
            ></div>
          </fui-datagrid-body>

          <div class="fui-datagrid-footer" role="presentation"></div>

          <div
            class="fui-datagrid-horizontal-scroll"
            #horizontalScrollBody
            [hidden]="!hasHorizontalScroll"
            [style.height.px]="scrollSize"
            [style.min-height.px]="scrollSize"
            [style.max-height.px]="scrollSize"
          >
            <div
              class="fui-datagrid-body-horizontal-scroll-viewport"
              #horizontalScrollViewport
              (scroll)="onFakeHorizontalScroll()"
              [style.height.px]="scrollSize"
              [style.min-height.px]="scrollSize"
              [style.max-height.px]="scrollSize"
            >
              <div
                class="fui-datagrid-body-horizontal-scroll-container"
                #horizontalScrollContainer
                [style.width.px]="totalWidth"
                [style.height.px]="scrollSize"
                [style.min-height.px]="scrollSize"
                [style.max-height.px]="scrollSize"
              ></div>
            </div>
            <div
              class="fui-horizontal-right-spacer"
              [hidden]="!hasVerticallScroll"
              [style.width.px]="scrollSize"
              [style.min-width.px]="scrollSize"
              [style.max-width.px]="scrollSize"
            ></div>
          </div>
        </div>
      </div>
      <div class="fui-datagrid-pager-wrapper"></div>
    </div>
    <fui-datagrid-pager
      [withFooterPager]="withFooterPager"
      [withFooterItemPerPage]="withFooterItemPerPage"
      [hidden]="!withFooter"
      [rowDataModel]="rowDataModel"
      (pagerReset)="pagerReset($event)"
      (heightChange)="onFilterPagerHeightChange()"
      (pagerItemPerPage)="onPagerItemPerPageChange($event)"
      [itemPerPage]="maxDisplayedRows"
    >
    </fui-datagrid-pager>

    <clr-icon #iconDelete class="fui-datagrid-dragdrop-icon fui-datagrid-dragdrop-delete" shape="fui-trash"></clr-icon>
    <clr-icon #iconMove class="fui-datagrid-dragdrop-icon fui-datagrid-dragdrop-move" shape="fui-dragndrop"></clr-icon>
    <clr-icon #iconLeft class="fui-datagrid-dragdrop-icon fui-datagrid-dragdrop-left" shape="fui-arrow-thin left"></clr-icon>
    <clr-icon #iconRight class="fui-datagrid-dragdrop-icon fui-datagrid-dragdrop-right" shape="fui-arrow-thin right"></clr-icon>
  `,
  host: {
    '[class.fui-datagrid]': 'true',
    '[class.fui-datagrid-has-vertical-scroll]': 'hasVerticallScroll',
    '[class.fui-datagrid-has-filter]': 'withHeader && datagridFilters !== undefined',
    '[class.fui-datagrid-has-pager]': 'withFooter && datagridPager !== undefined',
    '[class.fui-datagrid-without-header]': '!withHeader',
    '[class.fui-datagrid-without-footer]': '!withFooter',
    '[class.fui-datagrid-rounded-corners]': 'roundedCorners'
  },
  providers: [
    { provide: VIRTUAL_SCROLLER_DEFAULT_OPTIONS, useFactory: VIRTUAL_SCROLLER_DATAGRID_OPTIONS_FACTORY },
    DatagridRowNodeManagerService,
    AutoWidthCalculator,
    HeaderRendererService,
    ColumnKeyCreator,
    ColumnUtilsService,
    RowRendererService,
    FuiDatagridApiService,
    FuiDatagridColumnApiService,
    FuiDatagridOptionsWrapperService,
    FuiColumnService,
    ScrollbarHelper,
    FuiDragEventsService,
    FuiDatagridDragAndDropService,
    FuiDatagridSortService,
    FuiDatagridService,
    FuiDatagridEventService,
    FuiDatagridFilterService,
    FuiDatagridClientSideRowModel,
    FuiDatagridServerSideRowModel,
    FuiDatagridInfinteRowModel,
    RowModel,
    DatagridStateService,
    HilitorService,
    FuiActionMenuService,
    Downloader,
    FuiDatagridRowSelectionService,
    FuiCssClassApplierService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuiDatagridComponent implements OnInit, OnDestroy, AfterViewInit {
  //////////// Grid outputs ////////////
  @Output() readonly onDatagridResized: EventEmitter<DatagridOnResizeEvent> = new EventEmitter<DatagridOnResizeEvent>();
  @Output() readonly onColumnWidthChange: EventEmitter<ColumnEvent> = new EventEmitter<ColumnEvent>();
  @Output() readonly onColumnResized: EventEmitter<ColumnResizedEvent> = new EventEmitter<ColumnResizedEvent>();
  @Output() readonly onColumnVisibilityChanged: EventEmitter<ColumnVisibleEvent> = new EventEmitter<ColumnVisibleEvent>();
  @Output() readonly onRowClicked: EventEmitter<RowClickedEvent> = new EventEmitter<RowClickedEvent>();
  @Output() readonly onRowDoubleClicked: EventEmitter<RowDoubleClickedEvent> = new EventEmitter<RowDoubleClickedEvent>();
  @Output() readonly onCellClicked: EventEmitter<CellClickedEvent> = new EventEmitter<CellClickedEvent>();
  @Output() readonly onCellDoubleClicked: EventEmitter<CellDoubleClickedEvent> = new EventEmitter<CellDoubleClickedEvent>();
  @Output() readonly onCellContextmenu: EventEmitter<CellContextMenuEvent> = new EventEmitter<CellContextMenuEvent>();
  @Output() readonly onRowSelected: EventEmitter<RowSelectedEvent> = new EventEmitter<RowSelectedEvent>();
  @Output() readonly onSelectionChanged: EventEmitter<SelectionChangedEvent> = new EventEmitter<SelectionChangedEvent>();
  @Output() readonly onRowDataChanged: EventEmitter<RowDataChanged> = new EventEmitter<RowDataChanged>();
  @Output() readonly onVerticalScrollChanged: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() readonly onItemPerPageChanged: EventEmitter<number> = new EventEmitter<number>();

  //////////// Default Grid params ////////////
  @Input() withHeader: boolean = true;
  @Input() withFilters: boolean = true;
  @Input() withColumnVisibility = true;
  @Input() withFooter: boolean = true;
  @Input() withFooterItemPerPage: boolean = true;
  @Input() withFooterPager: boolean = true;
  @Input() fixedHeight: boolean = false;
  @Input() roundedCorners: boolean = true;
  @Input('vsBufferAmount') virtualScrollBufferAmount: number = 10;

  @Input() columnDefs: FuiColumnDefinitions[] = [];
  @Input() defaultColDefs: FuiColumnDefinitions = {};
  @Input() trackByFn: TrackByFunction<FuiDatagridRowNode>;

  ///////////// Grid export params /////////////
  @Input() exportParams: BaseExportParams;
  ///////////// Action-menu params /////////////
  @Input() actionMenuTemplate: TemplateRef<FuiDatagridBodyRowContext>;

  @Input() set getRowNodeId(valueFn: GetRowNodeIdFunc) {
    this.datagridOptionsWrapper.setGridOption('getRowNodeId', valueFn);
  }

  @Input() set rowHeight(value: number) {
    this.datagridOptionsWrapper.setGridOption('rowHeight', FeruiUtils.isNullOrUndefined(value) ? 50 : value); // In px.
  }

  get rowHeight(): number {
    return this.datagridOptionsWrapper.getRowHeight();
  }

  @Input() set headerHeight(value: number) {
    this.datagridOptionsWrapper.setGridOption('headerHeight', FeruiUtils.isNullOrUndefined(value) ? 50 : value); // In px.
  }

  get headerHeight() {
    return this.datagridOptionsWrapper.getHeaderHeight();
  }

  ///////////// Row selection params /////////////
  // Set to true to allow multiple rows to be selected with clicks. For example, if you click to select one row and then click to
  // select another row, the first row will stay selected as well. Clicking a selected row in this mode will deselect the row.
  // This is useful for touch devices where Ctrl and Shift clicking is not an option.
  @Input() set rowMultiSelectWithClick(value: boolean) {
    this.datagridOptionsWrapper.setGridOption('rowMultiSelectWithClick', FeruiUtils.isNullOrUndefined(value) ? true : value);
  }

  // If true, rows won't be selected when clicked. Use, for example, when you want checkbox selection,
  // and don't want to also select the row when the row is clicked.
  @Input() set suppressRowClickSelection(value: boolean) {
    this.datagridOptionsWrapper.setGridOption('suppressRowClickSelection', !FeruiUtils.isNullOrUndefined(value) ? value : false);
  }

  @Input() set checkboxSelection(value: boolean) {
    this.datagridOptionsWrapper.setGridOption('checkboxSelection', FeruiUtils.isNullOrUndefined(value) ? true : value);
  }

  @Input() set headerSelect(value: boolean) {
    this.datagridOptionsWrapper.setGridOption('headerSelect', FeruiUtils.isNullOrUndefined(value) ? true : value);
  }

  @Input() set isRowSelectable(valueFn: IsRowSelectable) {
    this.datagridOptionsWrapper.setGridOption('isRowSelectable', valueFn);
  }

  @Input() set initialSelectedRows(rowNodeSelection: FuiDatagridRowNode[] | Observable<FuiDatagridRowNode[]>) {
    if (isObservable(rowNodeSelection)) {
      if (!this._initialSelectedRowsSub) {
        this._initialSelectedRowsSub = rowNodeSelection.subscribe(rowNodes => {
          this.rowSelectionService.initSelectedNodes(rowNodes);
          this.cd.markForCheck();
        });
      }
    } else if (isArray(rowNodeSelection)) {
      this.rowSelectionService.initSelectedNodes(rowNodeSelection);
      this.cd.markForCheck();
    }
  }

  ////////////////////////////////////////////////////

  rootWrapperHeight: string = '100%';
  columns: FuiColumnDefinitions[] = [];
  totalWidth: number;
  scrollSize: number = 0;
  virtualBodyId: string = DatagridUtils.generateUniqueId('fui-body');
  gridSize: DatagridOnResizeEvent;
  @ViewChild(FuiDatagridFiltersComponent) datagridFilters: FuiDatagridFiltersComponent;
  @ViewChild(FuiDatagridPagerComponent) datagridPager: FuiDatagridPagerComponent;

  @ViewChild('horizontalScrollBody') private horizontalScrollBody: ElementRef;
  @ViewChild('horizontalScrollViewport') private horizontalScrollViewport: ElementRef;
  @ViewChild('horizontalScrollContainer') private horizontalScrollContainer: ElementRef;
  @ViewChild('rootWrapper') private rootWrapper: ElementRef;
  @ViewChild('iconMove') private iconMove: ElementRef;
  @ViewChild('iconDelete') private iconDelete: ElementRef;
  @ViewChild('iconLeft') private iconLeft: ElementRef;
  @ViewChild('iconRight') private iconRight: ElementRef;
  @ViewChild('scroll') private viewport: FuiVirtualScrollerComponent;

  private _datagridId: string = DatagridUtils.generateUniqueId('fui-datagrid');
  private _rowDataModel: FuiRowModel = FuiRowModel.CLIENT_SIDE;
  private _gridWidth: string = '100%';
  private _gridHeight: string = 'auto';
  private _displayedRows: FuiDatagridRowNode[] = [];
  private _maxDisplayedRows: number = null;
  private _maxDisplayedRowsFirstLoad: boolean = true;
  private _totalRows: number = 0;
  private _isFirstLoad: boolean = true;
  private _datasource: IServerSideDatasource = null;
  private subscriptions: Subscription[] = [];
  private domObservers: ObserverInstance[] = [];
  private highlightSearchTermsDebounce = null;
  private selectedPage: FuiPagerPage;
  private resizeEventDebounce: NodeJS.Timer;
  private bodyViewportScrollTop: number = 0;
  private defaultFiltersHeight: number = 60;
  private defaultPagersHeight: number = 50;
  private _hasVerticalScroll: boolean = false;
  private _hasHorizontalScroll: boolean = false;
  private _initialSelectedRowsSub: Subscription;

  constructor(
    @Self() private element: ElementRef,
    private cd: ChangeDetectorRef,
    private datagridOptionsWrapper: FuiDatagridOptionsWrapperService,
    private gridApi: FuiDatagridApiService,
    private columnApi: FuiDatagridColumnApiService,
    private scrollbarHelper: ScrollbarHelper,
    private sortService: FuiDatagridSortService,
    private filterService: FuiDatagridFilterService,
    private columnService: FuiColumnService,
    private gridPanel: FuiDatagridService,
    private dragAndDropService: FuiDatagridDragAndDropService,
    private eventService: FuiDatagridEventService,
    private clientSideRowModel: FuiDatagridClientSideRowModel,
    private serverSideRowModel: FuiDatagridServerSideRowModel,
    private infiniteRowModel: FuiDatagridInfinteRowModel,
    private rowModel: RowModel,
    private stateService: DatagridStateService,
    private hilitor: HilitorService,
    private actionMenuService: FuiActionMenuService,
    private exportDownloader: Downloader,
    private rowSelectionService: FuiDatagridRowSelectionService
  ) {
    // Each time we are updating the states, we need to run change detection.
    this.subscriptions.push(
      this.stateService.getCurrentStates().subscribe(() => {
        if (this.isGridLoadedOnce()) {
          this.inputGridHeight = 'refresh';
        }
        this.cd.markForCheck();
      })
    );

    // When we load the datagrid for the first time, we want to display the initial loading.
    this.stateService.setLoading();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // If the dev enable the selection feature we initialise the rowSelectionService so that we can track which rows are selected.
  // Type of row selection, set to either 'single' or 'multiple' to enable selection. 'single' will use single row selection,
  // such that when you select a row, any previously selected row gets unselected. 'multiple' allows multiple rows to be selected.
  @Input()
  set rowSelection(rowSelection: FuiRowSelectionEnum) {
    if (rowSelection !== this.rowSelection && this.rowSelectionService.initialized) {
      this.rowSelectionService.destroy();
    }
    this.datagridOptionsWrapper.setGridOption('rowSelection', rowSelection);
    if (
      !this.rowSelectionService.initialized &&
      (rowSelection === FuiRowSelectionEnum.SINGLE || rowSelection === FuiRowSelectionEnum.MULTIPLE)
    ) {
      this.rowSelectionService.init(rowSelection);
    }
  }

  get rowSelection(): FuiRowSelectionEnum {
    return this.datagridOptionsWrapper.getRowSelection();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  @Input()
  set datasource(datasource: IServerSideDatasource) {
    this._datasource = datasource;
    // If the datagrid has been initialized, we then need to refresh the datagrid when changing the datasource.
    if (this.stateService.hasState(DatagridStateEnum.INITIALIZED)) {
      this.refreshGrid(true, true);
    }
  }

  get datasource(): IServerSideDatasource {
    return this._datasource;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  @Input()
  set rowDataModel(value: FuiRowModel) {
    this._rowDataModel = value;
    this.datagridOptionsWrapper.rowDataModel = value;
    this.rowModel.rowModel = value;
    this.cd.markForCheck();
  }

  get rowDataModel(): FuiRowModel {
    return this._rowDataModel;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  @Input()
  set maxDisplayedRows(value: number) {
    // Do nothing if the value is the same.
    if (value === this._maxDisplayedRows) {
      return;
    }
    this._maxDisplayedRows = value;
    this.datagridOptionsWrapper.setGridOption('itemsPerPage', value);

    if (this.isServerSideRowModel() && this.serverSideRowModel) {
      this.serverSideRowModel.reset();
      this.serverSideRowModel.limit = value;
    } else if (this.isInfiniteServerSideRowModel() && this.infiniteRowModel) {
      this.infiniteRowModel.limit = value;
    }
    this.inputGridHeight = 'refresh';
    this._maxDisplayedRowsFirstLoad = false;
    this.cd.markForCheck();
  }

  get maxDisplayedRows(): number {
    return this._maxDisplayedRows;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  @HostBinding('attr.id')
  get datagridId(): string {
    return this._datagridId;
  }

  @Input('id')
  set inputDatagridId(value: string) {
    this._datagridId = value;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  @HostBinding('style.height')
  get gridHeight(): string {
    return this._gridHeight;
  }

  @Input('gridHeight')
  set inputGridHeight(value: string) {
    // Do nothing if the value is the same.
    if (
      ((value === 'refresh' || value === 'auto') && this.isFirstLoad()) ||
      (value !== 'refresh' && value !== 'auto' && value === this._gridHeight) ||
      !value
    ) {
      return;
    }
    if (value === 'auto' || value === 'refresh') {
      // This value correspond to two rows of 50px. We will display the loading view.
      const initialLoadHeight: number = this.isLoading && !this.stateService.hasState(DatagridStateEnum.REFRESHING) ? 100 : 0;
      const emptyDataHeight: number = !this.isLoading && this.isEmptyData ? 100 : 0;
      const maxDisplayedRows =
        this.maxDisplayedRows !== null ? this.maxDisplayedRows : this.datagridOptionsWrapper.getItemPerPage();
      const totalRows: number = this.totalRows ? this.totalRows : this.displayedRows.length;
      const scrollSize: number = this.hasHorizontalScroll ? this.scrollSize : 0;
      const serverSideRowModel: FuiDatagridServerSideRowModel = this.rowModel.getServerSideRowModel();

      const filtersComputedStyle: CSSStyleDeclaration =
        this.withHeader && this.datagridFilters ? getComputedStyle(this.datagridFilters.elementRef.nativeElement, null) : null;
      const filtersBorderTopSize: number = filtersComputedStyle
        ? parseInt(filtersComputedStyle.getPropertyValue('border-top-width'), 10)
        : 0;

      const pagerComputedStyle: CSSStyleDeclaration =
        this.withFooter && this.datagridPager ? getComputedStyle(this.datagridPager.elementRef.nativeElement, null) : null;
      const pagerBorderBottomSize: number = pagerComputedStyle
        ? parseInt(pagerComputedStyle.getPropertyValue('border-bottom-width'), 10)
        : 0;

      const rootWrapperComputedStyle: CSSStyleDeclaration = this.rootWrapper
        ? getComputedStyle(this.rootWrapper.nativeElement, null)
        : null;
      const rootWrapperBorderTopSize: number = rootWrapperComputedStyle
        ? parseInt(rootWrapperComputedStyle.getPropertyValue('border-top-width'), 10)
        : 0;
      const rootWrapperBorderBottomSize: number = rootWrapperComputedStyle
        ? parseInt(rootWrapperComputedStyle.getPropertyValue('border-bottom-width'), 10)
        : 0;

      const datagridBorderTopSize: number = filtersComputedStyle ? filtersBorderTopSize : rootWrapperBorderTopSize;
      const datagridBorderBottomSize: number = pagerComputedStyle ? pagerBorderBottomSize : rootWrapperBorderBottomSize;

      let gridHeight: number;
      if (!this.fixedHeight) {
        const minRowCount = totalRows < maxDisplayedRows ? totalRows : maxDisplayedRows;
        const fullRowsCount: number =
          serverSideRowModel && serverSideRowModel.limit
            ? minRowCount < serverSideRowModel.limit
              ? minRowCount
              : serverSideRowModel.limit
            : minRowCount;

        // When reseting the datagrid, we remove all data from the grid, and re-add them back after. So we might have 0 results
        // at some points. We still want to display the loading though, but if initialLoadHeight === 0 and emptyDataHeight === 0
        // we need to add 100px extra in this situation. This is the meaning of this variable.
        const conditionalHeight: number = initialLoadHeight === 0 && emptyDataHeight === 0 && fullRowsCount === 0 ? 100 : 0;

        gridHeight =
          conditionalHeight +
          fullRowsCount * this.rowHeight +
          this.headerHeight +
          emptyDataHeight +
          initialLoadHeight +
          this.getHeaderPagerHeight() +
          scrollSize +
          Math.max(datagridBorderTopSize, datagridBorderBottomSize);
      } else {
        gridHeight =
          maxDisplayedRows * this.rowHeight +
          this.headerHeight +
          this.getHeaderPagerHeight() +
          scrollSize +
          Math.max(datagridBorderTopSize, datagridBorderBottomSize);
      }
      this._gridHeight = gridHeight + 'px';
    } else {
      this._gridHeight = value;
    }
    this.rootWrapperHeight = `calc(100% - ${this.getHeaderPagerHeight()}px)`;
    this.onGridResize();
    this.cd.markForCheck();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  @HostBinding('style.width')
  get gridWidth(): string {
    return this._gridWidth;
  }

  @Input('gridWidth')
  set inputGridWidth(value: string) {
    this._gridWidth = value;
    this.onGridResize();
    this.cd.markForCheck();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * The rowData input is only available for client-side rowModel.
   * If you want to use server-side row model, you need to use the datasource.
   * @param rows
   */
  @Input()
  set rowData(rows: any[]) {
    this.setRowData(rows);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Gets the sorted rows.
   */
  get displayedRows(): FuiDatagridRowNode[] {
    return this._displayedRows;
  }

  /**
   * Rows that are displayed in the table.
   */
  set displayedRows(value: FuiDatagridRowNode[]) {
    this._displayedRows = value;
    this.cd.markForCheck();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  get hasVerticallScroll(): boolean {
    return this._hasVerticalScroll;
  }

  set hasVerticallScroll(value: boolean) {
    this._hasVerticalScroll = value;
    this.cd.markForCheck();
  }

  get hasHorizontalScroll(): boolean {
    return this._hasHorizontalScroll;
  }

  set hasHorizontalScroll(value: boolean) {
    this._hasHorizontalScroll = value;
    this.cd.markForCheck();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  get totalRows(): number {
    return this._totalRows;
  }

  set totalRows(value: number) {
    if (value === this._totalRows) {
      return;
    }
    this._totalRows = value;
    this.inputGridHeight = 'refresh';
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  get isLoading(): boolean {
    return this.stateService.hasState(DatagridStateEnum.LOADING) || this.stateService.hasState(DatagridStateEnum.REFRESHING);
  }

  set isLoading(value: boolean) {
    if (value === true) {
      this.stateService.setLoading();
    } else {
      this.stateService.setLoaded();
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  get isInfiniteLoading(): boolean {
    if (this.isInfiniteServerSideRowModel() && this.infiniteRowModel) {
      return this.infiniteRowModel.hasLoadingBlock();
    }
    return false;
  }

  set isServerSidePageLoading(value: boolean) {
    if (value === true) {
      this.stateService.setLoadingMore();
    } else {
      this.stateService.setLoadedMore();
    }
  }

  get isServerSidePageLoading(): boolean {
    return this.stateService.hasState(DatagridStateEnum.LOADING_MORE);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  set isEmptyData(value: boolean) {
    if (value === true) {
      this.stateService.setEmpty();
    } else {
      this.stateService.setNotEmpty();
    }
  }

  get isEmptyData(): boolean {
    return this.stateService.hasState(DatagridStateEnum.EMPTY) && !this.stateService.hasState(DatagridStateEnum.REFRESHING);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ngOnInit(): void {
    if (this.maxDisplayedRows === null) {
      this.maxDisplayedRows = 10;
    }

    // Track all events that needs to be output.
    this.subscriptions.push(
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_ROW_CLICKED).subscribe((event: RowClickedEvent) => {
        this.onRowClicked.emit(event);
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_ROW_DOUBLE_CLICKED).subscribe((event: RowDoubleClickedEvent) => {
        this.onRowDoubleClicked.emit(event);
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_CELL_CLICKED).subscribe((event: CellClickedEvent) => {
        this.onCellClicked.emit(event);
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_CELL_DOUBLE_CLICKED).subscribe((event: CellDoubleClickedEvent) => {
        this.onCellDoubleClicked.emit(event);
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_CELL_CONTEXT_MENU).subscribe((event: CellContextMenuEvent) => {
        this.onCellContextmenu.emit(event);
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_ROW_SELECTED).subscribe((event: RowSelectedEvent) => {
        this.onRowSelected.emit(event);
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_SELECTION_CHANGED).subscribe((event: SelectionChangedEvent) => {
        this.onSelectionChanged.emit(event);
      })
    );

    // If the dev forgot to set the row-model but still add a datasource object,
    // we would assume he wanted to set a basic server-side row model.
    if (this.datasource && this.isClientSideRowModel()) {
      this.rowDataModel = FuiRowModel.SERVER_SIDE;
    } else {
      this.datagridOptionsWrapper.rowDataModel = this.rowDataModel;
    }

    this.setupColumns();
    this.calculateSizes();

    this.subscriptions.push(
      this.gridPanel.isReady.subscribe(() => {
        this.stateService.setInitialized();
        const icons: { [name: string]: HTMLElement } = {};
        icons[FuiDatagridDragAndDropService.ICON_MOVE] = this.iconMove.nativeElement;
        icons[FuiDatagridDragAndDropService.ICON_HIDE] = this.iconDelete.nativeElement;
        icons[FuiDatagridDragAndDropService.ICON_LEFT] = this.iconLeft.nativeElement;
        icons[FuiDatagridDragAndDropService.ICON_RIGHT] = this.iconRight.nativeElement;
        this.dragAndDropService.initIcons(icons);

        // We wire the services to gridAPI and ColumnAPI.
        this.gridApi.init(this.columnService, this.gridPanel, this.datagridId);
        this.columnApi.init(this.columnService, this.gridPanel);

        if (this.datasource) {
          if (this.isServerSideRowModel()) {
            this.serverSideRowModel.init(this.datasource);
          } else if (this.isInfiniteServerSideRowModel()) {
            if (!this.infiniteRowModel.initialized) {
              this.infiniteRowModel.init(this.datasource);
            }
            this.subscriptions.push(
              this.infiniteRowModel.getDisplayedRows().subscribe(displayedRows => {
                this.displayedRows = displayedRows;
                if (!this.isLoading && this.displayedRows.length === 0) {
                  this.isEmptyData = true;
                } else if (!this.isLoading && this.displayedRows.length > 0) {
                  this.isEmptyData = false;
                }
                this.cd.markForCheck();
              })
            );
          }
        }

        const headerViewport: Element = this.element.nativeElement.querySelector('.fui-datagrid-header-viewport');
        this.domObservers.push(
          DomObserver.observe(headerViewport, (entities, observer) => {
            entities.forEach(entity => {
              if (entity.isIntersecting) {
                // By default we're trying to fit the columns width to grid size.
                this.gridPanel.sizeColumnsToFit();
                // This need to be executed only once.
                observer.unobserve(headerViewport);
              }
            });
          })
        );
      }),

      // Server-side only
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_PAGER_SELECTED_PAGE).subscribe((ev: FuiPageChangeEvent) => {
        if (ev && ev.page && (!this.selectedPage || (this.selectedPage && ev.page.index !== this.selectedPage.index))) {
          this.selectedPage = ev.page;
          if (this.isInfiniteServerSideRowModel()) {
            this.infiniteUpdateParams(ev.page.index);
          }
        }
        this.cd.markForCheck();
        this.highlightSearchTerms();
      }),
      this.eventService
        .listenToEvent(FuiDatagridEvents.EVENT_SERVER_ROW_DATA_CHANGED)
        .subscribe((event: ServerSideRowDataChanged) => {
          this.renderGridRows(event);
        }),

      // All row-models
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_DISPLAYED_COLUMNS_WIDTH_CHANGED).subscribe(() => {
        this.calculateSizes();
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_SORT_COLUMN_CHANGED).subscribe(() => {
        if (this.isClientSideRowModel()) {
          this.onGridColumnsChanged();
        } else if (this.isServerSideRowModel()) {
          this.serverSideUpdateRows();
        } else if (this.isInfiniteServerSideRowModel()) {
          this.infiniteUpdateParams(0, true);
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_SORT_CHANGED).subscribe(() => {
        if (this.isServerSideRowModel()) {
          this.serverSideUpdateRows();
        } else if (this.isInfiniteServerSideRowModel()) {
          this.infiniteUpdateParams(0, true);
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_FILTER_CHANGED).subscribe(() => {
        if (this.isServerSideRowModel()) {
          this.serverSideUpdateRows(true);
        } else if (this.isInfiniteServerSideRowModel()) {
          this.infiniteRowModel.reset();
          this.infiniteUpdateParams(0, true);
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_COLUMN_MOVED).subscribe(() => {
        this.cd.markForCheck();
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_MODEL_UPDATED).subscribe((event: FuiModelUpdatedEvent) => {
        if (this.isClientSideRowModel()) {
          this.renderGridRows(null, event.newData);
        }
      })
    );
    this.cd.markForCheck();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
    this.subscriptions = undefined;
    this.domObservers.forEach(observerInstance => DomObserver.unObserve(observerInstance));
    this.domObservers = undefined;
    this.eventService.flushListeners();
    if (this.isInfiniteServerSideRowModel()) {
      this.infiniteRowModel.destroy();
    }
    // Destroy the selection service if needed.
    if (this.rowSelectionService.initialized) {
      this.rowSelectionService.destroy();
    }
    if (this._initialSelectedRowsSub) {
      this._initialSelectedRowsSub.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.gridPanel.eHorizontalScrollBody = this.horizontalScrollBody.nativeElement;
    this.gridPanel.eBodyHorizontalScrollViewport = this.horizontalScrollViewport.nativeElement;
    this.gridPanel.eBodyHorizontalScrollContainer = this.horizontalScrollContainer.nativeElement;
    this.gridPanel.eCenterViewportVsClipper = this.viewport.horizontalScrollClipperElementRef.nativeElement;
    this.gridPanel.eHeaderFilters = this.datagridFilters.elementRef.nativeElement;
    this.gridPanel.ePager = this.datagridPager.elementRef.nativeElement;

    // Setup Hilitor
    this.hilitor.setTargetNode(this.virtualBodyId);
    this.hilitor.setMatchType('open');

    // We wait that the viewport and its scrollable container intersect with the DOM.
    const domObserverTargets: Element[] = [
      this.viewport.element.nativeElement,
      this.viewport.horizontalScrollClipperWrapper.nativeElement,
      this.viewport.contentElementRef.nativeElement
    ];
    this.domObservers.push(
      DomObserver.observeMultiple(
        domObserverTargets,
        (entries, observer) => {
          let hasIntersect: boolean = true;
          entries.forEach(entry => {
            if (!entry.isIntersecting) {
              hasIntersect = false;
            }
          });
          if (hasIntersect) {
            if (this.isFirstLoad()) {
              // If content has been loaded and it's first load, we then run the autoSizeColumns function.
              this._isFirstLoad = false;
              this.inputGridHeight = 'refresh';
              this.autoSizeColumns();
              // We can kill the observers once loaded (no need to re-run this again)
              domObserverTargets.forEach(target => observer.unobserve(target));
            }
          }
        },
        () => {
          const contentWidth: number = this.viewport.contentElementRef.nativeElement.offsetWidth;
          const viewportWidth: number = this.viewport.element.nativeElement.offsetWidth;
          const viewportHeight: number = this.viewport.element.nativeElement.offsetHeight;
          const contentHeight: number = this.viewport.horizontalScrollClipperWrapper.nativeElement.offsetHeight;

          this.hasHorizontalScroll = contentWidth > viewportWidth;
          this.hasVerticallScroll = contentHeight > viewportHeight;
          this.inputGridHeight = 'refresh';
        }
      )
    );
  }

  /**
   * Return grid row data (not RowNodes). It will take the filter/sort into account.
   */
  getGridData<T = any>(): T[] {
    return this.rowModel.getDisplayedRows().map(rowNode => rowNode.data);
  }

  /**
   * Get the grid API.
   */
  getGridApi(): FuiDatagridApiService {
    return this.gridApi;
  }

  /**
   * Get the grid columns API.
   */
  getColumnApi(): FuiDatagridColumnApiService {
    return this.columnApi;
  }

  /**
   * When we resize the window, we need to automatically adapt the datagrid to fill the new size.
   * After some tests, I've found out that 60ms was a good compromise between performance and UI.
   */
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.resizeEventDebounce) {
      clearTimeout(this.resizeEventDebounce);
      this.resizeEventDebounce = undefined;
    }
    // We set 60ms delay performance-wise.
    this.resizeEventDebounce = setTimeout(() => {
      this.autoSizeColumns();
      this.onGridResize();
    }, 60);
  }

  /**
   * When the pager gets reseted, we clear the displayedRows only for infinite server-side row model.
   * @param reset
   */
  pagerReset(reset: boolean) {
    if (reset) {
      // When we update the pager item per page value, we want to reset the displayed rows.
      if (this.isInfiniteServerSideRowModel()) {
        this.displayedRows = [];
      }
    }
  }

  // @ts-ignore
  /**
   * Angular TrackBy() function for *ngFor over the columns.
   * @param index
   * @param column
   */
  columnTrackByFn(index: number, column: FuiColumnDefinitions): any {
    return column.field;
  }

  // @ts-ignore
  /**
   * Angular TrackBy() function for *ngFor over the columns using the column index (columnId) instead of the field.
   * @param index
   * @param column
   */
  columnTrackByIndexFn(index: number, column: Column): any {
    return column.getColId();
  }

  /**
   * Angular TrackBy() function for *ngFor over the rows.
   * @param index
   * @param instructor
   */
  rowTrackByFn(index: number, instructor: FuiDatagridRowNode): any {
    if (this.trackByFn) {
      return this.trackByFn(index, instructor);
    }
    // Since we have a FuiDatagridRowNode object, we can directly use its id attribute. (it will always be set)
    return instructor.id;
  }

  /**
   * Callback whenever the columns get changed.
   */
  onGridColumnsChanged(): void {
    this.clientSideRowModel.refreshModel({ step: Constants.STEP_SORT, keepRenderedRows: true });
  }

  /**
   * Callback whenever we load more rows for sever-side row model.
   * @param forceReset
   */
  serverSideUpdateRows(forceReset: boolean = false): void {
    this.serverSideRowModel.updateRows(forceReset, this.datagridPager.getCurrentPageIndex()).catch(error => {
      throw error;
    });
  }

  /**
   * Callback whenever we update the infinite server-side row model params.
   * @param blockNumber
   * @param forceUpdate
   */
  infiniteUpdateParams(blockNumber: number = 0, forceUpdate: boolean = false): void {
    this.infiniteRowModel.loadBlocks(blockNumber, forceUpdate);
  }

  /**
   * Render all rows depending on the selected RowModel.
   * @param event
   * @param redraw
   */
  renderGridRows(event?: ServerSideRowDataChanged, redraw?: boolean): void {
    this.calculateSizes();
    if (this.isClientSideRowModel()) {
      if (redraw) {
        this.displayedRows = [];
        setTimeout(() => {
          this.renderClientSideGridRows();
        }, 50);
      } else {
        this.renderClientSideGridRows();
      }
    } else if (this.isServerSideRowModel()) {
      if (event) {
        this.displayedRows = event.rowNodes;
        this.totalRows = event.total;
        this.stateService.setRefreshed();
        this.isLoading = false;
        this.isServerSidePageLoading = false;

        if (this.displayedRows.length === 0) {
          this.isEmptyData = true;
        } else if (this.displayedRows.length > 0) {
          this.isEmptyData = false;
        }
      }
    } else if (this.isInfiniteServerSideRowModel()) {
      if (event) {
        this.totalRows = event.total;
      }
    }
    this.cd.markForCheck();
    this.highlightSearchTerms();
  }

  /**
   * Get only visible columns.
   */
  getVisibleColumns(): Column[] {
    return this.columnService.getVisibleColumns();
  }

  /**
   * Callback function whenever we update the item per page value.
   * @param itemPerPage
   */
  onPagerItemPerPageChange(itemPerPage: number) {
    this.maxDisplayedRows = itemPerPage;
    if (this.isServerSideRowModel()) {
      this.serverSideRowModel
        .updateRows()
        .then(() => {
          // To calculate the height of the grid after loading more data through server-side row model,
          // we need to refresh the grid height to take the new loaded data into account
          this.inputGridHeight = 'refresh';
        })
        .catch(error => {
          throw error;
        });
    } else if (this.isInfiniteServerSideRowModel()) {
      this.infiniteRowModel.refresh(itemPerPage);
    }
    this.onItemPerPageChanged.emit(itemPerPage);
  }

  /**
   * We have our own horizontal scroll within the datagrid.
   * This is called whenever the user scroll within this custom horizontal scrollbar to reflect the event inside the grid.
   */
  onFakeHorizontalScroll(): void {
    this.gridPanel.onFakeHorizontalScroll();
  }

  /**
   * Callback called whenever we vertically/horizontally scroll the center viewport of the grid.
   */
  onCenterViewportScroll(): void {
    this.gridPanel.onCenterViewportScroll();
  }

  /**
   * Callback called whenever we scroll vertically inside the grid.
   * @param event
   */
  onVerticalScroll(event: Event): void {
    this.gridPanel.onVerticalScroll();
    // The EventTarget coming from a scroll Event should be an Element.
    // So we can just assume that the EventTarget is in fact an Element.
    const target: Element = (event.target || event.srcElement) as Element;
    if (target && target.scrollTop !== this.bodyViewportScrollTop) {
      this.bodyViewportScrollTop = target.scrollTop;
      // This part is only when we have an action menu set.
      // It will trigger the action menu close event when scrolling.
      if (this.actionMenuTemplate && this.actionMenuService) {
        if (this.actionMenuService.isActionMenuDropdownOpen === true) {
          this.actionMenuService.isActionMenuDropdownOpen = false;
        }
      }
    }
    this.onVerticalScrollChanged.emit(event);
  }

  /**
   * Whether or not we are using a client-side row model.
   */
  isClientSideRowModel() {
    return this.rowModel.isClientSideRowModel();
  }

  /**
   * Whether or not we are using a server-side row model.
   */
  isServerSideRowModel() {
    // At initialisation, if the developer doesn't set any row model, by default it will be ClientSide.
    // But if he set a datasource, the default row model will be server side.
    return this.rowModel.isServerSideRowModel() || (this.rowModel.isClientSideRowModel() && this.datasource);
  }

  /**
   * Whether or not we are using a infinite-server-side row model.
   */
  isInfiniteServerSideRowModel() {
    return this.rowModel.isInfiniteServerSideRowModel();
  }

  /**
   * Refresh the datagrid. You can either refresh the grid without changing anything regarding the sort/filters or completely
   * reset the grid.
   * @param resetFilters
   * @param resetSorting
   */
  refreshGrid(resetFilters: boolean = false, resetSorting: boolean = false) {
    // Do nothing if we are refreshing the grid already.
    if (this.stateService.hasState(DatagridStateEnum.REFRESHING)) {
      return;
    }
    this.stateService.setRefreshing();
    // We reset all filters by default
    if (resetFilters) {
      this.filterService.resetFilters();
      // We remove hilitor during reset
      this.hilitor.remove();
    }
    // We do not reset the sorting columns by default, only if the dev decide to.
    if (resetSorting) {
      this.sortService.resetColumnsSortOrder();
    }
    this.datagridPager.resetPager();

    if (this.isClientSideRowModel()) {
      let originalData: any[] = FeruiUtils.flattenObject(this.clientSideRowModel.getCopyOfNodesMap()).map(node => node.data);
      // We reset the rowData
      if (resetFilters || resetSorting) {
        this.setRowData([]);
      } else {
        this.displayedRows = [];
      }
      this.isLoading = true;
      this.cd.markForCheck();
      setTimeout(() => {
        this.setRowData(originalData, !resetFilters && !resetSorting);
        originalData = undefined;
        this.stateService.setRefreshed();
        this.cd.markForCheck();
      }, 50);
    } else if (this.isServerSideRowModel()) {
      this.isLoading = true;
      this.serverSideRowModel
        .refresh(this.maxDisplayedRows, this.datasource)
        .then(() => {
          this.stateService.setRefreshed();
        })
        .catch(() => {
          this.stateService.setRefreshed();
        });
    } else if (this.isInfiniteServerSideRowModel()) {
      this.isLoading = true;
      this.infiniteRowModel.refresh(this.maxDisplayedRows, this.datasource);
    }
  }

  /**
   * Callback called whenever a column has its visibility changed.
   * @param columnEvent
   */
  onColumnChangeVisibility(columnEvent: ColumnVisibleEvent): void {
    if (columnEvent && columnEvent.column) {
      this.autoSizeColumns();
      this.onColumnVisibilityChanged.emit(columnEvent);
    }
  }

  /**
   * Callback called whenever a column has its width changed.
   * @param columnEvent
   */
  onColumnChangeWidth(columnEvent: ColumnEvent) {
    if (columnEvent && columnEvent.column) {
      this.calculateSizes();
      this.onColumnWidthChange.emit(columnEvent);
    }
  }

  /**
   * Callback called whenever a column gets resized.
   * @param event
   */
  onColumnResize(event: ColumnResizedEvent): void {
    this.calculateSizes();
    this.onColumnResized.emit(event);
  }

  /**
   * Callback called whenever the pager or header height gets updated.
   */
  onFilterPagerHeightChange() {
    this.rootWrapperHeight = `calc(100% - ${this.getHeaderPagerHeight()}px)`;
    this.cd.markForCheck();
  }

  /**
   * Export grid to CSV file.
   */
  exportGrid() {
    const displayedRowsData: any[] = this.displayedRows.map(it => it.data);
    const serializer: GridSerializer<any> = new GridSerializer<any>(this.getVisibleColumns(), displayedRowsData);
    const csvCreator: CsvCreator = new CsvCreator(this.exportDownloader, serializer, this.datagridOptionsWrapper);
    csvCreator.export(this.exportParams);
  }

  /**
   * Retrieve all selected FuiDatagridRowNode. This is useful if you want to re-use the items within the grid.
   */
  getSelectedNodes<D = any>(): FuiDatagridRowNode<D>[] | null {
    if (this.rowSelectionService && this.rowSelection) {
      return this.rowSelectionService.getSelectedNodes();
    }
    return null;
  }

  /**
   * Retrieve all selected rows data.
   */
  getSelectedRows(): any[] {
    if (this.rowSelectionService && this.rowSelection) {
      return this.rowSelectionService.getSelectedRows();
    }
    return null;
  }

  /**
   * Render the rows for client side row model.
   * @private
   */
  private renderClientSideGridRows() {
    this.displayedRows = this.clientSideRowModel.getRowNodesToDisplay();
    this.totalRows = this.clientSideRowModel.getRowCount();
    if (!this.isLoading && this.totalRows === 0) {
      this.isEmptyData = true;
    } else if (!this.isLoading && this.totalRows > 0) {
      this.isEmptyData = false;
    }
    const rowDataChangedEvent: RowDataChanged = {
      type: FuiDatagridEvents.EVENT_ROW_DATA_CHANGED,
      api: this.gridApi,
      columnApi: this.columnApi
    };
    this.onRowDataChanged.emit(rowDataChangedEvent);
  }

  /**
   * Check whether or not the grid has been initialized and that we've loaded some data at least once.
   * @private
   */
  private isGridLoadedOnce(): boolean {
    return this.stateService.hasState(DatagridStateEnum.LOADED) && this.stateService.hasState(DatagridStateEnum.INITIALIZED);
  }

  /**
   * Check whether or not this is the first load of the datagrid.
   * @private
   */
  private isFirstLoad(): boolean {
    return this.isGridLoadedOnce() && this._isFirstLoad === true;
  }

  /**
   * Auto size all columns to fits their own width.
   * Note that it will adds more width if there is unused size left.
   * @private
   */
  private autoSizeColumns() {
    this.columnService.autoSizeAllColumns(this.gridPanel.eBodyViewport);
    this.columnService.updateColumnsPosition();
    this.calculateSizes();
  }

  /**
   * Activate Hilitor. This will highlight the searching terms within the whole datagrid.
   * @private
   */
  private highlightSearchTerms() {
    let searchTerms = '';
    if (this.filterService.globalSearchFilter && this.filterService.globalSearchFilter.filter) {
      searchTerms = this.filterService.globalSearchFilter.filter.getFilterValue();
    }

    if (this.highlightSearchTermsDebounce) {
      clearTimeout(this.highlightSearchTermsDebounce);
    }
    this.highlightSearchTermsDebounce = setTimeout(() => {
      if (searchTerms === '') {
        this.hilitor.remove();
      } else {
        this.hilitor.apply(searchTerms);
      }
    }, 50);
  }

  /**
   * Calculate the proper sizing for the datagrid (not only the columns size)
   * @private
   */
  private calculateSizes(): void {
    this.totalWidth = this.columnService.getTotalColumnWidth();
    if (this.scrollbarHelper.getWidth()) {
      this.scrollSize = this.scrollbarHelper.getWidth();
    }
    this.gridPanel.setCenterContainerSize();
    this.onGridResize();
    this.cd.markForCheck();
  }

  /**
   * Emit the grid resize event everytime the grid is resized in height and/or width.
   */
  private onGridResize() {
    const gridSize: DatagridOnResizeEvent = {
      width: this.element.nativeElement.offsetWidth,
      height: this.element.nativeElement.offsetHeight
    };
    if (!FeruiUtils.isEqual(this.gridSize, gridSize)) {
      this.gridSize = gridSize;
      this.onDatagridResized.emit(this.gridSize);
    }
  }

  /**
   * Return the sum of pager height and filters height if any.
   */
  private getHeaderPagerHeight(): number {
    const filterHeight: number =
      this.withHeader && this.datagridFilters && this.datagridFilters.getElementHeight()
        ? this.datagridFilters.getElementHeight()
        : !this.withHeader
        ? 0
        : this.defaultFiltersHeight;
    const pagerHeight: number =
      this.withFooter && !this.isLoading && this.datagridPager && this.datagridPager.getElementHeight()
        ? this.datagridPager.getElementHeight()
        : !this.withFooter
        ? 0
        : this.defaultPagersHeight;
    return filterHeight + pagerHeight;
  }

  /**
   * Setup all columns. We will create the checkbox column from scratch if we activate the selection feature with the
   * checkboxSelection option to true.
   * @private
   */
  private setupColumns(): void {
    this.datagridOptionsWrapper.setGridOption('columnDefs', this.columnDefs);
    this.datagridOptionsWrapper.setGridOption('defaultColDef', this.defaultColDefs);
    this.datagridOptionsWrapper.setGridOption('headerHeight', this.headerHeight);
    this.datagridOptionsWrapper.setGridOption('rowHeight', this.rowHeight);
    this.columns = [];

    const defaultColDef: FuiColumnDefinitions = {
      resizable: true,
      lockPosition: false,
      lockVisible: false
    };
    if (
      (this.datagridOptionsWrapper.getRowSelection() === FuiRowSelectionEnum.SINGLE ||
        this.datagridOptionsWrapper.getRowSelection() === FuiRowSelectionEnum.MULTIPLE) &&
      this.datagridOptionsWrapper.isCheckboxSelection()
    ) {
      this.columns = [
        {
          checkboxSelection: true,
          resizable: false,
          lockPosition: true,
          lockVisible: true,
          width: 50,
          minWidth: 50,
          maxWidth: 50,
          field: 'datagridSelectionField',
          headerName: ' '
        }
      ];
    }
    this.columns = this.columns.concat(
      this.columnDefs.map(colDef => {
        return { ...defaultColDef, ...this.defaultColDefs, ...colDef };
      })
    );
  }

  /**
   *
   * @param rows
   * @param keepRenderedRows
   * @private
   */
  private setRowData(rows: any, keepRenderedRows: boolean = false): void {
    if (this.stateService.hasState(DatagridStateEnum.INITIALIZED)) {
      this.clientSideRowModel.setRowData(rows, this.rowSelectionService.getSelectedNodes(), keepRenderedRows);
      this.totalRows = this.clientSideRowModel.getRowCount();
      this.datagridOptionsWrapper.setGridOption('rowDataLength', this.totalRows);

      if (!this.stateService.hasState(DatagridStateEnum.REFRESHING)) {
        this.isEmptyData = this.totalRows === 0;
      }

      if (!this.isFirstLoad() && rows !== undefined) {
        this.isLoading = false;
      }
      this.cd.markForCheck();
    } else {
      setTimeout(() => {
        this.setRowData(rows);
      }, 10);
    }
  }
}
