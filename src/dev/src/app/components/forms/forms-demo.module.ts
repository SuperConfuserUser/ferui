import { HighlightModule } from 'ngx-highlightjs';

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FeruiModule } from '@ferui/components';

import { UtilsModule } from '../../utils/utils.module';

import { CheckboxComponent } from './checkbox/checkbox.component';
import { FormsDashboardComponent } from './dashboard/forms-dashboard.component';
import { DatetimeComponent } from './datetime/datetime.component';
import { DefaultTemplateContentComponent } from './default-template-content';
import { DefaultTemplateWrapperComponent } from './default-template-wrapper';
import { FormsLandingComponent } from './forms-landing.component';
import { InputsComponent } from './inputs/inputs.component';
import { NumberComponent } from './number/number';
import { PasswordComponent } from './password/password.component';
import { RadiosComponent } from './radios/radios.component';
import { SelectsComponent } from './select/selects.component';
import { TextareaComponent } from './textarea/textarea.component';
import { ToggleComponent } from './toggle/toggle.component';

export const FUI_DEMO_FROMS_DIRECTIVES: Type<any>[] = [
  DefaultTemplateWrapperComponent,
  DefaultTemplateContentComponent,
  FormsDashboardComponent,
  InputsComponent,
  NumberComponent,
  DatetimeComponent,
  TextareaComponent,
  CheckboxComponent,
  RadiosComponent,
  SelectsComponent,
  PasswordComponent,
  ToggleComponent,
  FormsLandingComponent,
  FormsDashboardComponent
];

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule, UtilsModule, FeruiModule, HighlightModule],
  declarations: [FUI_DEMO_FROMS_DIRECTIVES],
  exports: [FUI_DEMO_FROMS_DIRECTIVES, RouterModule]
})
export class FormsDemoModule {}
