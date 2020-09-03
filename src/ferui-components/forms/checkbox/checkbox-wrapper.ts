import { Component, ContentChild, Optional } from '@angular/core';

import { DynamicWrapper } from '../../utils/host-wrapping/dynamic-wrapper';
import { FuiLabelDirective } from '../common/label';
import { FuiFormLayoutEnum } from '../common/layout.enum';
import { ControlIdService } from '../common/providers/control-id.service';
import { FuiFormLayoutService } from '../common/providers/form-layout.service';

@Component({
  selector: 'fui-checkbox-wrapper',
  template: `
    <ng-content select="[fuiCheckbox]"></ng-content>
    <ng-content select="label"></ng-content>
    <label *ngIf="!label"></label>
  `,
  host: {
    '[class.fui-checkbox-wrapper]': 'true'
  },
  providers: [ControlIdService]
})
export class FuiCheckboxWrapperComponent implements DynamicWrapper {
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
