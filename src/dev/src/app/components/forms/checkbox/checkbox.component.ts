import { Component, OnInit } from '@angular/core';

import { DemoComponentData } from '../../../utils/demo-component-data';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';

@Component({
  template: `
    <form fuiForm class="container-fluid" #demoForm="ngForm">
      <fui-tabs>
        <fui-tab [title]="'Examples'" [active]="true">
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
        </fui-tab>
        <fui-tab [title]="'Documentation'">
          <div class="row">
            <p>In construction...</p>
          </div>
        </fui-tab>
      </fui-tabs>
    </form>
  `
})
export class CheckboxComponent extends AbstractControlDemoComponent implements OnInit {
  model = {
    one: '',
    two: true,
    twobis: '',
    three: false,
    threebis: null,
    four: '',
    fourbis: true,
    fiveIndeterminate: null,
    five: false,
    fivebis: false
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
      models: { one: this.model.one },
      canDisable: false,
      source: `<input #code type="checkbox" fuiCheckbox name="one" [(ngModel)]="models.one"/>`
    });

    this.inputTwo = new DemoComponentData({
      title: `<h5>Checkbox with label :</h5>`,
      models: {
        two: this.model.two,
        twobis: this.model.twobis
      },
      canDisable: false,
      source: `
        <fui-checkbox-wrapper class="code">
          <input type="checkbox" fuiCheckbox name="two" [(ngModel)]="models.two" />
          <label fuiLabel>Option 1</label>
        </fui-checkbox-wrapper>
        <fui-checkbox-wrapper class="code">
          <input type="checkbox" fuiCheckbox name="twobis" [(ngModel)]="models.twobis" />
          <label fuiLabel>Option 2</label>
        </fui-checkbox-wrapper>`
    });

    this.inputThree = new DemoComponentData({
      title: `<h5>Label, wrapper and <span class="text-danger">required</span> validator :</h5>`,
      models: {
        three: this.model.three,
        threebis: this.model.threebis
      },
      canDisable: false,
      source: `
        <fui-checkbox-wrapper class="code">
          <input type="checkbox" fuiCheckbox name="three" [(ngModel)]="models.three"/>
          <label fuiLabel>Option 1</label>
        </fui-checkbox-wrapper>
        <fui-checkbox-container class="code">
          <fui-checkbox-wrapper>
            <input type="checkbox" fuiCheckbox name="threebis" required [(ngModel)]="models.threebis"/>
            <label fuiLabel>Option 2</label>
          </fui-checkbox-wrapper>
          <fui-control-error>This field is required!</fui-control-error>
        </fui-checkbox-container>`
    });

    this.inputFour = new DemoComponentData({
      title: `<h5>Checkboxes disabled</h5>`,
      models: {
        four: this.model.four,
        fourbis: this.model.fourbis
      },
      params: { disabled: this.disabled },
      canDisable: true,
      source: `
        <fui-checkbox-wrapper>
          <input type="checkbox" [disabled]="params.disabled" fuiCheckbox name="four" [(ngModel)]="models.four"/>
          <label fuiLabel>Option 1</label>
        </fui-checkbox-wrapper>
        <fui-checkbox-container>
          <fui-checkbox-wrapper>
            <input type="checkbox" [disabled]="params.disabled" fuiCheckbox name="fourbis" [(ngModel)]="models.fourbis"/>
            <label fuiLabel>Option 2</label>
          </fui-checkbox-wrapper>
        </fui-checkbox-container>`
    });

    this.inputFive = new DemoComponentData({
      title: `
        <h5>Indeterminate Checkboxes</h5>
        <h6>- use the indeterminate input on your fuiCheckbox to be controlled by developer</h6>`,
      models: {
        shouldBeIndeterminate: () => {
          const models = this.inputFive.models as IndeterminateCheckboxesModel;
          models.fiveIndeterminate = [models.five, models.fivebis].some(it => it === true);
          models.indeterminate = [models.five, models.fivebis].some(it => it === false);
        },
        toggleAll: () => {
          const models = this.inputFive.models as IndeterminateCheckboxesModel;
          models.five = models.fivebis = models.fiveIndeterminate;
          models.indeterminate = [models.five, models.fivebis].some(it => it === false);
        },
        indeterminate: '',
        fiveIndeterminate: this.model.fiveIndeterminate,
        five: this.model.five,
        fivebis: this.model.fivebis
      },
      source: `
        <fui-checkbox-wrapper>
          <input type="checkbox" fuiCheckbox name="fiveIndeterminate" [(ngModel)]="models.fiveIndeterminate" [indeterminate]="models.indeterminate" (change)="models.toggleAll()"/>
          <label fuiLabel>Indeterminate (can be partially checked)</label>
        </fui-checkbox-wrapper>
        <fui-checkbox-wrapper [ngStyle]="{ 'margin-left': '30px' }">
          <input type="checkbox" fuiCheckbox name="five" [(ngModel)]="models.five" (change)="models.shouldBeIndeterminate()"/>
          <label fuiLabel>Option 1</label>
        </fui-checkbox-wrapper>
        <fui-checkbox-container>
          <fui-checkbox-wrapper [ngStyle]="{ 'margin-left': '30px' }">
            <input type="checkbox" fuiCheckbox name="fivebis" [(ngModel)]="models.fivebis" (change)="models.shouldBeIndeterminate()"/>
            <label fuiLabel>Option 2</label>
          </fui-checkbox-wrapper>
        </fui-checkbox-container>`
    });
  }
}

interface IndeterminateCheckboxesModel {
  shouldBeIndeterminate: () => void;
  toggleAll: () => void;
  indeterminate: boolean | null;
  fiveIndeterminate: boolean;
  five: boolean;
  fivebis: boolean;
}
