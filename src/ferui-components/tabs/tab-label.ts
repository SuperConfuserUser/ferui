import { CdkPortal } from '@angular/cdk/portal';
import { Directive } from '@angular/core';

/**
 * Used to flag tab labels for use with the portal directive
 */
@Directive({
  selector: '[fui-tab-label], [fuiTabLabel]'
})
export class FuiTabLabelDirective extends CdkPortal {}
