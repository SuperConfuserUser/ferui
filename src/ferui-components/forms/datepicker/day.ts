import { Component, Input } from '@angular/core';

import { IfOpenService } from '../../utils/conditional/if-open.service';
import { DateFormControlService } from '../common/providers/date-form-control.service';
import { DateNavigationService } from '../date/providers/date-navigation.service';

import { DayViewModel } from './model/day-view.model';

@Component({
  selector: 'fui-day',
  template: `
    <button
      class="day-btn"
      type="button"
      [class.is-today]="dayView.isTodaysDate"
      [class.is-disabled]="dayView.isDisabled"
      [class.is-selected]="dayView.isSelected"
      [attr.tabindex]="dayView.tabIndex"
      (click)="selectDay()"
      (focus)="onDayViewFocus()"
    >
      {{ dayView.dayModel.date }}
    </button>
  `,
  host: { '[class.day]': 'true' }
})
export class FuiDayComponent {
  /**
   * DayViewModel input which is used to build the Day View.
   */
  @Input('fuiDayView') dayView: DayViewModel;

  constructor(
    private dateNavigationService: DateNavigationService,
    private ifOpenService: IfOpenService,
    private dateFormControlService: DateFormControlService
  ) {}

  /**
   * Updates the focusedDay in the DateNavigationService when the FuiDayComponent is focused.
   */
  onDayViewFocus() {
    this.dateNavigationService.focusedDay = this.dayView.dayModel;
  }

  /**
   * Updates the selectedDay when the FuiDayComponent is selected and closes the datepicker popover.
   */
  selectDay(): void {
    this.dateNavigationService.notifySelectedDayChanged(this.dayView.dayModel);
    this.dateFormControlService.markAsDirty();
    this.ifOpenService.open = false;
  }
}
