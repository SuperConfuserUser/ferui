import { Component } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { IfErrorService } from '../common/if-error/if-error.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { DateFormControlService } from '../common/providers/date-form-control.service';
import { FocusService } from '../common/providers/focus.service';
import { FuiFormLayoutService } from '../common/providers/form-layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { PlaceholderService } from '../common/providers/placeholder.service';
import { RequiredControlService } from '../common/providers/required-control.service';
import { LocaleHelperService } from '../datepicker/providers/locale-helper.service';
import { TestContext } from '../tests/helpers.spec';

import { FuiDatetimeContainerComponent } from './datetime-container';
import { DatetimeFormControlService } from './providers/datetime-form-control.service';
import { DatetimeIOService } from './providers/datetime-io.service';

export default function () {
  describe('Datetime Container Component', () => {
    let context: TestContext<FuiDatetimeContainerComponent, TestComponent>;
    let dateFormControlService: DatetimeFormControlService;

    beforeEach(function () {
      TestBed.configureTestingModule({
        imports: [FormsModule]
      });
      TestBed.overrideComponent(FuiDatetimeContainerComponent, {
        set: {
          providers: [
            PlaceholderService,
            RequiredControlService,
            LocaleHelperService,
            ControlClassService,
            IfErrorService,
            FocusService,
            NgControlService,
            DatetimeIOService,
            ControlIdService,
            DateFormControlService,
            DatetimeFormControlService,
            FuiFormLayoutService
          ]
        }
      });

      context = this.create(FuiDatetimeContainerComponent, TestComponent, []);
      dateFormControlService = context.getFeruiProvider(DatetimeFormControlService);
    });

    describe('View Basics', () => {
      beforeEach(() => {
        context.detectChanges();
      });

      it('applies the fui-form-control class', () => {
        expect(context.feruiElement.className).toContain('fui-form-control');
      });

      it('projects the time input', () => {
        context.detectChanges();
        expect(context.feruiElement.querySelector('input')).not.toBeNull();
      });

      it('tracks the disabled state', async(() => {
        expect(context.feruiElement.className).not.toContain('fui-form-control-disabled');
        context.testComponent.disabled = true;
        context.detectChanges();
        // Have to wait for the whole control to settle or it doesn't track
        context.fixture.whenStable().then(() => {
          context.detectChanges();
          expect(context.feruiElement.className).toContain('fui-form-control-disabled');
        });
      }));
    });

    describe('Typescript API', () => {
      it('returns the classes to apply to the control', () => {
        expect(context.feruiDirective.controlClass()).not.toContain('fui-error');
        context.feruiDirective.invalid = true;
        expect(context.feruiDirective.controlClass()).toContain('fui-error');
        context.feruiDirective.invalid = false;
        expect(context.feruiDirective.controlClass()).not.toContain('fui-error');
      });
    });
  });
}

@Component({
  template: `
    <fui-datetime-container>
      <input type="datetime-local" fuiDatetime [(ngModel)]="model" [disabled]="disabled" />
    </fui-datetime-container>
  `
})
class TestComponent {
  model = '';
  disabled = false;
}
