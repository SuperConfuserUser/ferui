import {
  FuiModalCtrl,
  FuiModalWindowConfiguration,
  FuiModalWindowCtrl,
  FuiModalWindowParam,
  FuiModalWindowResolve,
  FuiModalWindowResolved,
  FuiModalWindowScreen,
  FuiModalWindowTemplateContext,
  ModalWindowInteractionInterface
} from '../../interfaces/modals-interfaces';
import { FuiModalInstancesUtils } from '../../utils/modal-instances-utils';
import { ComponentFactoryResolver, Injector, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FeruiUtils } from '../../../utils/ferui-utils';

/**
 * Modal Controller class
 */
export class FuiModalCtrlImpl implements FuiModalCtrl {
  viewContainerRef: ViewContainerRef;
  resolves: FuiModalWindowResolved = {};
  mainWindow: FuiModalWindowCtrl<FuiModalWindowScreen>;
  childWindows: { [id: string]: FuiModalWindowCtrl<FuiModalWindowScreen> };
  modalWindowLoadingTplt: TemplateRef<FuiModalWindowTemplateContext>;
  interactionSubjects: { [key: string]: Subject<ModalWindowInteractionInterface<any>> } = {};
  data: any;

  constructor(
    public readonly mainWindowConfiguration: FuiModalWindowConfiguration,
    public params: FuiModalWindowParam,
    public windowResolve: FuiModalWindowResolve,
    public readonly injector: Injector,
    public readonly componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.setupWindows();
  }

  /**
   * Initialize the modal.
   */
  init(): void {
    // We want to resolve the promises (if any) first, so we display the loading state.
    this.mainWindow.renderLoading(this.viewContainerRef);
    this.resolvePromises(this.windowResolve, this.mainWindow)
      .then(mainWindow => {
        // Once the promises are resolved, we render the main window (that replace the loading state)
        mainWindow.render(this.viewContainerRef);
      })
      .catch(e => {
        // In case of an error/rejection in one of the promises, we display the error window explaining what happens.
        this.mainWindow.renderError(this.viewContainerRef, e);
      });
  }

  /**
   * Get a window controller by its ID.
   * @param windowId The id of the modal.
   */
  getWindowById(windowId: string): FuiModalWindowCtrl<FuiModalWindowScreen> {
    if (this.childWindows[windowId]) {
      return this.childWindows[windowId];
    }
    return null;
  }

  /**
   * Resolve a promise list.
   * @param resolve The promise list.
   * @param window The window to return once the promises are resolved.
   */
  resolvePromises(
    resolve: FuiModalWindowResolve,
    window: FuiModalWindowCtrl<FuiModalWindowScreen>
  ): Promise<FuiModalWindowCtrl<FuiModalWindowScreen>> {
    if (resolve) {
      const resolves: Promise<any>[] = [];
      const resolveKeys: string[] = Object.keys(resolve);
      for (const key of resolveKeys) {
        // We only want to handle Promises, nothing else.
        if (resolve.hasOwnProperty(key) && typeof resolve[key].then === 'function') {
          resolves.push(resolve[key]);
        }
      }
      if (resolves.length > 0) {
        return Promise.all(resolves)
          .then(values => {
            values.forEach((value, index) => {
              this.resolves[resolveKeys[index]] = value;
            });
            return Promise.resolve(window);
          })
          .catch(e => {
            return Promise.reject(e);
          });
      }
    }
    return Promise.resolve(window);
  }

  /**
   * Internals interaction subjects returned as Promise.
   * @param windowId The window ID
   */
  onWindowInteraction<T>(windowId: string): Promise<ModalWindowInteractionInterface<T>> {
    if (FeruiUtils.isNullOrUndefined(windowId)) {
      return Promise.reject('A modal window must have an ID.');
    }
    // If the window interaction has already been closed or stopped, we just re-create a new one.
    if (
      !this.interactionSubjects[windowId] ||
      (this.interactionSubjects[windowId] &&
        (this.interactionSubjects[windowId].closed || this.interactionSubjects[windowId].isStopped))
    ) {
      this.interactionSubjects[windowId] = new Subject<ModalWindowInteractionInterface<T>>();
    }
    return this.interactionSubjects[windowId].toPromise();
  }

  /**
   * Internals interaction subjects returned as Observable.
   * @param windowId The window ID
   */
  onWindowInteractionObservable<T>(windowId: string): Observable<ModalWindowInteractionInterface<T>> {
    // If the window interaction has already been closed or stopped, we just re-create a new one.
    if (
      !this.interactionSubjects[windowId] ||
      (this.interactionSubjects[windowId] &&
        (this.interactionSubjects[windowId].closed || this.interactionSubjects[windowId].isStopped))
    ) {
      this.interactionSubjects[windowId] = new Subject<ModalWindowInteractionInterface<T>>();
    }
    return this.interactionSubjects[windowId].asObservable();
  }

  /**
   * Reset windows. That will remove the interaction subject for the specified window ID.
   * @param windowId
   */
  resetWindow(windowId: string): void {
    if (this.interactionSubjects[windowId]) {
      this.interactionSubjects[windowId].complete();
      delete this.interactionSubjects[windowId];
    }
  }

  /**
   * Build all child window. That allow us to retrieve them by their ID.
   * They won't be added in DOM, they are just controllers and they are not compiled components yet.
   * @param childWindowConfig Window configuration object
   * @param childWindows Child window object (this is generated by this function)
   */
  private buildChildWindows(
    childWindowConfig: FuiModalWindowConfiguration,
    childWindows: { [id: string]: FuiModalWindowCtrl<FuiModalWindowScreen> } = {}
  ): { [id: string]: FuiModalWindowCtrl<FuiModalWindowScreen> } {
    if (childWindowConfig.childWindows && childWindowConfig.childWindows.length > 0) {
      childWindowConfig.childWindows.forEach(childWindowConfiguration => {
        childWindows[childWindowConfiguration.id] = FuiModalInstancesUtils.getWindowInstance(this, childWindowConfiguration);
        if (childWindowConfiguration.childWindows && childWindowConfiguration.childWindows.length > 0) {
          this.buildChildWindows(childWindowConfiguration, childWindows);
        }
      });
      return childWindows;
    }
    return null;
  }

  /**
   * This will setup the mainWindow as well as all child windows.
   */
  private setupWindows(): void {
    if (this.mainWindowConfiguration) {
      this.mainWindow = FuiModalInstancesUtils.getWindowInstance(this);
      this.childWindows = this.buildChildWindows(this.mainWindowConfiguration);
    }
  }
}
