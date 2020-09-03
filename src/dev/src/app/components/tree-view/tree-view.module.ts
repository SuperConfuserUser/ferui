import { HighlightModule } from 'ngx-highlightjs';

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FeruiModule } from '@ferui/components';

import { TreeViewClientSideDemoComponent } from './tree-view-client-side-demo';
import { TreeViewDashboardDemoComponent } from './tree-view-dashboard-demo';
import { TreeViewOverviewDemoComponent } from './tree-view-overview-demo';
import { TreeViewServerSideDemoComponent } from './tree-view-server-side-demo';

const FUI_DEMO_COMPONENTS_DIRECTIVES: Type<any>[] = [
  TreeViewClientSideDemoComponent,
  TreeViewServerSideDemoComponent,
  TreeViewOverviewDemoComponent,
  TreeViewDashboardDemoComponent
];

@NgModule({
  imports: [CommonModule, FormsModule, FeruiModule, HighlightModule, RouterModule],
  declarations: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  exports: [FUI_DEMO_COMPONENTS_DIRECTIVES]
})
export class TreeViewDemoModule {}
