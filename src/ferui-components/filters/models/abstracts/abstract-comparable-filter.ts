import {
  FuiComparableFilterInterface,
  FuiComparableFilterParamsInterface,
  FuiFilterOptionDefInterface
} from '../../interfaces/filter';
import { FuiFilterOptionsEnum } from '../../interfaces/filter-options.enum';

import { FuiBaseFilter } from './abstract-base-filter';

/**
 * Fui comparable filter
 */
export abstract class FuiComparableFilter<
    T,
    P extends FuiComparableFilterParamsInterface<T>,
    F extends FuiComparableFilterInterface<T, P>
  >
  extends FuiBaseFilter<T, P, F>
  implements FuiComparableFilterInterface<T, P> {
  selectedOption: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null;

  /**
   * Get filter selected option
   */
  getFilterOption(): FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null {
    return this.selectedOption;
  }

  /**
   * Get the list of applicable options.
   */
  getApplicableFilterOptions(): (FuiFilterOptionDefInterface | FuiFilterOptionsEnum)[] {
    if (this.getFilterParams().filterApplicableOptions && this.getFilterParams().filterApplicableOptions.length > 0) {
      return this.getFilterParams().filterApplicableOptions;
    } else {
      return [
        FuiFilterOptionsEnum.EQUALS,
        FuiFilterOptionsEnum.NOT_EQUAL,
        FuiFilterOptionsEnum.STARTS_WITH,
        FuiFilterOptionsEnum.ENDS_WITH,
        FuiFilterOptionsEnum.CONTAINS,
        FuiFilterOptionsEnum.NOT_CONTAINS
      ];
    }
  }

  /**
   * Get the filter value.
   */
  getFilterValue(): T | null {
    return this.selectedSearch || null;
  }

  /**
   * Get the filter instance only.
   * @protected
   */
  protected getFilterInstance(): FuiComparableFilterInterface<T, P> {
    return {
      ...super.getFilterInstance(),
      selectedOption: this.selectedOption,
      getApplicableFilterOptions: () => this.getApplicableFilterOptions(),
      getFilterValue: () => this.getFilterValue()
    };
  }

  /**
   * Set selectedSearch to its initial values.
   * @protected
   */
  protected setFilterValueToInitial() {
    super.setFilterValueToInitial();
    const initialFilterVo = this.getFilterVoFromCache();
    if (initialFilterVo) {
      this.selectedOption = initialFilterVo.filterOption;
    }
  }

  /**
   * If the filter already exist, we use the filter value as defaults.
   * @protected
   */
  protected setInitialValues() {
    // By default we select the 'EQUAL' option.
    this.selectedOption = this.selectedOption || this.filterParams.filterDefaultOption || FuiFilterOptionsEnum.EQUALS;
    if (!this.filterParams.filterDefaultOption) {
      this.filterParams.filterDefaultOption = this.selectedOption;
    }
    this.defaultFilterOption = this.filterParams.filterDefaultOption || null;
    super.setInitialValues();
  }
}
