import { Component, OnInit } from '@angular/core';

import { FeruiUtils } from '../../utils/ferui-utils';
import { FuiI18nService } from '../../utils/i18n/fui-i18n.service';
import {
  FuiComparableFilterInterface,
  FuiFilterComponentInterface,
  FuiFilterOptionDefInterface,
  FuiGlobalSearchFilterParamsInterface
} from '../interfaces/filter';
import { FuiFilterOptionsEnum } from '../interfaces/filter-options.enum';
import { FuiFilterEnum } from '../interfaces/filter.enum';
import { FuiFilterService } from '../providers/filter.service';

import { FuiComparableFilter } from './abstracts/abstract-comparable-filter';

@Component({
  selector: 'fui-global-search-filter',
  template: `
    <fui-search-container [searchDebounce]="searchDebounce" (searchChange)="onFilterInputChanged($event)">
      <label fuiLabel>{{ translate('globalSearch') }}</label>
      <input
        type="search"
        [disabled]="getFilterService()?.isDisabled$() | async"
        fuiSearch
        [layout]="fuiFormLayoutEnum.SMALL"
        [name]="filterDefaultName"
        [(ngModel)]="selectedSearch"
      />
    </fui-search-container>
  `,
  host: {
    '[class.fui-search-filter]': 'true'
  }
})
export class FuiGlobalSearchFilterComponent<
    T extends string,
    P extends FuiGlobalSearchFilterParamsInterface,
    F extends FuiComparableFilterInterface<T, P>
  >
  extends FuiComparableFilter<T, P, F>
  implements FuiFilterComponentInterface<T, P, F>, FuiComparableFilterInterface<T, P>, OnInit {
  filterDefaultName: string = FeruiUtils.generateUniqueId('fui-filter-search');
  searchDebounce: number = 200;

  constructor(protected filterService: FuiFilterService, protected fuiI18nService: FuiI18nService) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (!this.filterParams.debounceMs) {
      this.filterParams.debounceMs = 200;
    }
    // We force the option to be CONTAINS because for global search we don't want to compare by equality.*
    this.selectedOption = FuiFilterOptionsEnum.CONTAINS;
    this.filterParams.filterDefaultOption = this.selectedOption;
  }

  /**
   * Get the list of applicable filter options.
   */
  getApplicableFilterOptions(): (FuiFilterOptionDefInterface | FuiFilterOptionsEnum)[] {
    if (this.getFilterParams().filterApplicableOptions && this.getFilterParams().filterApplicableOptions.length > 0) {
      return this.getFilterParams().filterApplicableOptions;
    } else {
      return [FuiFilterOptionsEnum.EQUALS, FuiFilterOptionsEnum.CONTAINS];
    }
  }

  /**
   * Get filter type. Here we force it to GLOBAL_SEARCH.
   */
  getFilterType(): FuiFilterEnum {
    return FuiFilterEnum.GLOBAL_SEARCH;
  }

  /**
   * Get filter value.
   */
  getFilterValue(): T {
    return this.selectedSearch;
  }

  /**
   * Get the filter name.
   */
  getFilterName(): string {
    return this.translate('globalSearch');
  }

  /**
   * Everytime we update the models (option or selected search) we add or remove the filter from
   * the selectedFilter list of the filterService.
   * @param searchValue
   */
  onFilterInputChanged(searchValue: T) {
    this.selectedSearch = searchValue;
    this.addOrRemoveFilter(!FeruiUtils.isNullOrUndefined(searchValue), this.getFilterInstance() as F);
    this.filterChange.emit(this.getFilterInstance() as F);
  }
}
