import * as jsBeautify from 'js-beautify';

import { Component, TemplateRef, ViewChild } from '@angular/core';

import { FuiModalService } from '@ferui/components';

import { ChildModal1Component } from './modals/child-modals/child-modal-1';
import { ChildModal2Component } from './modals/child-modals/child-modal-2';
import { ChildModal3Component } from './modals/child-modals/child-modal-3';
import { ChildModal4Component } from './modals/child-modals/child-modal-4';
import { ModalExample1Component } from './modals/standard/modal-example-1.component';
import { ModalExample2Component } from './modals/standard/modal-example-2.component';
import { ModalExample3Component } from './modals/standard/modal-example-3.component';

@Component({
  template: `
    <div class="container-fluid">
      <div class="row" style="max-width: 1200px">
        <div class="col-12 mb-4">
          <h2 class="mt-4 mb-4">Standard Modals</h2>

          <p>
            A standard window is a window that may have an header, have a body and a footer that contains buttons (like submit or
            cancel buttons). To create a <strong>standard</strong> window you just need to create the component screen that you
            want to be compiled within the modal window and implement the interface <code>FuiModalStandardWindowScreen</code>. You
            can access the window controller and the modal controller by injecting them to your components deps like so:
          </p>
          <pre><code [languages]="['typescript']" [highlight]="codeExample1"></code></pre>

          <p class="mt-2">
            To open a child window, you you must inject the <code>FuiModalStandardWindowCtrl</code> (windowCtrl)
            <code>.openChildWindow()</code> which accept the same params than the <code>.openModal(...)</code> function of
            <code>FuiModalService</code> but instead of passing a complete window configuration object, you just need to pass in
            the child window id that you've declared within the initial window configuration object.
          </p>
          <p class="mt-2">
            Once you have your screen component set and ready you can just use it within the windowConfiguration object:
          </p>
          <pre><code [languages]="['typescript']" [highlight]="codeExample2"></code></pre>

          <h2 id="standard-window-examples" class="mt-4 mb-4">
            Examples of standard window that may or may not have child windows
          </h2>

          <p><strong>Note</strong>: To check the returns of every promise, be sure to have your browser console open.</p>

          <fui-tabs>
            <fui-tab [label]="'Example 1'">
              <div class="bd-example">
                <button class="btn btn-sm btn-primary mr-2" (click)="openSimpleModal()">Open simple modal with children</button>
              </div>
            </fui-tab>
            <fui-tab [label]="'Code'">
              <pre><code [languages]="['typescript']" [highlight]="codeExample3"></code></pre>
            </fui-tab>
          </fui-tabs>

          <fui-tabs class="mt-4">
            <fui-tab [label]="'Example 2'">
              <div class="bd-example">
                <button class="btn btn-sm btn-secondary mr-2" (click)="openSimpleModal2()">
                  Open modal with resolve & close confirmation
                </button>
              </div>
            </fui-tab>
            <fui-tab [label]="'Code'">
              <pre><code [languages]="['typescript']" [highlight]="codeExample4"></code></pre>
            </fui-tab>
          </fui-tabs>

          <fui-tabs class="mt-4">
            <fui-tab [label]="'Example 3'">
              <div class="bd-example">
                <button class="btn btn-sm btn-info" (click)="openSimpleModal3()">Open modal with resolve & params</button>
              </div>
            </fui-tab>
            <fui-tab [label]="'Code'">
              <pre><code [languages]="['typescript']" [highlight]="codeExample5"></code></pre>
            </fui-tab>
          </fui-tabs>

          <fui-tabs class="mt-4">
            <fui-tab [label]="'Error screen'">
              <div class="bd-example">
                <button class="btn btn-sm btn-info" (click)="openSimpleModalError()">Open modal without any component set</button>
              </div>
            </fui-tab>
            <fui-tab [label]="'Code'">
              <pre><code [languages]="['typescript']" [highlight]="codeExampleError"></code></pre>
            </fui-tab>
          </fui-tabs>
        </div>
      </div>
    </div>
    <ng-template #testTitleTplt>
      <div class="fui-modal-header-title">
        <clr-icon shape="fui-document-list"></clr-icon>
        This title illustrate a simple modal using 'titleTemplate' and a really long long long long title
      </div>
      <div class="fui-modal-header-subtitle">
        You can of course use the same FerUI classes as the regular modal for more convenience.
      </div>
    </ng-template>
  `
})
export class ModalSimpleComponent {
  @ViewChild('testTitleTplt') example1TitleTplt: TemplateRef<any>;

  codeExample1: string = jsBeautify.js(
    `
  import { Component, Inject, OnInit } from '@angular/core';
import { FuiModalStandardWindowCtrl, FuiModalCtrl, FuiModalStandardWindowScreen, FUI_MODAL_WINDOW_CTRL_TOKEN, FUI_MODAL_CTRL_TOKEN } from '@ferui/components';

@Component({
  template: \`Template\`
})
export class ExampleWindowComponent implements FuiModalStandardWindowScreen {

  constructor(
    @Inject(FUI_MODAL_WINDOW_CTRL_TOKEN) public windowCtrl: FuiModalStandardWindowCtrl,
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

  this.modalService
      .openModal({
        id: 'simpleWindow',
        title: 'Simple Window with children',
        component: ModalExample1Component,
        childWindows: [
          {
            id: 'simpleChildWindow1',
            title: 'Simple Child window',
            component: ChildModal1Component
          }
        ]
      })
      .then((...args) => {
        console.log('[modalService.openModal] openSimpleModal ::: submitted ::: ', ...args);
      });
      // ...`,
    {
      indent_size: 2,
      indent_with_tabs: false
    }
  );

  codeExample3: string = `@Component({
  template: \`
    ...
    <ng-template #testTitleTplt>
      <div class="fui-modal-header-title">
        <clr-icon shape="fui-document-list"></clr-icon>
        This title illustrate a simple modal using 'titleTemplate'
      </div>
      <div class="fui-modal-header-subtitle">
        You can of course use the same FerUI classes as the regular modal for more convenience.
      </div>
    </ng-template>
    ...
  \`
})
export class ModalSimpleComponent {
  @ViewChild('testTitleTplt') example1TitleTplt: TemplateRef<any>;

  ...

  openSimpleModal() {
    this.modalService
      .openModal({
        id: 'simpleWindow',
        titleTemplate: this.example1TitleTplt,
        component: ModalExample1Component,
        childWindows: [
          {
            id: 'simpleChildWindow1',
            title: 'Simple Child window',
            component: ChildModal1Component
          },
          {
            id: 'simpleChildWindow2',
            title: 'Simple Child window 2',
            width: 900,
            component: ChildModal2Component,
            childWindows: [
              {
                id: 'simpleGrandChildWindow1',
                title: 'Simple Grandchild window',
                component: ChildModal4Component
              },
              {
                id: 'simpleGrandChildWindow2',
                title: 'Simple Grandchild window 2',
                component: ChildModal4Component
              }
            ]
          },
          {
            id: 'simpleChildWindow3',
            title: 'Simple Child window 3',
            component: ChildModal3Component
          }
        ]
      })
      .then((...args) => {
        console.log('[modalService.openModal] openSimpleModal ::: submitted ::: ', ...args);
      });
  }
}`;

  codeExample4: string = jsBeautify.js(
    `openSimpleModal2() {
    this.modalService
      .openModal(
        {
          id: 'simpleWindow2',
          title: 'Simple Window 2',
          subtitle: 'With resolve',
          component: ModalExample2Component,
          closeConfirm: true
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
        }
      )
      .then((...args) => {
        console.log('[modalService.openModal] openSimpleModal2 ::: submitted ::: ', ...args);
      });
  }`,
    {
      indent_size: 2,
      indent_with_tabs: false
    }
  );

  codeExample5: string = jsBeautify.js(
    `openSimpleModal3() {
    this.modalService
      .openModal(
        {
          id: 'simpleModal3',
          title: 'Simple modal 3',
          subtitle: 'With resolve & params',
          component: ModalExample3Component,
          submitButton: {
            label: 'close',
            cssClass: 'btn-secondary'
          }
        },
        {
          testPromise: new Promise<string>(resolve => {
            setTimeout(() => {
              resolve('Promise value');
            }, 500);
          })
        },
        {
          uuid: 'test_uuid',
          title: 'test title'
        }
      )
      .then((...args) => {
        console.log('[modalService.openModal] openSimpleModal3 ::: submitted ::: ', ...args);
      });
  }`,
    {
      indent_size: 2,
      indent_with_tabs: false
    }
  );

  codeExampleError = `openSimpleModalError() {
  this.modalService
    .openModal<string>({
      id: 'simpleModal3',
      title: 'Simple modal 3',
      subtitle: 'With resolve & params'
    })
    .then(() => {
      console.log('[modalService.openModal] openSimpleModalError ::: closed');
    });
}`;

  constructor(private modalService: FuiModalService) {}

  openSimpleModal() {
    this.modalService
      .openModal<string>({
        id: 'simpleWindow',
        titleTemplate: this.example1TitleTplt,
        width: 700,
        component: ModalExample1Component,
        childWindows: [
          {
            id: 'simpleChildWindow1',
            title: 'Simple Child window',
            component: ChildModal1Component
          },
          {
            id: 'simpleChildWindow2',
            title: 'Simple Child window 2',
            width: 900,
            component: ChildModal2Component,
            childWindows: [
              {
                id: 'simpleGrandChildWindow1',
                title: 'Simple Grandchild window',
                component: ChildModal4Component
              },
              {
                id: 'simpleGrandChildWindow2',
                title: 'Simple Grandchild window 2',
                component: ChildModal4Component
              }
            ]
          },
          {
            id: 'simpleChildWindow3',
            title: 'Simple Child window 3',
            component: ChildModal3Component
          }
        ]
      })
      .then(args => {
        console.log('[modalService.openModal] openSimpleModal ::: submitted ::: ', args);
      });
  }

  openSimpleModal2() {
    this.modalService
      .openModal<string>(
        {
          id: 'simpleWindow2',
          title: 'Simple Window 2',
          subtitle: 'With resolve',
          component: ModalExample2Component,
          closeConfirm: true
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
        }
      )
      .then(args => {
        console.log('[modalService.openModal] openSimpleModal2 ::: submitted ::: ', args);
      });
  }

  openSimpleModal3() {
    this.modalService
      .openModal<string>(
        {
          id: 'simpleModal3',
          title: 'Simple modal 3',
          subtitle: 'With resolve & params',
          component: ModalExample3Component,
          submitButton: {
            label: 'close',
            cssClass: 'btn-secondary'
          }
        },
        {
          testPromise: new Promise<string>(resolve => {
            setTimeout(() => {
              resolve('Promise value');
            }, 500);
          })
        },
        {
          uuid: 'test_uuid',
          title: 'test title'
        }
      )
      .then((args: string) => {
        console.log('[modalService.openModal] openSimpleModal3 ::: submitted ::: ', args);
      });
  }

  openSimpleModalError() {
    this.modalService
      .openModal<string>({
        id: 'simpleModal3',
        title: 'Simple modal 3',
        subtitle: 'With resolve & params'
      })
      .then(() => {
        console.log('[modalService.openModal] openSimpleModalError ::: closed');
      });
  }
}
