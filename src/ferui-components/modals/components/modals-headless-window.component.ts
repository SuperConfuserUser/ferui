import { Component, Injector, OnInit } from '@angular/core';

import {
  FUI_MODAL_CTRL_TOKEN,
  FUI_MODAL_WINDOW_CTRL_TOKEN,
  FuiModalHeadlessWindowCtrl,
  FuiModalHeadlessWindowScreen
} from '../interfaces/modals-interfaces';
import { FUI_MODAL_CHILD_WINDOW_TPLT, FUI_MODAL_CLOSE_TPLT, FUI_MODAL_WINDOW_ERROR_MSG } from '../modals-window-templates';

import { FuiModalAbstractWindowComponent } from './modals-abstract-window.component';

/**
 * Modal window component class for Headless type window.
 */
@Component({
  template: `<div
    class="fui-modal-container fui-modal-headless-window"
    [class.fui-modal-has-child-window-open]="windowCtrl.hasChildWindowOpen"
    [style.width.px]="windowCtrl.width"
    [ngClass]="windowCtrl.cssClass"
  >
    ${FUI_MODAL_CLOSE_TPLT}
    <div class="fui-modal-body">
      ${FUI_MODAL_WINDOW_ERROR_MSG}
      <ng-template #componentHost></ng-template>
    </div>
    ${FUI_MODAL_CHILD_WINDOW_TPLT}
  </div>`
})
export class FuiModalHeadlessWindowComponent
  extends FuiModalAbstractWindowComponent<FuiModalHeadlessWindowCtrl, FuiModalHeadlessWindowScreen>
  implements OnInit {
  ngOnInit(): void {
    if (!this.windowCtrl.component || !this.viewContainerRef) {
      return;
    }
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.windowCtrl.component);
    this.viewContainerRef.clear();
    this.componentRef = this.viewContainerRef.createComponent(
      componentFactory,
      null,
      Injector.create({
        providers: [
          {
            provide: FUI_MODAL_CTRL_TOKEN,
            useFactory: () => this.modalCtrl,
            deps: []
          },
          {
            provide: FUI_MODAL_WINDOW_CTRL_TOKEN,
            useFactory: () => this.windowCtrl,
            deps: []
          }
        ],
        parent: this.injector
      })
    );
    this.windowCtrl.$init();
  }
}
