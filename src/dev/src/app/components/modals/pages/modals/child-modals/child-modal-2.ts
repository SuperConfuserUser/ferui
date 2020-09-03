import * as jsBeautify from 'js-beautify';

import { Component, Inject, OnInit } from '@angular/core';

import { FUI_MODAL_WINDOW_CTRL_TOKEN, FuiModalStandardWindowCtrl, FuiModalStandardWindowScreen } from '@ferui/components';

@Component({
  template: `
    <h4>Child Modal example 2</h4>
    <p>Params:</p>
    <pre><code [highlight]="params"></code></pre>
    <p>Resolves:</p>
    <pre><code [highlight]="resolves"></code></pre>
    <button class="btn btn-sm btn-secondary mr-2" (click)="openChildModal()">Open grand child modal</button>
    <button class="btn btn-sm btn-secondary" (click)="openChildModalError()">Open error modal</button>
  `
})
export class ChildModal2Component implements FuiModalStandardWindowScreen, OnInit {
  params: string;
  resolves: string;

  constructor(@Inject(FUI_MODAL_WINDOW_CTRL_TOKEN) public windowCtrl: FuiModalStandardWindowCtrl) {}

  ngOnInit(): void {
    this.params = jsBeautify.js(JSON.stringify(this.windowCtrl.params));
    this.resolves = jsBeautify.js(JSON.stringify(this.windowCtrl.resolves));
  }

  openChildModal() {
    this.windowCtrl
      .openChildWindow('simpleGrandChildWindow1')
      .then((...args) => {
        console.log('[windowCtrl.openChildWindow] simpleGrandChildWindow1 ::: submitted or closed ::: ', ...args);
      })
      .catch(e => {
        console.log('[windowCtrl.openChildWindow] simpleGrandChildWindow1 ::: error ::: ', e);
      });
  }

  openChildModalError() {
    const errorPromise: Promise<any> = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('An error occurred when trying to open simpleGrandChildWindow2 window. Rejected promise.');
      }, 1000);
    });
    this.windowCtrl
      .openChildWindow('simpleGrandChildWindow2', {
        errorPromise: errorPromise
      })
      .then((...args) => {
        console.log('[windowCtrl.openChildWindow] simpleGrandChildWindow2 ::: submitted or closed ::: ', ...args);
      })
      .catch(e => {
        console.log('[windowCtrl.openChildWindow] simpleGrandChildWindow2 ::: error ::: ', e);
      });
  }

  $onSubmit(event: MouseEvent): Promise<void> {
    return Promise.resolve();
  }
}
