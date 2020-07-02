import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClrIconModule, FeruiModule } from '@ferui/components';
import { HighlightModule } from 'ngx-highlightjs';
import { UiDesignRoutingModule } from './ui-design.routing';
import { UiDesignGetStartedComponent } from './get-started/get-started.component';
import { UiDesignLandingComponent } from './ui-design-landing.component';
import { UiDesignSpacingsComponent } from './spacings/spacings.component';
import { UiDesignGridComponent } from './grid/grid.component';
import { UiDesignButtonsComponent } from './buttons/buttons.component';
import { UiDesignAlertsComponent } from './alerts/alerts.component';

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
