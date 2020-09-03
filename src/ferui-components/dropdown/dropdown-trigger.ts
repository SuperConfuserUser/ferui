import { Directive, HostListener } from '@angular/core';

import { IfOpenService } from '../utils/conditional/if-open.service';

import { FuiDropdownComponent } from './dropdown';

@Directive({
  selector: '[fuiDropdownTrigger]',
  host: {
    '[class.fui-dropdown-trigger]': 'isRootLevelToggle',
    '[class.fui-dropdown-item]': '!isRootLevelToggle',
    '[class.expandable]': '!isRootLevelToggle',
    '[class.active]': 'active'
  }
})
export class FuiDropdownTriggerDirective {
  public isRootLevelToggle: boolean = true;

  constructor(dropdown: FuiDropdownComponent, private ifOpenService: IfOpenService) {
    // if the containing dropdown has a parent, then this is not the root level one
    if (dropdown.parent) {
      this.isRootLevelToggle = false;
    }
  }

  get active(): boolean {
    return this.ifOpenService.open;
  }

  @HostListener('click', ['$event'])
  onDropdownTriggerClick(event: any): void {
    this.ifOpenService.toggleWithEvent(event);
  }
}
