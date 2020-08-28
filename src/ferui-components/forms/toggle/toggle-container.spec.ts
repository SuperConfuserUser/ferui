import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContainerNoLabelSpec } from '../tests/container.spec';
import { FuiToggleContainer } from './toggle-container';
import { FuiToggleWrapper } from './toggle-wrapper';
import { FuiToggle } from './toggle';
import { ReactiveSpec, TemplateDrivenSpec } from '../tests/container.spec';

@Component({
  template: ` <fui-toggle-container></fui-toggle-container> `
})
class NoLabelTest {}

@Component({
  template: `
    <fui-toggle-container>
      <label>Hello World</label>
      <fui-toggle-wrapper>
        <label>One</label>
        <input type="checkbox" fuiToggle name="model" required [(ngModel)]="model" value="one /" />
      </fui-toggle-wrapper>
      <fui-toggle-wrapper>
        <label>Two</label>
        <input type="checkbox" fuiToggle name="model" required [(ngModel)]="model" value="two" [disabled]="disabled" />
      </fui-toggle-wrapper>
      <fui-control-error>There was an error</fui-control-error>
    </fui-toggle-container>
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
      <fui-toggle-container>
        <label>Hello World</label>
        <fui-toggle-wrapper>
          <label>One</label>
          <input type="checkbox" fuiToggle formControlName="model" value="one" />
        </fui-toggle-wrapper>
        <fui-toggle-wrapper>
          <label>Two</label>
          <input type="checkbox" fuiToggle formControlName="model" value="two" />
        </fui-toggle-wrapper>
        <fui-control-error>There was an error</fui-control-error>
      </fui-toggle-container>
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
  describe('FuiToggleContainer', () => {
    ContainerNoLabelSpec(FuiToggleContainer, [FuiToggleWrapper, FuiToggle], NoLabelTest);
    TemplateDrivenSpec(FuiToggleContainer, [FuiToggleWrapper, FuiToggle], TemplateDrivenTest, '.fui-toggle-wrapper [fuiToggle]');
    ReactiveSpec(FuiToggleContainer, [FuiToggleWrapper, FuiToggle], ReactiveTest, '.fui-toggle-wrapper [fuiToggle]');
  });
}
