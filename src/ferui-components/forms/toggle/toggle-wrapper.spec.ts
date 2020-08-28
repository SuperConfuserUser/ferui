import { Component } from '@angular/core';
import { WrapperFullSpec, WrapperNoLabelSpec, WrapperContainerSpec } from '../tests/wrapper.spec';
import { FuiToggleContainer } from './toggle-container';
import { FuiToggle } from './toggle';
import { FuiToggleWrapper } from './toggle-wrapper';

@Component({
  template: `
    <fui-toggle-wrapper>
      <label>Hello World</label>
      <input type="checkbox" fuiToggle name="model" [(ngModel)]="model" />
    </fui-toggle-wrapper>
  `
})
class FullTest {
  model = '';
}

@Component({
  template: `
    <fui-toggle-wrapper>
      <input type="checkbox" fuiToggle name="model" [(ngModel)]="model" />
    </fui-toggle-wrapper>
  `
})
class NoLabelTest {
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
  describe('FuiToggleWrapper', () => {
    WrapperNoLabelSpec(FuiToggleWrapper, FuiToggle, NoLabelTest);
    WrapperFullSpec(FuiToggleWrapper, FuiToggle, FullTest, 'fui-toggle-wrapper');
    WrapperContainerSpec(FuiToggleContainer, FuiToggleWrapper, FuiToggle, ContainerTest, 'fui-toggle-wrapper');
  });
}
