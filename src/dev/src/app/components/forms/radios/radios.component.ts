import { Component, OnInit } from '@angular/core';

import { DemoComponentData } from '../../../utils/demo-component-data';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';

@Component({
  template: `
    <fui-tabs>
      <fui-tab [label]="'Examples'">
        <form fuiForm #demoForm="ngForm">
          <demo-page [filtersDisplayed]="true" pageTitle="Input component">
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
export class RadiosComponent extends AbstractControlDemoComponent implements OnInit {
  model = {
    one: '',
    two: true,
    three: '',
    four: 'yes',
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
      title: `<h5>No label, no wrapper :</h5>`,
      models: {
        one: this.model.one
      },
      canDisable: false,
      source: `<input #code type="radio" value="yes" fuiRadio name="one" [(ngModel)]="models.one" />`
    });

    this.inputTwo = new DemoComponentData({
      title: `<h5>Radio with label :</h5>`,
      models: {
        two: this.model.two
      },
      canDisable: false,
      source: `<fui-radio-wrapper>
  <input type="radio" fuiRadio name="two" value="yes" [(ngModel)]="models.two" />
  <label fuiLabel>Option 1 (yes)</label>
</fui-radio-wrapper>
<fui-radio-wrapper>
  <input type="radio" fuiRadio name="two" value="no" [(ngModel)]="models.two" />
  <label fuiLabel>Option 2 (no)</label>
  <clr-icon fuiHelper shape="fui-help" [fuiTooltip]="'A detailed description of the element at hand'"></clr-icon>
</fui-radio-wrapper>`
    });

    this.inputThree = new DemoComponentData({
      title: `<h5>Label, wrapper and <span class="text-danger">required</span> validator :</h5>`,
      models: {
        three: this.model.three
      },
      canDisable: false,
      source: `<fui-radio-container>
  <fui-radio-wrapper>
    <input type="radio" fuiRadio name="option" required value="option1" [(ngModel)]="models.three" />
    <label fuiLabel>Option 1</label>
  </fui-radio-wrapper>
  <fui-radio-wrapper>
    <input type="radio" fuiRadio name="option" required value="option2" [(ngModel)]="models.three" />
    <label fuiLabel>Option 2</label>
  </fui-radio-wrapper>
  <fui-control-error>This field is required!</fui-control-error>
</fui-radio-container>`
    });

    this.inputFour = new DemoComponentData({
      title: `<h5>Radio with label (disabled) :</h5>`,
      models: {
        four: this.model.four
      },
      params: { disabled: this.disabled },
      canDisable: true,
      source: `<fui-radio-wrapper>
  <input type="radio" [disabled]="params.disabled" fuiRadio name="four" value="yes" [(ngModel)]="models.four" />
  <label fuiLabel>Option 1</label>
</fui-radio-wrapper>
<fui-radio-wrapper>
  <input type="radio" [disabled]="params.disabled" fuiRadio name="four" value="no" [(ngModel)]="models.four" />
  <label fuiLabel>Option 2</label>
</fui-radio-wrapper>`
    });

    this.inputFive = new DemoComponentData({
      title: `<h5>Radio with a long label and the fui helper icon:</h5>`,
      models: {
        five: this.model.five
      },
      source: `<fui-radio-wrapper>
  <input type="radio" fuiRadio name="five" value="yes" [(ngModel)]="models.five" />
  <label fuiLabel>You can choose a small label</label>
</fui-radio-wrapper>
<fui-radio-wrapper [ngStyle]="{ 'width': '291px' }">
  <input type="radio" fuiRadio name="five" value="no" [(ngModel)]="models.five" />
  <label fuiLabel>You can choose a very long descriptive label with a helper icon</label>
  <clr-icon fuiHelper shape="fui-help" [fuiTooltip]="'A detailed description of the element at hand'"></clr-icon>
</fui-radio-wrapper>`
    });
  }
}
