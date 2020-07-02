import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ClrIconModule } from '../icon/icon.module';
import { FuiAlertsComponent } from './alerts.component';
import { FuiAlertsIcon } from './alerts-icon.directive';

export const FUI_DROPDOWN_DIRECTIVES: Type<any>[] = [FuiAlertsComponent, FuiAlertsIcon];

@NgModule({
  imports: [CommonModule, ClrIconModule],
  declarations: [FUI_DROPDOWN_DIRECTIVES],
  exports: [FUI_DROPDOWN_DIRECTIVES]
})
export class FuiAlertsModule {}
