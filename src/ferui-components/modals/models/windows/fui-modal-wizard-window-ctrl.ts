import { Injector, TemplateRef, ViewContainerRef } from '@angular/core';

import { FeruiUtils } from '../../../utils/ferui-utils';
import { FuiModalWizardWindowComponent } from '../../components/modals-wizard-window.component';
import {
  FUI_MODAL_CTRL_TOKEN,
  FUI_MODAL_WINDOW_CTRL_TOKEN,
  FuiModalButtonInterface,
  FuiModalCtrl,
  FuiModalWindowConfiguration,
  FuiModalWizardWindowCtrl,
  FuiModalWizardWindowScreen,
  FuiWizardStepConfiguration,
  ModalWindowInteractionEnum
} from '../../interfaces/modals-interfaces';
import { FuiModalUtils } from '../../utils/modal-utils';

import { AbstractFuiModalWindowCtrlImpl } from './fui-modal-abstract-window-ctrl';

/**
 * Wizard window controller class.
 */
export class FuiModalWizardWindowCtrlImpl<I = any, CL = any, N = any, B = any, S = any, C = any>
  extends AbstractFuiModalWindowCtrlImpl<FuiModalWizardWindowScreen<I, CL, N, B, S, C>, I, CL>
  implements FuiModalWizardWindowCtrl<I, CL, N, B, S, C> {
  title: string;
  subtitle: string;
  titleTemplate: TemplateRef<any>;
  submitButton: FuiModalButtonInterface;
  cancelButton: FuiModalButtonInterface;
  backButton: FuiModalButtonInterface;
  nextButton: FuiModalButtonInterface;
  withSubmitBtn: boolean;
  withCancelBtn: boolean;
  withNextBtn: boolean;
  withBackBtn: boolean;
  wizardSteps: FuiWizardStepConfiguration[];
  currentStepIndex: number = 1;
  defaultLeftValue = 385;

  protected componentScreenInstance: FuiModalWizardWindowScreen<I, CL, N, B, S, C>;

  constructor(protected modalCtrl: FuiModalCtrl, public windowConfiguration: FuiModalWindowConfiguration) {
    super(modalCtrl, windowConfiguration);
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
    // Wizard config.
    this.wizardSteps = this.windowConfiguration.wizardSteps || [];
    this.nextButton = this.windowConfiguration.nextButton || {
      label: 'Next'
    };
    this.backButton = this.windowConfiguration.backButton || {
      label: 'Back'
    };
    this.handleButtons();
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
   * $back lifecycle. This function is called each time the user click on back button.
   * We will also call the screen $onBack function if any.
   * @param event The mouse event when we click on the back button or a previous step.
   * @param stepIndex (Optional) the step index we want to be back to
   */
  $back(event: MouseEvent, stepIndex?: number): Promise<B> {
    if (this.componentScreenInstance.$onBack) {
      this.isGoingBack = true;
      try {
        return this.componentScreenInstance
          .$onBack(event)
          .then(args => {
            return this.goBack(args, stepIndex).then(() => {
              this.isGoingBack = false;
              return args;
            });
          })
          .catch(error => {
            this.isGoingBack = false;
            this.error = error;
            return error;
          });
      } catch (e) {
        this.isGoingBack = false;
        this.error = e;
        return Promise.reject(e);
      }
    }
    return this.goBack(undefined, stepIndex);
  }

  /**
   * $next lifecycle. This function is called each time the user click on next button.
   * We will also call the screen $onNext function if any.
   * @param event
   */
  $next(event: MouseEvent): Promise<N> {
    if (this.componentScreenInstance.$onNext) {
      this.isGoingNext = true;
      try {
        return this.componentScreenInstance
          .$onNext(event)
          .then(args => {
            return this.goNext(args).then(() => {
              this.isGoingNext = false;
              return args;
            });
          })
          .catch(error => {
            this.isGoingNext = false;
            this.error = error;
            return error;
          });
      } catch (e) {
        this.isGoingNext = false;
        this.error = e;
        return Promise.reject(e);
      }
    }
    return this.goNext();
  }

  /**
   * Render the corresponding window within the specified viewContainerRef.
   * @param viewContainerRef
   */
  render(viewContainerRef: ViewContainerRef): void {
    this.error = undefined;
    this.viewContainerRef = viewContainerRef;
    // We create the FuiModalWizardWindowComponent component dynamically and we add it to the desired viewContainerRef.
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(FuiModalWizardWindowComponent);
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

  /**
   * Handle buttons states. Depending on wich step the user is at, we hide/display/replace the buttons.
   */
  protected handleButtons(): void {
    this.withSubmitBtn = this.windowConfiguration.withSubmitBtn !== false && this.currentStepIndex === this.wizardSteps.length;
    this.withNextBtn = this.windowConfiguration.withNextBtn !== false && this.currentStepIndex < this.wizardSteps.length;
    this.withBackBtn = this.currentStepIndex > 1;
  }

  /**
   * Go to next step and send the corresponding interaction event.
   * @param args
   */
  protected goNext(args?: N): Promise<N> {
    this.currentStepIndex = this.currentStepIndex + 1;
    this.handleButtons();
    this.modalCtrl.interactionSubjects[this.id].next({
      type: ModalWindowInteractionEnum.NEXT,
      args: args
    });
    return Promise.resolve(args);
  }

  /**
   * Go to previous step and send the corresponding interaction event.
   * @param args
   * @param stepIndex (Optional) the step index we want to be back to
   */
  protected goBack(args?: B, stepIndex?: number): Promise<B> {
    this.currentStepIndex = !FeruiUtils.isNullOrUndefined(stepIndex) ? stepIndex + 1 : this.currentStepIndex - 1;
    this.handleButtons();
    this.modalCtrl.interactionSubjects[this.id].next({
      type: ModalWindowInteractionEnum.BACK,
      args: args
    });
    return Promise.resolve(args);
  }
}
