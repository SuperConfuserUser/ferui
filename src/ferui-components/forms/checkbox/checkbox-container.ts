import { Subscription } from 'rxjs';

import { Component, ContentChild, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

import { FormControlClass } from '../../utils/form-control-class/form-control-class';
import { IfErrorService } from '../common/if-error/if-error.service';
import { FuiLabelDirective } from '../common/label';
import { FuiFormLayoutEnum } from '../common/layout.enum';
import { ControlClassService } from '../common/providers/control-class.service';
import { FocusService } from '../common/providers/focus.service';
import { FuiFormLayoutService } from '../common/providers/form-layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { RequiredControlService } from '../common/providers/required-control.service';

@Component({
  selector: 'fui-checkbox-container',
  template: `
    <ng-content select="[fuiLabel]"></ng-content>
    <div class="fui-control-container" [ngClass]="controlClass()">
      <ng-content select="fui-checkbox-wrapper"></ng-content>
      <div class="fui-checkbox-subtext-wrapper">
        <clr-icon *ngIf="invalid" class="fui-error-icon is-red" shape="fui-error" aria-hidden="true"></clr-icon>
        <fui-default-control-error [on]="invalid">
          <ng-content select="fui-control-error" *ngIf="invalid"></ng-content>
        </fui-default-control-error>
      </div>
    </div>
  `,
  host: {
    '[class.fui-form-control]': 'true',
    '[class.fui-form-control-disabled]': 'control?.disabled',
    '[class.fui-form-control-small]': 'controlLayout() === formLayoutService.fuiFormLayoutEnum.SMALL'
  },
  providers: [NgControlService, ControlClassService, IfErrorService, FocusService, RequiredControlService, FuiFormLayoutService]
})
export class FuiCheckboxContainerComponent implements OnDestroy, OnInit {
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
      this.ngControlService.controlChanges.subscribe(control => {
        this.control = control;
      })
    );
  }

  ngOnInit() {
    this.subscriptions.push(
      this.ifErrorService.statusChanges.subscribe(invalid => {
        this.invalid = invalid;
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
    this.subscriptions.map(sub => sub.unsubscribe());
  }

  controlLayout(): FuiFormLayoutEnum {
    return this.formLayoutService.layout;
  }
}
