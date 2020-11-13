import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';

function greaterThanValidator(valueToCompare: number | Date): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    // We let another validator taking care of empty values
    if (!control.value) {
      return null;
    }
    const greaterThan: boolean = control.value > valueToCompare;
    return !greaterThan ? { greaterThan: { value: control.value, valueToCompare: valueToCompare } } : null;
  };
}

@Directive({
  // tslint:disable-next-line
  selector: '[greaterThan]',
  providers: [{ provide: NG_VALIDATORS, useExisting: GreaterThanValidatorDirective, multi: true }]
})
export class GreaterThanValidatorDirective implements Validator {
  @Input('greaterThan') valueToCompare: number | Date;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return greaterThanValidator(this.valueToCompare)(control);
  }
}
