import { Component, OnInit } from '@angular/core';

import { DemoComponentData } from '../../../utils/demo-component-data';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';

@Component({
  templateUrl: './toggle.component.html'
})
export class ToggleComponent extends AbstractControlDemoComponent implements OnInit {
  model = {
    one: false,
    twoA: true,
    twoB: false,
    threeA: '',
    threeB: null,
    threeC: false,
    fourA: true,
    fourB: false
  };

  inputOne: DemoComponentData;
  inputTwo: DemoComponentData;
  inputThree: DemoComponentData;
  inputFour: DemoComponentData;

  inputOneSource = `<input type="checkbox" fuiToggle name="one" [(ngModel)]="models.one" />`;

  inputTwoSource = `<fui-toggle-wrapper>
  <input type="checkbox" fuiToggle name="twoA" [(ngModel)]="models.twoA" />
  <label fuiLabel>Toggle me</label>
</fui-toggle-wrapper>
<fui-toggle-wrapper>
  <label fuiLabel>Toggle me too</label>
  <input type="checkbox" fuiToggle name="twoB" [(ngModel)]="models.twoB" />
</fui-toggle-wrapper>`;

  inputThreeSource = `<fui-toggle-container>
  <fui-toggle-wrapper>
    <input type="checkbox" fuiToggle name="threeA" [(ngModel)]="models.threeA" required>
    <label fuiLabel>You must toggle me!</label>
  </fui-toggle-wrapper>
</fui-toggle-container>
<fui-toggle-container>
  <fui-toggle-wrapper>
    <input type="checkbox" fuiToggle name="threeB" [(ngModel)]="models.threeB" required>
    <label fuiLabel>You must toggle me too!</label>
  </fui-toggle-wrapper>
  <fui-control-error>Toggle me you must!</fui-control-error>
</fui-toggle-container>
<fui-toggle-container>
  <fui-toggle-wrapper>
    <input type="checkbox" fuiToggle name="threeC" [(ngModel)]="models.threeC" required>
    <label fuiLabel>Toggle for pineapple on pizza</label>
  </fui-toggle-wrapper>
  <fui-control-error *fuiIfError="'required'">Pineapple belongs on pizza</fui-control-error>
</fui-toggle-container>`;

  inputFourSource = `<fui-toggle-wrapper>
  <input type="checkbox" [disabled]="params.disabled" fuiToggle name="fourA" [(ngModel)]="models.fourA">
  <label fuiLabel>Add avocado</label>
</fui-toggle-wrapper>
<fui-toggle-container>
  <fui-toggle-wrapper>
    <input type="checkbox" [disabled]="params.disabled" fuiToggle name="fourB" [(ngModel)]="models.fourB">
    <label fuiLabel>Add bacon</label>
  </fui-toggle-wrapper>
</fui-toggle-container>`;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.inputOne = new DemoComponentData({
      title: `<h5>No label, no wrapper:</h5>`,
      models: { one: this.model.one },
      canDisable: false,
      source: this.inputOneSource
    });
    this.inputTwo = new DemoComponentData({
      title: `<h5>Toggle with label:</h5>`,
      models: {
        twoA: this.model.twoA,
        twoB: this.model.twoB
      },
      canDisable: false,
      source: this.inputTwoSource
    });
    this.inputThree = new DemoComponentData({
      title: `<h5>Label, wrapper, and <span class="text-danger">required</span> validator:</h5>`,
      models: {
        threeA: this.model.threeA,
        threeB: this.model.threeB,
        threeC: this.model.threeC
      },
      canDisable: false,
      source: this.inputThreeSource
    });
    this.inputFour = new DemoComponentData({
      title: `<h5>Disabled toggles:</h5>`,
      models: {
        fourA: this.model.fourA,
        fourB: this.model.fourB
      },
      params: { disabled: this.disabled },
      canDisable: true,
      source: this.inputFourSource
    });
  }
}
