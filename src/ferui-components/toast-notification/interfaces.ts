/**
 * Fui Toast Notification object interface
 */
export interface FuiToastNotificationInterface {
  message?: string; // toast notification message
  delay?: number; // delay to show toast notification used by Toast Service
  cssClass?: string; // The extra/custom css class to add to the toast host element.
  action?: FuiToastNotificationActionInterface;
  icon?: FuiToastNotificationIconInterface;
  notificationTimeInMs?: number; // time the dev wants the toast notification to last on screen
  anchor?: HTMLElement; // the anchor element to append toast notification to, otherwise document body will be used
}

/**
 * Fui Toast Notification Action object interface
 */
export interface FuiToastNotificationActionInterface {
  template: string | HTMLElement;
  href?: string; // The href for your link (it is optional because sometimes you just want to handle the link through the click event callback)
  callBack?: () => void;
}

/**
 * Fui Toast Notification Icon object interface
 */
export interface FuiToastNotificationIconInterface {
  element: HTMLElement; // The icon element you want to use
  cssClass?: string; // The extra/custom css class to add to the icon element wrapper
}
