import { Component } from '@angular/core';

@Component({
  template: `<ng-content></ng-content>`,
  selector: 'fui-datagrid-footer',
  host: {
    '[class.fui-datagrid-footer]': 'true'
  }
})
export class FuiDatagridFooterComponent {}
