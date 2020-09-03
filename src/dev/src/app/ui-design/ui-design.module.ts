import { HighlightModule } from 'ngx-highlightjs';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClrIconModule, FeruiModule } from '@ferui/components';

import { UiDesignAlertsComponent } from './alerts/alerts.component';
import { UiDesignButtonsComponent } from './buttons/buttons.component';
import { UiDesignGetStartedComponent } from './get-started/get-started.component';
import { UiDesignGridComponent } from './grid/grid.component';
import { UiDesignSpacingsComponent } from './spacings/spacings.component';
import { UiDesignLandingComponent } from './ui-design-landing.component';
import { UiDesignRoutingModule } from './ui-design.routing';

@NgModule({
  imports: [CommonModule, FormsModule, UiDesignRoutingModule, ClrIconModule, FeruiModule, HighlightModule],
  declarations: [
    UiDesignGetStartedComponent,
    UiDesignSpacingsComponent,
    UiDesignGridComponent,
    UiDesignLandingComponent,
    UiDesignButtonsComponent,
    UiDesignAlertsComponent
  ],
  exports: [
    UiDesignGetStartedComponent,
    UiDesignSpacingsComponent,
    UiDesignGridComponent,
    UiDesignButtonsComponent,
    UiDesignAlertsComponent
  ]
})
export class UiDesignModule {}
