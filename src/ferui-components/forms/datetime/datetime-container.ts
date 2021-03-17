import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgControl } from '@angular/forms';

import { FuiFormAbstractContainer } from '../common/abstract-container';
import { FuiDatetimeModelTypes } from '../common/datetime-model-types.enum';
import { IfErrorService } from '../common/if-error/if-error.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { DateFormControlService } from '../common/providers/date-form-control.service';
import { FocusService } from '../common/providers/focus.service';
import { FuiFormLayoutService } from '../common/providers/form-layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { PlaceholderService } from '../common/providers/placeholder.service';
import { RequiredControlService } from '../common/providers/required-control.service';
import { FuiDateDirective } from '../date/date';
import { LocaleHelperService } from '../datepicker/providers/locale-helper.service';
import { FuiTimeDirective } from '../time/time';

import { DatetimeFormControlService } from './providers/datetime-form-control.service';
import { DatetimeIOService } from './providers/datetime-io.service';

export interface DatetimeInterface {
  date: Date;
  time: Date;
}

@Component({
  selector: 'fui-datetime-container',
  template: `
    <div class="fui-control-container" [ngClass]="controlClass()">
      <div
        class="fui-datetime-wrapper clearfix"
        [class.fui-datetime-4]="_numberOfControls === 4"
        [class.fui-datetime-3]="_numberOfControls === 3"
        [class.fui-datetime-2]="_numberOfControls === 2"
      >
        <ng-content select="[fuiLabel]"></ng-content>
        <ng-content select="[fuiDatetime]"></ng-content>

        <fui-date-container>
          <input
            type="date"
            [fuiDate]="_dateModelType"
            [(ngModel)]="model.date"
            (fuiDateChange)="childModelChange('date', $event)"
          />
        </fui-date-container>
        <fui-time-container
          [showHours]="showHours"
          [showMinutes]="showMinutes"
          [showSeconds]="showSeconds"
          [twentyFourHourFormat]="twentyFourHourFormat"
        >
          <input
            type="time"
            [fuiTime]="_dateModelType"
            [(ngModel)]="model.time"
            (fuiDateChange)="childModelChange('time', $event)"
          />
        </fui-time-container>

        <div class="fui-control-icons">
          <clr-icon *ngIf="invalid" tabindex="0" class="fui-error-icon is-red" shape="fui-error" aria-hidden="true"></clr-icon>
        </div>
        <fui-default-control-error>
          <ng-content select="fui-control-error" *ngIf="invalid"></ng-content>
        </fui-default-control-error>
      </div>
    </div>
  `,
  providers: [
    ControlIdService,
    LocaleHelperService,
    IfErrorService,
    ControlClassService,
    FocusService,
    RequiredControlService,
    NgControlService,
    DateFormControlService,
    PlaceholderService,
    DatetimeIOService,
    DatetimeFormControlService,
    FuiFormLayoutService
  ],
  host: {
    '[class.fui-datetime-container]': 'true',
    '[class.fui-form-control]': 'true',
    '[class.fui-select-container]': 'true',
    '[class.fui-form-control-disabled]': 'ngControl?.disabled',
    '[class.fui-form-control-small]': 'controlLayout() === fuiFormLayoutEnum.SMALL'
  }
})
export class FuiDatetimeContainerComponent extends FuiFormAbstractContainer implements OnInit {
  _numberOfControls: number = 4;
  _dateModelType: FuiDatetimeModelTypes = FuiDatetimeModelTypes.DATE;
  modelType: FuiDatetimeModelTypes;
  model: DatetimeInterface = {
    date: null,
    time: null
  };

  @ViewChild(FuiTimeDirective) fuiTime: FuiTimeDirective;
  @ViewChild(FuiDateDirective) fuiDate: FuiDateDirective;

  @Input() twentyFourHourFormat: boolean = false;
  @Input() showHours: boolean = true;
  @Input() showMinutes: boolean = true;
  @Input() showSeconds: boolean = true;

  protected initialFocus: boolean = true;
  // When a user manually focus the field or using tab.
  protected userFocused: boolean = false;

  constructor(
    ifErrorService: IfErrorService,
    controlClassService: ControlClassService,
    ngControlService: NgControlService,
    focusService: FocusService,
    formLayoutService: FuiFormLayoutService,
    cd: ChangeDetectorRef,
    protected datetimeIOService: DatetimeIOService,
    protected dateFormControlService: DateFormControlService,
    protected datetimeFormControlService: DatetimeFormControlService
  ) {
    super(ifErrorService, controlClassService, ngControlService, focusService, formLayoutService, cd);
    this.subscriptions.push(
      this.datetimeFormControlService.modelTypeChange.subscribe((modelType: FuiDatetimeModelTypes) => {
        this.modelType = modelType;
      })
    );
  }

  ngOnInit(): void {
    if (!this.showHours) {
      this._numberOfControls--;
    }
    if (!this.showMinutes) {
      this._numberOfControls--;
    }
    if (!this.showSeconds) {
      this._numberOfControls--;
    }
    if (this._numberOfControls === 1) {
      this._numberOfControls = 2;
    }

    if (this.fuiTime && this.fuiTime.focusService) {
      this.subscriptions.push(
        this.fuiTime.focusService.focusChange.subscribe((state: boolean) => {
          this.userFocused = true;
          this.focusService.focused = state;
        })
      );
    }
    if (this.fuiDate && this.fuiDate.focusService) {
      this.subscriptions.push(
        this.fuiDate.focusService.focusChange.subscribe((state: boolean) => {
          this.userFocused = true;
          this.focusService.focused = state;
        })
      );
    }
  }

  childModelChange(type: string, value: Date): void {
    if (!type || !value) {
      return null;
    }
    const currentDate: Date | string = this.ngControl.control.value || '';
    const datetime: Date = currentDate instanceof Date ? currentDate : new Date(currentDate);
    if (type === 'date') {
      datetime.setDate(value.getDate());
      datetime.setMonth(value.getMonth());
      datetime.setFullYear(value.getFullYear());
    } else {
      datetime.setHours(value.getHours());
      datetime.setMinutes(value.getMinutes());
      datetime.setSeconds(value.getSeconds());
    }
    this.writeControlValue(datetime);
  }

  protected onNgControlChange(control: NgControl) {
    if (control) {
      this.ngControl = control;
      if (this.ngControlValueChangeSub) {
        this.ngControlValueChangeSub.unsubscribe();
      }
      this.ngControlValueChangeSub = this.ngControl.valueChanges.subscribe((value: string | Date) => {
        const datetime: Date = value instanceof Date ? value : value ? new Date(value) : null;
        this.initModels(datetime);
        this.cd.markForCheck();
      });
    }
  }

  protected onFocusChange(state: boolean) {
    super.onFocusChange(state);
    if (state) {
      if (!this.userFocused) {
        this.fuiDate.focusService.focused = true;
      }
      this.dateFormControlService.markAsTouched();
    } else if (!this.initialFocus) {
      if (this.ifErrorService) {
        this.ifErrorService.triggerStatusChange();
      }
    }
    this.initialFocus = false;
    this.userFocused = false;
  }

  private initModels(datetime: Date): void {
    this.model.date = datetime;
    this.model.time = datetime;
  }

  private writeControlValue(value: Date): void {
    if (this.ngControl) {
      this.dateFormControlService.markAsDirty();
      if (this.modelType === FuiDatetimeModelTypes.DATE) {
        this.ngControl.valueAccessor.writeValue(value);
        this.ngControl.control.setValue(value);
      } else {
        const dateStr: string = this.datetimeIOService.toLocaleDisplayFormatString(value);
        this.ngControl.valueAccessor.writeValue(dateStr);
        this.ngControl.control.setValue(dateStr);
      }
    }
  }
}
