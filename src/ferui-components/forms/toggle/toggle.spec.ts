import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ControlStandaloneSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';

import { FuiToggleDirective } from './toggle';
import { FuiToggleWrapperComponent } from './toggle-wrapper';

@Component({
  template: ` <input type="checkbox" fuiToggle />`
})
class StandaloneUseTest {}

@Component({
  template: ` <input type="checkbox" fuiToggle name="model" class="test-class" [(ngModel)]="model" /> `
})
class TemplateDrivenTest {}

@Component({
  template: `
    <form [formGroup]="form">
      <input type="checkbox" fuiToggle name="model" class="test-class" formControlName="model" />
    </form>
  `
})
class ReactiveTest {
  form = new FormGroup({
    model: new FormControl('', Validators.required)
  });
}

export default function (): void {
  describe('FuiToggleDirective directive', () => {
    ControlStandaloneSpec(StandaloneUseTest);
    TemplateDrivenSpec(FuiToggleWrapperComponent, FuiToggleDirective, TemplateDrivenTest, 'fui-toggle');
    ReactiveSpec(FuiToggleWrapperComponent, FuiToggleDirective, ReactiveTest, 'fui-toggle');
  });
}
