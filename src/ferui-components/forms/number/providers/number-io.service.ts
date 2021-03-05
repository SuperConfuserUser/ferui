import { Subject } from 'rxjs';

import { Injectable } from '@angular/core';

import { FeruiUtils } from '../../../utils/ferui-utils';

@Injectable()
export class NumberIoService {
  onKeyPressed: Subject<string> = new Subject<string>();

  private _min: number;
  private _max: number;
  private _step: number = 1;
  private _currentValue: number = 0;

  get min(): number {
    return this._min;
  }

  set min(value: number) {
    this._min = value;
  }

  get max(): number {
    return this._max;
  }

  set max(value: number) {
    this._max = value;
  }

  get step(): number {
    return this._step;
  }

  set step(value: number) {
    this._step = value;
  }

  get currentValue(): number {
    return this._currentValue;
  }

  set currentValue(value: number) {
    this._currentValue = value;
  }

  get onKeyPressed$() {
    return this.onKeyPressed.asObservable();
  }

  increment(initialValue?: number): number {
    initialValue = !FeruiUtils.isNullOrUndefined(initialValue) ? initialValue : this.currentValue;
    if (isNaN(initialValue)) {
      initialValue = !FeruiUtils.isNullOrUndefined(this.min) ? this.min : 0;
    }
    if (
      (FeruiUtils.isNullOrUndefined(this.min) && FeruiUtils.isNullOrUndefined(this.max)) ||
      (!FeruiUtils.isNullOrUndefined(this.min) &&
        !FeruiUtils.isNullOrUndefined(this.max) &&
        initialValue + this.step >= this.min &&
        initialValue + this.step <= this.max)
    ) {
      this.currentValue = initialValue + this.step;
    }
    return this.currentValue;
  }

  decrement(initialValue?: number): number {
    initialValue = !FeruiUtils.isNullOrUndefined(initialValue) ? initialValue : this.currentValue;
    if (isNaN(initialValue)) {
      initialValue = !FeruiUtils.isNullOrUndefined(this.min) ? this.min : 0;
    }
    if (
      (FeruiUtils.isNullOrUndefined(this.min) && FeruiUtils.isNullOrUndefined(this.max)) ||
      (!FeruiUtils.isNullOrUndefined(this.min) &&
        !FeruiUtils.isNullOrUndefined(this.max) &&
        initialValue - this.step >= this.min &&
        initialValue - this.step <= this.max)
    ) {
      this.currentValue = initialValue - this.step;
    }
    return this.currentValue;
  }
}
