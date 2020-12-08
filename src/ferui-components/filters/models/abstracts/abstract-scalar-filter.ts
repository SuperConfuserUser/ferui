import { isArray } from 'util';

import { FuiFilterOptionDefInterface, FuiScalarFilterInterface, FuiScalarFilterParamsInterface } from '../../interfaces/filter';
import { FuiFilterOptionsEnum } from '../../interfaces/filter-options.enum';

import { FuiBaseFilter } from './abstract-base-filter';

/**
 * Fui scalar filter
 */
export abstract class FuiScalarFilter<T, P extends FuiScalarFilterParamsInterface<T>, F extends FuiScalarFilterInterface<T, P>>
  extends FuiBaseFilter<T, P, F>
  implements FuiScalarFilterInterface<T, P> {
  selectedOption: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null;
  selectedSearchTo: T | null = null;

  /**
   * Get the selected filter option
   */
  getFilterOption(): FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null {
    return this.selectedOption;
  }

  /**
   * Get the list of applicable options for current filter.
   */
  getApplicableFilterOptions(): (FuiFilterOptionDefInterface | FuiFilterOptionsEnum)[] {
    if (this.getFilterParams().filterApplicableOptions && this.getFilterParams().filterApplicableOptions.length > 0) {
      return this.getFilterParams().filterApplicableOptions;
    } else {
      return [
        FuiFilterOptionsEnum.EQUALS,
        FuiFilterOptionsEnum.NOT_EQUAL,
        FuiFilterOptionsEnum.LESS_THAN,
        FuiFilterOptionsEnum.LESS_THAN_OR_EQUAL,
        FuiFilterOptionsEnum.GREATER_THAN,
        FuiFilterOptionsEnum.GREATER_THAN_OR_EQUAL,
        FuiFilterOptionsEnum.IN_RANGE
      ];
    }
  }

  /**
   * Get the filter value.
   */
  getFilterValue(): T | T[] | null {
    if (!this.selectedSearch) {
      return null;
    }
    return this.selectedOption !== FuiFilterOptionsEnum.IN_RANGE
      ? this.selectedSearch
      : [this.selectedSearch, this.selectedSearchTo];
  }

  /**
   * Whether or not selected option is 'IN_RANGE'.
   */
  isInRange(): boolean {
    return this.selectedOption === FuiFilterOptionsEnum.IN_RANGE;
  }

  /**
   * Get the filter instance only (without any angular related methods/templates).
   * @protected
   */
  protected getFilterInstance(): FuiScalarFilterInterface<T, P> {
    return {
      ...super.getFilterInstance(),
      selectedOption: this.selectedOption,
      selectedSearchTo: this.selectedSearchTo,
      getApplicableFilterOptions: () => this.getApplicableFilterOptions(),
      isInRange: () => this.isInRange()
    };
  }

  /**
   * Set both selectedSearch and selectedSearchTo to their initial values.
   * @protected
   */
  protected setFilterValueToInitial(): void {
    super.setFilterValueToInitial();
    const initialFilterVo = this.getFilterVoFromCache();
    if (initialFilterVo) {
      this.selectedOption = initialFilterVo.filterOption;
      if (isArray(initialFilterVo.filterValue)) {
        this.selectedSearch = initialFilterVo.filterValue[0] as T;
        this.selectedSearchTo = initialFilterVo.filterValue[1] as T;
      } else {
        this.selectedSearch = initialFilterVo.filterValue as T;
      }
    }
  }

  /**
   * If the filter already exist, we use the filter value as defaults.
   * @protected
   */
  protected setInitialValues(): void {
    // By default we select the 'EQUAL' option.
    this.selectedOption = this.selectedOption || this.filterParams.filterDefaultOption || FuiFilterOptionsEnum.EQUALS;
    if (!this.filterParams.inRangeInclusive) {
      this.filterParams.inRangeInclusive = true;
    }
    if (!this.filterParams.filterDefaultOption) {
      this.filterParams.filterDefaultOption = this.selectedOption;
    }
    this.defaultFilterOption = this.filterParams.filterDefaultOption || null;
    super.setInitialValues();
  }
}
