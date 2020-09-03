import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { VirtualScrollClipperContentDirective } from './virtual-scroll-directives';
import { FuiVirtualScrollerComponent } from './virtual-scroller';
import { VIRTUAL_SCROLLER_DEFAULT_OPTIONS, VIRTUAL_SCROLLER_DEFAULT_OPTIONS_FACTORY } from './virtual-scroller-factory';

@NgModule({
  exports: [FuiVirtualScrollerComponent, VirtualScrollClipperContentDirective],
  declarations: [FuiVirtualScrollerComponent, VirtualScrollClipperContentDirective],
  imports: [CommonModule],
  providers: [
    {
      provide: VIRTUAL_SCROLLER_DEFAULT_OPTIONS,
      useFactory: VIRTUAL_SCROLLER_DEFAULT_OPTIONS_FACTORY
    }
  ]
})
export class FuiVirtualScrollerModule {}
