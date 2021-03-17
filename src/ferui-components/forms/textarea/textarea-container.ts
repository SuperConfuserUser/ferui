import { ChangeDetectorRef, Component } from '@angular/core';

import { FuiFormAbstractContainer } from '../common/abstract-container';
import { IfErrorService } from '../common/if-error/if-error.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { FocusService } from '../common/providers/focus.service';
import { FuiFormLayoutService } from '../common/providers/form-layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { PlaceholderService } from '../common/providers/placeholder.service';
import { RequiredControlService } from '../common/providers/required-control.service';

@Component({
  selector: 'fui-textarea-container',
  template: `
    <div class="fui-control-container" [ngClass]="controlClass()">
      <div class="fui-textarea-wrapper">
        <ng-content select="[fuiLabel]"></ng-content>
        <ng-content select="[fuiTextarea]"></ng-content>
        <div class="fui-control-icons" [class.invalid]="invalid">
          <ng-content *ngIf="!invalid" select="[fuiHelper]"></ng-content>
          <clr-icon *ngIf="invalid" tabindex="0" class="fui-error-icon is-red" shape="fui-error" aria-hidden="true"></clr-icon>
        </div>
        <fui-default-control-error>
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
export class FuiTextareaContainerComponent extends FuiFormAbstractContainer {
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
