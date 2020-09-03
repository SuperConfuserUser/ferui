import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiConditionalModule } from '../../utils/conditional/conditional.module';
import { FuiFocusTrapModule } from '../../utils/focus-trap/focus-trap.module';
import { FuiHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { FuiCommonFormsModule } from '../common/common.module';
import { FuiDateContainerComponent } from '../date/date-container';

import { FuiCalendarComponent } from './calendar';
import { FuiDatepickerViewManagerComponent } from './datepicker-view-manager';
import { FuiDayComponent } from './day';
import { FuiDaypickerComponent } from './daypicker';
import { FuiMonthpickerComponent } from './monthpicker';
import { FuiYearpickerComponent } from './yearpicker';

export const FUI_DATEPICKER_DIRECTIVES: Type<any>[] = [
  FuiDayComponent,
  FuiDatepickerViewManagerComponent,
  FuiMonthpickerComponent,
  FuiYearpickerComponent,
  FuiDaypickerComponent,
  FuiCalendarComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FuiHostWrappingModule,
    FuiConditionalModule,
    ClrIconModule,
    FuiFocusTrapModule,
    FuiCommonFormsModule
  ],
  declarations: [FUI_DATEPICKER_DIRECTIVES],
  exports: [FUI_DATEPICKER_DIRECTIVES],
  entryComponents: [FuiDateContainerComponent]
})
export class FuiDatepickerModule {}
