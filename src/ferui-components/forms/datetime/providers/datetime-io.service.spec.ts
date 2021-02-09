import { registerLocaleData } from '@angular/common';
import localeAk from '@angular/common/locales/ak';
import localeHr from '@angular/common/locales/hr';
import localeKkj from '@angular/common/locales/kkj';

import { LocaleHelperService } from '../../datepicker/providers/locale-helper.service';
import { assertEqualDatetimes } from '../../datepicker/utils/test-utils';

import { DatetimeIOService } from './datetime-io.service';

registerLocaleData(localeAk);
registerLocaleData(localeHr);
registerLocaleData(localeKkj);

export default function () {
  describe('Datetime IO Service', () => {
    let datetimeIOService: DatetimeIOService;
    let localeHelperService: LocaleHelperService;

    describe('Locale Formatting', function () {
      it('updates the cldrLocaleDatetimeFormat based on the locale helper service', () => {
        const localeHelperServ: LocaleHelperService = new LocaleHelperService('en-US');
        const datetimeIOServ: DatetimeIOService = new DatetimeIOService(localeHelperServ);
        expect(datetimeIOServ.cldrLocaleDatetimeFormat).toBe('M/d/yy h:mm:ss a');

        const localeHelperServ1: LocaleHelperService = new LocaleHelperService('fr-FR');
        const timeIOServ1: DatetimeIOService = new DatetimeIOService(localeHelperServ1);

        expect(timeIOServ1.cldrLocaleDatetimeFormat).toBe('dd/MM/y HH:mm:ss');
      });

      it('supports a method to convert a Date object to time string based on the locale', () => {
        const date: Date = new Date(2015, 1, 1, 16, 20, 30);

        const localeHelperServ: LocaleHelperService = new LocaleHelperService('en-US');
        const datetimeIOServ: DatetimeIOService = new DatetimeIOService(localeHelperServ);
        expect(localeHelperServ.locale).toBe('en-US');
        expect(datetimeIOServ.toLocaleDisplayFormatString(date)).toBe('2/1/2015, 4:20:30 PM');

        const localeHelperServFR: LocaleHelperService = new LocaleHelperService('fr-FR');
        const datetimeIOServFR: DatetimeIOService = new DatetimeIOService(localeHelperServFR);
        expect(localeHelperServFR.locale).toBe('fr-FR');
        // Depending on the browser installed on the machine, this value may return different values.
        // For fr-FR locale on chrome v88+, this value returns '01/02/2015, 16:20:30'. But for previous versions, it returns
        // '01/02/2015 à 16:20:30'. This is caused by the fact that we are using the `Date.prototype.toLocaleString()` method
        // internally and it will use different versions of the INTL library depending on the browser version.
        const formattedDate = datetimeIOServFR.toLocaleDisplayFormatString(date);
        expect(formattedDate === '01/02/2015 à 16:20:30' || formattedDate === '01/02/2015, 16:20:30').toBeTruthy();

        const localeHelperServHR: LocaleHelperService = new LocaleHelperService('hr');
        const datetimeIOServHR: DatetimeIOService = new DatetimeIOService(localeHelperServHR);
        expect(localeHelperServHR.locale).toBe('hr');
        expect(datetimeIOServHR.toLocaleDisplayFormatString(date)).toBe('01. 02. 2015. 16:20:30');

        const localeHelperServKKJ: LocaleHelperService = new LocaleHelperService('kkj');
        const datetimeIOServKKJ: DatetimeIOService = new DatetimeIOService(localeHelperServKKJ);
        expect(localeHelperServKKJ.locale).toBe('kkj');
        expect(datetimeIOServKKJ.toLocaleDisplayFormatString(date)).toBe('2/1/2015, 4:20:30 PM');
      });

      it('processes an invalid date object as an empty string', () => {
        const localeHelperServ: LocaleHelperService = new LocaleHelperService('en-US');
        const datetimeIOServ: DatetimeIOService = new DatetimeIOService(localeHelperServ);

        expect(datetimeIOServ.toLocaleDisplayFormatString(new Date('Test'))).toBe('');
      });

      it('processes a null object as an empty string', () => {
        const localeHelperServ: LocaleHelperService = new LocaleHelperService('en-US');
        const datetimeIOServ: DatetimeIOService = new DatetimeIOService(localeHelperServ);

        expect(datetimeIOServ.toLocaleDisplayFormatString(null)).toBe('');
      });
    });

    describe('Date object Processing', () => {
      beforeEach(() => {
        localeHelperService = new LocaleHelperService('en-US');
        datetimeIOService = new DatetimeIOService(localeHelperService);
      });

      it('ignores just text', () => {
        const inputDate: string = 'abc';
        const date: Date = datetimeIOService.getDateValueFromDateOrString(inputDate);
        expect(date).toBeNull();
      });

      it('ignores invalid datetime', () => {
        let inputDate: string = '90:10:60';
        const date1: Date = datetimeIOService.getDateValueFromDateOrString(inputDate);
        expect(date1).toBeNull();

        inputDate = '10:00:00 pam';
        const date2: Date = datetimeIOService.getDateValueFromDateOrString(inputDate);
        expect(date2).toBeNull();

        inputDate = '10:40 pmtest';
        const date3: Date = datetimeIOService.getDateValueFromDateOrString(inputDate);
        expect(date3).toBeNull();
      });

      it('ignores empty strings', () => {
        const inputDate: string = '';
        const date: Date = datetimeIOService.getDateValueFromDateOrString(inputDate);
        expect(date).toBeNull();
      });

      it('processes datetime with different delimiters', () => {
        let inputDate: string = '04:10:2019 4/ 20/50 PM';
        let date: Date = datetimeIOService.getDateValueFromDateOrString(inputDate);
        expect(assertEqualDatetimes(date, new Date(2019, 3, 10, 16, 20, 50)));

        inputDate = '04/10/2019 10.10 .0';
        date = datetimeIOService.getDateValueFromDateOrString(inputDate);
        expect(assertEqualDatetimes(date, new Date(2019, 3, 10, 10, 10, 0)));
      });
    });
  });
}
