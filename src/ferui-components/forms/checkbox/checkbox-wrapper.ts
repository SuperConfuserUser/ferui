import { Subscription } from 'rxjs';

import { ChangeDetectorRef, Component, ContentChild, OnDestroy, OnInit, Optional } from '@angular/core';

import { DynamicWrapper } from '../../utils/host-wrapping/dynamic-wrapper';
import { FuiLabelDirective } from '../common/label';
import { FuiFormLayoutEnum } from '../common/layout.enum';
import { ControlIdService } from '../common/providers/control-id.service';
import { FuiFormLayoutService } from '../common/providers/form-layout.service';

import { FuiCheckboxService, FuiCheckboxStateEnum } from './checkbox.service';

@Component({
  selector: 'fui-checkbox-wrapper',
  template: `
    <ng-content select="[fuiCheckbox]"></ng-content>
    <ng-content select="label"></ng-content>
    <label *ngIf="!label"></label>
    <div
      class="checkbox-holder"
      [class.checked]="checkboxState === fuiCheckboxStateEnum.CHECKED"
      [class.indeterminate]="checkboxState === fuiCheckboxStateEnum.INDETERMINATE"
    >
      <clr-icon class="fui-tick" *ngIf="checkboxState === fuiCheckboxStateEnum.CHECKED" shape="fui-tick"></clr-icon>
      <clr-icon class="fui-less" *ngIf="checkboxState === fuiCheckboxStateEnum.INDETERMINATE" shape="fui-less"></clr-icon>
    </div>
  `,
  host: {
    '[class.fui-checkbox-wrapper]': 'true'
  },
  providers: [ControlIdService, FuiCheckboxService]
})
export class FuiCheckboxWrapperComponent implements DynamicWrapper, OnInit, OnDestroy {
  checkboxState: FuiCheckboxStateEnum;
  _dynamic = false;
  fuiCheckboxStateEnum: typeof FuiCheckboxStateEnum = FuiCheckboxStateEnum;

  @ContentChild(FuiLabelDirective) label: FuiLabelDirective;

  private checkboxStateSubscription: Subscription;

  constructor(
    @Optional() public formLayoutService: FuiFormLayoutService,
    private checkboxService: FuiCheckboxService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkboxStateSubscription = this.checkboxService.checkboxChange.subscribe(state => {
      this.checkboxState = state;
      // We need to manually mark it for change because in case we're running the checkbox within a ChangeDetectionStrategy.OnPush
      // component, the update is not triggered.
      this.cd.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.checkboxStateSubscription) {
      this.checkboxStateSubscription.unsubscribe();
    }
  }

  controlLayout(): FuiFormLayoutEnum {
    if (!this.formLayoutService) {
      return null;
    }
    return this.formLayoutService.layout;
  }
}
