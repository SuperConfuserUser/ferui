import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector } from '@angular/core';
import {
  FuiModalWindowConfiguration,
  FuiModalWindowParam,
  FuiModalWindowResolve,
  ModalWindowInteractionEnum
} from '../interfaces/modals-interfaces';
import { FuiModalComponent } from '../components/modals.component';
import { FuiModalCtrlImpl } from '../models/modal/fui-modal-ctrl';

/**
 * FerUI Modals service.
 */
@Injectable({
  providedIn: 'root'
})
export class FuiModalService {
  private componentRef: ComponentRef<FuiModalComponent>;

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  /**
   * Open a modal.
   * @param windowConfiguration Modal windows configuration.
   * @param windowPromises Promise to resolve before rendering the window.
   * @param params Extra params that you may want to pass to windows.
   * @param anchorHost Where do you want the modals to live in (by default we use the document.body).
   */
  openModal<T>(
    windowConfiguration: FuiModalWindowConfiguration,
    windowPromises?: FuiModalWindowResolve,
    params?: FuiModalWindowParam,
    anchorHost: HTMLElement = document.body
  ): Promise<T> {
    if (this.componentRef) {
      this.closeModal();
    }
    return new Promise<T>((resolve, reject) => {
      // Build the Angular FuiModalComponent component
      this.componentRef = this.componentFactoryResolver.resolveComponentFactory(FuiModalComponent).create(
        Injector.create({
          providers: [
            {
              provide: FuiModalCtrlImpl,
              useFactory: () =>
                new FuiModalCtrlImpl(windowConfiguration, params, windowPromises, this.injector, this.componentFactoryResolver),
              deps: []
            }
          ],
          parent: this.injector
        })
      );
      // Attach the component view to global app ref.
      this.appRef.attachView(this.componentRef.hostView);
      // Display the modal on screen (append the modal to the body).
      const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
      anchorHost.append(domElem);

      // We watch for the main window interaction to close and resolve the promise with corresponding args.
      this.componentRef.instance.modalCtrl
        .onWindowInteraction<T>(this.componentRef.instance.modalCtrl.mainWindow.id)
        .then(interaction => {
          resolve(interaction ? interaction.args : null);
          if (
            (interaction && interaction.type === ModalWindowInteractionEnum.CLOSE) ||
            (interaction && interaction.type === ModalWindowInteractionEnum.SUBMIT)
          ) {
            this.closeModal();
          }
        })
        .catch(e => {
          reject(e);
          this.closeModal();
        });
    });
  }

  /**
   * Close the modal.
   */
  closeModal(): void {
    this.appRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();
    this.componentRef = undefined;
  }
}
