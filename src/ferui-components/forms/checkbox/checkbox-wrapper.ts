import { Subscription } from 'rxjs';

import { Component, ContentChild, OnDestroy, OnInit, Optional } from '@angular/core';

import { DynamicWrapper } from '../../utils/host-wrapping/dynamic-wrapper';
import { FuiLabelDirective } from '../common/label';
import { FuiFormLayoutEnum } from '../common/layout.enum';
import { ControlIdService } from '../common/providers/control-id.service';
import { FuiFormLayoutService } from '../common/providers/form-layout.service';

import { FuiCheckboxService, FuiCheckboxState } from './checkbox.service';

@Component({
  selector: 'fui-checkbox-wrapper',
  template: `
    <ng-content select="[fuiCheckbox]"></ng-content>
    <ng-content select="label"></ng-content>
    <label *ngIf="!label"></label>
    <div
      class="checkbox-holder"
      [ngClass]="{
        checked: checkboxState === fuiCheckboxState.CHECKED,
        indeterminate: checkboxState === fuiCheckboxState.INDETERMINATE
      }"
    >
      <clr-icon class="fui-tick" *ngIf="checkboxState === fuiCheckboxState.CHECKED" shape="fui-tick"></clr-icon>
      <clr-icon class="fui-less" *ngIf="checkboxState === fuiCheckboxState.INDETERMINATE" shape="fui-less"></clr-icon>
    </div>
  `,
  host: {
    '[class.fui-checkbox-wrapper]': 'true'
  },
  providers: [ControlIdService, FuiCheckboxService]
})
export class FuiCheckboxWrapperComponent implements DynamicWrapper, OnInit, OnDestroy {
  checkboxState: FuiCheckboxState;
  fuiCheckboxState: typeof FuiCheckboxState = FuiCheckboxState;
  _dynamic = false;
  @ContentChild(FuiLabelDirective) label: FuiLabelDirective;
  private checkboxStateSubscription: Subscription;

  constructor(@Optional() public formLayoutService: FuiFormLayoutService, private checkboxService: FuiCheckboxService) {}

  controlLayout(): FuiFormLayoutEnum {
    if (!this.formLayoutService) {
      return null;
    }
    return this.formLayoutService.layout;
  }

  ngOnInit(): void {
    this.checkboxStateSubscription = this.checkboxService.checkboxChange.subscribe(state => {
      this.checkboxState = state;
    });
  }

  ngOnDestroy(): void {
    if (this.checkboxStateSubscription) {
      this.checkboxStateSubscription.unsubscribe();
    }
  }
}
