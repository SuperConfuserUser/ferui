import * as jsBeautify from 'js-beautify';

import { Component, ViewEncapsulation } from '@angular/core';

import {
  FuiTooltipConfig,
  FuiTooltipPlacementEnum,
  FuiTooltipThemeEnum,
  TooltipComponentTypeContent
} from '../../../../../ferui-components/tooltip/tooltip-interfaces';
import { TOOLTIP_DEFAULT_CONFIG } from '../../../../../ferui-components/tooltip/tooltip.directive';

import { TooltipContentExampleComponent } from './components/tooltip-content-example.component';

@Component({
  selector: 'tooltip-demo',
  templateUrl: './tooltip.demo.html',
  styleUrls: ['./tooltip.demo.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TooltipDemoComponent {
  TOOLTIP_DEFAULT_CONFIG = TOOLTIP_DEFAULT_CONFIG;
  FuiTooltipPlacementEnum = FuiTooltipPlacementEnum;
  FuiTooltipThemeEnum = FuiTooltipThemeEnum;

  // documentation section code examples
  usageHtmlExample: string = jsBeautify.html(`
    <code fuiTooltip="I'm a default tooltip!">fuiTooltip</code>
    <code fuiTooltip="I'm a customized tooltip!" [fuiTooltipConfig]="{ cssClass: FuiTooltipThemeEnum.PRIMARY, placement: FuiTooltipPlacementEnum.BOTTOM }">fuiTooltipConfig</code>
  `);

  tooltipComponentTypeContentExample: string = `interface TooltipComponentTypeContent {
  component: Type<any>; // component to generate for the tooltip content
  input?: { [key: string]: any }; // optional input values for the component
}`;

  fuiTooltipConfigInterfaceExample = `interface FuiTooltipConfig {
  offset?: number; // distance of the tooltip from it's anchor element in px
  placement?: FuiTooltipPlacementEnum; // placement of the tooltip relative to it's anchor element
  cssClass?: FuiTooltipThemeEnum | string; // pre-built theme class or any custom CSS classes to apply to the tooltip. List should be space separated.
  tooltipStyle?: string; // additional styling to apply to the tooltip. HTML inline style format.
  arrow?: boolean | string; // boolean value for whether to show the default arrow or a string value for a custom svg arrow
  arrowSize?: TooltipArrowSize; // tooltip arrow size in px
  isDisabled?: boolean; // whether the tooltip should be disabled
  fixedParent?: boolean; // whether the parent element is position: fixed
}`;

  fuiTooltipConfigDefaultsExample = `const TOOLTIP_DEFAULT_CONFIG: FuiTooltipConfig = {
  offset: ${this.TOOLTIP_DEFAULT_CONFIG.offset},
  placement: '${this.TOOLTIP_DEFAULT_CONFIG.placement}',
  cssClass: '${this.TOOLTIP_DEFAULT_CONFIG.cssClass}',
  tooltipStyle: ${this.TOOLTIP_DEFAULT_CONFIG.tooltipStyle},
  arrow: ${this.TOOLTIP_DEFAULT_CONFIG.arrow},
  arrowSize: { width: ${this.TOOLTIP_DEFAULT_CONFIG.arrowSize.width}, height: ${this.TOOLTIP_DEFAULT_CONFIG.arrowSize.height} },
  isDisabled: ${this.TOOLTIP_DEFAULT_CONFIG.isDisabled},
  fixedParent: ${this.TOOLTIP_DEFAULT_CONFIG.fixedParent}
};`;

  tooltipPlacementTypeExample: string = `enum FuiTooltipPlacementEnum {
  TOP = 'top',
  BOTTOM = 'bottom',
  RIGHT = 'right',
  LEFT = 'left'
}`;

  tooltipThemesTypeExample: string = `enum FuiTooltipThemeEnum {
  PRIMARY = 'tooltip-primary',
  SECONDARY = 'tooltip-secondary',
  SUCCESS = 'tooltip-success',
  DANGER = 'tooltip-danger',
  WARNING = 'tooltip-warning',
  INFO = 'tooltip-info',
  LIGHT = 'tooltip-light',
  DARK = 'tooltip-dark'
}`;

  arrowSizeInterfaceExample = `interface TooltipArrowSize {
  width: number; // width of the tooltip arrow in px
  height: number; // height of the tooltip arrow in px
}`;

  defaultStyleCssExample: string = `// base class
.fui-tooltip {
  position: absolute;
  font-size: $tooltip-font-size; // 12px
  line-height: 1.15; // 14px
  text-align: center;
  word-wrap: break-word;
  padding: 0.375rem 0.625rem; // 6px 10px
  max-width: 500px;
  border-radius: $tooltip-border-radius; // 3px
  z-index: $zindex-tooltip; // 1070
}

// default theme
.tooltip-info {
  color: color-yiq($background); // #fff
  background: $background; // #252a3a
  fill: $background; // #252a3a - fill color for the tooltip's SVG arrow
}`;

  disabledSpecialCaseExample: string = jsBeautify.html(`
    <!-- doesn't work -->
    <button type="button" class="btn btn-primary" [disabled]="true" fuiTooltip="Nope!">Disabled</button>

    <!-- works -->
    <span fuiTooltip="I'm a workaround!">
      <button type="button" class="btn btn-primary" [disabled]="true">Disabled</button>
    </span>
  `);

  enableFixedDemo: boolean = false;

  fixedSpecialCaseExample: string = jsBeautify.html(`
    <button type="button" class="btn btn-secondary" fuiTooltip="Fix me!" [fuiTooltipConfig]="{ cssClass: FuiTooltipThemeEnum.SECONDARY }">Unfixed</button>
    <button type="button" class="btn btn-secondary" fuiTooltip="I'm fixed!" [fuiTooltipConfig]="{ cssClass: FuiTooltipThemeEnum.SECONDARY, fixedParent: true }">Fixed</button>
  `);

  // example section code examples
  myComponentContent: TooltipComponentTypeContent = {
    component: TooltipContentExampleComponent
  };

  myAdvancedComponentContent: TooltipComponentTypeContent = {
    component: TooltipContentExampleComponent,
    input: {
      name: 'customized component'
    }
  };

  contentHtmlExample: string = jsBeautify.html(`
    <button type="button" class="btn btn-primary" fuiTooltip="I'm a string!">Plain Text</button>
    <button type="button" class="btn btn-primary" fuiTooltip="I'm <strong>strong</strong>! 💪">HTML Content</button>
    <button type="button" class="btn btn-primary" [fuiTooltip]="myTemplate">Template</button>
    <button type="button" class="btn btn-primary" [fuiTooltip]="myComponentContent">Component</button>
    <button type="button" class="btn btn-primary" [fuiTooltip]="myAdvancedComponentContent">Advanced Component</button>

    <!-- template type content -->
    <ng-template #myTemplate>
      <div>I'm a <em>template</em>!</div>
    </ng-template>
  `);

  contentTypescriptExample: string = `@Component({
  templateUrl: './tooltip.demo.html',
  styleUrls: ['./tooltip.demo.scss']
})
export class TooltipDemoComponent {
  // component type content
  myComponentContent: TooltipComponentTypeContent = {
    component: TooltipContentExampleComponent
  };

  // component type content with input values
  myAdvancedComponentContent: TooltipComponentTypeContent = {
    component: TooltipContentExampleComponent,
    input: {
      name: 'customized component'
    }
  };
}

// component to be generated for the tooltip content
@Component({
  template: \`I'm a {{ name }}!\`
})
export class TooltipContentExampleComponent {
  name: string = 'component';
}`;

  placementHtmlExample: string = jsBeautify.html(`
    <button type="button" class="btn btn-primary" fuiTooltip="Hi five!">Default</button>
    <button type="button" class="btn btn-primary" fuiTooltip="Up high!" [fuiTooltipConfig]="{ placement: FuiTooltipPlacementEnum.TOP }">Top</button>
    <button type="button" class="btn btn-primary" fuiTooltip="Down low!" [fuiTooltipConfig]="{ placement: FuiTooltipPlacementEnum.BOTTOM }">Bottom</button>
    <button type="button" class="btn btn-primary" fuiTooltip="To the side!" [fuiTooltipConfig]="{ placement: FuiTooltipPlacementEnum.RIGHT }">Right</button>
    <button type="button" class="btn btn-primary" fuiTooltip="Too slow!" [fuiTooltipConfig]="{ placement: FuiTooltipPlacementEnum.LEFT }">Left</button>
  `);

  edgeCaseMessage = `I'm an edge case!`;
  cornerCaseMessage = `I'm a corner case!`;
  enableRepositionDemo: boolean = false;

  repositionHtmlExample: string = jsBeautify.html(`
<!-- default - no repositioning -->
  <button type="button" class="btn btn-secondary window-position window-centered" fuiTooltip="I'm reasonably placed!" [fuiTooltipConfig]="{ cssClass: FuiTooltipThemeEnum.SECONDARY, fixedParent: true }">Default</button>

<!-- edge cases -->
  <button type="button" class="btn btn-secondary window-position window-top" fuiTooltip="I'm an edge case!" [fuiTooltipConfig]="{ placement: FuiTooltipPlacementEnum.TOP, cssClass: FuiTooltipThemeEnum.SECONDARY, fixedParent: true }">Top</button>
  <button type="button" class="btn btn-secondary window-position window-bottom" fuiTooltip="I'm an edge case!" [fuiTooltipConfig]="{ placement: FuiTooltipPlacementEnum.BOTTOM, cssClass: FuiTooltipThemeEnum.SECONDARY, fixedParent: true }">Bottom</button>
  <button type="button" class="btn btn-secondary window-position window-left" fuiTooltip="I'm an edge case!" [fuiTooltipConfig]="{ placement: FuiTooltipPlacementEnum.LEFT, cssClass: FuiTooltipThemeEnum.SECONDARY, fixedParent: true }">Left</button>
  <button type="button" class="btn btn-secondary window-position window-right" fuiTooltip="I'm an edge case!" [fuiTooltipConfig]="{ placement: FuiTooltipPlacementEnum.RIGHT, cssClass: FuiTooltipThemeEnum.SECONDARY, fixedParent: true }">Right</button>

<!-- corner cases -->
  <button type="button" class="btn btn-secondary window-position window-top-left" fuiTooltip="I'm a corner case!" [fuiTooltipConfig]="{ placement: FuiTooltipPlacementEnum.TOP, cssClass: FuiTooltipThemeEnum.SECONDARY, fixedParent: true }">Top</button>
  <button type="button" class="btn btn-secondary window-position window-top-right" fuiTooltip="I'm a corner case!" [fuiTooltipConfig]="{ placement: FuiTooltipPlacementEnum.RIGHT, cssClass: FuiTooltipThemeEnum.SECONDARY, fixedParent: true }">Right</button>
  <button type="button" class="btn btn-secondary window-position window-bottom-right" fuiTooltip="I'm a corner case!" [fuiTooltipConfig]="{ placement: FuiTooltipPlacementEnum.BOTTOM, cssClass: FuiTooltipThemeEnum.SECONDARY, fixedParent: true }">Bottom</button>
  <button type="button" class="btn btn-secondary window-position window-bottom-left" fuiTooltip="I'm a corner case!" [fuiTooltipConfig]="{ placement: FuiTooltipPlacementEnum.LEFT, cssClass: FuiTooltipThemeEnum.SECONDARY, fixedParent: true }">Left</button>
  `);

  themesHtmlExample: string = jsBeautify.html(`
    <button type="button" class="btn btn-primary" fuiTooltip="I'm first!" [fuiTooltipConfig]="{ cssClass: FuiTooltipThemeEnum.PRIMARY }">Primary</button>
    <button type="button" class="btn btn-secondary" fuiTooltip="I'm second!" [fuiTooltipConfig]="{ cssClass: FuiTooltipThemeEnum.SECONDARY }">Secondary</button>
    <button type="button" class="btn btn-success" fuiTooltip="I'm successful!" [fuiTooltipConfig]="{ cssClass: FuiTooltipThemeEnum.SUCCESS }">Success</button>
    <button type="button" class="btn btn-danger" fuiTooltip="Uh oh!" [fuiTooltipConfig]="{ cssClass: FuiTooltipThemeEnum.DANGER }">Danger</button>
    <button type="button" class="btn btn-warning" fuiTooltip="I'm warning you!" [fuiTooltipConfig]="{ cssClass: FuiTooltipThemeEnum.WARNING }">Warning</button>
    <button type="button" class="btn btn-info" fuiTooltip="I'm informative!" [fuiTooltipConfig]="{ cssClass: FuiTooltipThemeEnum.INFO }">Info</button>
    <button type="button" class="btn btn-light" fuiTooltip="I'm bright! 😎" [fuiTooltipConfig]="{ cssClass: FuiTooltipThemeEnum.LIGHT }">Light</button>
    <button type="button" class="btn btn-dark" fuiTooltip="I'm dark! 🤩" [fuiTooltipConfig]="{ cssClass: FuiTooltipThemeEnum.DARK }">Dark</button>
  `);

  myStyleConfig: FuiTooltipConfig = {
    tooltipStyle: `color: #252a3a;
      background-color: ghostwhite;
      border: 1px solid gainsboro;
      fill: ghostwhite;
      stroke: gainsboro;
      stroke-width: 1px;
      filter:
        drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08))
        drop-shadow(0 3px 1px rgba(0, 0, 0, 0.10))
        drop-shadow(0 1px 5px rgba(0, 0, 0, 0.08))
        drop-shadow(0 -1px 2px rgba(0, 0, 0, 0.06))`
  };

  customStyleHtmlExample: string = jsBeautify.html(`
    <button type="button" class="btn btn-primary" fuiTooltip="I'm basic!">Default</button>
    <button type="button" class="btn btn-primary" fuiTooltip="I'm classy!" [fuiTooltipConfig]="{ cssClass: 'pretty-tooltip', arrow: false}">Class</button>
    <button type="button" class="btn btn-primary" fuiTooltip="I'm classier! 🦄" [fuiTooltipConfig]="{ cssClass: 'pretty-tooltip fancy-tooltip' }">Classes</button>
    <button type="button" class="btn btn-primary" fuiTooltip="I'm stylish!" [fuiTooltipConfig]="myStyleConfig">Style</button>
  `);

  customStyleCssExample: string = `.pretty-tooltip {
  color: white;
  font-size: 14px;
  font-weight: bold;
  background: rgb(58, 105, 180);
  background: linear-gradient(90deg, rgba(58, 105, 180, 1) 0%, rgba(163, 117, 250, 1) 55%, rgba(255, 117, 247, 1) 100%);
  padding: 7px 10px;
}

.fancy-tooltip {
  color: deeppink;
  background: pink;
  border: 1px solid deeppink;
  // SVG arrow styling
  fill: pink;
  stroke: deeppink;
  stroke-width: 0.75px;
}`;

  customStyleTypescriptExample: string = `@Component({
  templateUrl: './tooltip.demo.html',
  styleUrls: ['./tooltip.demo.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TooltipDemoComponent {
  // for demo purposes only - using a class for all this styling would be the better choice
  myStyleConfig: FuiTooltipConfig = {
    tooltipStyle: \`color: #252a3a;
      background-color: ghostwhite;
      border: 1px solid gainsboro;
      fill: ghostwhite;
      stroke: gainsboro;
      stroke-width: 1px;
      filter:
        drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08))
        drop-shadow(0 3px 1px rgba(0, 0, 0, 0.10))
        drop-shadow(0 1px 5px rgba(0, 0, 0, 0.08))
        drop-shadow(0 -1px 2px rgba(0, 0, 0, 0.06))\`
  };
}`;

  myCustomArrow = `
  <svg style="fill: Azure; stroke: CadetBlue; stroke-width: 0.75">
    <polyline points="0,0 6.5,6, 13,0"/>
  </svg>
  `;

  myVeryCustomArrow = `
    <svg width="10px" height="10px" viewBox="0 0 10 10" style="fill: white; stroke: black; stroke-width: 1.75">
      <path d="M 0 0 q 6 3 4 10 q 6 -4 3 -10" />
    </svg>
  `;

  arrowHtmlExample: string = jsBeautify.html(`
    <button type="button" class="btn btn-primary" fuiTooltip="I have a good point!">Default</button>
    <button type="button" class="btn btn-primary" fuiTooltip="I'm pointless!" [fuiTooltipConfig]="{ arrow: false }">None</button>
    <button type="button" class="btn btn-primary" fuiTooltip="I'm bigger!" [fuiTooltipConfig]="{ arrowSize: { width: 10, height: 15 } }">Resized</button>
    <button type="button" class="btn btn-primary" fuiTooltip="I have borders!" [fuiTooltipConfig]="{ cssClass: 'border-tooltip', arrow: myCustomArrow }">Custom</button>
    <button type="button" class="btn btn-primary" fuiTooltip="I'm very custom!" [fuiTooltipConfig]="{ cssClass: 'best-tooltip', arrow: myVeryCustomArrow, arrowSize: { width: 10, height: 10 } }">Very Custom</button>
  `);

  arrowCssExample: string = `.border-tooltip {
  background: azure;
  color: cadetblue;
  border: 1px solid cadetblue;
}

.best-tooltip {
  color: black;
  background: white;
  border: 2px solid black;
  padding: 10px 20px;
  font-family: 'Comic Sans MS', Roboto, sans-serif;
  border-radius: 50%;
}`;

  arrowTypescriptExample: string = `@Component({
  templateUrl: './tooltip.demo.html',
  styleUrls: ['./tooltip.demo.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TooltipDemoComponent {
  myCustomArrow = \`
    <svg style="fill: Azure; stroke: CadetBlue; stroke-width: 0.75">
      <polyline points="0,0 6.5,6, 13,0"/>
    </svg>
  \`;

  myVeryCustomArrow = \`
    <svg width="10px" height="10px" viewBox="0 0 10 10" style="fill: white; stroke: black; stroke-width: 1.75">
      <path d="M 0 0 q 6 3 4 10 q 6 -4 3 -10" />
    </svg>
  \`;
}`;

  toggleDisableDemo: boolean = true;

  disableHtmlExample: string = jsBeautify.html(`
    <button type="button" class="btn btn-primary" fuiTooltip="I'm enabled!">Default</button>
    <button type="button" class="btn btn-primary" fuiTooltip="I'm enabled!" [fuiTooltipConfig]="{ isDisabled: toggleDisableDemo }">Toggleable</button>
  `);

  disableTypescriptExample(): string {
    return `toggleDisableDemo: boolean = ${this.toggleDisableDemo};`;
  }
}
