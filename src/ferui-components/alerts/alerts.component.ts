import { Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, Self } from '@angular/core';

export enum FuiAlertsTypes {
  PRIMARY = 'alert-primary',
  SECONDARY = 'alert-secondary',
  SUCCESS = 'alert-success',
  DANGER = 'alert-danger',
  WARNING = 'alert-warning',
  INFO = 'alert-info',
  LIGHT = 'alert-light',
  DARK = 'alert-dark'
}

@Component({
  selector: 'fui-alert',
  template: `
    <div class="fui-alert-icon-wrapper">
      <ng-content select="[fuiAlertsIcon]"></ng-content>
    </div>
    <div class="fui-alert-body-wrapper">
      <ng-content></ng-content>
    </div>
    <div class="fui-alert-close-wrapper" *ngIf="closable">
      <button type="button" class="close" (click)="closeAlert($event)" aria-label="Close">
        <clr-icon class="fui-alert-close-icon" shape="fui-close"></clr-icon>
      </button>
    </div>
  `
})
export class FuiAlertsComponent implements OnInit {
  @Output() readonly onClose: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  @Input()
  set closable(closable: boolean) {
    this._isClosable = closable;
  }

  get closable(): boolean {
    return this._isClosable;
  }

  @Input()
  set alertType(type: FuiAlertsTypes) {
    this._alertType = type;
    this.buildClassList();
  }

  get alertType(): FuiAlertsTypes {
    return this._alertType;
  }

  @HostBinding('class')
  classList: string;
  @HostBinding('attr.role')
  role: string = 'alert';

  isClosed: boolean = false;

  private _isClosable: boolean = false;
  private _alertType: FuiAlertsTypes = FuiAlertsTypes.INFO;
  private defaultClasses: string = 'alert alert-flex';

  constructor(@Self() private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.buildClassList();
  }

  /**
   * Build the class list for the host.
   */
  buildClassList(): void {
    const originalClassList: DOMTokenList = this.elementRef.nativeElement.classList;
    const defaultClasses: string[] = [
      // We keep the possible classes that are already set by the dev.
      ...originalClassList.value.split(' '),
      ...this.defaultClasses.split(' '),
      this.alertType
    ];
    if (this.closable) {
      defaultClasses.push('alert-dismissible');
    }
    if (this.isClosed) {
      defaultClasses.push('hidden');
    }
    this.classList = defaultClasses.join(' ');
  }

  /**
   * Close the alert
   * @param event
   */
  closeAlert(event: MouseEvent): void {
    this.isClosed = true;
    this.buildClassList();
    this.onClose.emit(event);
  }

  /**
   * Re-Open the alert.
   */
  openAlert(): void {
    this.isClosed = false;
    this.buildClassList();
  }
}
