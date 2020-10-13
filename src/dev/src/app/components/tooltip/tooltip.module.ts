import { HighlightModule } from 'ngx-highlightjs';

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FeruiModule } from '@ferui/components';

import { UtilsModule } from '../../utils/utils.module';

import { TooltipContentExampleComponent } from './components/tooltip-content-example.component';
import { TooltipDemoComponent } from './tooltip.demo';

const FUI_DEMO_COMPONENTS_DIRECTIVES: Type<any>[] = [TooltipDemoComponent, TooltipContentExampleComponent];

@NgModule({
  imports: [CommonModule, FormsModule, FeruiModule, HighlightModule, UtilsModule],
  declarations: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  exports: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  entryComponents: [TooltipContentExampleComponent]
})
export class TooltipDemoModule {}
