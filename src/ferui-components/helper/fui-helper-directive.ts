import { Directive } from '@angular/core';

/**
 * Fui Helper, no behavior - only purpose is to "declare" a tag in Angular
 */
@Directive({
  selector: '[fuiHelper]',
  host: {
    '[class.fui-helper]': 'true'
  }
})
export class FuiHelperDirective {}
