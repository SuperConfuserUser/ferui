import { Directive, ElementRef, Injector, Optional, Renderer2, Self, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';

import { WrappedFormControl } from '../common/wrapped-control';

import { FuiRadioWrapperComponent } from './radio-wrapper';

@Directive({ selector: '[fuiRadio]' })
export class FuiRadioDirective extends WrappedFormControl<FuiRadioWrapperComponent> {
  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self() @Optional() control: NgControl,
    renderer: Renderer2,
    el: ElementRef
  ) {
    super(vcr, FuiRadioWrapperComponent, injector, control, renderer, el);
  }
}
