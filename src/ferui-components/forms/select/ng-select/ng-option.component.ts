import { Subject } from 'rxjs';

import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ng-option',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <ng-content></ng-content> `
})
export class NgOptionComponent implements OnChanges {
  @Input() value: any;

  readonly stateChange$ = new Subject<{ value: any; disabled: boolean }>();

  private _disabled = false;

  constructor(public elementRef: ElementRef) {}

  @Input()
  get disabled() {
    return this._disabled;
  }

  set disabled(value: any) {
    this._disabled = this._isDisabled(value);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.disabled) {
      this.stateChange$.next({
        value: this.value,
        disabled: this._disabled
      });
    }
  }

  private _isDisabled(value) {
    return value != null && `${value}` !== 'false';
  }
}
