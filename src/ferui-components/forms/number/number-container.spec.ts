import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ContainerNoLabelSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/container.spec';

import { FuiNumberDirective } from './number';
import { FuiNumberContainerComponent } from './number-container';

@Component({
  template: `
    <fui-number-container>
      <input name="model" fuiNumber required [(ngModel)]="model" [disabled]="disabled" />
      <label>Hello World</label>
      <fui-control-error>This field is required</fui-control-error>
    </fui-number-container>
  `
})
class SimpleTest {
  disabled = false;
  model = '';
}

@Component({
  template: `
    <fui-number-container>
      <input fuiNumber name="model" [(ngModel)]="model" />
    </fui-number-container>
  `
})
class NoLabelTest {}

@Component({
  template: `
    <form [formGroup]="form">
      <fui-number-container>
        <label>Hello World</label>
        <input fuiNumber formControlName="model" />
        <fui-control-error>This field is required</fui-control-error>
      </fui-number-container>
    </form>
  `
})
class ReactiveTest {
  disabled = false;
  form = new FormGroup({
    model: new FormControl({ value: '', disabled: this.disabled }, Validators.required)
  });
}

export default function (): void {
  describe('FuiNumberContainerComponent', () => {
    ContainerNoLabelSpec(FuiNumberContainerComponent, FuiNumberDirective, NoLabelTest);
    TemplateDrivenSpec(FuiNumberContainerComponent, FuiNumberDirective, SimpleTest, '.fui-input-wrapper [fuiNumber]');
    ReactiveSpec(FuiNumberContainerComponent, FuiNumberDirective, ReactiveTest, '.fui-input-wrapper [fuiNumber]');
  });
}
