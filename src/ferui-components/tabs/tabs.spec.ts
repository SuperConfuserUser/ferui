import { Observable } from 'rxjs';

import { LEFT_ARROW } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { dispatchKeyboardEvent } from '../testing/dispatch-events';

import { FuiTabComponent } from './tab';
import { FuiTabHeaderPosition, FuiTabsComponent } from './tabs';
import { FuiTabsModule } from './tabs.module';

export default function () {
  describe('FuiTabsComponent', () => {
    beforeEach(fakeAsync(() => {
      TestBed.configureTestingModule({
        imports: [FuiTabsModule, CommonModule],
        declarations: [
          SimpleTabsTestApp,
          SimpleDynamicTabsTestApp,
          AsyncTabsTestApp,
          DisabledTabsTestApp,
          FuiTabsWithSimpleApi,
          TemplateTabs,
          FuiTabsWithAriaInputs,
          FuiTabsWithIsActiveBinding
        ]
      });

      TestBed.compileComponents();
    }));

    describe('basic behavior', () => {
      let fixture: ComponentFixture<SimpleTabsTestApp>;
      let element: HTMLElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(SimpleTabsTestApp);
        element = fixture.nativeElement;
      });

      it('should default to the first tab', () => {
        checkSelectedIndex(1, fixture);
      });

      it('will properly load content on first change detection pass', () => {
        fixture.detectChanges();
        expect(element.querySelectorAll('.fui-tab-body')[1].querySelectorAll('span').length).toBe(3);
      });

      it('should change selected index on click', () => {
        const component = fixture.debugElement.componentInstance;
        component.selectedIndex = 0;
        checkSelectedIndex(0, fixture);

        // select the second tab
        let tabLabel = fixture.debugElement.queryAll(By.css('.fui-tab-label'))[1];
        tabLabel.nativeElement.click();
        checkSelectedIndex(1, fixture);

        // select the third tab
        tabLabel = fixture.debugElement.queryAll(By.css('.fui-tab-label'))[2];
        tabLabel.nativeElement.click();
        checkSelectedIndex(2, fixture);
      });

      it('should support two-way binding for selectedIndex', fakeAsync(() => {
        const component = fixture.componentInstance;
        component.selectedIndex = 0;

        fixture.detectChanges();

        const tabLabel = fixture.debugElement.queryAll(By.css('.fui-tab-label'))[1];
        tabLabel.nativeElement.click();
        fixture.detectChanges();
        tick();

        expect(component.selectedIndex).toBe(1);
      }));

      // Note: needs to be `async` in order to fail when we expect it to.
      it('should set to correct tab on fast change', async(() => {
        const component = fixture.componentInstance;
        component.selectedIndex = 0;
        fixture.detectChanges();

        setTimeout(() => {
          component.selectedIndex = 1;
          fixture.detectChanges();

          setTimeout(() => {
            component.selectedIndex = 0;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expect(component.selectedIndex).toBe(0);
            });
          }, 1);
        }, 1);
      }));

      it('should change tabs based on selectedIndex', fakeAsync(() => {
        const component = fixture.componentInstance;
        const tabComponent = fixture.debugElement.query(By.css('fui-tabs')).componentInstance;

        spyOn(component, 'handleSelection').and.callThrough();

        checkSelectedIndex(1, fixture);

        tabComponent.selectedIndex = 2;

        checkSelectedIndex(2, fixture);
        tick();

        expect(component.handleSelection).toHaveBeenCalledTimes(1);
        expect(component.selectEvent.index).toBe(2);
      }));

      it('should clamp the selected index to the size of the number of tabs', () => {
        fixture.detectChanges();
        const component: FuiTabsComponent = fixture.debugElement.query(By.css('fui-tabs')).componentInstance;

        // Set the index to be negative, expect first tab selected
        fixture.componentInstance.selectedIndex = -1;
        fixture.detectChanges();
        expect(component.selectedIndex).toBe(0);

        // Set the index beyond the size of the tabs, expect last tab selected
        fixture.componentInstance.selectedIndex = 3;
        fixture.detectChanges();
        expect(component.selectedIndex).toBe(2);
      });

      it('should not crash when setting the selected index to NaN', () => {
        const component = fixture.debugElement.componentInstance;

        expect(() => {
          component.selectedIndex = NaN;
          fixture.detectChanges();
        }).not.toThrow();
      });

      it('should set the isActive flag on each of the tabs', fakeAsync(() => {
        fixture.detectChanges();
        tick();

        const tabs = fixture.componentInstance.tabs.toArray();

        expect(tabs[0].isActive).toBe(false);
        expect(tabs[1].isActive).toBe(true);
        expect(tabs[2].isActive).toBe(false);

        fixture.componentInstance.selectedIndex = 2;
        fixture.detectChanges();
        tick();

        expect(tabs[0].isActive).toBe(false);
        expect(tabs[1].isActive).toBe(false);
        expect(tabs[2].isActive).toBe(true);
      }));

      it('should add the proper `aria-setsize` and `aria-posinset`', () => {
        fixture.detectChanges();

        const labels = Array.from(element.querySelectorAll('.fui-tab-label'));

        expect(labels.map(label => label.getAttribute('aria-posinset'))).toEqual(['1', '2', '3']);
        expect(labels.every(label => label.getAttribute('aria-setsize') === '3')).toBe(true);
      });

      it('should emit focusChange event on click', () => {
        spyOn(fixture.componentInstance, 'handleFocus');
        fixture.detectChanges();

        const tabLabels = fixture.debugElement.queryAll(By.css('.fui-tab-label'));

        expect(fixture.componentInstance.handleFocus).toHaveBeenCalledTimes(0);

        tabLabels[1].nativeElement.click();
        fixture.detectChanges();

        expect(fixture.componentInstance.handleFocus).toHaveBeenCalledTimes(1);
        expect(fixture.componentInstance.handleFocus).toHaveBeenCalledWith(jasmine.objectContaining({ index: 1 }));
      });

      it('should emit focusChange on arrow key navigation', () => {
        spyOn(fixture.componentInstance, 'handleFocus');
        fixture.detectChanges();

        const tabLabels = fixture.debugElement.queryAll(By.css('.fui-tab-label'));
        const tabLabelContainer = fixture.debugElement.query(By.css('.fui-tab-label-container')).nativeElement as HTMLElement;

        expect(fixture.componentInstance.handleFocus).toHaveBeenCalledTimes(0);

        // In order to verify that the `focusChange` event also fires with the correct
        // index, we focus the second tab before testing the keyboard navigation.
        tabLabels[1].nativeElement.click();
        fixture.detectChanges();

        expect(fixture.componentInstance.handleFocus).toHaveBeenCalledTimes(1);

        dispatchKeyboardEvent(tabLabelContainer, 'keydown', LEFT_ARROW);

        expect(fixture.componentInstance.handleFocus).toHaveBeenCalledTimes(2);
        expect(fixture.componentInstance.handleFocus).toHaveBeenCalledWith(jasmine.objectContaining({ index: 0 }));
      });
    });

    describe('aria labelling', () => {
      let fixture: ComponentFixture<FuiTabsWithAriaInputs>;
      let tab: HTMLElement;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(FuiTabsWithAriaInputs);
        fixture.detectChanges();
        tick();
        tab = fixture.nativeElement.querySelector('.fui-tab-label');
      }));

      it('should not set aria-label or aria-labelledby attributes if they are not passed in', () => {
        expect(tab.hasAttribute('aria-label')).toBe(false);
        expect(tab.hasAttribute('aria-labelledby')).toBe(false);
      });

      it('should set the aria-label attribute', () => {
        fixture.componentInstance.ariaLabel = 'Fruit';
        fixture.detectChanges();

        expect(tab.getAttribute('aria-label')).toBe('Fruit');
      });

      it('should set the aria-labelledby attribute', () => {
        fixture.componentInstance.ariaLabelledby = 'fruit-label';
        fixture.detectChanges();

        expect(tab.getAttribute('aria-labelledby')).toBe('fruit-label');
      });

      it('should not be able to set both an aria-label and aria-labelledby', () => {
        fixture.componentInstance.ariaLabel = 'Fruit';
        fixture.componentInstance.ariaLabelledby = 'fruit-label';
        fixture.detectChanges();

        expect(tab.getAttribute('aria-label')).toBe('Fruit');
        expect(tab.hasAttribute('aria-labelledby')).toBe(false);
      });
    });

    describe('disable tabs', () => {
      let fixture: ComponentFixture<DisabledTabsTestApp>;
      beforeEach(() => {
        fixture = TestBed.createComponent(DisabledTabsTestApp);
      });

      it('should have one disabled tab', () => {
        fixture.detectChanges();
        const labels = fixture.debugElement.queryAll(By.css('.fui-tab-disabled'));
        expect(labels.length).toBe(1);
        expect(labels[0].nativeElement.getAttribute('aria-disabled')).toBe('true');
      });

      it('should set the disabled flag on tab', () => {
        fixture.detectChanges();

        const tabs = fixture.componentInstance.tabs.toArray();
        let labels = fixture.debugElement.queryAll(By.css('.fui-tab-disabled'));
        expect(tabs[2].disabled).toBe(false);
        expect(labels.length).toBe(1);
        expect(labels[0].nativeElement.getAttribute('aria-disabled')).toBe('true');

        fixture.componentInstance.isDisabled = true;
        fixture.detectChanges();

        expect(tabs[2].disabled).toBe(true);
        labels = fixture.debugElement.queryAll(By.css('.fui-tab-disabled'));
        expect(labels.length).toBe(2);
        expect(labels.every(label => label.nativeElement.getAttribute('aria-disabled') === 'true')).toBe(true);
      });
    });

    describe('dynamic binding tabs', () => {
      let fixture: ComponentFixture<SimpleDynamicTabsTestApp>;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(SimpleDynamicTabsTestApp);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
      }));

      it('should update selected index if the last tab removed while selected', fakeAsync(() => {
        const component: FuiTabsComponent = fixture.debugElement.query(By.css('fui-tabs')).componentInstance;

        const numberOfTabs = component._tabs.length;
        fixture.componentInstance.selectedIndex = numberOfTabs - 1;
        fixture.detectChanges();
        tick();

        // Remove last tab while last tab is selected, expect next tab over to be selected
        fixture.componentInstance.tabs.pop();
        fixture.detectChanges();
        tick();

        expect(component.selectedIndex).toBe(numberOfTabs - 2);
      }));

      it('should maintain the selected tab if a new tab is added', () => {
        fixture.detectChanges();
        const component: FuiTabsComponent = fixture.debugElement.query(By.css('fui-tabs')).componentInstance;

        fixture.componentInstance.selectedIndex = 1;
        fixture.detectChanges();

        // Add a new tab at the beginning.
        fixture.componentInstance.tabs.unshift({ label: 'New tab', content: 'at the start' });
        fixture.detectChanges();

        expect(component.selectedIndex).toBe(2);
        expect(component._tabs.toArray()[2].isActive).toBe(true);
      });

      it('should maintain the selected tab if a tab is removed', () => {
        // Select the second tab.
        fixture.componentInstance.selectedIndex = 1;
        fixture.detectChanges();

        const component: FuiTabsComponent = fixture.debugElement.query(By.css('fui-tabs')).componentInstance;

        // Remove the first tab that is right before the selected one.
        fixture.componentInstance.tabs.splice(0, 1);
        fixture.detectChanges();

        // Since the first tab has been removed and the second one was selected before, the selected
        // tab moved one position to the right. Meaning that the tab is now the first tab.
        expect(component.selectedIndex).toBe(0);
        expect(component._tabs.toArray()[0].isActive).toBe(true);
      });

      it('should be able to select a new tab after creation', fakeAsync(() => {
        fixture.detectChanges();
        const component: FuiTabsComponent = fixture.debugElement.query(By.css('fui-tabs')).componentInstance;

        fixture.componentInstance.tabs.push({ label: 'Last tab', content: 'at the end' });
        fixture.componentInstance.selectedIndex = 3;

        fixture.detectChanges();
        tick();

        expect(component.selectedIndex).toBe(3);
        expect(component._tabs.toArray()[3].isActive).toBe(true);
      }));

      it('should not fire `selectedTabChange` when the amount of tabs changes', fakeAsync(() => {
        fixture.detectChanges();
        fixture.componentInstance.selectedIndex = 1;
        fixture.detectChanges();

        // Add a new tab at the beginning.
        spyOn(fixture.componentInstance, 'handleSelection');
        fixture.componentInstance.tabs.unshift({ label: 'New tab', content: 'at the start' });
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(fixture.componentInstance.handleSelection).not.toHaveBeenCalled();
      }));
    });

    describe('async tabs', () => {
      let fixture: ComponentFixture<AsyncTabsTestApp>;

      it('should show tabs when they are available', fakeAsync(() => {
        fixture = TestBed.createComponent(AsyncTabsTestApp);

        expect(fixture.debugElement.queryAll(By.css('.fui-tab-label')).length).toBe(0);

        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        expect(fixture.debugElement.queryAll(By.css('.fui-tab-label')).length).toBe(2);
      }));
    });

    describe('with simple api', () => {
      let fixture: ComponentFixture<FuiTabsWithSimpleApi>;
      let tabGroup: FuiTabsComponent;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(FuiTabsWithSimpleApi);
        fixture.detectChanges();
        tick();

        tabGroup = fixture.debugElement.query(By.directive(FuiTabsComponent)).componentInstance as FuiTabsComponent;
      }));

      it('should support a fui-tabs with the simple api', fakeAsync(() => {
        expect(getSelectedLabel(fixture).textContent).toMatch('Junk food');
        expect(getSelectedContent(fixture).textContent).toMatch('Pizza, fries');

        tabGroup.selectedIndex = 2;
        fixture.detectChanges();
        tick();

        expect(getSelectedLabel(fixture).textContent).toMatch('Fruit');
        expect(getSelectedContent(fixture).textContent).toMatch('Apples, grapes');

        fixture.componentInstance.otherLabel = 'Chips';
        fixture.componentInstance.otherContent = 'Salt, vinegar';
        fixture.detectChanges();

        expect(getSelectedLabel(fixture).textContent).toMatch('Chips');
        expect(getSelectedContent(fixture).textContent).toMatch('Salt, vinegar');
      }));

      it('should support @ViewChild in the tab content', () => {
        expect(fixture.componentInstance.legumes).toBeTruthy();
      });

      it('should only have the active tab in the DOM', fakeAsync(() => {
        expect(fixture.nativeElement.textContent).toContain('Pizza, fries');
        expect(fixture.nativeElement.textContent).not.toContain('Peanuts');

        tabGroup.selectedIndex = 3;
        fixture.detectChanges();
        tick();

        expect(fixture.nativeElement.textContent).not.toContain('Pizza, fries');
        expect(fixture.nativeElement.textContent).toContain('Peanuts');
      }));

      it('should support setting the header position', () => {
        const tabGroupNode = fixture.debugElement.query(By.css('fui-tabs')).nativeElement;

        expect(tabGroupNode.classList).not.toContain('fui-tabs-inverted-header');

        tabGroup.headerPosition = 'below';
        fixture.detectChanges();

        expect(tabGroupNode.classList).toContain('fui-tabs-inverted-header');
      });
    });

    describe('lazy loaded tabs', () => {
      it('should lazy load the second tab', fakeAsync(() => {
        const fixture = TestBed.createComponent(TemplateTabs);
        fixture.detectChanges();
        tick();

        const secondLabel = fixture.debugElement.queryAll(By.css('.fui-tab-label'))[1];
        secondLabel.nativeElement.click();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const child = fixture.debugElement.query(By.css('.child'));
        expect(child.nativeElement).toBeDefined();
      }));
    });

    describe('special cases', () => {
      it('should not throw an error when binding isActive to the view', fakeAsync(() => {
        const fixture = TestBed.createComponent(FuiTabsWithIsActiveBinding);

        expect(() => {
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
        }).not.toThrow();

        expect(fixture.nativeElement.textContent).toContain('pizza is active');
      }));
    });

    /**
     * Checks that the `selectedIndex` has been updated; checks that the label and body have their
     * respective `active` classes
     */
    function checkSelectedIndex(expectedIndex: number, fixture: ComponentFixture<any>) {
      fixture.detectChanges();

      const tabComponent: FuiTabsComponent = fixture.debugElement.query(By.css('fui-tabs')).componentInstance;
      expect(tabComponent.selectedIndex).toBe(expectedIndex);

      const tabLabelElement = fixture.debugElement.query(By.css(`.fui-tab-label:nth-of-type(${expectedIndex + 1})`))
        .nativeElement;
      expect(tabLabelElement.classList.contains('fui-tab-label-active')).toBe(true);

      const tabContentElement = fixture.debugElement.query(By.css(`fui-tab-body:nth-of-type(${expectedIndex + 1})`))
        .nativeElement;
      expect(tabContentElement.classList.contains('fui-tab-body-active')).toBe(true);
    }

    function getSelectedLabel(fixture: ComponentFixture<any>): HTMLElement {
      return fixture.nativeElement.querySelector('.fui-tab-label-active');
    }

    function getSelectedContent(fixture: ComponentFixture<any>): HTMLElement {
      return fixture.nativeElement.querySelector('.fui-tab-body-active');
    }
  });
}
/* tslint:disable */
@Component({
  template: `
    <fui-tabs
      class="custom-class"
      [(selectedIndex)]="selectedIndex"
      [headerPosition]="headerPosition"
      (focusChange)="handleFocus($event)"
      (selectedTabChange)="handleSelection($event)"
    >
      <fui-tab>
        <ng-template fui-tab-label>Tab One</ng-template>
        Tab one content
      </fui-tab>
      <fui-tab>
        <ng-template fui-tab-label>Tab Two</ng-template>
        <span>Tab </span><span>two</span><span>content</span>
      </fui-tab>
      <fui-tab>
        <ng-template fui-tab-label>Tab Three</ng-template>
        Tab three content
      </fui-tab>
    </fui-tabs>
  `
})
class SimpleTabsTestApp {
  @ViewChildren(FuiTabComponent) tabs: QueryList<FuiTabComponent>;
  selectedIndex: number = 1;
  focusEvent: any;
  selectEvent: any;
  disableRipple: boolean = false;
  headerPosition: FuiTabHeaderPosition = 'above';

  handleFocus(event: any) {
    this.focusEvent = event;
  }

  handleSelection(event: any) {
    this.selectEvent = event;
  }
}

@Component({
  template: `
    <fui-tabs
      class="fui-tabs"
      [(selectedIndex)]="selectedIndex"
      (focusChange)="handleFocus($event)"
      (selectedTabChange)="handleSelection($event)"
    >
      <fui-tab *ngFor="let tab of tabs">
        <ng-template fui-tab-label>{{ tab.label }}</ng-template>
        {{ tab.content }}
      </fui-tab>
    </fui-tabs>
  `
})
class SimpleDynamicTabsTestApp {
  tabs = [
    { label: 'Label 1', content: 'Content 1' },
    { label: 'Label 2', content: 'Content 2' },
    { label: 'Label 3', content: 'Content 3' }
  ];
  selectedIndex: number = 1;
  focusEvent: any;
  selectEvent: any;

  handleFocus(event: any) {
    this.focusEvent = event;
  }

  handleSelection(event: any) {
    this.selectEvent = event;
  }
}

@Component({
  selector: 'test-app',
  template: `
    <fui-tabs class="fui-tabs">
      <fui-tab>
        <ng-template fui-tab-label>Tab One</ng-template>
        Tab one content
      </fui-tab>
      <fui-tab disabled>
        <ng-template fui-tab-label>Tab Two</ng-template>
        Tab two content
      </fui-tab>
      <fui-tab [disabled]="isDisabled">
        <ng-template fui-tab-label>Tab Three</ng-template>
        Tab three content
      </fui-tab>
    </fui-tabs>
  `
})
class DisabledTabsTestApp {
  @ViewChildren(FuiTabComponent) tabs: QueryList<FuiTabComponent>;
  isDisabled = false;
}

@Component({
  template: `
    <fui-tabs class="fui-tabs">
      <fui-tab *ngFor="let tab of tabs | async">
        <ng-template fui-tab-label>{{ tab.label }}</ng-template>
        {{ tab.content }}
      </fui-tab>
    </fui-tabs>
  `
})
class AsyncTabsTestApp implements OnInit {
  tabs: Observable<any>;

  private _tabs = [
    { label: 'one', content: 'one' },
    { label: 'two', content: 'two' }
  ];

  ngOnInit() {
    // Use ngOnInit because there is some issue with scheduling the async task in the constructor.
    this.tabs = new Observable((observer: any) => {
      setTimeout(() => observer.next(this._tabs));
    });
  }
}

@Component({
  template: `
    <fui-tabs>
      <fui-tab label="Junk food"> Pizza, fries</fui-tab>
      <fui-tab label="Vegetables"> Broccoli, spinach</fui-tab>
      <fui-tab [label]="otherLabel"> {{ otherContent }} </fui-tab>
      <fui-tab label="Legumes"><p #legumes>Peanuts</p></fui-tab>
    </fui-tabs>
  `
})
class FuiTabsWithSimpleApi {
  otherLabel = 'Fruit';
  otherContent = 'Apples, grapes';
  @ViewChild('legumes') legumes: any;
}

@Component({
  selector: 'nested-tabs',
  template: `
    <fui-tabs>
      <fui-tab label="One">Tab one content</fui-tab>
      <fui-tab label="Two">
        Tab two content
        <fui-tabs>
          <fui-tab label="Inner tab one">Inner content one</fui-tab>
          <fui-tab label="Inner tab two">Inner content two</fui-tab>
        </fui-tabs>
      </fui-tab>
    </fui-tabs>
  `
})
class NestedTabs {}

@Component({
  selector: 'template-tabs',
  template: `
    <fui-tabs>
      <fui-tab label="One"> Eager </fui-tab>
      <fui-tab label="Two">
        <ng-template fuiTabContent>
          <div class="child">Hi</div>
        </ng-template>
      </fui-tab>
    </fui-tabs>
  `
})
class TemplateTabs {}

@Component({
  template: `
    <fui-tabs>
      <fui-tab [aria-label]="ariaLabel" [aria-labelledby]="ariaLabelledby"></fui-tab>
    </fui-tabs>
  `
})
class FuiTabsWithAriaInputs {
  ariaLabel: string;
  ariaLabelledby: string;
}

@Component({
  template: `
    <fui-tabs>
      <fui-tab label="Junk food" #pizza> Pizza, fries</fui-tab>
      <fui-tab label="Vegetables"> Broccoli, spinach</fui-tab>
    </fui-tabs>

    <div *ngIf="pizza.isActive">pizza is active</div>
  `
})
class FuiTabsWithIsActiveBinding {}
