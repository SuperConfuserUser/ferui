import { NgModule } from '@angular/core';

import { FuiAlertsModule } from './alerts/alerts.module';
import { FuiDatagridModule } from './datagrid/datagrid.module';
import { FuiDropdownModule } from './dropdown/dropdown.module';
import { FuiFormsModule } from './forms/forms.module';
import { ClrIconModule } from './icon/icon.module';
import { FuiModalsModule } from './modals/modals.module';
import { FuiTabsModule } from './tabs/tabs.module';
import { FuiToastNotificationModule } from './toast-notification/toast-notification.module';
import { FuiTooltipModule } from './tooltip/tooltip.module';
import { TreeViewModule } from './tree-view/tree-view.module';
import { FuiUnselectableModule } from './unselectable/unselectable.module';
import { FuiVirtualScrollerModule } from './virtual-scroller/virtual-scroller.module';
import { FuiWidgetModule } from './widget/widget.module';

@NgModule({
  exports: [
    ClrIconModule,
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
    FuiTooltipModule
  ]
})
export class FeruiModule {}
