import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';

function valuesEqualValidator(valueToCompare: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    // We let another validator taking care of empty values
    if (!control.value) {
      return null;
    }
    const valuesAreEquals: boolean = valueToCompare === control.value;
    return !valuesAreEquals ? { valuesEqual: { value: control.value, valueToCompare: valueToCompare } } : null;
  };
}

@Directive({
  // tslint:disable-next-line
  selector: '[valuesEqual]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ValuesEqualValidatorDirective, multi: true }]
})
export class ValuesEqualValidatorDirective implements Validator {
  @Input('valuesEqual') valueToCompare: any;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return valuesEqualValidator(this.valueToCompare)(control);
  }
}
