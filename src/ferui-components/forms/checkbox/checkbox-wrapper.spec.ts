import { Component } from '@angular/core';

import { WrapperContainerSpec, WrapperFullSpec } from '../tests/wrapper.spec';

import { FuiCheckboxDirective } from './checkbox';
import { FuiCheckboxContainerComponent } from './checkbox-container';
import { FuiCheckboxWrapperComponent } from './checkbox-wrapper';

@Component({
  template: `
    <fui-checkbox-wrapper>
      <label fuiLabel>Hello World</label>
      <input type="checkbox" fuiCheckbox name="model" [(ngModel)]="model" />
    </fui-checkbox-wrapper>
  `
})
class FullTest {
  model = '';
}

@Component({
  template: `
    <fui-checkbox-container>
      <fui-checkbox-wrapper>
        <input type="checkbox" fuiCheckbox name="model" [(ngModel)]="model" />
      </fui-checkbox-wrapper>
    </fui-checkbox-container>
  `
})
class ContainerTest {
  model = '';
}

export default function (): void {
  describe('FuiCheckboxWrapperComponent', () => {
    WrapperFullSpec(FuiCheckboxWrapperComponent, FuiCheckboxDirective, FullTest, 'fui-checkbox-wrapper');
    WrapperContainerSpec(
      FuiCheckboxContainerComponent,
      FuiCheckboxWrapperComponent,
      FuiCheckboxDirective,
      ContainerTest,
      'fui-checkbox-wrapper'
    );
  });
}
