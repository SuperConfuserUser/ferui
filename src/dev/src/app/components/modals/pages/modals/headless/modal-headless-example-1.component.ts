import { Component, Inject, OnInit } from '@angular/core';
import { FuiModalHeadlessWindowCtrl, FuiModalHeadlessWindowScreen, FUI_MODAL_WINDOW_CTRL_TOKEN } from '@ferui/components';
import * as jsBeautify from 'js-beautify';

@Component({
  template: `
    <h4>Headless window example</h4>
    <p>Params:</p>
    <pre><code [highlight]="params"></code></pre>
    <p>Resolves:</p>
    <pre><code [highlight]="resolves"></code></pre>

    <p>
      <strong>Note</strong>: The only way to close the window is by clicking on the cross icon (top right corner) or by pressing
      <kbd>Esc</kbd>.
    </p>

    <button class="btn btn-sm btn-secondary mr-2" (click)="openChildModal()">Open child window</button>
  `
})
export class ModalHeadlessExample1Component implements OnInit, FuiModalHeadlessWindowScreen {
  params: string;
  resolves: string;

  constructor(@Inject(FUI_MODAL_WINDOW_CTRL_TOKEN) public windowCtrl: FuiModalHeadlessWindowCtrl) {}

  ngOnInit(): void {
    this.params = jsBeautify.js(JSON.stringify(this.windowCtrl.params));
    this.resolves = jsBeautify.js(JSON.stringify(this.windowCtrl.resolves));
  }

  openChildModal() {
    this.windowCtrl
      .openChildWindow('simpleChildWindow1')
      .then((...args) => {
        console.log('[windowCtrl.openChildWindow] simpleChildWindow1 ::: submitted or closed ::: ', ...args);
      })
      .catch(e => {
        console.log('[windowCtrl.openChildWindow] simpleChildWindow1 ::: error ::: ', e);
      });
  }
}
