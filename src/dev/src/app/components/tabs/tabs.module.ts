import { HighlightModule } from 'ngx-highlightjs';

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FeruiModule } from '@ferui/components';

import { UtilsModule } from '../../utils/utils.module';

import { TabsDemoComponent } from './tabs.demo';

const FUI_DEMO_COMPONENTS_DIRECTIVES: Type<any>[] = [TabsDemoComponent];

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule, FeruiModule, HighlightModule, UtilsModule],
  declarations: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  exports: [FUI_DEMO_COMPONENTS_DIRECTIVES]
})
export class TabsDemoModule {}
