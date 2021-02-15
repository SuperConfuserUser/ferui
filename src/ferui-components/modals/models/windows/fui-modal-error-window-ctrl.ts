import { Injector, Type, ViewContainerRef } from '@angular/core';

import { FuiModalErrorWindowComponent } from '../../components/modals-error-window.component';
import {
  FUI_MODAL_CTRL_TOKEN,
  FUI_MODAL_WINDOW_CTRL_TOKEN,
  FuiModalCtrl,
  FuiModalErrorWindowCtrl,
  FuiModalErrorWindowScreen,
  FuiModalWindowConfiguration
} from '../../interfaces/modals-interfaces';

import { AbstractFuiModalWindowCtrlImpl } from './fui-modal-abstract-window-ctrl';

/**
 * Error window controller class.
 */
export class FuiModalErrorWindowCtrlImpl<I = any, CL = any>
  extends AbstractFuiModalWindowCtrlImpl<FuiModalErrorWindowScreen<I, CL>, I, CL>
  implements FuiModalErrorWindowCtrl<I, CL> {
  component: Type<FuiModalErrorWindowScreen> | null;

  protected componentScreenInstance: FuiModalErrorWindowScreen<I, CL>;

  constructor(protected modalCtrl: FuiModalCtrl, public windowConfiguration: FuiModalWindowConfiguration) {
    super(modalCtrl, windowConfiguration);
    this.component = windowConfiguration.component || null;
  }

  /**
   * Render the corresponding window within the specified viewContainerRef.
   * @param viewContainerRef
   */
  render(viewContainerRef: ViewContainerRef): void {
    super.render(viewContainerRef);
    if (this.component === null) {
      this.error = `There is no screen instance set for the modal. <br />
You must provide one screen (component) for the modal. <br />
In case of wizard, you must provide at least one step to the modal configuration object.`;
    }
    // We create the FuiModalErrorWindowComponent component dynamically and we add it to the desired viewContainerRef.
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(FuiModalErrorWindowComponent);
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
   * There is no way to render another error within an error window.
   * This method will never be called, it is there only for inheritance.
   * @param viewContainerRef
   * @param error
   */
  renderError(viewContainerRef: ViewContainerRef, error: string | Error): void {}
}
