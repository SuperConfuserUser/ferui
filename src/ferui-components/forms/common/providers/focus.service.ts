import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable()
export class FocusService {
  /**
   * The original focus event
   */
  originalEvent: Event;

  private _focused: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * Check for focus change event.
   */
  get focusChange(): Observable<boolean> {
    return this._focused.asObservable();
  }

  /**
   * Set whether or not the element is focused.
   * @param state
   */
  set focused(state: boolean) {
    this._focused.next(state);
  }

  /**
   * Focus an element and keep the original event in memory.
   * @param state
   * @param event
   */
  toggleWithEvent(state: boolean, event: Event): void {
    this.originalEvent = event;
    this.focused = state;
  }
}
