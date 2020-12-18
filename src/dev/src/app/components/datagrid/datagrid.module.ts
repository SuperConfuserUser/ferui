import { HighlightModule } from 'ngx-highlightjs';

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DateIOService, FeruiModule, LocaleHelperService } from '@ferui/components';

import { CustomBrowserFilterComponent } from './custom-browser-filter';
import { DatagridDemoComponent } from './datagrid.demo';
import { DefaultDatagridOptionsMenuComponent } from './default-datagrid-options-menu';
import { DatagridClientSideComponent } from './pages/datagrid-client-side.component';
import { DatagridHomeComponent } from './pages/datagrid-home';
import { DatagridInfiniteServerSideComponent } from './pages/datagrid-infinite-server-side.component';
import { DatagridServerSideComponent } from './pages/datagrid-server-side.component';
import { DatagridTreeviewInfiniteServerSideComponent } from './pages/datagrid-treeview.component';
import { DatagridModalTestingComponent } from './pages/modals/datagrid-modal-testing';
import { RowDataApiService } from './server-side-api/datagrid-row.service';

const FUI_DEMO_COMPONENTS_DIRECTIVES: Type<any>[] = [
  DatagridDemoComponent,
  DatagridClientSideComponent,
  DatagridServerSideComponent,
  DatagridInfiniteServerSideComponent,
  DatagridTreeviewInfiniteServerSideComponent,
  DefaultDatagridOptionsMenuComponent,
  CustomBrowserFilterComponent,
  DatagridHomeComponent,
  DatagridModalTestingComponent
];

@NgModule({
  imports: [CommonModule, FormsModule, FeruiModule, RouterModule, HighlightModule],
  declarations: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  exports: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  providers: [LocaleHelperService, DateIOService, RowDataApiService],
  entryComponents: [DatagridModalTestingComponent]
})
export class DatagridDemoModule {}
