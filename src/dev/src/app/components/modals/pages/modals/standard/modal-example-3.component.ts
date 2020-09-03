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
    <h4>Modal example 3</h4>
    <p>Params:</p>
    <pre><code [highlight]="params"></code></pre>
    <p>Resolves:</p>
    <pre><code [highlight]="resolves"></code></pre>
  `
})
export class ModalExample3Component implements OnInit, FuiModalStandardWindowScreen {
  params: string;
  resolves: string;

  constructor(
    @Inject(FUI_MODAL_CTRL_TOKEN) public modalCtrl: FuiModalCtrl,
    @Inject(FUI_MODAL_WINDOW_CTRL_TOKEN) public windowCtrl: FuiModalStandardWindowCtrl
  ) {}

  $onInit(): Promise<void> {
    // Lets be wild and update the window title dynamically.
    this.windowCtrl.title = 'My super wild title!';
    return Promise.resolve();
  }

  ngOnInit(): void {
    // You can use either modalCtrl and windowCtrl now.
    this.params = JSON.stringify(this.modalCtrl.params);
    this.resolves = JSON.stringify(this.modalCtrl.resolves);
  }
}
