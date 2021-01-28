import { isArray } from 'util';

import { Injectable } from '@angular/core';

import { FuiDatagridBooleanFilterComponent } from '../../datagrid/components/filters/filter/boolean-filter';
import { FuiDatagridDateFilterComponent } from '../../datagrid/components/filters/filter/date-filter';
import { Comparator } from '../../datagrid/components/filters/interfaces/filter';
import { FUI_DEFAULT_DATE_COMPARATOR } from '../../filters/comparators/filter-date-comparator';
import { FUI_DEFAULT_NULL_COMPARATOR_FUNC } from '../../filters/comparators/filter-null-comparator';
import { FUI_DEFAULT_NUMBER_COMPARATOR } from '../../filters/comparators/filter-number-comparator';
import { FUI_DEFAULT_TEXT_COMPARATOR } from '../../filters/comparators/filter-text-comparator';
import { FUI_DEFAULT_TEXT_LOWERCASE_FORMATTER } from '../../filters/formatters/filter-text-formatter';
import { FuiFilterOptionDefInterface } from '../../filters/interfaces/filter';
import { FuiFilterOptionsEnum } from '../../filters/interfaces/filter-options.enum';
import { FuiFilterEnum } from '../../filters/interfaces/filter.enum';
import { DateIOService } from '../../forms/date/providers/date-io.service';
import {
  FuiFilterGetDataInterface,
  FuiFilterModel,
  FuiSearchResultsObject
} from '../../forms/search/interfaces/search-datasource';

@Injectable({
  providedIn: 'root'
})
export class FuiFilterComparatorService {
  constructor(private dateIOService: DateIOService) {}

  /**
   * Filter the search results based on any global search or filter params
   * for use by a Fer UI search component datasource.
   * @param results
   * @param filterParams
   * @returns The filtered results to be used by a search component datasource.
   */
  filterDataForDatasource<T>(results: T[], filterParams?: FuiFilterGetDataInterface): FuiSearchResultsObject<T> {
    const filteredResults: T[] = this.filterData(results, filterParams);
    return {
      results: filteredResults,
      total: filteredResults.length
    };
  }

  /**
   * Filter the data based on global search or filter params.
   * @param results
   * @param params
   * @returns The filtered results in a plain list.
   */
  filterData<T>(results: T[], params: FuiFilterGetDataInterface<T>): T[] {
    const filters: FuiFilterModel[] = params.request.filterModels;
    if (filters.length === 0) {
      return [...results];
    }

    // Returns only results that pass every filter.
    return results.filter(data => {
      return filters.every(filter => {
        if (filter.filterType === FuiFilterEnum.GLOBAL_SEARCH) {
          return Object.values(data).some(value => {
            return FUI_DEFAULT_TEXT_LOWERCASE_FORMATTER(value) === null ? false : this.doesFilterPass(filter, value);
          });
        } else {
          return this.doesFilterPass(filter, data[filter.field]);
        }
      });
    });
  }

  /**
   * Checks if each result passes the selected filters based on filter type.
   * @param filter
   * @param data
   * @returns Whether the result passes the filter requirements.
   */
  protected doesFilterPass(filter: FuiFilterModel, data: any): boolean {
    const { filterOption, filterValue, filterType, field } = filter;
    switch (filterType) {
      case FuiFilterEnum.GLOBAL_SEARCH:
      case FuiFilterEnum.STRING:
        return this.textFilter(filterOption, filterValue, data);
      case FuiFilterEnum.NUMBER:
        return this.numberFilter(filterOption, filterValue, data);
      case FuiFilterEnum.BOOLEAN:
        return this.booleanFilter(filterValue, data);
      case FuiFilterEnum.DATE:
        return this.dateFilter(filterOption, filterValue, data);
      default:
        throw new Error(
          `No comparator available for the ${filterType} type ${field} filter. Add a new or custom comparator to handle it.`
        );
    }
  }

  /**
   * Filters string type data based on the selected option and search value.
   * @param selectedOption
   * @param selectedSearch
   * @param data
   * @returns Whether the data passes the filter requirements.
   */
  protected textFilter<T extends string = string>(
    selectedOption: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null,
    selectedSearch: T,
    data: T
  ): boolean {
    const formatter = FUI_DEFAULT_TEXT_LOWERCASE_FORMATTER;
    const comparator = FUI_DEFAULT_TEXT_COMPARATOR;
    return comparator(selectedOption, formatter(data), formatter(selectedSearch));
  }

  /**
   * Filters boolean type data based on the selected value.
   * @param selectedValue
   * @param data
   * @returns Whether the data passes the filter requirements.
   */
  protected booleanFilter<T extends string | boolean = string | boolean>(selectedValue: T, data: T): boolean {
    const formatter = FuiDatagridBooleanFilterComponent.DEFAULT_FORMATTER;
    if (!data) {
      return false;
    }
    return formatter(data) === formatter(selectedValue);
  }

  /**
   * Filters number type data based on the selected option and filter value(s).
   * @param selectedOption
   * @param filterValues Filter values will be generally be single. For in range comparison, it will be an array of two.
   * @param data
   * @returns Whether the data passes the filter requirements.
   */
  protected numberFilter<T extends number = number>(
    selectedOption: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null,
    filterValues: T | T[],
    data: T
  ): boolean {
    const cellValue: any = data;
    const filterValue: number = Array.isArray(filterValues) ? filterValues[0] : filterValues;
    const comparator: Comparator<number> = FUI_DEFAULT_NULL_COMPARATOR_FUNC(selectedOption, this.numberComparator());
    const compareResult = comparator(filterValue, cellValue);

    switch (selectedOption) {
      case FuiFilterOptionsEnum.EMPTY:
        return false;
      case FuiFilterOptionsEnum.EQUALS:
        return compareResult === 0;
      case FuiFilterOptionsEnum.GREATER_THAN:
        return compareResult > 0;
      case FuiFilterOptionsEnum.GREATER_THAN_OR_EQUAL:
        return compareResult >= 0;
      case FuiFilterOptionsEnum.LESS_THAN_OR_EQUAL:
        return compareResult <= 0;
      case FuiFilterOptionsEnum.LESS_THAN:
        return compareResult < 0;
      case FuiFilterOptionsEnum.NOT_EQUAL:
        return compareResult !== 0;
      case FuiFilterOptionsEnum.IN_RANGE:
        const compareToResult: number = comparator((filterValues as number[])[1], cellValue);
        return compareResult >= 0 && compareToResult <= 0;
      default:
        throw new Error('Unexpected type of number filter option type:' + selectedOption);
    }
  }

  /**
   * Filters date type data based on the selected option and filter value(s).
   * @param selectedOption
   * @param filterValues Filter values will be generally be single. For in range comparison, it will be an array of two.
   * @param data
   * @param dateFormat String date format. Defaults to 'yyyy-mm-dd'.
   * @returns Whether the data passes the filter requirements.
   */
  protected dateFilter<T extends Date | string = string>(
    selectedOption: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null,
    filterValues: T | T[],
    data: T,
    dateFormat: string = 'yyyy-mm-dd'
  ): boolean {
    function toDate(value: T | T[]): Date | Date[] | null {
      if (!value) {
        return null;
      }
      if (isArray(value)) {
        return value.map(val => (val instanceof Date ? val : new Date(val)));
      } else if (typeof value === 'string') {
        return new Date(value);
      } else {
        return value as Date;
      }
    }

    const cellValue: any = data;
    const rawFilterValues: Date[] | Date = toDate(filterValues);
    const filterValue: Date = isArray(rawFilterValues) ? rawFilterValues[0] : rawFilterValues;

    const comparator: Comparator<Date> = FUI_DEFAULT_NULL_COMPARATOR_FUNC(selectedOption, this.dateComparator(dateFormat));
    const compareResult = comparator(filterValue, cellValue);

    switch (selectedOption) {
      case FuiDatagridDateFilterComponent.EMPTY:
        return false;
      case FuiDatagridDateFilterComponent.EQUALS:
        return compareResult === 0;
      case FuiDatagridDateFilterComponent.GREATER_THAN:
        return compareResult > 0;
      case FuiDatagridDateFilterComponent.LESS_THAN:
        return compareResult < 0;
      case FuiDatagridDateFilterComponent.NOT_EQUAL:
        return compareResult !== 0;
      case FuiDatagridDateFilterComponent.IN_RANGE:
        const compareToResult: number = comparator(rawFilterValues[1], cellValue);
        return compareResult >= 0 && compareToResult <= 0;
      default:
        throw new Error('Unexpected type of date filter option: ' + selectedOption);
    }
  }

  /**
   * Compares numbers for the in filter range option.
   * @returns Comparison result of equal(0), less than(1), or greater than(-1).
   */
  protected numberComparator(): Comparator<number> {
    return (left: number, right: number): number => {
      return FUI_DEFAULT_NUMBER_COMPARATOR(left, right);
    };
  }

  /**
   * Compares dates for the in range filter option.
   * @param dateFormat
   * @returns Comparison result of equal(0), less than(1), or greater than(-1).
   */
  protected dateComparator(dateFormat: string): Comparator<Date> {
    return (filterDate: Date, cellValue: any): number => {
      //The default comparator assumes that the cellValue is a date
      const cellAsDate: Date =
        cellValue instanceof Date
          ? cellValue
          : this.dateIOService.getDateValueFromDateOrString(
              this.dateIOService.convertDateStringToLocalString(cellValue, dateFormat)
            );
      return FUI_DEFAULT_DATE_COMPARATOR(filterDate, cellAsDate);
    };
  }
}
