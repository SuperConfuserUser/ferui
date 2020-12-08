import { SearchApiPersonJson } from '../../../../dev/src/app/components/forms/search/search-api/search-api.service';
import { FuiFilterOptionsEnum } from '../../../filters/interfaces/filter-options.enum';
import { FuiFilterEnum } from '../../../filters/interfaces/filter.enum';
import {
  FuiFilterGetDataInterface,
  FuiFilterModel,
  FuiSearchDatasource,
  FuiSearchResultsObject
} from '../interfaces/search-datasource';

import { FuiSearchService } from './search.service';

export default function (): void {
  describe('FuiSearchService', () => {
    let service: FuiSearchService;
    const testResults = [
      { id: 'test1', label: 'Test 1' },
      { id: 'test2', label: 'Test 2' }
    ];

    function getSearchDatasource(error?: boolean): FuiSearchDatasource<any> {
      return {
        getResults(params: FuiFilterGetDataInterface): Promise<FuiSearchResultsObject<SearchApiPersonJson>> {
          return new Promise((resolve, reject) => {
            if (!error) {
              const filteredResults = [];
              const filters: FuiFilterModel[] = params.request.filterModels;
              testResults.forEach(result => {
                let pass = false;
                filters.forEach(filter => {
                  if (filter.filterOption === FuiFilterOptionsEnum.EQUALS) {
                    pass = filter.filterValue === result.id;
                  } else if (filter.filterOption === FuiFilterOptionsEnum.CONTAINS) {
                    pass = result.id.indexOf(filter.filterValue) > -1;
                  }
                });

                if (pass) {
                  filteredResults.push(result);
                }
              });

              resolve({
                results: filteredResults,
                total: filteredResults.length
              });
            } else {
              reject('Test error');
            }
          });
        }
      };
    }

    beforeEach(() => {
      service = new FuiSearchService();
    });

    it('Should get the datasource', () => {
      expect(service.datasource).toBeUndefined();
      service.setDatasource(getSearchDatasource());
      expect(service.datasource).toBeDefined();
    });

    it('Should get the results', (done: DoneFn) => {
      let count = 0;
      service.results$.subscribe(resultsObject => {
        if (count === 0) {
          expect(resultsObject).toBeNull();
          count++;
        } else {
          expect(resultsObject.total).toEqual(2);
          expect(resultsObject.results).toEqual(testResults);
          done();
        }
      });
      service.setResults({
        results: testResults,
        total: testResults.length
      });
    });

    it('Should check if the service is loading', (done: DoneFn) => {
      let falsyCount = 0;
      let truthyCount = 0;
      service.isLoading$().subscribe(isLoading => {
        if (isLoading === true) {
          truthyCount++;
          expect(isLoading).toBeTruthy();
        } else {
          falsyCount++;
          expect(isLoading).toBeFalsy();
        }
        if (truthyCount === 1 && falsyCount === 2) {
          done();
        }
      });
      service.setLoading(true);
      service.setLoading(false);
    });

    it('Should check if the service is empty', (done: DoneFn) => {
      let falsyCount = 0;
      let truthyCount = 0;
      service.isEmpty$().subscribe(isEmpty => {
        if (isEmpty === true) {
          truthyCount++;
          expect(isEmpty).toBeTruthy();
        } else {
          falsyCount++;
          expect(isEmpty).toBeFalsy();
        }
        if (truthyCount === 1 && falsyCount === 2) {
          done();
        }
      });
      service.setEmpty(true);
      service.setEmpty(false);
    });

    it('Should throw an error if no datasource set.', (done: DoneFn) => {
      const search = 'test';
      try {
        service.searchFor(search);
      } catch (e) {
        expect(e).toBeDefined();
        done();
      }
    });

    it('Should be able to search for "test" and retrieve 2 results', (done: DoneFn) => {
      service.setDatasource(getSearchDatasource());
      const search = 'test';
      // By default, the search filter use the 'CONTAINS' option.
      service.searchFor(search).then(resultsObject => {
        expect(resultsObject.total).toEqual(2);
        expect(resultsObject.results.length).toEqual(2);
        done();
      });
    });

    it('Should be able to search for "test1" and retrieve 1 result', (done: DoneFn) => {
      service.setDatasource(getSearchDatasource());
      const search = 'test1';
      // By default, the search filter use the 'CONTAINS' option.
      service.searchFor(search).then(resultsObject => {
        expect(resultsObject.total).toEqual(1);
        expect(resultsObject.results.length).toEqual(1);
        done();
      });
    });

    it('Should be able to search using only custom filters and retrieve 2 results', (done: DoneFn) => {
      service.setDatasource(getSearchDatasource());
      const customFilter = {
        filerId: 'testFilter',
        type: FuiFilterEnum.STRING,
        option: FuiFilterOptionsEnum.CONTAINS,
        field: 'id',
        value: 'test'
      };
      // By default, the search filter use the 'CONTAINS' option.
      service.searchFor(null, [customFilter]).then(resultsObject => {
        expect(resultsObject.total).toEqual(2);
        expect(resultsObject.results.length).toEqual(2);
        done();
      });
    });

    it('Should be able to search using only custom filters and retrieve 1 result', (done: DoneFn) => {
      service.setDatasource(getSearchDatasource());
      const customFilter = {
        filerId: 'testFilter',
        type: FuiFilterEnum.STRING,
        option: FuiFilterOptionsEnum.EQUALS,
        field: 'id',
        value: 'test1'
      };
      // By default, the search filter use the 'CONTAINS' option.
      service.searchFor(null, [customFilter]).then(resultsObject => {
        expect(resultsObject.total).toEqual(1);
        expect(resultsObject.results.length).toEqual(1);
        done();
      });
    });
  });
}
