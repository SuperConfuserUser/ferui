import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComponentsLandingComponent } from './components-landing.component';
import { DatagridDemoComponent } from './datagrid/datagrid.demo';
import { DatagridClientSideComponent } from './datagrid/pages/datagrid-client-side.component';
import { DatagridHomeComponent } from './datagrid/pages/datagrid-home';
import { DatagridInfiniteServerSideComponent } from './datagrid/pages/datagrid-infinite-server-side.component';
import { DatagridServerSideComponent } from './datagrid/pages/datagrid-server-side.component';
import { DatagridTreeviewInfiniteServerSideComponent } from './datagrid/pages/datagrid-treeview.component';
import { ComponentsDashboardComponent } from './default/default.component';
import { DropdownDemoComponent } from './dropdown/dropdown.demo';
import { DropdownExampleComponent } from './dropdown/pages/dropdown-example';
import { CheckboxComponent } from './forms/checkbox/checkbox.component';
import { FormsDashboardComponent } from './forms/dashboard/forms-dashboard.component';
import { DatetimeComponent } from './forms/datetime/datetime.component';
import { FormsLandingComponent } from './forms/forms-landing.component';
import { InputsComponent } from './forms/inputs/inputs.component';
import { NumberComponent } from './forms/number/number';
import { PasswordComponent } from './forms/password/password.component';
import { RadiosComponent } from './forms/radios/radios.component';
import { SelectsComponent } from './forms/select/selects.component';
import { TextareaComponent } from './forms/textarea/textarea.component';
import { ToggleComponent } from './forms/toggle/toggle.component';
import { ModalDemoComponent } from './modals/modal.demo';
import { ModalHeadlessComponent } from './modals/pages/modal-headless.component';
import { ModalOverviewComponent } from './modals/pages/modal-overview.component';
import { ModalSimpleComponent } from './modals/pages/modal-simple.component';
import { ModalWizardComponent } from './modals/pages/modal-wizard.component';
import { TabsDemoComponent } from './tabs/tabs.demo';
import { ToastNotificationDashboardDemoComponent } from './toast-notification/toast-notification-dashboard-demo';
import { ToastNotificationOverviewDemoComponent } from './toast-notification/toast-notification-overview';
import { TooltipDemoComponent } from './tooltip/tooltip.demo';
import { TreeViewClientSideDemoComponent } from './tree-view/tree-view-client-side-demo';
import { TreeViewDashboardDemoComponent } from './tree-view/tree-view-dashboard-demo';
import { TreeViewOverviewDemoComponent } from './tree-view/tree-view-overview-demo';
import { TreeViewServerSideDemoComponent } from './tree-view/tree-view-server-side-demo';
import { VirtualScrollerDemoComponent } from './virtual-scroller/virtual-scroller.demo';
import { WidgetDemoComponent } from './widget/widget.demo';

export const COMPONENTS_ROUTES: Routes = [
  {
    path: 'components',
    component: ComponentsLandingComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: ComponentsDashboardComponent },
      {
        path: 'forms',
        component: FormsLandingComponent,
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: FormsDashboardComponent },
          { path: 'inputs', component: InputsComponent },
          { path: 'number', component: NumberComponent },
          { path: 'datetimes', component: DatetimeComponent },
          { path: 'passwords', component: PasswordComponent },
          { path: 'textareas', component: TextareaComponent },
          { path: 'checkboxes', component: CheckboxComponent },
          { path: 'radios', component: RadiosComponent },
          { path: 'selects', component: SelectsComponent },
          { path: 'toggles', component: ToggleComponent }
        ]
      },
      {
        path: 'datagrid',
        component: DatagridDemoComponent,
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: DatagridHomeComponent },
          { path: 'client-side', component: DatagridClientSideComponent },
          { path: 'server-side', component: DatagridServerSideComponent },
          { path: 'infinite-server-side', component: DatagridInfiniteServerSideComponent },
          { path: 'treeview-infinite-server-side', component: DatagridTreeviewInfiniteServerSideComponent }
        ]
      },
      {
        path: 'dropdown',
        component: DropdownDemoComponent,
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: DropdownExampleComponent }
        ]
      },
      {
        path: 'treeview',
        component: TreeViewOverviewDemoComponent,
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: TreeViewDashboardDemoComponent },
          { path: 'client-side', component: TreeViewClientSideDemoComponent },
          { path: 'server-side', component: TreeViewServerSideDemoComponent }
        ]
      },
      {
        path: 'modals',
        component: ModalDemoComponent,
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: ModalOverviewComponent },
          { path: 'standard', component: ModalSimpleComponent },
          { path: 'headless', component: ModalHeadlessComponent },
          { path: 'wizard', component: ModalWizardComponent }
        ]
      },
      {
        path: 'widget',
        component: WidgetDemoComponent
      },
      {
        path: 'toast-notification',
        component: ToastNotificationOverviewDemoComponent,
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: ToastNotificationDashboardDemoComponent }
        ]
      },
      {
        path: 'tabs',
        component: TabsDemoComponent
      },
      {
        path: 'virtual-scroller',
        component: VirtualScrollerDemoComponent
      },
      {
        path: 'tooltip',
        component: TooltipDemoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(COMPONENTS_ROUTES)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule {}
