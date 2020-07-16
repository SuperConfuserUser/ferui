import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeruiModule } from '@ferui/components';
import { HighlightModule } from 'ngx-highlightjs';
import { RouterModule } from '@angular/router';
import { ToastNotificationOverviewDemo } from './toast-notification-overview';
import { ToastNotificationDashboardDemo } from './toast-notification-dashboard-demo';
import { UtilsModule } from '../../utils/utils.module';

const FUI_DEMO_COMPONENTS_DIRECTIVES: Type<any>[] = [ToastNotificationOverviewDemo, ToastNotificationDashboardDemo];

@NgModule({
  imports: [CommonModule, FormsModule, FeruiModule, HighlightModule, RouterModule, UtilsModule],
  declarations: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  exports: [FUI_DEMO_COMPONENTS_DIRECTIVES]
})
export class ToastNotificationDemoModule {}
