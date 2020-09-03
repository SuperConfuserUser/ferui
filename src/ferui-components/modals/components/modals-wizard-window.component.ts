import { Subscription } from 'rxjs';

import { Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { FeruiUtils } from '../../utils/ferui-utils';
import {
  FUI_MODAL_CTRL_TOKEN,
  FUI_MODAL_WINDOW_CTRL_TOKEN,
  FuiModalWizardWindowCtrl,
  FuiModalWizardWindowScreen,
  ModalWindowInteractionEnum
} from '../interfaces/modals-interfaces';
import {
  FUI_MODAL_CHILD_WINDOW_TPLT,
  FUI_MODAL_CLOSE_TPLT,
  FUI_MODAL_WINDOW_ERROR_MSG,
  FUI_MODAL_WINDOW_TITLE_TPLT,
  FUI_MODAL_WINDOW_WIZARD_FOOTER_TPLT
} from '../modals-window-templates';

import { FuiModalAbstractWindowComponent } from './modals-abstract-window.component';

/**
 * Modal window component class for Wizard type window.
 */
@Component({
  template: `<div
    class="fui-modal-container fui-modal-wizard-window"
    [class.fui-modal-has-child-window-open]="windowCtrl.hasChildWindowOpen"
    [style.width.px]="windowCtrl.width"
    [ngClass]="windowCtrl.cssClass"
  >
    <div class="fui-modal-header" *ngIf="windowCtrl.title || windowCtrl.subtitle || windowCtrl.titleTemplate">
      <div class="fui-modal-header-title-wrapper">${FUI_MODAL_WINDOW_TITLE_TPLT}</div>
      <div class="fui-modal-header-close">${FUI_MODAL_CLOSE_TPLT}</div>
    </div>
    <div class="fui-modal-body">
      <div #wizardStepsContainer class="fui-modal-wizard-steps" [style.max-width.px]="wizardStepsWidth">
        <ul>
          <li
            [class.clickable]="i < windowCtrl.currentStepIndex - 1"
            (click)="i < windowCtrl.currentStepIndex - 1 && windowCtrl.$back($event, i)"
            *ngFor="let step of windowCtrl.wizardSteps; let i = index"
            [class.selected]="i === windowCtrl.currentStepIndex - 1"
          >
            {{ step.label }}
          </li>
        </ul>
      </div>
      <div class="fui-modal-wizard-body">
        ${FUI_MODAL_WINDOW_ERROR_MSG}
        <ng-template #componentHost></ng-template>
      </div>
    </div>
    <div
      class="fui-modal-footer"
      *ngIf="windowCtrl.withSubmitBtn || windowCtrl.withCancelBtn || windowCtrl.withBackBtn || windowCtrl.withNextBtn"
    >
      ${FUI_MODAL_WINDOW_WIZARD_FOOTER_TPLT}
    </div>
    ${FUI_MODAL_CHILD_WINDOW_TPLT}
  </div>`
})
export class FuiModalWizardWindowComponent
  extends FuiModalAbstractWindowComponent<FuiModalWizardWindowCtrl, FuiModalWizardWindowScreen>
  implements OnInit, OnDestroy {
  wizardStepsWidth: number;
  @ViewChild('wizardStepsContainer', { read: ElementRef }) wizardStepsContainer: ElementRef;
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    // We want to set a fixed width for the steps container (left wrapper of the wizard).
    // But since the steps list is fully compiled only after the viewInit lifecycle (thanks to the *ngFor loop in template) and
    // because we can't update any template variable outside of ngOnInit or ngOnCheck, we need to rebuild the steps manually during
    // the ngOnInit lifecycle and feed the FeruiUtils.getPreferredWidthForItem() function with this list in order to get
    // the best width value for this container.
    const ulElement: HTMLElement = this.wizardStepsContainer.nativeElement.children[0].cloneNode(true) as HTMLElement;
    this.windowCtrl.wizardSteps.forEach((step, i) => {
      const liElement = document.createElement('li');
      if (i === this.windowCtrl.currentStepIndex - 1) {
        liElement.classList.add('selected');
      } else {
        liElement.classList.remove('selected');
      }
      liElement.innerHTML = step.label;
      ulElement.append(liElement);
    });

    // We use a 5px margin to be certain of the width needed (calculations varies depending on the browser you're using).
    this.wizardStepsWidth = FeruiUtils.getPreferredWidthForItem(ulElement, this.wizardStepsContainer.nativeElement, 5);

    // We render the first step at initialisation.
    this.renderStep(this.windowCtrl.currentStepIndex - 1);
    this.subscriptions.push(
      this.modalCtrl.onWindowInteractionObservable(this.windowCtrl.id).subscribe(windowInteraction => {
        if (windowInteraction && windowInteraction.type === ModalWindowInteractionEnum.NEXT) {
          this.renderStep(this.windowCtrl.currentStepIndex - 1, windowInteraction.args);
        } else if (windowInteraction && windowInteraction.type === ModalWindowInteractionEnum.BACK) {
          this.renderStep(this.windowCtrl.currentStepIndex - 1, windowInteraction.args);
        }
      })
    );
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Render the step using its index in the list.
   * Unlike Standard or Headless window types, the wizard doesn't need to have a component attribute on the main window
   * configuration, instead we have a list of steps who have each their own component.
   * @param stepIndex The index of the step we try to render.
   * @param args
   */
  renderStep(stepIndex: number, args?: any): void {
    if (!this.windowCtrl.wizardSteps && this.windowCtrl.wizardSteps.length === 0 && !this.viewContainerRef) {
      return;
    }
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      this.windowCtrl.wizardSteps[stepIndex].component
    );
    this.viewContainerRef.clear();
    this.componentRef = this.viewContainerRef.createComponent(
      componentFactory,
      null,
      Injector.create({
        providers: [
          {
            provide: FUI_MODAL_CTRL_TOKEN,
            useFactory: () => this.modalCtrl,
            deps: []
          },
          {
            provide: FUI_MODAL_WINDOW_CTRL_TOKEN,
            useFactory: () => this.windowCtrl,
            deps: []
          }
        ],
        parent: this.injector
      })
    );
    this.windowCtrl.$init(args);
  }
}
