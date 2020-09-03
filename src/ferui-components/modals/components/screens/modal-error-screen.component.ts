import { Component, Inject } from '@angular/core';

import {
  FUI_MODAL_WINDOW_CTRL_TOKEN,
  FuiModalHeadlessWindowCtrl,
  FuiModalHeadlessWindowScreen
} from '../../interfaces/modals-interfaces';
import { FUI_MODAL_WINDOW_ERROR_MSG } from '../../modals-window-templates';

@Component({
  template: `${FUI_MODAL_WINDOW_ERROR_MSG}`,
  styles: [
    `
      .alert {
        margin-bottom: 0 !important;
      }
    `
  ]
})
export class FuiModalErrorScreenComponent implements FuiModalHeadlessWindowScreen {
  constructor(@Inject(FUI_MODAL_WINDOW_CTRL_TOKEN) public windowCtrl: FuiModalHeadlessWindowCtrl) {}
}
