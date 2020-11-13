import { Directive, ElementRef, Injector, Optional, Renderer2, Self, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';

import { WrappedFormControl } from '../common/wrapped-control';

import { FuiSearchContainerComponent } from './search-container';

@Directive({
  selector: '[fuiSearch]',
  host: {
    '[class.fui-search]': 'true',
    '[class.fui-layout-small]': 'layout === fuiFormLayoutEnum.SMALL'
  }
})
export class FuiSearchDirective extends WrappedFormControl<FuiSearchContainerComponent> {
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
    super(vcr, FuiSearchContainerComponent, injector, control, renderer, el);
  }
}
