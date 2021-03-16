import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Injector,
  Input,
  OnInit,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { WrappedFormControl } from '../common/wrapped-control';

import { FuiNumberContainerComponent } from './number-container';
import { NumberIoService } from './providers/number-io.service';

@Directive({
  selector: '[fuiNumber]',
  host: {
    '[class.fui-number]': 'true',
    '[class.fui-layout-small]': 'layout === fuiFormLayoutEnum.SMALL'
  }
})
export class FuiNumberDirective extends WrappedFormControl<FuiNumberContainerComponent> implements OnInit {
  @Input()
  @HostBinding('attr.autocomplete')
  autocomplete: string = 'off';

  @Input('step')
  set step(value: number) {
    if (this.numberIOService) {
      this.numberIOService.step = value;
    }
  }

  @Input('max')
  set max(value: number) {
    if (this.numberIOService) {
      this.numberIOService.max = value;
    }
  }

  @Input('min')
  set min(value: number) {
    if (this.numberIOService) {
      this.numberIOService.min = value;
    }
  }

  protected index = 1;

  @HostBinding('attr.min')
  get nativeMin(): string {
    if (this.numberIOService && this.numberIOService.min !== null && this.numberIOService.min !== undefined) {
      return this.numberIOService.min.toString();
    }
    return '';
  }

  @HostBinding('attr.max')
  get nativeMax(): string {
    if (this.numberIOService && this.numberIOService.max !== null && this.numberIOService.max !== undefined) {
      return this.numberIOService.max.toString();
    }
    return '';
  }

  @HostBinding('attr.step')
  get nativeStep(): string {
    if (this.numberIOService && this.numberIOService.step !== null && this.numberIOService.step !== undefined) {
      return this.numberIOService.step.toString();
    }
    return '';
  }

  @HostBinding('attr.type')
  get inputType(): string {
    return 'number';
  }

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self() @Optional() control: NgControl,
    renderer: Renderer2,
    el: ElementRef,
    @Optional() private numberIOService: NumberIoService,
    private cd: ChangeDetectorRef
  ) {
    super(vcr, FuiNumberContainerComponent, injector, control, renderer, el);
  }

  ngOnInit() {
    super.ngOnInit();
    // If the service is not loaded we load it from the parent component
    // It happens when you don't wrap the input manually with fui-number-container).
    if (!this.numberIOService) {
      this.numberIOService = this.loadServiceFromParent<NumberIoService>(null, NumberIoService);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
      if (this.numberIOService) {
        this.numberIOService.onKeyPressed.next(e.code);
        e.preventDefault();
      }
    }
  }
}
