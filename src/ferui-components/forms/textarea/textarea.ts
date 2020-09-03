import { Directive, ElementRef, Injector, Optional, Renderer2, Self, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';

import { WrappedFormControl } from '../common/wrapped-control';

import { FuiTextareaContainerComponent } from './textarea-container';

@Directive({ selector: '[fuiTextarea]', host: { '[class.fui-textarea]': 'true' } })
export class FuiTextareaDirective extends WrappedFormControl<FuiTextareaContainerComponent> {
  protected index = 1;

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self() @Optional() control: NgControl,
    renderer: Renderer2,
    el: ElementRef
  ) {
    super(vcr, FuiTextareaContainerComponent, injector, control, renderer, el);
  }
}
