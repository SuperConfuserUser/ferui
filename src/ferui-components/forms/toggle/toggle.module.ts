import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { FuiCommonFormsModule } from '../common/common.module';

import { FuiToggleDirective } from './toggle';
import { FuiToggleContainerComponent } from './toggle-container';
import { FuiToggleWrapperComponent } from './toggle-wrapper';

@NgModule({
  imports: [CommonModule, ClrIconModule, FuiCommonFormsModule, FuiHostWrappingModule],
  declarations: [FuiToggleDirective, FuiToggleContainerComponent, FuiToggleWrapperComponent],
  exports: [FuiToggleDirective, FuiToggleContainerComponent, FuiToggleWrapperComponent],
  entryComponents: [FuiToggleWrapperComponent, FuiToggleContainerComponent]
})
export class FuiToggleModule {}
