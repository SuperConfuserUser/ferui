import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable()
export class RequiredControlService {
  private _required: BehaviorSubject<boolean> = new BehaviorSubject(false);
  get requiredChange(): Observable<boolean> {
    return this._required.asObservable();
  }
  set required(state: boolean) {
    this._required.next(state);
  }
}
