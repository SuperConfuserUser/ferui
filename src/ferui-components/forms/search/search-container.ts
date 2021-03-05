import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  SimpleChange,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { FuiSelectedFilterInterface } from '../../filters/interfaces/filter';
import { FuiFilterService } from '../../filters/providers/filter.service';
import { HilitorService } from '../../hilitor/hilitor';
import { FeruiUtils } from '../../utils/ferui-utils';
import { FuiFormAbstractContainer } from '../common/abstract-container';
import { IfErrorService } from '../common/if-error/if-error.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { FocusService } from '../common/providers/focus.service';
import { FuiFormLayoutService } from '../common/providers/form-layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { PlaceholderService } from '../common/providers/placeholder.service';
import { RequiredControlService } from '../common/providers/required-control.service';

import { FuiFilterDatasourceParamInterface, FuiSearchDatasource } from './interfaces/search-datasource';
import { FuiSearchResultsContext } from './interfaces/search-interfaces';
import { FuiSearchService } from './providers/search.service';

@Component({
  selector: 'fui-search-container',
  template: ` <div class="fui-control-container fui-search-container" [ngClass]="controlClass()">
    <div class="fui-input-wrapper">
      <ng-content select="[fuiLabel]"></ng-content>
      <ng-content select="[fuiSearch]"></ng-content>
      <clr-icon class="fui-search-icon" tabindex="-1" shape="fui-search" aria-hidden="true"></clr-icon>
      <button
        class="btn fui-search-clear-btn"
        [disabled]="ngControl?.disabled"
        *ngIf="ngControl?.valueChanges | async"
        tabindex="0"
        (click)="clearSearch()"
      >
        <clr-icon class="fui-search-clear-icon" shape="fui-clear-field" aria-hidden="true"></clr-icon>
      </button>
      <div class="fui-control-icons">
        <clr-icon *ngIf="invalid" tabindex="0" class="fui-error-icon is-red" shape="fui-error" aria-hidden="true"></clr-icon>
      </div>
      <fui-default-control-error>
        <ng-content select="fui-control-error" *ngIf="invalid"></ng-content>
      </fui-default-control-error>
    </div>

    <div class="fui-search-results-container" *ngIf="shouldDisplayResults()">
      <div
        class="fui-search-results-wrapper"
        [id]="searchResultsWrapperId"
        *ngIf="searchService.results$ | async as resultsObject; else searchLoadingTplt"
      >
        <ng-container
          [ngTemplateOutlet]="searchResultsTemplate || defaultResultsTplt"
          [ngTemplateOutletContext]="{ resultsObject: resultsObject, updateSearchHighlight: updateSearchHighlight.bind(this) }"
        ></ng-container>
        <ng-template #defaultResultsTplt let-results="resultsObject.results" let-total="resultsObject.total">
          <div class="fui-search-results-default-template">
            <p>
              There is a total of <b>{{ total }}</b> rows founds.
            </p>
            <ul class="fui-search-default-view">
              <li *ngFor="let result of results">{{ result | json }}</li>
            </ul>
          </div>
        </ng-template>
      </div>

      <ng-template #searchLoadingTplt>
        <div
          class="fui-search-results-loading-wrapper"
          *ngIf="searchService.isLoading$() | async as loading; else searchEmptyTplt"
        >
          <div class="fui-search-loading-screen">
            <clr-icon class="fui-search-loading-icon" shape="fui-spinner"></clr-icon>
          </div>
        </div>
      </ng-template>

      <ng-template #searchEmptyTplt>
        <div class="fui-search-results-empty-wrapper" *ngIf="searchService.isEmpty$() | async as empty; else searchErrorTplt">
          <div class="fui-search-empty-screen">
            <clr-icon class="fui-body-empty-icon" shape="fui-empty"></clr-icon>
            <div class="fui-body-empty-text">No results found</div>
          </div>
        </div>
      </ng-template>

      <ng-template #searchErrorTplt>
        <div class="fui-search-results-error-wrapper" *ngIf="searchService.isError$() | async as error">
          <div class="fui-search-error-screen">
            <clr-icon class="fui-body-error-icon" shape="fui-error"></clr-icon>
            <div class="fui-body-error-text">{{ error }}</div>
          </div>
        </div>
      </ng-template>
    </div>
  </div>`,
  host: {
    '[class.fui-search-with-results]': 'shouldDisplayResults() === true',
    '[class.fui-form-control]': 'true',
    '[class.fui-form-control-search]': 'true',
    '[class.fui-form-control-small]': 'controlLayout() === fuiFormLayoutEnum.SMALL',
    '[class.fui-form-control-disabled]': 'ngControl?.disabled'
  },
  providers: [
    IfErrorService,
    NgControlService,
    ControlIdService,
    ControlClassService,
    PlaceholderService,
    FocusService,
    RequiredControlService,
    FuiFormLayoutService,
    FuiSearchService,
    HilitorService
  ]
})
export class FuiSearchContainerComponent<T = any> extends FuiFormAbstractContainer implements OnInit, OnChanges {
  // This output take the searchDebounce into account. It will trigger the event only after searchDebounce time. By default
  // it will trigger the event on every ngModelChanges without any delay.
  @Output() readonly searchChange: EventEmitter<string> = new EventEmitter<string>();

  // Whether or not we want to highlight searched words within the results. (only if displayResults is set to true)
  @Input() searchHighlight: boolean = true;
  @Input() searchResultsTemplate: TemplateRef<FuiSearchResultsContext<T>>; // The template to use to render the results.
  @Input() searchDebounce: number = null; // in ms. Search debounce.
  @Input() highlightDebounce: number = 150; // in ms. Debounce for highlighting the search words.
  // By default searchResultsWrapperId is generated automatically, but if you're doing extra formatting to display your results
  // (like displaying them within a Datagrid) you might want hilitor to take only the content of a specific container to look
  // for words to highlight.
  @Input() searchResultsWrapperId: string = FeruiUtils.generateUniqueId('fui-search-wrapper');

  /**
   * Set the datasource if you want to display the results through the component.
   * @param value
   */
  @Input('datasource')
  set datasource(value: FuiSearchDatasource) {
    this.searchService.setDatasource(value);
  }

  private debouncedSearch: NodeJS.Timer;
  private debouncedSearchHighlight: NodeJS.Timer;
  private filterParams: FuiFilterDatasourceParamInterface[];
  private searchValue: string;
  private firstLoad: boolean = true;
  private initialSearchDebounce: number = null;

  constructor(
    ifErrorService: IfErrorService,
    controlClassService: ControlClassService,
    ngControlService: NgControlService,
    focusService: FocusService,
    formLayoutService: FuiFormLayoutService,
    cd: ChangeDetectorRef,
    public searchService: FuiSearchService,
    private hilitor: HilitorService,
    // This will be present only if the search container is within an FuiFilter component.
    @Optional() private filterService: FuiFilterService
  ) {
    super(ifErrorService, controlClassService, ngControlService, focusService, formLayoutService, cd);
    this.hilitor.setMatchType('open');
  }

  ngOnChanges(changes: SimpleChanges) {
    const datasourceChange: SimpleChange = changes.datasource;
    const searchDebounceChange: SimpleChange = changes.searchDebounce;

    // If the change concern the 'searchDebounce' @Input.
    if (searchDebounceChange) {
      // If this is the first change, we set the initialSearchDebounce to this original value.
      this.initialSearchDebounce = searchDebounceChange.currentValue;
    }

    // If the change concern the 'datasource' @Input.
    if (datasourceChange) {
      // If we update the displayResults variable and set it to false, the debounce value should be null. But if we re-activate the
      // displayResults, it should be set to whatever the user have set or 150ms by default.
      // Because when performing a search, it is more likely that it will take some time (even if it is really fast) so we need to
      // have a debounce over the input changes to unsure that the data is up-to-date.
      if (datasourceChange && datasourceChange.currentValue && typeof datasourceChange.currentValue.getResults === 'function') {
        this.searchDebounce =
          searchDebounceChange && searchDebounceChange.currentValue
            ? searchDebounceChange.currentValue
            : this.initialSearchDebounce || 150;
      } else {
        this.searchDebounce = this.initialSearchDebounce || null;
      }
    }
  }

  ngOnInit() {
    if (this.filterService) {
      this.subscriptions.push(
        // If the search component is within an FuiFilter component, we have access to its filterService.
        // (so no need to declare it). We can then watch when filters gets applied so that we re-run the
        // search with according filterParams.
        this.filterService.filtersApplied$().subscribe((sFilters: FuiSelectedFilterInterface[]) => {
          this.filterParams = sFilters
            .filter(f => f.filter.isFilterActive() === true)
            .map(sFilter => {
              return {
                filerId: sFilter.filter.filterId,
                type: sFilter.filter.getFilterType(),
                option: sFilter.filter.getFilterOption(),
                field: sFilter.filter.filterField ? sFilter.filter.filterField.key : undefined,
                value: sFilter.filter.getFilterValue()
              };
            });
          this.doSearch(this.searchValue);
        })
      );
    }
  }

  /**
   * Update highlight of search words in results.
   */
  updateSearchHighlight(): void {
    if (this.ngControl && this.shouldDisplayResults() && this.searchHighlight) {
      if (this.debouncedSearchHighlight) {
        clearTimeout(this.debouncedSearchHighlight);
      }
      this.debouncedSearchHighlight = setTimeout(() => {
        // If there is no results, we don't have any results wrapper anymore so we need to disable hilitor.
        if (document.getElementById(this.searchResultsWrapperId)) {
          // By default, if there is no HTML element found for 'searchResultsWrapperId', hilitor will use the body.
          // That's the reason why we check if the element exist first.
          this.hilitor.setTargetNode(this.searchResultsWrapperId);
          this.toggleSearchHighlight(this.ngControl.value);
        } else {
          this.hilitor.remove();
        }
      }, this.highlightDebounce);
    }
  }

  /**
   * Clear the search and validators.
   */
  clearSearch() {
    if (this.ngControl) {
      this.ngControl.reset(null);
      this.searchValue = null;
      // We directly clear the results.
      this.searchService.clearResults(false);
    }
  }

  /**
   * Force the search. If for some reason you need to run the search again manually.
   * @param searchValue
   */
  forceSearch(searchValue?: string) {
    this.searchValue = searchValue || this.searchValue;
    this.doSearch(this.searchValue);
  }

  /**
   * Get the datasource.
   */
  getDatasource(): FuiSearchDatasource {
    return this.searchService.datasource;
  }

  /**
   * Whether or not we should display the result container.
   */
  shouldDisplayResults(): boolean {
    return !FeruiUtils.isNullOrUndefined(this.getDatasource());
  }

  /**
   * Callback called on every input model changes.
   * @param control
   * @protected
   */
  protected onNgControlChange(control: NgControl) {
    if (control) {
      this.ngControl = control;
      if (this.ngControlValueChangeSub) {
        this.ngControlValueChangeSub.unsubscribe();
      }
      this.ngControlValueChangeSub = this.ngControl.valueChanges.subscribe((value: string) => {
        if (!value && this.firstLoad) {
          this.firstLoad = false;
          return;
        }
        this.searchValue = value;
        this.doSearch(value);
        this.firstLoad = false;
      });
    }
  }

  /**
   * Do the search.
   * @param value
   * @private
   */
  private doSearch(value: string) {
    if (!FeruiUtils.isNullOrUndefined(this.searchDebounce)) {
      if (this.debouncedSearch) {
        clearTimeout(this.debouncedSearch);
      }
      this.debouncedSearch = setTimeout(() => {
        this.toggleSearch(value);
        this.cd.markForCheck();
      }, this.searchDebounce);
    } else {
      this.toggleSearch(value);
      this.cd.markForCheck();
    }
  }

  /**
   * Toggle the search. This will emit the searchChange Event and run the searchFor function when displayResults is true.
   * @param value
   * @private
   */
  private toggleSearch(value: string) {
    this.searchChange.emit(value);
    if (this.shouldDisplayResults()) {
      this.searchService.searchFor(value, this.filterParams).then(() => {
        this.updateSearchHighlight();
      });
    }
  }

  /**
   * Whether or not we display search strings within the results.
   * @param searchTerms
   * @private
   */
  private toggleSearchHighlight(searchTerms: string): void {
    if (searchTerms === '') {
      this.hilitor.remove();
    } else {
      this.hilitor.apply(searchTerms);
    }
  }
}
