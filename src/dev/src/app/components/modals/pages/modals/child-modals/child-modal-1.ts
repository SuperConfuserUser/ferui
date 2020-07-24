import { Component, Inject, OnInit } from '@angular/core';
import { FuiModalStandardWindowCtrl, FuiModalStandardWindowScreen, FUI_MODAL_WINDOW_CTRL_TOKEN } from '@ferui/components';
import * as jsBeautify from 'js-beautify';

@Component({
  template: `
    <h4>Child Modal example 1</h4>
    <p>
      On this window you can see that we've passed in some params and resolved some promises. <br />
      Also if you submit this window, you'll see the 'submit' animation that occurs when you're returning a promise that take some
      time to resolve (API call for instance).
    </p>
    <p>Params:</p>
    <pre><code [highlight]="params"></code></pre>
    <p>Resolves:</p>
    <pre><code [highlight]="resolves"></code></pre>
  `
})
export class ChildModal1Component implements FuiModalStandardWindowScreen, OnInit {
  params: string;
  resolves: string;

  private testVariable: string = 'Test variable string';

  constructor(@Inject(FUI_MODAL_WINDOW_CTRL_TOKEN) public windowCtrl: FuiModalStandardWindowCtrl) {}

  ngOnInit(): void {
    this.params = jsBeautify.js(JSON.stringify(this.windowCtrl.params));
    this.resolves = jsBeautify.js(JSON.stringify(this.windowCtrl.resolves));
  }

  $onInit(): Promise<any> {
    return Promise.resolve(this.testVariable);
  }

  $onSubmit(event: MouseEvent): Promise<string> {
    return new Promise<string>(resolve => {
      setTimeout(() => {
        resolve(this.testVariable);
      }, 2000);
    });
  }
}
