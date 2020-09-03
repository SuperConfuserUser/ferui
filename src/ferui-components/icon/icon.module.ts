import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { ClrIconCustomTagDirective } from './icon';

export const CLR_ICON_DIRECTIVES: Type<any>[] = [ClrIconCustomTagDirective];

@NgModule({ imports: [CommonModule], declarations: [CLR_ICON_DIRECTIVES], exports: [CLR_ICON_DIRECTIVES] })
export class ClrIconModule {}
