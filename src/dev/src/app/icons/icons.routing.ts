import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GetStartedComponent } from './get-started/get-started.component';
import { IconsLandingComponent } from './icons-landing.component';
import { IconsComponent } from './icons-list/icons.component';

export const ICONS_ROUTES: Routes = [
  {
    path: 'icons',
    component: IconsLandingComponent,
    children: [
      { path: '', redirectTo: 'get-started', pathMatch: 'full' },
      { path: 'get-started', component: GetStartedComponent },
      { path: 'icons-list', component: IconsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ICONS_ROUTES)],
  exports: [RouterModule]
})
export class IconsRoutingModule {}
