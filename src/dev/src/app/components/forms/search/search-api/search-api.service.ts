import { Observable, Subject, Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { FuiFilterGetDataInterface, FuiSearchResultsObject } from '@ferui/components';

import { DemoFilterService } from '../../../filter/demo-filter.service';

export interface SearchApiPersonJson {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  favorite_animal: string;
  favorite_color: string;
}

@Injectable()
export class SearchApiService {
  SERVER_URL: string = document.baseURI + '/persons-data.json';
  allResultsSubscription: Subscription;

  constructor(private httpClient: HttpClient, private demoFilterService: DemoFilterService) {}

  /**
   * Search for specified search and filters.
   * @param filterParams
   */
  searchFor(filterParams: FuiFilterGetDataInterface): Observable<FuiSearchResultsObject<SearchApiPersonJson>> {
    const subject = new Subject<FuiSearchResultsObject<SearchApiPersonJson>>();

    this.allResultsSubscription = this.getAllResults().subscribe(results => {
      // The timeout is only for testing purposes, we want to see the loading screen
      // each time we type something to emulate an API call.
      setTimeout(() => {
        subject.next(this.filterResults(results, filterParams));
        // We unsubscribe just after getting the results.
        this.allResultsSubscription.unsubscribe();
      }, Math.random() * (1100 - 700) + 700); // The request will randomly takes between 700ms to 1099ms to resolve.
    });
    return subject.asObservable();
  }

  private filterResults(
    results: SearchApiPersonJson[],
    filterParams?: FuiFilterGetDataInterface
  ): FuiSearchResultsObject<SearchApiPersonJson> {
    const filteredResults: SearchApiPersonJson[] = this.demoFilterService.filterData(results, filterParams);
    return {
      results: filteredResults,
      total: filteredResults.length
    };
  }

  private getAllResults(): Observable<SearchApiPersonJson[]> {
    return this.httpClient.get<SearchApiPersonJson[]>(this.SERVER_URL).pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('[FerUI demo Search]', error); // log to console instead
    return throwError(error);
  }
}
