import { Directive, HostBinding, Input } from '@angular/core';

/**
 * Fui Helper, no behavior - only purpose is to "declare" a tag in Angular
 */
@Directive({
  selector: '[fuiHelper]',
  host: {
    '[class.fui-helper]': 'true'
  }
})
export class FuiHelperDirective {
  private _tabIndex: string = '1';

  get tabindex() {
    return this._tabIndex;
  }

  @HostBinding('attr.tabindex')
  @Input()
  set tabindex(value: string) {
    this._tabIndex = value;
  }
}
