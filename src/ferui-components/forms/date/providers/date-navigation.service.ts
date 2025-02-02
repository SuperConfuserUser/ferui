import { Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

import { CalendarModel } from '../../datepicker/model/calendar.model';
import { DayModel } from '../../datepicker/model/day.model';

/**
 * This service is responsible for:
 * 1. Initializing the displayed calendar.
 * 2. Moving the calendar to the next, previous or current months
 * 3. Managing the focused and selected day models.
 */
@Injectable()
export class DateNavigationService {
  selectedDay: DayModel;
  focusedDay: DayModel;

  private todaysFullDate: Date = new Date();
  private _selectedDayChange: Subject<DayModel> = new Subject<DayModel>();
  private _today: DayModel;
  private _displayedCalendar: CalendarModel;
  private _displayedCalendarChange: Subject<void> = new Subject<void>();
  private _focusOnCalendarChange: Subject<void> = new Subject<void>();
  private _focusedDayChange: Subject<DayModel> = new Subject<DayModel>();

  get displayedCalendar(): CalendarModel {
    return this._displayedCalendar;
  }

  get today(): DayModel {
    return this._today;
  }

  get selectedDayChange(): Observable<DayModel> {
    return this._selectedDayChange.asObservable();
  }

  /**
   * This observable lets the subscriber know that the displayed calendar has changed.
   */
  get displayedCalendarChange(): Observable<void> {
    return this._displayedCalendarChange.asObservable();
  }

  /**
   * This observable lets the subscriber know that the focus should be applied on the calendar.
   */
  get focusOnCalendarChange(): Observable<void> {
    return this._focusOnCalendarChange.asObservable();
  }

  /**
   * This observable lets the subscriber know that the focused day in the displayed calendar has changed.
   */
  get focusedDayChange(): Observable<DayModel> {
    return this._focusedDayChange.asObservable();
  }

  /**
   * Initializes the calendar based on the selected day.
   */
  initializeCalendar(): void {
    this.focusedDay = null; // Can be removed later on the store focus
    this.initializeTodaysDate();
    if (this.selectedDay) {
      this._displayedCalendar = new CalendarModel(this.selectedDay.year, this.selectedDay.month);
    } else {
      this._displayedCalendar = new CalendarModel(this.today.year, this.today.month);
    }
  }

  /**
   * Notifies that the selected day has changed so that the date can be emitted to the user.
   * Note: Only to be called from day.ts
   */
  notifySelectedDayChanged(dayModel: DayModel) {
    if (dayModel.isEqual(this.selectedDay)) {
      return;
    }
    this.selectedDay = dayModel;
    this._selectedDayChange.next(dayModel);
  }

  changeMonth(month: number): void {
    this.setDisplayedCalendar(new CalendarModel(this._displayedCalendar.year, month));
  }

  changeYear(year: number): void {
    this.setDisplayedCalendar(new CalendarModel(year, this._displayedCalendar.month));
  }

  /**
   * Moves the displayed calendar to the next month.
   */
  moveToNextMonth(): void {
    this.setDisplayedCalendar(this._displayedCalendar.nextMonth());
  }

  /**
   * Moves the displayed calendar to the previous month.
   */
  moveToPreviousMonth(): void {
    this.setDisplayedCalendar(this._displayedCalendar.previousMonth());
  }

  /**
   * Moves the displayed calendar to the current month and year.
   */
  moveToCurrentMonth(): void {
    if (!this.displayedCalendar.isDayInCalendar(this.today)) {
      this.setDisplayedCalendar(new CalendarModel(this.today.year, this.today.month));
    }
    this._focusOnCalendarChange.next();
  }

  incrementFocusDay(value: number): void {
    this.focusedDay = this.focusedDay.incrementBy(value);
    if (this._displayedCalendar.isDayInCalendar(this.focusedDay)) {
      this._focusedDayChange.next(this.focusedDay);
    } else {
      this.setDisplayedCalendar(this.getCalendarForDay(this.focusedDay));
    }
    this._focusOnCalendarChange.next();
  }

  // not a setter because i want this to remain private
  private setDisplayedCalendar(value: CalendarModel) {
    if (!this._displayedCalendar.isEqual(value)) {
      this._displayedCalendar = value;
      this._displayedCalendarChange.next();
    }
  }

  private initializeTodaysDate(): void {
    this.todaysFullDate = new Date();
    this._today = new DayModel(this.todaysFullDate.getFullYear(), this.todaysFullDate.getMonth(), this.todaysFullDate.getDate());
  }

  private getCalendarForDay(day: DayModel) {
    return new CalendarModel(day.year, day.month);
  }
}
