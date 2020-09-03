import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FuiTabComponent } from './tab';
import { FuiTabsComponent } from './tabs';

@NgModule({
  imports: [CommonModule],
  declarations: [FuiTabsComponent, FuiTabComponent],
  exports: [FuiTabsComponent, FuiTabComponent]
})
export class FuiTabsModule {}
