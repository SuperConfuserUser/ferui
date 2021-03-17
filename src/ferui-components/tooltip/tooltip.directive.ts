import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  HostBinding,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  Type
} from '@angular/core';

import { POPOVER_HOST_ANCHOR } from '../popover/common/popover-host-anchor.token';
import { IfOpenService } from '../utils/conditional/if-open.service';

import {
  FuiTooltipComponentConfig,
  FuiTooltipConfig,
  FuiTooltipPlacementEnum,
  FuiTooltipThemeEnum,
  TooltipComponentTypeContent
} from './tooltip-interfaces';
import { TooltipComponent } from './tooltip.component';

/**
 * Tooltip default configuration values.
 */
export const TOOLTIP_DEFAULT_CONFIG: FuiTooltipConfig = {
  offset: 5,
  placement: FuiTooltipPlacementEnum.TOP,
  cssClass: FuiTooltipThemeEnum.INFO,
  tooltipStyle: null,
  arrow: true,
  arrowSize: { width: 13, height: 6 },
  isDisabled: false,
  fixedParent: false,
  closeOnOutsideClick: false
};

@Directive({
  selector: '[fuiTooltip]',
  providers: [IfOpenService, { provide: POPOVER_HOST_ANCHOR, useExisting: ElementRef }]
})
export class FuiTooltipDirective implements OnInit, OnDestroy {
  // We set the host tabindex to 0 by default. It will then be tab-able by default.
  // But that can be updated by the dev if needed and even can be disabled if tabindex=-1.
  @HostBinding('attr.tabindex')
  @Input('tabindex')
  tabIndex: number = 0;

  // content can be string, template or component
  @Input('fuiTooltip') content: string | TemplateRef<any> | TooltipComponentTypeContent;

  @Input('fuiTooltipConfig')
  get config(): FuiTooltipConfig {
    return this._config;
  }
  set config(config: FuiTooltipConfig) {
    // apply any custom config on top of the default config
    this._config = {
      ...TOOLTIP_DEFAULT_CONFIG,
      ...config
    };
  }

  private _config: FuiTooltipConfig = TOOLTIP_DEFAULT_CONFIG;
  // reference to the dynamically generated tooltip component
  private tooltipRef: ComponentRef<TooltipComponent>;
  // any string type content
  private stringContent: string | null;
  // reference to any component type content
  private componentTypeContentRef: ComponentRef<Type<any>> | null;

  constructor(
    private ifOpenService: IfOpenService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    if (!this.content) {
      this.config.isDisabled = true;
      throw new Error(
        'fuiTooltip directive requires an input value. (e.g. fuiTooltip="my content" or [fuiTooltip]="myContentExpression")'
      );
    }
  }

  ngOnDestroy() {
    if (this.tooltipRef) {
      this.close();
    }
  }

  @HostListener('focusin')
  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this._config.isDisabled && !this.tooltipRef) {
      this.ifOpenService.open = true;
      this.open();
    }
  }

  @HostListener('focusout')
  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (!this._config.isDisabled && this.tooltipRef) {
      this.ifOpenService.open = false;
      this.close();
    }
  }

  /**
   * Opens the tooltip by dynamically constructing a tooltip component.
   * Adds it to the ng component tree and DOM.
   */
  private open(): void {
    this.tooltipRef = this.componentFactoryResolver
      .resolveComponentFactory(TooltipComponent)
      .create(this.injector, this.getContentProjectableNode());

    // pass config settings to the component
    this.tooltipRef.instance.config = this.getComponentConfig();

    this.appRef.attachView(this.tooltipRef.hostView);
    const domElem = (this.tooltipRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    // appending it to the body vs. the host anchor, so it doesn't inherit any conflicting styles and behavior

    if (this.config.fixedParent) {
      // create a fixed wrapper for the tooltip when the parent element is 'position: fixed', so positioning remains accurate
      const fixedTooltipWrapper = this.renderer.createElement('div');
      this.renderer.addClass(fixedTooltipWrapper, 'fixed-tooltip-wrapper');
      this.renderer.appendChild(fixedTooltipWrapper, domElem);
      this.renderer.appendChild(document.body, fixedTooltipWrapper);
    } else {
      // appending it to the body vs. the host anchor, so it doesn't inherit any conflicting styles and behavior
      this.renderer.appendChild(document.body, domElem);
    }
  }

  /**
   * Closes the tooltip by removing it from the ng component tree and DOM.
   */
  private close(): void {
    this.appRef.detachView(this.tooltipRef.hostView);
    this.tooltipRef.destroy();
    this.tooltipRef = null;

    if (this.componentTypeContentRef) {
      // remove any component type content from component tree and DOM as well
      this.appRef.detachView(this.componentTypeContentRef.hostView);
      this.componentTypeContentRef.destroy();
      this.componentTypeContentRef = null;
    }
  }

  /**
   * Gets the ng-content projectable node value based on the content type.
   * @returns {any[][]}
   */
  private getContentProjectableNode(): any[][] {
    // assign to a value that will be passed to the component and don't return any projectable nodes
    // the tooltip component will directly handle string content to allow HTML content and sanitization
    if (typeof this.content === 'string') {
      this.stringContent = this.content;
      return;
    }

    if (this.content instanceof TemplateRef) {
      const context = {};
      const viewRef = this.content.createEmbeddedView(context);
      return [viewRef.rootNodes];
    }

    if ((this.content as TooltipComponentTypeContent).component) {
      const componentData = this.content as TooltipComponentTypeContent;
      const factory = this.componentFactoryResolver.resolveComponentFactory(componentData.component);
      this.componentTypeContentRef = factory.create(this.injector);
      if (componentData.input) {
        // pass any optional input values to the component type content
        for (const [prop, value] of Object.entries(componentData.input)) {
          this.componentTypeContentRef.instance[prop] = value;
        }
      }
      this.appRef.attachView(this.componentTypeContentRef.hostView);
      return [[this.componentTypeContentRef.location.nativeElement]];
    }
  }

  /**
   * Gets the tooltip component config based on the tooltip directive config.
   * @returns {FuiTooltipComponentConfig}
   */
  private getComponentConfig(): FuiTooltipComponentConfig {
    const { isDisabled, fixedParent, ...componentConfig } = this._config;

    return {
      stringContent: this.stringContent,
      ...componentConfig
    };
  }
}
