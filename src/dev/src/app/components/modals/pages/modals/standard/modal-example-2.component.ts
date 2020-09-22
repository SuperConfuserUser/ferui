import * as jsBeautify from 'js-beautify';

import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import {
  FUI_MODAL_WINDOW_CTRL_TOKEN,
  FuiDatetimeModelTypes,
  FuiModalStandardWindowCtrl,
  FuiModalStandardWindowScreen
} from '@ferui/components';

@Component({
  template: `
    <p>There are the params and resolved promises values.</p>
    <p>Params:</p>
    <pre><code [highlight]="paramsStr"></code></pre>
    <p>Resolves:</p>
    <pre><code [highlight]="resolvesStr"></code></pre>
    <p>
      In this modal we're testing the <code>$onSubmit</code> method. If the promise resolves, then everything went good and the
      window closes and you can passes in any args of your choices.<br />
      But if the promise gets rejected, the window remains open and the dev can use the internal
      <code>windowCtrl.error</code> variable to display the error he want at the top of this window.<br />
      Try to submit without filling the form then retry once you've filled it.
    </p>
    <form fuiForm novalidate>
      <fui-input-container>
        <label fuiLabel>Username</label>
        <input
          fuiInput
          name="username"
          autocomplete="username"
          (ngModelChange)="autoValidate()"
          required
          [(ngModel)]="username"
        />
      </fui-input-container>
      <fui-password-container>
        <label fuiLabel>Password</label>
        <input
          fuiPassword
          name="password"
          autocomplete="password"
          (ngModelChange)="autoValidate()"
          required
          [(ngModel)]="password"
        />
      </fui-password-container>
      <fui-password-container>
        <label fuiLabel>Confirm password</label>
        <input
          fuiPassword
          name="passwordConfirm"
          autocomplete="passwordConfirm"
          (ngModelChange)="autoValidate()"
          valuesEqual="{{ password }}"
          required
          [(ngModel)]="confirmPassword"
        />
        <fui-control-error *fuiIfError="'valuesEqual'"> The two passwords doesn't match. </fui-control-error>
      </fui-password-container>
      <fui-date-container>
        <label fuiLabel>Birth Date</label>
        <input
          name="birthDate"
          type="date"
          (ngModelChange)="autoValidate()"
          [fuiDate]="modelTypeDate"
          [(ngModel)]="dateOfBirth"
        />
      </fui-date-container>
    </form>
  `
})
export class ModalExample2Component implements OnInit, FuiModalStandardWindowScreen<string> {
  @Input() modalConfiguration;
  @ViewChild(NgForm) form: NgForm;

  paramsStr: string;
  resolvesStr: string;

  username: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: Date;
  modelTypeDate: FuiDatetimeModelTypes = FuiDatetimeModelTypes.DATE;

  constructor(@Inject(FUI_MODAL_WINDOW_CTRL_TOKEN) public windowCtrl: FuiModalStandardWindowCtrl<string>) {}

  ngOnInit(): void {
    this.paramsStr = jsBeautify.js(JSON.stringify(this.windowCtrl.params || {}));
    this.resolvesStr = jsBeautify.js(JSON.stringify(this.windowCtrl.resolves || {}));
  }

  autoValidate() {
    if (this.form.valid) {
      this.windowCtrl.error = null;
    }
  }

  /**
   * Window submit lifecycle
   * @param event
   */
  $onSubmit(event: MouseEvent): Promise<string> {
    if (!this.form.valid) {
      // Keep this comment to test rejection through error Throwing instead of Promise normal rejection.
      // throw new Error('Please fill all required inputs!');
      return Promise.reject('Please fill all required inputs!');
    }

    return Promise.resolve('ModalExample2Component-arg');
  }
}
