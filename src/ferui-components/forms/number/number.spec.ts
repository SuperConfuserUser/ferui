import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ControlStandaloneSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';

import { FuiNumberDirective } from './number';
import { FuiNumberContainerComponent } from './number-container';

@Component({
  template: ` <input type="number" fuiNumber /> `
})
class StandaloneUseTest {}

@Component({
  template: ` <input fuiNumber name="model" class="test-class" [(ngModel)]="model" /> `
})
class TemplateDrivenTest {}

@Component({
  template: `
    <div [formGroup]="example">
      <input fuiNumber name="model" class="test-class" formControlName="model" />
    </div>
  `
})
class ReactiveTest {
  example = new FormGroup({
    model: new FormControl('', Validators.required)
  });
}

export default function (): void {
  describe('Input Number directive', () => {
    ControlStandaloneSpec(StandaloneUseTest);
    TemplateDrivenSpec(FuiNumberContainerComponent, FuiNumberDirective, TemplateDrivenTest, 'fui-number');
    ReactiveSpec(FuiNumberContainerComponent, FuiNumberDirective, ReactiveTest, 'fui-number');
  });
}
