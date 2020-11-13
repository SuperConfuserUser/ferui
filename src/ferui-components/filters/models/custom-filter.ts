import { Component, ComponentFactoryResolver, Input, OnInit, Type } from '@angular/core';

import { FuiDynamicComponentLoader } from '../../utils/dynamic-component/component-loader';
import { FeruiUtils } from '../../utils/ferui-utils';
import {
  FuiFilterComponentInterface,
  FuiFilterFieldInterface,
  FuiFilterInterface,
  FuiFilterParamsInterface
} from '../interfaces/filter';

import { FuiBaseFilter } from './abstracts/abstract-base-filter';

@Component({
  selector: 'fui-custom-filter',
  template: `<ng-template fuiDynamicComponentHost></ng-template>`,
  host: {
    '[class.fui-custom-filter]': 'true',
    '[class.container-fluid]': 'true',
    '[id]': 'filterViewId'
  }
})
export class FuiCustomFilterComponent<
    T = any,
    P extends FuiFilterParamsInterface<T> = FuiFilterParamsInterface<T>,
    F extends FuiFilterInterface<T, P> = FuiFilterInterface<T, P>
  >
  extends FuiDynamicComponentLoader<FuiFilterComponentInterface<T, P, FuiFilterInterface<T, P>>>
  implements OnInit {
  @Input() field: FuiFilterFieldInterface<T, P>;
  @Input() appendTo: string;

  // The dynamicComponent that we want to create dynamically.
  dynamicComponent: Type<FuiFilterComponentInterface<T, P, FuiFilterInterface<T, P>>>;
  filterViewId: string = FeruiUtils.generateUniqueId('fuiFilterCustom', '');

  constructor(protected componentFactoryResolver: ComponentFactoryResolver) {
    super();
  }

  ngOnInit() {
    // We set the dynamicComponent before it gets loaded.
    this.dynamicComponent = this.field.filterFramework;
    super.ngOnInit();
  }

  /**
   * We update the component @inputs. This is called internally whenever a component gets created.
   * @param componentInstance
   * @protected
   */
  protected updateComponentValues(componentInstance: FuiFilterComponentInterface<T, P, FuiFilterInterface<T, P>>) {
    super.updateComponentValues(componentInstance);
    (<FuiBaseFilter<T, P, F>>componentInstance).appendTo = this.appendTo;
    (<FuiBaseFilter<T, P, F>>componentInstance).filterField = this.field;
    (<FuiBaseFilter<T, P, F>>componentInstance).filterParams = this.field.params;
  }
}
