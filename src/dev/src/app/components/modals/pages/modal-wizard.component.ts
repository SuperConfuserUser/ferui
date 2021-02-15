import * as jsBeautify from 'js-beautify';

import { Component } from '@angular/core';

import { FuiModalService } from '@ferui/components';

import { ChildModal4Component } from './modals/child-modals/child-modal-4';
import { ModalWizard1Component } from './modals/wizard/modal-wizard-1.component';
import { ModalWizard2Component } from './modals/wizard/modal-wizard-2.component';
import { ModalWizard3Component } from './modals/wizard/modal-wizard-3.component';
import { ModalWizard4Component } from './modals/wizard/modal-wizard-4.component';
import { ModalWizard5Component } from './modals/wizard/modal-wizard-5.component';

@Component({
  template: ` <div class="container-fluid">
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

        <h2 class="mt-4 mb-4">Disable wizard previous steps</h2>

        <p class="mt-2">
          As you may have seen within the
          <a target="_blank" [routerLink]="['/components/modals/overview']" [fragment]="'wizardStepConfig'">Overview</a>
          page, each step configuration allows more in depth configurations specific to the step. For instance, you may want to
          enable the previous steps click feature (enable the previous steps from being reached) for all steps but one. Or you
          might want to disable previous steps click feature for all previous steps.<br />
          This can easily be done respectively by either configuring the step directly from the
          <a target="_blank" [routerLink]="['/components/modals/overview']" [fragment]="'wizardStepConfig'"
            >step configuration object</a
          >
          if you want to apply the option to the specific step only or to the
          <a target="_blank" [routerLink]="['/components/modals/overview']" [fragment]="'wizardWindowConfig'"
            >main window configuration</a
          >
          if you want to apply it to all steps. (using the <code>disableStepsClick</code> option)<br />
          Of course, you can combine both!
        </p>
        <p class="mt-2">
          <b>Note 1</b>: The <code>disableStepsClick</code> property allows you to disable the direct click on the step but it
          will also disable the step from being reached from next steps (which will also disable the click event on the step). If
          you keep a back button or if you're trying to go to the 'disabled' previous step manually by calling
          <code>windowCtrl.$back(null)</code> function for instance, it will try to go to the closest enabled previous step. And
          if there is no enabled step to go to, it will display an error message (like in the demo example below).
        </p>
        <p class="mt-2">
          <b>Note 2</b>: The back button label will automatically change if you can't go back to the direct previous step (current
          step index - 1). Sometimes, you may jump steps like in the example below:
        </p>

        <fui-tabs>
          <fui-tab [title]="'Example'" [active]="true">
            <div class="bd-example">
              <p class="mt-2">
                Go to step 4 or 5, you'll see that the back button label gets changed and inform you that you'll be back to the
                first step (the only step that allows you to be back to, all other steps are disabled).
              </p>
              <button class="btn btn-sm btn-primary mr-2" (click)="openExample5Modal()">Open wizard modal</button>
            </div>
          </fui-tab>
          <fui-tab [title]="'Code'">
            <pre><code [languages]="['typescript']" [highlight]="codeExample5"></code></pre>
          </fui-tab>
        </fui-tabs>

        <h2 class="mt-4 mb-4">Examples of wizard window</h2>

        <p><strong>Note</strong>: To check the returns of every promise, be sure to have your browser console open.</p>

        <fui-tabs>
          <fui-tab [title]="'Example'" [active]="true">
            <div class="bd-example">
              <button class="btn btn-sm btn-info" (click)="disableStepsClick = !disableStepsClick">
                {{ disableStepsClick ? 'Enable all steps click' : 'Disable all steps click' }}
              </button>
              <button class="btn btn-sm btn-info ml-1" (click)="disableBackButton = !disableBackButton">
                {{ disableBackButton ? 'Enable all back buttons' : 'Disable all back buttons' }}
              </button>
              <button class="btn btn-sm btn-warning ml-1" (click)="disableGoingBack()">
                {{
                  inStepDisableStepsClick && inStepDisableBackButton
                    ? 'Enable going back for steps 2 & 3'
                    : 'Disable going back for steps 2 & 3'
                }}
              </button>
              <br />
              <p class="mt-2">
                <b>Note</b>: The individual step configuration will ALWAYS take precedence and override the main modal
                configurations we might have. This is why in this example, when you click on "Disable steps click" and "Disable
                back button" but you keep "Disable going back from step" un-clicked you may see some weird behaviour within the
                modal (like having the back button on step 3 and the step 2 clickable even if you set the global variables to
                false. This is because those main window configurations are overridden by the individual steps configuration). See
                the code section to see what is going on.
              </p>
              <button class="btn btn-sm btn-primary mr-2" (click)="openWizardModal()">Open wizard modal</button>
            </div>
          </fui-tab>
          <fui-tab [title]="'Code'">
            <pre><code [languages]="['typescript']" [highlight]="codeExample3"></code></pre>
          </fui-tab>
        </fui-tabs>

        <fui-tabs>
          <fui-tab [title]="'Example'" [active]="true">
            <div class="bd-example">
              <button class="btn btn-sm btn-primary mr-2" (click)="openErrorWizardModal()">Error wizard modal</button>
            </div>
          </fui-tab>
          <fui-tab [title]="'Code'">
            <pre><code [languages]="['typescript']" [highlight]="codeExample4"></code></pre>
          </fui-tab>
        </fui-tabs>

        <fui-tabs>
          <fui-tab [title]="'Example'" [active]="true">
            <div class="bd-example">
              <button class="btn btn-sm btn-primary mr-2" (click)="openWizardModalError()">Wizard without any steps</button>
            </div>
          </fui-tab>
          <fui-tab [title]="'Code'">
            <pre><code [languages]="['typescript']" [highlight]="codeExampleError"></code></pre>
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
          subtitle: 'This is a long subtitle for wizard with 5 steps',
          withBackBtn: !this.disableBackButton,
          disableStepsClick: this.disableStepsClick,
          wizardSteps: [
            {
              stepId: 'wizardStep1',
              label: 'Wizard step 1 long title',
              component: ModalWizard1Component
            },
            {
              stepId: 'wizardStep2',
              label: 'Super long step label (Wizard step 2)',
              component: ModalWizard2Component,
              subtitle: 'This title is really long... Who wants to do that uhh?',
              disableStepsClick: this.inStepDisableStepsClick
            },
            {
              stepId: 'wizardStep3',
              label: 'Wizard step 3',
              component: ModalWizard3Component,
              withBackBtn: !this.inStepDisableBackButton,
              disableStepsClick: this.inStepDisableStepsClick
            },
            {
              stepId: 'wizardStep4',
              label: 'Wizard step 4',
              component: ModalWizard4Component,
              title: 'This step override the modal title',
              subtitle: 'And subtitle'
            },
            {
              stepId: 'wizardStep5',
              label: 'Wizard step 5',
              title: 'Are you really sure you want to submit?',
              subtitle: '',
              component: ModalWizard5Component
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
          subtitle: 'This is a long subtitle for wizard with 5 steps',
          withBackBtn: !this.disableBackButton,
          disableStepsClick: this.disableStepsClick,
          wizardSteps: [
            {
              stepId: 'wizardStep1',
              label: 'Wizard step 1 long title',
              component: ModalWizard1Component
            },
            {
              stepId: 'wizardStep2',
              label: 'Super long step label (Wizard step 2)',
              component: ModalWizard2Component,
              subtitle: 'This title is really long... Who wants to do that uhh?',
              disableStepsClick: this.inStepDisableStepsClick
            },
            {
              stepId: 'wizardStep3',
              label: 'Wizard step 3',
              component: ModalWizard3Component,
              withBackBtn: !this.inStepDisableBackButton,
              disableStepsClick: this.inStepDisableStepsClick
            },
            {
              stepId: 'wizardStep4',
              label: 'Wizard step 4',
              component: ModalWizard4Component,
              title: 'This step override the modal title',
              subtitle: 'And subtitle'
            },
            {
              stepId: 'wizardStep5',
              label: 'Wizard step 5',
              title: 'Are you really sure you want to submit?',
              subtitle: '',
              component: ModalWizard5Component
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

  codeExample4: string = jsBeautify.js(
    `
openErrorWizardModal() {
    this.modalService
      .openModal(
        {
          title: 'Wizard Error',
          subtitle: 'This is a simple wizard with 1 steps',
          wizardSteps: [
            {
              stepId: 'wizardStep1',
              label: 'Wizard step 1',
              component: ModalWizard1Component
            }
          ]
        },
        {
          errorPromise: new Promise<string>((resolve, reject) => {
            setTimeout(() => {
              reject('There where an issue with promise \`errorPromise\`.');
            }, 600);
          })
        }
      )
      .then(args => {
        console.log('[modalService.openModal] openErrorWizardModal ::: submitted ::: ', args);
      });
  }
  `,
    {
      indent_size: 2,
      indent_with_tabs: false
    }
  );

  codeExample5 = `openExampleModal() {
    this.modalService
      .openModal(
        {
          title: 'Wizard Example',
          subtitle: 'This is a long subtitle for wizard with 5 steps',
          withBackBtn: true, // Default to true
          disableStepsClick: true, // Enabled by default, here we disable it.
          wizardSteps: [
            {
              stepId: 'ex5wizardStep1',
              label: 'Wizard step 1 long title',
              component: ModalWizard1Component,
              disableStepsClick: false // We let the user go back to this step.
            },
            {
              stepId: 'ex5wizardStep2',
              label: 'Wizard step 2 long label',
              component: ModalWizard2Component,
              subtitle: 'This title is really long... Who wants to do that uhh?',
              withBackBtn: false // We disable the back button for this step
            },
            {
              stepId: 'ex5wizardStep3',
              label: 'Wizard step 3',
              component: ModalWizard3Component,
              withBackBtn: false // We disable the back button for this step
            },
            {
              stepId: 'ex5wizardStep4',
              label: 'Wizard step 4',
              component: ModalWizard4Component,
              title: 'This step override the modal title',
              subtitle: 'And subtitle'
            },
            {
              stepId: 'ex5wizardStep5',
              label: 'Wizard step 5',
              title: 'Are you really sure you want to submit?',
              subtitle: '',
              component: ModalWizard5Component
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
        console.log('[modalService.openModal] openExample5Modal ::: submitted ::: ', args);
      });
  }`;

  codeExampleError = `openWizardModalError() {
  this.modalService
    .openModal<string>({
      id: 'wizardError',
      title: 'Modal without any steps',
      wizardSteps: []
    })
    .then(() => {
      console.log('[modalService.openModal] openWizardModalError ::: closed');
    });
}`;

  disableStepsClick: boolean = false;
  disableBackButton: boolean = false;

  inStepDisableStepsClick: boolean = false;
  inStepDisableBackButton: boolean = false;

  constructor(private modalService: FuiModalService) {}

  disableGoingBack(): void {
    this.inStepDisableStepsClick = !this.inStepDisableStepsClick;
    this.inStepDisableBackButton = !this.inStepDisableBackButton;
  }

  openWizardModal() {
    this.modalService
      .openModal(
        {
          title: 'Wizard Example',
          subtitle: 'This is a long subtitle for wizard with 5 steps',
          withBackBtn: !this.disableBackButton,
          disableStepsClick: this.disableStepsClick,
          wizardSteps: [
            {
              stepId: 'wizardStep1',
              label: 'Wizard step 1 long title',
              component: ModalWizard1Component
            },
            {
              stepId: 'wizardStep2',
              label: 'Super long step label (Wizard step 2)',
              component: ModalWizard2Component,
              subtitle: 'This title is really long... Who wants to do that uhh?',
              disableStepsClick: this.inStepDisableStepsClick
            },
            {
              stepId: 'wizardStep3',
              label: 'Wizard step 3',
              component: ModalWizard3Component,
              withBackBtn: !this.inStepDisableBackButton,
              disableStepsClick: this.inStepDisableStepsClick
            },
            {
              stepId: 'wizardStep4',
              label: 'Wizard step 4',
              component: ModalWizard4Component,
              title: 'This step override the modal title',
              subtitle: 'And subtitle'
            },
            {
              stepId: 'wizardStep5',
              label: 'Wizard step 5',
              title: 'Are you really sure you want to submit?',
              subtitle: '',
              component: ModalWizard5Component
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

  openErrorWizardModal() {
    this.modalService
      .openModal(
        {
          title: 'Wizard Error',
          subtitle: 'This is a simple wizard with 1 steps',
          wizardSteps: [
            {
              stepId: 'wizardStep1',
              label: 'Wizard step 1',
              component: ModalWizard1Component
            }
          ]
        },
        {
          errorPromise: new Promise<string>((resolve, reject) => {
            setTimeout(() => {
              reject('There where an issue with promise `errorPromise`.');
            }, 600);
          })
        }
      )
      .then(args => {
        console.log('[modalService.openModal] openErrorWizardModal ::: submitted ::: ', args);
      });
  }

  openWizardModalError() {
    this.modalService
      .openModal<string>({
        id: 'wizardError',
        title: 'Modal without any steps',
        wizardSteps: []
      })
      .then(() => {
        console.log('[modalService.openModal] openWizardModalError ::: closed');
      });
  }

  openExample5Modal() {
    this.modalService
      .openModal(
        {
          title: 'Wizard Example',
          subtitle: 'This is a long subtitle for wizard with 5 steps',
          withBackBtn: true, // Default to true
          disableStepsClick: true, // Enabled by default, here we disable it.
          wizardSteps: [
            {
              stepId: 'ex5wizardStep1',
              label: 'Wizard step 1 long title',
              component: ModalWizard1Component,
              disableStepsClick: false // We let the user go back to this step.
            },
            {
              stepId: 'ex5wizardStep2',
              label: 'Wizard step 2 long label',
              component: ModalWizard2Component,
              subtitle: 'This title is really long... Who wants to do that uhh?',
              withBackBtn: false // We disable the back button for this step
            },
            {
              stepId: 'ex5wizardStep3',
              label: 'Wizard step 3',
              component: ModalWizard3Component,
              withBackBtn: false // We disable the back button for this step
            },
            {
              stepId: 'ex5wizardStep4',
              label: 'Wizard step 4',
              component: ModalWizard4Component,
              title: 'This step override the modal title',
              subtitle: 'And subtitle'
            },
            {
              stepId: 'ex5wizardStep5',
              label: 'Wizard step 5',
              title: 'Are you really sure you want to submit?',
              subtitle: '',
              component: ModalWizard5Component
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
        console.log('[modalService.openModal] openExample5Modal ::: submitted ::: ', args);
      });
  }
}
