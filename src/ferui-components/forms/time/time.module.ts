import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiCommonFormsModule } from '../common/common.module';
import { FuiSelectModule } from '../select/select.module';

import { FuiTimeDirective } from './time';
import { FuiTimeContainerComponent } from './time-container';

export const FUI_TIME_DIRECTIVES: Type<any>[] = [FuiTimeDirective, FuiTimeContainerComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, FuiCommonFormsModule, FuiSelectModule],
  declarations: [FUI_TIME_DIRECTIVES],
  exports: [FUI_TIME_DIRECTIVES],
  entryComponents: [FuiTimeContainerComponent]
})
export class FuiTimeModule {}
