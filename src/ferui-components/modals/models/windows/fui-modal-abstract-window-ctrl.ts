import {
  FuiModalCtrl,
  FuiModalWindowConfiguration,
  FuiModalWindowCtrl,
  FuiModalWindowParam,
  FuiModalWindowResolve,
  FuiModalWindowResolved,
  FuiModalWindowScreen,
  FuiModalWindowTemplateContext,
  FuiModalWindowComponentInterface,
  ModalWindowInteractionEnum
} from '../../interfaces/modals-interfaces';
import { ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injector, ViewContainerRef } from '@angular/core';
import { FeruiUtils } from '../../../utils/ferui-utils';

/**
 * Abstract class for windows.
 */
export abstract class AbstractFuiModalWindowCtrlImpl<S extends FuiModalWindowScreen<I, CL>, I = any, CL = any>
  implements FuiModalWindowCtrl<S, I, CL> {
  cssClass: string;
  id: string;
  width: number;
  closeButton: boolean;
  windowComponentRef: ComponentRef<FuiModalWindowComponentInterface<S>>;
  windowEmbedViewRef: EmbeddedViewRef<FuiModalWindowTemplateContext>;
  error: string | Error;
  hasChildWindowOpen: boolean = false;
  params: FuiModalWindowParam;
  resolves: FuiModalWindowResolved;
  childWindowLeftValue: { [key: string]: string };
  closeConfirm: boolean;

  // Buttons states
  isSubmitting: boolean = false;
  isCanceling: boolean = false;
  isGoingNext: boolean = false;
  isGoingBack: boolean = false;

  // Default left value for the child windows
  defaultLeftValue: number = 300;

  protected injector: Injector;
  protected componentFactoryResolver: ComponentFactoryResolver;
  protected viewContainerRef: ViewContainerRef;
  protected componentScreenInstance: S;

  protected constructor(protected modalCtrl: FuiModalCtrl, public windowConfiguration: FuiModalWindowConfiguration) {
    this.params = modalCtrl.params;
    this.resolves = modalCtrl.resolves;
    this.injector = modalCtrl.injector;
    this.componentFactoryResolver = modalCtrl.componentFactoryResolver;
    this.closeConfirm = !!windowConfiguration.closeConfirm;

    ///////////// Set default values /////////////
    this.id = this.windowConfiguration.id || FeruiUtils.generateUniqueId('fuiWindow', '');
    this.cssClass = this.windowConfiguration.cssClass || null;
    this.width = this.windowConfiguration.width || null;
    if (this.width) {
      this.defaultLeftValue = this.width / 2;
    }
    this.childWindowLeftValue = this.getBestChildWindowLeftValue(this.defaultLeftValue);
    // By default we want the close button to be visible. To hide it we must set the closeButton to false explicitly.
    this.closeButton = this.windowConfiguration.closeButton !== false;
  }

  /**
   * Window lifecycle. This function is called once the parent container (FuiModalWindowComponentInterface) is initialized.
   * We will called the screen (FuiModalWindowScreen) $onInit function.
   * @param args
   */
  $init(args?: any): Promise<I> {
    this.componentScreenInstance = this.windowComponentRef.instance.componentRef.instance;
    if (this.componentScreenInstance && this.componentScreenInstance.$onInit) {
      return this.componentScreenInstance.$onInit(args);
    }
    return Promise.resolve(null);
  }

  /**
   * Window lifecycle. This function is called when the close button is clicked.
   * It will called the screen (FuiModalWindowScreen) $onClose function.
   * @param event
   * @param emitEvent
   */
  $close(event?: MouseEvent | KeyboardEvent, emitEvent: boolean = true): Promise<CL> {
    return new Promise<CL>((resolve, reject) => {
      if (this.componentScreenInstance && this.componentScreenInstance.$onClose) {
        this.componentScreenInstance
          .$onClose(event)
          .then(args => {
            this.removeWindow(emitEvent, args);
            resolve(args);
          })
          .catch(reject);
      } else {
        this.removeWindow(emitEvent);
        resolve();
      }
    });
  }

  /**
   * Open a child window.
   * @param windowId The window ID that you want to open.
   * @param windowPromises Any possible Promises you want to be resolved before rendering the window.
   * @param params Any extra params that you want to pass to the child window.
   */
  openChildWindow<T>(windowId: string, windowPromises?: FuiModalWindowResolve, params?: FuiModalWindowParam): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const window: FuiModalWindowCtrl<FuiModalWindowScreen> = this.modalCtrl.getWindowById(windowId);
      if (window) {
        this.hasChildWindowOpen = true;
        // By default, the loading and error modals are 600px width so we need to override the child window left value to 300px.
        this.childWindowLeftValue = this.getBestChildWindowLeftValue(300);
        this.renderLoading(this.windowComponentRef.instance.childWindowViewContainerRef);
        this.modalCtrl
          .resolvePromises(windowPromises, window)
          .then(() => {
            this.childWindowLeftValue = this.getBestChildWindowLeftValue(window.defaultLeftValue);
            window.params = { ...params, ...this.modalCtrl.params }; // We merge the new params with modal params.
            window.render(this.windowComponentRef.instance.childWindowViewContainerRef);
            this.handleWindowInteractions<T>(window).then(resolve).catch(reject);
          })
          .catch(e => {
            window.renderError(this.windowComponentRef.instance.childWindowViewContainerRef, e);
            this.handleWindowInteractions<T>(window).then(resolve).catch(reject);
          });
      } else {
        reject(`[FerUI Modals Error] No child window found for id : ${windowId}`);
      }
    });
  }

  /**
   * Force to render the loading window within the specified viewContainerRef.
   * @param viewContainerRef
   */
  renderLoading(viewContainerRef: ViewContainerRef): void {
    this.error = undefined;
    this.viewContainerRef = viewContainerRef;
    this.viewContainerRef.clear();
    this.windowEmbedViewRef = this.viewContainerRef.createEmbeddedView<FuiModalWindowTemplateContext>(
      this.modalCtrl.modalWindowLoadingTplt,
      {
        modalCtrl: this.modalCtrl,
        windowCtrl: this
      }
    );
  }

  /**
   * Force to render the error window within the specified viewContainerRef.
   * @param viewContainerRef
   * @param error
   */
  renderError(viewContainerRef: ViewContainerRef, error: string | Error): void {
    this.error = error;
    this.viewContainerRef = viewContainerRef;
    this.viewContainerRef.clear();
    this.windowEmbedViewRef = this.viewContainerRef.createEmbeddedView<FuiModalWindowTemplateContext>(
      this.modalCtrl.modalWindowErrorTplt,
      {
        modalCtrl: this.modalCtrl,
        windowCtrl: this
      }
    );
  }

  /**
   * Render the corresponding window within the specified viewContainerRef.
   * @param viewContainerRef
   */
  render(viewContainerRef: ViewContainerRef): void {
    this.error = undefined;
    this.viewContainerRef = viewContainerRef;
  }

  /**
   * Reset the window state.
   */
  reset(): void {
    this.hasChildWindowOpen = false;
    this.error = undefined;
  }

  /**
   * Handle window interactions and return the promise containing the args coming
   * from a user interaction (it can be close, cancel or submit).
   * @param window
   */
  protected handleWindowInteractions<T>(window: FuiModalWindowCtrl<FuiModalWindowScreen>): Promise<T> {
    return this.modalCtrl
      .onWindowInteraction<T>(window.id)
      .then(interaction => {
        this.hasChildWindowOpen = false;
        return interaction ? interaction.args : null;
      })
      .catch(e => {
        window.renderError(this.windowComponentRef.instance.childWindowViewContainerRef, e);
        return e;
      });
  }

  /**
   * Remove the current window.
   * @param emitEvent Whether or not we want to emit the close events.
   * @param args Any args coming from the close interaction.
   */
  protected removeWindow(emitEvent: boolean = true, args?: any): void {
    if (this.windowComponentRef) {
      this.windowComponentRef.destroy();
      this.windowComponentRef = undefined;
    } else if (this.windowEmbedViewRef) {
      this.windowEmbedViewRef.destroy();
      this.windowEmbedViewRef = undefined;
    }
    if (emitEvent) {
      this.emitCloseEvent(args);
    }
    // Reset all values
    this.reset();
  }

  /**
   * Emit the close interaction event.
   * @param args Any args coming from the close interaction.
   */
  protected emitCloseEvent(args: any): void {
    if (this.modalCtrl.interactionSubjects[this.id]) {
      this.modalCtrl.interactionSubjects[this.id].next({
        type: ModalWindowInteractionEnum.CLOSE,
        args: args
      });
      this.modalCtrl.interactionSubjects[this.id].complete();
    }
  }

  /**
   * Calculate the best child window left value depending on the window width.
   * @param leftValue
   */
  protected getBestChildWindowLeftValue(leftValue?: number): { [key: string]: string } {
    return { left: `calc(50% + ${!FeruiUtils.isNullOrUndefined(leftValue) ? leftValue : this.defaultLeftValue}px * -1)` };
  }
}
