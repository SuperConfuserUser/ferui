import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { ClrIconModule } from '../icon/icon.module';
import { FuiConditionalModule } from '../utils/conditional/conditional.module';

import { FuiDropdownComponent } from './dropdown';
import { FuiDropdownItemDirective } from './dropdown-item';
import { FuiDropdownMenuComponent } from './dropdown-menu';
import { FuiDropdownTriggerDirective } from './dropdown-trigger';

export const FUI_DROPDOWN_DIRECTIVES: Type<any>[] = [
  FuiDropdownComponent,
  FuiDropdownMenuComponent,
  FuiDropdownTriggerDirective,
  FuiDropdownItemDirective
];

@NgModule({
  imports: [CommonModule],
  declarations: [FUI_DROPDOWN_DIRECTIVES],
  exports: [FUI_DROPDOWN_DIRECTIVES, FuiConditionalModule, ClrIconModule]
})
export class FuiDropdownModule {}
