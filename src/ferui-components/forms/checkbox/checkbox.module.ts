import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { FuiCommonFormsModule } from '../common/common.module';

import { FuiCheckboxDirective } from './checkbox';
import { FuiCheckboxContainerComponent } from './checkbox-container';
import { FuiCheckboxWrapperComponent } from './checkbox-wrapper';

@NgModule({
  imports: [CommonModule, ClrIconModule, FuiCommonFormsModule, FuiHostWrappingModule],
  declarations: [FuiCheckboxDirective, FuiCheckboxContainerComponent, FuiCheckboxWrapperComponent],
  exports: [FuiCheckboxDirective, FuiCheckboxContainerComponent, FuiCheckboxWrapperComponent],
  entryComponents: [FuiCheckboxWrapperComponent, FuiCheckboxContainerComponent]
})
export class FuiCheckboxModule {}
