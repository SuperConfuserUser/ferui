import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { FuiAlertsModule } from '../alerts/alerts.module';
import { ClrIconModule } from '../icon/icon.module';

import { FuiModalErrorWindowComponent } from './components/modals-error-window.component';
import { FuiModalHeadlessWindowComponent } from './components/modals-headless-window.component';
import { FuiModalStandardWindowComponent } from './components/modals-standard-window.component';
import { FuiModalWizardWindowComponent } from './components/modals-wizard-window.component';
import { FuiModalComponent } from './components/modals.component';
import { FuiModalErrorScreenComponent } from './components/screens/modal-error-screen.component';

const FUI_MODALS_DIRECTIVES: Type<any>[] = [
  FuiModalComponent,
  FuiModalHeadlessWindowComponent,
  FuiModalStandardWindowComponent,
  FuiModalWizardWindowComponent,
  FuiModalErrorScreenComponent,
  FuiModalErrorWindowComponent
];

@NgModule({
  imports: [CommonModule, ClrIconModule, FuiAlertsModule],
  declarations: [FUI_MODALS_DIRECTIVES],
  exports: [FUI_MODALS_DIRECTIVES],
  entryComponents: [FUI_MODALS_DIRECTIVES]
})
export class FuiModalsModule {}
