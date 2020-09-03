import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UiDesignAlertsComponent } from './alerts/alerts.component';
import { UiDesignButtonsComponent } from './buttons/buttons.component';
import { UiDesignGetStartedComponent } from './get-started/get-started.component';
import { UiDesignGridComponent } from './grid/grid.component';
import { UiDesignSpacingsComponent } from './spacings/spacings.component';
import { UiDesignLandingComponent } from './ui-design-landing.component';

export const UI_DESIGN_ROUTES: Routes = [
  {
    path: 'design',
    component: UiDesignLandingComponent,
    children: [
      { path: '', redirectTo: 'get-started', pathMatch: 'full' },
      { path: 'get-started', component: UiDesignGetStartedComponent },
      { path: 'grid', component: UiDesignGridComponent },
      { path: 'buttons', component: UiDesignButtonsComponent },
      { path: 'alerts', component: UiDesignAlertsComponent },
      { path: 'spacings', component: UiDesignSpacingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(UI_DESIGN_ROUTES)],
  exports: [RouterModule]
})
export class UiDesignRoutingModule {}
