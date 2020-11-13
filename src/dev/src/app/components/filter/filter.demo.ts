import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import {
  FuiFilterCustomContextInterface,
  FuiFilterEnum,
  FuiFilterFieldInterface,
  FuiFilterOptionsEnum,
  FuiSelectedFilterInterface
} from '@ferui/components';

import { DemoComponentData } from '../../utils/demo-component-data';
import { DemoCustomGenderFilterComponent } from '../forms/search/filters/custom-gender-filter.component';

import { DemoBrowserCustomFilterComponent } from './custom-browser-filter';

@Component({
  selector: 'tabs-demo-example',
  template: `
    <h1 class="mt-4">FerUI Filter Component</h1>
    <hr />
    <fui-tabs>
      <fui-tab [title]="'Documentation'" [active]="true">
        <div class="container-fluid">
          <div class="row" style="max-width: 1200px">
            <div class="col-12">
              <h2 class="mt-4 mb-4">Overview <a [routerLink] [fragment]="'overview'" class="anchor-link" id="overview">#</a></h2>
              <p>
                The filter component allows you to build an array of filters that you can use to filter out your data.<br />
                <b>This component won't do any API calls nor filter out your array of data</b>, it just provides a UI tool to
                select and build an array of filters that you can use to do your own filtering server side or client side.<br />
                You just need to listen to one of those two main events to retrieve the filters array:
              </p>

              <ul>
                <li>
                  <code>(onFiltersApplied)</code>: This event is called every-time the user click on "Apply Filters". It will
                  return the list of all active filters. We <b>Recommend</b> to listen to this event.
                </li>
                <li>
                  <code>(onFiltersChange)</code>: This event is called every-time the user add/remove/update a filter. This event
                  will be triggered really often. We <b>DO NOT Recommend</b> to listen to this event since it will be triggered on
                  every filter updates. This event is mainly used when you want to track the changes for the global search.
                </li>
              </ul>

              <h2 class="mt-4 mb-4">
                Table of Contents <a [routerLink] [fragment]="'tableofcontent'" class="anchor-link" id="tableofcontent">#</a>
              </h2>
              <ol>
                <li><a [routerLink] [fragment]="'usage'">Usage</a></li>
                <li><a [routerLink] [fragment]="'filterInDepth'">Filters in Depth</a></li>
                <li><a [routerLink] [fragment]="'api'">Public API</a></li>
                <li><a [routerLink] [fragment]="'interfaces'">Interfaces and Types</a></li>
              </ol>

              <h2 class="mt-4 mb-4">Usage <a [routerLink] [fragment]="'usage'" class="anchor-link" id="usage">#</a></h2>

              <p><b>Requires</b>: Import <code>FeruiModule</code> to your app or ngModule.</p>

              <p>
                To use this component, first of all, you need to create your filter objects in your controller/component. To do
                this, you first need to list out all fields that your objects may have and select which ones you want to activate
                the filters for. In this documentation, we are using a list of <b>Person</b> objects:
              </p>

              <pre><code [languages]="['typescript']" [highlight]="filterPersonObject"></code></pre>

              <p>
                Having my list of <b><i>Person</i></b> objects, i can now determinate which fields i'll use for my filters. In
                this documentation, we will add filters for: <b>id</b>, <b>first_name</b>, <b>gender</b> fields so the filter list
                will looks like:
              </p>

              <pre><code [languages]="['typescript']" [highlight]="filterPersonFilterList"></code></pre>

              <p>
                Lets take some time to analyse what we have here.<br />
                Like you've probably noticed, the filters are just a list of
                <a [routerLink] [fragment]="'FuiFilterFieldInterface'"><code>FuiFilterFieldInterface</code></a> objects. Each
                object have 3 mandatory fields (<b>key</b>, <b>label</b> and <b>type</b>) which is enough to generate a built-in
                filter component UI side. But, you may have notice that the <b>gender</b> filter has a
                <code>FuiFilterEnum.CUSTOM</code> type along with another attribute <b>filterFramework</b>. This filter is
                actually a custom filter that we made from scratch.<br />
                How it work will you ask? be more patient, we will come to that part
                <a [routerLink] [fragment]="'customFilters'">later</a> in this documentation.
              </p>

              <p>
                Now that you have your list of filters, you just need to pass this list to the
                <code>&lt;fui-filter&gt;&lt;/fui-filter&gt;</code> tag:
              </p>

              <pre><code [languages]="['html']" [highlight]="filterExample"></code></pre>

              <div class="bd-example">
                <fui-filter
                  (onFiltersChange)="logActiveFiltersOnChange($event)"
                  (onFiltersApplied)="logActiveFiltersOnApplied($event)"
                  [filterFields]="exampleFilters"
                ></fui-filter>
              </div>

              <p class="mt-3"><b>Note:</b> Open your browser console to see the result of the filtering.</p>

              <h2 class="mt-4 mb-4">
                Filters in Depth <a [routerLink] [fragment]="'filterInDepth'" class="anchor-link" id="filterInDepth">#</a>
              </h2>

              <h4 class="mt-3 mb-3">
                Filters composition
                <a [routerLink] [fragment]="'filtersComposition'" class="anchor-link" id="filtersComposition">#</a>
              </h4>

              <p>
                What are we considering a filter? Well, the easy answer is that a filter allows us to choose a value or a group of
                values that we want to filter out our data with. But how does it work?
              </p>

              <p>We can split a filter into two parts:</p>

              <ul>
                <li>
                  <b>Options</b>: This gives us some extra information about the kind of comparison we want to do: Do we want our
                  data to be <b>Equal</b> or <b>Not-Equal</b>, or to <b>Contains</b> or <b>Not-Contains</b> a specific value? (the
                  complete list of options can be found <a [routerLink] [fragment]="'FuiFilterOptionsEnum'">here</a>.)
                </li>
                <li>
                  <b>Value(s)</b>: The value that you are looking for. It can also be a list of values when you want to do a
                  <b>in-range</b> comparison or if your custom filter allows you to have multiple values.
                </li>
              </ul>

              <h4 class="mt-3 mb-3">
                Filters types
                <a [routerLink] [fragment]="'filtersTypes'" class="anchor-link" id="filtersTypes">#</a>
              </h4>

              <p>
                There is 3 main types of filters and each of them have their own specificities. We will list them out and give
                more details for each. We also have some <a [routerLink] [fragment]="'builtinFilters'">Built-in filters</a> that
                you can use out of the box or inherit from when you're creating your own custom filters.
              </p>

              <h5 class="mt-2 mb-2">Base Filter Type</h5>

              <p>
                The base type is the main type of filter that every other filter types inherit from. It allows you to have the
                basic logic for your filter. This kind of filter doesn't need to have a filter option (the option can be
                <b>null</b> or <b>undefined</b>).
              </p>

              <pre><code [languages]="['typescript']" [highlight]="filterBaseInterface"></code></pre>

              <h5 class="mt-2 mb-2">Comparable Filter Type</h5>

              <p>
                This kind of filter allows you to do simple comparison (i.e string comparison) but it doesn't allows you to have
                an array as value because it doesn't allows you to have the <b>in-range</b> filter option. This is mainly use to
                do <b>string</b> comparison.
              </p>

              <pre><code [languages]="['typescript']" [highlight]="filterComparableInterface"></code></pre>

              <h5 class="mt-2 mb-2">Scalar Filter Type</h5>

              <p>
                This kind of filter allows you to do scalar comparison. This is mainly use to do <b>number</b>, <b>date</b>...
                comparison filters. The value of this filter may be an array since we allow the usage of the
                <b>in-range</b> filter option.
              </p>

              <pre><code [languages]="['typescript']" [highlight]="filterScalarInterface"></code></pre>

              <h4 class="mt-3 mb-3">
                Applicable options by types
                <a [routerLink] [fragment]="'filtersApplicableOptions'" class="anchor-link" id="filtersApplicableOptions">#</a>
              </h4>

              <p>
                Each filters can have their own list of applicable options because depending on the filter type, you may not want
                specific options to be present in the list.
              </p>

              <h5 class="mt-2 mb-2">Applicable options for Comparable filter type</h5>

              <pre><code [languages]="['typescript']" [highlight]="filterComparableApplicableOptionsInterface"></code></pre>

              <h5 class="mt-2 mb-2">Applicable options for Scalar filter type</h5>

              <pre><code [languages]="['typescript']" [highlight]="filterScalarApplicableOptionsInterface"></code></pre>

              <p>
                But you can totally override those defaults by using the <code>filterApplicableOptions</code> attribute of
                <a [routerLink] [fragment]="'FuiFilterParamsInterface'"><code>FuiFilterParamsInterface</code></a> interface.
              </p>

              <p>
                <b>WARNING</b>: It is important to note that if you override the applicable options list, it will actually
                <b>replace</b> the whole list. If we take the same filter fields example as before but we want a specific options
                only for the string filter type for instance, this is what we would need to do:
              </p>

              <pre><code [languages]="['typescript']" [highlight]="filterPersonFilterCustomOptionsList"></code></pre>

              <p class="mb-3">This is what it looks like. Please, check the options of <b>First name</b> field:</p>
              <div class="bd-example">
                <fui-filter
                  (onFiltersChange)="logActiveFiltersOnChange($event)"
                  (onFiltersApplied)="logActiveFiltersOnApplied($event)"
                  [filterFields]="exampleFiltersCustomOptions"
                ></fui-filter>
              </div>

              <p class="mt-3"><b>Note:</b> Open your browser console to see the result of the filtering.</p>

              <h4 class="mt-3 mb-3">
                Built-in filters
                <a [routerLink] [fragment]="'builtinFilters'" class="anchor-link" id="builtinFilters">#</a>
              </h4>

              <p>There are 5 built-in filters provided by default in FerUI.</p>

              <ul>
                <li><code>NUMBER</code> filter: Allows you to filter out Number fields.</li>
                <li><code>BOOLEAN</code> filter: Allows you to filter out Boolean fields.</li>
                <li><code>STRING</code> filter: Allows you to filter out String (Text) fields.</li>
                <li><code>DATE</code> filter: Allows you to filter out Date fields.</li>
                <li><code>GLOBAL_SEARCH</code> filter: Allows you to filter out any fields that you want.</li>
              </ul>

              <p>
                To use one of those filters, you simply need to set the <b>type</b> on your
                <a [routerLink] [fragment]="'FuiFilterFieldInterface'">FuiFilterFieldInterface</a> object. The built in filters
                will be generated internally.
              </p>

              <h4 class="mt-3 mb-3">
                Custom filters
                <a [routerLink] [fragment]="'customFilters'" class="anchor-link" id="customFilters">#</a>
              </h4>

              <p>
                The custom filter is the sixth type of filters. It allows you to create your own custom filter. That mean, you'll
                be creating the custom component to be displayed within the popover filter list.
              </p>

              <h5 class="mt-2 mb-2">Create the filter component</h5>

              <p>
                Every filters (built-in or custom) follows the same rules. They need to implement the
                <a [routerLink] [fragment]="'FuiFilterComponentInterface'">FuiFilterComponentInterface</a> and they need to
                implement the appropriate <a [routerLink] [fragment]="'FuiFilterInterface'">FuiFilterInterface</a> depending on
                the type of filter and comparison you want to achieve.
              </p>

              <p>
                The best way to create a custom filter is to create an Angular component that extends the
                <code>FuiBaseFilter</code> or <code>FuiComparableFilter</code> or <code>FuiScalarFilter</code> class and implement
                the <code>FuiFilterComponentInterface</code> interface
              </p>

              <pre><code [languages]="['typescript']" [highlight]="filterCustomFilterExample"></code></pre>

              <p class="alert alert-primary" role="alert">
                <b>IMPORTANT</b>: Do not forget to add this component to the <code>entryComponents</code> section of your
                <b>NgModule</b> since it will be dynamically generated.
              </p>

              <p class="alert alert-info">
                When creating your own custom filter, you can, if you need to, override the default
                <code>FuiFilterParamsInterface</code> params interface by extending it and adding more attributes to it. <br />
                You can also extend <code>FuiComparableFilter</code> or <code>FuiScalarFilter</code> classes instead of
                <code>FuiBaseFilter</code> class if you need to do a <b>Comparable</b> or <b>Scalar</b> like custom filter.<br />
                <b>In any cases</b>, you need to implement the <code>FuiFilterComponentInterface</code> interface to be sur to
                implement all mandatory methods to make your filter works.
              </p>

              <p class="alert alert-warning" role="alert">
                <b>IMPORTANT</b>: For custom filters using objects as values, the <b><i>selectedSearch</i></b> and
                <b><i>selectedSearchTo</i></b> attributes must be assigned on change. DO NOT mutate those objects otherwise you
                may have some issues when updating the values then 'cancel' or 'close' the popover without applying the filters.
              </p>

              <h5 class="mt-2 mb-2">Use the filter component</h5>

              <p>
                Once you have your filter component (and added it to the <b>entryComponents</b> section of your <b>NgModule</b>)
                you can use it directly within the
                <a [routerLink] [fragment]="'FuiFilterFieldInterface'">FuiFilterFieldInterface</a> object of your choice.
              </p>

              <pre><code [languages]="['typescript']" [highlight]="filterPersonFilterList"></code></pre>

              <h4 class="mt-3 mb-3">
                Add a title to your filters
                <a [routerLink] [fragment]="'filterTitle'" class="anchor-link" id="filterTitle">#</a>
              </h4>

              <p>
                It is possible to add a title to the header section of the filter component. You just need to create an HTML
                element within the <code>&lt;fui-filter&gt;&lt;/fui-filter&gt;</code> tag and use the
                <code>fuiFilterHeaderLabel</code> directive.
              </p>

              <pre><code [languages]="['typescript']" [highlight]="filterPersonFilterList"></code></pre>

              <p class="mb-3 mt-3">You can use a title when using both Global Search and Filters:</p>

              <div class="bd-example">
                <fui-filter
                  (onFiltersChange)="logActiveFiltersOnChange($event)"
                  (onFiltersApplied)="logActiveFiltersOnApplied($event)"
                  [filterFields]="exampleFilters"
                >
                  <h5 fuiFilterHeaderLabel>My custom title added in FuiFilterComponent header section.</h5>
                </fui-filter>
              </div>

              <p class="mb-3 mt-3">You can use a title when using only Filters:</p>

              <div class="bd-example">
                <fui-filter
                  [withGlobalSearch]="false"
                  (onFiltersChange)="logActiveFiltersOnChange($event)"
                  (onFiltersApplied)="logActiveFiltersOnApplied($event)"
                  [filterFields]="exampleFilters"
                >
                  <h5 fuiFilterHeaderLabel>My custom title added in FuiFilterComponent header section.</h5>
                </fui-filter>
              </div>

              <p class="mb-3 mt-3">You can use a title when using only Global search:</p>

              <div class="bd-example">
                <fui-filter
                  [withFilters]="false"
                  (onFiltersChange)="logActiveFiltersOnChange($event)"
                  (onFiltersApplied)="logActiveFiltersOnApplied($event)"
                  [filterFields]="exampleFilters"
                >
                  <h5 fuiFilterHeaderLabel>My custom title added in FuiFilterComponent header section.</h5>
                </fui-filter>
              </div>

              <h2 class="mt-4 mb-4">Public API <a [routerLink] [fragment]="'api'" class="anchor-link" id="api">#</a></h2>

              <p>Selectors and input bindings directly available to the user on <code>FuiFilterComponent</code>.</p>
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
                    <td><code>[withGlobalSearch]</code></td>
                    <td>boolean</td>
                    <td>
                      <b>[Optional]</b> Whether or not we want to display the global search. If this is set to true, we will
                      display the global search part. By default it is set to <code>true</code>.
                    </td>
                  </tr>
                  <tr>
                    <td><code>[withFilters]</code></td>
                    <td>boolean</td>
                    <td>
                      <b>[Optional]</b> Whether or not we want to display the filters. If this is set to true, we will display the
                      filters part. By default it is set to <code>true</code>.
                    </td>
                  </tr>
                  <tr>
                    <td><code>[disabled]</code></td>
                    <td>boolean</td>
                    <td>
                      <b>[Optional]</b> Whether or not we want to disable the components. By default it is set to
                      <code>false</code>.<br />
                      Note that this is only an @input (setter). You won't be able to access the <code>disabled</code> variable
                      from this component.
                    </td>
                  </tr>
                  <tr>
                    <td><code>[filterFields]</code></td>
                    <td>boolean</td>
                    <td>
                      <b>[Mandatory if you want to display the filters]</b> If you want filters (other than the global search) you
                      need to set the list of fields that you want to filter with. By default it is set to
                      <code>undefined</code>.<br />
                      Note that this is only an @input (setter). You won't be able to access the
                      <code>filterFields</code> variable from this component.
                    </td>
                  </tr>
                </tbody>
              </table>

              <p>Output bindings directly available to the user on <code>FuiFilterComponent</code>.</p>
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
                    <td><code>(onFiltersChange)</code></td>
                    <td><a [routerLink] [fragment]="'FuiSelectedFilterInterface'">FuiSelectedFilterInterface</a>[]</td>
                    <td>If you want to retrieve the filters list every time a filter gets added/removed/updated.</td>
                  </tr>
                  <tr>
                    <td><code>(onFiltersApplied)</code></td>
                    <td><a [routerLink] [fragment]="'FuiSelectedFilterInterface'">FuiSelectedFilterInterface</a>[]</td>
                    <td>If you want to retrieve the filters list when we apply the filters we've selected</td>
                  </tr>
                </tbody>
              </table>

              <h2 class="mt-4 mb-4">
                Interfaces and Types <a [routerLink] [fragment]="'interfaces'" class="anchor-link" id="interfaces">#</a>
              </h2>

              <h4 class="mt-3 mb-3">
                FuiFilterEnum
                <a [routerLink] [fragment]="'FuiFilterEnum'" class="anchor-link" id="FuiFilterEnum">#</a>
              </h4>

              <p>Here is all possible filter types that we have for now.</p>

              <pre><code [languages]="['typescript']" [highlight]="filterTypesInterface"></code></pre>

              <h4 class="mt-3 mb-3">
                FuiFilterInterface&lt;T, P extends
                <a [routerLink] [fragment]="'FuiFilterParamsInterface'">FuiFilterParamsInterface</a>&lt;T&gt;&gt;
                <a [routerLink] [fragment]="'FuiFilterInterface'" class="anchor-link" id="FuiFilterInterface">#</a>
              </h4>

              <p>This is the base interface that every filters inherit from.</p>

              <pre><code [languages]="['typescript']" [highlight]="filterBaseInterface"></code></pre>

              <h4 class="mt-3 mb-3">
                FuiFilterParamsInterface&lt;T&gt;
                <a [routerLink] [fragment]="'FuiFilterParamsInterface'" class="anchor-link" id="FuiFilterParamsInterface">#</a>
              </h4>

              <p>This is the base interface that every filters params inherit from.</p>

              <pre><code [languages]="['typescript']" [highlight]="filterBaseParamsInterface"></code></pre>

              <h4 class="mt-3 mb-3">
                FuiFilterFieldInterface&lt;T, P extends
                <a [routerLink] [fragment]="'FuiFilterParamsInterface'">FuiFilterParamsInterface</a>&lt;T&gt;&gt;
                <a [routerLink] [fragment]="'FuiFilterFieldInterface'" class="anchor-link" id="FuiFilterFieldInterface">#</a>
              </h4>

              <p>This is the interface that every filter fields inherit from.</p>

              <pre><code [languages]="['typescript']" [highlight]="filterFieldInterface"></code></pre>

              <h4 class="mt-3 mb-3">
                FuiFilterOptionDefInterface
                <a [routerLink] [fragment]="'FuiFilterOptionDefInterface'" class="anchor-link" id="FuiFilterOptionDefInterface"
                  >#</a
                >
              </h4>

              <p>
                When you want to create options that are not already present within
                <a [routerLink] [fragment]="'FuiFilterOptionsEnum'">FuiFilterOptionsEnum</a>, you can use this interface to create
                your custom option.
              </p>

              <pre><code [languages]="['typescript']" [highlight]="filterOptionsDefInterface"></code></pre>

              <h4 class="mt-3 mb-3">
                FuiFilterOptionsEnum
                <a [routerLink] [fragment]="'FuiFilterOptionsEnum'" class="anchor-link" id="FuiFilterOptionsEnum">#</a>
              </h4>

              <p>Enum of every possible options that you may want to use within your filter.</p>

              <pre><code [languages]="['typescript']" [highlight]="filterOptionsInterface"></code></pre>

              <h4 class="mt-3 mb-3">
                FuiFilterPopoverPositionEnum
                <a [routerLink] [fragment]="'FuiFilterPopoverPositionEnum'" class="anchor-link" id="FuiFilterPopoverPositionEnum"
                  >#</a
                >
              </h4>

              <p>
                Enum of every possible position for the global search/filters combo. If you only want the filters part, the
                component will be displayed on the right. Otherwise, it will be displayed on the left.
              </p>

              <pre><code [languages]="['typescript']" [highlight]="filterPopoverPositionInterface"></code></pre>

              <h4 class="mt-3 mb-3">
                FuiFilterVo&lt;T, P extends
                <a [routerLink] [fragment]="'FuiFilterParamsInterface'">FuiFilterParamsInterface</a>&lt;T&gt;&gt;
                <a [routerLink] [fragment]="'FuiFilterVo'" class="anchor-link" id="FuiFilterVo">#</a>
              </h4>

              <p>
                When you retrieve the filter, you might want to be able to stringify the filter object. To do it, you just need to
                use the visual object representation (VO) of the filter. Note that its value won't change over time. It will
                correspond to the filter object at the specific point in time when the user call the <code>toJson()</code> method.
              </p>

              <pre><code [languages]="['typescript']" [highlight]="filterVoInterface"></code></pre>

              <h4 class="mt-3 mb-3">
                FuiSelectedFilterInterface&lt;T, P extends
                <a [routerLink] [fragment]="'FuiFilterParamsInterface'">FuiFilterParamsInterface</a>&lt;T&gt;&gt;
                <a [routerLink] [fragment]="'FuiSelectedFilterInterface'" class="anchor-link" id="FuiSelectedFilterInterface"
                  >#</a
                >
              </h4>

              <p>
                When you retrieve the filters from <code>(onFiltersChange)</code> or <code>(onFiltersApplied)</code> your getting
                a list of <code>FuiSelectedFilterInterface</code> objects. The <b>index</b> represent the order of the filter in
                the list and the <b>filter</b> represent the actual filter.
              </p>

              <pre><code [languages]="['typescript']" [highlight]="filtersActiveInterface"></code></pre>

              <h4 class="mt-3 mb-3">
                FuiFilterComponentInterface&lt;T, P extends
                <a [routerLink] [fragment]="'FuiFilterParamsInterface'">FuiFilterParamsInterface</a>&lt;T&gt;, F extends
                <a [routerLink] [fragment]="'FuiFilterInterface'">FuiFilterInterface</a>&lt;T, P&gt;&gt;
                <a [routerLink] [fragment]="'FuiFilterComponentInterface'" class="anchor-link" id="FuiFilterComponentInterface"
                  >#</a
                >
              </h4>

              <p>
                Every filters (Custom or Built-in) component implement this interface. It lists all mandatory methods and
                attributes that you need to create a filter.
              </p>

              <pre><code [languages]="['typescript']" [highlight]="filterComponentInterface"></code></pre>
            </div>
          </div>
        </div>
      </fui-tab>
      <fui-tab [title]="'Examples'">
        <demo-page pageTitle="Filter component">
          <demo-component *ngFor="let example of examples" [componentData]="example"></demo-component>
        </demo-page>
      </fui-tab>
    </fui-tabs>
  `
})
export class FilterDemoComponent implements OnInit {
  filterCustomFilterExample = `import { Component, OnInit } from '@angular/core';

import {
  FeruiUtils,
  FuiBaseFilter,
  FuiFilterComponentInterface,
  FuiFilterInterface,
  FuiFilterOptionsEnum,
  FuiFilterParamsInterface,
  FuiFilterService,
  FuiI18nService
} from '@ferui/components';

export interface DemoGenderFilterValue {
  [key: string]: boolean;
}

@Component({
  selector: 'demo-gender-filter',
  template: \` <div class="col-3 fui-filters-column-name" unselectable="on">
      {{ getFilterName() }}
    </div>
    <div class="col-9">
      <div class="container-fluid">
        <div class="row">
          <div class="col-4" *ngFor="let gender of availableGenders">
            <fui-checkbox-wrapper>
              <input
                type="checkbox"
                fuiCheckbox
                [disabled]="getFilterService()?.isDisabled$() | async"
                (ngModelChange)="onChange($event, gender)"
                [(ngModel)]="selectedSearch[gender]"
              />
              <label fuiLabel> {{ gender }}</label>
            </fui-checkbox-wrapper>
          </div>
        </div>
      </div>
    </div>\`,
  host: {
    '[class.row]': 'true'
  }
})
export class DemoCustomGenderFilterComponent<
    T extends DemoGenderFilterValue = DemoGenderFilterValue,
    P extends FuiFilterParamsInterface<T> = FuiFilterParamsInterface<T>,
    F extends FuiFilterInterface<T, P> = FuiFilterInterface<T, P>
  >
  extends FuiBaseFilter<T, P, F>
  implements FuiFilterComponentInterface<T, P, F>, FuiFilterInterface<T, P>, OnInit {
  selectedSearch: T;
  availableGenders: string[];
  filterDefaultName: string = FeruiUtils.generateUniqueId('fui-filter-gender');

  /**
   * We include all the services that we need including the mandatory filterService and fuiI18nService services.
   * @param filterService
   * @param fuiI18nService
   */
  constructor(protected filterService: FuiFilterService, protected fuiI18nService: FuiI18nService) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    // You shouldn't do any filter attribute initialisation here. Instead, use the setInitialValues() method to do your initial
    // initialisation.
    // Here you should do only initialisation specific to this component but not to inherited attributes.
    // This attribute is dedicated to this component and it is not inherited from parent. So i can initialise it here.
    this.availableGenders = ['Male', 'Female'];
  }

  /**
   * We don't want to have any option for this filter.
   */
  getFilterOption(): FuiFilterOptionsEnum | null {
    return null;
  }

  /**
   * There, the value will be of type DemoGenderFilterValue.
   */
  getFilterValue(): T | null {
    return this.selectedSearch;
  }

  /**
   * We use the inherited addOrRemoveFilter method to add or remove the filter depending on its value.
   * @param value
   * @param gender
   */
  onChange(value: boolean, gender: string) {
    /// Be careful when using objects for this.selectedSearch as objects mutations are NOT supported.
    // Instead of directly call 'this.selectedSearch[gender] = value;' you need to ASSIGN the whole this.selectedSearch object
    // (this.selectedSearch = selectedSearch;) by doing the following.
    const selectedSearch: T = Object.assign({}, this.selectedSearch);
    selectedSearch[gender] = value;
    this.selectedSearch = selectedSearch;
    this.addOrRemoveFilter(!FeruiUtils.isObjectEmpty(this.selectedSearch), this.getFilterInstance() as F);
    this.filterChange.emit(this.getFilterInstance() as F);
  }

  /**
   * Initialise the values. This method will be called by the parent ngOnInit() method after default initialisation and before
   * adding the mandatory cancel watcher.
   * @protected
   */
  protected setInitialValues() {
    // tslint:disable-next-line
    this.selectedSearch = {} as T;
    // Since super.setInitialValues(); will take care of adding the mandatory initialVoCache object, you should call it after your
    // own initialisation. Here, my selectedSearch attribute is an object, so i need to assign it to an empty object by default.
    super.setInitialValues();
  }
}`;

  filterComponentInterface = `interface FuiFilterComponentInterface<T, P extends FuiFilterParamsInterface<T>, F extends FuiFilterInterface<T, P>> {
  // Add or remove a filter from the selected filters list.
  addOrRemoveFilter(condition: boolean, filter: F): void;

  // Get the filterService
  getFilterService(): FuiFilterService;

  // Internal method used to translate a string.
  translate<K extends keyof FuiI18nStrings>(toTranslate: K | FuiFilterOptionsEnum): FuiI18nStrings[K];
}`;

  filterVoInterface = `/**
 * Get the Visual object representation of a filter. This will return the filter value from a specific point in time
 * (when you call the toJson() method of the FuiFilterInterface).
 */
interface FuiFilterVo<T, P extends FuiFilterParamsInterface<T>> {
  filterId: string;
  filterField: FuiFilterFieldInterface<T, P>;
  isActive: boolean;
  filterName: string;
  filterType: FuiFilterEnum;
  filterOption: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null;
  filterValue: T | T[] | null;
  filterParams: P;
}`;

  filtersActiveInterface = `interface FuiSelectedFilterInterface<T = any, P extends FuiFilterParamsInterface<T> = FuiFilterParamsInterface<T>> {
  index: string;
  filter: FuiFilterInterface<T, P>;
}`;

  filterPopoverPositionInterface = `/**
 * Filter position enum. This is useful to know when we should display the popover when opening the filters.
 */
enum FuiFilterPopoverPositionEnum {
  LEFT = 'left',
  RIGHT = 'right'
}`;

  filterTypesInterface = `/**
 * All possible types of filters available.
 */
enum FuiFilterEnum {
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  STRING = 'string',
  DATE = 'date',
  CUSTOM = 'custom',
  GLOBAL_SEARCH = 'globalsearch'
}`;

  filterOptionsInterface = `/**
 * List of all possible options for all filters.
 */
enum FuiFilterOptionsEnum {
  EMPTY = 'empty',
  EQUALS = 'equals',
  NOT_EQUAL = 'notEqual',
  LESS_THAN = 'lessThan',
  LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
  GREATER_THAN = 'greaterThan',
  GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',
  IN_RANGE = 'inRange',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'notContains',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith'
}`;

  filterOptionsDefInterface = `interface FuiFilterOptionDefInterface {
  displayKey: string;
  displayName: string;
}`;

  filterFieldInterface = `interface FuiFilterFieldInterface<T = any, P extends FuiFilterParamsInterface<T> = FuiFilterParamsInterface<T>> {
  // Unique key for the field.
  key: string;

  // The label to display.
  label: string;

  // The type of filter.
  type: FuiFilterEnum;

  // The filter params.
  params?: P;

  // If you want to add extra data to render the filter.
  data?: any;

  // The custom filter component you want to use.
  filterFramework?: Type<FuiFilterComponentInterface<T, P, FuiFilterInterface<T, P>>>;
}`;

  filterBaseParamsInterface = `interface FuiFilterParamsInterface<T> {
  // Only useful if you want to override the filter field label for some reason.
  filterLabel?: string;

  // Which option should we select by default?
  filterDefaultOption?: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null;

  // Which options should we displays for filter? Be careful because it will REPLACE the default options list.
  filterApplicableOptions?: (FuiFilterOptionDefInterface | FuiFilterOptionsEnum)[];
}`;

  filterBaseInterface = `interface FuiFilterInterface<T, P extends FuiFilterParamsInterface<T>> {
  // The filter unique ID
  filterId: string;

  // The filter field object user to generate this filter.
  filterField: FuiFilterFieldInterface<T, P>;

  // Whether or not the filter is active (if the user has clicked on 'Apply filters).
  isFilterActive(): boolean;

  // Set a filter active.
  setFilterActive(value: boolean): void;

  // Get the filter name to be display in the popover.
  getFilterName(): string;

  // Get the filter value. It can be a simple value or an array of values. If the option is 'in-range', this function will return
  // an array containing the 'from' and 'to' values (i.e: i want data where age is between 10 and 20 years old).
  getFilterValue(): T | T[] | null;

  // Get the filter type.
  getFilterType(): FuiFilterEnum;

  // Get the filter selected option.
  getFilterOption(): FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null;

  // Get the filter params. In some cases, we might want to add more params.
  getFilterParams(): P;

  // Visual object representation of this object.
  toJson(): FuiFilterVo<T, P>;
}`;

  filterComparableInterface = `interface FuiComparableFilterInterface<T, P extends FuiComparableFilterParamsInterface<T>> extends FuiFilterInterface<T, P> {
  // The selected filter option that we want to use for comparison.
  selectedOption: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null;

  // The desired search value to compare
  selectedSearch: T | null;

  // Get the filter search value. This will reflect the 'selectedSearch' value.
  getFilterValue(): T | null;

  // Get all applicable options for this filter. This determinate all options available to the user.
  getApplicableFilterOptions(): (FuiFilterOptionDefInterface | FuiFilterOptionsEnum)[];
}`;

  filterScalarInterface = `interface FuiScalarFilterInterface<T, P extends FuiScalarFilterParamsInterface<T>> extends FuiFilterInterface<T, P> {
  // The selected filter option that we want to use for comparison.
  selectedOption: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null;

  // The desired search value to compare
  selectedSearch: T | null;

  // The 2nd desired search value to compare. Only if 'isInRange()' is true.
  selectedSearchTo?: T | null;

  // Whether or not we want to do a 'in-range' comparison. Like we want to search for data between two values.
  isInRange(): boolean;

  // Get all applicable options for this filter. This determinate all options available to the user.
  getApplicableFilterOptions(): (FuiFilterOptionDefInterface | FuiFilterOptionsEnum)[];
}`;

  filterComparableApplicableOptionsInterface = `[
  FuiFilterOptionsEnum.EQUALS,
  FuiFilterOptionsEnum.NOT_EQUAL,
  FuiFilterOptionsEnum.STARTS_WITH,
  FuiFilterOptionsEnum.ENDS_WITH,
  FuiFilterOptionsEnum.CONTAINS,
  FuiFilterOptionsEnum.NOT_CONTAINS
]`;

  filterScalarApplicableOptionsInterface = `[
  FuiFilterOptionsEnum.EQUALS,
  FuiFilterOptionsEnum.NOT_EQUAL,
  FuiFilterOptionsEnum.LESS_THAN,
  FuiFilterOptionsEnum.LESS_THAN_OR_EQUAL,
  FuiFilterOptionsEnum.GREATER_THAN,
  FuiFilterOptionsEnum.GREATER_THAN_OR_EQUAL,
  FuiFilterOptionsEnum.IN_RANGE
]`;

  filterPersonObject = `interface SearchApiPersonJson {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  favorite_animal: string;
  favorite_color: string;
}`;

  filterPersonFilterList = `filters: FuiFilterFieldInterface[] = [
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
    key: 'gender',
    label: 'Gender',
    type: FuiFilterEnum.CUSTOM,
    filterFramework: DemoCustomGenderFilterComponent
  }
];`;

  filterPersonFilterCustomOptionsList = `filters: FuiFilterFieldInterface[] = [
  {
    key: 'id',
    label: 'ID',
    type: FuiFilterEnum.NUMBER
  },
  {
    key: 'first_name',
    label: 'First name',
    type: FuiFilterEnum.STRING,
    params: {
      filterDefaultOption: FuiFilterOptionsEnum.CONTAINS,
      filterApplicableOptions: [
        FuiFilterOptionsEnum.CONTAINS,
        FuiFilterOptionsEnum.EQUALS
      ]
    }
  },
  {
    key: 'gender',
    label: 'Gender',
    type: FuiFilterEnum.CUSTOM,
    filterFramework: DemoCustomGenderFilterComponent
  }
];`;

  filterExample = `<fui-filter (onFiltersChange)="onFilterChangeFn($event)" (onFiltersApplied)="onFiltersAppliedFn($event)" [filterFields]="filters"></fui-filter>`;

  examples: Array<DemoComponentData> = [];
  exampleFilters: FuiFilterFieldInterface[] = [
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
      key: 'gender',
      label: 'Gender',
      type: FuiFilterEnum.CUSTOM,
      filterFramework: DemoCustomGenderFilterComponent
    }
  ];
  exampleFiltersCustomOptions: FuiFilterFieldInterface[] = [
    {
      key: 'id',
      label: 'ID',
      type: FuiFilterEnum.NUMBER
    },
    {
      key: 'first_name',
      label: 'First name',
      type: FuiFilterEnum.STRING,
      params: {
        filterDefaultOption: FuiFilterOptionsEnum.CONTAINS,
        filterApplicableOptions: [FuiFilterOptionsEnum.CONTAINS, FuiFilterOptionsEnum.EQUALS]
      }
    },
    {
      key: 'gender',
      label: 'Gender',
      type: FuiFilterEnum.CUSTOM,
      filterFramework: DemoCustomGenderFilterComponent
    }
  ];
  filters: FuiFilterFieldInterface[];

  @ViewChild('demoBrowserFilter') demoBrowserFilter: TemplateRef<FuiFilterCustomContextInterface>;

  ngOnInit(): void {
    this.filters = [
      {
        key: 'test1',
        label: 'Text filter',
        type: FuiFilterEnum.STRING
      },
      {
        key: 'test2',
        label: 'Number filter',
        type: FuiFilterEnum.NUMBER
      },
      {
        key: 'test3',
        label: 'Date filter',
        type: FuiFilterEnum.DATE
      },
      {
        key: 'test4',
        label: 'Boolean filter',
        type: FuiFilterEnum.BOOLEAN
      },
      {
        key: 'test5',
        label: 'Custom filter',
        type: FuiFilterEnum.CUSTOM,
        filterFramework: DemoBrowserCustomFilterComponent
      }
    ];

    this.examples.push(
      new DemoComponentData({
        title: 'Default filter component',
        models: {
          filters: () => this.filters,
          logActiveFiltersOnChange: filters => this.logActiveFiltersOnChange(filters),
          logActiveFiltersOnApplied: filters => this.logActiveFiltersOnApplied(filters)
        },
        source: `
        <fui-filter
        (onFiltersChange)="models.logActiveFiltersOnChange($event)"
        (onFiltersApplied)="models.logActiveFiltersOnApplied($event)"
        [filterFields]="models.filters()"
      ></fui-filter>`
      }),

      new DemoComponentData({
        title: 'Only the global search filter section.',
        models: {
          logActiveFiltersOnChange: filters => this.logActiveFiltersOnChange(filters),
          logActiveFiltersOnApplied: filters => this.logActiveFiltersOnApplied(filters)
        },
        source: `
        <fui-filter [withFilters]="false"
        (onFiltersChange)="models.logActiveFiltersOnChange($event)"
        (onFiltersApplied)="models.logActiveFiltersOnApplied($event)"
      ></fui-filter>`
      }),

      new DemoComponentData({
        title: 'Only the filters section.',
        models: {
          filters: () => this.filters,
          logActiveFiltersOnChange: filters => this.logActiveFiltersOnChange(filters),
          logActiveFiltersOnApplied: filters => this.logActiveFiltersOnApplied(filters)
        },
        source: `
        <fui-filter [withGlobalSearch]="false"
        (onFiltersChange)="models.logActiveFiltersOnChange($event)"
        (onFiltersApplied)="models.logActiveFiltersOnApplied($event)"
        [filterFields]="models.filters()"
      ></fui-filter>`
      }),

      new DemoComponentData({
        title: 'Only the filters section plus a title.',
        models: {
          filters: () => this.filters,
          logActiveFiltersOnChange: filters => this.logActiveFiltersOnChange(filters),
          logActiveFiltersOnApplied: filters => this.logActiveFiltersOnApplied(filters)
        },
        source: `
        <fui-filter [withGlobalSearch]="false"
        (onFiltersChange)="models.logActiveFiltersOnChange($event)"
        (onFiltersApplied)="models.logActiveFiltersOnApplied($event)"
        [filterFields]="models.filters()"
      >
        <h5 fuiFilterHeaderLabel>Super awesome title injected to the filter header</h5>
      </fui-filter>`
      })
    );
  }

  logActiveFiltersOnChange(filters: FuiSelectedFilterInterface[]) {
    console.log(
      '[FuiFilter] On filter change ::: ',
      filters.map(aFilter => aFilter.filter.toJson())
    );
  }

  logActiveFiltersOnApplied(filters: FuiSelectedFilterInterface[]) {
    console.log(
      '[FuiFilter] On filter applied ::: ',
      filters.map(aFilter => aFilter.filter.toJson())
    );
  }
}
