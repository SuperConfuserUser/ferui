import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClrIconModule } from '../icon/icon.module';

import { FuiToastNotificationComponent } from './toast-notification-component';
import { FuiToastNotificationService } from './toast-notification-service';

export const FUI_TOAST_NOTIFICATION_DIRECTIVES: Type<any>[] = [FuiToastNotificationComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule],
  declarations: [FUI_TOAST_NOTIFICATION_DIRECTIVES],
  exports: [FUI_TOAST_NOTIFICATION_DIRECTIVES],
  providers: [FuiToastNotificationService],
  entryComponents: [FuiToastNotificationComponent]
})
export class FuiToastNotificationModule {}
