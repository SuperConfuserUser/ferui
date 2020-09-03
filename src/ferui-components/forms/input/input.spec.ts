import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ControlStandaloneSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';

import { FuiInputDirective } from './input';
import { FuiInputContainerComponent } from './input-container';

@Component({
  template: ` <input type="text" fuiInput /> `
})
class StandaloneUseTest {}

@Component({
  template: ` <input fuiInput name="model" class="test-class" [(ngModel)]="model" /> `
})
class TemplateDrivenTest {}

@Component({
  template: `
    <div [formGroup]="example">
      <input fuiInput name="model" class="test-class" formControlName="model" />
    </div>
  `
})
class ReactiveTest {
  example = new FormGroup({
    model: new FormControl('', Validators.required)
  });
}

export default function (): void {
  describe('Input directive', () => {
    ControlStandaloneSpec(StandaloneUseTest);
    TemplateDrivenSpec(FuiInputContainerComponent, FuiInputDirective, TemplateDrivenTest, 'fui-input');
    ReactiveSpec(FuiInputContainerComponent, FuiInputDirective, ReactiveTest, 'fui-input');
  });
}
