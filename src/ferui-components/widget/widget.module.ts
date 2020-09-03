import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FuiWidgetActionsComponent } from './widget-actions.component';
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
    FuiWidgetActionsComponent,
    FuiWidgetBodyComponent,
    FuiWidgetFooterComponent
  ],
  exports: [
    FuiWidgetComponent,
    FuiWidgetHeaderComponent,
    FuiWidgetTitleComponent,
    FuiWidgetSubtitleComponent,
    FuiWidgetActionsComponent,
    FuiWidgetBodyComponent,
    FuiWidgetFooterComponent
  ]
})
export class FuiWidgetModule {}
