import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiConditionalModule } from '../../utils/conditional/conditional.module';
import { FuiFocusTrapModule } from '../../utils/focus-trap/focus-trap.module';
import { FuiHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { FuiCommonFormsModule } from '../common/common.module';
import { FuiDatepickerModule } from '../datepicker/datepicker.module';

import { FuiDateDirective } from './date';
import { FuiDateContainerComponent } from './date-container';

export const FUI_DATE_DIRECTIVES: Type<any>[] = [FuiDateContainerComponent, FuiDateDirective];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FuiHostWrappingModule,
    FuiConditionalModule,
    ClrIconModule,
    FuiFocusTrapModule,
    FuiCommonFormsModule,
    FuiDatepickerModule
  ],
  declarations: [FUI_DATE_DIRECTIVES],
  exports: [FUI_DATE_DIRECTIVES],
  entryComponents: [FuiDateContainerComponent]
})
export class FuiDateModule {}
