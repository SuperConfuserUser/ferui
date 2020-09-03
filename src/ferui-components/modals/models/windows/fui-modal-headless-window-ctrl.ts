import { Injector, Type, ViewContainerRef } from '@angular/core';

import { FuiModalHeadlessWindowComponent } from '../../components/modals-headless-window.component';
import {
  FUI_MODAL_CTRL_TOKEN,
  FUI_MODAL_WINDOW_CTRL_TOKEN,
  FuiModalCtrl,
  FuiModalHeadlessWindowCtrl,
  FuiModalHeadlessWindowScreen,
  FuiModalWindowConfiguration
} from '../../interfaces/modals-interfaces';
import { FuiModalUtils } from '../../utils/modal-utils';

import { AbstractFuiModalWindowCtrlImpl } from './fui-modal-abstract-window-ctrl';

/**
 * Headless window controller class.
 */
export class FuiModalHeadlessWindowCtrlImpl<I = any, CL = any>
  extends AbstractFuiModalWindowCtrlImpl<FuiModalHeadlessWindowScreen<I, CL>, I, CL>
  implements FuiModalHeadlessWindowCtrl<I, CL> {
  component: Type<FuiModalHeadlessWindowScreen>;

  protected componentScreenInstance: FuiModalHeadlessWindowScreen<I, CL>;

  constructor(protected modalCtrl: FuiModalCtrl, public windowConfiguration: FuiModalWindowConfiguration) {
    super(modalCtrl, windowConfiguration);
    this.component = this.windowConfiguration.component;
  }

  /**
   * Render the corresponding window within the specified viewContainerRef.
   * @param viewContainerRef
   */
  render(viewContainerRef: ViewContainerRef): void {
    super.render(viewContainerRef);
    // We create the FuiModalHeadlessWindowComponent component dynamically and we add it to the desired viewContainerRef.
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(FuiModalHeadlessWindowComponent);
    this.viewContainerRef.clear();
    this.windowComponentRef = this.viewContainerRef.createComponent(
      componentFactory,
      null,
      Injector.create({
        providers: [
          {
            provide: FUI_MODAL_WINDOW_CTRL_TOKEN,
            useFactory: () => this,
            deps: []
          },
          {
            provide: FUI_MODAL_CTRL_TOKEN,
            useFactory: () => this.modalCtrl,
            deps: []
          }
        ],
        parent: this.injector
      })
    );
  }

  /**
   * Force to render the error window within the specified viewContainerRef.
   * @param viewContainerRef
   * @param error
   */
  renderError(viewContainerRef: ViewContainerRef, error: string | Error): void {
    FuiModalUtils.renderErrorWindow<CL>(
      error,
      this.injector,
      this.modalCtrl,
      this.windowConfiguration,
      viewContainerRef,
      this.componentFactoryResolver,
      this.$close.bind(this)
    );
  }
}
