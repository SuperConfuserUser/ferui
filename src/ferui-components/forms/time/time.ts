import { of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  PLATFORM_ID,
  Renderer2,
  Self,
  ViewContainerRef
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { AbstractDateTime } from '../common/abstract-date-time';
import { FuiDatetimeModelTypes } from '../common/datetime-model-types.enum';
import { DateFormControlService } from '../common/providers/date-form-control.service';

import { TimeModel } from './models/time.model';
import { TimeIOService } from './providers/time-io.service';
import { TimeSelectionService } from './providers/time-selection.service';
import { FuiTimeContainerComponent } from './time-container';

@Directive({
  selector: '[fuiTime]',
  host: {
    '[class.fui-time]': 'true',
    '[class.fui-layout-small]': 'layout === fuiFormLayoutEnum.SMALL'
  }
})
export class FuiTimeDirective extends AbstractDateTime<FuiTimeContainerComponent> implements OnInit, AfterViewInit, OnDestroy {
  protected index = 1;

  /**
   * Sets the input type to text when the datepicker is enabled. Reverts back to the native date input
   * when the datepicker is disabled. Datepicker is disabled on mobiles.
   */
  @HostBinding('attr.type')
  get inputType(): string {
    return isPlatformBrowser(this.platformId) ? 'text' : 'time';
  }

  @Input('fuiTime')
  set modelType(modelType: FuiDatetimeModelTypes) {
    if (modelType === FuiDatetimeModelTypes.STRING || modelType === FuiDatetimeModelTypes.DATE) {
      this._modelType = modelType;
    }
  }

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    protected renderer: Renderer2,
    protected el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Self()
    @Optional()
    protected control: NgControl,
    @Optional() protected container: FuiTimeContainerComponent,
    @Optional() protected iOService: TimeIOService,
    @Optional() protected timeSelectionService: TimeSelectionService,
    @Optional() private dateFormControlService: DateFormControlService
  ) {
    super(vcr, FuiTimeContainerComponent, injector, control, renderer, el);
  }

  @HostListener('change', ['$event.target'])
  onValueChange(target: HTMLInputElement) {
    const validDateValue = this.iOService.getDateValueFromDateOrString(target.value);
    if (validDateValue) {
      this.updateDate(validDateValue, true);
    } else {
      this.emitDateOutput(null);
    }
  }

  /**
   * 1. Populate services if the date container is not present.
   * 2. Initialize Subscriptions.
   * 3. Process User Input.
   */
  ngOnInit() {
    super.ngOnInit();
    this.populateServicesFromContainerComponent();
    this.subscriptions.push(
      this.listenForSelectedTimeChanges(),
      this.listenForControlValueChanges(),
      this.listenForTouchChanges(),
      this.listenForDirtyChanges()
    );
  }

  ngAfterViewInit() {
    this.processInitialInputs();
  }

  protected resetControl() {
    this.timeSelectionService.notifySelectedTime(null);
  }

  /**
   * Populates the services from the container component.
   */
  private populateServicesFromContainerComponent(): void {
    if (!this.container) {
      this.iOService = this.getProviderFromContainer(TimeIOService);
      this.dateFormControlService = this.getProviderFromContainer(DateFormControlService);
      this.timeSelectionService = this.getProviderFromContainer(TimeSelectionService);
    }
  }

  private listenForSelectedTimeChanges() {
    return this.timeSelectionService.selectedTimeChange.subscribe((timeModel: TimeModel) => {
      if (timeModel) {
        this.updateDate(timeModel.toDate(), true);
      }
    });
  }

  private listenForControlValueChanges() {
    return of(this.dateInputHasFormControl())
      .pipe(
        filter(hasControl => hasControl),
        switchMap(() => this.control.valueChanges)
      )
      .subscribe((value: string) => {
        this.updateDate(this.iOService.getDateValueFromDateOrString(value));
      });
  }

  private listenForTouchChanges() {
    return this.dateFormControlService.touchedChange
      .pipe(filter(() => this.dateInputHasFormControl()))
      .subscribe(() => this.control.control.markAsTouched());
  }

  private listenForDirtyChanges() {
    return this.dateFormControlService.dirtyChange
      .pipe(filter(() => this.dateInputHasFormControl()))
      .subscribe(() => this.control.control.markAsDirty());
  }
}
