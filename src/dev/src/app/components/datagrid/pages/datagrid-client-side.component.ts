import { BehaviorSubject, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';

import {
  Column,
  CsvExportParams,
  FilterType,
  FuiColumnDefinitions,
  FuiDatagridBodyCellContext,
  FuiDatagridComponent,
  FuiDatagridRowNode,
  FuiDatagridSortDirections,
  FuiFieldTypes,
  FuiModalService,
  FuiRowModel,
  FuiRowSelectionEnum,
  IDateFilterParams
} from '@ferui/components';

import { FuiDatagridFooterCellContext } from '../../../../../../ferui-components/datagrid/types/footer-cell-context';
import { DemoDatagrid10KDataInterface, DemoDatagridSynchronousDataInterface } from '../datagrid-data-interfaces';
import { DatagridService } from '../datagrid.service';

import { DatagridModalTestingComponent, SimpleModalRow } from './modals/datagrid-modal-testing';
import { WizardSelectedNodes } from './modals/modals-interfaces';
import { DatagridModalWizardStep1Component } from './modals/wizard-testing/datagrid-wizard-testing-step1';
import { DatagridModalWizardStep2Component } from './modals/wizard-testing/datagrid-wizard-testing-step2';

export interface DemoFooterRendererContext {
  getValue(column: Column): string;
  getDynamicValue(): string;
}

@Component({
  template: `
    <h1 class="mt-4 mb-4">Client-side datagrid</h1>

    <fui-tabs>
      <fui-tab [label]="'Examples'">
        <ng-template fui-tab-content>
          <div class="container-fluid">
            <div class="row" style="max-width: 1200px">
              <div class="col col-12">
                <div class="mb-2">
                  <fui-demo-datagrid-option-menu [datagridRowModel]="rowDataModel" [datagrid]="datagrid">
                    <button class="btn btn-warning btn-sm" (click)="withHeader = !withHeader">
                      {{ withHeader ? 'Hide header' : 'Display header' }}
                    </button>
                    <button class="btn btn-warning ml-2 btn-sm" (click)="withFooter = !withFooter">
                      {{ withFooter ? 'Hide footer' : 'Display footer' }}
                    </button>
                    <button
                      *ngIf="withFooter"
                      class="btn btn-warning ml-2 btn-sm"
                      (click)="withFooterItemPerPage = !withFooterItemPerPage"
                    >
                      {{ withFooterItemPerPage ? 'Hide Item per page' : 'Display Item per page' }}
                    </button>
                    <button *ngIf="withFooter" class="btn btn-warning ml-2 btn-sm" (click)="withFooterPager = !withFooterPager">
                      {{ withFooterPager ? 'Hide pager' : 'Display pager' }}
                    </button>
                    <button class="btn btn-warning ml-2 btn-sm" (click)="withFixedHeight = !withFixedHeight">
                      {{ withFixedHeight ? 'Auto grid height' : 'Fixed grid height' }}
                    </button>

                    <br />
                    <div style="display: block; width: 100%; height: 1px;" class="mt-2"></div>

                    <button class="btn btn-primary ml-0 btn-sm" (click)="logRowDataSelection()">
                      Display rowData selection in browser console
                    </button>
                    <button class="btn btn-primary ml-2 btn-sm" (click)="logRowsSelection()">
                      Display rowNode selection in browser console
                    </button>
                    <button
                      class="btn btn-primary ml-2 btn-sm"
                      (click)="suppressRowClickSelection1 = !suppressRowClickSelection1"
                    >
                      {{ suppressRowClickSelection1 ? 'Enable row click selection' : 'Suppress row click selection' }}
                    </button>
                    <button class="btn btn-sm btn-primary ml-2" (click)="storeSelection()">Store Selection</button>
                    <button
                      class="btn btn-sm btn-primary ml-2"
                      *ngIf="storedSelectionList && storedSelectionList.length > 0"
                      (click)="resetToInitialSelection()"
                    >
                      Use initial selection list
                    </button>

                    <br />
                    <div style="display: block; width: 100%; height: 1px;" class="mt-2"></div>

                    <button class="btn btn-info mr-2 btn-sm" (click)="logRowData()">
                      Display rowNode data in browser console
                    </button>
                  </fui-demo-datagrid-option-menu>

                  <div class="container-fluid mt-2">
                    <div class="row">
                      <div class="col-auto pt-2">Displayed rows count</div>
                      <div class="col-auto">
                        <fui-select
                          [layout]="'small'"
                          fuiSelect
                          name="itemPerPage"
                          [addTag]="true"
                          [items]="[5, 10, 20]"
                          [clearable]="false"
                          placeholder="Items per page"
                          (ngModelChange)="itemPerPageChange($event)"
                          [(ngModel)]="itemPerPage"
                        >
                          <ng-template ng-label-tmp let-item="item"> {{ item }} items per page</ng-template>
                          <ng-template ng-option-tmp let-item="item" let-search="searchTerm">
                            {{ item || search }} items per page
                          </ng-template>
                          <ng-template ng-tag-tmp let-search="searchTerm"> {{ search }} items per page</ng-template>
                        </fui-select>
                      </div>
                      <div class="col-auto pt-1">
                        (You can automatically add a new value within this select. Just type a number an it will be added as a new
                        option)
                      </div>
                    </div>
                  </div>
                </div>
                <div id="testgrid" class="mb-4" style="width: 100%;">
                  <fui-datagrid
                    #datagrid
                    [initialSelectedRows]="initialSelectionList$"
                    [checkboxSelection]="true"
                    [suppressRowClickSelection]="suppressRowClickSelection1"
                    [rowSelection]="rowSelectionEnum.MULTIPLE"
                    [fixedHeight]="withFixedHeight"
                    [exportParams]="exportParams"
                    [withHeader]="withHeader"
                    [withNavigator]="withFooter"
                    [withNavigatorItemPerPage]="withFooterItemPerPage"
                    [withNavigatorPager]="withFooterPager"
                    [maxDisplayedRows]="itemPerPage"
                    [defaultColDefs]="defaultColumnDefs"
                    [columnDefs]="columnDefs"
                    [rowData]="rowData"
                    [actionMenuTemplate]="actionMenu"
                  >
                    <fui-dropdown [fuiCloseMenuOnItemClick]="false">
                      <span fuiDropdownTrigger>
                        <clr-icon class="dropdown-icon" shape="fui-dots"></clr-icon>
                      </span>
                      <fui-dropdown-menu fuiPosition="bottom-right" *fuiIfOpen>
                        <label class="dropdown-header" aria-hidden="true">Export the grid</label>
                        <div fuiDropdownItem (click)="exportGrid()">Export to CSV</div>
                        <div class="fui-dropdown-divider" role="separator" aria-hidden="true"></div>
                        <label class="dropdown-header" aria-hidden="true">Actions</label>
                        <button fuiDropdownItem (click)="sizeColumnsToFit()">Size columns to fit the grid</button>
                        <button fuiDropdownItem (click)="autoWidthColumns()">Auto width all columns</button>
                        <button fuiDropdownItem (click)="refreshGrid()">Refresh grid</button>
                        <button fuiDropdownItem (click)="resetGrid()">Reset grid</button>
                        <label class="dropdown-header" aria-hidden="true">Visual actions</label>
                        <button fuiDropdownItem (click)="withHeader = !withHeader">
                          {{ withHeader ? 'Hide header' : 'Display header' }}
                        </button>
                        <button fuiDropdownItem (click)="withFooter = !withFooter">
                          {{ withFooter ? 'Hide footer' : 'Display footer' }}
                        </button>
                        <button fuiDropdownItem *ngIf="withFooter" (click)="withFooterItemPerPage = !withFooterItemPerPage">
                          {{ withFooterItemPerPage ? 'Hide Item per page' : 'Display Item per page' }}
                        </button>
                        <button fuiDropdownItem *ngIf="withFooter" (click)="withFooterPager = !withFooterPager">
                          {{ withFooterPager ? 'Hide pager' : 'Display pager' }}
                        </button>
                        <label class="dropdown-header" aria-hidden="true">Displayed rows count</label>
                        <span>
                          <fui-select
                            [layout]="'small'"
                            fuiSelect
                            name="itemPerPage"
                            [addTag]="true"
                            [items]="[5, 10, 20]"
                            [clearable]="false"
                            [appendTo]="'body'"
                            placeholder="Items per page"
                            (ngModelChange)="itemPerPageChange($event)"
                            [(ngModel)]="itemPerPage"
                          >
                            <ng-template ng-label-tmp let-item="item"> {{ item }} items per page</ng-template>
                            <ng-template ng-option-tmp let-item="item" let-search="searchTerm">
                              {{ item || search }} items per page
                            </ng-template>
                            <ng-template ng-tag-tmp let-search="searchTerm"> {{ search }} items per page</ng-template>
                          </fui-select>
                        </span>
                      </fui-dropdown-menu>
                    </fui-dropdown>
                  </fui-datagrid>
                </div>

                <p>
                  <b>NOTE:</b> On the Datagrid above, the footer cells templates are custom. We either use a simple HTML string
                  (for the 'Pure HTML' footer cell) or a dynamic cell using an
                  <code>&lt;ng-template&gt;&lt;/ng-template&gt;</code> to render the other ones.<br />
                  Also, we have disabled the footer cell for the Gender column. It will be blank.
                </p>

                <div id="testgrid" class="mb-4" style="width: 100%;">
                  <div class="mb-2">
                    <h3>Synchronous row data</h3>
                  </div>

                  <div class="mb-2">
                    <button
                      class="btn btn-primary ml-2 mr-2 btn-sm"
                      (click)="suppressRowClickSelection2 = !suppressRowClickSelection2"
                    >
                      {{ suppressRowClickSelection2 ? 'Enable row click selection' : 'Suppress row click selection' }}
                    </button>
                  </div>
                  <fui-datagrid
                    #datagrid2
                    [checkboxSelection]="true"
                    [suppressRowClickSelection]="suppressRowClickSelection2"
                    [rowSelection]="rowSelectionEnum.SINGLE"
                    [withHeader]="withHeader2"
                    [withNavigator]="withFooter2"
                    [exportParams]="exportParams2"
                    [maxDisplayedRows]="itemPerPageSynchronous"
                    [defaultColDefs]="defaultColumnDefsSynchronous"
                    [columnDefs]="columnDefsSynchronous"
                    [rowData]="synchronousRowData"
                  >
                  </fui-datagrid>
                </div>

                <p>
                  <b>NOTE:</b> On the Datagrid above, the footer cells templates are using the default design which is the same as
                  the header cells without the background color.
                </p>

                <h4 class="mt-4 mb-4">Datagrid within a modal</h4>

                <button class="btn btn-primary btn-lg" (click)="openTestModal()">Open testing modal</button>
                <button class="btn btn-primary btn-lg ml-2" (click)="openTestWizard()">Open Datagrid selection wizard</button>

                <div id="testgrid" class="mb-4 mt-4" style="width: 100%;">
                  <div class="mb-2">
                    <h3>Setup custom classes to header/body/footer cells</h3>
                  </div>
                  <p class="mb-2">
                    In some cases, you might want to add custom classes to your header, body or footer cells. You can use the
                    <code>headerClass</code>, <code>cellClass</code> and <code>footerCellClass</code> properties of your column
                    definition object to add the classes that you want.<br />
                    The value can either be <code>string</code>, <code>string[]</code> or
                    <code>(params: FuiDatagridCellClassParams) => string | string[]</code>.
                  </p>
                  <p class="mb-2">
                    <b>Note</b>: In this example we have assigned multiple classes to each column and just played with the
                    background colors a bit to illustrate that the classes are well assigned.
                  </p>
                  <fui-datagrid
                    [withHeader]="withHeader2"
                    [withNavigator]="withFooter2"
                    [exportParams]="exportParams2"
                    [maxDisplayedRows]="itemPerPageSynchronous"
                    [defaultColDefs]="defaultColDefsSynchronousClasses"
                    [columnDefs]="columnDefsSynchronousClasses"
                    [rowData]="synchronousRowData"
                  >
                  </fui-datagrid>

                  <div class="mt-4">
                    <h4>HTML code</h4>

                    <pre><code [highlight]="datagridCustomClassesHTML"></code></pre>

                    <h4>Column definitions</h4>

                    <pre><code [highlight]="datagridCustomClassesTS"></code></pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ng-template>

        <ng-template
          #actionMenu
          let-rowIndex="rowNode.rowIndex"
          let-onDropdownOpen="onDropdownOpen"
          let-forceClose="forceClose"
          let-appendTo="appendTo"
        >
          <fui-dropdown (dropdownOpenChange)="onDropdownOpen($event)" [forceClose]="forceClose">
            <button class="fui-datagrid-demo-action-btn btn" fuiDropdownTrigger>
              ACTIONS
              <clr-icon class="dropdown-icon" dir="down" shape="fui-caret"></clr-icon>
            </button>
            <fui-dropdown-menu [appendTo]="appendTo" *fuiIfOpen>
              <div fuiDropdownItem>action 1 for row {{ rowIndex }}</div>
              <div fuiDropdownItem>action 2 for row {{ rowIndex }}</div>
              <div fuiDropdownItem>action 3 for row {{ rowIndex }}</div>
              <div fuiDropdownItem>action 4 for row {{ rowIndex }}</div>
              <div fuiDropdownItem>action 5 for row {{ rowIndex }}</div>
            </fui-dropdown-menu>
          </fui-dropdown>
        </ng-template>

        <ng-template #avatarRenderer let-value="value">
          <img *ngIf="value" width="30" height="30" alt="" [src]="value" />
        </ng-template>

        <ng-template #browserFilter let-column="column" let-filterParams="column.filterParams">
          <fui-datagrid-browser-filter [column]="column" [filterParams]="filterParams"></fui-datagrid-browser-filter>
        </ng-template>

        <ng-template #countryRenderer let-value="value" let-row="row">
          <img
            *ngIf="value"
            width="24"
            height="24"
            [attr.alt]="value"
            [title]="value"
            [attr.src]="'https://www.countryflags.io/' + row.data.country_code + '/shiny/24.png'"
          />
          {{ value }}
        </ng-template>

        <ng-template #userAgentRenderer let-value="value">
          <span [title]="value" [innerHTML]="datagridService.getIconFor(value) | fuiSafeHtml"> </span>
        </ng-template>

        <ng-template #footerRenderer let-context="context" let-column="column">
          <b [innerHTML]="context?.getValue(column) | fuiSafeHtml"></b>
        </ng-template>
        <ng-template #footerDynamicRenderer let-context="context" let-column="column">
          {{ context?.getDynamicValue() }}
        </ng-template>
        <ng-template #footerRendererSynchronous let-context="context" let-column="column">
          <span [innerHTML]="context?.getValue(column) | fuiSafeHtml"></span>
        </ng-template>
      </fui-tab>
      <fui-tab [label]="'Documentation'">
        <div class="container-fluid">
          <div class="row" style="max-width: 1200px">
            <div class="col col-12">
              <p>
                The simplest row model to use is the Client-side Row Model. This row model takes all of the data to be displayed
                and provides the following features inside the grid:
              </p>

              <ul>
                <li>Filtering</li>
                <li>Sorting</li>
              </ul>

              <p>The Client-side Row Model is the default row model for datagrid.</p>

              <h3>How It Works</h3>

              <p>
                You do not need to know how the Client-side Row Model works, however it can be helpful for those who are
                interested.
              </p>

              <p>
                The Client-side Row Model is responsible for working out how to display the rows inside the grid. It has a complex
                data structure, representing the data in different states. The states are as follows:
              </p>

              <p>The following is an example to help explain each of these steps.</p>

              <h3>State 1: Row Data</h3>

              <p>
                The data as provided by the application. The grid never modifies this array. It just takes the rowData items from
                it. The examples is of three data items.
              </p>

              <p>
                API: There is no API to get this data. However it was provided by the application so you should already have it.
              </p>

              <h3>State 2: All Rows</h3>

              <p>
                allRows is similar to rowData except a new array is created which contains row nodes, each row node pointing to
                exactly one data item. The length of the allRows array is the same as the rowData array.
              </p>

              <p>API: There is no API to get this data. However there is no benefit over the rowsAfterGroup data.</p>

              <h3>State 3: Rows After Filter</h3>

              <p>
                rowsAfterFilter goes through rowsAfterGroup and filters the data. The example shows filtering on the color black
                (thus removing the second group).
              </p>

              <p>API: Use api.forEachNodeAfterFilter() to access this structure.</p>

              <h3>State 4: Rows After Sort</h3>
              <p>rowsAfterSort goes through rowsAfterFilter and sorts the data. The example shows sorting on car make.</p>

              <p>API: Use api.forEachNodeAfterFilterAndSort() to access this structure.</p>
            </div>
          </div>
        </div>
      </fui-tab>
    </fui-tabs>
  `,
  providers: [DatagridService]
})
export class DatagridClientSideComponent implements OnInit {
  rowData: DemoDatagrid10KDataInterface[];
  synchronousRowData: DemoDatagridSynchronousDataInterface[];
  columnDefs: FuiColumnDefinitions[];
  columnDefsSynchronous: FuiColumnDefinitions[];
  columnDefsSynchronousClasses: FuiColumnDefinitions[];
  defaultColumnDefs: FuiColumnDefinitions;
  defaultColumnDefsSynchronous: FuiColumnDefinitions;
  defaultColDefsSynchronousClasses: FuiColumnDefinitions;

  itemPerPage: number = 10;
  itemPerPageSynchronous: number = 5;
  rowDataModel: FuiRowModel = FuiRowModel.CLIENT_SIDE;

  withHeader2: boolean = true;
  withFooter2: boolean = true;
  withHeader: boolean = true;
  withFooter: boolean = true;
  withFooterItemPerPage: boolean = true;
  withFooterPager: boolean = true;
  withFixedHeight: boolean = false;

  suppressRowClickSelection1: boolean = false;
  suppressRowClickSelection2: boolean = false;
  initialSelectionList$: Observable<FuiDatagridRowNode<DemoDatagrid10KDataInterface>[]>;
  storedSelectionList: FuiDatagridRowNode<DemoDatagrid10KDataInterface>[] = [];

  rowSelectionEnum: typeof FuiRowSelectionEnum = FuiRowSelectionEnum;

  exportParams: CsvExportParams = {
    fileName: 'ferUI-export-test-1',
    columnSeparator: ','
  };
  exportParams2: CsvExportParams = {
    fileName: 'ferUI-export-test-2'
  };

  datagridCustomClassesHTML = `<fui-datagrid
  [withHeader]="withHeader2"
  [withNavigator]="withFooter2"
  [exportParams]="exportParams2"
  [maxDisplayedRows]="itemPerPageSynchronous"
  [defaultColDefs]="defaultColDefsSynchronousClasses"
  [columnDefs]="columnDefsSynchronousClasses"
  [rowData]="synchronousRowData"></fui-datagrid>`;
  datagridCustomClassesTS = `// This is the default column definition. It will be used if not overridden.
this.defaultColDefsSynchronousClasses = {
  sortable: true,
  filter: true,
  headerClass: 'test-default-header-class', // Yellowish color Darken
  footerCellClass: 'test-default-header-class', // Yellowish color Darken
  cellClass: 'test-default-cell-class' // Yellowish color
};

this.columnDefsSynchronousClasses = [
  {
    headerName: 'GUID',
    headerClass: 'test-string-header', // Raffia color (sand color) Darken
    footerCellClass: 'test-string-header', // Raffia color (sand color) Darken
    cellClass: 'test-string-cell', // Raffia color (sand color)
    field: 'id'
  },
  {
    headerName: 'Name',
    headerClass: ['test-array-header-1', 'test-array-header-2'], // Blueish color Darken
    footerCellClass: ['test-array-header-1', 'test-array-header-2'], // Blueish color Darken
    cellClass: ['test-array-cell-1', 'test-array-cell-2'], // Blueish color
    field: 'name'
  },
  {
    headerName: 'Email',
    headerClass: params => {
      return 'test-function-header'; // Brownish color Darken
    },
    footerCellClass: params => {
      return 'test-function-header'; // Brownish color Darken
    },
    cellClass: params => {
      // We only add the background color when rowIndex is a prime number. 0, 1, 4, 6
      if (this.isPrime(params.rowIndex)) {
        return 'test-function-cell'; // Brownish color
      } else {
        return null;
      }
    },
    field: 'email'
  },
  { headerName: 'Address', field: 'address' } // This column will inherit from default column def (yellowish BG)
];`;

  @ViewChild('avatarRenderer') avatarRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('userAgentRenderer') userAgentRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('browserFilter') browserFilter: TemplateRef<any>;
  @ViewChild('countryRenderer') countryRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('datagrid') datagrid: FuiDatagridComponent;
  @ViewChild('footerRenderer') footerRenderer: TemplateRef<FuiDatagridFooterCellContext<DemoFooterRendererContext>>;
  @ViewChild('footerDynamicRenderer') footerDynamicRenderer: TemplateRef<FuiDatagridFooterCellContext<DemoFooterRendererContext>>;
  @ViewChild('footerRendererSynchronous') footerRendererSynchronous: TemplateRef<
    FuiDatagridFooterCellContext<DemoFooterRendererContext>
  >;

  currentFooterDynamicValue: string = 'initial value';

  // For this demo, we're using an observable to update the value to be sure to avoid natural change detection (aka CD).
  // With natural CD, if we mutate the array, it won't be detected (for instance when we update the 'selected' state of a
  // FuiDatagridRowNode). If we un-select the previously selected row, then re-load the selection, it won't update the datagrid because for
  // CD, there is no changes. When using Observable, we force this change to be detected at any time.
  // In a real world implementation (within a wizard for instance) we won't need to use an observable, because we would re-load
  // the whole datagrid in previous step and inject the initial selection. The CD will be notified of the change.
  private initialSelectionListSub: BehaviorSubject<FuiDatagridRowNode<DemoDatagrid10KDataInterface>[]> = new BehaviorSubject<
    FuiDatagridRowNode<DemoDatagrid10KDataInterface>[]
  >([]);

  constructor(
    @Inject(HttpClient) private http: HttpClient,
    public datagridService: DatagridService,
    private modalService: FuiModalService
  ) {}

  ngOnInit(): void {
    const dateFilterParams: IDateFilterParams = {
      dateFormat: 'yyyy-mm-dd'
    };

    this.initialSelectionList$ = this.initialSelectionListSub.asObservable();

    this.columnDefs = [
      {
        headerName: 'Avatar',
        field: 'avatar',
        hide: true,
        filter: false,
        cellRenderer: this.avatarRenderer,
        sortable: false
      },
      {
        headerName: 'Username',
        field: 'username',
        minWidth: 150,
        sortOrder: 1,
        sort: FuiDatagridSortDirections.ASC,
        footerCellRenderer: '<b>Pure HTML</b>'
      },
      {
        headerName: 'Creation date',
        field: 'creation_date',
        minWidth: 150,
        sortOrder: 0,
        sortType: FuiFieldTypes.DATE,
        sort: FuiDatagridSortDirections.DESC,
        filter: FilterType.DATE,
        filterParams: dateFilterParams,
        footerCellRenderer: this.footerDynamicRenderer
      },
      { headerName: 'Gender', field: 'gender', footerCellRenderer: '' },
      { headerName: 'First name', field: 'first_name' },
      { headerName: 'Last name', field: 'last_name' },
      { headerName: 'Age', field: 'age', filter: FilterType.NUMBER },
      { headerName: 'Eye color', field: 'eye_color' },
      { headerName: 'Company', field: 'company' },
      { headerName: 'Address', field: 'address', minWidth: 200 },
      { headerName: 'Country', field: 'country', cellRenderer: this.countryRenderer },
      { headerName: 'Email', field: 'email' },
      { headerName: 'Phone', field: 'phone', minWidth: 200 },
      { headerName: 'Ip-address', field: 'ip_address', minWidth: 200 },
      { headerName: 'Active ?', field: 'is_active', filter: FilterType.BOOLEAN },
      { headerName: 'Registered ?', field: 'is_registered', filter: FilterType.BOOLEAN },
      { headerName: 'Favourite animal', field: 'favourite_animal', minWidth: 150 },
      { headerName: 'Favorite movie', field: 'favorite_movie', minWidth: 200 },
      {
        headerName: 'Browser',
        field: 'user_agent',
        cellRenderer: this.userAgentRenderer,
        sortable: false,
        filter: FilterType.CUSTOM,
        filterFramework: this.browserFilter,
        exportValueFormatter: (value: string): string => {
          return `${this.datagridService.identifyBrowser(value)} (${value})`;
        }
      }
    ];

    this.columnDefsSynchronous = [
      { headerName: 'GUID', field: 'id' },
      { headerName: 'Name', field: 'name' },
      { headerName: 'Email', field: 'email' },
      { headerName: 'Address', field: 'address' }
    ];

    this.defaultColumnDefsSynchronous = {
      sortable: true,
      filter: true,
      footerCellRenderer: this.footerRendererSynchronous,
      footerCellContext: {
        getValue: (column: Column) => {
          // Just testing if we can call a private function of this class from the context object here.
          return this.testFooterContextFunction(column);
        },
        getDynamicValue: () => {
          return this.currentFooterDynamicValue;
        }
      }
    };

    this.defaultColDefsSynchronousClasses = {
      sortable: true,
      filter: true,
      headerClass: 'test-default-header-class',
      footerCellClass: 'test-default-header-class',
      cellClass: 'test-default-cell-class',
      footerCellRenderer: this.footerRenderer,
      footerCellContext: {
        getValue: (column: Column) => {
          return column && column.field === 'name' ? 'Total' : column.name;
        }
      }
    };

    this.columnDefsSynchronousClasses = [
      {
        headerName: 'GUID',
        headerClass: 'test-string-header',
        footerCellClass: 'test-string-header',
        cellClass: 'test-string-cell',
        field: 'id'
      },
      {
        headerName: 'Name',
        headerClass: ['test-array-header-1', 'test-array-header-2'],
        footerCellClass: ['test-array-header-1', 'test-array-header-2'],
        cellClass: ['test-array-cell-1', 'test-array-cell-2'],
        field: 'name'
      },
      {
        headerName: 'Email',
        headerClass: params => {
          return 'test-function-header';
        },
        footerCellClass: params => {
          return 'test-function-header';
        },
        cellClass: params => {
          // We only add the background color when rowIndex is a prime number. 2, 3, 5, 7, 11, 13...
          if (this.isPrime(params.rowIndex)) {
            return 'test-function-cell';
          } else {
            return null;
          }
        },
        field: 'email'
      },
      { headerName: 'Address', field: 'address' }
    ];

    this.synchronousRowData = [
      {
        id: 'ec9fb57f-2aab-4675-8048-9e8d9e362e7a',
        name: 'Pixoboo',
        email: 'spoll0@wufoo.com',
        address: '7429 Ohio Plaza'
      },
      {
        id: 'f3bbf3fe-0eec-4cd9-b4f5-85d8d088aac5',
        name: 'Thoughtmix',
        email: 'oconfort1@wordpress.com',
        address: '05 Utah Trail'
      },
      {
        id: '20b1946c-c6ed-4682-a86c-3ab7bcc036a6',
        name: 'Oyoba',
        email: 'cmirralls2@uol.com.br',
        address: '36 Walton Junction'
      },
      {
        id: '3f65ff28-c25b-4369-8bf2-1757f20772b0',
        name: 'Quatz',
        email: 'bcanadas3@tamu.edu',
        address: '3018 Lighthouse Bay Point'
      },
      {
        id: '66018ac7-82ce-4d5a-abfb-b10e77354b65',
        name: 'Myworks',
        email: 'ccargill4@disqus.com',
        address: '7 Burrows Drive'
      },
      {
        id: '02029819-ed4a-48bd-a602-7d24c6a98647',
        name: 'Dazzlesphere',
        email: 'mcoburn5@ihg.com',
        address: '2 Hoffman Point'
      },
      {
        id: 'bbd879a9-49ad-4ae6-8eca-e1ef307e897e',
        name: 'Brainbox',
        email: 'dmaffeo6@ehow.com',
        address: '5925 Farwell Drive'
      },
      {
        id: '5a4ba0fe-a1d1-49a1-b600-82890ec585dd',
        name: 'Tazzy',
        email: 'ovokes7@sogou.com',
        address: '638 Lakeland Junction'
      }
    ];

    this.defaultColumnDefs = {
      sortable: true,
      filter: true,
      footerCellRenderer: this.footerRenderer,
      footerCellContext: {
        getValue: (column: Column) => {
          // Just testing if we can call a private function of this class from the context object here.
          return this.testFooterContextFunction(column);
        },
        getDynamicValue: () => {
          return this.currentFooterDynamicValue;
        }
      }
    };

    this.withHeader2 = false;
    this.withFooter2 = false;

    this.http.get(document.baseURI + '/datagrid-10k-data.min.json').subscribe((results: DemoDatagrid10KDataInterface[]) => {
      setTimeout(() => {
        this.rowData = results;
        // Test empty values.
        // this.rowData = [];
      }, 2000);
    });

    // We are just updating the variable every 3sec to see it being dynamically updated.
    let loop = 0;
    setInterval(() => {
      this.currentFooterDynamicValue = 'Dynamic: ' + loop++;
    }, 3000);
  }

  sizeColumnsToFit() {
    this.datagrid.getGridApi().sizeColumnsToFit();
  }

  autoWidthColumns() {
    this.datagrid.getColumnApi().autoSizeAllColumns();
  }

  refreshGrid() {
    this.datagrid.refreshGrid();
  }

  resetGrid() {
    this.datagrid.refreshGrid(true, true);
  }

  itemPerPageChange(value) {
    this.itemPerPage = value;
  }

  exportGrid() {
    this.datagrid.exportGrid();
  }

  storeSelection() {
    this.storedSelectionList = this.datagrid.getSelectedNodes();
  }

  resetToInitialSelection() {
    // HACK ::: DEMO PAGE ONLY ::: We ensure that the selected nodes are selected.
    // Because of javascript object mutation, the object list from 'this.storedSelectionList' will be mutated each time the
    // datagrid selection objects get mutated. To be sure that our selected nodes are selected, we force it.
    // This won't happen in a real world implementation.
    this.storedSelectionList.forEach(rowNode => rowNode.setSelected(true, false));
    this.initialSelectionListSub.next(this.storedSelectionList);
  }

  logRowsSelection(): void {
    console.log(this.datagrid.getSelectedNodes());
  }

  logRowDataSelection(): void {
    console.log(this.datagrid.getSelectedRows());
  }

  logRowData(): void {
    console.log('FuiDatagridRowNode Data ::: ', this.datagrid.getGridData());
  }

  openTestModal() {
    this.modalService
      .openModal<SimpleModalRow[]>({
        id: 'simpleWindow',
        title: 'Simple example of Datagrid within a modal',
        width: 700,
        component: DatagridModalTestingComponent
      })
      .then((args: SimpleModalRow[]) => {
        console.log('[modalService.openModal] openSimpleModal ::: submitted ::: ', args);
      });
  }

  openTestWizard() {
    this.modalService
      .openModal<WizardSelectedNodes<DemoDatagrid10KDataInterface>>({
        id: 'selectionModalTest',
        title: 'Datagrid selection within a wizard',
        width: 800,
        wizardSteps: [
          {
            stepId: 'rowSelection',
            label: 'Row selection',
            component: DatagridModalWizardStep1Component
          },
          {
            stepId: 'overview',
            label: 'Overview',
            component: DatagridModalWizardStep2Component
          }
        ]
      })
      .then(args => {
        console.log('[modalService.openModal] selectionModalTest ::: submitted ::: ', args);
      });
  }

  /**
   * Just a simple function to display the column name within the footer.
   * @param column
   * @private
   */
  private testFooterContextFunction(column: Column) {
    return column.name;
  }

  /**
   * Check whether or not the 'num' is a prime number.
   * @param num
   * @private
   */
  private isPrime(num) {
    for (let i = 2; i < num; i++) {
      if (num % i === 0) {
        return false;
      }
    }
    return num > 1;
  }
}
