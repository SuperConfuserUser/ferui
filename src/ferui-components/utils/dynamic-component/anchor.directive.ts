import { Directive, ViewContainerRef } from '@angular/core';

/**
 * Anchor directive.
 * Before adding components dynamically we need to define an anchor point to tell Angular where to insert components.
 * This is part of angular dynamic component loader logic.
 * See https://angular.io/guide/dynamic-component-loader for more info.
 */
@Directive({
  selector: '[fuiDynamicComponentHost]'
})
export class FuiDynamicComponentHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
