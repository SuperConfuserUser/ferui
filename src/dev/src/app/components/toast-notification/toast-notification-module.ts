import { HighlightModule } from 'ngx-highlightjs';

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FeruiModule } from '@ferui/components';

import { UtilsModule } from '../../utils/utils.module';

import { ToastNotificationDashboardDemoComponent } from './toast-notification-dashboard-demo';
import { ToastNotificationOverviewDemoComponent } from './toast-notification-overview';

const FUI_DEMO_COMPONENTS_DIRECTIVES: Type<any>[] = [
  ToastNotificationOverviewDemoComponent,
  ToastNotificationDashboardDemoComponent
];

@NgModule({
  imports: [CommonModule, FormsModule, FeruiModule, HighlightModule, RouterModule, UtilsModule],
  declarations: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  exports: [FUI_DEMO_COMPONENTS_DIRECTIVES]
})
export class ToastNotificationDemoModule {}
