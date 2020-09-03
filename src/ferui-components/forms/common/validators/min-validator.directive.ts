import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  // tslint:disable-next-line
  selector: '[min]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MinValidatorDirective, multi: true }]
})
export class MinValidatorDirective implements Validator {
  @Input() min: number;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return parseInt(control.value, 10) < this.min ? { min: true } : null;
  }
}
