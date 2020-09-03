import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FuiUnselectableDirective } from './unselectable';

@NgModule({
  imports: [CommonModule],
  declarations: [FuiUnselectableDirective],
  exports: [FuiUnselectableDirective]
})
export class FuiUnselectableModule {}
