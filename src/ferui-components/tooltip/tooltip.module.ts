import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { TooltipComponent } from './tooltip.component';
import { FuiTooltipDirective } from './tooltip.directive';

export const FUI_TOOLTIP_DIRECTIVES: Type<any>[] = [FuiTooltipDirective, TooltipComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [FUI_TOOLTIP_DIRECTIVES],
  exports: [FUI_TOOLTIP_DIRECTIVES],
  entryComponents: [TooltipComponent]
})
export class FuiTooltipModule {}
