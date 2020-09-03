import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiCommonFormsModule } from '../common/common.module';

import { FuiInputDirective } from './input';
import { FuiInputContainerComponent } from './input-container';

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, FuiCommonFormsModule],
  declarations: [FuiInputDirective, FuiInputContainerComponent],
  exports: [FuiInputDirective, FuiInputContainerComponent],
  entryComponents: [FuiInputContainerComponent]
})
export class FuiInputModule {}
