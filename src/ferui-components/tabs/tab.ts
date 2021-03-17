import { Subject } from 'rxjs';

import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';

import { CanDisable, CanDisableCtor, mixinDisabled } from '../utils/common-behaviors/disabled';

import { FuiTabContentDirective } from './tab-content';
import { FuiTabLabelDirective } from './tab-label';

// Boilerplate for applying mixins to FuiTabComponent.
export class FuiTabBase {}
export const _FuiTabMixinBase: CanDisableCtor & typeof FuiTabBase = mixinDisabled(FuiTabBase);

@Component({
  selector: 'fui-tab',
  templateUrl: 'tab.html',
  inputs: ['disabled'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'fuiTab'
})
export class FuiTabComponent extends _FuiTabMixinBase implements OnInit, OnChanges, OnDestroy, CanDisable {
  /** Content for the tab label given by `<ng-template fui-tab-label>`. */
  @ContentChild(FuiTabLabelDirective)
  templateLabel: FuiTabLabelDirective;

  /**
   * Template provided in the tab content that will be used if present, used to enable lazy-loading
   */
  @ContentChild(FuiTabContentDirective, { read: TemplateRef })
  _explicitContent: TemplateRef<any>;

  /** Template inside the FuiTabComponent view that contains an `<ng-content>`. */
  @ViewChild(TemplateRef)
  _implicitContent: TemplateRef<any>;

  /** Plain text label for the tab, used when there is no template label. */
  @Input('label')
  textLabel: string = '';

  /** Aria label for the tab. */
  @Input('aria-label')
  ariaLabel: string;

  /**
   * Reference to the element that the tab is labelled by.
   * Will be cleared if `aria-label` is set at the same time.
   */
  @Input('aria-labelledby')
  ariaLabelledby: string;

  get content(): TemplatePortal | null {
    return this._contentPortal;
  }

  /** Whether the tab is currently active. */
  isActive = false;

  /** Emits whenever the internal state of the tab changes. */
  readonly _stateChanges = new Subject<void>();

  /** Portal that will be the hosted content of the tab */
  private _contentPortal: TemplatePortal | null = null;

  constructor(private _viewContainerRef: ViewContainerRef) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.hasOwnProperty('textLabel') ||
      changes.hasOwnProperty('disabled') ||
      changes.hasOwnProperty('ariaLabel') ||
      changes.hasOwnProperty('ariaLabelledby')
    ) {
      // We notify other components that the value for inputs have changed.
      this._stateChanges.next();
    }
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
  }

  ngOnInit(): void {
    this._contentPortal = new TemplatePortal(this._explicitContent || this._implicitContent, this._viewContainerRef);
  }
}
