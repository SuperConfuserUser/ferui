import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiCommonFormsModule } from '../common/common.module';

import { FuiNumberDirective } from './number';
import { FuiNumberContainerComponent } from './number-container';

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, FuiCommonFormsModule],
  declarations: [FuiNumberDirective, FuiNumberContainerComponent],
  exports: [FuiNumberDirective, FuiNumberContainerComponent],
  entryComponents: [FuiNumberContainerComponent]
})
export class FuiNumberModule {}
