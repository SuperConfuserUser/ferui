import * as jsBeautify from 'js-beautify';

import { Component, Inject, OnInit } from '@angular/core';

import { FUI_MODAL_WINDOW_CTRL_TOKEN, FuiModalWizardWindowCtrl, FuiModalWizardWindowScreen } from '@ferui/components';

@Component({
  template: `
    <h4>Modal wizard step 1</h4>
    <p>Params:</p>
    <pre><code [highlight]="params"></code></pre>
    <p>Resolves:</p>
    <pre><code [highlight]="resolves"></code></pre>
    <p>Data (shared by steps):</p>
    <pre><code [highlight]="sharedData"></code></pre>
  `
})
export class ModalWizard1Component implements FuiModalWizardWindowScreen, OnInit {
  params: string;
  resolves: string;
  sharedData: string;

  constructor(@Inject(FUI_MODAL_WINDOW_CTRL_TOKEN) public windowCtrl: FuiModalWizardWindowCtrl) {}

  ngOnInit(): void {
    this.params = jsBeautify.js(JSON.stringify(this.windowCtrl.params));
    this.resolves = jsBeautify.js(JSON.stringify(this.windowCtrl.resolves));
  }

  $onInit(args): Promise<any> {
    this.sharedData = jsBeautify.js(JSON.stringify(args));
    return Promise.resolve();
  }

  $onNext(): Promise<any> {
    return Promise.resolve({ step1: 'My super data from step 1' });
  }
}
