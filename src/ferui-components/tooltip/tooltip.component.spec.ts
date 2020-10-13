import { Component, DebugElement, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { FuiTooltipConfig, FuiTooltipPlacementEnum, TooltipComponentTypeContent } from './tooltip-interfaces';
import { FuiTooltipDirective, TOOLTIP_DEFAULT_CONFIG } from './tooltip.directive';
import { FuiTooltipModule } from './tooltip.module';

@Component({
  template: `
    <button class="default" fuiTooltip="foo" style="position: absolute; top: 50%; left: 50%">hover</button>

    <button class="content-type" [fuiTooltip]="content">hover</button>

    <ng-template #myTemplate>
      <div>foo bar template</div>
    </ng-template>

    <button class="config" fuiTooltip="foo" [fuiTooltipConfig]="config">hover</button>

    <button class="placement" fuiTooltip="foo" [fuiTooltipConfig]="config" [ngStyle]="style">hover</button>
  `
})
class TestComponent {
  @ViewChild('myTemplate') myTemplate: TemplateRef<any>;

  content: string | TemplateRef<any> | TooltipComponentTypeContent = 'placeholder';
  config: FuiTooltipConfig;
  style: { [key: string]: any };
}

/*
 * Test component used for component type content
 */
@Component({
  template: `<div>Hello {{ name }}!</div>`
})
class HelloComponent {
  name: string = 'world';
}

export default function (): void {
  describe('TooltipComponent', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let anchor: DebugElement;
    let tooltip: FuiTooltipDirective;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [FuiTooltipModule],
        declarations: [TestComponent, HelloComponent]
      })
        .overrideModule(BrowserDynamicTestingModule, {
          set: {
            entryComponents: [HelloComponent]
          }
        })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(TestComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });
    }));

    describe('Content type', () => {
      beforeEach(() => {
        anchor = fixture.debugElement.query(By.css('.content-type'));
        tooltip = anchor.injector.get(FuiTooltipDirective);
      });

      it('should display string type content', () => {
        const content = `I'm a string!`;
        component.content = content;
        fixture.detectChanges();
        tooltip.onMouseEnter();
        fixture.detectChanges();

        // check tooltip for the string content
        expect(tooltip.content).toBe(content);
        expect(document.querySelector('.fui-tooltip').innerHTML).toContain(content);
      });

      it('should display HTML string type content', () => {
        const content = `<span class="html-string">I have html!</span>`;
        component.content = content;
        fixture.detectChanges();
        tooltip.onMouseEnter();
        fixture.detectChanges();

        // check tooltip for compiled html class and content
        expect(tooltip.content).toBe(content);
        expect(document.querySelector('.html-string').innerHTML).toContain('html!');
      });

      it('should display template type content', () => {
        component.content = fixture.componentInstance.myTemplate;
        fixture.detectChanges();
        tooltip.onMouseEnter();
        fixture.detectChanges();

        // check tooltip for content from the template
        expect(tooltip.content instanceof TemplateRef).toBe(true);
        expect(document.querySelector('.fui-tooltip').innerHTML).toContain('foo bar template');
      });

      it('should display component type content', () => {
        const content = {
          component: HelloComponent
        };
        component.content = content;
        fixture.detectChanges();
        tooltip.onMouseEnter();
        fixture.detectChanges();

        // check tooltip for default content generated from the component
        expect(tooltip.content).toBe(content);
        expect(document.querySelector('.fui-tooltip').innerHTML).toContain('Hello world');
      });

      it('should display component type content with input values', () => {
        const content = {
          component: HelloComponent,
          input: { name: 'foo' }
        };
        component.content = content;
        fixture.detectChanges();
        tooltip.onMouseEnter();
        fixture.detectChanges();

        // check tooltip for customized content generated from the component
        expect(tooltip.content).toBe(content);
        expect(document.querySelector('.fui-tooltip').innerHTML).toContain('Hello foo');
      });
    });

    describe('Config settings', () => {
      beforeEach(() => {
        anchor = fixture.debugElement.query(By.css('.config'));
        tooltip = anchor.injector.get(FuiTooltipDirective);
      });

      it('should have default settings when no configs are set', () => {
        anchor = fixture.debugElement.query(By.css('.default'));
        tooltip = anchor.injector.get(FuiTooltipDirective);

        tooltip.onMouseEnter();
        fixture.detectChanges();

        // main config should be the default
        expect(tooltip.config).toEqual(TOOLTIP_DEFAULT_CONFIG);

        // default class should be applied
        expect(document.querySelector('.fui-tooltip').classList).toContain(TOOLTIP_DEFAULT_CONFIG.cssClass);
        // arrow should be shown
        expect(document.querySelector('.fui-tooltip-arrow')).not.toBeNull();
        // default placement should be applied with no repositioning (tooltip is placed in the center of the view)
        expect(document.querySelector('.fui-tooltip-arrow').classList).toContain(TOOLTIP_DEFAULT_CONFIG.placement);
        // default arrow width should be applied
        expect(document.querySelector('.fui-tooltip-arrow').getAttribute('style')).toContain(
          `width: ${TOOLTIP_DEFAULT_CONFIG.arrowSize.width}px`
        );
        // default arrow height should be applied
        expect(document.querySelector('.fui-tooltip-arrow').getAttribute('style')).toContain(
          `height: ${TOOLTIP_DEFAULT_CONFIG.arrowSize.height}px`
        );
      });

      it('should have custom settings when configs are set', () => {
        const config = {
          offset: 10,
          placement: FuiTooltipPlacementEnum.LEFT,
          cssClass: 'foo-class',
          tooltipStyle: 'color: red',
          arrowSize: { width: 10, height: 10 }
        };

        component.config = config;
        fixture.detectChanges();
        tooltip.onMouseEnter();
        fixture.detectChanges();

        // main config should be new config
        expect(tooltip.config).toEqual({ ...TOOLTIP_DEFAULT_CONFIG, ...config });

        // tooltip should have custom css class
        expect(document.querySelector('.fui-tooltip').classList).toContain(config.cssClass);
        // tooltip should have custom style
        expect(document.querySelector('.fui-tooltip').getAttribute('style')).toContain(config.tooltipStyle);
        // tooltip should have custom placement
        expect(document.querySelector('.fui-tooltip-arrow').classList).toContain(config.placement);
        // tooltip should have custom arrow width
        expect(document.querySelector('.fui-tooltip-arrow').getAttribute('style')).toContain(
          `width: ${config.arrowSize.width}px`
        );
        // tooltip should have custom arrow height
        expect(document.querySelector('.fui-tooltip-arrow').getAttribute('style')).toContain(
          `height: ${config.arrowSize.height}px`
        );
      });

      it('should allow the arrow to be disabled through configuration', () => {
        component.config = {
          arrow: false
        };
        fixture.detectChanges();
        tooltip.onMouseEnter();
        fixture.detectChanges();

        // tooltip should not have an arrow
        expect(tooltip.config.arrow).toBe(false);
        expect(document.querySelector('.fui-tooltip')).not.toBeNull();
        expect(document.querySelector('.fui-tooltip-arrow')).toBeNull();
      });

      it('should allow a custom arrow through configuration', () => {
        const config = {
          arrow: `<svg class="mySvgArrow"></svg>`
        };

        component.config = config;
        fixture.detectChanges();
        tooltip.onMouseEnter();
        fixture.detectChanges();

        // tooltip should have the custom svg arrow
        expect(tooltip.config.arrow).toBe(config.arrow);
        expect(document.querySelector('.fui-tooltip-arrow').innerHTML).toContain(config.arrow);
      });
    });

    describe('Auto reposition', () => {
      beforeEach(() => {
        anchor = fixture.debugElement.query(By.css('.placement'));
        tooltip = anchor.injector.get(FuiTooltipDirective);
      });

      it('should reposition the tooltip when there is not enough space at the top', () => {
        const config = { placement: FuiTooltipPlacementEnum.TOP };

        component.config = config;
        component.style = {
          position: 'absolute',
          top: 0,
          left: '50%'
        };
        fixture.detectChanges();
        tooltip.onMouseEnter();
        fixture.detectChanges();

        // tooltip repositions to a better placement when anchor placed at the very top
        expect(document.querySelector('.fui-tooltip-arrow').classList).not.toContain(config.placement);
      });

      it('should reposition the tooltip when there is not enough space at the bottom', () => {
        const config = { placement: FuiTooltipPlacementEnum.BOTTOM };

        component.config = config;
        component.style = {
          position: 'absolute',
          top: '100%',
          left: '50%'
        };

        fixture.detectChanges();
        tooltip.onMouseEnter();
        fixture.detectChanges();

        // tooltip repositions to a better placement when anchor placed at the very bottom
        expect(document.querySelector('.fui-tooltip-arrow').classList).not.toContain(config.placement);
      });

      it('should reposition the tooltip when there is not enough space on the left', () => {
        const config = { placement: FuiTooltipPlacementEnum.LEFT };

        component.config = config;
        component.style = {
          position: 'absolute',
          top: '50%',
          left: 0
        };

        fixture.detectChanges();
        tooltip.onMouseEnter();
        fixture.detectChanges();

        // tooltip repositions to a better placement when anchor placed at the left edge
        expect(document.querySelector('.fui-tooltip-arrow').classList).not.toContain(config.placement);
      });

      it('should reposition the tooltip when there is not enough space on the right', () => {
        const config = { placement: FuiTooltipPlacementEnum.RIGHT };

        component.config = config;
        component.style = {
          position: 'absolute',
          top: '50%',
          left: '100%'
        };

        fixture.detectChanges();
        tooltip.onMouseEnter();
        fixture.detectChanges();

        // tooltip repositions to a better placement when anchor placed at the right edge
        expect(document.querySelector('.fui-tooltip-arrow').classList).not.toContain(config.placement);
      });
    });
  });
}
