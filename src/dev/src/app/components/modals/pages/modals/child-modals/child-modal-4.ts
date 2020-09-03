import * as jsBeautify from 'js-beautify';

import { Component, Inject, OnInit } from '@angular/core';

import {
  FUI_MODAL_CTRL_TOKEN,
  FUI_MODAL_WINDOW_CTRL_TOKEN,
  FuiModalCtrl,
  FuiModalStandardWindowCtrl,
  FuiModalStandardWindowScreen
} from '@ferui/components';

@Component({
  template: `
    <h4>Child Modal example 4</h4>
    <p>Params:</p>
    <pre><code [highlight]="params"></code></pre>
    <p>Resolves:</p>
    <pre><code [highlight]="resolves"></code></pre>
  `
})
export class ChildModal4Component implements FuiModalStandardWindowScreen, OnInit {
  params: string;
  resolves: string;

  constructor(
    @Inject(FUI_MODAL_WINDOW_CTRL_TOKEN) public windowCtrl: FuiModalStandardWindowCtrl,
    @Inject(FUI_MODAL_CTRL_TOKEN) public modalCtrl: FuiModalCtrl
  ) {}

  ngOnInit(): void {
    this.params = jsBeautify.js(JSON.stringify(this.windowCtrl.params));
    this.resolves = jsBeautify.js(JSON.stringify(this.windowCtrl.resolves));
  }

  $onSubmit(event: MouseEvent): Promise<void> {
    return Promise.resolve();
  }
}
