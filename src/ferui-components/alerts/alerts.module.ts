import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { ClrIconModule } from '../icon/icon.module';

import { FuiAlertsIconDirective } from './alerts-icon.directive';
import { FuiAlertsComponent } from './alerts.component';

export const FUI_ALERTS_DIRECTIVES: Type<any>[] = [FuiAlertsComponent, FuiAlertsIconDirective];

@NgModule({
  imports: [CommonModule, ClrIconModule],
  declarations: [FUI_ALERTS_DIRECTIVES],
  exports: [FUI_ALERTS_DIRECTIVES]
})
export class FuiAlertsModule {}
