import { Directive, ElementRef, EventEmitter, HostListener, Optional, Output, Self } from '@angular/core';

import { FocusService } from '../common/providers/focus.service';

@Directive({
  selector: '[fuiSelectIcon]',
  host: {
    '[class.fui-select-icon-handle]': 'true',
    '[class.focused]': 'focused'
  }
})
export class FuiSelectIconDirective {
  @Output() readonly onClick: EventEmitter<boolean> = new EventEmitter();

  private _focused: boolean = false;
  private _clicked: boolean = false;

  constructor(@Self() public elementRef: ElementRef, @Optional() private focusService: FocusService) {
    if (this.focusService) {
      this.focusService.focusChange.subscribe(isFocused => {
        this.focused = isFocused;
      });
    }
  }

  get focused(): boolean {
    return this._focused;
  }

  set focused(value: boolean) {
    this._focused = value;
  }

  get clicked(): boolean {
    return this._clicked;
  }

  set clicked(value: boolean) {
    this._clicked = value;
  }

  @HostListener('mousedown')
  clickHandler() {
    this.clicked = !this.clicked;
    this.onClick.emit(this.clicked);
  }
}
