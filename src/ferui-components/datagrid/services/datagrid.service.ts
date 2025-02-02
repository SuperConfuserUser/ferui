import { Observable, Subject } from 'rxjs';

import { Injectable, Renderer2 } from '@angular/core';

import { ScrollbarHelper } from '../../utils/scrollbar-helper/scrollbar-helper.service';
import { FuiVirtualScrollerComponent } from '../../virtual-scroller/virtual-scroller';
import { BodyScrollEvent, FuiDatagridEvents } from '../events';
import { DatagridUtils } from '../utils/datagrid-utils';

import { FuiDatagridApiService } from './datagrid-api.service';
import { FuiDatagridColumnApiService } from './datagrid-column-api.service';
import { FuiDatagridEventService } from './event.service';
import { FuiColumnService } from './rendering/column.service';

@Injectable()
export class FuiDatagridService {
  private _isReady = new Subject<boolean>();

  private _eHeaderFilters: HTMLElement;
  private _ePager: HTMLElement;

  private _eHeaderRoot: HTMLElement;
  private _eHeaderViewport: HTMLElement;
  private _eHeaderContainer: HTMLElement;

  private _eFooterViewport: HTMLElement;

  private _virtualScrollViewport: FuiVirtualScrollerComponent;
  private _eBodyViewport: HTMLElement;
  private _eCenterContainer: HTMLElement;
  private _eCenterViewport: HTMLElement;
  private _eCenterColsClipper: HTMLElement;
  private _eCenterViewportVsClipper: HTMLElement;

  private _eHorizontalScrollBody: HTMLElement;
  private _eBodyHorizontalScrollViewport: HTMLElement;
  private _eBodyHorizontalScrollContainer: HTMLElement;
  private _lastHorizontalScrollElement: HTMLElement | undefined | null;

  private _eFullWidthContainer: HTMLElement;

  private scrollLeft: number = -1;
  private scrollTop: number = -1;
  private readonly resetLastHorizontalScrollElementDebounce: () => void;

  constructor(
    private renderer: Renderer2,
    private scrollbarHelper: ScrollbarHelper,
    private gridApi: FuiDatagridApiService,
    private columnApi: FuiDatagridColumnApiService,
    private eventService: FuiDatagridEventService,
    private columnService: FuiColumnService
  ) {
    this.resetLastHorizontalScrollElementDebounce = DatagridUtils.debounce(this.resetLastHorizontalScrollElement.bind(this), 500);
  }

  get eFooterViewport(): HTMLElement {
    return this._eFooterViewport;
  }

  set eFooterViewport(value: HTMLElement) {
    this._eFooterViewport = value;
  }

  get eHeaderFilters(): HTMLElement {
    return this._eHeaderFilters;
  }

  set eHeaderFilters(value: HTMLElement) {
    this._eHeaderFilters = value;
  }

  get ePager(): HTMLElement {
    return this._ePager;
  }

  set ePager(value: HTMLElement) {
    this._ePager = value;
  }

  get getScrollbarHelper(): ScrollbarHelper {
    return this.scrollbarHelper;
  }

  get virtualScrollViewport(): FuiVirtualScrollerComponent {
    return this._virtualScrollViewport;
  }

  set virtualScrollViewport(value: FuiVirtualScrollerComponent) {
    this._virtualScrollViewport = value;
  }

  get eHeaderRoot(): HTMLElement {
    return this._eHeaderRoot;
  }

  get eCenterViewportVsClipper(): HTMLElement {
    return this._eCenterViewportVsClipper;
  }

  set eCenterViewportVsClipper(value: HTMLElement) {
    this._eCenterViewportVsClipper = value;
    this.checkIfReady();
  }

  set eHeaderRoot(value: HTMLElement) {
    this._eHeaderRoot = value;
    this.checkIfReady();
  }

  get eBodyViewport(): HTMLElement {
    return this._eBodyViewport;
  }

  set eBodyViewport(value: HTMLElement) {
    this._eBodyViewport = value;
    this.checkIfReady();
  }

  get eCenterContainer(): HTMLElement {
    return this._eCenterContainer;
  }

  set eCenterContainer(value: HTMLElement) {
    this._eCenterContainer = value;
    this.checkIfReady();
  }

  get eCenterViewport(): HTMLElement {
    return this._eCenterViewport;
  }

  set eCenterViewport(value: HTMLElement) {
    this._eCenterViewport = value;
    this.checkIfReady();
  }

  get eCenterColsClipper(): HTMLElement {
    return this._eCenterColsClipper;
  }

  set eCenterColsClipper(value: HTMLElement) {
    this._eCenterColsClipper = value;
    this.checkIfReady();
  }

  get eHorizontalScrollBody(): HTMLElement {
    return this._eHorizontalScrollBody;
  }

  set eHorizontalScrollBody(value: HTMLElement) {
    this._eHorizontalScrollBody = value;
    this.checkIfReady();
  }

  get eBodyHorizontalScrollViewport(): HTMLElement {
    return this._eBodyHorizontalScrollViewport;
  }

  set eBodyHorizontalScrollViewport(value: HTMLElement) {
    this._eBodyHorizontalScrollViewport = value;
    this.checkIfReady();
  }

  get eBodyHorizontalScrollContainer(): HTMLElement {
    return this._eBodyHorizontalScrollContainer;
  }

  set eBodyHorizontalScrollContainer(value: HTMLElement) {
    this._eBodyHorizontalScrollContainer = value;
    this.checkIfReady();
  }

  get eHeaderViewport(): HTMLElement {
    return this._eHeaderViewport;
  }

  set eHeaderViewport(value: HTMLElement) {
    this._eHeaderViewport = value;
    this.checkIfReady();
  }

  get eHeaderContainer(): HTMLElement {
    return this._eHeaderContainer;
  }

  set eHeaderContainer(value: HTMLElement) {
    this._eHeaderContainer = value;
    this.checkIfReady();
  }

  get lastHorizontalScrollElement(): HTMLElement | undefined | null {
    return this._lastHorizontalScrollElement;
  }

  set lastHorizontalScrollElement(value: HTMLElement | undefined | null) {
    this._lastHorizontalScrollElement = value;
  }

  get eFullWidthContainer(): HTMLElement {
    return this._eFullWidthContainer;
  }

  set eFullWidthContainer(value: HTMLElement) {
    this._eFullWidthContainer = value;
    this.checkIfReady();
  }

  get isReady(): Observable<boolean> {
    return this._isReady.asObservable();
  }

  // method will call itself if no available width. this covers if the grid
  // isn't visible, but is just about to be visible.
  public sizeColumnsToFit(nextTimeout?: number) {
    // If there is a scrollbar, we need to remove its size from the available grid width.
    const availableWidth = this.eBodyViewport.clientWidth - this.scrollbarHelper.getWidth();

    if (availableWidth > 0) {
      this.columnService.sizeColumnsToFit(availableWidth);
      return;
    }

    if (nextTimeout === undefined) {
      window.setTimeout(() => {
        this.sizeColumnsToFit(100);
      }, 0);
    } else if (nextTimeout === 100) {
      window.setTimeout(() => {
        this.sizeColumnsToFit(500);
      }, 100);
    } else if (nextTimeout === 500) {
      window.setTimeout(() => {
        this.sizeColumnsToFit(-1);
      }, 500);
    } else {
      console.warn(
        'ag-Grid: tried to call sizeColumnsToFit() but the grid is coming back with ' +
          'zero width, maybe the grid is not visible yet on the screen?'
      );
    }
  }

  // used by autoWidthCalculator and autoHeightCalculator
  getCenterContainer(): HTMLElement {
    return this._eCenterContainer;
  }

  getDropTargetBodyContainers(): HTMLElement[] {
    return [this._eCenterViewportVsClipper];
  }

  getCenterViewportScrollLeft(): number {
    // we defer to a util, as how you calculated scrollLeft when doing RTL depends on the browser
    return DatagridUtils.getScrollLeft(this._eCenterViewportVsClipper, false);
  }

  getCenterWidth(): number {
    return this._eCenterViewportVsClipper.clientWidth;
  }

  setHorizontalScrollPosition(hScrollPosition: number): void {
    this.eCenterViewportVsClipper.scrollLeft = hScrollPosition;

    this.doHorizontalScroll(hScrollPosition);
  }

  scrollHorizontally(pixels: number): number {
    const oldScrollPosition = this.eCenterViewportVsClipper.scrollLeft;

    this.setHorizontalScrollPosition(oldScrollPosition + pixels);
    return this.eCenterViewportVsClipper.scrollLeft - oldScrollPosition;
  }

  horizontallyScrollHeaderCenterAndFloatingCenter(scrollLeft?: number): void {
    if (scrollLeft === undefined || scrollLeft === null) {
      scrollLeft = this.getCenterViewportScrollLeft();
    }

    const offset = -scrollLeft;
    const { clientWidth, scrollWidth } = this.eCenterViewportVsClipper; // this._eCenterViewport;
    const scrollWentPastBounds = Math.abs(offset) + clientWidth > scrollWidth;

    if (scrollWentPastBounds || offset > 0) {
      return;
    }
    const partner =
      this.lastHorizontalScrollElement === this.eCenterViewportVsClipper
        ? this.eBodyHorizontalScrollViewport
        : this.eCenterViewportVsClipper;
    DatagridUtils.setScrollLeft(partner, scrollLeft, false);
    DatagridUtils.setScrollLeft(this.eHeaderViewport, scrollLeft, false);
    // Footer scroll (if any footer displayed)
    if (this.eFooterViewport) {
      DatagridUtils.setScrollLeft(this.eFooterViewport, scrollLeft, false);
    }
  }

  onFakeHorizontalScroll(): void {
    if (!this.isControllingScroll(this.eBodyHorizontalScrollViewport)) {
      return;
    }
    this.onBodyHorizontalScroll(this.eBodyHorizontalScrollViewport);
  }

  onCenterViewportScroll(): void {
    if (!this.isControllingScroll(this.eCenterViewportVsClipper)) {
      return;
    }
    this.onBodyHorizontalScroll(this.eCenterViewportVsClipper);
  }

  onFooterViewportScroll(): void {
    if (!this.isControllingScroll(this.eFooterViewport)) {
      return;
    }
    this.onBodyHorizontalScroll(this.eFooterViewport);
  }

  onVerticalScroll(): void {
    this.scrollTop = this.eBodyViewport.scrollTop;
    const event: BodyScrollEvent = {
      type: FuiDatagridEvents.EVENT_BODY_SCROLL,
      api: this.gridApi,
      columnApi: this.columnApi,
      direction: 'vertical',
      left: this.scrollLeft,
      top: this.scrollTop
    };
    this.eventService.dispatchEvent(event);
  }

  setCenterContainerSize(): void {
    const totalWidth = this.columnService.getTotalColumnWidth();
    if (this.isReady && totalWidth) {
      this.renderer.setStyle(this.eCenterContainer, 'width', totalWidth + 'px');
    }
  }

  private onBodyHorizontalScroll(eSource: HTMLElement): void {
    const { scrollWidth, clientWidth } = this.eCenterViewportVsClipper;
    // in chrome, fractions can be in the scroll left, eg 250.342234 - which messes up our 'scrollWentPastBounds'
    // formula. so we floor it to allow the formula to work.
    const scrollLeft = Math.floor(DatagridUtils.getScrollLeft(eSource, false));

    // touch devices allow elastic scroll - which temporally scrolls the panel outside of the viewport
    // (eg user uses touch to go to the left of the grid, but drags past the left, the rows will actually
    // scroll past the left until the user releases the mouse). when this happens, we want ignore the scroll,
    // as otherwise it was causing the rows and header to flicker.
    const scrollWentPastBounds = scrollLeft < 0 || scrollLeft + clientWidth > scrollWidth;

    if (scrollWentPastBounds) {
      return;
    }

    this.doHorizontalScroll(scrollLeft);
    this.resetLastHorizontalScrollElementDebounce();
  }

  private isControllingScroll(eDiv: HTMLElement): boolean {
    if (!this.lastHorizontalScrollElement) {
      this.lastHorizontalScrollElement = eDiv;
      return true;
    }
    return eDiv === this.lastHorizontalScrollElement;
  }

  private resetLastHorizontalScrollElement() {
    this.lastHorizontalScrollElement = null;
  }

  private doHorizontalScroll(scrollLeft: number): void {
    this.scrollLeft = scrollLeft;

    const event: BodyScrollEvent = {
      type: FuiDatagridEvents.EVENT_BODY_SCROLL,
      api: this.gridApi,
      columnApi: this.columnApi,
      direction: 'horizontal',
      left: this.scrollLeft,
      top: this.scrollTop
    };
    this.eventService.dispatchEvent(event);
    this.horizontallyScrollHeaderCenterAndFloatingCenter(scrollLeft);
  }

  private checkIfReady(): void {
    if (
      this.eHeaderRoot &&
      this.eBodyViewport &&
      this.eCenterContainer &&
      this.eHeaderViewport &&
      this.eCenterViewport &&
      this.eCenterColsClipper &&
      this.eHorizontalScrollBody &&
      this.eHeaderContainer &&
      this.eBodyHorizontalScrollViewport &&
      this.eBodyHorizontalScrollContainer &&
      this.eFullWidthContainer &&
      this.virtualScrollViewport &&
      this.eCenterViewportVsClipper
    ) {
      this.setReady();
    }
  }

  private setReady(): void {
    this._isReady.next(true);
  }
}
