import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FuiDropdownModule } from '../dropdown/dropdown.module';
import { FuiCheckboxModule } from '../forms/checkbox/checkbox.module';
import { FuiCommonFormsModule } from '../forms/common/common.module';
import { FuiDateModule } from '../forms/date/date.module';
import { FuiInputModule } from '../forms/input/input.module';
import { FuiNumberModule } from '../forms/number/number.module';
import { FuiRadioModule } from '../forms/radio/radio.module';
import { FuiSearchModule } from '../forms/search/search.module';
import { FuiSelectModule } from '../forms/select/select.module';
import { FuiToggleModule } from '../forms/toggle/toggle.module';
import { ClrIconModule } from '../icon/icon.module';
import { FuiUnselectableModule } from '../unselectable/unselectable.module';
import { FuiConditionalModule } from '../utils/conditional/conditional.module';
import { FuiDynamicComponentModule } from '../utils/dynamic-component/dynamic-component.module';

import { FuiFilterHeaderLabelDirective } from './directives/filter-header-label.directive';
import { FuiFilterComponent } from './filter.component';
import { FuiFiltersPopoverComponent } from './filters-popover';
import { FuiBooleanFilterComponent } from './models/boolean-filter';
import { FuiCustomFilterComponent } from './models/custom-filter';
import { FuiDateFilterComponent } from './models/date-filter';
import { FuiGlobalSearchFilterComponent } from './models/global-search-filter';
import { FuiNumberFilterComponent } from './models/number-filter';
import { FuiTextFilterComponent } from './models/text-filter';

export const FUI_FILTER_DIRECTIVES: Type<any>[] = [
  FuiFilterHeaderLabelDirective,
  FuiCustomFilterComponent,
  FuiBooleanFilterComponent,
  FuiDateFilterComponent,
  FuiNumberFilterComponent,
  FuiTextFilterComponent,
  FuiGlobalSearchFilterComponent,
  FuiFiltersPopoverComponent,
  FuiFilterComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FuiCommonFormsModule,
    FuiUnselectableModule,
    FuiDynamicComponentModule,
    FuiInputModule,
    FuiCheckboxModule,
    FuiRadioModule,
    FuiDateModule,
    FuiSelectModule,
    FuiNumberModule,
    ClrIconModule,
    FuiConditionalModule,
    FuiDropdownModule,
    FuiToggleModule,
    FuiSearchModule
  ],
  declarations: [FUI_FILTER_DIRECTIVES],
  exports: [FUI_FILTER_DIRECTIVES]
})
export class FuiFilterModule {}
