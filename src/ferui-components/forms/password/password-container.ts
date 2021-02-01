import { BehaviorSubject } from 'rxjs';

import { ChangeDetectorRef, Component, ContentChild, Inject, InjectionToken, Input } from '@angular/core';

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

/* tslint:disable-next-line:variable-name */
export const ToggleService = new InjectionToken<any>(undefined);

/* tslint:disable-next-line:variable-name */
export function ToggleServiceProvider() {
  return new BehaviorSubject<boolean>(false);
}

@Component({
  selector: 'fui-password-container',
  template: `
    <div class="fui-control-container" [ngClass]="controlClass()">
      <div class="fui-input-wrapper">
        <ng-content select="[fuiLabel]"></ng-content>
        <ng-content select="[fuiPassword]"></ng-content>
        <label class="fui-control-icons" tabindex="0" [class.invalid]="invalid">
          <clr-icon
            *ngIf="!show && fuiToggle"
            shape="fui-eye"
            class="fui-input-group-icon-action"
            (click)="toggle()"
            [class.has-fui-helper]="!!fuiHelper"
          ></clr-icon>
          <clr-icon
            *ngIf="show && fuiToggle"
            shape="fui-eye-off"
            class="fui-input-group-icon-action"
            (click)="toggle()"
            [class.has-fui-helper]="!!fuiHelper"
          ></clr-icon>
          <div *ngIf="!invalid" [ngClass]="{ 'fui-input-group-icon-action': !!fuiHelper }">
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
    '[class.fui-form-control]': 'true',
    '[class.fui-form-control-disabled]': 'ngControl?.disabled',
    '[class.fui-form-control-small]': 'controlLayout() === fuiFormLayoutEnum.SMALL'
  },
  providers: [
    IfErrorService,
    NgControlService,
    ControlIdService,
    ControlClassService,
    FocusService,
    RequiredControlService,
    { provide: ToggleService, useFactory: ToggleServiceProvider },
    PlaceholderService,
    FuiFormLayoutService
  ]
})
export class FuiPasswordContainerComponent extends FuiFormAbstractContainer {
  show = false;
  focus = false;

  @ContentChild(FuiHelperDirective) fuiHelper: FuiHelperDirective;

  @Input('fuiToggle')
  set fuiToggle(state: boolean) {
    this._toggle = state;
    if (!state) {
      this.show = false;
    }
  }

  get fuiToggle() {
    return this._toggle;
  }

  private _toggle = true;

  constructor(
    ifErrorService: IfErrorService,
    controlClassService: ControlClassService,
    ngControlService: NgControlService,
    focusService: FocusService,
    formLayoutService: FuiFormLayoutService,
    cd: ChangeDetectorRef,
    @Inject(ToggleService) private toggleService: BehaviorSubject<boolean>
  ) {
    super(ifErrorService, controlClassService, ngControlService, focusService, formLayoutService, cd);
  }

  toggle() {
    this.show = !this.show;
    this.toggleService.next(this.show);
  }
}
