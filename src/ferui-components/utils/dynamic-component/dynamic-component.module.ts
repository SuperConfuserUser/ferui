import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { FuiDynamicComponentHostDirective } from './anchor.directive';

const FUI_DYNAMIC_COMPONENT_DIRECTIVES: Type<any>[] = [FuiDynamicComponentHostDirective];

@NgModule({
  imports: [CommonModule],
  declarations: [FUI_DYNAMIC_COMPONENT_DIRECTIVES],
  exports: [FUI_DYNAMIC_COMPONENT_DIRECTIVES]
})
export class FuiDynamicComponentModule {}
