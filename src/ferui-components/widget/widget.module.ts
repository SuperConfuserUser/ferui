import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FuiWidgetActionComponent } from './widget-action.component';
import { FuiWidgetBodyComponent } from './widget-body.component';
import { FuiWidgetFooterComponent } from './widget-footer.component';
import { FuiWidgetHeaderComponent } from './widget-header.component';
import { FuiWidgetSubtitleComponent } from './widget-subtitle.component';
import { FuiWidgetTitleComponent } from './widget-title.component';
import { FuiWidgetComponent } from './widget.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    FuiWidgetComponent,
    FuiWidgetHeaderComponent,
    FuiWidgetTitleComponent,
    FuiWidgetSubtitleComponent,
    FuiWidgetActionComponent,
    FuiWidgetBodyComponent,
    FuiWidgetFooterComponent
  ],
  exports: [
    FuiWidgetComponent,
    FuiWidgetHeaderComponent,
    FuiWidgetTitleComponent,
    FuiWidgetSubtitleComponent,
    FuiWidgetActionComponent,
    FuiWidgetBodyComponent,
    FuiWidgetFooterComponent
  ]
})
export class FuiWidgetModule {}
