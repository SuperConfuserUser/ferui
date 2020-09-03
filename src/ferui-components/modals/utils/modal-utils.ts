import { ComponentFactoryResolver, Injector, ViewContainerRef } from '@angular/core';

import { FuiModalErrorWindowComponent } from '../components/modals-error-window.component';
import { FuiModalErrorScreenComponent } from '../components/screens/modal-error-screen.component';
import {
  FUI_MODAL_CTRL_TOKEN,
  FUI_MODAL_WINDOW_CTRL_TOKEN,
  FuiModalCtrl,
  FuiModalErrorWindowCtrl,
  FuiModalErrorWindowScreen,
  FuiModalWindowConfiguration,
  FuiModalWindowEnum
} from '../interfaces/modals-interfaces';
import { FuiModalErrorWindowCtrlImpl } from '../models/windows/fui-modal-error-window-ctrl';

/**
 * FerUI modals utils class
 */
export class FuiModalUtils {
  protected constructor() {}

  /**
   * Get the window type from configuration object.
   * @param windowConfig The window configuration object.
   * @param error Whether or not we want to get the error component. Default to false.
   */
  static getWindowTypeFromConfig(windowConfig: FuiModalWindowConfiguration, error: boolean = false): FuiModalWindowEnum {
    if (error) {
      return FuiModalWindowEnum.ERROR;
    } else if (windowConfig.wizardSteps) {
      return FuiModalWindowEnum.WIZARD;
    } else if (
      !!windowConfig.title ||
      !!windowConfig.subtitle ||
      !!windowConfig.titleTemplate ||
      !!windowConfig.submitButton ||
      !!windowConfig.cancelButton ||
      !!windowConfig.withSubmitBtn ||
      !!windowConfig.withCancelBtn
    ) {
      return FuiModalWindowEnum.STANDARD;
    } else {
      return FuiModalWindowEnum.HEADLESS;
    }
  }

  /**
   * Render an error component from scratch and render it within the current modal instead of the desired one in case of an error.
   * @param error
   * @param injector
   * @param modalCtrl
   * @param windowConfiguration
   * @param viewContainerRef
   * @param componentFactoryResolver
   * @param closeFn
   */
  static renderErrorWindow<CL>(
    error: string | Error,
    injector: Injector,
    modalCtrl: FuiModalCtrl,
    windowConfiguration: FuiModalWindowConfiguration,
    viewContainerRef: ViewContainerRef,
    componentFactoryResolver: ComponentFactoryResolver,
    closeFn: (event?: MouseEvent | KeyboardEvent, emitEvent?: boolean) => Promise<CL>
  ): void {
    const errorCtrl: FuiModalErrorWindowCtrl<FuiModalErrorWindowScreen> = new FuiModalErrorWindowCtrlImpl(
      modalCtrl,
      windowConfiguration
    );
    errorCtrl.error = error;
    errorCtrl.component = FuiModalErrorScreenComponent;
    errorCtrl.viewContainerRef = viewContainerRef;
    // We create the FuiModalErrorWindowComponent component dynamically and we add it to the desired viewContainerRef.
    const componentFactory = componentFactoryResolver.resolveComponentFactory(FuiModalErrorWindowComponent);
    errorCtrl.viewContainerRef.clear();
    // We save the errorCtrl original $close() function.
    const errorCtrlCloseFn = errorCtrl.$close.bind(errorCtrl);
    errorCtrl.$close = (event?: MouseEvent | KeyboardEvent, emitEvent?: boolean) => {
      // We combine the two close functions into one. We want to close the errorCtrl window + the current window where the error
      // occurred.
      return errorCtrlCloseFn(event, false).then(() => {
        return closeFn(event, emitEvent);
      });
    };
    errorCtrl.windowComponentRef = errorCtrl.viewContainerRef.createComponent(
      componentFactory,
      null,
      Injector.create({
        providers: [
          {
            provide: FUI_MODAL_WINDOW_CTRL_TOKEN,
            useFactory: () => errorCtrl,
            deps: []
          },
          {
            provide: FUI_MODAL_CTRL_TOKEN,
            useFactory: () => modalCtrl,
            deps: []
          }
        ],
        parent: injector
      })
    );
  }
}
