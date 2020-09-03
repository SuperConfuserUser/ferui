import * as jsBeautify from 'js-beautify';

import { Component, Inject, OnInit } from '@angular/core';

import { FUI_MODAL_WINDOW_CTRL_TOKEN, FuiModalWizardWindowCtrl, FuiModalWizardWindowScreen } from '@ferui/components';

interface StepsInterface {
  step1: string;
  step2?: string;
}

@Component({
  template: `
    <h4>Modal wizard step 2</h4>
    <p>Params:</p>
    <pre><code [highlight]="params"></code></pre>
    <p>Resolves:</p>
    <pre><code [highlight]="resolves"></code></pre>
    <p>Data (shared by steps):</p>
    <pre><code [highlight]="sharedData"></code></pre>
    <button class="btn btn-sm btn-secondary mr-2" (click)="openChildModal()">Open grand child modal</button>
  `
})
export class ModalWizard2Component implements OnInit, FuiModalWizardWindowScreen {
  params: string;
  resolves: string;
  sharedData: string;

  constructor(
    @Inject(FUI_MODAL_WINDOW_CTRL_TOKEN)
    public windowCtrl: FuiModalWizardWindowCtrl<void, any, any, any, StepsInterface, StepsInterface>
  ) {}

  openChildModal() {
    this.windowCtrl
      .openChildWindow<void>('simpleGrandChildWindow1')
      .then(() => {
        console.log('[windowCtrl.openChildWindow] simpleGrandChildWindow1 ::: submitted or closed ::: (no data returned)');
      })
      .catch(e => {
        console.log('[windowCtrl.openChildWindow] simpleGrandChildWindow1 ::: error ::: ', e);
      });
  }

  ngOnInit(): void {
    this.params = jsBeautify.js(JSON.stringify(this.windowCtrl.params));
    this.resolves = jsBeautify.js(JSON.stringify(this.windowCtrl.resolves));
  }

  $onInit(args: any): Promise<void> {
    this.sharedData = jsBeautify.js(JSON.stringify(args));
    return Promise.resolve();
  }

  $onBack(): Promise<StepsInterface> {
    return Promise.resolve({ step1: 'My super data from step 1' });
  }

  $onNext(): Promise<StepsInterface> {
    return Promise.resolve({ step1: 'My super data from step 1', step2: 'My super data from step 2' });
  }
}
