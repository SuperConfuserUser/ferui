import { ChangeDetectorRef, Component, ContentChild, ElementRef, OnInit, Self } from '@angular/core';

import { FuiHelperDirective } from '../../helper/fui-helper-directive';
import { FuiFormAbstractContainer } from '../common/abstract-container';
import { IfErrorService } from '../common/if-error/if-error.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { FocusService } from '../common/providers/focus.service';
import { FuiFormLayoutService } from '../common/providers/form-layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { PlaceholderService } from '../common/providers/placeholder.service';
import { RequiredControlService } from '../common/providers/required-control.service';

import { NumberIoService } from './providers/number-io.service';

export const FUI_NUMBER_INCREMENT_DECREMENT_DELAY = 150;

@Component({
  selector: 'fui-number-container',
  template: `
    <div class="fui-control-container" [ngClass]="controlClass()">
      <div class="fui-input-wrapper">
        <ng-content select="[fuiLabel]"></ng-content>

        <div class="input-number-wrapper">
          <ng-content select="[fuiNumber]"></ng-content>

          <div class="fui-number-increment-wrapper">
            <button
              [tabindex]="ngControl?.disabled ? -1 : 1"
              class="fui-number-btn fui-number-increment"
              [class.fui-number-incrementing]="isIncrementing"
              [disabled]="ngControl?.disabled"
              (focusin)="keepFocus($event)"
              (focusout)="looseFocus($event)"
              (click)="increment()"
            >
              <clr-icon class="fui-number-icon" shape="fui-solid-arrow" aria-hidden="true"></clr-icon>
            </button>
            <button
              [tabindex]="ngControl?.disabled ? -1 : 1"
              class="fui-number-btn fui-number-decrement"
              [class.fui-number-decrementing]="isDecrementing"
              [disabled]="ngControl?.disabled"
              (focusin)="keepFocus($event)"
              (focusout)="looseFocus($event)"
              (click)="decrement()"
            >
              <clr-icon class="fui-number-icon" flip="vertical" shape="fui-solid-arrow" aria-hidden="true"></clr-icon>
            </button>
          </div>
        </div>

        <div class="fui-control-icons" [class.invalid]="invalid">
          <div *ngIf="!invalid" [ngClass]="{ 'adjust-margin-right fui-input-group-icon-action': !!fuiHelper }">
            <ng-content select="[fuiHelper]"></ng-content>
          </div>
          <clr-icon *ngIf="invalid" tabindex="1" class="fui-error-icon is-red" shape="fui-error" aria-hidden="true"></clr-icon>
        </div>
        <fui-default-control-error>
          <ng-content select="fui-control-error" *ngIf="invalid"></ng-content>
        </fui-default-control-error>
      </div>
    </div>
  `,
  host: {
    '[class.fui-form-control-number]': 'true',
    '[class.fui-form-control]': 'true',
    '[class.fui-form-control-small]': 'controlLayout() === fuiFormLayoutEnum.SMALL',
    '[class.fui-form-control-disabled]': 'ngControl?.disabled'
  },
  providers: [
    IfErrorService,
    NgControlService,
    ControlIdService,
    ControlClassService,
    PlaceholderService,
    FocusService,
    RequiredControlService,
    FuiFormLayoutService,
    NumberIoService
  ]
})
export class FuiNumberContainerComponent extends FuiFormAbstractContainer implements OnInit {
  @ContentChild(FuiHelperDirective) fuiHelper: FuiHelperDirective;

  isIncrementing: boolean = false;
  isDecrementing: boolean = false;

  constructor(
    ifErrorService: IfErrorService,
    controlClassService: ControlClassService,
    ngControlService: NgControlService,
    focusService: FocusService,
    formLayoutService: FuiFormLayoutService,
    cd: ChangeDetectorRef,
    private numberIOService: NumberIoService,
    @Self() private elementRef: ElementRef
  ) {
    super(ifErrorService, controlClassService, ngControlService, focusService, formLayoutService, cd);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.numberIOService.onKeyPressed$.subscribe(keyPressed => {
        if (keyPressed === 'ArrowUp') {
          this.increment();
        } else if (keyPressed === 'ArrowDown') {
          this.decrement();
        } else {
          return;
        }
      })
    );
  }

  keepFocus(event: KeyboardEvent | MouseEvent) {
    // Do nothing if the field is disabled
    if (this.ngControl && this.ngControl.disabled) {
      return;
    }
    this.focusService.toggleWithEvent(true, event);
  }

  looseFocus(event: KeyboardEvent | MouseEvent) {
    // Do nothing if the field is disabled
    if (this.ngControl && this.ngControl.disabled) {
      return;
    }
    this.focusService.toggleWithEvent(false, event);
  }

  /**
   * Increment the value depending on the step/min/max set.
   */
  increment(): void {
    if (this.ngControl && this.ngControl.disabled) {
      return;
    }
    this.ngControl.control.setValue(this.numberIOService.increment(Number(this.ngControl.control.value)));
    this.setIncrementing();
  }

  /**
   * Decrement the value depending on the step/min/max set.
   */
  decrement(): void {
    if (this.ngControl && this.ngControl.disabled) {
      return;
    }
    this.ngControl.control.setValue(this.numberIOService.decrement(Number(this.ngControl.control.value)));
    this.setDecrementing();
  }

  /**
   * We add the fui-number-incrementing class to the increment button for visual feedback.
   * @private
   */
  private setIncrementing() {
    if (this.isIncrementing) {
      return;
    }
    this.isIncrementing = true;
    setTimeout(() => {
      this.isIncrementing = false;
      this.cd.markForCheck();
    }, FUI_NUMBER_INCREMENT_DECREMENT_DELAY);
  }

  /**
   * We add the fui-number-decrementing class to the decrement button for visual feedback.
   * @private
   */
  private setDecrementing() {
    if (this.isDecrementing) {
      return;
    }
    this.isDecrementing = true;
    setTimeout(() => {
      this.isDecrementing = false;
      this.cd.markForCheck();
    }, FUI_NUMBER_INCREMENT_DECREMENT_DELAY);
  }
}
