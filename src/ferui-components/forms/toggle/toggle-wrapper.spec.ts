import { Component } from '@angular/core';

import { WrapperContainerSpec, WrapperFullSpec } from '../tests/wrapper.spec';

import { FuiToggleDirective } from './toggle';
import { FuiToggleContainerComponent } from './toggle-container';
import { FuiToggleWrapperComponent } from './toggle-wrapper';

@Component({
  template: `
    <fui-toggle-wrapper>
      <label fuiLabel>Hello World</label>
      <input type="checkbox" fuiToggle name="model" [(ngModel)]="model" />
    </fui-toggle-wrapper>
  `
})
class FullTest {
  model = '';
}

@Component({
  template: `
    <fui-toggle-container>
      <fui-toggle-wrapper>
        <input type="checkbox" fuiToggle name="model" [(ngModel)]="model" />
      </fui-toggle-wrapper>
    </fui-toggle-container>
  `
})
class ContainerTest {
  model = '';
}

export default function (): void {
  describe('FuiToggleWrapperComponent', () => {
    WrapperFullSpec(FuiToggleWrapperComponent, FuiToggleDirective, FullTest, 'fui-toggle-wrapper');
    WrapperContainerSpec(
      FuiToggleContainerComponent,
      FuiToggleWrapperComponent,
      FuiToggleDirective,
      ContainerTest,
      'fui-toggle-wrapper'
    );
  });
}
