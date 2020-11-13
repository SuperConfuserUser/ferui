import { Component, OnInit } from '@angular/core';

import { FeruiUtils } from '../../utils/ferui-utils';
import { FuiI18nService } from '../../utils/i18n/fui-i18n.service';
import { FuiBooleanFilterParamsInterface, FuiFilterComponentInterface, FuiFilterInterface } from '../interfaces/filter';
import { FuiFilterOptionsEnum } from '../interfaces/filter-options.enum';
import { FuiFilterEnum } from '../interfaces/filter.enum';
import { FuiFilterService } from '../providers/filter.service';

import { FuiBaseFilter } from './abstracts/abstract-base-filter';

@Component({
  selector: 'fui-boolean-filter',
  template: `
    <div class="row">
      <div class="col-3 fui-filter-name" unselectable="on">{{ getFilterName() }}</div>
      <div class="col-3">
        <fui-radio-wrapper>
          <input
            type="radio"
            fuiRadio
            [disabled]="getFilterService()?.isDisabled$() | async"
            [name]="filterDefaultName"
            value="true"
            (ngModelChange)="onChange($event)"
            [(ngModel)]="selectedSearch"
          />
          <label fuiLabel>{{ translate('truthy') }}</label>
        </fui-radio-wrapper>
      </div>
      <div class="col-3">
        <fui-radio-wrapper>
          <input
            type="radio"
            fuiRadio
            [disabled]="getFilterService()?.isDisabled$() | async"
            [name]="filterDefaultName"
            value="false"
            (ngModelChange)="onChange($event)"
            [(ngModel)]="selectedSearch"
          />
          <label fuiLabel>{{ translate('falsy') }}</label>
        </fui-radio-wrapper>
      </div>
      <div class="col-3"></div>
    </div>
  `,
  host: {
    '[class.fui-boolean-filter]': 'true',
    '[class.container-fluid]': 'true',
    '[id]': 'filterViewId'
  },
  styles: [
    `
      .col-3 {
        min-height: 59px;
      }
    `
  ]
})
export class FuiBooleanFilterComponent<
    T extends string | boolean,
    P extends FuiBooleanFilterParamsInterface<T>,
    F extends FuiFilterInterface<T, P>
  >
  extends FuiBaseFilter<T, P, F>
  implements FuiFilterComponentInterface<T, P, F>, FuiFilterInterface<T, P>, OnInit {
  selectedSearch: T | null = null;
  filterDefaultName: string = FeruiUtils.generateUniqueId('fui-filter-boolean');

  constructor(protected filterService: FuiFilterService, protected fuiI18nService: FuiI18nService) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (!this.filterParams.filterDefaultOption) {
      this.filterParams.filterDefaultOption = null;
    }
    this.defaultFilterOption = this.filterParams.filterDefaultOption || null;
  }

  /**
   * Get filter type. We force it to Boolean.
   */
  getFilterType(): FuiFilterEnum {
    return FuiFilterEnum.BOOLEAN;
  }

  /**
   * There is no possible options for this filter type. So we force it to null.
   */
  getFilterOption(): FuiFilterOptionsEnum | null {
    return null;
  }

  /**
   * Get filter value.
   */
  getFilterValue(): T {
    return this.selectedSearch;
  }

  /**
   * We call this method everytime the model changes. It will add or remove the filter from the selectedFilters list
   * of the filterService. It will also emit an event.
   * @param value
   */
  onChange(value) {
    this.selectedSearch = value;
    this.addOrRemoveFilter(!FeruiUtils.isNullOrUndefined(this.selectedSearch), this.getFilterInstance() as F);
    this.filterChange.emit(this.getFilterInstance() as F);
  }
}
