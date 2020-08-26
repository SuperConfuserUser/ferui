import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrIconModule } from '../../icon/icon.module';

import { FuiCommonFormsModule } from '../common/common.module';
import { FuiHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { FuiToggle } from './toggle';
import { FuiToggleContainer } from './toggle-container';
import { FuiToggleWrapper } from './toggle-wrapper';

@NgModule({
  imports: [CommonModule, ClrIconModule, FuiCommonFormsModule, FuiHostWrappingModule],
  declarations: [FuiToggle, FuiToggleContainer, FuiToggleWrapper],
  exports: [FuiToggle, FuiToggleContainer, FuiToggleWrapper],
  entryComponents: [FuiToggleWrapper, FuiToggleContainer]
})
export class FuiToggleModule {}
