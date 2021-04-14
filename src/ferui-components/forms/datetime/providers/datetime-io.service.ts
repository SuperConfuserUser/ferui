import { Injectable } from '@angular/core';

import { DatetimeIoInterface } from '../../common/datetime-io-interface';
import { DateIOService } from '../../date/providers/date-io.service';
import { LocaleHelperService } from '../../datepicker/providers/locale-helper.service';
import { DEFAULT_LOCALE_DATETIME_FORMAT, USER_INPUT_DATETIME_REGEX } from '../../datepicker/utils/constants';
import { TimeIOService } from '../../time/providers/time-io.service';

@Injectable()
export class DatetimeIOService implements DatetimeIoInterface {
  cldrLocaleDatetimeFormat: string = DEFAULT_LOCALE_DATETIME_FORMAT;

  private timeIOService: TimeIOService;
  private dateIOService: DateIOService;

  constructor(private localeHelperService: LocaleHelperService) {
    this.cldrLocaleDatetimeFormat = this.localeHelperService.localeDatetimeFormat;
    this.timeIOService = new TimeIOService(localeHelperService);
    this.dateIOService = new DateIOService(localeHelperService);
  }

  /**
   * Return the date string to be displayed within the control. It will take the browser locale into account.
   * @param date
   */
  toLocaleDisplayFormatString(date: Date): string {
    if (date && !isNaN(date.getTime())) {
      return this.localeHelperService.toLocaleDatetimeString(date);
    }
    return '';
  }

  /**
   * Get the date object from value.
   * This function accepts a Date object or a date string as parameter and will always return either a Date object or
   * null if the date is invalid.
   * @param date The input date value.
   */
  getDateValueFromDateOrString(date: string | Date): Date | null {
    if (!date) {
      return null;
    }
    // If we use a date object already, we just want to return this object.
    if (date instanceof Date) {
      return date;
    }

    const dateParts: string[] = date.split(USER_INPUT_DATETIME_REGEX);
    let datetimeFirstPart: Date = null;
    let dateTimeSecondPart: Date = null;

    if (!dateParts || dateParts.length < 2 || dateParts.length > 4) {
      return null;
    } else if (dateParts.length === 4) {
      // @ts-ignore
      // tslint:disable-next-line:no-unused-declaration
      const [_, dateS, timeS] = dateParts;
      datetimeFirstPart = this.dateIOService.getDateValueFromDateOrString(dateS);
      dateTimeSecondPart = this.timeIOService.getDateValueFromDateOrString(timeS);
    }
    if (datetimeFirstPart instanceof Date && dateTimeSecondPart instanceof Date) {
      datetimeFirstPart.setHours(dateTimeSecondPart.getHours());
      datetimeFirstPart.setMinutes(dateTimeSecondPart.getMinutes());
      datetimeFirstPart.setSeconds(dateTimeSecondPart.getSeconds());
      datetimeFirstPart.setMilliseconds(dateTimeSecondPart.getMilliseconds());
      return datetimeFirstPart;
    }
    return null;
  }
}
