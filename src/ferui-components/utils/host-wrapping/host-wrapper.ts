import {
  ComponentFactory,
  ComponentFactoryResolver,
  ElementRef,
  InjectionToken,
  Injector,
  Type,
  ViewContainerRef
} from '@angular/core';

import { DynamicWrapper } from './dynamic-wrapper';
import { EmptyAnchorComponent } from './empty-anchor';

/**
 * HostWrapper must be called in OnInit to ensure that the Views are ready. If its called in a constructor the view is
 * still undefined.
 */
export class HostWrapper<W extends DynamicWrapper> implements Injector {
  private injector: Injector;

  constructor(containerType: Type<W>, vcr: ViewContainerRef, index: number = 0) {
    this.injector = vcr.injector;
    // If the host is already wrapped, we don't do anything
    if (!this.injector.get(containerType, null)) {
      const cfr = this.injector.get(ComponentFactoryResolver);
      const el = this.injector.get(ElementRef);

      // We need a new anchor, since we're projecting the current one.
      vcr.createComponent(cfr.resolveComponentFactory(EmptyAnchorComponent));
      const factory: ComponentFactory<W> = cfr.resolveComponentFactory(containerType);
      // Craft the element array based on what slot to use. Angular only uses the index to determine
      // which ng-content to project into, so if you have more than one ng-content you'll need to set
      // the index in the constructor appropriately
      const element = [];
      element[index] = [el.nativeElement];
      // We're assuming only one projection slot, but in more complex cases we might want to provide
      // a different array of projected elements.
      const containerRef = vcr.createComponent(factory, undefined, undefined, element);
      // We can now remove the useless anchor
      vcr.remove(0);

      // We note that the container was dynamically created
      containerRef.instance._dynamic = true;

      // We keep the wrapper's injector to access the dependencies that weren't available before.
      this.injector = containerRef.injector;
    }
  }

  get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T {
    return this.injector.get(token, notFoundValue);
  }
}
