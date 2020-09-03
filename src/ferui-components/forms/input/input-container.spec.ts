import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ContainerNoLabelSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/container.spec';

import { FuiInputDirective } from './input';
import { FuiInputContainerComponent } from './input-container';

@Component({
  template: `
    <fui-input-container>
      <input name="model" fuiInput required [(ngModel)]="model" [disabled]="disabled" />
      <label>Hello World</label>
      <fui-control-error>This field is required</fui-control-error>
    </fui-input-container>
  `
})
class SimpleTest {
  disabled = false;
  model = '';
}

@Component({
  template: `
    <fui-input-container>
      <input fuiInput name="model" [(ngModel)]="model" />
    </fui-input-container>
  `
})
class NoLabelTest {}

@Component({
  template: `
    <form [formGroup]="form">
      <fui-input-container>
        <label>Hello World</label>
        <input fuiInput formControlName="model" />
        <fui-control-error>This field is required</fui-control-error>
      </fui-input-container>
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
  describe('FuiInputContainerComponent', () => {
    ContainerNoLabelSpec(FuiInputContainerComponent, FuiInputDirective, NoLabelTest);
    TemplateDrivenSpec(FuiInputContainerComponent, FuiInputDirective, SimpleTest, '.fui-input-wrapper [fuiInput]');
    ReactiveSpec(FuiInputContainerComponent, FuiInputDirective, ReactiveTest, '.fui-input-wrapper [fuiInput]');
  });
}
