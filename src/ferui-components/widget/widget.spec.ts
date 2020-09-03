import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FuiCheckboxDirective, FuiCheckboxWrapperComponent } from '../forms/checkbox/index';
import { FuiDatetimeModelTypes } from '../forms/common/datetime-model-types.enum';
import { FuiDateContainerComponent, FuiDateDirective } from '../forms/date/index';

import { FuiWidgetActionsComponent } from './widget-actions.component';
import { FuiWidgetBodyComponent } from './widget-body.component';
import { FuiWidgetFooterComponent } from './widget-footer.component';
import { FuiWidgetHeaderComponent } from './widget-header.component';
import { FuiWidgetSubtitleComponent } from './widget-subtitle.component';
import { FuiWidgetTitleComponent } from './widget-title.component';
import { FuiWidgetComponent } from './widget.component';
import { FuiWidgetModule } from './widget.module';

@Component({
  template: `
    <fui-widget>
      <fui-widget-header>
        <fui-widget-title>Widget title</fui-widget-title>
        <fui-widget-subtitle>Widget subtitle</fui-widget-subtitle>
      </fui-widget-header>
      <fui-widget-body>Widget Body</fui-widget-body>
      <fui-widget-footer>Widget footer</fui-widget-footer>
    </fui-widget>
  `
})
class WidgetWithTextContent {}

@Component({
  template: `
    <fui-widget>
      <fui-widget-header>
        <fui-widget-title>Widget title</fui-widget-title>
        <fui-widget-subtitle>Widget subtitle</fui-widget-subtitle>
        <fui-widget-actions>
          <fui-date-container class="m-0">
            <label>Start Date</label>
            <input
              name="userDate"
              type="date"
              placeholder="Choose a date from datepicker"
              [fuiDate]="params.dateType"
              [(ngModel)]="models.date"
            />
          </fui-date-container>
        </fui-widget-actions>
      </fui-widget-header>
      <fui-widget-body>
        <fui-checkbox-wrapper>
          <input type="checkbox" fuiCheckbox name="checkboxTwo" [(ngModel)]="models.checkbox" />
          <label>Option 2</label>
        </fui-checkbox-wrapper>
      </fui-widget-body>
      <fui-widget-footer>Widget footer</fui-widget-footer>
    </fui-widget>
  `
})
class WidgetWithComponents {
  params = {
    dateType: FuiDatetimeModelTypes.DATE
  };
  models = {
    date: new Date(),
    checkbox: false
  };
}

export default function (): void {
  describe('FuiWidgetComponent component', () => {
    let fixture: ComponentFixture<any>;

    describe('FuiWidgetComponent with text content', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [FuiWidgetModule],
          declarations: [WidgetWithTextContent]
        });
        fixture = TestBed.createComponent(WidgetWithTextContent);
        fixture.detectChanges();
      });

      it('FuiWidgetComponent directive is created', () => {
        const elmt = fixture.debugElement.query(By.directive(FuiWidgetComponent));
        expect(elmt).toBeDefined();
      });

      describe('Widget body', () => {
        it('FuiWidgetBodyComponent directive is created', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetBodyComponent));
          expect(elmt).toBeDefined();
        });

        it('FuiWidgetBodyComponent has text content', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetBodyComponent));
          expect(elmt.nativeElement.textContent).toEqual('Widget Body');
        });
      });

      describe('Widget header', () => {
        it('FuiWidgetHeaderComponent directive is created', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetHeaderComponent));
          expect(elmt).toBeDefined();
        });

        it('FuiWidgetTitleComponent directive is created', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetTitleComponent));
          expect(elmt).toBeDefined();
        });

        it('FuiWidgetTitleComponent has text content', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetTitleComponent));
          expect(elmt.nativeElement.textContent).toEqual('Widget title');
        });

        it('FuiWidgetSubtitleComponent directive is created', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetSubtitleComponent));
          expect(elmt).toBeDefined();
        });

        it('FuiWidgetSubtitleComponent has text content', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetSubtitleComponent));
          expect(elmt.nativeElement.textContent).toEqual('Widget subtitle');
        });
      });

      describe('Widget footer', () => {
        it('FuiWidgetFooterComponent directive is created', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetFooterComponent));
          expect(elmt).toBeDefined();
        });

        it('FuiWidgetTitleComponent has text content', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetFooterComponent));
          expect(elmt.nativeElement.textContent).toEqual('Widget footer');
        });
      });
    });

    describe('FuiWidgetComponent with components', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [FuiWidgetModule],
          declarations: [WidgetWithTextContent]
        });
        fixture = TestBed.createComponent(WidgetWithTextContent);
        fixture.detectChanges();
      });

      it('FuiWidgetComponent directive is created', () => {
        const elmt = fixture.debugElement.query(By.directive(FuiWidgetComponent));
        expect(elmt).toBeDefined();
      });

      describe('Widget header', () => {
        it('FuiWidgetHeaderComponent directive is created', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetHeaderComponent));
          expect(elmt).toBeDefined();
        });

        it('FuiWidgetActionsComponent directive is created', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetActionsComponent));
          expect(elmt).toBeDefined();
        });

        it('FuiWidgetActionsComponent directive contains a component', () => {
          let elmt = fixture.debugElement.query(By.directive(FuiDateContainerComponent));
          expect(elmt).toBeDefined();
          elmt = fixture.debugElement.query(By.directive(FuiDateDirective));
          expect(elmt).toBeDefined();
        });
      });

      describe('Widget body', () => {
        it('FuiWidgetBodyComponent directive is created', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetBodyComponent));
          expect(elmt).toBeDefined();
        });

        it('FuiWidgetBodyComponent contains a component', () => {
          let elmt = fixture.debugElement.query(By.directive(FuiCheckboxWrapperComponent));
          expect(elmt).toBeDefined();
          elmt = fixture.debugElement.query(By.directive(FuiCheckboxDirective));
          expect(elmt).toBeDefined();
        });
      });
    });
  });
}
