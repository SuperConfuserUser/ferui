import { Component, Injector, OnInit } from '@angular/core';
import { FuiModalAbstractWindowComponent } from './modals-abstract-window.component';
import {
  FUI_MODAL_CHILD_WINDOW_TPLT,
  FUI_MODAL_CLOSE_TPLT,
  FUI_MODAL_WINDOW_ERROR_MSG,
  FUI_MODAL_WINDOW_STANDARD_FOOTER_TPLT,
  FUI_MODAL_WINDOW_TITLE_TPLT
} from '../modals-window-templates';
import {
  FuiModalStandardWindowCtrl,
  FuiModalStandardWindowScreen,
  FUI_MODAL_CTRL_TOKEN,
  FUI_MODAL_WINDOW_CTRL_TOKEN
} from '../interfaces/modals-interfaces';

/**
 * Modal window component class for Standard type window.
 */
@Component({
  template: `<div
    class="fui-modal-container fui-modal-standard-window"
    [class.fui-modal-has-child-window-open]="windowCtrl.hasChildWindowOpen"
    [style.width.px]="windowCtrl.width"
    [ngClass]="windowCtrl.cssClass"
  >
    <div class="fui-modal-header" *ngIf="windowCtrl.title || windowCtrl.subtitle || windowCtrl.titleTemplate">
      <div class="fui-modal-header-title-wrapper">
        ${FUI_MODAL_WINDOW_TITLE_TPLT}
      </div>
      <div class="fui-modal-header-close">
        ${FUI_MODAL_CLOSE_TPLT}
      </div>
    </div>
    <div class="fui-modal-body">
      ${FUI_MODAL_WINDOW_ERROR_MSG}
      <ng-template #componentHost></ng-template>
    </div>
    <div class="fui-modal-footer" *ngIf="windowCtrl.withSubmitBtn || windowCtrl.withCancelBtn">
      ${FUI_MODAL_WINDOW_STANDARD_FOOTER_TPLT}
    </div>
    ${FUI_MODAL_CHILD_WINDOW_TPLT}
  </div>`
})
export class FuiModalStandardWindowComponent
  extends FuiModalAbstractWindowComponent<FuiModalStandardWindowCtrl, FuiModalStandardWindowScreen>
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
