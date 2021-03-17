import { A11yModule } from '@angular/cdk/a11y';
import { ObserversModule } from '@angular/cdk/observers';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FuiTabComponent } from './tab';
import { FuiTabBodyComponent, FuiTabBodyPortalDirective } from './tab-body';
import { FuiTabContentDirective } from './tab-content';
import { FuiTabHeaderComponent } from './tab-header';
import { FuiTabLabelDirective } from './tab-label';
import { FuiTabLabelWrapperDirective } from './tab-label-wrapper';
import { FuiTabsComponent } from './tabs';
import { FuiTabsLinkDirective, FuiTabsNavComponent } from './tabs-nav/tabs-nav';

@NgModule({
  imports: [CommonModule, PortalModule, ObserversModule, A11yModule],
  // Don't export all components because some are only to be used internally.
  exports: [
    FuiTabsComponent,
    FuiTabLabelDirective,
    FuiTabComponent,
    FuiTabsNavComponent,
    FuiTabsLinkDirective,
    FuiTabContentDirective
  ],
  declarations: [
    FuiTabsComponent,
    FuiTabLabelDirective,
    FuiTabComponent,
    FuiTabLabelWrapperDirective,
    FuiTabsNavComponent,
    FuiTabsLinkDirective,
    FuiTabBodyComponent,
    FuiTabBodyPortalDirective,
    FuiTabHeaderComponent,
    FuiTabContentDirective
  ]
})
export class FuiTabsModule {}
