import { Subscription, merge } from 'rxjs';

import { coerceNumberProperty } from '@angular/cdk/coercion';
import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { FuiTabComponent } from './tab';
import { FuiTabHeaderComponent } from './tab-header';

/** Used to generate unique ID's for each tab component */
let nextId = 0;

/** A simple change event emitted on focus or selection changes. */
export class FuiTabChangeEvent {
  /** Index of the currently-selected tab. */
  index: number;
  /** Reference to the currently-selected tab. */
  tab: FuiTabComponent;
}

/** Possible positions for the tab header. */
export type FuiTabHeaderPosition = 'above' | 'below';

/**
 * The fui-tabs component that wrap the fui-tab.
 */
@Component({
  selector: 'fui-tabs',
  exportAs: 'fuiTabs',
  templateUrl: 'tabs.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'fui-tabs',
    '[class.fui-tabs-inverted-header]': 'headerPosition === "below"'
  }
})
export class FuiTabsComponent implements AfterContentInit, AfterContentChecked, OnDestroy {
  /** Output to enable support for two-way binding on `[(selectedIndex)]` */
  @Output() readonly selectedIndexChange: EventEmitter<number> = new EventEmitter<number>();

  /** Event emitted when focus has changed within a tab group. */
  @Output() readonly focusChange: EventEmitter<FuiTabChangeEvent> = new EventEmitter<FuiTabChangeEvent>();

  /** Event emitted when the tab selection has changed. */
  @Output() readonly selectedTabChange: EventEmitter<FuiTabChangeEvent> = new EventEmitter<FuiTabChangeEvent>(true);

  @ContentChildren(FuiTabComponent) _tabs: QueryList<FuiTabComponent>;

  @ViewChild('tabHeader') _tabHeader: FuiTabHeaderComponent;

  /** Position of the tab header. */
  @Input() headerPosition: FuiTabHeaderPosition = 'above';

  /** The index of the active tab. */
  @Input()
  get selectedIndex(): number | null {
    return this._selectedIndex;
  }

  set selectedIndex(value: number | null) {
    this._indexToSelect = coerceNumberProperty(value, null);
  }

  private _selectedIndex: number | null = null;

  /** The tab index that should be selected after the content has been checked. */
  private _indexToSelect: number | null = 0;

  /** Subscription to tabs being added/removed. */
  private tabsSubscription = Subscription.EMPTY;

  /** Subscription to changes in the tab labels. */
  private tabLabelSubscription = Subscription.EMPTY;
  private readonly groupId: number;

  constructor(elementRef: ElementRef, private _changeDetectorRef: ChangeDetectorRef) {
    this.groupId = nextId++;
  }

  /**
   * After the content is checked, this component knows what tabs have been defined
   * and what the selected index should be. This is where we can know exactly what position
   * each tab should be in according to the new selected index.
   */
  ngAfterContentChecked() {
    // Don't clamp the `indexToSelect` immediately in the setter because it can happen that
    // the amount of tabs changes before the actual change detection runs.
    const indexToSelect = (this._indexToSelect = this.clampTabIndex(this._indexToSelect));

    // If there is a change in selected index, emit a change event. Should not trigger if
    // the selected index has not yet been initialized.
    if (this._selectedIndex !== indexToSelect) {
      const isFirstRun = this._selectedIndex === null;

      if (!isFirstRun) {
        this.selectedTabChange.emit(this.createChangeEvent(indexToSelect));
      }

      // Changing these values after change detection has run
      // since the checked content may contain references to them.
      Promise.resolve().then(() => {
        this._tabs.forEach((tab, index) => (tab.isActive = index === indexToSelect));

        if (!isFirstRun) {
          this.selectedIndexChange.emit(indexToSelect);
        }
      });
    }
    if (this._selectedIndex !== indexToSelect) {
      this._selectedIndex = indexToSelect;
      this._changeDetectorRef.markForCheck();
    }
  }

  ngAfterContentInit() {
    this.subscribeToTabLabels();

    // Subscribe to changes in the amount of tabs, in order to be
    // able to re-render the content as new tabs are added or removed.
    this.tabsSubscription = this._tabs.changes.subscribe(() => {
      const indexToSelect = this.clampTabIndex(this._indexToSelect);
      const tabs = this._tabs.toArray();

      // Maintain the previously-selected tab if a new tab is added or removed and there is no
      // explicit change that selects a different tab.
      if (indexToSelect === this._selectedIndex) {
        for (let i = 0; i < tabs.length; i++) {
          if (tabs[i].isActive) {
            // Assign both to the `_indexToSelect` and `_selectedIndex` so we don't fire a changed
            // event, otherwise the consumer may end up in an infinite loop in some edge cases like
            // adding a tab within the `selectedIndexChange` event.
            this._indexToSelect = this._selectedIndex = i;
          }
        }
      }
      this.subscribeToTabLabels();
      this._changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy() {
    this.tabsSubscription.unsubscribe();
    this.tabLabelSubscription.unsubscribe();
  }

  _focusChanged(index: number) {
    this.focusChange.emit(this.createChangeEvent(index));
  }

  /** Returns a unique id for each tab label element */
  _getTabLabelId(i: number): string {
    return `fui-tab-label-${this.groupId}-${i}`;
  }

  /** Returns a unique id for each tab content element */
  _getTabContentId(id: number): string {
    return `fui-tab-content-${this.groupId}-${id}`;
  }

  /** Handle click events, setting new selected index if appropriate. */
  _handleClick(tab: FuiTabComponent, tabHeader: FuiTabHeaderComponent, index: number) {
    if (!tab.disabled) {
      this.selectedIndex = tabHeader.focusIndex = index;
    }
  }

  /** Retrieves the tabindex for the tab. */
  _getTabIndex(tab: FuiTabComponent, idx: number): number | null {
    if (tab.disabled) {
      return null;
    }
    return this.selectedIndex === idx ? 0 : -1;
  }

  private createChangeEvent(index: number): FuiTabChangeEvent {
    const event = new FuiTabChangeEvent();
    event.index = index;
    if (this._tabs && this._tabs.length) {
      event.tab = this._tabs.toArray()[index];
    }
    return event;
  }

  /**
   * Subscribes to changes in the tab labels. This is needed, because the @Input for the label is
   * on the FuiTabComponent component, whereas the data binding is inside the FuiTabsComponent. In order for the
   * binding to be updated, we need to subscribe to changes in it and trigger change detection
   * manually.
   */
  private subscribeToTabLabels() {
    if (this.tabLabelSubscription) {
      this.tabLabelSubscription.unsubscribe();
    }

    this.tabLabelSubscription = merge(...this._tabs.map(tab => tab._stateChanges)).subscribe(() =>
      this._changeDetectorRef.markForCheck()
    );
  }

  /** Clamps the given index to the bounds of 0 and the tabs length. */
  private clampTabIndex(index: number | null): number {
    // Note the `|| 0`, which ensures that values like NaN can't get through
    // and which would otherwise throw the component into an infinite loop
    // (since Math.max(NaN, 0) === NaN).
    return Math.min(this._tabs.length - 1, Math.max(index || 0, 0));
  }
}
