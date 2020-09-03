import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { FuiCommonFormsModule } from '../common/common.module';

import { FuiRadioDirective } from './radio';
import { FuiRadioContainerComponent } from './radio-container';
import { FuiRadioWrapperComponent } from './radio-wrapper';

@NgModule({
  imports: [CommonModule, FuiCommonFormsModule, FuiHostWrappingModule, ClrIconModule],
  declarations: [FuiRadioDirective, FuiRadioContainerComponent, FuiRadioWrapperComponent],
  exports: [FuiRadioDirective, FuiRadioContainerComponent, FuiRadioWrapperComponent],
  entryComponents: [FuiRadioWrapperComponent, FuiRadioContainerComponent]
})
export class FuiRadioModule {}
