import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgDropdownPanelComponent } from './ng-dropdown-panel.component';
import { NgOptionHighlightDirective } from './ng-option-highlight.directive';
import { NgOptionComponent } from './ng-option.component';
import { NgSelectComponent, SELECTION_MODEL_FACTORY } from './ng-select.component';
import {
  NgFooterTemplateDirective,
  NgHeaderTemplateDirective,
  NgLabelTemplateDirective,
  NgLoadingSpinnerTemplateDirective,
  NgLoadingTextTemplateDirective,
  NgMultiLabelTemplateDirective,
  NgNotFoundTemplateDirective,
  NgOptgroupTemplateDirective,
  NgOptionTemplateDirective,
  NgTagTemplateDirective,
  NgTypeToSearchTemplateDirective
} from './ng-templates.directive';
import { DefaultSelectionModelFactory } from './selection-model';

@NgModule({
  declarations: [
    NgDropdownPanelComponent,
    NgOptionComponent,
    NgSelectComponent,
    NgOptionHighlightDirective,
    NgOptgroupTemplateDirective,
    NgOptionTemplateDirective,
    NgLabelTemplateDirective,
    NgMultiLabelTemplateDirective,
    NgHeaderTemplateDirective,
    NgFooterTemplateDirective,
    NgNotFoundTemplateDirective,
    NgTypeToSearchTemplateDirective,
    NgLoadingTextTemplateDirective,
    NgTagTemplateDirective,
    NgLoadingSpinnerTemplateDirective
  ],
  imports: [CommonModule],
  exports: [
    NgSelectComponent,
    NgOptionComponent,
    NgOptionHighlightDirective,
    NgOptgroupTemplateDirective,
    NgOptionTemplateDirective,
    NgLabelTemplateDirective,
    NgMultiLabelTemplateDirective,
    NgHeaderTemplateDirective,
    NgFooterTemplateDirective,
    NgNotFoundTemplateDirective,
    NgTypeToSearchTemplateDirective,
    NgLoadingTextTemplateDirective,
    NgTagTemplateDirective,
    NgLoadingSpinnerTemplateDirective
  ],
  providers: [{ provide: SELECTION_MODEL_FACTORY, useValue: DefaultSelectionModelFactory }]
})
export class NgSelectModule {}
