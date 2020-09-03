import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiCommonFormsModule } from '../common/common.module';
import { FuiDateModule } from '../date/date.module';
import { FuiTimeModule } from '../time/time.module';

import { FuiDatetimeDirective } from './datetime';
import { FuiDatetimeContainerComponent } from './datetime-container';

export const FUI_DATETIME_DIRECTIVES: Type<any>[] = [FuiDatetimeDirective, FuiDatetimeContainerComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, FuiCommonFormsModule, FuiDateModule, FuiTimeModule],
  declarations: [FUI_DATETIME_DIRECTIVES],
  exports: [FUI_DATETIME_DIRECTIVES],
  entryComponents: [FuiDatetimeContainerComponent]
})
export class FuiDatetimeModule {}
