import { Component, OnInit } from '@angular/core';

import { DemoComponentData } from '../../../utils/demo-component-data';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';

@Component({
  template: `
    <fui-tabs>
      <fui-tab [label]="'Examples'">
        <form fuiForm #demoForm="ngForm">
          <demo-page [filtersDisplayed]="true" pageTitle="Password component">
            <demo-component [form]="demoForm" [componentData]="inputOne"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputTwo"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputThree"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputFour"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputFive"></demo-component>
            <div class="footer">
              <button class="btn btn-primary" [disabled]="!demoForm.form.valid" (click)="promptSubmitInfos()" type="submit">
                Submit
              </button>
              <button class="btn btn-success" type="button" (click)="validate()">Validate</button>
              <button class="btn btn-light" type="button" (click)="demoForm.reset()">Reset</button>
            </div>
          </demo-page>
        </form>
      </fui-tab>
      <fui-tab [label]="'Documentation'">
        <div class="container-fluid">
          <div class="row" style="max-width: 1200px">
            <div class="col col-12">
              <p>In construction...</p>
            </div>
          </div>
        </div>
      </fui-tab>
    </fui-tabs>
  `
})
export class PasswordComponent extends AbstractControlDemoComponent implements OnInit {
  model = {
    one: '',
    two: '',
    three: '',
    four: 'Disabled with value',
    five: ''
  };

  inputOne: DemoComponentData;
  inputTwo: DemoComponentData;
  inputThree: DemoComponentData;
  inputFour: DemoComponentData;
  inputFive: DemoComponentData;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.inputOne = new DemoComponentData({
      title: `<h5>No label, wrapper :</h5>`,
      models: { one: this.model.one },
      canDisable: false,
      source: `<fui-password-container>
  <input fuiPassword name="one" [(ngModel)]="models.one" />
</fui-password-container>`
    });

    this.inputTwo = new DemoComponentData({
      title: `<h5>Label, wrapper and <span class="text-danger">required</span> validator :</h5>`,
      models: { two: this.model.two },
      canDisable: false,
      source: `<fui-password-container>
  <label fuiLabel>Full example</label>
  <input placeholder="With placeholder" fuiPassword name="two" [(ngModel)]="models.two" required />
  <fui-control-error>This field is required (this message overwrite any other ones)</fui-control-error>
  <clr-icon fuiHelper shape="fui-help" [fuiTooltip]="'A detailed description of the element at hand'"></clr-icon>
</fui-password-container>`
    });

    this.inputThree = new DemoComponentData({
      title: `<h5> Label, wrapper, <span class="text-danger">required</span> validator but <span class="text-danger">disabled</span> :</h5>`,
      models: { three: this.model.three },
      params: { disabled: this.disabled },
      canDisable: true,
      source: `<fui-password-container>
  <label fuiLabel>Full example (disabled)</label>
  <input fuiPassword name="three" [(ngModel)]="models.three" required [disabled]="params.disabled" />
  <fui-control-error *fuiIfError="'required'">
    This field is required (this message overwrite any other ones)
  </fui-control-error>
</fui-password-container>`
    });

    this.inputFour = new DemoComponentData({
      title: `<h5>Label, wrapper, <span class="text-danger">required</span> validator, disabled and filled :</h5>`,
      models: { four: this.model.four },
      params: { disabled: this.disabled },
      canDisable: true,
      source: `<fui-password-container>
  <label fuiLabel>Full example (disabled, filled)</label>
  <input fuiPassword name="four" [(ngModel)]="models.four" required [disabled]="params.disabled"/>
  <!-- All the validator messages are default ones -->
</fui-password-container>`
    });

    this.inputFive = new DemoComponentData({
      title: `<h5>Label, wrapper, <span class="text-danger">required</span> validator, in small layout :</h5>`,
      models: { five: this.model.five },
      canDisable: false,
      source: `<fui-password-container>
  <label fuiLabel>Small layout</label>
  <input fuiPassword name="five" [(ngModel)]="models.five" required [layout]="'small'"/>
  <clr-icon fuiHelper shape="fui-help" [fuiTooltip]="'A detailed description of the element at hand'"></clr-icon>
</fui-password-container>`
    });
  }
}
