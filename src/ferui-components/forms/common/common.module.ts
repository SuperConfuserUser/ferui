import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { FuiHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';

import { FuiDefaultControlErrorComponent } from './default-error';
import { FuiControlErrorComponent } from './error';
import { FuiFormDirective } from './form';
import { FuiIfErrorDirective } from './if-error/if-error';
import { FuiLabelDirective } from './label';
import { EmailValidatorDirective } from './validators/email-validator';
import { GreaterThanValidatorDirective } from './validators/greater-than-validator.directive';
import { IpAddressValidatorDirective } from './validators/ip-address-validator.directive';
import { Ipv4AddressValidatorDirective } from './validators/ipv4-address-validator.directive';
import { Ipv6AddressValidatorDirective } from './validators/ipv6-address-validator.directive';
import { MaxValidatorDirective } from './validators/max-validator.directive';
import { MinValidatorDirective } from './validators/min-validator.directive';
import { ValuesEqualValidatorDirective } from './validators/values-equal-validator.directive';

const FUI_COMMON_COMPONENTS: Type<any>[] = [
  GreaterThanValidatorDirective,
  ValuesEqualValidatorDirective,
  EmailValidatorDirective,
  IpAddressValidatorDirective,
  Ipv4AddressValidatorDirective,
  Ipv6AddressValidatorDirective,
  MaxValidatorDirective,
  MinValidatorDirective,
  FuiLabelDirective,
  FuiControlErrorComponent,
  FuiDefaultControlErrorComponent,
  FuiIfErrorDirective,
  FuiFormDirective
];

@NgModule({
  imports: [CommonModule, FuiHostWrappingModule],
  declarations: [FUI_COMMON_COMPONENTS],
  exports: [FUI_COMMON_COMPONENTS]
})
export class FuiCommonFormsModule {}
