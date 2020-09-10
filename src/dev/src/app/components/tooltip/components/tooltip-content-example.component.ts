import { Component } from '@angular/core';

@Component({
  template: `I'm a {{ name }}!`
})
export class TooltipContentExampleComponent {
  name: string = 'component';
}
