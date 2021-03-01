import { ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgControl } from '@angular/forms';

import { FuiCommonStrings } from '../../utils/i18n/common-strings.service';
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
import { LocaleHelperService } from '../datepicker/providers/locale-helper.service';
import { NgSelectComponent } from '../select/ng-select/ng-select.component';

import { TimeModel } from './models/time.model';
import { TimeIOService } from './providers/time-io.service';
import { TimeSelectionService } from './providers/time-selection.service';

export interface TimeInterface {
  hour: number;
  minute: number;
  second: number;
}

@Component({
  selector: 'fui-time-container',
  template: `
    <div class="fui-control-container" [ngClass]="controlClass()">
      <div
        class="fui-time-wrapper"
        [class.fui-time-3]="_numberOfControls === 3"
        [class.fui-time-2]="_numberOfControls === 2"
        [class.fui-time-1]="_numberOfControls === 1"
      >
        <ng-content select="[fuiLabel]"></ng-content>

        <ng-content select="[fuiTime]"></ng-content>

        <fui-select
          #selectElement
          *ngIf="showHours"
          [clearable]="false"
          [class.fui-select]="true"
          [placeholder]="commonStrings.hours"
          [items]="hoursList"
          (focus)="setFocusState()"
          (blur)="markControlAsTouched()"
          [(ngModel)]="model.hour"
          (change)="updateTime($event)"
        >
          <ng-template ng-option-tmp ng-label-tmp let-item="item">
            {{ formatHour(item) }}
          </ng-template>
        </fui-select>

        <fui-select
          #selectElement
          *ngIf="showMinutes"
          [clearable]="false"
          [class.fui-select]="true"
          [placeholder]="commonStrings.minutes"
          [items]="minutesList"
          (focus)="setFocusState()"
          (blur)="markControlAsTouched()"
          [(ngModel)]="model.minute"
          (change)="updateTime(null, $event)"
        >
          <ng-template ng-option-tmp ng-label-tmp let-item="item"> {{ item }} min</ng-template>
        </fui-select>

        <fui-select
          #selectElement
          *ngIf="showSeconds"
          [clearable]="false"
          [class.fui-select]="true"
          [placeholder]="commonStrings.seconds"
          [items]="secondsList"
          (focus)="setFocusState()"
          (blur)="markControlAsTouched()"
          [(ngModel)]="model.second"
          (change)="updateTime(null, null, $event)"
        >
          <ng-template ng-option-tmp ng-label-tmp let-item="item"> {{ item }} s</ng-template>
        </fui-select>

        <div class="fui-control-icons">
          <clr-icon *ngIf="invalid" tabindex="1" class="fui-error-icon is-red" shape="fui-error" aria-hidden="true"></clr-icon>
        </div>
        <fui-default-control-error>
          <ng-content select="fui-control-error" *ngIf="invalid"></ng-content>
        </fui-default-control-error>
      </div>
    </div>
  `,
  host: {
    '[class.fui-time-container]': 'true',
    '[class.fui-form-control]': 'true',
    '[class.fui-select-container]': 'true',
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
    TimeIOService,
    LocaleHelperService,
    TimeSelectionService,
    DateFormControlService,
    FuiFormLayoutService
  ]
})
export class FuiTimeContainerComponent extends FuiFormAbstractContainer implements OnInit {
  _numberOfControls = 3;
  model: TimeInterface = {
    hour: null,
    minute: null,
    second: null
  };
  hoursList: Array<number> = [];
  minutesList: Array<number> = [];
  secondsList: Array<number> = [];

  @ViewChildren('selectElement') selectElements: QueryList<NgSelectComponent>;

  @Input() twentyFourHourFormat: boolean = false;
  @Input() showHours: boolean = true;
  @Input() showMinutes: boolean = true;
  @Input() showSeconds: boolean = true;

  // When a user focus the field using a click on the select or by using tab.
  protected selectFocus: boolean = false;

  constructor(
    ifErrorService: IfErrorService,
    controlClassService: ControlClassService,
    ngControlService: NgControlService,
    focusService: FocusService,
    formLayoutService: FuiFormLayoutService,
    cd: ChangeDetectorRef,
    public commonStrings: FuiCommonStrings,
    protected timeIOService: TimeIOService,
    protected timeSelectionService: TimeSelectionService,
    protected dateFormControlService: DateFormControlService
  ) {
    super(ifErrorService, controlClassService, ngControlService, focusService, formLayoutService, cd);
    this.timeSelectionService.selectedTimeChange.subscribe((timeModel: TimeModel) => {
      this.updateSelects(timeModel);
    });
  }

  updateTime(hour?: number, minute?: number, second?: number): void {
    const time: TimeModel = this.getControlTime();
    const h: number = hour !== null && hour !== undefined ? hour : time ? time.hour : 0;
    const m: number = minute !== null && minute !== undefined ? minute : time ? time.minute : 0;
    const s: number = second !== null && second !== undefined ? second : time ? time.second : 0;
    const timeModel = new TimeModel(h, m, s, time ? time.toDate() : null);
    this.timeSelectionService.notifySelectedTime(timeModel);
    this.dateFormControlService.markAsDirty();
  }

  formatHour(value: number): string {
    if (this.twentyFourHourFormat) {
      return ('0' + value).slice(-2) + ` h`;
    } else {
      const meridiem = value < 12 ? 'AM' : 'PM';
      const twelveFormat = value >= 13 ? value - 12 : value === 0 ? 12 : value;
      return ('0' + twelveFormat).slice(-2) + ` ${meridiem}`;
    }
  }

  setFocusState() {
    this.selectFocus = true;
    this.focusService.focused = true;
  }

  markControlAsTouched() {
    this.selectFocus = true;
    this.focusService.focused = false;
  }

  ngOnInit(): void {
    // If we set all three attributes to false, we then only display the hours.
    if (!this.showHours && !this.showMinutes && !this.showSeconds) {
      this.showHours = true;
    }

    if (!this.showHours) {
      this._numberOfControls--;
    }
    if (!this.showMinutes) {
      this._numberOfControls--;
    }
    if (!this.showSeconds) {
      this._numberOfControls--;
    }

    if (this.showHours) {
      for (let h = 0; h < 24; h++) {
        this.hoursList[h] = h;
      }
    }
    if (this.showMinutes) {
      for (let m = 0; m < 60; m++) {
        this.minutesList[m] = m;
      }
    }
    if (this.showSeconds) {
      for (let s = 0; s < 60; s++) {
        this.secondsList[s] = s;
      }
    }
  }

  protected onFocusChange(state: boolean) {
    this.focus = state;
    if (state === false && this.selectFocus) {
      this.dateFormControlService.markAsTouched();
      if (this.ifErrorService) {
        this.ifErrorService.triggerStatusChange();
      }
    }
    if (state === true && !this.selectFocus) {
      this.selectElements.first.open();
    }
    if (this.selectFocus) {
      this.selectFocus = false;
    }
  }

  protected onNgControlChange(control: NgControl) {
    if (control) {
      this.ngControl = control;
      if (this.ngControlValueChangeSub) {
        this.ngControlValueChangeSub.unsubscribe();
      }
      this.ngControlValueChangeSub = this.ngControl.valueChanges.subscribe(value => {
        this.updateSelects(this.getControlTime(value));
        // This is important for controlClass() to run when the value of the input changes.
        this.cd.markForCheck();
      });
    }
  }

  private updateSelects(timeModel: TimeModel | null) {
    if (timeModel instanceof TimeModel) {
      this.model.hour = timeModel.hour;
      this.model.minute = timeModel.minute;
      this.model.second = timeModel.second;
    } else if (timeModel === null) {
      this.model.hour = null;
      this.model.minute = null;
      this.model.second = null;
    }
  }

  private getControlTime(value?: string | Date): TimeModel | null {
    if (this.ngControl) {
      value = value || this.ngControl.value;
      let date: Date;
      if (value instanceof Date) {
        date = value;
      } else if (value) {
        date = this.timeIOService.getDateValueFromDateOrString(value);
      }
      if (date instanceof Date) {
        return new TimeModel(date.getHours(), date.getMinutes(), date.getSeconds(), date);
      }
    }
    return null;
  }
}
