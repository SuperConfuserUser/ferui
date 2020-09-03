import { Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable()
export class PlaceholderService {
  private _placeholderChanges: Subject<string> = new Subject<string>();

  get placeholderChanges(): Observable<string> {
    return this._placeholderChanges.asObservable();
  }

  setPlaceholder(placeholder: string) {
    this._placeholderChanges.next(placeholder);
  }
}
