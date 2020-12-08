import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiCommonFormsModule } from '../common/common.module';

import { FuiSearchDirective } from './search';
import { FuiSearchContainerComponent } from './search-container';

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, FuiCommonFormsModule],
  declarations: [FuiSearchDirective, FuiSearchContainerComponent],
  exports: [FuiSearchDirective, FuiSearchContainerComponent],
  entryComponents: [FuiSearchContainerComponent]
})
export class FuiSearchModule {}
