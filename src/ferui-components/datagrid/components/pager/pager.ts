import { Subscription } from 'rxjs';

import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Self } from '@angular/core';

import { FuiFormLayoutEnum } from '../../../forms/common/layout.enum';
import { DomObserver, ObserverInstance } from '../../../utils/dom-observer/dom-observer';
import { FuiI18nService } from '../../../utils/i18n/fui-i18n.service';
import { FuiDatagridEvents, FuiPageChangeEvent, ServerSideRowDataChanged } from '../../events';
import { DatagridStateEnum, DatagridStateService } from '../../services/datagrid-state.service';
import { FuiDatagridService } from '../../services/datagrid.service';
import { FuiDatagridEventService } from '../../services/event.service';
import { FuiDatagridRowSelectionService } from '../../services/selection/datagrid-row-selection.service';
import { FuiPagerPage } from '../../types/pager';
import { FuiRowModel } from '../../types/row-model.enum';
import { DatagridUtils } from '../../utils/datagrid-utils';
import { orderByComparator } from '../../utils/sort';
import { RowModel } from '../row-models/row-model';

@Component({
  selector: 'fui-datagrid-pager',
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-auto">
          <div unselectable="on" class="fui-datagrid-pager-total" [innerHTML]="getDatagridItemCountString()"></div>
        </div>
        <div class="col">
          <div class="fui-datagrid-pagination">
            <clr-icon
              [hidden]="!withNavigatorPager"
              class="fui-pagination-arrow"
              *ngIf="displayedPages().length > 0"
              (click)="toFirstPage()"
              [class.disabled]="isPageDisabled('first')"
              shape="fui-step-forward"
              flip="horizontal"
            ></clr-icon>
            <clr-icon
              [hidden]="!withNavigatorPager"
              class="fui-pagination-arrow"
              *ngIf="displayedPages().length > 0"
              (click)="toPreviousPage()"
              [class.disabled]="isPageDisabled('previous')"
              shape="fui-caret left"
            ></clr-icon>
            <div [hidden]="!withNavigatorPager" class="fui-datagrid-pagination-pages" *ngIf="displayedPages().length > 0">
              <div
                unselectable="on"
                class="fui-datagrid-pagination-page"
                (click)="pageSelect(page)"
                [class.page-selected]="isPageSelected(page)"
                *ngFor="let page of displayedPages()"
              >
                {{ page.value }}
              </div>
            </div>
            <clr-icon
              [hidden]="!withNavigatorPager"
              class="fui-pagination-arrow"
              *ngIf="displayedPages().length > 0"
              (click)="toNextPage()"
              [class.disabled]="isPageDisabled('next')"
              shape="fui-caret right"
            ></clr-icon>
            <clr-icon
              [hidden]="!withNavigatorPager"
              class="fui-pagination-arrow"
              *ngIf="displayedPages().length > 0"
              (click)="toLastPage()"
              [class.disabled]="isPageDisabled('last')"
              shape="fui-step-forward"
            ></clr-icon>
          </div>
        </div>
        <div class="col-auto item-per-page-selector" *ngIf="withNavigatorItemPerPage">
          <fui-select
            [layout]="layoutSmall"
            fuiSelect
            name="itemPerPageSelect"
            [clearable]="false"
            placeholder="{{ i18nService.keys.itemsPerPage }}"
            (ngModelChange)="updateLimit($event)"
            [(ngModel)]="itemPerPage"
          >
            <ng-option *ngFor="let iPerPage of itemPerPagesList" [value]="iPerPage">
              {{ iPerPage }} {{ i18nService.keys.itemsPerPage }}
            </ng-option>
          </fui-select>
        </div>
      </div>
    </div>
  `,
  host: {
    class: 'fui-datagrid-pager'
  }
})
export class FuiDatagridPagerComponent implements OnInit, OnDestroy {
  @Output() readonly pagerReset: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() readonly pagerItemPerPage: EventEmitter<number> = new EventEmitter<number>();
  @Output() readonly heightChange: EventEmitter<number> = new EventEmitter<number>();

  layoutSmall: FuiFormLayoutEnum = FuiFormLayoutEnum.SMALL;
  numberOfRowsInViewport: number | null = null;
  totalRows: number | null = null;
  pages: FuiPagerPage[] = [];
  lastPageIndex: number = 0;
  maxPages: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;
  maxIndex: number = 0;

  serverSideTotalRows: string = 'more';
  itemPerPagesList: number[] = [5, 10, 20, 50, 100];

  @Input() maximumNumberOfPages: number = 5;
  @Input() rowDataModel: FuiRowModel = FuiRowModel.CLIENT_SIDE;

  @Input() withNavigatorItemPerPage: boolean = true;
  @Input() withNavigatorPager: boolean = true;

  private _itemPerPage: number = this.itemPerPagesList[1];
  private _selectedPage: FuiPagerPage;
  private _height: number = 0;
  private subscriptions: Subscription[] = [];
  private domObservers: ObserverInstance[] = [];
  private serverSideReachLastPage: boolean = false;
  private serverSidePages: FuiPagerPage[] = [];

  constructor(
    @Self() public elementRef: ElementRef,
    public i18nService: FuiI18nService,
    private eventService: FuiDatagridEventService,
    private gridPanel: FuiDatagridService,
    private rowModel: RowModel,
    private rowSelectionService: FuiDatagridRowSelectionService,
    private stateService: DatagridStateService
  ) {
    this.subscriptions.push(
      this.eventService
        .listenToEvent(FuiDatagridEvents.EVENT_SERVER_ROW_DATA_CHANGED)
        .subscribe((event: ServerSideRowDataChanged) => {
          this.setTotalRows();
          if (event.pageIndex === 0) {
            this.resetPager();
          }
        }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_MODEL_UPDATED).subscribe(() => {
        this.setTotalRows();
        this.resetPager();
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_SORT_COLUMN_CHANGED).subscribe(() => {
        this.resetPager();
      }),
      // Wait for the main datagrid to be loaded before trying to listen on virtualScrollViewport event.
      this.gridPanel.isReady.subscribe(isReady => {
        if (isReady) {
          this.subscriptions.push(
            this.gridPanel.virtualScrollViewport.vsChange.subscribe(pageInfo => {
              if (this.isServerSideRowModel()) {
                this.startIndex = this.rowModel.getServerSideRowModel().offset;
                this.endIndex = this.startIndex + this.getLimit() - 1; // The index is 0 based.
              } else {
                this.startIndex = pageInfo.startIndex;
                this.endIndex = pageInfo.endIndex;
              }
              this.createPager();
            })
          );
        }
      })
    );
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  @Input()
  set itemPerPage(value: number) {
    this._itemPerPage = value;
  }

  get itemPerPage(): number {
    return this._itemPerPage;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  get selectedPage(): FuiPagerPage {
    return this._selectedPage;
  }

  set selectedPage(value: FuiPagerPage) {
    if (!this._selectedPage || (this._selectedPage && value && value.index !== this._selectedPage.index)) {
      this._selectedPage = value;
      const event: FuiPageChangeEvent = {
        api: null,
        columnApi: null,
        page: this._selectedPage,
        type: FuiDatagridEvents.EVENT_PAGER_SELECTED_PAGE
      };
      this.eventService.dispatchEvent(event);
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  get height(): number {
    return this._height;
  }

  /**
   * We set the height only once at ngOnInit stage.
   * @param value
   */
  set height(value: number) {
    this._height = value;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Get Element height.
   */
  getElementHeight(): number {
    return this.height;
  }

  ngOnInit(): void {
    if (this.rowModel.isServerSideRowModel() || this.rowModel.isInfiniteServerSideRowModel()) {
      // Both server-side and infinite-server-side row models are using the same behaviour.
      if (this.getLimit() && this.itemPerPagesList.indexOf(this.getLimit()) === -1) {
        this.itemPerPagesList.push(this.getLimit());
        this.itemPerPagesList.sort(orderByComparator);
      }
      this.itemPerPage = this.getLimit();
    }
    this.domObservers.push(
      DomObserver.observe(this.elementRef.nativeElement, (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.height = this.elementRef.nativeElement.offsetHeight;
            observer.unobserve(this.elementRef.nativeElement);
          }
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = undefined;
    this.domObservers.forEach(observerInstance => DomObserver.unObserve(observerInstance));
    this.domObservers = undefined;
  }

  /**
   * Whether a page is selected or not.
   * @param page
   */
  isPageSelected(page: FuiPagerPage): boolean {
    return DatagridUtils.inRange(this.endIndex - 1, page.startIndex, page.endIndex);
  }

  /**
   * Select a page
   * @param page
   * @param startIndex
   */
  pageSelect(page: FuiPagerPage, startIndex: boolean = true): void {
    if (this.gridPanel.virtualScrollViewport && page) {
      this.selectedPage = page;
      const isLastPage = !startIndex || this.lastPageIndex === page.index + 1;
      if (!this.isClientSideRowModel()) {
        if (this.isServerSideRowModel()) {
          this.stateService.setLoadingMore();
        }
        this.goToPage(!this.isServerSideRowModel(), page);
      } else {
        this.goToPage(true, page, isLastPage);
      }
    }
  }

  /**
   * Return whether the page is disabled (grey state) or not.
   * @param type
   */
  isPageDisabled(type: string): boolean {
    if (!this.selectedPage || this.pages.length === 0) {
      return false;
    }
    switch (type) {
      case 'first':
      case 'previous':
        return this.selectedPage.index === 0;
      case 'last':
      case 'next':
        const isDisabled: boolean = this.selectedPage.index === this.pages[this.pages.length - 1].index;
        return this.isServerSideRowModel() ? this.serverSideReachLastPage && isDisabled : isDisabled;
      default:
        return false;
    }
  }

  /**
   * Go to first page
   */
  toFirstPage(): void {
    if (this.selectedPage && this.selectedPage.index === 0) {
      return;
    }
    this.pageSelect(this.pages[0]);
  }

  /**
   * Go to last page
   */
  toLastPage(): void {
    if (this.selectedPage && this.selectedPage.index === this.pages[this.pages.length - 1].index) {
      return;
    }
    this.pageSelect(this.pages[this.pages.length - 1], false);
  }

  /**
   * Go to next page
   */
  toNextPage(): void {
    if (
      ((this.isServerSideRowModel() || this.isInfiniteServerSideRowModel()) &&
        this.serverSideReachLastPage &&
        this.selectedPage &&
        this.selectedPage.index + 1 > this.pages.length - 1) ||
      (this.isClientSideRowModel() && this.selectedPage && this.selectedPage.index + 1 > this.pages.length - 1)
    ) {
      return;
    }
    this.pageSelect(this.getNextPage());
  }

  /**
   * Return to previous page
   */
  toPreviousPage(): void {
    if (this.selectedPage && this.selectedPage.index - 1 < 0) {
      return;
    }
    this.pageSelect(this.pages[this.selectedPage.index - 1]);
  }

  /**
   * Return the pages that are displayed on screen.
   */
  displayedPages(): FuiPagerPage[] {
    if (this.pages.length === 0 || !this.selectedPage) {
      return [];
    }
    const halfPage = Math.ceil(this.maxPages / 2);
    const calc = this.selectedPage.value - halfPage;
    const pageIndexed =
      calc < 0 ? 0 : this.selectedPage.value >= this.lastPageIndex - halfPage ? this.lastPageIndex - this.maxPages : calc;
    return [...this.pages].slice(pageIndexed < 0 ? 0 : pageIndexed, pageIndexed + this.maxPages);
  }

  /**
   *
   * @param pageIndex
   * @param limit
   */
  serverSidePageChange(pageIndex: number, limit: number): void {
    this.numberOfRowsInViewport = null;
    if (this.isServerSideRowModel()) {
      this.rowModel.getServerSideRowModel().offset = pageIndex;
      this.rowModel.getServerSideRowModel().limit = limit;
      this.rowModel
        .getServerSideRowModel()
        .updateRows(false, pageIndex)
        .then(resultObject => {
          if (resultObject.data === null) {
            this.reachedLastPage(pageIndex.toLocaleString());
            this.toPreviousPage();
          }
          const currentPage = this.findPageFromStartIndex(pageIndex);
          if (currentPage) {
            this.pages[currentPage.index].serverSidePageLoaded = true;
          }
        })
        .catch(reason => {
          throw Error(reason);
        });
    } else if (this.isInfiniteServerSideRowModel()) {
      this.rowModel.getInfiniteServerSideRowModel().refresh(limit);
    }
  }

  /**
   * Get the current page index.
   */
  getCurrentPageIndex(): number {
    return this.selectedPage ? this.selectedPage.index : 0;
  }

  /**
   * Update the item per page and the limit for server row models.
   * @param value
   */
  updateLimit(value: number): void {
    this.resetPager();
    this.itemPerPage = value;
    if (this.isInfiniteServerSideRowModel() || this.isServerSideRowModel()) {
      this.serverSidePageChange(0, value);
    }
    this.pagerItemPerPage.emit(value);
  }

  /**
   * Reset the pager.
   */
  resetPager(): void {
    this.pages = [];
    this.lastPageIndex = 0;
    this.maxPages = 0;
    this.startIndex = 0;
    this.endIndex = 0;
    this.maxIndex = 0;
    this._selectedPage = null;
    this.numberOfRowsInViewport = null;

    if (this.isServerSideRowModel() || this.isInfiniteServerSideRowModel()) {
      this.serverSideReachLastPage = false;
      this.serverSideTotalRows = 'more';
      this.serverSidePages = [];
    }
    this.pagerReset.emit(true);
  }

  /**
   * Get the info strings for Datagrid (total rows count, selected items count, filtered items count).
   */
  getDatagridItemCountString(): string {
    const hasSelection = this.rowSelectionService.initialized && this.rowSelectionService.getSelectionCount() > 0;
    const hasFilters = this.rowModel.getRowModel().hasFilters();
    const isLoading = this.stateService.hasState(DatagridStateEnum.LOADING);
    const hasTotalRows = this.totalRows !== null;

    // If the datagrid is still loading, we remove the row count info.
    if (isLoading) {
      return '';
    }

    const endIndex = this.endIndex + (this.isServerSideRowModel() ? 1 : 0);
    const filteredRowsCount = hasTotalRows ? this.totalRows.toLocaleString() : this.serverSideTotalRows;
    const totalRowsCount = this.isClientSideRowModel()
      ? this.rowModel.getClientSideRowModel().getTotalRowCount().toLocaleString()
      : filteredRowsCount;

    // Strings to display
    const totalString = `<span>${totalRowsCount} ${this.i18nService.keys.total}</span>`;
    const totalFilteredString = `<span>${totalRowsCount} ${this.i18nService.keys.total} (${filteredRowsCount} ${this.i18nService.keys.filtered})</span>`;
    const selectedString = `<span>${this.rowSelectionService.getSelectionCount().toLocaleString()} ${
      this.i18nService.keys.selected
    }</span>`;
    const serverSideString = `<span>${(this.startIndex + 1).toLocaleString()} ${
      this.i18nService.keys.to
    } ${endIndex.toLocaleString()} ${this.i18nService.keys.of} ${filteredRowsCount}</span>`;

    if (hasTotalRows && this.isClientSideRowModel()) {
      return hasSelection
        ? selectedString + (hasFilters ? totalFilteredString : totalString)
        : hasFilters
        ? totalFilteredString
        : totalString;
    } else {
      return hasSelection ? selectedString + serverSideString : serverSideString;
    }
  }

  /**
   *
   * @param index
   * @param limit
   */
  static getPageNumberFromEndIndex(index: number, limit: number): number {
    return Math.ceil(index / limit);
  }

  /**
   *
   */
  private setTotalRows() {
    this.totalRows = this.getRowCount();
  }

  /**
   *
   */
  private createPager() {
    if (this.endIndex > this.maxIndex) {
      this.maxIndex = this.endIndex;
    }

    if (
      (this.numberOfRowsInViewport === 0 || this.numberOfRowsInViewport === null) &&
      this.startIndex > -1 &&
      this.endIndex > 0 &&
      this.totalRows !== null &&
      this.totalRows > 0
    ) {
      this.numberOfRowsInViewport =
        this.rowModel.getDatasource() && this.getLimit() !== null ? this.getLimit() : this.endIndex - this.startIndex;
      const itemPerPage: number = this.numberOfRowsInViewport < this.itemPerPage ? this.itemPerPage : this.numberOfRowsInViewport;

      let totalPages: number = Math.ceil(this.totalRows / itemPerPage);
      if (totalPages === 0) {
        totalPages = 1;
      }

      this.maxPages = totalPages > this.maximumNumberOfPages ? this.maximumNumberOfPages : totalPages;
      for (let i = 1; i <= totalPages; i++) {
        const lastIndex: number = i * itemPerPage;
        const firstIndex: number = lastIndex - itemPerPage;
        this.addPage(i, firstIndex, lastIndex - 1);
      }
    } else if ((this.totalRows === 0 || this.totalRows === null) && this.startIndex > -1 && this.endIndex > 0) {
      this.numberOfRowsInViewport = this.totalRows;
      const startIdx: number = this.startIndex;
      const endIdx: number = this.endIndex;

      if (this.isInfiniteServerSideRowModel() && this.rowModel.getInfiniteServerSideRowModel()) {
        const numberOfRowsInViewport: number = this.getLimit();
        const maxReachedRowIndex: number = this.rowModel.getInfiniteServerSideRowModel().infiniteCache.getMaxReachedRowIndex();
        const totalPages: number = Math.ceil(maxReachedRowIndex / numberOfRowsInViewport) || 1;

        if (this.pages.length !== totalPages) {
          this.pages = [];
          for (let i = 0; i < totalPages; i++) {
            const firstIndex: number = numberOfRowsInViewport * i;
            const lastIndex: number = firstIndex + numberOfRowsInViewport - 1;
            this.addPage(i + 1, firstIndex, lastIndex);
          }
        }
        if (this.rowModel.getInfiniteServerSideRowModel().infiniteCache.reachedLastIndex) {
          this.reachedLastPage(maxReachedRowIndex.toLocaleString());
        }
      } else {
        this.pages = this.isServerSideRowModel() ? [...this.serverSidePages] : [];
        this.addPage(FuiDatagridPagerComponent.getPageNumberFromEndIndex(this.startIndex + 1, this.getLimit()), startIdx, endIdx);
      }
      this.maxPages = this.pages.length + 1 > this.maximumNumberOfPages ? this.maximumNumberOfPages : this.pages.length + 1;
    }
    this.setSelectedPage();
  }

  private getLimit(): number | null {
    if (this.isInfiniteServerSideRowModel() && this.rowModel.getInfiniteServerSideRowModel()) {
      return this.rowModel.getInfiniteServerSideRowModel().limit;
    } else if (this.isServerSideRowModel() && this.rowModel.getServerSideRowModel()) {
      return this.rowModel.getServerSideRowModel().limit;
    }
    return null;
  }

  /**
   *
   * @param total
   */
  private reachedLastPage(total: string) {
    this.serverSideReachLastPage = true;
    this.serverSideTotalRows = total;
  }

  /**
   *
   * @param index Start from 1.
   * @param firstIndex
   * @param lastIndex
   */
  private addPage(index: number, firstIndex: number, lastIndex: number): void {
    // Do nothing if the page already exist
    if (
      this.isPageExist(index) ||
      (this.pages.length > 0 &&
        (this.pages[this.pages.length - 1].startIndex === firstIndex || this.pages[this.pages.length - 1].endIndex === lastIndex))
    ) {
      return;
    }
    const page: FuiPagerPage = {
      index: index - 1, // start from 0
      value: index, // start from 1
      startIndex: firstIndex, // start from 0
      endIndex: lastIndex,
      serverSidePageLoaded: false
    };
    this.pages.push(page);
    if (this.isServerSideRowModel() && this.totalRows === null) {
      this.serverSidePages.push(page);
    }
    this.lastPageIndex = index;
  }

  /**
   *
   */
  private setSelectedPage(): void {
    this.selectedPage = this.pages.find(p => {
      return this.isPageSelected(p);
    });
  }

  /**
   *
   */
  private isServerSideRowModel(): boolean {
    return this.rowModel.isServerSideRowModel();
  }

  /**
   *
   */
  private isInfiniteServerSideRowModel(): boolean {
    return this.rowModel.isInfiniteServerSideRowModel();
  }

  /**
   *
   */
  private isClientSideRowModel(): boolean {
    return this.rowModel.isClientSideRowModel();
  }

  /**
   *
   */
  private getNextPage(): FuiPagerPage {
    if (!this.selectedPage) {
      return null;
    }
    if (this.isServerSideRowModel()) {
      return {
        index: this.selectedPage.index + 1,
        value: this.selectedPage.value + 1,
        startIndex: this.selectedPage.endIndex + 1,
        endIndex: this.selectedPage.endIndex + this.getLimit(),
        serverSidePageLoaded: false
      };
    } else {
      return this.pages[this.selectedPage.index + 1];
    }
  }

  /**
   *
   * @param startIndex
   */
  private findPageFromStartIndex(startIndex: number): FuiPagerPage {
    return this.pages.find(p => p.startIndex === startIndex);
  }

  /**
   *
   * @param clientChange
   * @param page
   * @param isLastPage
   */
  private goToPage(clientChange: boolean, page: FuiPagerPage, isLastPage?: boolean): void {
    if (clientChange) {
      this.gridPanel.virtualScrollViewport.scrollToIndex(isLastPage ? page.endIndex : page.startIndex, true, 0, 0);
    } else if (this.isServerSideRowModel()) {
      this.serverSidePageChange(page.startIndex, this.getLimit());
    }
  }

  /**
   *
   * @param index
   */
  private isPageExist(index: number): boolean {
    return this.pages.findIndex(p => p.value === index) > -1;
  }

  private getRowCount(): number | null {
    if (this.isClientSideRowModel()) {
      return this.rowModel.getClientSideRowModel().getRowCount();
    } else if (this.isInfiniteServerSideRowModel()) {
      return this.rowModel.getInfiniteServerSideRowModel().totalRows;
    } else if (this.isServerSideRowModel()) {
      return this.rowModel.getServerSideRowModel().totalRows;
    }
    return null;
  }
}
