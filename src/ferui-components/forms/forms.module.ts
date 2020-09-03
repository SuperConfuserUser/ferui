import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FuiCheckboxModule } from './checkbox/checkbox.module';
import { FuiCommonFormsModule } from './common/common.module';
import { FuiDateModule } from './date/date.module';
import { FuiDatepickerModule } from './datepicker/datepicker.module';
import { FuiDatetimeModule } from './datetime/datetime.module';
import { FuiInputModule } from './input/input.module';
import { FuiNumberModule } from './number/number.module';
import { FuiPasswordModule } from './password/password.module';
import { FuiRadioModule } from './radio/radio.module';
import { FuiSelectModule } from './select/select.module';
import { FuiTextareaModule } from './textarea/textarea.module';
import { FuiTimeModule } from './time/time.module';
import { FuiToggleModule } from './toggle/toggle.module';

@NgModule({
  imports: [CommonModule],
  exports: [
    FuiCommonFormsModule,
    FuiInputModule,
    FuiTextareaModule,
    FuiCheckboxModule,
    FuiRadioModule,
    FuiSelectModule,
    FuiPasswordModule,
    FuiDatepickerModule,
    FuiDateModule,
    FuiTimeModule,
    FuiDatetimeModule,
    FuiNumberModule,
    FuiToggleModule
  ]
})
export class FuiFormsModule {}
