import * as jsBeautify from 'js-beautify';

import { Component, Inject, OnInit } from '@angular/core';

import {
  FUI_MODAL_WINDOW_CTRL_TOKEN,
  FuiModalStandardWindowCtrl,
  FuiModalStandardWindowScreen,
  FuiModalWindowParam,
  FuiModalWindowResolve
} from '@ferui/components';

interface ChildParamsInterface extends FuiModalWindowParam {
  param1: string;
  param2: string;
}

interface ChildPromiseInterface extends FuiModalWindowResolve {
  promise1: Promise<string>;
  promise2: Promise<string>;
}

@Component({
  template: `
    <h4>Window example 1</h4>
    <p>There are the params and resolved promises values. For this window, we haven't set any that's why they're empty.</p>
    <p>Params:</p>
    <pre><code [highlight]="paramsStr"></code></pre>
    <p>Resolves:</p>
    <pre><code [highlight]="resolvesStr"></code></pre>

    <p class="mt-2">You can test the child window opening using one of those buttons:</p>
    <button class="btn btn-sm btn-secondary mr-2" (click)="openChildModal(1)">Open child window 1</button>
    <button class="btn btn-sm btn-secondary mr-2" (click)="openChildModal(2)">Open child window 2</button>
    <button class="btn btn-sm btn-secondary mr-2" (click)="openChildModal(3)">Open child window 3</button>
    <button class="btn btn-sm btn-danger mt-2" (click)="openChildModal(4)">Open child window that doesn't exist</button>
    <p class="mt-2"><strong>Note</strong>: This red button won't do anything except logging an error in browser console.</p>

    <h4 class="mt-4">There is the complete code for this screen:</h4>
    <pre><code [languages]="['typescript']" [highlight]="windowExample"></code></pre>
  `
})
export class ModalExample1Component implements FuiModalStandardWindowScreen<any, any, string>, OnInit {
  paramsStr: string;
  resolvesStr: string;

  windowExample: string = `import { Component, Inject } from '@angular/core';
import {
  FuiModalStandardWindowCtrl,
  FuiModalStandardWindowScreen,
  FUI_MODAL_WINDOW_CTRL_TOKEN,
  FuiModalWindowResolve,
  FuiModalWindowParam
} from '@ferui/components';
import * as jsBeautify from 'js-beautify';

interface ChildParamsInterface extends FuiModalWindowParam {
  param1: string;
  param2: string;
}

interface ChildPromiseInterface extends FuiModalWindowResolve {
  promise1: Promise<string>;
  promise2: Promise<string>;
}

@Component({
  template: \`
    <h4>Window example 1</h4>
    <p>There are the params and resolved promises values. For this window, we haven't set any that's why they're empty.</p>
    <p>Params:</p>
    <pre><code [highlight]="paramsStr"></code></pre>
    <p>Resolves:</p>
    <pre><code [highlight]="resolvesStr"></code></pre>

    <p class="mt-2">You can test the child window opening using one of those buttons:</p>
    <button class="btn btn-sm btn-secondary mr-2" (click)="openChildModal(1)">Open child window 1</button>
    <button class="btn btn-sm btn-secondary mr-2" (click)="openChildModal(2)">Open child window 2</button>
    <button class="btn btn-sm btn-secondary mr-2" (click)="openChildModal(3)">Open child window 3</button>
    <button class="btn btn-sm btn-danger mt-2" (click)="openChildModal(4)">Open child window that doesn't exist</button>
    <p class="mt-2"><strong>Note</strong>: This red button won't do anything except logging an error in browser console.</p>

    <h4 class="mt-4">There is the complete code for this window:</h4>
    <pre><code [languages]="['typescript']" [highlight]="windowExample"></code></pre>
  \`
})
export class ModalExample1Component implements FuiModalStandardWindowScreen<any, any, string> {
  paramsStr: string;
  resolvesStr: string;

  windowExample: string = \`\`;

  constructor(
    @Inject(FUI_MODAL_WINDOW_CTRL_TOKEN)
    public windowCtrl: FuiModalStandardWindowCtrl<any, any, string, any, ChildParamsInterface, ChildPromiseInterface>
  ) {}

  ngOnInit(): void {
    this.paramsStr = jsBeautify.js(JSON.stringify(this.windowCtrl.params));
    this.resolvesStr = jsBeautify.js(JSON.stringify(this.windowCtrl.resolves));
  }

  $onSubmit(event: MouseEvent): Promise<string> {
    return Promise.resolve('ModalExample1Component-submit-arg');
  }

  openChildModal(index: number): void {
    const params: ChildParamsInterface = {
      param1: 'Param1 value',
      param2: 'Param2 value'
    };
    const testPromises: ChildPromiseInterface = {
      promise1: new Promise(resolve => {
        setTimeout(() => {
          resolve('Promise1 value');
        }, Math.max(Math.floor(Math.random() * 2501), 1000));
      }),
      promise2: new Promise(resolve => {
        setTimeout(() => {
          resolve('Promise2 value');
        }, Math.max(Math.floor(Math.random() * 2501), 1000));
      })
    };

    switch (index) {
      case 1:
        this.windowCtrl
          .openChildWindow<string>('simpleChildWindow1', testPromises, params)
          .then(args => {
            console.log('[windowCtrl.openChildWindow] simpleChildWindow1 ::: submitted or closed ::: ', args);
          })
          .catch(e => {
            console.log('[windowCtrl.openChildWindow] simpleChildWindow1 ::: error ::: ', e);
          });
        break;
      case 2:
        this.windowCtrl
          .openChildWindow<void>('simpleChildWindow2', testPromises, params)
          .then(() => {
            console.log('[windowCtrl.openChildWindow] simpleChildWindow2 ::: submitted or closed ::: (no data returned)');
          })
          .catch(e => {
            console.log('[windowCtrl.openChildWindow] simpleChildWindow2 ::: error ::: ', e);
          });
        break;
      case 3:
        this.windowCtrl
          .openChildWindow<void>('simpleChildWindow3', testPromises, params)
          .then(() => {
            console.log('[windowCtrl.openChildWindow] simpleChildWindow3 ::: submitted or closed ::: (no data returned)');
          })
          .catch(e => {
            console.log('[windowCtrl.openChildWindow] simpleChildWindow3 ::: error ::: ', e);
          });
        break;
      default:
        this.windowCtrl
          .openChildWindow<void>('simpleChildWindow4', testPromises, params)
          .then(() => {
            console.log('[windowCtrl.openChildWindow] simpleChildWindow4 ::: submitted or closed ::: (no data returned)');
          })
          .catch(e => {
            console.log('[windowCtrl.openChildWindow] simpleChildWindow4 ::: error ::: ', e);
          });
        break;
    }
  }
}`;

  constructor(
    @Inject(FUI_MODAL_WINDOW_CTRL_TOKEN)
    public windowCtrl: FuiModalStandardWindowCtrl<any, any, string, any, ChildParamsInterface, ChildPromiseInterface>
  ) {}

  ngOnInit(): void {
    this.paramsStr = jsBeautify.js(JSON.stringify(this.windowCtrl.params || {}));
    this.resolvesStr = jsBeautify.js(JSON.stringify(this.windowCtrl.resolves || {}));
  }

  $onSubmit(): Promise<string> {
    return Promise.resolve('ModalExample1Component-submit-arg');
  }

  openChildModal(index: number): void {
    const params: ChildParamsInterface = {
      param1: 'Param1 value',
      param2: 'Param2 value'
    };
    const testPromises: ChildPromiseInterface = {
      promise1: new Promise(resolve => {
        setTimeout(() => {
          resolve('Promise1 value');
        }, Math.max(Math.floor(Math.random() * 2501), 1000));
      }),
      promise2: new Promise(resolve => {
        setTimeout(() => {
          resolve('Promise2 value');
        }, Math.max(Math.floor(Math.random() * 2501), 1000));
      })
    };

    switch (index) {
      case 1:
        this.windowCtrl
          .openChildWindow<string>('simpleChildWindow1', testPromises, params)
          .then(args => {
            console.log('[windowCtrl.openChildWindow] simpleChildWindow1 ::: submitted or closed ::: ', args);
          })
          .catch(e => {
            console.log('[windowCtrl.openChildWindow] simpleChildWindow1 ::: error ::: ', e);
          });
        break;
      case 2:
        this.windowCtrl
          .openChildWindow<void>('simpleChildWindow2', testPromises, params)
          .then(() => {
            console.log('[windowCtrl.openChildWindow] simpleChildWindow2 ::: submitted or closed ::: (no data returned)');
          })
          .catch(e => {
            console.log('[windowCtrl.openChildWindow] simpleChildWindow2 ::: error ::: ', e);
          });
        break;
      case 3:
        this.windowCtrl
          .openChildWindow<void>('simpleChildWindow3', testPromises, params)
          .then(() => {
            console.log('[windowCtrl.openChildWindow] simpleChildWindow3 ::: submitted or closed ::: (no data returned)');
          })
          .catch(e => {
            console.log('[windowCtrl.openChildWindow] simpleChildWindow3 ::: error ::: ', e);
          });
        break;
      default:
        this.windowCtrl
          .openChildWindow<void>('simpleChildWindow4', testPromises, params)
          .then(() => {
            console.log('[windowCtrl.openChildWindow] simpleChildWindow4 ::: submitted or closed ::: (no data returned)');
          })
          .catch(e => {
            console.log('[windowCtrl.openChildWindow] simpleChildWindow4 ::: error ::: ', e);
          });
        break;
    }
  }
}
