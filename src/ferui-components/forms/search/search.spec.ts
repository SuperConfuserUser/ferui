import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ControlStandaloneSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';

import { FuiSearchDirective } from './search';
import { FuiSearchContainerComponent } from './search-container';

@Component({
  template: ` <input type="text" fuiSearch /> `
})
class StandaloneUseTest {}

@Component({
  template: ` <input fuiSearch name="model" class="test-class" [(ngModel)]="model" /> `
})
class TemplateDrivenTest {
  model: string = null;
}

@Component({
  template: `
    <div [formGroup]="example">
      <input fuiSearch name="model" class="test-class" formControlName="model" />
    </div>
  `
})
class ReactiveTest {
  example = new FormGroup({
    model: new FormControl('', Validators.required)
  });
}

export default function (): void {
  describe('Search directive', () => {
    ControlStandaloneSpec(StandaloneUseTest);
    TemplateDrivenSpec(FuiSearchContainerComponent, FuiSearchDirective, TemplateDrivenTest, 'fui-search');
    ReactiveSpec(FuiSearchContainerComponent, FuiSearchDirective, ReactiveTest, 'fui-search');
  });
}
