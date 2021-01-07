import { Component } from '@angular/core';

@Component({
  selector: 'fui-default-control-error',
  template: `
    <ng-content></ng-content>
    <fui-control-error *fuiIfError="'ipv4Address'">This is not a valid IPV4-Address.</fui-control-error>
    <fui-control-error *fuiIfError="'ipv6Address'">This is not a valid IPV6-Address.</fui-control-error>
    <fui-control-error *fuiIfError="'ipAddress'">This is not a valid IP-Address.</fui-control-error>
    <fui-control-error *fuiIfError="'required'">This field is required.</fui-control-error>
    <fui-control-error *fuiIfError="'email'">You didn't enter a valid email address.</fui-control-error>
    <fui-control-error *fuiIfError="'minLength'">Text does not reach the minimum length.</fui-control-error>
    <fui-control-error *fuiIfError="'maxLength'">Text is too long.</fui-control-error>
    <fui-control-error *fuiIfError="'min'">The number is under the minimum.</fui-control-error>
    <fui-control-error *fuiIfError="'max'">The number is over the maximum.</fui-control-error>
    <fui-control-error *fuiIfError="'valuesEqual'">The values are not equal.</fui-control-error>
    <fui-control-error *fuiIfError="'greaterThan'">The value must be higher than the initial one.</fui-control-error>
  `,
  host: { '[class.fui-subtext-wrapper]': 'true' }
})
export class FuiDefaultControlErrorComponent {}
