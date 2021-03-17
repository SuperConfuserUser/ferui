import { Directive, TemplateRef } from '@angular/core';

/** Decorates the `ng-template` tags and reads out the template from it. */
@Directive({ selector: '[fui-tab-content], [fuiTabContent]' })
export class FuiTabContentDirective {
  constructor(public template: TemplateRef<any>) {}
}
