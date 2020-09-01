import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClrIconModule } from '../icon/icon.module';
import { FuiModalComponent } from './components/modals.component';
import { FuiModalHeadlessWindowComponent } from './components/modals-headless-window.component';
import { FuiModalStandardWindowComponent } from './components/modals-standard-window.component';
import { FuiModalWizardWindowComponent } from './components/modals-wizard-window.component';
import { FuiAlertsModule } from '../alerts/alerts.module';
import { FuiModalErrorScreenComponent } from './components/screens/modal-error-screen.component';
import { FuiModalErrorWindowComponent } from './components/modals-error-window.component';

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
