import { Directive } from '@angular/core';

@Directive({
  selector: '[fuiAlertsIcon]',
  host: {
    '[class.fui-alert-icon]': 'true'
  }
})
export class FuiAlertsIcon {}
