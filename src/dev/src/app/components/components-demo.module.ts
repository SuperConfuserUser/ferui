import { HighlightModule } from 'ngx-highlightjs';

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FeruiModule } from '@ferui/components';

import { UtilsModule } from '../utils/utils.module';

import { ComponentsRoutingModule } from './components-demo.routing';
import { ComponentsLandingComponent } from './components-landing.component';
import { DatagridDemoModule } from './datagrid/datagrid.module';
import { ComponentsDashboardComponent } from './default/default.component';
import { DropdownDemoModule } from './dropdown/dropdown.module';
import { DemoFilterService } from './filter/demo-filter.service';
import { FilterDemoModule } from './filter/filter.module';
import { FormsDemoModule } from './forms/forms-demo.module';
import { ModalDemoModule } from './modals/modal.module';
import { TabsDemoModule } from './tabs/tabs.module';
import { ToastNotificationDemoModule } from './toast-notification/toast-notification-module';
import { TooltipDemoModule } from './tooltip/tooltip.module';
import { TreeViewDemoModule } from './tree-view/tree-view.module';
import { VirtualScrollerModule } from './virtual-scroller/virtual-scroller.module';
import { WidgetDemoModule } from './widget/widget.module';

export const FUI_DEMO_COMPONENTS_DIRECTIVES: Type<any>[] = [ComponentsDashboardComponent, ComponentsLandingComponent];

@NgModule({
  imports: [
    UtilsModule,
    CommonModule,
    FormsModule,
    ComponentsRoutingModule,
    FormsDemoModule,
    FeruiModule,
    DatagridDemoModule,
    DropdownDemoModule,
    HighlightModule,
    TreeViewDemoModule,
    ModalDemoModule,
    WidgetDemoModule,
    TabsDemoModule,
    VirtualScrollerModule,
    ToastNotificationDemoModule,
    TooltipDemoModule,
    FilterDemoModule
  ],
  declarations: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  exports: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  providers: [DemoFilterService]
})
export class ComponentsDemoModule {}
