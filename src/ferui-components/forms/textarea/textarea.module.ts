import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiCommonFormsModule } from '../common/common.module';

import { FuiTextareaDirective } from './textarea';
import { FuiTextareaContainerComponent } from './textarea-container';

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, FuiCommonFormsModule],
  declarations: [FuiTextareaDirective, FuiTextareaContainerComponent],
  exports: [FuiTextareaDirective, FuiTextareaContainerComponent],
  entryComponents: [FuiTextareaContainerComponent]
})
export class FuiTextareaModule {}
