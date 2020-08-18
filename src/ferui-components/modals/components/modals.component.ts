import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FuiModalWindowTemplateContext } from '../interfaces/modals-interfaces';
import { FUI_MODAL_ERROR_WINDOW_TPLT, FUI_MODAL_LOADING_WINDOW_TPLT } from '../modals-window-templates';
import { FuiModalCtrlImpl } from '../models/modal/fui-modal-ctrl';

/**
 * FuiModalComponent class
 * This class is the anchor for the modal system. It will be generated dynamically and it contain the overlay
 */
@Component({
  template: `
    <ng-template #hostWindowContainer></ng-template>

    <ng-template #modalWindowLoading let-windowConfiguration="windowCtrl.windowConfiguration">
      ${FUI_MODAL_LOADING_WINDOW_TPLT}
    </ng-template>
    <ng-template #modalWindowError let-windowConfiguration="windowCtrl.windowConfiguration" let-windowCtrl="windowCtrl">
      ${FUI_MODAL_ERROR_WINDOW_TPLT}
    </ng-template>
  `,
  host: {
    '[class.fui-modal-anchor]': 'true',
    '[class.fui-modal-open]': 'true'
  }
})
export class FuiModalComponent implements OnInit {
  @ViewChild('hostWindowContainer', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;
  @ViewChild('modalWindowLoading') modalWindowLoadingTplt: TemplateRef<FuiModalWindowTemplateContext>;
  @ViewChild('modalWindowError') modalWindowErrorTplt: TemplateRef<FuiModalWindowTemplateContext>;

  constructor(public modalCtrl: FuiModalCtrlImpl) {}

  ngOnInit() {
    this.modalCtrl.modalWindowErrorTplt = this.modalWindowErrorTplt;
    this.modalCtrl.modalWindowLoadingTplt = this.modalWindowLoadingTplt;
    this.modalCtrl.viewContainerRef = this.viewContainerRef;
    this.modalCtrl.init();
  }
}
