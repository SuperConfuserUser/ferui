import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';

import { FuiDropdownComponent } from './dropdown';
import { RootDropdownService } from './services/dropdown.service';

@Directive({
  selector: '[fuiDropdownItem]',
  host: { '[class.fui-dropdown-item]': 'true' }
})
export class FuiDropdownItemDirective implements AfterViewInit {
  constructor(
    private dropdown: FuiDropdownComponent,
    private el: ElementRef,
    private _dropdownService: RootDropdownService,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    this.renderer.listen(this.el.nativeElement, 'click', () => this.onDropdownItemClick());
  }

  onDropdownItemClick(): void {
    if (this.dropdown.isMenuClosable && !this.el.nativeElement.classList.contains('disabled')) {
      this._dropdownService.closeMenus();
    }
  }
}
