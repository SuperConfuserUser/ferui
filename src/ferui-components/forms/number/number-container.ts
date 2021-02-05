import { ChangeDetectorRef, Component, ContentChild } from '@angular/core';

import { FuiHelperDirective } from '../../helper/fui-helper-directive';
import { FuiFormAbstractContainer } from '../common/abstract-container';
import { IfErrorService } from '../common/if-error/if-error.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { FocusService } from '../common/providers/focus.service';
import { FuiFormLayoutService } from '../common/providers/form-layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { PlaceholderService } from '../common/providers/placeholder.service';
import { RequiredControlService } from '../common/providers/required-control.service';

import { NumberIoService } from './providers/number-io.service';

@Component({
  selector: 'fui-number-container',
  template: `
    <div class="fui-control-container" [ngClass]="controlClass()">
      <div class="fui-input-wrapper">
        <ng-content select="[fuiLabel]"></ng-content>

        <div class="input-number-wrapper">
          <ng-content select="[fuiNumber]"></ng-content>

          <div class="fui-number-increment-wrapper">
            <button class="fui-number-btn fui-number-increment" (click)="increment()">
              <clr-icon class="fui-number-icon" shape="fui-solid-arrow" aria-hidden="true"></clr-icon>
            </button>
            <button class="fui-number-btn fui-number-decrement" (click)="decrement()">
              <clr-icon class="fui-number-icon" flip="vertical" shape="fui-solid-arrow" aria-hidden="true"></clr-icon>
            </button>
          </div>
        </div>

        <label class="fui-control-icons" tabindex="0" [class.invalid]="invalid">
          <div *ngIf="!invalid" [ngClass]="{ 'adjust-margin-right fui-input-group-icon-action': !!fuiHelper }">
            <ng-content select="[fuiHelper]"></ng-content>
          </div>
          <clr-icon *ngIf="invalid" class="fui-error-icon is-red" shape="fui-error" aria-hidden="true"></clr-icon>
        </label>
        <fui-default-control-error>
          <ng-content select="fui-control-error" *ngIf="invalid"></ng-content>
        </fui-default-control-error>
      </div>
    </div>
  `,
  host: {
    '[class.fui-form-control-number]': 'true',
    '[class.fui-form-control]': 'true',
    '[class.fui-form-control-small]': 'controlLayout() === fuiFormLayoutEnum.SMALL',
    '[class.fui-form-control-disabled]': 'ngControl?.disabled'
  },
  providers: [
    IfErrorService,
    NgControlService,
    ControlIdService,
    ControlClassService,
    PlaceholderService,
    FocusService,
    RequiredControlService,
    FuiFormLayoutService,
    NumberIoService
  ]
})
export class FuiNumberContainerComponent extends FuiFormAbstractContainer {
  @ContentChild(FuiHelperDirective) fuiHelper: FuiHelperDirective;
  constructor(
    ifErrorService: IfErrorService,
    controlClassService: ControlClassService,
    ngControlService: NgControlService,
    focusService: FocusService,
    formLayoutService: FuiFormLayoutService,
    cd: ChangeDetectorRef,
    private numberIOService: NumberIoService
  ) {
    super(ifErrorService, controlClassService, ngControlService, focusService, formLayoutService, cd);
  }

  increment(): void {
    if (this.ngControl && this.ngControl.disabled) {
      return;
    }
    this.ngControl.control.setValue(this.numberIOService.increment());
  }

  decrement(): void {
    if (this.ngControl && this.ngControl.disabled) {
      return;
    }
    this.ngControl.control.setValue(this.numberIOService.decrement());
  }
}
