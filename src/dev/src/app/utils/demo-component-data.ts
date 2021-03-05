export interface DemoComponentDataInterface {
  /** @deprecated We now split the sources code into multiple types. */
  source?: string; // HTML Source code of the demo component

  htmlSource?: string; // The HTML source of the component that is compiled
  tsSource?: string; // The Typescript source of the component that is compiled
  jsSource?: string; // The JS source of the component that is compiled
  scssSource?: string; // The SCSS source of the component that is compiled
  cssSource?: string; // The CSS source of the component that is compiled

  title: string; // Title
  models?: object; // Models used by the demo component {one: 'one', two: 'two', ...}
  params?: object; // Parameters used by the demo component {paramOne: 'one', paramTwo: 'two', ...}
  canDisable?: boolean; // Boolean that indicates if demo component can be disabled
}

export interface DemoComponentCodeSource {
  label: string;
  code: string;
}

/**
 * Class:  DemoComponentData
 * This class handles data for a Demo Component
 */
export class DemoComponentData {
  htmlSource: string; // The HTML source of the component that is compiled
  tsSource: string; // The Typescript source of the component that is compiled
  jsSource: string; // The JS source of the component that is compiled
  scssSource: string; // The SCSS source of the component that is compiled
  cssSource: string; // The CSS source of the component that is compiled

  title: string; // Title
  models: object; // Models used by the demo component {one: 'one', two: 'two', ...}
  params: object; // Parameters used by the demo component {paramOne: 'one', paramTwo: 'two', ...}
  canDisable: boolean; // Boolean that indicates if demo component can be disabled

  constructor(data: DemoComponentDataInterface) {
    this.title = data.title;
    this.htmlSource = data.htmlSource || data.source;
    this.tsSource = data.tsSource;
    this.jsSource = data.jsSource;
    this.scssSource = data.scssSource;
    this.cssSource = data.cssSource;
    this.models = data.models;
    this.params = data.params || {};
    this.canDisable = !!data.canDisable;
  }
}
