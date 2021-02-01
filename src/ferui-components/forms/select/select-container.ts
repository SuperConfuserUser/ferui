import { AfterContentInit, ChangeDetectorRef, Component, ContentChild, OnInit } from '@angular/core';

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

import { FuiSelectIconDirective } from './select-icon';
import { FuiSelectService } from './select.service';

@Component({
  selector: 'fui-select-container',
  template: `
    <div class="fui-control-container" [ngClass]="controlClass()">
      <div class="fui-select-wrapper">
        <ng-content select="[fuiSelectIcon]"></ng-content>
        <ng-content select="[fuiSelect]"></ng-content>
        <ng-content select="[fuiLabel]"></ng-content>
        <div class="select-arrow"></div>
        <label class="fui-control-icons" tabindex="0" [class.invalid]="invalid">
          <ng-content *ngIf="!invalid" select="[fuiHelper]"></ng-content>
          <clr-icon *ngIf="invalid" class="fui-error-icon is-red" shape="fui-error" aria-hidden="true"></clr-icon>
        </label>
        <fui-default-control-error>
          <ng-content select="fui-control-error" *ngIf="invalid"></ng-content>
        </fui-default-control-error>
      </div>
    </div>
  `,
  host: {
    '[class.fui-form-control]': 'true',
    '[class.fui-select-container]': 'true',
    '[class.fui-form-control-small]': 'controlLayout() === fuiFormLayoutEnum.SMALL',
    '[class.fui-form-control-disabled]': 'ngControl?.disabled',
    '[class.fui-select-icon]': 'selectIcon !== undefined'
  },
  providers: [
    IfErrorService,
    NgControlService,
    ControlIdService,
    ControlClassService,
    PlaceholderService,
    FocusService,
    RequiredControlService,
    FuiSelectService,
    FuiFormLayoutService
  ]
})
export class FuiSelectContainerComponent extends FuiFormAbstractContainer implements OnInit, AfterContentInit {
  @ContentChild(FuiSelectIconDirective) selectIcon: FuiSelectIconDirective;
  @ContentChild(FuiHelperDirective) fuiHelper: FuiHelperDirective;

  protected placeholder: string = null;

  constructor(
    ifErrorService: IfErrorService,
    controlClassService: ControlClassService,
    ngControlService: NgControlService,
    focusService: FocusService,
    formLayoutService: FuiFormLayoutService,
    cd: ChangeDetectorRef,
    protected selectService: FuiSelectService
  ) {
    super(ifErrorService, controlClassService, ngControlService, focusService, formLayoutService, cd);
  }

  ngOnInit(): void {
    this.selectService.fuiSelectContainer = this;
    if (this.label) {
      this.subscriptions.push(
        this.label.value.subscribe(value => {
          this.placeholder = value;
          if (this.selectService.fuiSelect && this.selectService.fuiSelect.hasNgSelect()) {
            this.selectService.fuiSelect.ngSelect.placeholder = this.placeholder;
          }
        }),
        this.label.focusChange.subscribe(focused => {
          if (this.selectService && this.selectService.fuiSelect.hasNgSelect()) {
            if (focused) {
              this.selectService.fuiSelect.ngSelect.open();
            }
          }
        })
      );
    }
  }

  ngAfterContentInit(): void {
    if (this.selectService && this.selectService.fuiSelect.hasNgSelect()) {
      if (this.placeholder) {
        this.selectService.fuiSelect.ngSelect.placeholder = this.placeholder;
      }
      this.selectService.fuiSelect.ngSelect.hasFuiHelper = !!this.fuiHelper;
      let isNgSelectOpen: boolean = false;
      if (this.selectIcon) {
        this.selectService.fuiSelect.ngSelect.useIcon = true;
        this.subscriptions.push(
          this.selectIcon.onClick.subscribe(() => {
            if (isNgSelectOpen) {
              this.selectService.fuiSelect.ngSelect.close();
              this.selectIcon.clicked = false;
            } else {
              this.selectService.fuiSelect.ngSelect.open();
              this.selectIcon.clicked = true;
            }
          })
        );
      }

      this.subscriptions.push(
        this.selectService.fuiSelect.ngSelect.openEvent.subscribe(() => {
          isNgSelectOpen = true;
          this.focus = true;
          if (this.selectIcon) {
            this.selectIcon.focused = true;
          }
        })
      );
      this.subscriptions.push(
        this.selectService.fuiSelect.ngSelect.closeEvent.subscribe(() => {
          isNgSelectOpen = false;
          this.focus = false;
          if (this.selectIcon) {
            this.selectIcon.focused = false;
          }
        })
      );
    }
  }
}
