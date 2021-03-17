import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Injector,
  OnInit,
  Optional,
  SecurityContext
} from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle } from '@angular/platform-browser';

import { AbstractPopover } from '../popover/common/abstract-popover';
import { POPOVER_HOST_ANCHOR } from '../popover/common/popover-host-anchor.token';
import { Point } from '../popover/common/popover-options.interface';

import { FuiTooltipComponentConfig, FuiTooltipPlacementEnum } from './tooltip-interfaces';

@Component({
  template: `
    <div *ngIf="stringContent" [outerHTML]="stringContent"></div>
    <ng-content></ng-content>
    <div *ngIf="arrow" [outerHTML]="arrow"></div>
  `
})
export class TooltipComponent extends AbstractPopover implements OnInit, AfterViewInit {
  // input value assigned via the tooltip directive
  config: FuiTooltipComponentConfig;
  stringContent: SafeHtml;
  arrow: SafeHtml;

  @HostBinding('class') cssClass: SafeHtml;
  @HostBinding('attr.style') style: SafeStyle;

  private offset: number;

  constructor(
    injector: Injector,
    @Optional()
    @Inject(POPOVER_HOST_ANCHOR)
    parentHost: ElementRef,
    private tooltipElement: ElementRef,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef
  ) {
    super(injector, parentHost, null, null);
  }

  /**
   * Set tooltip string type content, classes and styling so that the tooltip may be measured to determine best placement.
   * Template and component type content are projected to the ng-content slot from the tooltip directive.
   */
  ngOnInit(): void {
    if (this.config.stringContent) {
      this.stringContent = this.sanitizer.bypassSecurityTrustHtml(this.config.stringContent);
    }

    this.cssClass = this.sanitizer.sanitize(SecurityContext.HTML, `fui-tooltip ${this.config.cssClass}`);

    if (this.config.tooltipStyle) {
      this.style = this.sanitizer.bypassSecurityTrustStyle(this.config.tooltipStyle);
    }

    this.offset = this.config.arrow ? this.config.offset + this.config.arrowSize.height : this.config.offset;

    this.closeOnOutsideClick = this.config.closeOnOutsideClick;
  }

  /**
   * Set best placement and add the arrow in the correct position when the main tooltip can now be accurately measured.
   */
  ngAfterViewInit() {
    const placementPreferencesList = TooltipComponent.getPlacementPreferenceList(this.config.placement);
    const placement = this.getBestPlacement(placementPreferencesList);

    this.setPosition(placement);

    if (this.config.arrow) {
      this.arrow = this.getArrow(placement);
    }

    // allows expressions to change after the initial change detection
    this.cdRef.detectChanges();
  }

  /**
   * Gets the best placement for the tooltip by checking if it is inside the view.
   * Checks the next placement in the list if not.
   * @param {FuiTooltipPlacementEnum[]} placements
   */
  private getBestPlacement(placements: FuiTooltipPlacementEnum[]): FuiTooltipPlacementEnum {
    const placement = placements[0];
    const tooltipHeight = this.tooltipElement.nativeElement.clientHeight;
    const tooltipWidth = this.tooltipElement.nativeElement.clientWidth;
    const parent = this.parentHost.nativeElement.getBoundingClientRect();
    const scrollY = window.pageYOffset;
    const offset = this.offset;

    let topEdge;
    let leftEdge;

    switch (placement) {
      case 'top':
      default:
        topEdge = parent.top + scrollY - (tooltipHeight + offset);
        leftEdge = parent.left + parent.width / 2 - tooltipWidth / 2;
        break;
      case 'bottom':
        topEdge = parent.top + scrollY + parent.height + offset;
        leftEdge = parent.left + parent.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        topEdge = parent.top + scrollY + parent.height / 2 - tooltipHeight / 2;
        leftEdge = parent.left - tooltipWidth - offset;
        break;
      case 'right':
        topEdge = parent.top + scrollY + parent.height / 2 - tooltipHeight / 2;
        leftEdge = parent.left + parent.width + offset;
        break;
    }

    const bottomEdge = topEdge + tooltipHeight;
    const rightEdge = leftEdge + tooltipWidth;
    const bodyHeight = window.innerHeight + scrollY;
    const bodyWidth = document.body.clientWidth;

    const isOutsideOfView = topEdge - scrollY < 0 || bottomEdge > bodyHeight || leftEdge < 0 || rightEdge > bodyWidth;

    // if tooltip is outside of the view and all placement options haven't been tried yet,
    // check fit for the next preferred placement
    if (isOutsideOfView && placements.length > 1) {
      placements.shift();
      return this.getBestPlacement(placements);
    } else {
      return placement;
    }
  }

  /**
   * Sets the tooltip position via inherited AbstractPopover properties based on the placement value.
   * @param {FuiTooltipPlacementEnum} placement
   */
  private setPosition(placement: FuiTooltipPlacementEnum) {
    switch (placement) {
      case 'top':
      default:
        this.anchorPoint = Point.TOP_CENTER;
        this.popoverPoint = Point.BOTTOM_CENTER;
        this.popoverOptions = {
          offsetY: -this.offset,
          enableAnchorStaticPositioning: false
        };
        break;
      case 'bottom':
        this.anchorPoint = Point.BOTTOM_CENTER;
        this.popoverPoint = Point.TOP_CENTER;
        this.popoverOptions = {
          offsetY: this.offset,
          enableAnchorStaticPositioning: false
        };
        break;
      case 'right':
        this.anchorPoint = Point.RIGHT_CENTER;
        this.popoverPoint = Point.LEFT_CENTER;
        this.popoverOptions = {
          offsetX: this.offset,
          enableAnchorStaticPositioning: false
        };
        break;
      case 'left':
        this.anchorPoint = Point.LEFT_CENTER;
        this.popoverPoint = Point.RIGHT_CENTER;
        this.popoverOptions = {
          offsetX: -this.offset,
          enableAnchorStaticPositioning: false
        };
        break;
    }
  }

  /**
   * Gets the SVG arrow to show with the tooltip.
   * @param {FuiTooltipPlacementEnum} placement
   */
  private getArrow(placement: FuiTooltipPlacementEnum): SafeHtml {
    const { width: w, height: h } = this.config.arrowSize;

    // use the default or custom arrow
    const defaultArrow = `<polyline points="0,0 ${w / 2},${h} ${w},0"/>`;
    const svgArrow = this.config.arrow === true ? defaultArrow : this.config.arrow;

    // be very explicit with svg width, height, viewBox, style.width and style.height to get consistent scale
    // ${placement} class will handle arrow placement in relation to the main tooltip and rotation
    // <g> (svg group container) allows any custom svg to be used within the main svg wrapper
    return this.sanitizer.bypassSecurityTrustHtml(`
       <svg
        width="${w}px"
        height="${h}px"
        viewBox="0 0 ${w} ${h}"
        class="fui-tooltip-arrow ${placement}"
        style="width: ${w}px; height: ${h}px"
       >
        <g>
          ${svgArrow}
        </g>
      </svg>
     `);
  }

  /**
   * Gets list of placements in order of preference.
   * Starts with the default or configured placement, then the flip to the other side, then the other axis.
   * @param {FuiTooltipPlacementEnum} placement
   * @returns {FuiTooltipPlacementEnum[]}
   */
  private static getPlacementPreferenceList(placement: FuiTooltipPlacementEnum): FuiTooltipPlacementEnum[] {
    const preferenceByPlacement: { [key in FuiTooltipPlacementEnum]: FuiTooltipPlacementEnum[] } = {
      top: [
        FuiTooltipPlacementEnum.TOP,
        FuiTooltipPlacementEnum.BOTTOM,
        FuiTooltipPlacementEnum.RIGHT,
        FuiTooltipPlacementEnum.LEFT
      ],
      bottom: [
        FuiTooltipPlacementEnum.BOTTOM,
        FuiTooltipPlacementEnum.TOP,
        FuiTooltipPlacementEnum.RIGHT,
        FuiTooltipPlacementEnum.LEFT
      ],
      right: [
        FuiTooltipPlacementEnum.RIGHT,
        FuiTooltipPlacementEnum.LEFT,
        FuiTooltipPlacementEnum.TOP,
        FuiTooltipPlacementEnum.BOTTOM
      ],
      left: [
        FuiTooltipPlacementEnum.LEFT,
        FuiTooltipPlacementEnum.RIGHT,
        FuiTooltipPlacementEnum.TOP,
        FuiTooltipPlacementEnum.BOTTOM
      ]
    };
    return preferenceByPlacement[placement];
  }
}
