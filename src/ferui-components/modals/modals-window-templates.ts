/**
 * In this file you'll find default templates for the modal windows.
 */

export const FUI_MODAL_CLOSE_TPLT = `
<button class="fui-modal-close-btn" (click)="close($event)">
  <clr-icon class="fui-modal-close-icon" shape="fui-close"></clr-icon>
</button>
<div class="fui-modal-close-confirm-wrapper" *ngIf="windowCtrl.closeConfirm && isClosing">
  <div class="fui-modal-close-confirm-message">Are you sure you want to close the modal?</div>
  <div class="fui-modal-close-confirm-actions">
    <button (click)="windowCtrl.$close($event)" class="btn btn-danger">Close</button>
    <button (click)="cancelClose()" class="btn btn-outline-secondary">Cancel</button>
  </div>
</div>
`;

export const FUI_MODAL_WINDOW_TITLE_TPLT = `
<span class="fui-modal-header-title"
    *ngIf="windowCtrl.title && !windowCtrl.titleTemplate">{{ windowCtrl.title }}</span>
<span class="fui-modal-header-subtitle"
    *ngIf="windowCtrl.subtitle && !windowCtrl.titleTemplate">{{ windowCtrl.subtitle }}</span>
<ng-container [ngTemplateOutlet]="windowCtrl.titleTemplate" *ngIf="windowCtrl.titleTemplate"></ng-container>`;

export const FUI_MODAL_WINDOW_STANDARD_FOOTER_TPLT = `
<button *ngIf="windowCtrl.withCancelBtn" class="fui-modal-cancel-btn btn btn-link"
    [ngClass]="windowCtrl.cancelButton ? windowCtrl.cancelButton.cssClass : null"
    [class.disabled]="windowCtrl.isCanceling"
    (click)="windowCtrl.$cancel($event)">
  <span [class.fui-button-loading]="windowCtrl.isCanceling">{{ windowCtrl.cancelButton ? windowCtrl.cancelButton.label : 'Cancel'}}</span>
  <clr-icon *ngIf="windowCtrl.isCanceling" shape="fui-spinner" class="fui-loader-animation"></clr-icon>
</button>

<button *ngIf="windowCtrl.withSubmitBtn" class="fui-modal-submit-btn btn btn-primary"
    [ngClass]="windowCtrl.submitButton ? windowCtrl.submitButton.cssClass : null"
    [class.disabled]="windowCtrl.isSubmitting"
    (click)="windowCtrl.$submit($event)">
  <span [class.fui-button-loading]="windowCtrl.isSubmitting">{{ windowCtrl.submitButton ? windowCtrl.submitButton.label : 'Submit'}}</span>
  <clr-icon *ngIf="windowCtrl.isSubmitting" shape="fui-spinner" class="fui-loader-animation"></clr-icon>
</button>`;

export const FUI_MODAL_WINDOW_WIZARD_FOOTER_TPLT = `
<button *ngIf="windowCtrl.withCancelBtn" class="fui-modal-cancel-btn btn btn-link"
    [ngClass]="windowCtrl.cancelButton ? windowCtrl.cancelButton.cssClass : null"
    [class.disabled]="windowCtrl.isCanceling"
    (click)="windowCtrl.$cancel($event)">
  <span [class.fui-button-loading]="windowCtrl.isCanceling">{{ windowCtrl.cancelButton ? windowCtrl.cancelButton.label : 'Cancel'}}</span>
  <clr-icon *ngIf="windowCtrl.isCanceling" shape="fui-spinner" class="fui-loader-animation"></clr-icon>
</button>

<button *ngIf="windowCtrl.withBackBtn" class="fui-modal-back-btn btn btn-link"
    [ngClass]="windowCtrl.backButton ? windowCtrl.backButton.cssClass : null"
    [class.disabled]="windowCtrl.isGoingBack"
    (click)="windowCtrl.$back($event)">
  <span [class.fui-button-loading]="windowCtrl.isGoingBack">{{ windowCtrl.backButton ? windowCtrl.backButton.label : 'Back'}}</span>
  <clr-icon *ngIf="windowCtrl.isGoingBack" shape="fui-spinner" class="fui-loader-animation"></clr-icon>
</button>

<button *ngIf="windowCtrl.withSubmitBtn" class="fui-modal-submit-btn btn btn-primary"
    [ngClass]="windowCtrl.submitButton ? windowCtrl.submitButton.cssClass : null"
    [class.disabled]="windowCtrl.isSubmitting"
    (click)="windowCtrl.$submit($event)">
  <span [class.fui-button-loading]="windowCtrl.isSubmitting">{{ windowCtrl.submitButton ? windowCtrl.submitButton.label : 'Submit'}}</span>
  <clr-icon *ngIf="windowCtrl.isSubmitting" shape="fui-spinner" class="fui-loader-animation"></clr-icon>
</button>

<button *ngIf="windowCtrl.withNextBtn" class="fui-modal-next-btn btn btn-primary"
    [ngClass]="windowCtrl.nextButton ? windowCtrl.nextButton.cssClass : null"
    [class.disabled]="windowCtrl.isGoingNext"
    (click)="windowCtrl.$next($event)">
  <span [class.fui-button-loading]="windowCtrl.isGoingNext">{{ windowCtrl.nextButton ? windowCtrl.nextButton.label : 'Next'}}</span>
  <clr-icon *ngIf="windowCtrl.isGoingNext" shape="fui-spinner" class="fui-loader-animation"></clr-icon>
</button>`;

export const FUI_MODAL_CHILD_WINDOW_TPLT = `
<div class="fui-modal-child-window-container" [ngStyle]="windowCtrl.childWindowLeftValue">
  <ng-template #childWindowHost></ng-template>
</div>`;

export const FUI_MODAL_WINDOW_ERROR_MSG = `
<fui-alert *ngIf="windowCtrl.error" [alertType]="'alert-danger'" [closable]="false">
  <clr-icon fuiAlertsIcon shape="fui-error"></clr-icon>
  {{windowCtrl.error}}
</fui-alert>`;

export const FUI_MODAL_LOADING_WINDOW_TPLT = `
<div class="fui-modal-container fui-modal-loading-window" [ngClass]="windowConfiguration.cssClass">
  <clr-icon shape="fui-spinner" class="fui-loader-animation"></clr-icon>
</div>`;
