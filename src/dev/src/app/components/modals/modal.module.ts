import { HighlightModule } from 'ngx-highlightjs';

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FeruiModule } from '@ferui/components';

import { ModalDemoComponent } from './modal.demo';
import { ModalHeadlessComponent } from './pages/modal-headless.component';
import { ModalOverviewComponent } from './pages/modal-overview.component';
import { ModalSimpleComponent } from './pages/modal-simple.component';
import { ModalWizardComponent } from './pages/modal-wizard.component';
import { ChildModal1Component } from './pages/modals/child-modals/child-modal-1';
import { ChildModal2Component } from './pages/modals/child-modals/child-modal-2';
import { ChildModal3Component } from './pages/modals/child-modals/child-modal-3';
import { ChildModal4Component } from './pages/modals/child-modals/child-modal-4';
import { ModalHeadlessExample1Component } from './pages/modals/headless/modal-headless-example-1.component';
import { ModalExample1Component } from './pages/modals/standard/modal-example-1.component';
import { ModalExample2Component } from './pages/modals/standard/modal-example-2.component';
import { ModalExample3Component } from './pages/modals/standard/modal-example-3.component';
import { ModalWizard1Component } from './pages/modals/wizard/modal-wizard-1.component';
import { ModalWizard2Component } from './pages/modals/wizard/modal-wizard-2.component';
import { ModalWizard3Component } from './pages/modals/wizard/modal-wizard-3.component';

const FUI_DEMO_COMPONENTS_DIRECTIVES: Type<any>[] = [
  ModalDemoComponent,
  ModalOverviewComponent,
  ModalSimpleComponent,
  ModalHeadlessComponent,
  ModalWizardComponent,
  ModalExample1Component,
  ModalExample2Component,
  ModalExample3Component,
  ChildModal1Component,
  ChildModal2Component,
  ChildModal3Component,
  ChildModal4Component,
  ModalWizard1Component,
  ModalWizard2Component,
  ModalWizard3Component,
  ModalHeadlessExample1Component
];

@NgModule({
  imports: [CommonModule, FormsModule, FeruiModule, RouterModule, HighlightModule],
  declarations: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  exports: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  entryComponents: [
    ModalExample1Component,
    ModalExample2Component,
    ModalExample3Component,
    ChildModal1Component,
    ChildModal2Component,
    ChildModal3Component,
    ChildModal4Component,
    ModalWizard1Component,
    ModalWizard2Component,
    ModalWizard3Component,
    ModalHeadlessExample1Component
  ]
})
export class ModalDemoModule {}
