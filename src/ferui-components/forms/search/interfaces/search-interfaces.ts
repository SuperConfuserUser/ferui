import { FuiSearchResultsObject } from './search-datasource';

/**
 * Search results coming from API.
 */
export interface FuiSearchResultsContext<T = any> {
  resultsObject: FuiSearchResultsObject<T>;
  updateSearchHighlight(): void;
}
