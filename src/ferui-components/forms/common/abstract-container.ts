import { Subscription } from 'rxjs';

import { ChangeDetectorRef, ContentChild, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';

import { FormControlClass } from '../../utils/form-control-class/form-control-class';
import { DynamicWrapper } from '../../utils/host-wrapping/dynamic-wrapper';

import { IfErrorService } from './if-error/if-error.service';
import { FuiLabelDirective } from './label';
import { FuiFormLayoutEnum } from './layout.enum';
import { ControlClassService } from './providers/control-class.service';
import { FocusService } from './providers/focus.service';
import { FuiFormLayoutService } from './providers/form-layout.service';
import { NgControlService } from './providers/ng-control.service';

/**
 * Abstract class for every form control container.
 */
export abstract class FuiFormAbstractContainer implements DynamicWrapper, OnDestroy {
  _dynamic = false;
  invalid = false;
  ngControl: NgControl;
  fuiFormLayoutEnum: typeof FuiFormLayoutEnum = FuiFormLayoutEnum;

  @ContentChild(FuiLabelDirective) label: FuiLabelDirective;

  protected focus = false;
  protected subscriptions: Subscription[] = [];
  protected ngControlValueChangeSub: Subscription;

  protected constructor(
    protected ifErrorService: IfErrorService,
    protected controlClassService: ControlClassService,
    protected ngControlService: NgControlService,
    protected focusService: FocusService,
    protected formLayoutService: FuiFormLayoutService,
    protected cd: ChangeDetectorRef
  ) {
    this.subscriptions.push(
      this.ifErrorService.statusChanges.subscribe(invalid => {
        this.onStatusChange(invalid);
      }),
      this.focusService.focusChange.subscribe(state => {
        this.onFocusChange(state);
      }),
      this.ngControlService.controlChanges.subscribe(control => {
        this.onNgControlChange(control);
      })
    );
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.map(sub => sub.unsubscribe());
    }
    if (this.ngControlValueChangeSub) {
      this.ngControlValueChangeSub.unsubscribe();
    }
  }

  /**
   * Retrieve the desired layout for the form control (can be default or small)
   */
  controlLayout(): FuiFormLayoutEnum {
    return this.formLayoutService.layout;
  }

  /**
   * Concat all possible classes for the control container depending on form control states.
   */
  controlClass(): string {
    return this.controlClassService.controlClass(
      this.invalid,
      FormControlClass.extractControlClass(this.ngControl, this.label, this.focus)
    );
  }

  /**
   *  Set the ngControl and markForCheck when the valueAccessor value changes.
   * @param control
   * @protected
   */
  protected onNgControlChange(control: NgControl): void {
    if (control) {
      this.ngControl = control;
      if (this.ngControlValueChangeSub) {
        this.ngControlValueChangeSub.unsubscribe();
      }
      this.ngControlValueChangeSub = this.ngControl.valueChanges.subscribe(() => {
        // This is important for controlClass() to run when the value of the input changes.
        this.cd.markForCheck();
      });
    }
  }

  /**
   * Set the focus status for the current form control.
   * @param state
   * @protected
   */
  protected onFocusChange(state: boolean) {
    this.focus = state;
  }

  /**
   * Set whether or not the form control is invalid.
   * @param invalid
   * @protected
   */
  protected onStatusChange(invalid: boolean) {
    this.invalid = invalid;
  }
}
