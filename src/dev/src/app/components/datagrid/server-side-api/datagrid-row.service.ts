import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  ColumnVO,
  Comparator,
  DATAGRID_GLOBAL_SEARCH_ID,
  DateIOService,
  FilterModel,
  FilterType,
  FuiDatagridBooleanFilterComponent,
  FuiDatagridDateFilterComponent,
  FuiDatagridNumberFilterComponent,
  FuiDatagridSortDirections,
  FuiDatagridTextFilterComponent,
  FuiFieldTypes,
  IDatagridResultObject,
  IDoesGlobalFilterPassParams,
  IServerSideGetRowsParams,
  NullComparator,
  SortModel,
  orderByComparator
} from '@ferui/components';

export interface IDatagridRowData {
  id: number;
  username: string;
  gender: string;
  first_name: string;
  last_name: string;
  email: string;
  age: number;
  eye_color: string;
  company: string;
  address: string;
  country: string;
  country_code: string;
  phone: string;
  ip_address: string;
  is_active: boolean;
  is_registered: boolean;
  avatar: string;
  favourite_animal: string;
  creation_date: string;
  epoch_date: string | number;
  favorite_movie: string;
  user_agent: string;
}

@Injectable({
  providedIn: 'root'
})
export class RowDataApiService {
  SERVER_URL: string = document.baseURI + '/datagrid-10k-data.min.json';

  constructor(private httpClient: HttpClient, private dateIOService: DateIOService) {}

  getGroupedRows(
    params: IServerSideGetRowsParams,
    groupField: string,
    groupValue: string,
    maxResults: number = 0,
    withTotalRows: boolean = true
  ): Observable<IDatagridResultObject> {
    if (params.request && !params.request.filterModel) {
      params.request.filterModel = [];
    }
    params.request.filterModel.push({
      id: `generated_${groupField}`,
      visible: true,
      name: `Generated ${groupField}`,
      field: groupField,
      filterable: true,
      filterType: FilterType.STRING,
      filterValue: groupValue,
      filterOption: FuiDatagridTextFilterComponent.EQUALS
    });

    return this.getRows(params, maxResults, withTotalRows);
  }

  getRows(
    params: IServerSideGetRowsParams,
    maxResults: number = 0,
    withTotalRows: boolean = true,
    groupByField?: string
  ): Observable<IDatagridResultObject> {
    const subject = new Subject<IDatagridResultObject>();

    this.httpClient
      .get<IDatagridRowData[]>(this.SERVER_URL)
      .pipe(catchError(this.handleError))
      .subscribe(results => {
        if (groupByField) {
          const fields: string[] = [];
          results = results.reduce((groups, item) => {
            const val: string = item[groupByField];
            // For testing purposes we only store one item by field
            if (fields.indexOf(val) < 0) {
              groups.push(item);
              fields.push(val);
            }
            return groups;
          }, []);
        }

        const res = maxResults === 0 ? results : results.slice(0, maxResults);
        // DO THE FILTERING
        let filteredAndSortedData: any[] = this.filterData(res, params);

        // If we have 0 results, we directly send a response.
        if (filteredAndSortedData.length === 0) {
          if (withTotalRows) {
            subject.next({
              total: 0,
              data: []
            });
          } else {
            subject.next({
              data: []
            });
          }
        }

        // DO THE SORTING
        filteredAndSortedData = this.sortData(filteredAndSortedData, params);

        // Split the results into chunks
        const offset: number = params.request.offset;
        const limit: number = params.request.limit;
        const calc: number = offset + limit;
        const chunkedData = filteredAndSortedData.slice(
          offset,
          calc > filteredAndSortedData.length ? filteredAndSortedData.length : calc
        );

        // Return the filtered and sorted value.
        if (withTotalRows) {
          subject.next({
            total: filteredAndSortedData.length,
            data: chunkedData
          });
        } else {
          subject.next({
            data: chunkedData
          });
        }
      });

    return subject.asObservable();
  }

  getHundredRows(params: IServerSideGetRowsParams, withTotalRows: boolean = true): Observable<IDatagridResultObject> {
    return this.getRows(params, 100, withTotalRows);
  }

  private handleError(error: any) {
    console.error(error); // log to console instead
    return throwError(error);
  }

  private filterData(results: any[], params: IServerSideGetRowsParams): any[] {
    const filters: FilterModel[] = params.request.filterModel
      ? params.request.filterModel.filter(f => f.id !== DATAGRID_GLOBAL_SEARCH_ID)
      : [];
    const globalSearchFilter: FilterModel = params.request.filterModel
      ? params.request.filterModel.filter(f => f.id === DATAGRID_GLOBAL_SEARCH_ID)[0]
      : null;
    if (filters.length === 0 && globalSearchFilter === null) {
      return [...results];
    }

    const filteredData: any[] = [];
    let doesFiltersPass: boolean = true;
    let globalSearchPass: boolean = true;
    results.forEach(data => {
      doesFiltersPass = true;
      globalSearchPass = true;

      for (const filter of filters) {
        if (!this.doesFilterPass(filter, data[filter.field])) {
          doesFiltersPass = false;
          break;
        }
      }
      if (globalSearchFilter) {
        const doesPassParams: IDoesGlobalFilterPassParams = { rowData: data, data: null };
        if (
          !this.doesGlobalSearchFilterPass(
            doesPassParams,
            params.request.columns,
            globalSearchFilter.filterOption,
            globalSearchFilter.filterValue
          )
        ) {
          globalSearchPass = false;
        }
      }

      if (doesFiltersPass && globalSearchPass) {
        filteredData.push(data);
      }
    });
    return filteredData;
  }

  private doesGlobalSearchFilterPass(
    params: IDoesGlobalFilterPassParams,
    columns: ColumnVO[],
    selectedType,
    selectedSearch
  ): boolean {
    const rowData: any = params.rowData;
    const formatter = FuiDatagridTextFilterComponent.DEFAULT_LOWERCASE_FORMATTER;
    const comparator = FuiDatagridTextFilterComponent.DEFAULT_COMPARATOR;
    let pass: boolean = false;
    if (columns.length > 0 && rowData) {
      columns.forEach(column => {
        if (formatter(rowData[column.id]) !== null) {
          const filterPass: boolean = comparator(selectedType, formatter(rowData[column.id]), formatter(selectedSearch));
          if (filterPass === true) {
            pass = true;
          }
        }
      });
    }
    return pass;
  }

  private doesFilterPass(filter: FilterModel, data: any): boolean {
    if (filter.filterType === FilterType.STRING) {
      return this.textFilter(filter.filterOption, filter.filterValue, data);
    } else if (filter.filterType === FilterType.NUMBER) {
      return this.numberFilter(filter.filterOption, filter.filterValue, data);
    } else if (filter.filterType === FilterType.BOOLEAN) {
      return this.booleanFilter(filter.filterValue, data);
    } else if (filter.filterType === FilterType.DATE) {
      return this.dateFilter(filter.filterOption, filter.filterValue, data);
    }
    return false;
  }

  private textFilter(selectedType: string, selectedSearch: string, data: string): boolean {
    const formatter = FuiDatagridTextFilterComponent.DEFAULT_LOWERCASE_FORMATTER;
    const comparator = FuiDatagridTextFilterComponent.DEFAULT_COMPARATOR;
    return comparator(selectedType, formatter(data), formatter(selectedSearch));
  }

  private booleanFilter(selectedValue: string | boolean, data: string | boolean): boolean {
    const formatter = FuiDatagridBooleanFilterComponent.DEFAULT_FORMATTER;
    if (data === null && data === undefined && data === '') {
      return false;
    }
    return formatter(data) === formatter(selectedValue);
  }

  private numberFilter(selectedType: string, filterValues: number | number[], data: number): boolean {
    const cellValue: any = data;
    const filterValue: number = Array.isArray(filterValues) ? filterValues[0] : filterValues;
    const comparator: Comparator<number> = this.nullComparator(selectedType, this.numberComparator());
    const compareResult = comparator(filterValue, cellValue);

    switch (selectedType) {
      case FuiDatagridNumberFilterComponent.EMPTY:
        return false;
      case FuiDatagridNumberFilterComponent.EQUALS:
        return compareResult === 0;
      case FuiDatagridNumberFilterComponent.GREATER_THAN:
        return compareResult > 0;
      case FuiDatagridNumberFilterComponent.GREATER_THAN_OR_EQUAL:
        return compareResult >= 0;
      case FuiDatagridNumberFilterComponent.LESS_THAN_OR_EQUAL:
        return compareResult <= 0;
      case FuiDatagridNumberFilterComponent.LESS_THAN:
        return compareResult < 0;
      case FuiDatagridNumberFilterComponent.NOT_EQUAL:
        return compareResult !== 0;
      case FuiDatagridNumberFilterComponent.IN_RANGE:
        const compareToResult: number = comparator((filterValues as number[])[1], cellValue);
        return compareResult >= 0 && compareToResult <= 0;
      default:
        throw new Error('Unexpected type of filter: ' + selectedType);
    }
  }

  private dateFilter(
    selectedType: string,
    filterValues: string | string[],
    data: string,
    dateFormat: string = 'yyyy-mm-dd'
  ): boolean {
    function toDate(value: string | string[]): Date | Date[] | null {
      if (!value) {
        return null;
      }
      if (Array.isArray(value)) {
        return value.map(str => new Date(str));
      } else {
        return new Date(value);
      }
    }

    const cellValue: any = data;
    const rawFilterValues: Date[] | Date = toDate(filterValues);
    const filterValue: Date = Array.isArray(rawFilterValues) ? rawFilterValues[0] : rawFilterValues;

    const comparator: Comparator<Date> = this.nullComparator(selectedType, this.dateComparator(dateFormat));
    const compareResult = comparator(filterValue, cellValue);

    switch (selectedType) {
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
        throw new Error('Unexpected type of filter: ' + selectedType);
    }
  }

  private numberComparator(): Comparator<number> {
    return (left: number, right: number): number => {
      if (left === right) {
        return 0;
      }
      if (left < right) {
        return 1;
      }
      if (left > right) {
        return -1;
      }
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

      if (cellAsDate < filterDate) {
        return -1;
      }
      if (cellAsDate > filterDate) {
        return 1;
      }
      return cellValue !== null ? 0 : -1;
    };
  }

  private translateNull(type: string): boolean {
    const reducedType: string =
      type.indexOf('greater') > -1 ? 'greaterThan' : type.indexOf('lessThan') > -1 ? 'lessThan' : 'equals';
    return (FuiDatagridNumberFilterComponent.DEFAULT_NULL_COMPARATOR as NullComparator)[reducedType];
  }

  private nullComparator(selectedType: string, comparator: Comparator<number | Date>): Comparator<number | Date> {
    return (filterValue: number, gridValue: number): number => {
      if (gridValue === null) {
        const nullValue = this.translateNull(selectedType);
        switch (selectedType) {
          case FuiDatagridNumberFilterComponent.EMPTY:
            return 0;
          case FuiDatagridNumberFilterComponent.EQUALS:
            return nullValue ? 0 : 1;
          case FuiDatagridNumberFilterComponent.GREATER_THAN:
            return nullValue ? 1 : -1;
          case FuiDatagridNumberFilterComponent.GREATER_THAN_OR_EQUAL:
            return nullValue ? 1 : -1;
          case FuiDatagridNumberFilterComponent.LESS_THAN_OR_EQUAL:
            return nullValue ? -1 : 1;
          case FuiDatagridNumberFilterComponent.LESS_THAN:
            return nullValue ? -1 : 1;
          case FuiDatagridNumberFilterComponent.NOT_EQUAL:
            return nullValue ? 1 : 0;
          default:
            break;
        }
      }
      return comparator(filterValue, gridValue);
    };
  }

  private sortData(results: any[], params: IServerSideGetRowsParams): any[] {
    const rowToIndexMap = new Map<any, number>();
    results.forEach((row, index) => rowToIndexMap.set(row, index));

    function manageFieldType(field, column) {
      if (column.sortType && column.sortType === FuiFieldTypes.DATE && !(field[column.field] instanceof Date)) {
        return new Date(field[column.field]);
      } else if (column.sortType && column.sortType === FuiFieldTypes.NUMBER) {
        return Number(field[column.field]);
      } else {
        return field[column.field];
      }
    }

    const columns: SortModel[] = params.request.sortModel || [];
    const sortedColumns: SortModel[] = columns.sort((a: SortModel, b: SortModel) => {
      const aOrder = a.sortOrder;
      const bOrder = b.sortOrder;
      let comparison = 0;
      if (aOrder > bOrder) {
        comparison = 1;
      } else if (aOrder < bOrder) {
        comparison = -1;
      }
      return comparison;
    });

    const temp = [...results];
    return temp.sort((a: any, b: any) => {
      for (const column of sortedColumns) {
        const propA = manageFieldType(a, column);
        const propB = manageFieldType(b, column);

        const comparison =
          column.sort !== FuiDatagridSortDirections.DESC ? orderByComparator(propA, propB) : -orderByComparator(propA, propB);

        // Don't return 0 yet in case of needing to sort by next property
        if (comparison !== 0) {
          return comparison;
        }
      }

      if (!(rowToIndexMap.has(a) && rowToIndexMap.has(b))) {
        return 0;
      }
      return rowToIndexMap.get(a) < rowToIndexMap.get(b) ? -1 : 1;
    });
  }
}
