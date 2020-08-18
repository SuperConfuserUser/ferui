import { ValidatorFn } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { Validator } from '@angular/forms';

export function valuesEqualValidator(valueToCompare: any): ValidatorFn {
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
  selector: '[valuesEqual]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ValuesEqualValidatorDirective, multi: true }]
})
export class ValuesEqualValidatorDirective implements Validator {
  @Input('valuesEqual') valueToCompare: any;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return valuesEqualValidator(this.valueToCompare)(control);
  }
}
