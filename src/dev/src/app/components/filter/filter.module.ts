import { HighlightModule } from 'ngx-highlightjs';

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FeruiModule } from '@ferui/components';

import { UtilsModule } from '../../utils/utils.module';

import { DemoBrowserCustomFilterComponent } from './custom-browser-filter';
import { FilterDemoComponent } from './filter.demo';

const FUI_FILTER_DEMO_COMPONENTS_DIRECTIVES: Type<any>[] = [FilterDemoComponent, DemoBrowserCustomFilterComponent];

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule, UtilsModule, FeruiModule, HighlightModule],
  declarations: [FUI_FILTER_DEMO_COMPONENTS_DIRECTIVES],
  exports: [FUI_FILTER_DEMO_COMPONENTS_DIRECTIVES],
  entryComponents: [DemoBrowserCustomFilterComponent]
})
export class FilterDemoModule {}
