import { Injectable } from '@angular/core';

import { FuiSelectDirective } from './select';
import { FuiSelectContainerComponent } from './select-container';

@Injectable()
export class FuiSelectService {
  private _fuiSelect: FuiSelectDirective;
  private _fuiSelectContainer: FuiSelectContainerComponent;

  constructor() {}

  get fuiSelect(): FuiSelectDirective {
    return this._fuiSelect;
  }

  set fuiSelect(value: FuiSelectDirective) {
    this._fuiSelect = value;
  }

  get fuiSelectContainer(): FuiSelectContainerComponent {
    return this._fuiSelectContainer;
  }

  set fuiSelectContainer(value: FuiSelectContainerComponent) {
    this._fuiSelectContainer = value;
  }
}
