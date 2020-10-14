import { ChangeDetectorRef, Component } from '@angular/core';

import { FuiFormAbstractContainer } from '../common/abstract-container';
import { IfErrorService } from '../common/if-error/if-error.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { FocusService } from '../common/providers/focus.service';
import { FuiFormLayoutService } from '../common/providers/form-layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { RequiredControlService } from '../common/providers/required-control.service';

@Component({
  selector: 'fui-toggle-container',
  template: `
    <ng-content select="[fuiLabel]"></ng-content>
    <div class="fui-control-container" [ngClass]="controlClass()">
      <ng-content select="fui-toggle-wrapper"></ng-content>
      <div class="fui-toggle-subtext-wrapper">
        <clr-icon *ngIf="invalid" class="fui-error-icon is-red" shape="fui-error" aria-hidden="true"></clr-icon>
        <fui-default-control-error [on]="invalid">
          <ng-content select="fui-control-error" *ngIf="invalid"></ng-content>
        </fui-default-control-error>
      </div>
    </div>
  `,
  host: {
    '[class.fui-form-control]': 'true',
    '[class.fui-form-control-disabled]': 'ngControl?.disabled',
    '[class.fui-form-control-small]': 'controlLayout() === fuiFormLayoutEnum.SMALL'
  },
  providers: [NgControlService, ControlClassService, IfErrorService, FocusService, RequiredControlService, FuiFormLayoutService]
})
export class FuiToggleContainerComponent extends FuiFormAbstractContainer {
  constructor(
    ifErrorService: IfErrorService,
    controlClassService: ControlClassService,
    ngControlService: NgControlService,
    focusService: FocusService,
    formLayoutService: FuiFormLayoutService,
    cd: ChangeDetectorRef
  ) {
    super(ifErrorService, controlClassService, ngControlService, focusService, formLayoutService, cd);
  }
}
