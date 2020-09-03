import { Injector, TemplateRef, Type, ViewContainerRef } from '@angular/core';

import { FuiModalStandardWindowComponent } from '../../components/modals-standard-window.component';
import {
  FUI_MODAL_CTRL_TOKEN,
  FUI_MODAL_WINDOW_CTRL_TOKEN,
  FuiModalButtonInterface,
  FuiModalCtrl,
  FuiModalStandardWindowCtrl,
  FuiModalStandardWindowScreen,
  FuiModalWindowConfiguration,
  ModalWindowInteractionEnum
} from '../../interfaces/modals-interfaces';
import { FuiModalUtils } from '../../utils/modal-utils';

import { AbstractFuiModalWindowCtrlImpl } from './fui-modal-abstract-window-ctrl';

/**
 * Standard window controller class.
 */
export class FuiModalStandardWindowCtrlImpl<I = any, CL = any, S = any, C = any>
  extends AbstractFuiModalWindowCtrlImpl<FuiModalStandardWindowScreen<I, CL, S, C>, I, CL>
  implements FuiModalStandardWindowCtrl<I, CL, S, C> {
  title: string;
  subtitle: string;
  titleTemplate: TemplateRef<any>;
  submitButton: FuiModalButtonInterface;
  cancelButton: FuiModalButtonInterface;
  withSubmitBtn: boolean;
  withCancelBtn: boolean;
  component: Type<FuiModalStandardWindowScreen>;

  protected componentScreenInstance: FuiModalStandardWindowScreen<I, CL, S, C>;

  constructor(protected modalCtrl: FuiModalCtrl, public windowConfiguration: FuiModalWindowConfiguration) {
    super(modalCtrl, windowConfiguration);
    this.component = this.windowConfiguration.component;
    // Standard config.
    this.title = this.windowConfiguration.title || null;
    this.subtitle = this.windowConfiguration.subtitle || null;
    this.titleTemplate = this.windowConfiguration.titleTemplate || null;

    // Just log a warning in case of developer's mistake.
    if ((this.title || this.subtitle) && this.titleTemplate) {
      console.warn(
        `[FerUI Modals] You have used either 'title' or/and 'subtitle' along with 'titleTemplate', only 'titleTemplate' will be used, the rest will be ignored.`
      );
    }

    this.withSubmitBtn = this.windowConfiguration.withSubmitBtn !== false; // True by default
    this.withCancelBtn = this.windowConfiguration.withCancelBtn === true; // False by default
    this.submitButton = this.windowConfiguration.submitButton || {
      label: 'Submit'
    };
    this.cancelButton = this.windowConfiguration.cancelButton || {
      label: 'Cancel'
    };
  }

  /**
   * $submit lifecycle. This function is called each time the user click on submit button.
   * We will also call the screen $onSubmit function if any.
   * @param event
   */
  $submit(event: MouseEvent): Promise<S | CL> {
    this.isSubmitting = true;
    if (this.componentScreenInstance.$onSubmit) {
      try {
        return this.componentScreenInstance
          .$onSubmit(event)
          .then(args => {
            this.modalCtrl.interactionSubjects[this.id].next({
              type: ModalWindowInteractionEnum.SUBMIT,
              args: args
            });
            this.modalCtrl.interactionSubjects[this.id].complete();
            this.isSubmitting = false;
            this.removeWindow(false);
            return args;
          })
          .catch(error => {
            this.isSubmitting = false;
            this.error = error;
            return error;
          });
      } catch (e) {
        this.isSubmitting = false;
        this.error = e;
        return Promise.reject(e);
      }
    }
    this.isSubmitting = false;
    return this.$close(event, true);
  }

  /**
   * $cancel lifecycle. This function is called each time the user click on cancel button.
   * We will also call the screen $onCancel function if any.
   * @param event
   */
  $cancel(event: MouseEvent): Promise<C | CL> {
    this.isCanceling = true;
    if (this.componentScreenInstance.$onCancel) {
      try {
        return this.componentScreenInstance
          .$onCancel(event)
          .then(args => {
            this.modalCtrl.interactionSubjects[this.id].next({
              type: ModalWindowInteractionEnum.CANCEL,
              args: args
            });
            this.modalCtrl.interactionSubjects[this.id].complete();
            this.isCanceling = false;
            this.removeWindow(false);
            return args;
          })
          .catch(error => {
            this.isCanceling = false;
            this.error = error;
            return error;
          });
      } catch (e) {
        this.isCanceling = false;
        this.error = e;
        return Promise.reject(e);
      }
    }
    this.isCanceling = false;
    return this.$close(event, true);
  }

  /**
   * Render the corresponding window within the specified viewContainerRef.
   * @param viewContainerRef
   */
  render(viewContainerRef: ViewContainerRef): void {
    super.render(viewContainerRef);
    // We create the FuiModalStandardWindowComponent component dynamically and we add it to the desired viewContainerRef.
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(FuiModalStandardWindowComponent);
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
