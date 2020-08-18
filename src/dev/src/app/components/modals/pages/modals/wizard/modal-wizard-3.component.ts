import { Component, Inject } from '@angular/core';
import { FuiModalWizardWindowCtrl, FuiModalWizardWindowScreen, FUI_MODAL_WINDOW_CTRL_TOKEN } from '@ferui/components';
import * as jsBeautify from 'js-beautify';

@Component({
  template: `
    <h4>Modal wizard step 3</h4>
    <p>Params:</p>
    <pre><code [highlight]="params"></code></pre>
    <p>Resolves:</p>
    <pre><code [highlight]="resolves"></code></pre>
    <p>Data (shared by steps):</p>
    <pre><code [highlight]="sharedData"></code></pre>
  `
})
export class ModalWizard3Component implements FuiModalWizardWindowScreen {
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

  $onBack(event: MouseEvent): Promise<any> {
    return Promise.resolve({ step1: 'My super data from step 1', step2: 'My super data from step 2' });
  }

  $onSubmit(event: MouseEvent): Promise<any> {
    return Promise.resolve({
      step1: 'My super data from step 1',
      step2: 'My super data from step 2',
      step3: 'My super data from step 3'
    });
  }
}
