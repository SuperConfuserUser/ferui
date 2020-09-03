import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClrIconModule } from '../icon/icon.module';
import { FuiVirtualScrollerModule } from '../virtual-scroller/virtual-scroller.module';

import { FuiTreeNodeComponent } from './tree-node-component';
import { FuiTreeViewComponent } from './tree-view-component';

export const FUI_TREEVIEW_DIRECTIVES: Type<any>[] = [FuiTreeViewComponent, FuiTreeNodeComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, FuiVirtualScrollerModule],
  declarations: [FUI_TREEVIEW_DIRECTIVES],
  exports: [FUI_TREEVIEW_DIRECTIVES]
})
export class TreeViewModule {}
