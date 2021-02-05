import { BehaviorSubject } from 'rxjs';

import {
  Directive,
  ElementRef,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { WrappedFormControl } from '../common/wrapped-control';

import { FuiPasswordContainerComponent, ToggleService } from './password-container';

@Directive({
  selector: '[fuiPassword]',
  host: {
    '[class.fui-input]': 'true',
    '[class.fui-layout-small]': 'layout === fuiFormLayoutEnum.SMALL'
  }
})
export class FuiPasswordDirective extends WrappedFormControl<FuiPasswordContainerComponent> implements OnInit, OnDestroy {
  protected index = 1;

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self() @Optional() control: NgControl,
    renderer: Renderer2,
    el: ElementRef,
    @Optional()
    @Inject(ToggleService)
    private toggleService: BehaviorSubject<boolean>
  ) {
    super(vcr, FuiPasswordContainerComponent, injector, control, renderer, el);

    this.subscriptions.push(
      this.toggleService.subscribe(toggle => {
        renderer.setProperty(el.nativeElement, 'type', toggle ? 'text' : 'password');
      })
    );
  }
}
