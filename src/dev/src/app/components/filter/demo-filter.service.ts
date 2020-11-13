import { isArray } from 'util';

import { Injectable } from '@angular/core';

import {
  Comparator,
  DateIOService,
  FUI_DEFAULT_DATE_COMPARATOR,
  FUI_DEFAULT_NULL_COMPARATOR_FUNC,
  FUI_DEFAULT_NUMBER_COMPARATOR,
  FUI_DEFAULT_TEXT_COMPARATOR,
  FUI_DEFAULT_TEXT_LOWERCASE_FORMATTER,
  FuiDatagridBooleanFilterComponent,
  FuiDatagridDateFilterComponent,
  FuiFilterEnum,
  FuiFilterGetDataInterface,
  FuiFilterModel,
  FuiFilterOptionDefInterface,
  FuiFilterOptionsEnum
} from '@ferui/components';

@Injectable({ providedIn: 'root' })
export class DemoFilterService {
  constructor(private dateIOService: DateIOService) {}

  filterData<T = any>(results: any[], params: FuiFilterGetDataInterface<T>): T[] {
    const filters: FuiFilterModel[] = params.request.filterModels;
    if (filters.length === 0) {
      return [...results];
    }

    const filteredData: any[] = [];
    let doesFiltersPass: boolean = true;
    results.forEach(data => {
      doesFiltersPass = true;

      for (const filter of filters) {
        if (filter.filterType === FuiFilterEnum.GLOBAL_SEARCH) {
          doesFiltersPass = false;
          for (const key in data) {
            if (data.hasOwnProperty(key) && data[key]) {
              if (this.doesFilterPass(filter, data[key])) {
                doesFiltersPass = true;
                break;
              }
            }
          }
          if (doesFiltersPass === false) {
            break;
          }
        } else {
          if (!this.doesFilterPass(filter, data[filter.field])) {
            doesFiltersPass = false;
            break;
          }
        }
      }

      if (doesFiltersPass) {
        filteredData.push(data);
      }
    });
    return filteredData;
  }

  private doesFilterPass(filter: FuiFilterModel, data: any): boolean {
    if (filter.filterType === FuiFilterEnum.STRING || filter.filterType === FuiFilterEnum.GLOBAL_SEARCH) {
      return this.textFilter(filter.filterOption, filter.filterValue, data);
    } else if (filter.filterType === FuiFilterEnum.NUMBER) {
      return this.numberFilter(filter.filterOption, filter.filterValue, data);
    } else if (filter.filterType === FuiFilterEnum.BOOLEAN) {
      return this.booleanFilter(filter.filterValue, data);
    } else if (filter.filterType === FuiFilterEnum.DATE) {
      return this.dateFilter(filter.filterOption, filter.filterValue, data);
    } else if (filter.filterType === FuiFilterEnum.CUSTOM) {
      // Mockup for the gender field.
      if (filter.field === 'gender') {
        let pass: boolean = false;
        const filterValues: string[] = [];
        for (const k in filter.filterValue) {
          if (filter.filterValue.hasOwnProperty(k) && filter.filterValue[k] === true) {
            filterValues.push(k);
          }
        }
        filterValues.forEach(val => {
          if (this.textFilter(FuiFilterOptionsEnum.EQUALS, val, data)) {
            pass = true;
          }
        });
        return pass;
      }
    }
    return false;
  }

  private textFilter<T extends string = string>(
    selectedOption: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null,
    selectedSearch: T,
    data: T
  ): boolean {
    const formatter = FUI_DEFAULT_TEXT_LOWERCASE_FORMATTER;
    const comparator = FUI_DEFAULT_TEXT_COMPARATOR;
    return comparator(selectedOption, formatter(data), formatter(selectedSearch));
  }

  private booleanFilter<T extends string | boolean = string | boolean>(selectedValue: T, data: T): boolean {
    const formatter = FuiDatagridBooleanFilterComponent.DEFAULT_FORMATTER;
    if (!data) {
      return false;
    }
    return formatter(data) === formatter(selectedValue);
  }

  private numberFilter<T extends number = number>(
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
        throw new Error('Unexpected type of filter: ' + selectedOption);
    }
  }

  private dateFilter<T extends Date | string = string>(
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
        throw new Error('Unexpected type of filter: ' + selectedOption);
    }
  }

  private numberComparator(): Comparator<number> {
    return (left: number, right: number): number => {
      return FUI_DEFAULT_NUMBER_COMPARATOR(left, right);
    };
  }

  private dateComparator(dateFormat): Comparator<Date> {
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
