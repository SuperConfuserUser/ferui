import { Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

import { DatagridEvent } from '../events';

@Injectable()
export class FuiDatagridEventService {
  private listeners: { [key: string]: Subject<DatagridEvent> } = {};

  listenToEvent(eventType: string): Observable<DatagridEvent> | null {
    if (!this.listeners.hasOwnProperty(eventType)) {
      this.listeners[eventType] = new Subject<DatagridEvent>();
    }
    return this.listeners[eventType].asObservable();
  }

  dispatchEvent(event: DatagridEvent): void {
    if (!event) {
      return;
    }
    if (!this.listeners.hasOwnProperty(event.type)) {
      this.listeners[event.type] = new Subject<DatagridEvent>();
    }
    this.listeners[event.type].next(event);
  }

  flushListeners(): void {
    for (const listenersKey in this.listeners) {
      if (this.listeners.hasOwnProperty(listenersKey)) {
        // Mark all observers subscription as completed to ensure we're killing them properly.
        this.listeners[listenersKey].complete();
        // The unsubscribe method in the Subject class doesn't actually unsubscribe anything.
        // Instead, it marks the subject as `closed` and sets its internal array subscribed observers to `null`.
        this.listeners[listenersKey].unsubscribe();
      }
    }
    this.listeners = {};
  }
}
