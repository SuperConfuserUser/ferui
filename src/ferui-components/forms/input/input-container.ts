import { Subscription } from 'rxjs';

import { Component, ContentChild, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';

import { FormControlClass } from '../../utils/form-control-class/form-control-class';
import { DynamicWrapper } from '../../utils/host-wrapping/dynamic-wrapper';
import { IfErrorService } from '../common/if-error/if-error.service';
import { FuiLabelDirective } from '../common/label';
import { FuiFormLayoutEnum } from '../common/layout.enum';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { FocusService } from '../common/providers/focus.service';
import { FuiFormLayoutService } from '../common/providers/form-layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { PlaceholderService } from '../common/providers/placeholder.service';
import { RequiredControlService } from '../common/providers/required-control.service';

@Component({
  selector: 'fui-input-container',
  template: `
    <div class="fui-control-container" [ngClass]="controlClass()">
      <div class="fui-input-wrapper">
        <ng-content select="[fuiLabel]"></ng-content>
        <ng-content select="[fuiInput]"></ng-content>
        <label class="fui-control-icons">
          <clr-icon *ngIf="invalid" class="fui-error-icon is-red" shape="fui-error" aria-hidden="true"></clr-icon>
        </label>
        <fui-default-control-error [on]="invalid">
          <ng-content select="fui-control-error" *ngIf="invalid"></ng-content>
        </fui-default-control-error>
      </div>
    </div>
  `,
  host: {
    '[class.fui-form-control]': 'true',
    '[class.fui-form-control-small]': 'controlLayout() === formLayoutService.fuiFormLayoutEnum.SMALL',
    '[class.fui-form-control-disabled]': 'control?.disabled'
  },
  providers: [
    IfErrorService,
    NgControlService,
    ControlIdService,
    ControlClassService,
    PlaceholderService,
    FocusService,
    RequiredControlService,
    FuiFormLayoutService
  ]
})
export class FuiInputContainerComponent implements DynamicWrapper, OnDestroy {
  _dynamic = false;
  invalid = false;
  control: NgControl;

  @ContentChild(FuiLabelDirective) label: FuiLabelDirective;

  private focus: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private ifErrorService: IfErrorService,
    private controlClassService: ControlClassService,
    private ngControlService: NgControlService,
    private focusService: FocusService,
    public formLayoutService: FuiFormLayoutService
  ) {
    this.subscriptions.push(
      this.ifErrorService.statusChanges.subscribe(invalid => {
        this.invalid = invalid;
      })
    );
    this.subscriptions.push(
      this.ngControlService.controlChanges.subscribe(control => {
        this.control = control;
      })
    );
    this.subscriptions.push(
      this.focusService.focusChange.subscribe(state => {
        this.focus = state;
      })
    );
  }

  controlClass() {
    return this.controlClassService.controlClass(
      this.invalid,
      FormControlClass.extractControlClass(this.control, this.label, this.focus)
    );
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.map(sub => sub.unsubscribe());
    }
  }

  controlLayout(): FuiFormLayoutEnum {
    return this.formLayoutService.layout;
  }
}
