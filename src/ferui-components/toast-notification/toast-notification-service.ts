import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { FuiToastNotificationInterface } from './interfaces';
import { FuiToastNotificationComponent } from './toast-notification-component';

/**
 * Fui toast notification service
 * This service allow us to create the Fui Toast Notification component and place it on screen.
 */
@Injectable()
export class FuiToastNotificationService {
  private toastNotificationComRef: ComponentRef<FuiToastNotificationComponent>;
  private toastNotificationCloseSubscription: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  /**
   * Handles Fui Toast Notification delay if any is needed and call on to create the Fui Toast Notification component
   * @param toast - object with component properties to show
   */
  createFuiToastNotification(toast: FuiToastNotificationInterface): void {
    if (toast.delay) {
      setTimeout(() => {
        this.initFuiToastNotificationComponent(toast);
      }, toast.delay);
    } else {
      this.initFuiToastNotificationComponent(toast);
    }
  }

  /**
   * Create and initialize FuiToastNotificationComponent Ref and append it to the DOM
   * @param toast - object with component properties to show
   */
  private initFuiToastNotificationComponent(toast: FuiToastNotificationInterface): void {
    if (this.toastNotificationComRef) {
      this.deleteFuiToastNotification(); // delete any notification currently showing
    }
    this.toastNotificationComRef = this.componentFactoryResolver
      .resolveComponentFactory(FuiToastNotificationComponent)
      .create(this.injector);
    this.toastNotificationComRef.instance.init(toast);
    this.toastNotificationCloseSubscription = this.toastNotificationComRef.instance.close.subscribe(() => {
      this.deleteFuiToastNotification();
    });
    this.appRef.attachView(this.toastNotificationComRef.hostView);
    const domElem = (this.toastNotificationComRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    const anchor = toast.anchor || document.body;
    anchor.append(domElem);
  }

  /**
   * Deletes any Fui Toast Notification component reference
   */
  private deleteFuiToastNotification(): void {
    if (this.toastNotificationComRef) {
      this.appRef.detachView(this.toastNotificationComRef.hostView);
      this.toastNotificationComRef.destroy();
      this.toastNotificationCloseSubscription.unsubscribe();
      this.toastNotificationCloseSubscription = this.toastNotificationComRef = undefined;
    }
  }
}
