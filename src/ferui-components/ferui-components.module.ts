import { NgModule } from '@angular/core';

import { FuiAlertsModule } from './alerts/alerts.module';
import { FuiDatagridModule } from './datagrid/datagrid.module';
import { FuiDropdownModule } from './dropdown/dropdown.module';
import { FuiFilterModule } from './filters/filter.module';
import { FuiFormsModule } from './forms/forms.module';
import { ClrIconModule } from './icon/icon.module';
import { FuiModalsModule } from './modals/modals.module';
import { FuiPipesModule } from './pipes/pipes.module';
import { FuiTabsModule } from './tabs/tabs.module';
import { FuiToastNotificationModule } from './toast-notification/toast-notification.module';
import { FuiTooltipModule } from './tooltip/tooltip.module';
import { TreeViewModule } from './tree-view/tree-view.module';
import { FuiUnselectableModule } from './unselectable/unselectable.module';
import { FuiDynamicComponentModule } from './utils/dynamic-component/dynamic-component.module';
import { FuiFilterComparatorService } from './utils/filter-comparator/fui-filter-comparator.service';
import { FuiI18nService } from './utils/i18n/fui-i18n.service';
import { FuiVirtualScrollerModule } from './virtual-scroller/virtual-scroller.module';
import { FuiWidgetModule } from './widget/widget.module';

@NgModule({
  exports: [
    ClrIconModule,
    FuiPipesModule,
    FuiDynamicComponentModule,
    FuiTabsModule,
    FuiFormsModule,
    FuiDatagridModule,
    FuiUnselectableModule,
    FuiVirtualScrollerModule,
    FuiDropdownModule,
    TreeViewModule,
    FuiWidgetModule,
    FuiAlertsModule,
    FuiModalsModule,
    FuiToastNotificationModule,
    FuiTooltipModule,
    FuiFilterModule
  ],
  providers: [FuiI18nService, FuiFilterComparatorService]
})
export class FeruiModule {}
