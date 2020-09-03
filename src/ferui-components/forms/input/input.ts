import { Directive, ElementRef, Injector, Optional, Renderer2, Self, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';

import { WrappedFormControl } from '../common/wrapped-control';

import { FuiInputContainerComponent } from './input-container';

@Directive({
  selector: '[fuiInput]',
  host: {
    '[class.fui-input]': 'true',
    '[class.fui-layout-small]': 'layout === fuiFormLayoutEnum.SMALL'
  }
})
export class FuiInputDirective extends WrappedFormControl<FuiInputContainerComponent> {
  protected index = 1;

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef
  ) {
    super(vcr, FuiInputContainerComponent, injector, control, renderer, el);
  }
}
