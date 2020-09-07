import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable()
export class FuiCheckboxService {
  private _checkboxState: FuiCheckboxState;
  private _checkboxChange: BehaviorSubject<FuiCheckboxState> = new BehaviorSubject<FuiCheckboxState>(this._checkboxState);

  get checkboxState(): FuiCheckboxState {
    return this._checkboxState;
  }

  set checkboxState(value: FuiCheckboxState) {
    this._checkboxState = value;
    this._checkboxChange.next(this._checkboxState);
  }

  get checkboxChange(): Observable<FuiCheckboxState> {
    return this._checkboxChange.asObservable();
  }
}

/**
 * FerUI Checkbox State enum
 */
export enum FuiCheckboxState {
  CHECKED = 'CHECKED',
  NOT_CHECKED = 'NOT CHECKED',
  INDETERMINATE = 'INDETERMINATE'
}
