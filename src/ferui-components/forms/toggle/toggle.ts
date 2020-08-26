import { Directive, Renderer2, ElementRef, Injector, Self, Optional, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FuiToggleWrapper } from './toggle-wrapper';
import { WrappedFormControl } from '../common/wrapped-control';

@Directive({ selector: '[fuiToggle]' })
export class FuiToggle extends WrappedFormControl<FuiToggleWrapper> {
  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef
  ) {
    super(vcr, FuiToggleWrapper, injector, control, renderer, el);
  }
}
