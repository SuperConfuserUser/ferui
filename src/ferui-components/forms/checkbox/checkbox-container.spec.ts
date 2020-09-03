import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ContainerNoLabelSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/container.spec';

import { FuiCheckboxDirective } from './checkbox';
import { FuiCheckboxContainerComponent } from './checkbox-container';
import { FuiCheckboxWrapperComponent } from './checkbox-wrapper';

@Component({
  template: ` <fui-checkbox-container></fui-checkbox-container> `
})
class NoLabelTest {}

@Component({
  template: `
    <fui-checkbox-container>
      <label>Hello World</label>
      <fui-checkbox-wrapper>
        <label>One</label>
        <input type="checkbox" fuiCheckbox name="model" required [(ngModel)]="model" value="one" />
      </fui-checkbox-wrapper>
      <fui-checkbox-wrapper>
        <label>Two</label>
        <input type="checkbox" fuiCheckbox name="model" required [(ngModel)]="model" value="two" [disabled]="disabled" />
      </fui-checkbox-wrapper>
      <fui-control-error>There was an error</fui-control-error>
    </fui-checkbox-container>
  `
})
class TemplateDrivenTest {
  inline = false;
  disabled = false;
  model = '';
}

@Component({
  template: `
    <form [formGroup]="form">
      <fui-checkbox-container>
        <label>Hello World</label>
        <fui-checkbox-wrapper>
          <label>One</label>
          <input fuiCheckbox type="checkbox" formControlName="model" value="one" />
        </fui-checkbox-wrapper>
        <fui-checkbox-wrapper>
          <label>Two</label>
          <input fuiCheckbox type="checkbox" formControlName="model" value="two" />
        </fui-checkbox-wrapper>
        <fui-control-error>There was an error</fui-control-error>
      </fui-checkbox-container>
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
  describe('FuiCheckboxContainerComponent', () => {
    ContainerNoLabelSpec(FuiCheckboxContainerComponent, [FuiCheckboxWrapperComponent, FuiCheckboxDirective], NoLabelTest);
    TemplateDrivenSpec(
      FuiCheckboxContainerComponent,
      [FuiCheckboxWrapperComponent, FuiCheckboxDirective],
      TemplateDrivenTest,
      '.fui-checkbox-wrapper [fuiCheckbox]'
    );
    ReactiveSpec(
      FuiCheckboxContainerComponent,
      [FuiCheckboxWrapperComponent, FuiCheckboxDirective],
      ReactiveTest,
      '.fui-checkbox-wrapper [fuiCheckbox]'
    );
  });
}
