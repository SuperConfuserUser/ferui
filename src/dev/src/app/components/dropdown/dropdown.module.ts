import { HighlightModule } from 'ngx-highlightjs';

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FeruiModule } from '@ferui/components';

import { UtilsModule } from '../../utils/utils.module';

import { DropdownDemoComponent } from './dropdown.demo';
import { DropdownExampleComponent } from './pages/dropdown-example';

const FUI_DEMO_COMPONENTS_DIRECTIVES: Type<any>[] = [DropdownDemoComponent, DropdownExampleComponent];

@NgModule({
  imports: [CommonModule, FormsModule, UtilsModule, FeruiModule, RouterModule, HighlightModule],
  declarations: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  exports: [FUI_DEMO_COMPONENTS_DIRECTIVES, RouterModule]
})
export class DropdownDemoModule {}
