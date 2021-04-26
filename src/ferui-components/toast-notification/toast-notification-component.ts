import { Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { FeruiUtils } from '../utils/ferui-utils';

import { FuiToastNotificationInterface } from './interfaces';
import { FuiTimerUtil } from './timer-util';

@Component({
  selector: 'fui-toast-notification-component',
  template: `
    <div
      id="fui-toast-notification"
      #toastNotificationWrapper
      [ngClass]="toastClass"
      [class.on-screen]="onScreen"
      [class.hide-notification]="removeNotification"
      [style.margin-left.px]="marginLeft"
    >
      <div
        class="content-wrapper"
        (mouseenter)="onMouseOver()"
        (mouseleave)="onMouseOut()"
        (click)="closeNotification($event)"
        [ngClass]="{ 'has-icon': toastIcon }"
      >
        <div
          class="toast-notification-icon"
          *ngIf="toastIcon"
          [ngClass]="toastIcon.cssClass"
          [innerHTML]="toastIcon.template"
        ></div>
        <div class="toast-notification-content">
          <div class="toast-notification-message">{{ message }}</div>
          <span class="toast-notification-action" *ngIf="toastAction">
            <a
              *ngIf="toastAction.templateHref && !toastAction.isHtmlElement"
              [attr.href]="toastAction.templateHref"
              [innerHTML]="toastAction.template"
              (click)="toastAction.templateClickEvent && toastAction.templateClickEvent()"
              target="_blank"
            ></a>
            <div
              *ngIf="!toastAction.templateHref && !toastAction.isHtmlElement"
              [innerHTML]="toastAction.template"
              (click)="toastAction.templateClickEvent && toastAction.templateClickEvent()"
            ></div>
            <div *ngIf="toastAction.isHtmlElement" [innerHTML]="toastAction.template"></div>
          </span>
        </div>
      </div>
    </div>
  `
})
export class FuiToastNotificationComponent implements OnDestroy {
  // tslint:disable-next-line
  @Output() readonly close: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('toastNotificationWrapper') toastNotificationWrapper: ElementRef;

  onScreen: boolean = false;
  removeNotification = false;
  marginLeft: number = 0;
  message: string;
  toastIcon: FuiToastNotificationIcon;
  toastAction: FuiToastNotificationAction;
  toastClass: string;

  private defaultMessage: string = 'You have a notification!';
  private slideOutDelayTimer: FuiTimerUtil;
  private slideInDuration = 700; // in ms
  private slideOutDuration = 400; // in ms
  private defaultNotificationDelay: number = this.slideInDuration + 10000; // default in ms (= slideIn duration + 10s).
  private notificationDelay: number = this.defaultNotificationDelay;

  constructor(private domSanitizer: DomSanitizer) {}

  /**
   * On destroy, cancel any timer and unsubscribe
   */
  ngOnDestroy(): void {
    if (this.slideOutDelayTimer) {
      this.slideOutDelayTimer.cancel();
      this.onScreen = this.removeNotification = false;
      this.slideOutDelayTimer = undefined;
    }
  }

  /**
   * Pause the timer when hovering the notification so that it doesn't disappear.
   */
  onMouseOver(): void {
    if (this.slideOutDelayTimer) {
      this.slideOutDelayTimer.pause();
    }
  }

  /**
   * Resume the timer so that notification gets removed at some point.
   */
  onMouseOut(): void {
    if (this.slideOutDelayTimer) {
      this.slideOutDelayTimer.resume();
    }
  }

  /**
   * Close the notification
   * @params event
   */
  closeNotification(event: Event): void {
    if (this.slideOutDelayTimer) {
      // If notification action is a link we allow the link to be clicked on
      if (FeruiUtils.getClosestDomElement(event.target as Element, 'toast-notification-action')) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.slideOutDelayTimer.complete();
      this.removeAndCloseNotification();
    }
  }

  /**
   * Initialize and display the notification on screen
   * Decode any actions user wants to show and register its automatic closure after default time or chosen time
   * @params notification object
   */
  init(notificationObject: FuiToastNotificationInterface): void {
    this.message = notificationObject.message || this.defaultMessage;
    this.toastClass = notificationObject.cssClass || null;
    // Decode the users passed in Toast Action if any
    this.toastAction = notificationObject.action
      ? {
          template:
            notificationObject.action.template instanceof HTMLElement
              ? this.domSanitizer.bypassSecurityTrustHtml(notificationObject.action.template.outerHTML)
              : this.domSanitizer.bypassSecurityTrustHtml(notificationObject.action.template),
          templateClickEvent: notificationObject.action.callBack || null,
          templateHref: notificationObject.action.href || null,
          isHtmlElement: notificationObject.action.template instanceof HTMLElement
        }
      : null;
    // Decode the users passed in Toast icon if any
    this.toastIcon = notificationObject.icon
      ? {
          template: this.domSanitizer.bypassSecurityTrustHtml(notificationObject.icon.element.outerHTML),
          cssClass: notificationObject.icon.cssClass
        }
      : null;
    // We give developer more granular control of the toast notification, how long should notification last
    this.notificationDelay = notificationObject.notificationTimeInMs || this.defaultNotificationDelay;
    this.onScreen = true;
    this.placeNotificationInMiddle().then(() => this.automaticallyHideNotification());
  }

  /**
   * Automatically close the notification after some time (default is 10 seconds)
   */
  private automaticallyHideNotification(): void {
    if (!this.slideOutDelayTimer) {
      this.slideOutDelayTimer = new FuiTimerUtil(() => {
        this.removeAndCloseNotification();
      }, this.notificationDelay);
    }
  }

  /**
   * Start the removal animation of Toast Notification and emit close event
   */
  private removeAndCloseNotification(): void {
    if (!this.removeNotification) {
      this.removeNotification = true;
      setTimeout(() => {
        this.onScreen = this.removeNotification = false;
        this.slideOutDelayTimer = undefined;
        this.close.emit();
      }, this.slideOutDuration);
    }
  }

  /**
   * Position the toast notification on the middle of the screen horizontally
   */
  private async placeNotificationInMiddle(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      setTimeout(() => {
        this.marginLeft = (this.toastNotificationWrapper.nativeElement.offsetWidth / 2) * -1;
        resolve(true);
      }, 0);
    });
  }
}

/**
 * Fui Toast Notification action shown on toast notification UI
 */
interface FuiToastNotificationAction {
  template: SafeHtml;
  isHtmlElement: boolean;
  templateClickEvent?: () => void;
  templateHref?: string;
}

/**
 * Fui Toast Notification icon shown on toast notification UI
 */
interface FuiToastNotificationIcon {
  template: SafeHtml;
  cssClass?: string;
}
