import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable()
export class FuiCheckboxService {
  private _checkboxState: FuiCheckboxStateEnum;
  private _checkboxChange: BehaviorSubject<FuiCheckboxStateEnum> = new BehaviorSubject<FuiCheckboxStateEnum>(this._checkboxState);

  get checkboxState(): FuiCheckboxStateEnum {
    return this._checkboxState;
  }

  set checkboxState(value: FuiCheckboxStateEnum) {
    this._checkboxState = value;
    this._checkboxChange.next(this._checkboxState);
  }

  get checkboxChange(): Observable<FuiCheckboxStateEnum> {
    return this._checkboxChange.asObservable();
  }
}

/**
 * FerUI Checkbox State enum
 */
export enum FuiCheckboxStateEnum {
  CHECKED = 'CHECKED',
  NOT_CHECKED = 'NOT CHECKED',
  INDETERMINATE = 'INDETERMINATE'
}
