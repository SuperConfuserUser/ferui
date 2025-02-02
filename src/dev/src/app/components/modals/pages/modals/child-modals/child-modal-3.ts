import * as jsBeautify from 'js-beautify';

import { Component, Inject, OnInit } from '@angular/core';

import { FUI_MODAL_WINDOW_CTRL_TOKEN, FuiModalStandardWindowCtrl, FuiModalStandardWindowScreen } from '@ferui/components';

@Component({
  template: `
    <h4>Child Modal example 3</h4>
    <p>Params:</p>
    <pre><code [highlight]="params"></code></pre>
    <p>Resolves:</p>
    <pre><code [highlight]="resolves"></code></pre>
  `
})
export class ChildModal3Component implements FuiModalStandardWindowScreen, OnInit {
  params: string;
  resolves: string;

  constructor(@Inject(FUI_MODAL_WINDOW_CTRL_TOKEN) public windowCtrl: FuiModalStandardWindowCtrl) {}

  ngOnInit(): void {
    this.params = jsBeautify.js(JSON.stringify(this.windowCtrl.params));
    this.resolves = jsBeautify.js(JSON.stringify(this.windowCtrl.resolves));
  }

  $onSubmit(event: MouseEvent): Promise<void> {
    return Promise.resolve();
  }
}
