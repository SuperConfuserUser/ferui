import {
  ComponentFactoryResolver,
  ComponentRef,
  HostListener,
  Inject,
  Injector,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {
  FuiModalCtrl,
  FuiModalWindowCtrl,
  FuiModalWindowScreen,
  FuiModalWindowComponentInterface,
  FUI_MODAL_CTRL_TOKEN,
  FUI_MODAL_WINDOW_CTRL_TOKEN
} from '../interfaces/modals-interfaces';

/**
 * Abstract Modal window component class
 */
export abstract class FuiModalAbstractWindowComponent<W extends FuiModalWindowCtrl<S>, S extends FuiModalWindowScreen>
  implements FuiModalWindowComponentInterface<S>, OnDestroy {
  @ViewChild('componentHost', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;
  @ViewChild('childWindowHost', { read: ViewContainerRef }) childWindowViewContainerRef: ViewContainerRef;

  // This can't be private because it is used within the template and must be public.
  isClosing: boolean = false;
  componentRef: ComponentRef<S>;

  constructor(
    @Inject(FUI_MODAL_CTRL_TOKEN) public modalCtrl: FuiModalCtrl,
    @Inject(FUI_MODAL_WINDOW_CTRL_TOKEN) public windowCtrl: W,
    protected injector: Injector,
    protected componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnDestroy(): void {
    this.windowCtrl.reset();
  }

  /**
   * We watch for user keyboard interaction and close the last opened window if the user press 'Esc' key.
   * @param event
   */
  @HostListener('body:keyup.escape', ['$event'])
  close(event: KeyboardEvent | MouseEvent): void {
    this.isClosing = true;
    if (this.windowCtrl && !this.windowCtrl.hasChildWindowOpen && !this.windowCtrl.closeConfirm) {
      this.windowCtrl.$close(event);
    }
  }

  /**
   * Cancel the close confirmation tooltip.
   */
  cancelClose(): void {
    this.isClosing = false;
  }
}
