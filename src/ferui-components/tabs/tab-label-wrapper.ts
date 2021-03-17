import { Directive, ElementRef } from '@angular/core';

import { CanDisable, CanDisableCtor, mixinDisabled } from '../utils/common-behaviors/disabled';

// Boilerplate for applying mixins to FuiTabLabelWrapperDirective.
export class FuiTabLabelWrapperBase {}
export const _FuiTabLabelWrapperMixinBase: CanDisableCtor & typeof FuiTabLabelWrapperBase = mixinDisabled(FuiTabLabelWrapperBase);

/**
 * Used in the `fui-tabs` view to display tab labels.
 */
@Directive({
  selector: '[fuiTabLabelWrapper]',
  inputs: ['disabled'],
  host: {
    '[class.fui-tab-disabled]': 'disabled',
    '[attr.aria-disabled]': '!!disabled'
  }
})
export class FuiTabLabelWrapperDirective extends _FuiTabLabelWrapperMixinBase implements CanDisable {
  constructor(public elementRef: ElementRef) {
    super();
  }

  /** Sets focus on the wrapper element */
  focus(): void {
    this.elementRef.nativeElement.focus();
  }
}
