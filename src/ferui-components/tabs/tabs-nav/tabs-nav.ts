import { Subject } from 'rxjs';

import { FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { ViewportRuler } from '@angular/cdk/scrolling';
import {
  AfterContentChecked,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Optional,
  QueryList,
  ViewEncapsulation,
  forwardRef
} from '@angular/core';

import { CanDisable, CanDisableCtor, mixinDisabled } from '../../utils/common-behaviors/disabled';
import { HasTabIndex, HasTabIndexCtor, mixinTabIndex } from '../../utils/common-behaviors/tabindex';

/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with FerUI styling for tabs.
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: '[fui-tabs-nav]',
  exportAs: 'fuiTabsNav',
  templateUrl: 'tabs-nav.html',
  host: { class: 'fui-tabs-nav' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuiTabsNavComponent implements AfterContentChecked, OnDestroy {
  /** Query list of all tab links of the tab navigation. */
  // tslint:disable-next-line:no-forward-ref
  @ContentChildren(forwardRef(() => FuiTabsLinkDirective), { descendants: true })
  _tabLinks: QueryList<FuiTabsLinkDirective>;

  /** Subject that emits when the component has been destroyed. */
  private readonly _onDestroy = new Subject<void>();

  private _activeLinkChanged: boolean;
  private _activeLinkElement: ElementRef<HTMLElement> | null;

  constructor(
    elementRef: ElementRef,
    @Optional() private _dir: Directionality,
    private _changeDetectorRef: ChangeDetectorRef,
    private _viewportRuler: ViewportRuler
  ) {}

  /**
   * Notifies the component that the active link has been changed.
   * @breaking-change 8.0.0 `element` parameter to be removed.
   */
  updateActiveLink(element: ElementRef) {
    // Note: keeping the `element` for backwards-compat, but isn't being used for anything.
    // @breaking-change 8.0.0
    this._activeLinkChanged = !!element;
    this._changeDetectorRef.markForCheck();
  }

  /** Checks if the active link has been changed and, if so, will update the ink bar. */
  ngAfterContentChecked(): void {
    if (this._activeLinkChanged) {
      const activeTab = this._tabLinks.find(tab => tab.active);

      this._activeLinkElement = activeTab ? activeTab._elementRef : null;
      this._activeLinkChanged = false;
    }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}

// Boilerplate for applying mixins to FuiTabsLinkDirective.
export class FuiTabsLinkBase {}
export const _FuiTabsLinkMixinBase: HasTabIndexCtor & CanDisableCtor & typeof FuiTabsLinkBase = mixinTabIndex(
  mixinDisabled(FuiTabsLinkBase),
  1
);

/**
 * Link inside of a `fui-tabs-nav`.
 */
@Directive({
  selector: '[fui-tabs-link], [fuiTabsLink]',
  exportAs: 'fuiTabsLink',
  inputs: ['disabled', 'tabIndex'],
  host: {
    class: 'fui-tabs-link btn',
    '[attr.aria-current]': 'active',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.tabIndex]': 'tabIndex',
    '[class.btn-link]': '!active',
    '[class.btn-primary]': 'active',
    '[class.fui-tab-disabled]': 'disabled',
    '[class.fui-tab-label-active]': 'active'
  }
})
export class FuiTabsLinkDirective extends _FuiTabsLinkMixinBase implements OnDestroy, CanDisable, HasTabIndex {
  /** Whether the link is active. */
  @Input()
  get active(): boolean {
    return this._isActive;
  }

  set active(value: boolean) {
    if (value !== this._isActive) {
      this._isActive = value;
      this._tabsNav.updateActiveLink(this._elementRef);
    }
  }

  /** Whether the tab link is active or not. */
  protected _isActive: boolean = false;

  constructor(
    private _tabsNav: FuiTabsNavComponent,
    public _elementRef: ElementRef,
    @Optional()
    // tslint:disable-next-line:no-attribute-decorator
    @Attribute('tabindex')
    tabIndex: string,
    private _focusMonitor: FocusMonitor
  ) {
    super();
    this.tabIndex = parseInt(tabIndex, 10) || 0;

    if (_focusMonitor) {
      _focusMonitor.monitor(_elementRef);
    }
  }

  ngOnDestroy() {
    if (this._focusMonitor) {
      this._focusMonitor.stopMonitoring(this._elementRef);
    }
  }
}
