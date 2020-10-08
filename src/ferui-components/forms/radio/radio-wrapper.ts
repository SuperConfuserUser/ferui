import { Component, ContentChild, Optional } from '@angular/core';

import { DynamicWrapper } from '../../utils/host-wrapping/dynamic-wrapper';
import { FuiLabelDirective } from '../common/label';
import { FuiFormLayoutEnum } from '../common/layout.enum';
import { ControlIdService } from '../common/providers/control-id.service';
import { FuiFormLayoutService } from '../common/providers/form-layout.service';

@Component({
  selector: 'fui-radio-wrapper',
  template: `
    <ng-content select="[fuiRadio]"></ng-content>
    <ng-content select="[fuiLabel]"></ng-content>
    <label *ngIf="!label"></label>
  `,
  host: {
    '[class.fui-radio-wrapper]': 'true'
  },
  providers: [ControlIdService]
})
export class FuiRadioWrapperComponent implements DynamicWrapper {
  _dynamic = false;
  @ContentChild(FuiLabelDirective) label: FuiLabelDirective;

  constructor(@Optional() public formLayoutService: FuiFormLayoutService) {}

  controlLayout(): FuiFormLayoutEnum {
    if (!this.formLayoutService) {
      return null;
    }
    return this.formLayoutService.layout;
  }
}
