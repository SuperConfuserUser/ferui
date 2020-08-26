import {
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  InjectionToken,
  Injector,
  TemplateRef,
  Type,
  ViewContainerRef
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

export const FUI_MODAL_WINDOW_CTRL_TOKEN = new InjectionToken('ModalWindowController');
export const FUI_MODAL_CTRL_TOKEN = new InjectionToken('ModalController');

export enum FuiModalWindowEnum {
  STANDARD = 'standard',
  WIZARD = 'wizard',
  HEADLESS = 'headless',
  ERROR = 'error'
}

export interface FuiModalButtonInterface {
  label: string;
  cssClass?: string;
}

export interface FuiModalWindowTemplateContext {
  modalCtrl: FuiModalCtrl;
  windowCtrl: FuiModalWindowCtrl<FuiModalWindowScreen>;
}

export interface FuiWizardStepConfiguration {
  stepId: string;
  label: string;
  component: Type<FuiModalWizardWindowScreen>;
}

export interface FuiModalWindowParam {
  readonly [key: string]: any;
}

export interface FuiModalWindowResolve {
  readonly [key: string]: Promise<any>;
}

export interface FuiModalWindowResolved {
  [key: string]: any;
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

export interface FuiModalWindowConfiguration {
  // Default config
  component?: Type<any>; // can be either FuiModalStandardWindowScreen or FuiModalWizardWindowScreen or FuiModalHeadlessWindowScreen component.
  id?: string; // If not set, a random unique ID will be generated but it is highly recommended to set your own ID specially for child windows.
  title?: string; // If you want to set a title for your window
  subtitle?: string; // If you want to set a sub-title for your window
  titleTemplate?: TemplateRef<any>; // If you want something more complex, like adding an icon or whatever else just provide a titleTemplate.
  // But be careful to ONLY use either `title` + `subtitle` OR `titleTemplate` because `titleTemplate` have the highest priority.
  cssClass?: string; // Extra classes (space separated strings) you want to add to the window (if you want to use a special design for a specific window for instance)
  // Value in px of the window width. This will be a fixed width.
  width?: number; // Default to 600px for Standard and Headless windows and 770px for wizards.
  closeButton?: boolean; // Default to true.
  childWindows?: FuiModalWindowConfiguration[];
  closeConfirm?: boolean; // Whether the window need a confirmation before being closed. Default to false.

  // Standard config
  withSubmitBtn?: boolean; // Default to true.
  withCancelBtn?: boolean; // Default to false.
  submitButton?: FuiModalButtonInterface; // Default label is 'Submit'.
  cancelButton?: FuiModalButtonInterface; // Default label is 'Cancel'.

  // Wizard config
  withNextBtn?: boolean; // Default to true (appear only if there is more steps after current one).
  withBackBtn?: boolean; // Default to true. (appear only if there is steps behind current one).
  nextButton?: FuiModalButtonInterface; // Default label is 'Next'.
  backButton?: FuiModalButtonInterface; // Default label is 'Back'.
  wizardSteps?: FuiWizardStepConfiguration[];
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

export enum ModalWindowInteractionEnum {
  SUBMIT = 'submit',
  CANCEL = 'cancel',
  CLOSE = 'close',
  NEXT = 'next',
  BACK = 'back'
}

export interface ModalWindowInteractionInterface<T> {
  type: ModalWindowInteractionEnum;
  event?: MouseEvent;
  args?: T;
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

export interface FuiModalWindowComponentInterface<S extends FuiModalWindowScreen> {
  viewContainerRef: ViewContainerRef;
  childWindowViewContainerRef: ViewContainerRef;
  componentRef: ComponentRef<S>;
  cancelClose(): void;
  close(event: KeyboardEvent | MouseEvent): void;
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

export interface FuiModalCtrl<D = any, P extends FuiModalWindowParam = any, R extends FuiModalWindowResolved = any> {
  readonly injector: Injector; // [Internal use only] Angular injector
  readonly componentFactoryResolver: ComponentFactoryResolver; // [Internal use only] Angular componentFactoryResolver.
  readonly mainWindowConfiguration: FuiModalWindowConfiguration; // Main window full configuration object
  data: D; // Data shared between all windows. You can specify a type. Default to 'any'.
  params: P; // Params shared between all windows. You can specify a type. Default to 'any'.
  resolves: R; // All resolved promises. You can specify a type. Default to 'any'.
  mainWindow: FuiModalWindowCtrl<FuiModalWindowScreen>; // The main window controller.
  childWindows: { [id: string]: FuiModalWindowCtrl<FuiModalWindowScreen> }; // List of every child windows controller.
  interactionSubjects: { [key: string]: Subject<ModalWindowInteractionInterface<any>> }; // [Internal use only]
  modalWindowLoadingTplt: TemplateRef<FuiModalWindowTemplateContext>; // [Internal use only] The loading template.
  onWindowInteraction<T>(windowId: string): Promise<ModalWindowInteractionInterface<T>>; // [Internal use only]
  onWindowInteractionObservable<T>(windowId: string): Observable<ModalWindowInteractionInterface<T>>; // [Internal use only]
  resetWindow(windowId: string): void; // [Internal use only] Reset the specified window by cleaning the interactionSubjects.
  getWindowById(windowId: string): FuiModalWindowCtrl<FuiModalWindowScreen>; // Get a specific window controller by its ID
  resolvePromises(
    resolve: FuiModalWindowResolve,
    window: FuiModalWindowCtrl<FuiModalWindowScreen>
  ): Promise<FuiModalWindowCtrl<FuiModalWindowScreen>>; // [Internal use only] Function that allows you to run a list of promise and return a window controller containing the resolved promises.
}

export interface FuiModalWindowCtrl<
  S extends FuiModalWindowScreen,
  I = any,
  CL = any,
  P extends FuiModalWindowParam = any,
  R extends FuiModalWindowResolved = any
> {
  windowConfiguration: FuiModalWindowConfiguration; // Window configuration object
  params: P; // Params shared between all windows. You can specify a type. Default to 'any'.
  resolves: R; // // All resolved promises. You can specify a type. Default to 'any'.
  windowComponentRef: ComponentRef<FuiModalWindowComponentInterface<S>>; // [Internal use only]
  windowEmbedViewRef: EmbeddedViewRef<FuiModalWindowTemplateContext>; // [Internal use only]
  hasChildWindowOpen: boolean; // [Internal use only]
  isSubmitting: boolean; // Whether the user has submitted the window or not. Default to false.
  isCanceling: boolean; // Whether the user has cancelled the window or not. Default to false.
  isGoingNext: boolean; // Whether the user is going on the next screen or not. Default to false.
  isGoingBack: boolean; // Whether the user is going on the previous screen or not. Default to false.
  childWindowLeftValue: { [key: string]: string }; // [Internal use only]
  defaultLeftValue: number; // [Internal use only]
  closeConfirm: boolean; // Whether we want a close confirmation or not. Default to false.

  // Optionals attributes.
  error?: string | Error; // The error to be displayed on window top body. Default to undefined.
  closeButton?: boolean; // True by default. Whether or not we want to display the close button.
  cssClass?: string; // A space separated string of css classes we want to add to the modal window (for extra customisation)
  id?: string; // The unique ID of the window. If not set, a uniqueID will be generated.
  // Value in px of the window width.
  width?: number; // The developer can specify the custom width if he want, by default we use 600px for standard window and 770px for wizards.
  viewContainerRef: ViewContainerRef; // [Internal use only]
  reset(): void; // [Internal use only]
  openChildWindow<T>(windowId: string, windowPromises?: FuiModalWindowResolve, params?: FuiModalWindowParam): Promise<T>;
  render(viewContainerRef: ViewContainerRef): void; // [Internal use only]
  renderError(viewContainerRef: ViewContainerRef, error: string | Error): void; // [Internal use only]
  renderLoading(viewContainerRef: ViewContainerRef): void; // [Internal use only]
  $close(event: MouseEvent | KeyboardEvent): Promise<CL>; // Close the window.
  $init(args?: any): Promise<I>; // Initialise the window with args.
}

export interface FuiModalErrorWindowCtrl<
  I = any,
  CL = any,
  P extends FuiModalWindowParam = any,
  R extends FuiModalWindowResolved = any
> extends FuiModalWindowCtrl<FuiModalErrorWindowScreen, I, CL, P, R> {
  component: Type<FuiModalErrorWindowScreen<I, CL>>; // The component screen to use.
}

export interface FuiModalHeadlessWindowCtrl<
  I = any,
  CL = any,
  P extends FuiModalWindowParam = any,
  R extends FuiModalWindowResolved = any
> extends FuiModalWindowCtrl<FuiModalHeadlessWindowScreen, I, CL, P, R> {
  component: Type<FuiModalHeadlessWindowScreen<I, CL>>; // The component screen to use.
}

export interface FuiModalStandardWindowCtrl<
  I = any,
  CL = any,
  S = any,
  C = any,
  P extends FuiModalWindowParam = any,
  R extends FuiModalWindowResolved = any
> extends FuiModalWindowCtrl<FuiModalStandardWindowScreen<I, CL, S, C>, I, CL, P, R> {
  component: Type<FuiModalStandardWindowScreen<I, CL, S, C>>; // The component screen to use.
  title?: string; // If you want to set a title for your modal
  subtitle?: string; // If you want to set a sub-title for your modal
  // If you want something more complex, like adding an icon or whatever else just provide the titleTemplate.
  // But be careful to ONLY use either `title` + `subtitle` OR `titleTemplate`, only `titleTemplate` will be taken into account.
  titleTemplate?: TemplateRef<any>;
  submitButton?: FuiModalButtonInterface; // Custom design for the submitButton. Default label to 'Submit'
  cancelButton?: FuiModalButtonInterface; // Custom design for the cancelButton. Default label to 'Cancel'
  withSubmitBtn?: boolean; // True by default. Whether or not we want to display the submit button.
  withCancelBtn?: boolean; // False by default. Whether or not we want to display the cancel button.
  $submit?(event: MouseEvent): Promise<S | CL>; // Submit the window workflow.
  $cancel?(event: MouseEvent): Promise<C | CL>; // Cancel the window workflow.
}

export interface FuiModalWizardWindowCtrl<
  I = any,
  CL = any,
  N = any,
  B = any,
  S = any,
  C = any,
  P extends FuiModalWindowParam = any,
  R extends FuiModalWindowResolved = any
> extends FuiModalWindowCtrl<FuiModalWizardWindowScreen<I, CL, N, B, S, C>, I, CL, P, R> {
  title?: string; // If you want to set a title for your modal
  subtitle?: string; // If you want to set a sub-title for your modal
  // If you want something more complex, like adding an icon or whatever else just provide the titleTemplate.
  // But be careful to ONLY use either `title` + `subtitle` OR `titleTemplate`, only `titleTemplate` will be taken into account.
  titleTemplate?: TemplateRef<any>;
  submitButton?: FuiModalButtonInterface; // Custom design for the submitButton. Default label to 'Submit'
  cancelButton?: FuiModalButtonInterface; // Custom design for the cancelButton. Default label to 'Cancel'
  withSubmitBtn?: boolean; // True by default. Whether or not we want to display the submit button.
  withCancelBtn?: boolean; // False by default. Whether or not we want to display the cancel button.
  // Wizard specific
  wizardSteps: FuiWizardStepConfiguration[]; // List of all steps.
  currentStepIndex: number; // This will give you the index of the current step.
  backButton?: FuiModalButtonInterface; // Custom design for the backButton. Default label to 'Back'
  nextButton?: FuiModalButtonInterface; // Custom design for the nextButton. Default label to 'Next'
  withNextBtn?: boolean; // True by default. Whether or not we want to display the next button.
  withBackBtn?: boolean; // True by default. Whether or not we want to display the back button.
  $submit?(event: MouseEvent): Promise<S | CL>; // Submit the window workflow.
  $cancel?(event: MouseEvent): Promise<C | CL>; // Cancel the window workflow.
  $back?(event: MouseEvent, stepIndex?: number): Promise<B>; // Go to previous step.
  $next?(event: MouseEvent): Promise<N>; // Go to next step.
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

/**
 * Abstract window screen interface (common to every screen types)
 */
export interface FuiModalWindowScreen<I = any, CL = any> {
  modalCtrl?: FuiModalCtrl;
  $onInit?(args?: any): Promise<I>;
  $onClose?(event?: MouseEvent | KeyboardEvent): Promise<CL>;
}

/**
 * Standard window screen interface
 */
export interface FuiModalStandardWindowScreen<I = any, CL = any, S = any, C = any> extends FuiModalWindowScreen<I, CL> {
  windowCtrl?: FuiModalStandardWindowCtrl<I, CL, S, C>;
  $onSubmit?(event?: MouseEvent): Promise<S>;
  $onCancel?(event?: MouseEvent): Promise<C>;
}

/**
 * Wizard window screen interface
 */
export interface FuiModalWizardWindowScreen<I = any, CL = any, N = any, B = any, S = any, C = any>
  extends FuiModalWindowScreen<I, CL> {
  windowCtrl?: FuiModalWizardWindowCtrl<I, CL, N, B, S, C>;
  $onSubmit?(event?: MouseEvent): Promise<S>;
  $onCancel?(event?: MouseEvent): Promise<C>;
  $onBack?(event?: MouseEvent): Promise<B>;
  $onNext?(event?: MouseEvent): Promise<N>;
}

/**
 * Headless window screen interface.
 */
export interface FuiModalHeadlessWindowScreen<I = any, CL = any> extends FuiModalWindowScreen<I, CL> {
  windowCtrl?: FuiModalHeadlessWindowCtrl<I, CL>;
}

/**
 * Error window screen interface.
 */
export interface FuiModalErrorWindowScreen<I = any, CL = any> extends FuiModalWindowScreen<I, CL> {
  windowCtrl?: FuiModalErrorWindowCtrl<I, CL>;
}
