import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';

export function ipv4AddressValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    // We let another validator take care of empty values
    if (!control.value) {
      return null;
    }
    // tslint:disable-next-line
    const ipV4RegEx = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipAddress = ipV4RegEx.test(control.value);
    return !ipAddress ? { ipv4Address: { value: control.value } } : null;
  };
}

@Directive({
  // tslint:disable-next-line
  selector: '[ipv4Address]',
  providers: [{ provide: NG_VALIDATORS, useExisting: Ipv4AddressValidatorDirective, multi: true }]
})
export class Ipv4AddressValidatorDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    return ipv4AddressValidator()(control);
  }
}
