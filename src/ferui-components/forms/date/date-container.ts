import { ChangeDetectorRef, Component, ContentChild, Input } from '@angular/core';

import { FuiHelperDirective } from '../../helper/fui-helper-directive';
import { IfOpenService } from '../../utils/conditional/if-open.service';
import { FuiFormAbstractContainer } from '../common/abstract-container';
import { IfErrorService } from '../common/if-error/if-error.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { DateFormControlService } from '../common/providers/date-form-control.service';
import { FocusService } from '../common/providers/focus.service';
import { FuiFormLayoutService } from '../common/providers/form-layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { PlaceholderService } from '../common/providers/placeholder.service';
import { RequiredControlService } from '../common/providers/required-control.service';
import { DatepickerEnabledService } from '../datepicker/providers/datepicker-enabled.service';
import { LocaleHelperService } from '../datepicker/providers/locale-helper.service';

import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';

@Component({
  selector: 'fui-date-container',
  template: `
    <div class="fui-control-container" [ngClass]="controlClass()">
      <div class="fui-date-wrapper">
        <ng-content select="[fuiLabel]"></ng-content>
        <ng-content select="[fuiDate]"></ng-content>
        <fui-datepicker-view-manager *fuiIfOpen fuiFocusTrap [appendTo]="appendTo"></fui-datepicker-view-manager>
        <clr-icon
          *ngIf="!invalid"
          class="fui-calendar-icon-wrapper"
          (click)="toggleDatepicker($event)"
          shape="fui-calendar"
          aria-hidden="true"
          [ngClass]="{ 'has-fui-helper': !!fuiHelper }"
        ></clr-icon>
        <label class="fui-control-icons" tabindex="0" [class.invalid]="invalid">
          <ng-content *ngIf="!invalid" select="[fuiHelper]"></ng-content>
          <clr-icon *ngIf="invalid" class="fui-error-icon is-red" shape="fui-error" aria-hidden="true"></clr-icon>
        </label>
        <fui-default-control-error>
          <ng-content select="fui-control-error" *ngIf="invalid"></ng-content>
        </fui-default-control-error>
      </div>
    </div>
  `,
  providers: [
    ControlIdService,
    IfErrorService,
    ControlClassService,
    NgControlService,
    PlaceholderService,
    FocusService,
    RequiredControlService,
    IfOpenService,
    DateIOService,
    DateNavigationService,
    DateFormControlService,
    LocaleHelperService,
    DatepickerEnabledService,
    FuiFormLayoutService
  ],
  host: {
    '[class.fui-form-control-disabled]': 'ngControl?.disabled',
    '[class.fui-form-control]': 'true',
    '[class.fui-date-container]': 'true',
    '[class.fui-form-control-small]': 'controlLayout() === fuiFormLayoutEnum.SMALL'
  }
})
export class FuiDateContainerComponent extends FuiFormAbstractContainer {
  @Input() appendTo: string;
  @ContentChild(FuiHelperDirective) fuiHelper: FuiHelperDirective;

  constructor(
    ifErrorService: IfErrorService,
    controlClassService: ControlClassService,
    ngControlService: NgControlService,
    focusService: FocusService,
    formLayoutService: FuiFormLayoutService,
    cd: ChangeDetectorRef,
    protected ifOpenService: IfOpenService,
    protected dateNavigationService: DateNavigationService,
    protected dateFormControlService: DateFormControlService,
    protected datepickerEnabledService: DatepickerEnabledService
  ) {
    super(ifErrorService, controlClassService, ngControlService, focusService, formLayoutService, cd);
    this.subscriptions.push(
      this.ifOpenService.openChange.subscribe(open => {
        if (open) {
          this.focus = true;
          this.initializeCalendar();
        } else {
          this.focus = false;
        }
        this.cd.markForCheck();
      })
    );
  }

  /**
   * Whether or not datepicker is enabled.
   */
  isEnabled(): boolean {
    return this.datepickerEnabledService.isEnabled;
  }

  /**
   * Toggles the Datepicker Popover.
   */
  toggleDatepicker(event: Event) {
    if (this.isEnabled()) {
      this.ifOpenService.toggleWithEvent(event);
      this.dateFormControlService.markAsTouched();
    }
  }

  /**
   * Override the default method. This will be called whenever the focus state changes.
   * @param state
   * @protected
   */
  protected onFocusChange(state: boolean) {
    if (this.ifOpenService && !this.ifOpenService.open) {
      this.focus = state;
      this.toggleDatepicker(this.focusService.originalEvent);
      this.cd.markForCheck();
    }
  }

  /**
   * Processes the user input and Initializes the Calendar every-time the datepicker popover is open.
   */
  private initializeCalendar(): void {
    this.dateNavigationService.initializeCalendar();
  }
}
