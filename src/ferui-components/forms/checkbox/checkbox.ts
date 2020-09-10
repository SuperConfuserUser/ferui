import { Subscription } from 'rxjs';

import {
  Directive,
  ElementRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { WrappedFormControl } from '../common/wrapped-control';

import { FuiCheckboxWrapperComponent } from './checkbox-wrapper';
import { FuiCheckboxService, FuiCheckboxState } from './checkbox.service';

@Directive({ selector: '[fuiCheckbox]' })
export class FuiCheckboxDirective extends WrappedFormControl<FuiCheckboxWrapperComponent> implements OnInit, OnDestroy {
  @Input() set indeterminate(indeterminate: boolean) {
    this._indeterminate = indeterminate;
    if (this.checkboxService) {
      this.updateState();
    }
  }
  private _indeterminate: boolean;
  private isChecked: boolean;
  private control: NgControl;
  private controlSubscription: Subscription;
  private checkboxService: FuiCheckboxService;

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
    this.control = control;
  }

  ngOnInit() {
    super.ngOnInit();
    this.checkboxService = this.getProviderFromContainer(FuiCheckboxService);
    this.controlSubscription = this.control.valueChanges.subscribe((isChecked: boolean) => {
      this.isChecked = isChecked;
      if (this.checkboxService) {
        this.updateState();
      }
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.controlSubscription) {
      this.controlSubscription.unsubscribe();
    }
  }

  /**
   * Updates the checkbox state through the checkbox service to notify parent wrapper
   */
  private updateState(): void {
    this.checkboxService.checkboxState =
      this.isChecked && this._indeterminate === true
        ? FuiCheckboxState.INDETERMINATE
        : this.isChecked && !(this._indeterminate === true)
        ? FuiCheckboxState.CHECKED
        : FuiCheckboxState.NOT_CHECKED;
  }
}
