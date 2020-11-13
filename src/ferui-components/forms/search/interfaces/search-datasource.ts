import { FuiFilterOptionDefInterface } from '../../../filters/interfaces/filter';
import { FuiFilterOptionsEnum } from '../../../filters/interfaces/filter-options.enum';
import { FuiFilterEnum } from '../../../filters/interfaces/filter.enum';

/**
 * The search input datasource. This will allow the devs to bind whatever API calls that they want and make the results feed
 * the search results section.
 */
export interface FuiSearchDatasource<T = any, C = any> {
  // The context object to use within the getResults function.
  context?: C;

  // This function is called whenever the user type something in the search input.
  getResults(params: FuiFilterGetDataInterface<T>): Promise<FuiSearchResultsObject<T>>;
}

/**
 * Result object containing the results of the search. Note that the results must be an array.
 */
export interface FuiSearchResultsObject<T = any> {
  results: T[]; // The current chunk of data coming from the server.
  total?: number; // The total result is optional.
}

export interface FuiFilterDatasourceParamInterface<T = any> {
  filerId: string;
  type: FuiFilterEnum;
  option: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null;
  field: string;
  value: T | T[];
}

export interface FuiFilterModel<T = any> {
  filterId: string;
  field: string;
  filterType: FuiFilterEnum;
  filterValue: T | T[];
  filterOption: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null;
  filterParams?: any;
}

export interface FuiFilterGetDataInterface<T = any> {
  // if filtering, what the filter model is
  request: FuiFilterGetDataRequest<T>;
  fields?: string[];
}

export interface FuiFilterGetDataRequest<T = any> {
  // if filtering, what the filter model is
  filterModels?: FuiFilterModel<T>[];
  offset?: number;
  limit?: number;
}
