import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ControlStandaloneSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';

import { FuiTextareaDirective } from './textarea';
import { FuiTextareaContainerComponent } from './textarea-container';

@Component({
  template: ` <textarea fuiTextarea></textarea> `
})
class StandaloneUseTest {}

@Component({
  template: ` <textarea fuiTextarea name="model" class="test-class" [(ngModel)]="model"></textarea> `
})
class TemplateDrivenTest {}

@Component({
  template: `
    <div [formGroup]="example">
      <textarea fuiTextarea name="model" class="test-class" formControlName="model"></textarea>
    </div>
  `
})
class ReactiveTest {
  example = new FormGroup({
    model: new FormControl('', Validators.required)
  });
}

export default function (): void {
  describe('Textarea directive', () => {
    ControlStandaloneSpec(StandaloneUseTest);
    TemplateDrivenSpec(FuiTextareaContainerComponent, FuiTextareaDirective, TemplateDrivenTest, 'fui-textarea');
    ReactiveSpec(FuiTextareaContainerComponent, FuiTextareaDirective, ReactiveTest, 'fui-textarea');
  });
}
