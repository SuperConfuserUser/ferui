import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { FuiSafeHTMLPipe } from './safe-html.pipe';

const FUI_PIPES: Type<any>[] = [FuiSafeHTMLPipe];

@NgModule({
  imports: [CommonModule],
  declarations: [FUI_PIPES],
  exports: [FUI_PIPES]
})
export class FuiPipesModule {}
