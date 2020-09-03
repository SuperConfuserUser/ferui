import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiCommonFormsModule } from '../common/common.module';

import { FuiPasswordDirective } from './password';
import { FuiPasswordContainerComponent } from './password-container';

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, FuiCommonFormsModule],
  declarations: [FuiPasswordDirective, FuiPasswordContainerComponent],
  exports: [FuiPasswordDirective, FuiPasswordContainerComponent],
  entryComponents: [FuiPasswordContainerComponent]
})
export class FuiPasswordModule {}
