import { Type } from '@angular/core';

/**
 * Tooltip component type content interface.
 */
export interface TooltipComponentTypeContent {
  component: Type<any>; // component to generate for the tooltip content
  input?: { [key: string]: any }; // optional input values for the component
}

/**
 * Shared tooltip configuration interface.
 */
interface SharedTooltipConfig {
  offset?: number; // distance of the tooltip from it's anchor element in px
  placement?: FuiTooltipPlacementEnum; // placement of the tooltip relative to it's anchor element
  cssClass?: FuiTooltipThemeEnum | string; // pre-built theme class or any custom CSS classes to apply to the tooltip. List should be space separated.
  tooltipStyle?: string; // additional styling to apply to the tooltip. HTML inline style format.
  arrow?: boolean | string; // boolean value for whether to show the default arrow or a string value for a custom svg arrow
  arrowSize?: TooltipArrowSize; // tooltip arrow size in px
}

/**
 * Fui tooltip config interface.
 * Public input configurable by the user.
 */
export interface FuiTooltipConfig extends SharedTooltipConfig {
  isDisabled?: boolean; // whether the tooltip should be disabled
  fixedParent?: boolean; // whether the parent element is position: fixed
}

/**
 * Fui tooltip component config.
 * Private config object created by the tooltip directive.
 */
export interface FuiTooltipComponentConfig extends SharedTooltipConfig {
  stringContent?: string; // string type content that will be handled directly by the component
}

/**
 * Tooltip arrow size interface.
 */
export interface TooltipArrowSize {
  width: number; // width of the tooltip arrow in px
  height: number; // height of the tooltip arrow in px
}

/**
 * FerUI tooltip placement enum.
 */
export enum FuiTooltipPlacementEnum {
  TOP = 'top',
  BOTTOM = 'bottom',
  RIGHT = 'right',
  LEFT = 'left'
}

/**
 * FerUI tooltip theme CSS class enum.
 */
export enum FuiTooltipThemeEnum {
  PRIMARY = 'tooltip-primary',
  SECONDARY = 'tooltip-secondary',
  SUCCESS = 'tooltip-success',
  DANGER = 'tooltip-danger',
  WARNING = 'tooltip-warning',
  INFO = 'tooltip-info',
  LIGHT = 'tooltip-light',
  DARK = 'tooltip-dark'
}
