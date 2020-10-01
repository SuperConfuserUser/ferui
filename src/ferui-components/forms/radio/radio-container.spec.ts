import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ReactiveSpec, TemplateDrivenSpec } from '../tests/container.spec';

import { FuiRadioDirective } from './radio';
import { FuiRadioContainerComponent } from './radio-container';
import { FuiRadioWrapperComponent } from './radio-wrapper';

@Component({
  template: `
    <fui-radio-container>
      <label fuiLabel>Hello World</label>
      <fui-radio-wrapper>
        <label fuiLabel>One</label>
        <input type="radio" fuiRadio name="model" required [(ngModel)]="model" value="one" />
      </fui-radio-wrapper>
      <fui-radio-wrapper>
        <label fuiLabel>Two</label>
        <input type="radio" fuiRadio name="model" required [(ngModel)]="model" value="two" [disabled]="disabled" />
      </fui-radio-wrapper>
      <fui-control-error>There was an error</fui-control-error>
    </fui-radio-container>
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
      <fui-radio-container>
        <label fuiLabel>Hello World</label>
        <fui-radio-wrapper>
          <label fuiLabel>One</label>
          <input fuiRadio type="radio" formControlName="model" value="one" />
        </fui-radio-wrapper>
        <fui-radio-wrapper>
          <label fuiLabel>Two</label>
          <input fuiRadio type="radio" formControlName="model" value="two" />
        </fui-radio-wrapper>
        <fui-control-error>There was an error</fui-control-error>
      </fui-radio-container>
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
  describe('FuiRadioContainerComponent', () => {
    TemplateDrivenSpec(
      FuiRadioContainerComponent,
      [FuiRadioDirective, FuiRadioWrapperComponent],
      TemplateDrivenTest,
      '.fui-radio-wrapper [fuiRadio]'
    );
    ReactiveSpec(
      FuiRadioContainerComponent,
      [FuiRadioDirective, FuiRadioWrapperComponent],
      ReactiveTest,
      '.fui-radio-wrapper [fuiRadio]'
    );
  });
}
