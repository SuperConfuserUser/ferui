import { Component } from '@angular/core';

import { FuiModalWizardWindowScreen, RowNode } from '@ferui/components';

import { WizardSelectedNodes } from '../modals-interfaces';

@Component({
  template: `
    <h4>Modal wizard step 2</h4>
    <p>Here is the list of all selected rows:</p>
    <ul>
      <li *ngFor="let rowNode of selectedItems">{{ rowNode.data.username }}</li>
    </ul>
  `
})
export class DatagridModalWizardStep2Component implements FuiModalWizardWindowScreen {
  selectedItems: RowNode[];

  constructor() {}

  $onInit(args?: WizardSelectedNodes): Promise<unknown> {
    if (args && args.selectedNodes && args.selectedNodes.length > 0) {
      this.selectedItems = args.selectedNodes;
    } else {
      this.selectedItems = [];
    }
    return Promise.resolve();
  }

  $onBack(): Promise<WizardSelectedNodes> {
    return Promise.resolve({ selectedNodes: this.selectedItems });
  }

  $onSubmit(): Promise<WizardSelectedNodes> {
    return Promise.resolve({ selectedNodes: this.selectedItems });
  }
}
