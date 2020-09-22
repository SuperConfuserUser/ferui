import { Component } from '@angular/core';

import { WrapperContainerSpec, WrapperFullSpec } from '../tests/wrapper.spec';

import { FuiRadioDirective } from './radio';
import { FuiRadioContainerComponent } from './radio-container';
import { FuiRadioWrapperComponent } from './radio-wrapper';

@Component({
  template: `
    <fui-radio-wrapper>
      <label fuiLabel>Hello World</label>
      <input type="radio" fuiRadio name="model" [(ngModel)]="model" />
    </fui-radio-wrapper>
  `
})
class FullTest {
  model = '';
}

@Component({
  template: `
    <fui-radio-container>
      <fui-radio-wrapper>
        <input type="radio" fuiRadio name="model" [(ngModel)]="model" />
      </fui-radio-wrapper>
    </fui-radio-container>
  `
})
class ContainerTest {
  model = '';
}

export default function (): void {
  describe('FuiRadioWrapperComponent', () => {
    WrapperFullSpec(FuiRadioWrapperComponent, FuiRadioDirective, FullTest, 'fui-radio-wrapper');
    WrapperContainerSpec(
      FuiRadioContainerComponent,
      FuiRadioWrapperComponent,
      FuiRadioDirective,
      ContainerTest,
      'fui-radio-wrapper'
    );
  });
}
