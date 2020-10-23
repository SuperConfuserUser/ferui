import { Component } from '@angular/core';

@Component({
  selector: 'fui-widget-action',
  host: { '[class.fui-widget-action]': 'true' },
  template: ` <ng-content></ng-content> `
})
export class FuiWidgetActionComponent {}
