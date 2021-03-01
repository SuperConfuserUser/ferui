import { Directive, ElementRef, Host, Injector, OnInit, Optional, Renderer2, Self, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';

import { WrappedFormControl } from '../common/wrapped-control';

import { NgSelectComponent } from './ng-select/ng-select.component';
import { FuiSelectContainerComponent } from './select-container';
import { FuiSelectService } from './select.service';

@Directive({
  selector: '[fuiSelect]',
  host: {
    '[class.fui-select]': 'true',
    '[class.fui-layout-small]': 'layout === fuiFormLayoutEnum.SMALL'
  }
})
export class FuiSelectDirective extends WrappedFormControl<FuiSelectContainerComponent> implements OnInit {
  private selectService: FuiSelectService;

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self() @Optional() control: NgControl,
    renderer: Renderer2,
    el: ElementRef,
    @Host()
    @Self()
    @Optional()
    public ngSelect: NgSelectComponent
  ) {
    super(vcr, FuiSelectContainerComponent, injector, control, renderer, el);
    try {
      this.selectService = injector.get(FuiSelectService);
    } catch (e) {}
  }

  hasNgSelect(): boolean {
    return !!this.ngSelect;
  }

  ngOnInit() {
    super.ngOnInit();
    this.selectService = this.loadServiceFromParent<FuiSelectService>(this.selectService, FuiSelectService);

    if (this.selectService) {
      this.selectService.fuiSelect = this;
    }

    if (this.ngSelect) {
      this.ngSelect.tabIndex = this.tabindex;
    }
  }
}
