import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { FuiHelperDirective } from './fui-helper-directive';

const HELPER_DIRECTIVES: Type<any>[] = [FuiHelperDirective];

@NgModule({ imports: [CommonModule], declarations: [HELPER_DIRECTIVES], exports: [HELPER_DIRECTIVES] })
export class FuiHelperModule {}
