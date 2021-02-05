import { Component, ContentChild, Optional } from '@angular/core';

import { FuiHelperDirective } from '../../helper/fui-helper-directive';
import { DynamicWrapper } from '../../utils/host-wrapping/dynamic-wrapper';
import { FuiLabelDirective } from '../common/label';
import { FuiFormLayoutEnum } from '../common/layout.enum';
import { ControlIdService } from '../common/providers/control-id.service';
import { FuiFormLayoutService } from '../common/providers/form-layout.service';

@Component({
  selector: 'fui-toggle-wrapper',
  template: `
    <ng-content select="[fuiToggle]"></ng-content>
    <ng-content select="[fuiLabel]"></ng-content>
    <ng-content select="[fuiHelper]"></ng-content>
    <label *ngIf="!label"></label>
  `,
  host: {
    '[class.fui-toggle-wrapper]': 'true',
    '[class.has-fui-helper]': '!!fuiHelper'
  },
  providers: [ControlIdService]
})
export class FuiToggleWrapperComponent implements DynamicWrapper {
  _dynamic = false;
  @ContentChild(FuiLabelDirective) label: FuiLabelDirective;
  @ContentChild(FuiHelperDirective) fuiHelper: FuiHelperDirective;

  constructor(@Optional() public formLayoutService: FuiFormLayoutService) {}

  controlLayout(): FuiFormLayoutEnum {
    if (!this.formLayoutService) {
      return null;
    }
    return this.formLayoutService.layout;
  }
}
