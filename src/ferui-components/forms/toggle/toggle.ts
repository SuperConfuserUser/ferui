import { Directive, ElementRef, Injector, Optional, Renderer2, Self, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';

import { WrappedFormControl } from '../common/wrapped-control';

import { FuiToggleWrapperComponent } from './toggle-wrapper';

@Directive({ selector: '[fuiToggle]' })
export class FuiToggleDirective extends WrappedFormControl<FuiToggleWrapperComponent> {
  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self() @Optional() control: NgControl,
    renderer: Renderer2,
    el: ElementRef
  ) {
    super(vcr, FuiToggleWrapperComponent, injector, control, renderer, el);
  }
}
