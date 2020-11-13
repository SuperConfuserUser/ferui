import { Directive } from '@angular/core';

/**
 * This directive is used to add a custom label on the left position.
 * If there is no label on the left, the filters will be positioned on the left, but if there is any label,
 * the filters will then be positioned on the right.
 * One exception though: If you want to display only the filters (without the global search filter) the filters will then
 * automatically be positioned to the right.
 */
@Directive({
  selector: '[fuiFilterHeaderLabel]',
  host: {
    '[class.fui-filter-header-label]': 'true'
  }
})
export class FuiFilterHeaderLabelDirective {}
