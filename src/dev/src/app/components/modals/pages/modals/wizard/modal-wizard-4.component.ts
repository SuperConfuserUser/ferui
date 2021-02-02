import * as jsBeautify from 'js-beautify';

import { Component, Inject, OnInit } from '@angular/core';

import { FUI_MODAL_WINDOW_CTRL_TOKEN, FuiModalWizardWindowCtrl, FuiModalWizardWindowScreen } from '@ferui/components';

interface StepsInterface {
  step1: string;
  step2?: string;
}

@Component({
  template: `
    <h4>Modal wizard step 4</h4>
    <p>Params:</p>
    <pre><code [highlight]="params"></code></pre>
    <p>Resolves:</p>
    <pre><code [highlight]="resolves"></code></pre>
    <p>Data (shared by steps):</p>
    <pre><code [highlight]="sharedData"></code></pre>
  `
})
export class ModalWizard4Component implements OnInit, FuiModalWizardWindowScreen {
  params: string;
  resolves: string;
  sharedData: string;

  constructor(
    @Inject(FUI_MODAL_WINDOW_CTRL_TOKEN)
    public windowCtrl: FuiModalWizardWindowCtrl<void, any, any, any, StepsInterface, StepsInterface>
  ) {}

  ngOnInit(): void {
    this.params = jsBeautify.js(JSON.stringify(this.windowCtrl.params));
    this.resolves = jsBeautify.js(JSON.stringify(this.windowCtrl.resolves));
  }

  $onInit(args: any): Promise<void> {
    this.sharedData = jsBeautify.js(JSON.stringify(args));
    return Promise.resolve();
  }

  $onBack(): Promise<StepsInterface> {
    return Promise.resolve({
      step1: 'My super data from step 1',
      step2: 'My super data from step 2',
      step3: 'My super data from step 3'
    });
  }

  $onNext(): Promise<StepsInterface> {
    return Promise.resolve({
      step1: 'My super data from step 1',
      step2: 'My super data from step 2',
      step3: 'My super data from step 3',
      step4: 'My super data from step 4'
    });
  }
}
