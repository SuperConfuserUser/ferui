import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FuiDropdownModule } from '../dropdown/dropdown.module';
import { FuiCheckboxModule } from '../forms/checkbox/checkbox.module';
import { FuiCommonFormsModule } from '../forms/common/common.module';
import { FuiDateModule } from '../forms/date/date.module';
import { FuiInputModule } from '../forms/input/input.module';
import { FuiRadioModule } from '../forms/radio/radio.module';
import { FuiSelectModule } from '../forms/select/select.module';
import { ClrIconModule } from '../icon/icon.module';
import { FuiUnselectableModule } from '../unselectable/unselectable.module';
import { FuiConditionalModule } from '../utils/conditional/conditional.module';
import { FuiVirtualScrollerModule } from '../virtual-scroller/virtual-scroller.module';

import { FuiDatagridActionMenuComponent } from './components/action-menu/action-menu';
import { FuiBodyCellComponent } from './components/body/body-cell';
import { FuiBodyEmptyComponent } from './components/body/body-empty';
import { FuiBodyRootComponent } from './components/body/body-root';
import { FuiBodyRowComponent } from './components/body/body-row';
import { FuiDatagridComponent } from './components/datagrid';
import { FuiDatagridFilterColumnVisibilityComponent } from './components/filters/column-visibility';
import { FuiDatagridBooleanFilterComponent } from './components/filters/filter/boolean-filter';
import { FuiDatagridDateFilterComponent } from './components/filters/filter/date-filter';
import { FuiDatagridGlobalSearchFilterComponent } from './components/filters/filter/global-search-filter';
import { FuiDatagridNumberFilterComponent } from './components/filters/filter/number-filter';
import { FuiDatagridTextFilterComponent } from './components/filters/filter/text-filter';
import { FuiDatagridFiltersComponent } from './components/filters/filters';
import { FuiDatagridFiltersPopoverComponent } from './components/filters/filters-popover';
import { FuiDatagridSearchFilterButtonComponent } from './components/filters/search-filters-button';
import { FuiHeaderCellComponent } from './components/header/header-cell';
import { FuiHeaderContainerComponent } from './components/header/header-container';
import { FuiHeaderRootComponent } from './components/header/header-root';
import { FuiHeaderRowComponent } from './components/header/header-row';
import { FuiHeaderViewportComponent } from './components/header/header-viewport';
import { FuiDatagridPagerComponent } from './components/pager/pager';

export const FUI_DATAGRID_DIRECTIVES: Type<any>[] = [
  FuiDatagridActionMenuComponent,
  FuiDatagridGlobalSearchFilterComponent,
  FuiDatagridDateFilterComponent,
  FuiDatagridTextFilterComponent,
  FuiDatagridNumberFilterComponent,
  FuiDatagridBooleanFilterComponent,
  FuiDatagridSearchFilterButtonComponent,
  FuiDatagridFiltersPopoverComponent,
  FuiDatagridFiltersComponent,
  FuiDatagridFilterColumnVisibilityComponent,
  FuiDatagridPagerComponent,
  FuiHeaderRootComponent,
  FuiHeaderViewportComponent,
  FuiHeaderContainerComponent,
  FuiHeaderRowComponent,
  FuiHeaderCellComponent,
  FuiBodyRootComponent,
  FuiBodyRowComponent,
  FuiBodyCellComponent,
  FuiBodyEmptyComponent,
  FuiDatagridComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FuiCommonFormsModule,
    FuiInputModule,
    FuiCheckboxModule,
    FuiRadioModule,
    FuiDateModule,
    ClrIconModule,
    FuiVirtualScrollerModule,
    FuiUnselectableModule,
    FuiSelectModule,
    FuiConditionalModule,
    FuiDropdownModule
  ],
  declarations: [FUI_DATAGRID_DIRECTIVES],
  exports: [FUI_DATAGRID_DIRECTIVES],
  entryComponents: []
})
export class FuiDatagridModule {}
