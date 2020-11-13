import { ComponentFactoryResolver, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { ComponentFactory, ComponentRef } from '@angular/core/src/linker/component_factory';

import { FuiDynamicComponentHostDirective } from './anchor.directive';

/**
 * Dynamic component loader. This component allow you to load a dynamic component in any components of yours.
 * See https://angular.io/guide/dynamic-component-loader for more info.
 */
export abstract class FuiDynamicComponentLoader<T> implements OnInit {
  @ViewChild(FuiDynamicComponentHostDirective) dynamicComponentHost: FuiDynamicComponentHostDirective;

  protected abstract componentFactoryResolver: ComponentFactoryResolver;
  protected abstract dynamicComponent: Type<T>;

  ngOnInit() {
    this.loadDynamicComponent();
  }

  /**
   * Load the dynamic component. It will clear the viewContainerRef, create the component
   * then add it back to the viewContainer host.
   * @protected
   */
  protected loadDynamicComponent() {
    if (!this.dynamicComponent || !this.dynamicComponentHost) {
      console.warn(
        '[FerUI warning] FuiDynamicComponentLoader :: We need both dynamicComponent and dynamicComponentHost to load a component dynamically.'
      );
      return;
    }
    const componentFactory: ComponentFactory<T> = this.componentFactoryResolver.resolveComponentFactory<T>(this.dynamicComponent);
    const viewContainerRef: ViewContainerRef = this.dynamicComponentHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef: ComponentRef<T> = viewContainerRef.createComponent(componentFactory);
    this.updateComponentValues(componentRef.instance);
  }

  /**
   * If for any reason, you need to update the created component @inputs, you can use this method to do it.
   * This function is called each time the loadDynamicComponent() function gets called.
   * @param componentInstance
   * @protected
   */
  protected updateComponentValues(componentInstance: T) {}
}
