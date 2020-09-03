import { Component, ContentChild } from '@angular/core';

import { FuiWidgetSubtitleComponent } from './widget-subtitle.component';

@Component({
  selector: 'fui-widget-header',
  host: {
    '[class.fui-widget-header]': 'true',
    '[class.has-subtitle]': 'subtitle !== undefined'
  },
  template: `
    <div class="fui-widget-header-left-cell">
      <ng-content select="fui-widget-title"></ng-content>
      <ng-content select="fui-widget-subtitle"></ng-content>
    </div>
    <div class="fui-widget-header-right-cell">
      <ng-content select="fui-widget-actions"></ng-content>
    </div>
  `
})
export class FuiWidgetHeaderComponent {
  @ContentChild(FuiWidgetSubtitleComponent) subtitle: ContentChild;
}
