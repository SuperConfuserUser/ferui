import { Type } from '@angular/core';

import { FuiI18nStrings } from '../../utils/i18n/fui-i18n-interface';
import { FuiFilterService } from '../providers/filter.service';

import { FuiFilterOptionsEnum } from './filter-options.enum';
import { FuiFilterEnum } from './filter.enum';

/**
 * Get the Visual object representation of a filter. This will return the filter value from a specific point in time
 * (when you call the toJson() method of the FuiFilterInterface).
 */
export interface FuiFilterVo<T, P extends FuiFilterParamsInterface<T>> {
  filterId: string;
  filterField: FuiFilterFieldInterface<T, P>;
  isActive: boolean;
  filterName: string;
  filterType: FuiFilterEnum;
  filterOption: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null;
  filterValue: T | T[] | null;
  filterParams: P;
}

//////////////// FerUI Filter components interfaces ////////////////
export interface FuiFilterComponentInterface<T, P extends FuiFilterParamsInterface<T>, F extends FuiFilterInterface<T, P>> {
  // Add or remove a filter from the selected filters list.
  addOrRemoveFilter(condition: boolean, filter: F): void;

  // Get the filterService
  getFilterService(): FuiFilterService;

  // Internal method used to translate a string.
  translate<K extends keyof FuiI18nStrings>(toTranslate: K | FuiFilterOptionsEnum): FuiI18nStrings[K];
}

//////////////// FerUI Filters ////////////////
export interface FuiFilterInterface<T, P extends FuiFilterParamsInterface<T>> {
  // The filter unique ID
  filterId: string;

  // The filter field object user to generate this filter.
  filterField: FuiFilterFieldInterface<T, P>;

  // The desired search value to compare
  selectedSearch: T | null;

  // Whether or not the filter is active (if the user has clicked on 'Apply filters).
  isFilterActive(): boolean;

  // Set a filter active.
  setFilterActive(value: boolean): void;

  // Get the filter name to be display in the popover.
  getFilterName(): string;

  // Get the filter value. It can be a simple value or an array of values. If the option is 'in-range', this function will return
  // an array containing the 'from' and 'to' values (i.e: i want data where age is between 10 and 20 years old).
  getFilterValue(): T | T[] | null;

  // Get the filter type.
  getFilterType(): FuiFilterEnum;

  // Get the filter selected option.
  getFilterOption(): FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null;

  // Get the filter params. In some cases, we might want to add more params.
  getFilterParams(): P;

  // Visual object representation of this object.
  toJson(): FuiFilterVo<T, P>;
}

export interface FuiComparableFilterInterface<T, P extends FuiComparableFilterParamsInterface<T>>
  extends FuiFilterInterface<T, P> {
  // The selected filter option that we want to use for comparison.
  selectedOption: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null;

  // Get the filter search value. This will reflect the 'selectedSearch' value.
  getFilterValue(): T | null;

  // Get all applicable options for this filter. This determinate all options available to the user.
  getApplicableFilterOptions(): (FuiFilterOptionDefInterface | FuiFilterOptionsEnum)[];
}

export interface FuiScalarFilterInterface<T, P extends FuiScalarFilterParamsInterface<T>> extends FuiFilterInterface<T, P> {
  // The selected filter option that we want to use for comparison.
  selectedOption: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null;
  selectedSearch: T | null; // The desired search value to compare
  selectedSearchTo?: T | null; // The 2nd desired search value to compare. Only if 'isInRange()' is true.
  // Whether or not we want to do a 'in-range' comparison. Like we want to search for data between two values.
  isInRange(): boolean;
  // Get all applicable options for this filter. This determinate all options available to the user.
  getApplicableFilterOptions(): (FuiFilterOptionDefInterface | FuiFilterOptionsEnum)[];
}

//////////////// FerUI Active Filters ////////////////

export interface FuiSelectedFilterInterface<T = any, P extends FuiFilterParamsInterface<T> = FuiFilterParamsInterface<T>> {
  index: string;
  filter: FuiFilterInterface<T, P>;
}

//////////////// FerUI Filter params ////////////////

export interface FuiFilterOptionDefInterface {
  displayKey: string;
  displayName: string;
}

export interface FuiFilterParamsInterface<T> {
  filterLabel?: string; // Only useful if you want to override the filter field label for some reason.
  filterDefaultOption?: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null; // Which option should we select by default?
  // Which options should we displays for filter? Be careful because it will REPLACE the default options list.
  filterApplicableOptions?: (FuiFilterOptionDefInterface | FuiFilterOptionsEnum)[];
}

export interface FuiComparableFilterParamsInterface<T> extends FuiFilterParamsInterface<T> {}

export interface FuiScalarFilterParamsInterface<T> extends FuiComparableFilterParamsInterface<T> {
  inRangeInclusive?: boolean;
}

export interface FuiDateFilterParamsInterface<T> extends FuiScalarFilterParamsInterface<T> {}

export interface FuiBooleanFilterParamsInterface<T extends string | boolean> extends FuiFilterParamsInterface<T> {}

export interface FuiTextFilterParamsInterface extends FuiComparableFilterParamsInterface<string> {
  debounceMs?: number;
}

export interface FuiGlobalSearchFilterParamsInterface extends FuiTextFilterParamsInterface {}

export interface FuiNumberFilterParamsInterface extends FuiScalarFilterParamsInterface<number> {}

//////////////// Filter fields ////////////////
export interface FuiFilterFieldInterface<T = any, P extends FuiFilterParamsInterface<T> = FuiFilterParamsInterface<T>> {
  key: string; // Unique key for the field.
  label: string; // The label to display.
  type: FuiFilterEnum;
  params?: P; // The filter params.
  data?: any; // If you want to add extra data to render the filter.
  filterFramework?: Type<FuiFilterComponentInterface<T, P, FuiFilterInterface<T, P>>>; // The custom filter component you want to use.
}

//////////////// Custom filter context ////////////////
export interface FuiFilterCustomContextInterface {
  appendTo: string;
  field: FuiFilterFieldInterface;
}
