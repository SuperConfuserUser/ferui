import { Component, ContentChild, Optional } from '@angular/core';

import { FuiHelperDirective } from '../../helper/fui-helper-directive';
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
    <ng-content select="[fuiHelper]"></ng-content>
    <label [for]="controlIdService.idChange | async" *ngIf="!label"></label>
  `,
  host: {
    '[class.fui-radio-wrapper]': 'true',
    '[class.has-fui-helper]': '!!fuiHelper'
  },
  providers: [ControlIdService]
})
export class FuiRadioWrapperComponent implements DynamicWrapper {
  _dynamic = false;
  @ContentChild(FuiLabelDirective) label: FuiLabelDirective;
  @ContentChild(FuiHelperDirective) fuiHelper: FuiHelperDirective;

  constructor(@Optional() public formLayoutService: FuiFormLayoutService, public controlIdService: ControlIdService) {}

  controlLayout(): FuiFormLayoutEnum {
    if (!this.formLayoutService) {
      return null;
    }
    return this.formLayoutService.layout;
  }
}
