import { Directive, ElementRef, Injector, Optional, Renderer2, Self, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';

import { WrappedFormControl } from '../common/wrapped-control';

import { FuiCheckboxWrapperComponent } from './checkbox-wrapper';

@Directive({ selector: '[fuiCheckbox]' })
export class FuiCheckboxDirective extends WrappedFormControl<FuiCheckboxWrapperComponent> {
  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef
  ) {
    super(vcr, FuiCheckboxWrapperComponent, injector, control, renderer, el);
  }
}
