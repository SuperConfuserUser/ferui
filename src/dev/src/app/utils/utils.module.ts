import { HighlightModule } from 'ngx-highlightjs';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FeruiModule } from '@ferui/components';

import { DemoPageComponent } from './demo-page.component';
import { DemoComponent } from './demo.component';

@NgModule({
  imports: [CommonModule, FormsModule, FeruiModule, HighlightModule],
  declarations: [DemoComponent, DemoPageComponent],
  exports: [DemoComponent, DemoPageComponent]
})
export class UtilsModule {}
