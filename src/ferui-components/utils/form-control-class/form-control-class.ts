import { NgControl } from '@angular/forms';

import { FuiLabelDirective } from '../../forms/common/label';
import { FeruiUtils } from '../ferui-utils';

export class FormControlClass {
  public static extractControlClass(
    control: NgControl,
    label?: FuiLabelDirective,
    focus?: boolean,
    excludedList?: Array<string>
  ): Array<string> {
    const classes = [];
    if (!excludedList) {
      excludedList = [];
    }
    if (control && control.touched && excludedList.indexOf('fui-touched') === -1) {
      classes.push('fui-touched');
    }
    if (control && control.dirty && excludedList.indexOf('fui-dirty') === -1) {
      classes.push('fui-dirty');
    }
    if (control && control.disabled && excludedList.indexOf('fui-disabled') === -1) {
      classes.push('fui-disabled');
    }
    if (control && control.pristine && excludedList.indexOf('fui-pristine') === -1) {
      classes.push('fui-pristine');
    }
    if (
      control &&
      (FeruiUtils.isNullOrUndefined(control.value) || control.value === '') &&
      excludedList.indexOf('fui-empty') === -1
    ) {
      classes.push('fui-empty');
    }
    if (FeruiUtils.isNullOrUndefined(label) && excludedList.indexOf('fui-no-label') === -1) {
      classes.push('fui-no-label');
    }
    if (focus && excludedList.indexOf('fui-control-focus') === -1) {
      classes.push('fui-control-focus');
    }
    return classes;
  }
}
