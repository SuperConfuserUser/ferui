import * as jsBeautify from 'js-beautify';

import { Component } from '@angular/core';

import { FuiModalService } from '@ferui/components';

import { ChildModal3Component } from './modals/child-modals/child-modal-3';
import { ModalHeadlessExample1Component } from './modals/headless/modal-headless-example-1.component';

@Component({
  template: `
    <div class="container-fluid">
      <div class="row" style="max-width: 1200px">
        <div class="col-12 mb-4">
          <h2 class="mt-4 mb-4">Headless Modals</h2>

          <p>
            An headless window is a window that have no header nor footer but only a body. To create a
            <strong>headless</strong> window you just need to create the component screen that you want to be compiled within the
            modal window and implement the interface <code>FuiModalHeadlessWindowScreen</code>. You can access the headless window
            controller and the modal controller by injecting them to your components deps like so:
          </p>
          <pre><code [languages]="['typescript']" [highlight]="codeExample1"></code></pre>

          <p class="mt-2">
            Once you have your screen component set and ready you can just use it within the windowConfiguration object:
          </p>
          <pre><code [languages]="['typescript']" [highlight]="codeExample2"></code></pre>

          <h2 class="mt-4 mb-4">Examples of headless window that may or may not have child windows</h2>

          <p><strong>Note</strong>: To check the returns of every promise, be sure to have your browser console open.</p>

          <fui-tabs>
            <fui-tab [title]="'Example'" [active]="true">
              <div class="bd-example">
                <button class="btn btn-sm btn-primary mr-2" (click)="openModal1()">Open simple modal with child</button>
              </div>
            </fui-tab>
            <fui-tab [title]="'Code'">
              <pre><code [languages]="['typescript']" [highlight]="codeExample3"></code></pre>
            </fui-tab>
          </fui-tabs>
        </div>
      </div>
    </div>
  `
})
export class ModalHeadlessComponent {
  codeExample1: string = jsBeautify.js(
    `
  import { Component, Inject, OnInit } from '@angular/core';
import { FuiModalHeadlessWindowCtrl, FuiModalCtrl, FuiModalHeadlessWindowScreen, FUI_MODAL_WINDOW_CTRL_TOKEN, FUI_MODAL_CTRL_TOKEN } from '@ferui/components';

@Component({
  template: \`Template\`
})
export class ModalHeadlessExample1Component implements FuiModalHeadlessWindowScreen {

  constructor(
    @Inject(FUI_MODAL_WINDOW_CTRL_TOKEN) public windowCtrl: FuiModalHeadlessWindowCtrl,
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

.openModal(
  {
    id: 'headlessModal1',
    component: ModalHeadlessExample1Component,
    childWindows: [
      {
        id: 'simpleChildWindow1',
        title: 'Simple Child window',
        component: ChildModal3Component
      }
    ]
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
  console.log('[modalService.openModal] openModal1 ::: submitted ::: ', ...args);
})
.catch(e => {
  console.log('[modalService.openModal] openModal1 ::: error ::: ', e);
});
// ...`,
    {
      indent_size: 2,
      indent_with_tabs: false
    }
  );

  codeExample3: string = jsBeautify.js(
    `openModal1() {
    this.modalService
      .openModal(
        {
          id: 'headlessModal1',
          component: ModalHeadlessExample1Component,
          childWindows: [
            {
              id: 'simpleChildWindow1',
              title: 'Simple Child window',
              component: ChildModal3Component
            }
          ]
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
        console.log('[modalService.openModal] openModal1 ::: submitted ::: ', ...args);
      })
      .catch(e => {
        console.log('[modalService.openModal] openModal1 ::: error ::: ', e);
      });
  }`,
    {
      indent_size: 2,
      indent_with_tabs: false
    }
  );

  constructor(private modalService: FuiModalService) {}

  openModal1() {
    this.modalService
      .openModal(
        {
          id: 'headlessModal1',
          component: ModalHeadlessExample1Component,
          childWindows: [
            {
              id: 'simpleChildWindow1',
              title: 'Simple Child window',
              component: ChildModal3Component
            }
          ]
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
        console.log('[modalService.openModal] openModal1 ::: submitted ::: ', ...args);
      })
      .catch(e => {
        console.log('[modalService.openModal] openModal1 ::: error ::: ', e);
      });
  }
}
