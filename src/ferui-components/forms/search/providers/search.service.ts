import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import { FuiFilterOptionsEnum } from '../../../filters/interfaces/filter-options.enum';
import { FuiFilterEnum } from '../../../filters/interfaces/filter.enum';
import { FeruiUtils } from '../../../utils/ferui-utils';
import {
  FuiFilterDatasourceParamInterface,
  FuiFilterGetDataInterface,
  FuiFilterModel,
  FuiSearchDatasource,
  FuiSearchResultsObject
} from '../interfaces/search-datasource';

@Injectable()
export class FuiSearchService<T = any> {
  private _datasource: FuiSearchDatasource;
  private _results: BehaviorSubject<FuiSearchResultsObject<T>> = new BehaviorSubject<FuiSearchResultsObject<T>>(null);
  private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _empty: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _error: BehaviorSubject<string | Error> = new BehaviorSubject<string | Error>(null);
  private currentSearch: string = null;

  ///////////////////////// GETTERS /////////////////////////

  /**
   * Get search input datasource. Only if displayResult is true.
   */
  get datasource(): FuiSearchDatasource {
    return this._datasource;
  }

  /**
   * Get search input results. Only if displayResult is true.
   */
  get results$(): Observable<FuiSearchResultsObject<T>> {
    return this._results.asObservable();
  }

  /**
   * Whether or not the result section is loading.
   */
  isLoading$(): Observable<boolean> {
    return this._loading.asObservable();
  }

  /**
   * Whether or not the result section is empty.
   */
  isEmpty$(): Observable<boolean> {
    return this._empty.asObservable();
  }

  /**
   * Whether or not we have an error.
   */
  isError$(): Observable<string | Error> {
    return this._error.asObservable();
  }

  ///////////////////////// SETTERS /////////////////////////

  /**
   * Set the datasource if displayResults is true.
   */
  setDatasource(datasource: FuiSearchDatasource): void {
    this._datasource = datasource;
  }

  /**
   * Set the result list.
   * @param results
   */
  setResults(results: FuiSearchResultsObject<T> | null): void {
    // If results is null or undefined, we return null.
    this._results.next(results || null);
  }

  /**
   * Set loading
   * @param isLoading
   */
  setLoading(isLoading: boolean): void {
    this.setEmpty(false);
    this._loading.next(isLoading);
  }

  /**
   * Set empty.
   * @param isEmpty
   */
  setEmpty(isEmpty: boolean): void {
    this._empty.next(isEmpty);
  }

  /**
   * Set an error.
   * @param error
   */
  setError(error: string | Error) {
    this._error.next(error);
  }

  ///////////////////////// PUBLIC METHODS /////////////////////////

  /**
   * Method called each time the user type something. It will call the datasource `getResults` function.
   * @param search
   * @param filterParams
   */
  searchFor(search: string, filterParams?: FuiFilterDatasourceParamInterface[]): Promise<FuiSearchResultsObject<T> | null> {
    this.setLoading(true);
    this.setResults(null);
    if (!search && (!filterParams || (filterParams && filterParams.length === 0))) {
      this.currentSearch = null;
      this.clearResults(false);
      return Promise.resolve(null);
    }

    if (!this.datasource) {
      throw new Error('[FerUI Search] Please provide a datasource to search for results.');
    }

    this.currentSearch = search;
    const searchFilterModel: FuiFilterModel = {
      filterId: FeruiUtils.generateUniqueId('fuiSearchFilter'),
      field: undefined,
      filterType: FuiFilterEnum.GLOBAL_SEARCH,
      filterValue: search,
      filterOption: FuiFilterOptionsEnum.CONTAINS
    };

    const extraFilters: FuiFilterModel[] = [];
    if (filterParams && filterParams.length > 0) {
      filterParams.forEach(f => {
        extraFilters.push({
          filterId: f.filerId,
          field: f.field,
          filterType: f.type,
          filterValue: f.value,
          filterOption: f.option
        });
      });
    }

    const filterGetData: FuiFilterGetDataInterface = {
      request: {
        filterModels: search ? [searchFilterModel, ...extraFilters] : extraFilters
      }
    };

    // We call the datasource 'getResults()' function in order to retrieve data.
    return this.datasource.getResults
      .bind(this.datasource.context)(filterGetData)
      .then((resultsObject: FuiSearchResultsObject<T>) => {
        // During the search, we might type fast and by the time the request is sent we might trigger another request call
        // but with another search string. The issue is that each requests can take a random time to retrieve the results.
        // So we unsure that the promise request that return is the result for the latest search string.
        if (this.currentSearch !== search) {
          return null;
        }
        if (resultsObject && resultsObject.results && resultsObject.results.length > 0) {
          this.setLoading(false);
          this.setResults(resultsObject);
          return resultsObject;
        } else {
          this.clearResults();
          return null;
        }
      })
      .catch(e => {
        this.setError(e);
        this.setLoading(false);
        this.setEmpty(false);
        this.setResults(null);
        return e;
      });
  }

  /**
   * Clear the results and reset the state of the input to default.
   */
  clearResults(isEmpty: boolean = true): void {
    this.setLoading(false);
    this.setEmpty(isEmpty);
    this.setResults(null);
    this.setError(null);
  }
}
