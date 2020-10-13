import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FuiTooltipConfig } from './tooltip-interfaces';
import { FuiTooltipDirective } from './tooltip.directive';
import { FuiTooltipModule } from './tooltip.module';

import Spy = jasmine.Spy;

@Component({
  template: `
    <button class="events" fuiTooltip="foo">hover</button>

    <button class="disable" fuiTooltip="foo" [fuiTooltipConfig]="config">hover</button>
  `
})
class TestComponent {
  config: FuiTooltipConfig;
}

export default function (): void {
  describe('TooltipDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let anchor: DebugElement;
    let tooltip: FuiTooltipDirective;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [FuiTooltipModule],
        declarations: [TestComponent]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(TestComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });
    }));

    describe('Events', () => {
      let openSpy: Spy;
      let closeSpy: Spy;

      beforeEach(() => {
        anchor = fixture.debugElement.query(By.css('.events'));
        tooltip = anchor.injector.get(FuiTooltipDirective);
        openSpy = spyOn(tooltip, 'onMouseEnter').and.callThrough();
        closeSpy = spyOn(tooltip, 'onMouseLeave').and.callThrough();
      });

      it('should toggle tooltip on mouseenter and mouseleave events', () => {
        anchor.triggerEventHandler('mouseenter', {});
        fixture.detectChanges();

        // check if tooltip has been created
        expect(openSpy).toHaveBeenCalled();
        expect(document.querySelector('.fui-tooltip')).not.toBeNull();

        anchor.triggerEventHandler('mouseleave', {});
        fixture.detectChanges();

        // check if tooltip has been removed
        expect(closeSpy).toHaveBeenCalled();
        expect(document.querySelector('.fui-tooltip')).toBeNull();
      });

      it('should toggle tooltip on focusin and focusout events', () => {
        anchor.nativeElement.dispatchEvent(new Event('focusin'));
        fixture.detectChanges();

        // check if tooltip has been created
        expect(openSpy).toHaveBeenCalled();
        expect(document.querySelector('.fui-tooltip')).not.toBeNull();

        anchor.nativeElement.dispatchEvent(new Event('focusout'));
        fixture.detectChanges();

        // check if tooltip has been removed
        expect(closeSpy).toHaveBeenCalled();
        expect(document.querySelector('.fui-tooltip')).toBeNull();
      });
    });

    describe('Disable', () => {
      it('should allow the tooltip to be enabled and disabled', () => {
        anchor = fixture.debugElement.query(By.css('.disable'));
        tooltip = anchor.injector.get(FuiTooltipDirective);

        component.config = {
          isDisabled: false
        };
        fixture.detectChanges();
        tooltip.onMouseEnter();
        fixture.detectChanges();

        // tooltip should be created from trigger event when not disabled
        expect(tooltip.config.isDisabled).toBe(false);
        expect(document.querySelector('.fui-tooltip')).not.toBeNull();

        tooltip.onMouseLeave();
        fixture.detectChanges();
        component.config = {
          isDisabled: true
        };
        fixture.detectChanges();
        tooltip.onMouseEnter();
        fixture.detectChanges();

        // tooltip should not be created from trigger event when disabled
        expect(tooltip.config.isDisabled).toBe(true);
        expect(document.querySelector('.fui-tooltip')).toBeNull();
      });
    });
  });
}
