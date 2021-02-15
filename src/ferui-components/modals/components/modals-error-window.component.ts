import { Component, Injector, OnInit } from '@angular/core';

import {
  FUI_MODAL_CTRL_TOKEN,
  FUI_MODAL_WINDOW_CTRL_TOKEN,
  FuiModalErrorWindowCtrl,
  FuiModalErrorWindowScreen
} from '../interfaces/modals-interfaces';

import { FuiModalAbstractWindowComponent } from './modals-abstract-window.component';

/**
 * Modal window component class for Error type window.
 */
@Component({
  template: ` <div
    class="fui-modal-container fui-modal-headless-window"
    [style.width.px]="windowCtrl.width"
    [ngClass]="windowCtrl.cssClass"
  >
    <button class="fui-modal-close-btn" (click)="close($event)">
      <clr-icon class="fui-modal-close-icon" shape="fui-close"></clr-icon>
    </button>
    <div class="fui-modal-body">
      <fui-alert *ngIf="!windowCtrl.component && windowCtrl.error" class="mb-0" [alertType]="'alert-danger'" [closable]="false">
        <clr-icon fuiAlertsIcon shape="fui-error"></clr-icon>
        <span [innerHTML]="windowCtrl.error"></span>
      </fui-alert>
      <ng-template #componentHost></ng-template>
    </div>
  </div>`
})
export class FuiModalErrorWindowComponent
  extends FuiModalAbstractWindowComponent<FuiModalErrorWindowCtrl, FuiModalErrorWindowScreen>
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
