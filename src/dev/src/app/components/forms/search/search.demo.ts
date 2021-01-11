import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import {
  FuiColumnDefinitions,
  FuiFilterEnum,
  FuiFilterFieldInterface,
  FuiFilterGetDataInterface,
  FuiSearchDatasource,
  FuiSearchResultsObject
} from '@ferui/components';

import { DemoComponentData } from '../../../utils/demo-component-data';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';

import { DemoCustomGenderFilterComponent } from './filters/custom-gender-filter.component';
import { SearchApiPersonJson, SearchApiService } from './search-api/search-api.service';

@Component({
  template: `
    <form fuiForm class="container-fluid" #demoForm="ngForm">
      <fui-tabs>
        <fui-tab [title]="'Documentation'" [active]="true">
          <div class="container-fluid">
            <div class="row" style="max-width: 1200px">
              <div class="col-12">
                <h1 class="mt-4 mb-4">Search component</h1>
                <h2 class="mt-4 mb-4">
                  Overview <a [routerLink] [fragment]="'overview'" class="anchor-link" id="overview">#</a>
                </h2>
                <p>
                  The search form control is a bit different than the other form controls because it can be used as a regular
                  text/search input with validation but it can also display the results of a search directly to a result template
                  that you can provide including state management out of the box.
                </p>

                <h2 class="mt-4 mb-4">
                  Table of Contents <a [routerLink] [fragment]="'tableofcontent'" class="anchor-link" id="tableofcontent">#</a>
                </h2>
                <ol>
                  <li>
                    <a [routerLink] [fragment]="'typesofcomponents'">Types of search component</a>
                    <ul>
                      <li><a [routerLink] [fragment]="'regularsearch'">Regular search input</a></li>
                      <li><a [routerLink] [fragment]="'searchwithresults'">Search input with results</a></li>
                    </ul>
                  </li>
                  <li>
                    <a [routerLink] [fragment]="'usage'">Usage</a>
                    <ul>
                      <li><a [routerLink] [fragment]="'searchDatasource'">Search Datasource</a></li>
                      <li><a [routerLink] [fragment]="'resultsTemplates'">Results templates</a></li>
                      <li><a [routerLink] [fragment]="'searchHighlight'">Search Highlight</a></li>
                    </ul>
                  </li>
                  <li><a [routerLink] [fragment]="'api'">Public API</a></li>
                  <li><a [routerLink] [fragment]="'interfaces'">Interfaces and Types</a></li>
                  <li><a [routerLink] [fragment]="'filters'">Filters</a></li>
                </ol>

                <h2 class="mt-4 mb-4">
                  Types of search component
                  <a [routerLink] [fragment]="'typesofcomponents'" class="anchor-link" id="typesofcomponents">#</a>
                </h2>

                <p>We can split this search component into two types:</p>
                <ol>
                  <li>Regular search input (here, we only have the search input with all its default bindings)</li>
                  <li>
                    Search input with results (here, we have the search input plus the result of the search rendered below with
                    extended state management)
                  </li>
                </ol>
                <h4 class="mt-3 mb-3">
                  Regular search input <a [routerLink] [fragment]="'regularsearch'" class="anchor-link" id="regularsearch">#</a>
                </h4>
                <p>
                  Most of the time, you just need to use a simple search input within your component in order to have a well
                  designed (an input with a clear button and a search icon) search input to make a search and display the results
                  accordingly within the component of your choice through the default Angular bindings (like
                  <code>(ngModelChange)="youCallback($event)"</code>) to execute the search an display the results wherever you
                  want, the way you want it to.
                </p>

                <fui-search-container>
                  <label fuiLabel>Regular search</label>
                  <input type="search" fuiSearch name="exampleRegularInput" [(ngModel)]="model.one" />
                </fui-search-container>

                <h4 class="mt-3 mb-3">
                  Search input with results
                  <a [routerLink] [fragment]="'searchwithresults'" class="anchor-link" id="searchwithresults">#</a>
                </h4>
                <p>
                  Besides the "common" search input below, you can directly use this component to display the results as well. By
                  default, there is a JSON formatted list, but you can basically use your own result formatter template. You can
                  also use FerUI components like the Datagrid or treeview to display your results. The design of those FerUI
                  components is already adapted, so you won't need to do extra work to get the design right.
                </p>

                <fui-search-container [datasource]="exampleDatasource">
                  <label fuiLabel>Search with display results</label>
                  <input type="search" fuiSearch name="exampleResultsInput" [(ngModel)]="model.two" />
                </fui-search-container>

                <h2 class="mt-4 mb-4">Usage <a [routerLink] [fragment]="'usage'" class="anchor-link" id="usage">#</a></h2>

                <p><b>Requires</b>: Import <code>FeruiModule</code> to your app or ngModule.</p>

                <p>Like explained above, we have two types of search components.</p>

                <h5 class="mt-2 mb-2">To use the default search input approach, you just need to do:</h5>

                <pre><code [languages]="['html']" [highlight]="regularInputExample"></code></pre>

                <p><b>Note</b> that the input type can be either <code>search</code> or <code>text</code>.</p>

                <h5 class="mt-2 mb-2">If you want more options, you can wrap the input with its dedicated container:</h5>

                <pre><code [languages]="['html']" [highlight]="regularInputContainerExample"></code></pre>

                <p>
                  <b>Note</b> that if you want to add a <code>searchDebounce</code> (waiting some time before triggering the
                  search event) you should use the <code>(searchChange)="onModelChange($event)"</code> function on the search
                  container instead of <code>(ngModelChange)="onModelChange($event)"</code> because this event takes the debounce
                  time into account where the default angular one doesn't.
                </p>

                <h5 class="mt-2 mb-2">
                  If you want to display the results directly through this component, you would need to add extra configurations
                  and you must use the search container to wrap your search input:
                </h5>

                <pre><code [languages]="['html']" [highlight]="searchInputWithResultsExample"></code></pre>

                <p>As you can see, we've added one mandatory config to our previous example:</p>
                <ul>
                  <li>
                    <code>[datasource]</code>: This is used to retrieve the data (see more details
                    <a [routerLink] [fragment]="'searchDatasource'">here</a>).
                    <b>If you set a datasource, the results will be displayed within this component directly.</b>
                  </li>
                </ul>

                <h4 class="mt-3 mb-3">
                  Search Datasource
                  <a [routerLink] [fragment]="'searchDatasource'" class="anchor-link" id="searchDatasource">#</a>
                </h4>

                <p>
                  The datasource is mandatory if you want to display the results directly from this component. It is the brain of
                  the component which allows you to make requests to retrieve the results corresponding to the text you typed and
                  display them within a results container placeholder.<br />
                  By default we're adding a <b>150ms</b> debounce to the search to not make a request call on every characters
                  typed. This can be overridden and even set to 0 if wanted.
                </p>

                <p>
                  To create a datasource, it is pretty simple, you just need to create a
                  <code>FuiSearchDatasource&lt;T&gt;</code> object that returns a
                  <code>getResults(params: FuiFilterGetDataInterface): Promise&lt;FuiSearchResultsObject&lt;T&gt;&gt;</code>
                  function returning a promise containing your search results object.
                </p>

                <pre><code [languages]="['typescript']" [highlight]="searchDatasourceExample"></code></pre>

                <p>
                  If using the search component along with filters for client-side data, use the
                  <code>FuiFilterComparatorService</code> to apply filter selections to the results. More details on how to use
                  this service with custom filters <a [routerLink] [fragment]="'filterComparatorService'">below</a>.
                </p>

                <pre><code [languages]="['typescript']" [highlight]="filterComparatorServiceUsageExample"></code></pre>

                <p>
                  <b>Note</b>: For more information about these interfaces, please refer to the
                  <a [routerLink] [fragment]="'interfaces'">Public Interfaces and Types</a> section of this documentation.
                </p>

                <h4 class="mt-3 mb-3">
                  Results templates (if <code>[datasource]</code> is set to a <b>FuiSearchDatasource</b> object)
                  <a [routerLink] [fragment]="'resultsTemplates'" class="anchor-link" id="resultsTemplates">#</a>
                </h4>

                <p>
                  Like mentioned above, you can use your own result template to render your results. To do so, you need to create
                  a <code>TemplateRef&lt;FuiSearchResultsContext&lt;T&gt;&gt;</code> element and pass it in the
                  <code>[searchResultsTemplate]</code> attribute of the <code>&lt;fui-search-container&gt;</code>
                  component.
                </p>

                <pre><code [languages]="['html']" [highlight]="searchResultTemplateExample"></code></pre>

                <p>
                  <b>Note</b>: In this example, we are using the FerUI datagrid to render the results. As you can see, the
                  <code>&lt;ng-template&gt;&lt;/ng-template&gt;</code> has some special context variables. You'll have access to
                  the <code>resultsObject</code> variable and <code>updateSearchHighlight</code> function. The first one will only
                  contains the results and the total of results coming from your API and the other one will trigger the
                  <a [routerLink] [fragment]="'searchHighlight'">search highlight</a>.<br />
                  Refer to the <a [routerLink] [fragment]="'interfaces'">Public Interfaces and Types</a> section of this
                  documentation for more informations about the interfaces used in this example.
                </p>

                <h4 class="mt-3 mb-3">
                  Search highlight (if <code>[datasource]</code> is set to a <b>FuiSearchDatasource</b> object)
                  <a [routerLink] [fragment]="'searchHighlight'" class="anchor-link" id="searchHighlight">#</a>
                </h4>

                <p>
                  You may have noticed it now, but the search component will automatically highlight the searched words within the
                  results template. This feature is enabled by default, but you can decide to disable it by setting
                  <code>[searchHighlight]</code> to <code>false</code>. This will disable all bindings related to the highlight
                  feature.
                </p>

                <p>
                  By default, we are triggering the highlight feature, and loop over only the <b>results container</b> elements,
                  but in some cases, you may want to trigger the highlight feature manually (for fuiDatagrid result container for
                  instance). To do so, you have the <code>updateSearchHighlight()</code> function available to you from the
                  <code>FuiSearchContainerComponent</code> API or directly from the <code>TemplateRef</code> like explained above.
                </p>

                <p>
                  It is also possible to focus a specific container ID to apply the highlight feature to. By default
                  <code>[searchResultsWrapperId]</code> is generated automatically, but if you're doing extra formatting to
                  display your results you might want that the highlight feature takes only a specific portion of the results
                  container to look for words to highlight.
                </p>

                <h2 class="mt-4 mb-4">Public API <a [routerLink] [fragment]="'api'" class="anchor-link" id="api">#</a></h2>
                <p>Selectors and input bindings directly available to the user on <code>FuiSearchContainerComponent</code>.</p>
                <table class="fui-table mb-4">
                  <thead>
                    <tr>
                      <th width="200">Property</th>
                      <th width="275">Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>[searchDebounce]</code></td>
                      <td>number</td>
                      <td>
                        <b>[Optional]</b> Value in milliseconds. If set, the component will wait for
                        <code>[searchDebounce]</code>ms before triggering the search.<br />
                        By default, it is set to <b>null</b> for regular search but it is set to <b>150ms</b> by default if you
                        set <code>[datasource]</code> to a <b>FuiSearchDatasource</b> object.
                      </td>
                    </tr>
                    <tr>
                      <td><code>[datasource]</code></td>
                      <td>FuiSearchDatasource</td>
                      <td>
                        <b>[Mandatory] if you want to display the results within this component</b>. It allows the user to search
                        for a specific search string or filters. See
                        <a [routerLink] [fragment]="'searchDatasource'">Search Datasource</a> section for more info.
                      </td>
                    </tr>
                    <tr>
                      <td><code>[searchHighlight]</code></td>
                      <td>boolean</td>
                      <td>
                        <b>[Optional]</b> Whether or not you want to highlight the founded words from the results container.<br />
                        <b
                          >Only if <code>[datasource]</code> is set to a valid <b>FuiSearchDatasource</b> object, otherwise this
                          is ignored.</b
                        >
                      </td>
                    </tr>
                    <tr>
                      <td><code>[searchResultsTemplate]</code></td>
                      <td>TemplateRef&lt;FuiSearchResultsContext&lt;T&gt;&gt;</td>
                      <td>
                        <b>[Optional]</b> If you want to use a specific template to display your results. See
                        <a [routerLink] [fragment]="'resultsTemplates'">this section</a>
                        for more information.<br />
                        <b
                          >Only if <code>[datasource]</code> is set to a valid <b>FuiSearchDatasource</b> object, otherwise this
                          is ignored.</b
                        >
                      </td>
                    </tr>
                    <tr>
                      <td><code>[searchResultsWrapperId]</code></td>
                      <td>string</td>
                      <td>
                        <b>[Optional]</b> If you want to use a specific container ID for the highlight feature to look for
                        searched words to highlight. This is useful if you want to focus only a certain portion of your results
                        template.<br />
                        <b
                          >Only if <code>[datasource]</code> is set to a valid <b>FuiSearchDatasource</b> object, otherwise this
                          is ignored.</b
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p>Functions directly available to the user within <code>FuiSearchContainerComponent</code> class.</p>

                <table class="fui-table mb-4">
                  <thead>
                    <tr>
                      <th width="270">Property</th>
                      <th width="100">Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>updateSearchHighlight()</code></td>
                      <td>void</td>
                      <td>This is useful if you want to trigger the search words highlight.</td>
                    </tr>
                    <tr>
                      <td><code>clearSearch()</code></td>
                      <td>void</td>
                      <td>
                        This function will reset the search and clear the results section if
                        <code>[datasource]</code> is set to a valid <b>FuiSearchDatasource</b> object.
                      </td>
                    </tr>
                    <tr>
                      <td><code>forceSearch(searchValue?: string)</code></td>
                      <td>void</td>
                      <td>
                        This function will allow you to force the component to force the search using the current value set within
                        the input or a completely new <b>searchValue</b> to override the current one.
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h2 class="mt-4 mb-4">
                  Public Interfaces and Types <a [routerLink] [fragment]="'interfaces'" class="anchor-link" id="interfaces">#</a>
                </h2>

                <h4 class="mt-3 mb-3">
                  FuiSearchDatasource&lt;T = any, C = any&gt;
                  <a [routerLink] [fragment]="'FuiSearchDatasource'" class="anchor-link" id="FuiSearchDatasource">#</a>
                </h4>

                <pre><code [languages]="['typescript']" [highlight]="searchFuiSearchDatasourceExample"></code></pre>

                <h4 class="mt-3 mb-3">
                  FuiSearchResultsObject&lt;T = any&gt;
                  <a [routerLink] [fragment]="'FuiSearchResultsObject'" class="anchor-link" id="FuiSearchResultsObject">#</a>
                </h4>

                <pre><code [languages]="['typescript']" [highlight]="searchFuiSearchResultsObjectExample"></code></pre>

                <h4 class="mt-3 mb-3">
                  FuiFilterGetDataInterface&lt;T = any&gt;
                  <a [routerLink] [fragment]="'FuiFilterGetDataInterface'" class="anchor-link" id="FuiFilterGetDataInterface"
                    >#</a
                  >
                </h4>

                <pre><code [languages]="['typescript']" [highlight]="searchFuiFilterGetDataInterfaceExample"></code></pre>

                <h4 class="mt-3 mb-3">
                  FuiFilterGetDataRequest&lt;T = any&gt;
                  <a [routerLink] [fragment]="'FuiFilterGetDataRequest'" class="anchor-link" id="FuiFilterGetDataRequest">#</a>
                </h4>

                <pre><code [languages]="['typescript']" [highlight]="searchFuiFilterGetDataRequestExample"></code></pre>

                <h4 class="mt-3 mb-3">
                  FuiFilterModel&lt;T = any&gt;
                  <a [routerLink] [fragment]="'FuiFilterModel'" class="anchor-link" id="FuiFilterModel">#</a>
                </h4>

                <pre><code [languages]="['typescript']" [highlight]="searchFuiFilterModelExample"></code></pre>

                <h2 class="mt-4 mb-4">Filters <a [routerLink] [fragment]="'filters'" class="anchor-link" id="filters">#</a></h2>

                <p>
                  You may have noticed that the <code>FuiFilterGetDataRequest</code> object needs a list of
                  <code>FuiFilterModel</code> object. By default, this list will only contains one item (with is the global search
                  filter). But you can add more filters by using another FerUI component: The
                  <code>FuiFilterComponent</code> component.
                </p>

                <p>
                  The usage is simple, you just need to wrap your
                  <code>&lt;fui-search-container&gt;&lt;/fui-search-container&gt;</code> tag with the
                  <code>&lt;fui-filter&gt;&lt;/fui-filter&gt;</code> tag with extra configuration to see the filters button
                  appear. Here is a full example on what it looks like:
                </p>

                <pre><code [languages]="['html']" [highlight]="searchFuiFiltersExample"></code></pre>

                <ng-template
                  #resultsFormatterTplt
                  let-results="resultsObject.results"
                  let-updateSearchHighlightFn="updateSearchHighlight"
                >
                  <fui-datagrid
                    [rowData]="results"
                    [withHeader]="false"
                    [withFooterItemPerPage]="false"
                    [columnDefs]="datagridConfig"
                    (onRowDataChanged)="updateSearchHighlightFn()"
                    (onVerticalScrollChanged)="updateSearchHighlightFn()"
                  ></fui-datagrid>
                </ng-template>
                <fui-filter
                  [withGlobalSearch]="false"
                  (onFiltersChange)="logFilterChangeEvent($event)"
                  (onFiltersApplied)="logFilterAppliedEvent($event)"
                  [filterFields]="filters"
                >
                  <h5 fuiFilterHeaderLabel>Search for the person you like the most</h5>
                  <fui-search-container
                    [searchDebounce]="300"
                    [datasource]="exampleDatasource"
                    (searchChange)="logSearchEvent($event)"
                    [searchResultsTemplate]="resultsFormatterTplt"
                  >
                    <label fuiLabel>Search for 'Sandie'</label>
                    <input type="search" autocomplete="off" fuiSearch name="nine" [(ngModel)]="model.nine" />
                  </fui-search-container>
                </fui-filter>

                <p class="mt-4">
                  <b>Note</b>: We invite you to check the <a [routerLink]="'/components/filter'">FuiFilter</a>
                  documentation for more information about this component.
                </p>

                <h4 class="mt-4 mb-4">
                  Filters in depth <a [routerLink] [fragment]="'FuiFilterInDepth'" class="anchor-link" id="FuiFilterInDepth">#</a>
                </h4>

                <p>
                  You may have noticed that in this above example, we have set a <code>[filterFields]</code> attribute and fill it
                  with <b><i>filters</i></b
                  >. Here, we actually need to create the list of all available filters and their types (for more info, read the
                  <a [routerLink]="'/components/filter'">FuiFilter</a> documentation section.).
                </p>

                <pre><code [languages]="['typescript']" [highlight]="searchFuiFiltersListExample"></code></pre>

                <p>
                  In our case, a filter need to match a specific object field. In our previous example, our API returns a
                  <code>Person</code> object which looks like:
                </p>
                <pre><code [languages]="['typescript']" [highlight]="searchFuiFiltersPersonExample"></code></pre>

                <p>
                  Here, if we do a search over this object list with the default search input, in our API, we are actually
                  checking if the filter passes for every fields (7 fields in total) and see if the typed string matches the
                  field. But thanks to <code>FuiFilter</code> component, you can now specify on which field you'll do your search
                  and you can also filter out the data by using more in-depth filtering.<br />Try by yourself, type "<b
                    ><i>sand</i></b
                  >" within our previous example, you'll see 10 results in total. But now, use the filters button, and chose to
                  filter by <b><i>Gender</i></b> and select only female, you now have only 5 items loaded in the Datagrid.
                </p>

                <h4 class="mt-3 mb-3">
                  Customize the FuiFilterComparatorService
                  <a [routerLink] [fragment]="'filterComparatorService'" class="anchor-link" id="filterComparatorService">#</a>
                </h4>

                <p>
                  In the example right above, you'll notice that the '<b><i>gender</i></b
                  >' filter is a <code>FuiFilterEnum.CUSTOM</code> type. Custom filters will require custom logic to handle
                  filtering data properly. Create a new class that extends the <code>FuiFilterComparatorService</code>. Remember
                  to provide it as needed. Use the new class to override any of the base methods. The
                  <code>doesFilterPass</code> method is a good choice, since it determines behavior based on the filter type. Any
                  other method may be overridden if you need to customize other behavior.
                </p>
                <pre><code [languages]="['typescript']" [highlight]="customFilterComparatorServiceExample"></code></pre>

                <p>
                  Then, use your new class in place of the <code>FuiFilterComparatorService</code> in the datasource's
                  <code>getResults</code> property.
                </p>
                <pre><code [languages]="['typescript']" [highlight]="customFilterComparatorServiceUsageExample"></code></pre>
              </div>
            </div>
          </div>
        </fui-tab>
        <fui-tab [title]="'Examples'">
          <demo-page [filtersDisplayed]="true" pageTitle="Input component">
            <p class="mt-5 mb-5 alert alert-primary" role="alert">
              <b>NOTE</b>: Please open your browser console in order to see the events triggered by the search component. This is
              for demonstration purposes, it is on you to do whatever you want with those events.
            </p>
            <h3 class="mt-3 mb-3">Default controls</h3>
            <demo-component [form]="demoForm" [componentData]="inputOne"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputSeven"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputTwo"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputThree"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputFour"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputEight"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputNine"></demo-component>

            <h3 class="mt-3 mb-3">Small controls</h3>
            <demo-component [form]="demoForm" [componentData]="inputFive"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputSix"></demo-component>
          </demo-page>
          <div class="footer">
            <button class="btn btn-primary" [disabled]="!demoForm.form.valid" (click)="promptSubmitInfos()" type="submit">
              Submit
            </button>
            <button class="btn btn-success" type="button" (click)="validate()">Validate</button>
            <button class="btn btn-light" type="button" (click)="demoForm.reset()">Reset</button>
          </div>
        </fui-tab>
      </fui-tabs>
    </form>
  `,
  providers: [SearchApiService],
  encapsulation: ViewEncapsulation.None
})
export class SearchDemoComponent extends AbstractControlDemoComponent implements OnInit {
  regularInputExample = `<input type="search" fuiSearch [(ngModel)]="searchModel" (ngModelChange)="onModelChange($event)" />`;

  regularInputContainerExample = `<fui-search-container [searchDebounce]="300" (searchChange)="onModelChange($event)">
  <label fuiLabel>Regular search with container and label</label>
  <input type="search" fuiSearch [(ngModel)]="searchModel" />
</fui-search-container>`;

  searchInputWithResultsExample = `<fui-search-container [datasource]="myDatasourceToRetrieveData" [searchDebounce]="300" (searchChange)="onModelChange($event)">
  <label fuiLabel>Regular search with results and label</label>
  <input type="search" fuiSearch [(ngModel)]="searchModel" />
</fui-search-container>`;

  searchDatasourceExample = `const exampleDatasource: FuiSearchDatasource<T> = {
  getResults: (params: FuiFilterGetDataInterface) => {
    return new Promise((resolve, reject) => {
      // Here the searchApiService correspond to the API service used to make the requests. It is an observable that you can
      // subscribe to but it can also be a regular Promise.
      // The params object will contains the search strings but also any extra filters that you may want to add.
      const subscription = this.searchApiService.searchFor(params).subscribe(
        resultsObject => {
          resolve(resultsObject);
          subscription.unsubscribe();
        },
        error => {
          // If there is an error, it will be displayed within the results container in place of the results/loading templates.
          reject(error);
          subscription.unsubscribe();
        }
      );
    });
  }
};`;

  filterComparatorServiceUsageExample = `const exampleDatasource: FuiSearchDatasource<T> = {
  getResults: async(filterParams: FuiFilterGetDataInterface) => {
    // Here, we are getting results from an API promise and then using the FuiFilterComparatorService to apply the filters
    // from the filter component. This will return a FuiSearchResultsObject that can be used by the datasource.
    return getApiData().then(results => {
      return this.FuiFilterComparatorService.filterDataForDataSource<ResultType>(results, filterParams);
    });
  }
};`;

  searchResultTemplateExample = `<ng-template #resultsFormatterTplt let-results="resultsObject.results" let-updateSearchHighlightFn="updateSearchHighlight">
  <fui-datagrid [rowData]="results" [withHeader]="false" [withFooterItemPerPage]="false" [columnDefs]="models.datagridConfig" (onRowDataChanged)="updateSearchHighlightFn()" (onVerticalScrollChanged)="updateSearchHighlightFn()"></fui-datagrid>
</ng-template>

<fui-search-container [searchDebounce]="300" [datasource]="models.dataSource" (searchChange)="models.logEvent($event)" [searchResultsTemplate]="resultsFormatterTplt">
  <label fuiLabel>Search for 'Sandie'</label>
  <input type="search" autocomplete="off" fuiSearch name="four" [(ngModel)]="models.four" />
</fui-search-container>
  `;

  searchFuiSearchDatasourceExample = `/**
 * The search input datasource. This will allow the devs to bind whatever API calls that they want and make the results feed
 * the search results section.
 */
 export interface FuiSearchDatasource<T = any, C = any> {
  // The context object to use within the getResults function.
  context?: C;

  // This function is called whenever the user type something in the search input.
  getResults(params: FuiFilterGetDataInterface<T>): Promise<FuiSearchResultsObject<T>>;
}`;

  searchFuiSearchResultsObjectExample = `/**
 * Result object containing the results of the search. Note that the results must be an array.
 */
export interface FuiSearchResultsObject<T = any> {
  results: T[]; // The current chunk of data coming from the server.
  total?: number; // The total result is optional.
}`;

  searchFuiFilterGetDataInterfaceExample = `export interface FuiFilterGetDataInterface<T = any> {
  // if filtering, what the filter model is
  request: FuiFilterGetDataRequest<T>;
  fields?: string[];
}`;

  searchFuiFilterGetDataRequestExample = `export interface FuiFilterGetDataRequest<T = any> {
  // if filtering, what the filter model is
  filterModels?: FuiFilterModel<T>[];
}`;

  searchFuiFilterModelExample = `export interface FuiFilterModel<T = any> {
  filterId: string;
  field: string;
  filterType: FuiFilterEnum;
  filterValue: T | T[];
  filterOption: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null;
  filterParams?: any;
}`;

  searchFuiFiltersExample = `<ng-template #resultsFormatterTplt let-results="resultsObject.results"
let-updateSearchHighlightFn="updateSearchHighlight">
  <fui-datagrid [rowData]="results" [withHeader]="false" [withFooterItemPerPage]="false"
  [columnDefs]="models.datagridConfig" (onRowDataChanged)="updateSearchHighlightFn()"
  (onVerticalScrollChanged)="updateSearchHighlightFn()"></fui-datagrid>
</ng-template>
<fui-filter
  [withGlobalSearch]="false"
  (onFiltersChange)="models.onFilterChangeFn($event)"
  (onFiltersApplied)="models.onFiltersAppliedFn($event)"
  [filterFields]="models.filters">
  <h5 fuiFilterHeaderLabel>Search for the person you like the most</h5>
  <fui-search-container [searchDebounce]="300" [datasource]="models.dataSource" (searchChange)="models.logEvent($event)" [searchResultsTemplate]="resultsFormatterTplt">
    <label fuiLabel>Search for 'Sandie'</label>
    <input type="search" autocomplete="off" fuiSearch name="one" [(ngModel)]="models.one" />
  </fui-search-container>
</fui-filter>`;

  searchFuiFiltersListExample = `filters: FuiFilterFieldInterface[] = [
    {
      key: 'id',
      label: 'ID',
      type: FuiFilterEnum.NUMBER
    },
    {
      key: 'first_name',
      label: 'First name',
      type: FuiFilterEnum.STRING
    },
    {
      key: 'last_name',
      label: 'Last name',
      type: FuiFilterEnum.STRING
    },
    {
      key: 'favorite_color',
      label: 'Favourite colour',
      type: FuiFilterEnum.STRING
    },
    {
      key: 'gender',
      label: 'Gender',
      type: FuiFilterEnum.CUSTOM,
      filterFramework: DemoCustomGenderFilterComponent
    }
  ];`;

  searchFuiFiltersPersonExample = `export interface SearchApiPersonJson {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  favorite_animal: string;
  favorite_color: string;
}`;

  customFilterComparatorServiceExample = `export class DemoFilterService extends FuiFilterComparatorService {
  // We override the base class's original method to handle a custom filter.
  protected doesFilterPass(filter: FuiFilterModel, data: any): boolean {
    const { filterType, field, filterValue } = filter;

    // Check for the filter(s) that needs custom logic first.
    // Two conditional statements are used for illustration purposes to show that 'gender' is a custom filter.
    // Only one would really be needed, since there's only one custom filter and fields are unique in this case.
    if (filterType === FuiFilterEnum.CUSTOM) {
      // Mockup for the gender field.
      if (field === 'gender') {
        const filterValues: string[] = Object.keys(filterValue).filter(key => filterValue[key] === true);
        return filterValues.some(value => this.textFilter(FuiFilterOptionsEnum.EQUALS, value, data));
      }
    } else {
      // We're not changing anything else, so let the base method handle the rest of the filter types.
      return super.doesFilterPass(filter, data);
    }
  }
}`;

  customFilterComparatorServiceUsageExample = `const exampleDatasource: FuiSearchDatasource<T> = {
  getResults: async(filterParams: FuiFilterGetDataInterface) => {
    // The base FuiFilterComparatorService is replaced by the new custom DemoFilterService
    return getApiData().then(results => {
      return this.DemoFilterService.filterDataForDataSource<ResultType>(results, filterParams);
    });
  }
};`;

  model = {
    one: null,
    two: null,
    three: null,
    four: 'sandie',
    five: null,
    six: null,
    seven: null,
    eight: 'dog',
    nine: null,
    ten: null
  };

  exampleDatasource = this.SearchDatasource(this);

  inputOne: DemoComponentData;
  inputTwo: DemoComponentData;
  inputThree: DemoComponentData;
  inputFour: DemoComponentData;
  inputFive: DemoComponentData;
  inputSix: DemoComponentData;
  inputSeven: DemoComponentData;
  inputEight: DemoComponentData;
  inputNine: DemoComponentData;

  filters: FuiFilterFieldInterface[] = [
    {
      key: 'id',
      label: 'ID',
      type: FuiFilterEnum.NUMBER
    },
    {
      key: 'first_name',
      label: 'First name',
      type: FuiFilterEnum.STRING
    },
    {
      key: 'last_name',
      label: 'Last name',
      type: FuiFilterEnum.STRING
    },
    {
      key: 'favorite_color',
      label: 'Favourite colour',
      type: FuiFilterEnum.STRING
    },
    {
      key: 'gender',
      label: 'Gender',
      type: FuiFilterEnum.CUSTOM,
      filterFramework: DemoCustomGenderFilterComponent
    }
  ];

  datagridConfig: FuiColumnDefinitions[];

  constructor(public searchApiService: SearchApiService) {
    super();
  }

  ngOnInit(): void {
    this.datagridConfig = [
      { headerName: 'ID', field: 'id' },
      { headerName: 'Gender', field: 'gender' },
      { headerName: 'First name', field: 'first_name' },
      { headerName: 'Last name', field: 'last_name' },
      { headerName: 'Favorite color', field: 'favorite_color' },
      { headerName: 'Email', field: 'email', filter: false, sortable: false },
      { headerName: 'Favorite animal', field: 'favorite_animal', minWidth: 150, filter: false, sortable: false }
    ];

    this.inputOne = new DemoComponentData({
      title: `<h5>No label, no wrapper, no results :</h5>`,
      models: {
        logEvent: this.logSearchEvent,
        one: this.model.one
      },
      canDisable: false,
      source: `<input type="search" autocomplete="off" fuiSearch name="one" (ngModelChange)="models.logEvent($event)" [(ngModel)]="models.one" />`
    });

    this.inputTwo = new DemoComponentData({
      title: `<h5>No label, wrapper, no results :</h5>`,
      models: {
        logEvent: this.logSearchEvent,
        two: this.model.two
      },
      canDisable: false,
      source: `<fui-search-container>
        <input type="search" autocomplete="off" fuiSearch name="two" (ngModelChange)="models.logEvent($event)" [(ngModel)]="models.two" />
      </fui-search-container>`
    });

    this.inputThree = new DemoComponentData({
      title: `<h5>Label, wrapper, required validator, default results display (raw JSON) :</h5>`,
      models: {
        logEvent: this.logSearchEvent,
        three: this.model.three,
        dataSource: this.SearchDatasource(this)
      },
      canDisable: false,
      source: `<fui-search-container [datasource]="models.dataSource" (searchChange)="models.logEvent($event)">
        <label fuiLabel>Search for 'Sandie'</label>
        <input type="search" required autocomplete="off" fuiSearch name="three" [(ngModel)]="models.three" />
      </fui-search-container>`
    });

    this.inputFour = new DemoComponentData({
      title: `<h5>Label, wrapper, validator and results displayed within a Datagrid:</h5>`,
      models: {
        logEvent: this.logSearchEvent,
        four: this.model.four,
        dataSource: this.SearchDatasource(this),
        datagridConfig: this.datagridConfig,
        filters: this.filters,
        onFilterChangeFn: this.logFilterChangeEvent,
        onFiltersAppliedFn: this.logFilterAppliedEvent
      },
      canDisable: false,
      source: `<ng-template #resultsFormatterTplt let-results="resultsObject.results"
let-updateSearchHighlightFn="updateSearchHighlight">
  <fui-datagrid [rowData]="results" [withHeader]="false" [withFooterItemPerPage]="false"
  [columnDefs]="models.datagridConfig" (onRowDataChanged)="updateSearchHighlightFn()"
  (onVerticalScrollChanged)="updateSearchHighlightFn()"></fui-datagrid>
</ng-template>
<fui-filter
        [withGlobalSearch]="false"
        (onFiltersChange)="models.onFilterChangeFn($event)"
        (onFiltersApplied)="models.onFiltersAppliedFn($event)"
        [filterFields]="models.filters"
      ><h5 fuiFilterHeaderLabel>Search for the person you like the most</h5>
      <fui-search-container [searchDebounce]="300" [datasource]="models.dataSource" (searchChange)="models.logEvent($event)" [searchResultsTemplate]="resultsFormatterTplt">
        <label fuiLabel>Search for 'Sandie'</label>
        <input type="search" autocomplete="off" fuiSearch name="four" [(ngModel)]="models.four" />
      </fui-search-container>
      </fui-filter>`
    });

    this.inputFive = new DemoComponentData({
      title: `<h5>Label, wrapper, validator, no results and small version :</h5>`,
      models: {
        logEvent: this.logSearchEvent,
        five: this.model.five
      },
      canDisable: false,
      source: `<fui-search-container (searchChange)="models.logEvent($event)">
        <label fuiLabel>Search</label>
        <input type="search" required autocomplete="off" [layout]="'small'" fuiSearch name="five" [(ngModel)]="models.five" />
      </fui-search-container>`
    });

    this.inputSix = new DemoComponentData({
      title: `<h5>Label, wrapper, results in custom list and a search debounce of 300ms :</h5>`,
      models: {
        logEvent: this.logSearchEvent,
        six: this.model.six,
        dataSource: this.SearchDatasource(this)
      },
      canDisable: false,
      source: `<ng-template #resultsListFormatterTplt let-results="resultsObject.results">
  <ul class="pt-3">
  <li *ngFor="let result of results">{{ result.first_name }} {{ result.last_name }} ({{ result.gender }}) | Favorite animal is <b>{{ result.favorite_animal }}</b></li>
</ul>
</ng-template>
<fui-search-container [searchDebounce]="300" [datasource]="models.dataSource" [searchResultsTemplate]="resultsListFormatterTplt" (searchChange)="models.logEvent($event)">
        <label fuiLabel>Search for 'dog'</label>
        <input type="search" autocomplete="off" fuiSearch name="six" [layout]="'small'" [(ngModel)]="models.six" />
      </fui-search-container>`
    });

    this.inputSeven = new DemoComponentData({
      title: `<h5>No label, no wrapper, no results, disabled :</h5>`,
      models: {
        logEvent: this.logSearchEvent,
        seven: this.model.seven
      },
      canDisable: false,
      source: `<input type="search" autocomplete="off" disabled fuiSearch name="seven" (ngModelChange)="models.logEvent($event)" [(ngModel)]="models.seven" />`
    });

    this.inputEight = new DemoComponentData({
      title: `<h5>Label, wrapper, disabled, filled and results displayed within a Datagrid:</h5>`,
      models: {
        logEvent: this.logSearchEvent,
        eight: this.model.eight,
        dataSource: this.SearchDatasource(this),
        datagridConfig: this.datagridConfig,
        filters: this.filters,
        onFilterChangeFn: this.logFilterChangeEvent,
        onFiltersAppliedFn: this.logFilterAppliedEvent
      },
      params: {
        disabled: true
      },
      canDisable: true,
      source: `<ng-template #resultsFormatterTplt let-results="resultsObject.results"
let-updateSearchHighlightFn="updateSearchHighlight">
  <fui-datagrid [rowData]="results" [withHeader]="false" [withFooterItemPerPage]="false"
  [columnDefs]="models.datagridConfig" (onRowDataChanged)="updateSearchHighlightFn()"
  (onVerticalScrollChanged)="updateSearchHighlightFn()"></fui-datagrid>
</ng-template>
<fui-filter
        [disabled]="params.disabled"
        [withGlobalSearch]="false"
        (onFiltersChange)="models.onFilterChangeFn($event)"
        (onFiltersApplied)="models.onFiltersAppliedFn($event)"
        [filterFields]="models.filters"
      ><h5 fuiFilterHeaderLabel>Search for the person you like the most</h5>
      <fui-search-container [searchDebounce]="300" [datasource]="models.dataSource" (searchChange)="models.logEvent($event)" [searchResultsTemplate]="resultsFormatterTplt">
        <label fuiLabel>Search for 'Sandie'</label>
        <input type="search" [disabled]="params.disabled" autocomplete="off" fuiSearch name="eight" [(ngModel)]="models.eight" />
      </fui-search-container>
      </fui-filter>`
    });

    this.inputNine = new DemoComponentData({
      title: `<h5>Label, wrapper, always returning an error:</h5>`,
      models: {
        logEvent: this.logSearchEvent,
        ten: this.model.ten,
        dataSource: this.SearchDatasource(this, true),
        datagridConfig: this.datagridConfig,
        filters: this.filters,
        onFilterChangeFn: this.logFilterChangeEvent,
        onFiltersAppliedFn: this.logFilterAppliedEvent
      },
      params: {
        disabled: false
      },
      canDisable: true,
      source: `<ng-template #resultsFormatterTplt let-results="resultsObject.results"
let-updateSearchHighlightFn="updateSearchHighlight">
  <fui-datagrid [rowData]="results" [withHeader]="false" [withFooterItemPerPage]="false"
  [columnDefs]="models.datagridConfig" (onRowDataChanged)="updateSearchHighlightFn()"
  (onVerticalScrollChanged)="updateSearchHighlightFn()"></fui-datagrid>
</ng-template>
<fui-filter
        [disabled]="params.disabled"
        [withGlobalSearch]="false"
        (onFiltersChange)="models.onFilterChangeFn($event)"
        (onFiltersApplied)="models.onFiltersAppliedFn($event)"
        [filterFields]="models.filters"
      ><h5 fuiFilterHeaderLabel>Search for the person you like the most</h5>
      <fui-search-container [searchDebounce]="300" [datasource]="models.dataSource" (searchChange)="models.logEvent($event)" [searchResultsTemplate]="resultsFormatterTplt">
        <label fuiLabel>Search for 'Sandie'</label>
        <input type="search" [disabled]="params.disabled" autocomplete="off" fuiSearch name="ten" [(ngModel)]="models.ten" />
      </fui-search-container>
      </fui-filter>`
    });
  }

  logSearchEvent(event) {
    console.log('[Demo search] Search change event ::: ', event);
  }

  logFilterChangeEvent(event) {
    console.log('[Demo search] Filter change event ::: ', event);
  }

  logFilterAppliedEvent(event) {
    console.log('[Demo search] Filter applied event ::: ', event);
  }

  private SearchDatasource(server: SearchDemoComponent, forceError: boolean = false): FuiSearchDatasource<SearchApiPersonJson> {
    return {
      getResults(params: FuiFilterGetDataInterface): Promise<FuiSearchResultsObject<SearchApiPersonJson>> {
        return new Promise((resolve, reject) => {
          if (forceError) {
            setTimeout(() => {
              reject('An error occurred, please contact the administrator.');
            }, 300);
            return;
          } else {
            const subscription = server.searchApiService.searchFor(params).subscribe(
              resultsObject => {
                resolve(resultsObject);
                subscription.unsubscribe();
              },
              error => {
                reject(error);
                subscription.unsubscribe();
              }
            );
          }
        });
      }
    };
  }
}
