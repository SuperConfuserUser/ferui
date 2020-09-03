import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiCommonFormsModule } from '../common/common.module';

import { NgSelectModule } from './ng-select/ng-select.module';
import { FuiSelectDirective } from './select';
import { FuiSelectContainerComponent } from './select-container';
import { FuiSelectIconDirective } from './select-icon';

@NgModule({
  imports: [CommonModule, FormsModule, NgSelectModule, ClrIconModule, FuiCommonFormsModule],
  declarations: [FuiSelectDirective, FuiSelectContainerComponent, FuiSelectIconDirective],
  exports: [NgSelectModule, FuiSelectDirective, FuiSelectContainerComponent, FuiSelectIconDirective],
  entryComponents: [FuiSelectContainerComponent]
})
export class FuiSelectModule {}
