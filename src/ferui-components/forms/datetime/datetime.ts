import { filter } from 'rxjs/operators';

import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { AbstractDateTime } from '../common/abstract-date-time';
import { FuiDatetimeModelTypes } from '../common/datetime-model-types.enum';
import { DateFormControlService } from '../common/providers/date-form-control.service';

import { FuiDatetimeContainerComponent } from './datetime-container';
import { DatetimeFormControlService } from './providers/datetime-form-control.service';
import { DatetimeIOService } from './providers/datetime-io.service';

@Directive({
  selector: '[fuiDatetime]',
  host: {
    '[class.fui-datetime]': 'true',
    '[class.fui-layout-small]': 'layout === fuiFormLayoutEnum.SMALL'
  }
})
// tslint:disable-next-line:prettier
export class FuiDatetimeDirective
  extends AbstractDateTime<FuiDatetimeContainerComponent>
  implements AfterViewInit, OnInit, OnDestroy {
  protected index = 1;

  @Input('fuiDatetime')
  set modelType(modelType: FuiDatetimeModelTypes) {
    this._modelType = modelType;
    if (this.datetimeFormControlService) {
      this.datetimeFormControlService.setModelType(modelType);
    }
  }

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    protected control: NgControl,
    renderer: Renderer2,
    el: ElementRef,
    @Optional() protected container: FuiDatetimeContainerComponent,
    @Optional() protected iOService: DatetimeIOService,
    @Optional() private dateFormControlService: DateFormControlService,
    @Optional() private datetimeFormControlService: DatetimeFormControlService
  ) {
    super(vcr, FuiDatetimeContainerComponent, injector, control, renderer, el);
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

  ngOnInit() {
    super.ngOnInit();
    this.populateServicesFromContainerComponent();
    this.subscriptions.push(this.listenForTouchChanges(), this.listenForDirtyChanges());
  }

  ngAfterViewInit() {
    this.processInitialInputs();
  }

  /**
   * Populates the services from the container component.
   */
  private populateServicesFromContainerComponent(): void {
    if (!this.container) {
      this.iOService = this.getProviderFromContainer(DatetimeIOService);
      this.dateFormControlService = this.getProviderFromContainer(DateFormControlService);
      this.datetimeFormControlService = this.getProviderFromContainer(DatetimeFormControlService);
    }
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
