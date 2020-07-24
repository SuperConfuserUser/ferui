import { Component } from '@angular/core';
import { FuiModalService } from '@ferui/components';
import { ModalWizard1Component } from './modals/wizard/modal-wizard-1.component';
import { ModalWizard2Component } from './modals/wizard/modal-wizard-2.component';
import { ModalWizard3Component } from './modals/wizard/modal-wizard-3.component';
import { ChildModal4Component } from './modals/child-modals/child-modal-4';
import * as jsBeautify from 'js-beautify';

@Component({
  template: `<div class="container-fluid">
    <div class="row" style="max-width: 1200px">
      <div class="col-12">
        <h2 class="mt-4 mb-4">Wizards Modals</h2>

        <p>
          A wizard window is a window that may have an header, have a body and a footer that contains buttons (like submit or
          cancel buttons) and a steps sections on the left of the window. To create a <strong>wizard</strong> window you just need
          to create the component screen that you want to be compiled within the modal window and implement the interface
          <code>FuiModalWizardWindowScreen</code>. You can access the window controller and the modal controller by injecting them
          to your components deps like so:
        </p>
        <pre><code [languages]="['typescript']" [highlight]="codeExample1"></code></pre>

        <p class="mt-2">
          To open a child window, you must inject the <code>FuiModalWizardWindowCtrl</code> (windowCtrl)
          <code>.openChildWindow()</code> which accept the same params than the <code>.openModal(...)</code> function of
          <code>FuiModalService</code> but instead of passing a complete window configuration object, you just need to pass in the
          child window id that you've declared within the initial window configuration object.
        </p>
        <p class="mt-2">
          Once you have your screen component set and ready you can just use it within the windowConfiguration object:
        </p>
        <pre><code [languages]="['typescript']" [highlight]="codeExample2"></code></pre>

        <h2 class="mt-4 mb-4">Examples of wizard window</h2>

        <p><strong>Note</strong>: To check the returns of every promise, be sure to have your browser console open.</p>

        <fui-tabs>
          <fui-tab [title]="'Example'" [active]="true">
            <div class="bd-example">
              <button class="btn btn-sm btn-primary mr-2" (click)="openWizardModal()">Open wizard modal</button>
            </div>
          </fui-tab>
          <fui-tab [title]="'Code'">
            <pre><code [languages]="['typescript']" [highlight]="codeExample3"></code></pre>
          </fui-tab>
        </fui-tabs>
      </div>
    </div>
  </div>`
})
export class ModalWizardComponent {
  codeExample1: string = jsBeautify.js(
    `
  import { Component, Inject, OnInit } from '@angular/core';
import { FuiModalWizardWindowCtrl, FuiModalCtrl, FuiModalWizardWindowScreen, FUI_MODAL_WINDOW_CTRL_TOKEN, FUI_MODAL_CTRL_TOKEN } from '@ferui/components';

@Component({
  template: \`Template\`
})
export class ExampleWindowComponent implements FuiModalWizardWindowScreen {

  constructor(
    @Inject(FUI_MODAL_WINDOW_CTRL_TOKEN) public windowCtrl: FuiModalWizardWindowCtrl,
    @Inject(FUI_MODAL_CTRL_TOKEN) public modalCtrl: FuiModalCtrl
  ) {}
}`,
    {
      indent_size: 2,
      indent_with_tabs: false
    }
  );

  codeExample2: string = jsBeautify.js(
    `
  // ...
  constructor(private modalService: FuiModalService) {}

  openWizardModal() {
    this.modalService
      .openModal(
        {
          title: 'Wizard Example',
          subtitle: 'This is a simple wizard with 3 steps',
          wizardSteps: [
            {
              stepId: 'wizardStep1',
              label: 'Wizard step 1',
              component: ModalWizard1Component
            },
            {
              stepId: 'wizardStep2',
              label: 'Wizard step 2',
              component: ModalWizard2Component
            },
            {
              stepId: 'wizardStep3',
              label: 'Super long step label (Wizard step 3)',
              component: ModalWizard3Component
            }
          ],
          childWindows: [
            {
              id: 'simpleGrandChildWindow1',
              title: 'Simple Grandchild window',
              component: ChildModal4Component
            }
          ]
        },
        {
          testPromise: new Promise<string>(resolve => {
            setTimeout(() => {
              resolve('Promise value');
            }, 1000);
          }),
          testPromise2: new Promise<string>(resolve => {
            setTimeout(() => {
              resolve('Promise value 2');
            }, 500);
          })
        },
        {
          customParam: 'custom param for wizard'
        }
      )
      .then(args => {
        console.log('[modalService.openModal] openSimpleModal2 ::: submitted ::: ', args);
      });
  }
      // ...`,
    {
      indent_size: 2,
      indent_with_tabs: false
    }
  );

  codeExample3: string = jsBeautify.js(
    `openWizardModal() {
    this.modalService
      .openModal(
        {
          title: 'Wizard Example',
          subtitle: 'This is a simple wizard with 3 steps',
          wizardSteps: [
            {
              stepId: 'wizardStep1',
              label: 'Wizard step 1',
              component: ModalWizard1Component
            },
            {
              stepId: 'wizardStep2',
              label: 'Wizard step 2',
              component: ModalWizard2Component
            },
            {
              stepId: 'wizardStep3',
              label: 'Super long step label (Wizard step 3)',
              component: ModalWizard3Component
            }
          ],
          childWindows: [
            {
              id: 'simpleGrandChildWindow1',
              title: 'Simple Grandchild window',
              component: ChildModal4Component
            }
          ]
        },
        {
          testPromise: new Promise<string>(resolve => {
            setTimeout(() => {
              resolve('Promise value');
            }, 1000);
          }),
          testPromise2: new Promise<string>(resolve => {
            setTimeout(() => {
              resolve('Promise value 2');
            }, 500);
          })
        },
        {
          customParam: 'custom param for wizard'
        }
      )
      .then(args => {
        console.log('[modalService.openModal] openSimpleModal2 ::: submitted ::: ', args);
      });
  }`,
    {
      indent_size: 2,
      indent_with_tabs: false
    }
  );

  constructor(private modalService: FuiModalService) {}

  openWizardModal() {
    this.modalService
      .openModal(
        {
          title: 'Wizard Example',
          subtitle: 'This is a simple wizard with 3 steps',
          wizardSteps: [
            {
              stepId: 'wizardStep1',
              label: 'Wizard step 1',
              component: ModalWizard1Component
            },
            {
              stepId: 'wizardStep2',
              label: 'Wizard step 2',
              component: ModalWizard2Component
            },
            {
              stepId: 'wizardStep3',
              label: 'Super long step label (Wizard step 3)',
              component: ModalWizard3Component
            }
          ],
          childWindows: [
            {
              id: 'simpleGrandChildWindow1',
              title: 'Simple Grandchild window',
              component: ChildModal4Component
            }
          ]
        },
        {
          testPromise: new Promise<string>(resolve => {
            setTimeout(() => {
              resolve('Promise value');
            }, 1000);
          }),
          testPromise2: new Promise<string>(resolve => {
            setTimeout(() => {
              resolve('Promise value 2');
            }, 500);
          })
        },
        {
          customParam: 'custom param for wizard'
        }
      )
      .then(args => {
        console.log('[modalService.openModal] openSimpleModal2 ::: submitted ::: ', args);
      });
  }
}
