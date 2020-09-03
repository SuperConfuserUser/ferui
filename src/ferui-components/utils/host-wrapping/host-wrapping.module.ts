import { NgModule } from '@angular/core';

import { EmptyAnchorComponent } from './empty-anchor';

/**
 * Internal module, please do not export!
 */
@NgModule({ declarations: [EmptyAnchorComponent], exports: [EmptyAnchorComponent], entryComponents: [EmptyAnchorComponent] })
export class FuiHostWrappingModule {}
