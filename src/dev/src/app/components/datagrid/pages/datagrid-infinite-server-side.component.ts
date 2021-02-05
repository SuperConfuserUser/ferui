import { BehaviorSubject, Observable } from 'rxjs';

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import {
  FilterType,
  FuiColumnDefinitions,
  FuiDatagridBodyCellContext,
  FuiDatagridComponent,
  FuiDatagridRowNode,
  FuiDatagridSortDirections,
  FuiFieldTypes,
  FuiRowModel,
  FuiRowSelectionEnum,
  IDatagridResultObject,
  IDateFilterParams,
  IServerSideDatasource,
  IServerSideGetRowsParams
} from '@ferui/components';

import { DatagridService } from '../datagrid.service';
import { RowDataApiService } from '../server-side-api/datagrid-row.service';

@Component({
  template: `
    <h1 class="mb-4">Infinite server-side datagrid</h1>

    <fui-tabs>
      <fui-tab [title]="'Examples'" [active]="true">
        <h3 class="mb-2">Datagrid with known total rows</h3>
        <div class="mb-4">
          <fui-demo-datagrid-option-menu
            [bandwidthSpeed]="networkBandwith"
            [datagridRowModel]="rowDataModel"
            [datagrid]="datagrid1"
            (bandwidthSpeedChange)="networkBandwithChange($event)"
          >
            <button class="btn btn-warning btn-sm" (click)="withHeader = !withHeader">
              {{ withHeader ? 'Hide header' : 'Display header' }}
            </button>
            <button class="btn btn-warning ml-2 mr-2 btn-sm" (click)="withFooter = !withFooter">
              {{ withFooter ? 'Hide footer' : 'Display footer' }}
            </button>
            <button
              *ngIf="withFooter"
              class="btn btn-warning ml-2 mr-2 btn-sm"
              (click)="withFooterItemPerPage = !withFooterItemPerPage"
            >
              {{ withFooterItemPerPage ? 'Hide Item per page' : 'Display Item per page' }}
            </button>
            <button *ngIf="withFooter" class="btn btn-warning ml-2 mr-2 btn-sm" (click)="withFooterPager = !withFooterPager">
              {{ withFooterPager ? 'Hide pager' : 'Display pager' }}
            </button>
            <button class="btn btn-warning ml-2 mr-2 btn-sm" (click)="withFixedHeight = !withFixedHeight">
              {{ withFixedHeight ? 'Auto grid height' : 'Fixed grid height' }}
            </button>
            <button class="btn btn-sm btn-primary ml-2" (click)="storeSelection()">Store Selection</button>
            <button
              class="btn btn-sm btn-primary ml-2"
              *ngIf="storedSelectionList && storedSelectionList.length > 0"
              (click)="resetToInitialSelection()"
            >
              Use initial selection list
            </button>
          </fui-demo-datagrid-option-menu>
        </div>
        <div class="mb-4" style="width: 100%;">
          <fui-datagrid
            #datagrid1
            [checkboxSelection]="true"
            [initialSelectedRows]="initialSelectionList$"
            [rowSelection]="rowSelectionEnum.MULTIPLE"
            [fixedHeight]="withFixedHeight"
            [withHeader]="withHeader"
            [withFooter]="withFooter"
            [withFooterItemPerPage]="withFooterItemPerPage"
            [withFooterPager]="withFooterPager"
            [maxDisplayedRows]="itemPerPage"
            [rowDataModel]="rowDataModel"
            [datasource]="dataSource"
            [defaultColDefs]="defaultColumnDefs"
            [columnDefs]="columnDefs"
          ></fui-datagrid>
        </div>

        <h3 class="mb-2">Datagrid without known total rows</h3>
        <div class="mb-4">
          <fui-demo-datagrid-option-menu
            [bandwidthSpeed]="networkBandwith"
            [datagridRowModel]="rowDataModel"
            [datagrid]="datagrid2"
            (bandwidthSpeedChange)="networkBandwithChange($event)"
          ></fui-demo-datagrid-option-menu>
        </div>
        <div class="mb-4" style="width: 100%;">
          <fui-datagrid
            #datagrid2
            [checkboxSelection]="true"
            [rowSelection]="rowSelectionEnum.SINGLE"
            [rowDataModel]="rowDataModel"
            [datasource]="dataSource2"
            [defaultColDefs]="defaultColumnDefs"
            [columnDefs]="columnDefs"
          ></fui-datagrid>
        </div>

        <h3 class="mb-2">Datagrid error handling</h3>
        <div class="mb-4">
          <fui-demo-datagrid-option-menu
            [bandwidthSpeed]="networkBandwith"
            [datagridRowModel]="rowDataModel"
            [datagrid]="datagrid3"
            (bandwidthSpeedChange)="networkBandwithChange($event)"
          ></fui-demo-datagrid-option-menu>
        </div>
        <div class="mb-4" style="width: 100%;">
          <fui-datagrid
            #datagrid3
            [rowSelection]="rowSelectionEnum.MULTIPLE"
            [rowDataModel]="rowDataModel"
            [datasource]="dataSource3"
            [defaultColDefs]="defaultColumnDefs"
            [columnDefs]="columnDefs3"
          ></fui-datagrid>
        </div>

        <ng-template #avatarRenderer let-value="value">
          <img *ngIf="value" width="30" height="30" alt="" [src]="value" />
        </ng-template>

        <ng-template #browserFilter let-column="column" let-filterParams="column.filterParams">
          <fui-datagrid-browser-filter [column]="column" [filterParams]="filterParams"></fui-datagrid-browser-filter>
        </ng-template>

        <ng-template #userAgentRenderer let-value="value">
          <span [title]="value" [innerHTML]="datagridService.getIconFor(value) | fuiSafeHtml"> </span>
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

        <ng-template #idRenderer let-value="value">
          <span *ngIf="value" [title]="value">{{ value }}</span>
          <span *ngIf="!value">
            <clr-icon class="fui-datagrid-loading-icon fui-loader-animation" shape="fui-spinner"></clr-icon>
          </span>
        </ng-template>
      </fui-tab>
      <fui-tab [title]="'Documentation'">
        <h3 class="mb-4">Overview</h3>
        <p>The <b>Infinite server side</b> row model works exactly the same as server-side row model.</p>
      </fui-tab>
    </fui-tabs>
  `,
  styles: [
    `
      .fui-datagrid-loading-icon {
        color: #87a1b5;
        width: 14px;
        height: 14px;
      }
    `
  ],
  providers: [DatagridService]
})
export class DatagridInfiniteServerSideComponent implements OnInit {
  columnDefs: Array<FuiColumnDefinitions>;
  defaultColumnDefs: FuiColumnDefinitions;
  dataSource: IServerSideDatasource;
  rowDataModel: FuiRowModel = FuiRowModel.INFINITE;
  itemPerPage: number = 5;

  dataSource2: IServerSideDatasource;
  dataSource3: IServerSideDatasource;
  columnDefs3: Array<FuiColumnDefinitions>;

  withHeader: boolean = true;
  withFooter: boolean = true;
  withFooterItemPerPage: boolean = true;
  withFooterPager: boolean = true;
  withFixedHeight: boolean = false;

  @ViewChild('avatarRenderer') avatarRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('userAgentRenderer') userAgentRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('actionsRenderer') actionsRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('idRenderer') idRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('browserFilter') browserFilter: TemplateRef<any>;
  @ViewChild('countryRenderer') countryRenderer: TemplateRef<FuiDatagridBodyCellContext>;

  @ViewChild('datagrid1') datagrid1: FuiDatagridComponent;
  @ViewChild('datagrid2') datagrid2: FuiDatagridComponent;
  @ViewChild('datagrid3') datagrid3: FuiDatagridComponent;

  networkBandwith: number = 260;

  rowSelectionEnum: typeof FuiRowSelectionEnum = FuiRowSelectionEnum;
  initialSelectionList$: Observable<FuiDatagridRowNode[]>;
  storedSelectionList: FuiDatagridRowNode[] = [];

  // For this demo, we're using an observable to update the value to be sure to avoid natural change detection (aka CD).
  // With natural CD, if we mutate the array, it won't be detected (for instance when we update the 'selected' state of a
  // FuiDatagridRowNode). If we un-select the previously selected row, then re-load the selection, it won't update the datagrid because for
  // CD, there is no changes. When using Observable, we force this change to be detected at any time.
  // In a real world implementation (within a wizard for instance) we won't need to use an observable, because we would re-load
  // the whole datagrid in previous step and inject the initial selection. The CD will be notified of the change.
  private initialSelectionListSub: BehaviorSubject<FuiDatagridRowNode[]> = new BehaviorSubject<FuiDatagridRowNode[]>([]);

  constructor(private rowDataService: RowDataApiService, public datagridService: DatagridService) {}

  networkBandwithChange(value) {
    this.networkBandwith = value;
  }

  ngOnInit(): void {
    this.initialSelectionList$ = this.initialSelectionListSub.asObservable();

    const dateFilterParams: IDateFilterParams = {
      dateFormat: 'yyyy-mm-dd'
    };

    this.columnDefs = [
      { headerName: 'ID', field: 'id', cellRenderer: this.idRenderer, filter: FilterType.NUMBER },
      {
        headerName: 'Avatar',
        field: 'avatar',
        hide: true,
        filter: false,
        cellRenderer: this.avatarRenderer,
        sortable: false
      },
      { headerName: 'Username', field: 'username', minWidth: 150, sortOrder: 1, sort: FuiDatagridSortDirections.ASC },
      {
        headerName: 'Creation date',
        field: 'creation_date',
        minWidth: 150,
        sortOrder: 0,
        sortType: FuiFieldTypes.DATE,
        sort: FuiDatagridSortDirections.DESC,
        filter: FilterType.DATE,
        filterParams: dateFilterParams
      },
      { headerName: 'Gender', field: 'gender' },
      { headerName: 'First name', field: 'first_name' },
      { headerName: 'Last name', field: 'last_name' },
      { headerName: 'Age', field: 'age', filter: FilterType.NUMBER },
      { headerName: 'Eye color', field: 'eye_color' },
      { headerName: 'Company', field: 'company' },
      { headerName: 'Address', field: 'address', minWidth: 150 },
      { headerName: 'Country', field: 'country', cellRenderer: this.countryRenderer },
      { headerName: 'Email', field: 'email' },
      { headerName: 'Phone', field: 'phone', minWidth: 150 },
      { headerName: 'Ip-address', field: 'ip_address', minWidth: 150 },
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
        filterFramework: this.browserFilter
      }
    ];

    this.columnDefs3 = [
      {
        headerName: 'ID',
        field: 'id',
        sort: FuiDatagridSortDirections.ASC,
        cellRenderer: this.idRenderer,
        filter: FilterType.NUMBER
      },
      {
        headerName: 'Avatar',
        field: 'avatar',
        hide: true,
        filter: false,
        cellRenderer: this.avatarRenderer,
        sortable: false
      },
      { headerName: 'Username', field: 'username', minWidth: 150 },
      {
        headerName: 'Creation date',
        field: 'creation_date',
        minWidth: 150,
        sortType: FuiFieldTypes.DATE,
        filter: FilterType.DATE,
        filterParams: dateFilterParams
      },
      { headerName: 'Gender', field: 'gender' },
      { headerName: 'First name', field: 'first_name' },
      { headerName: 'Last name', field: 'last_name' },
      { headerName: 'Age', field: 'age', filter: FilterType.NUMBER }
    ];

    this.defaultColumnDefs = {
      sortable: true,
      filter: true
    };

    this.dataSource = ServerSideDatasource(this);
    this.dataSource2 = ServerSideDatasource2(this);
    this.dataSource3 = ServerSideDatasource3(this);

    function ServerSideDatasource(server: DatagridInfiniteServerSideComponent): IServerSideDatasource {
      return {
        getRows(params: IServerSideGetRowsParams): Promise<IDatagridResultObject> {
          return new Promise((resolve, reject) => {
            server.rowDataService.getRows(params, 500).subscribe(
              (results: IDatagridResultObject) => {
                const delay: number = server.networkBandwith;
                setTimeout(() => {
                  resolve(results);
                }, delay);
              },
              error => {
                reject(error);
              }
            );
          });
        }
      };
    }

    function ServerSideDatasource2(server: DatagridInfiniteServerSideComponent): IServerSideDatasource {
      return {
        getRows(params: IServerSideGetRowsParams): Promise<IDatagridResultObject> {
          return new Promise((resolve, reject) => {
            server.rowDataService.getRows(params, 500, false).subscribe(
              (results: IDatagridResultObject) => {
                const delay: number = server.networkBandwith;
                setTimeout(() => {
                  resolve(results);
                }, delay);
              },
              error => {
                reject(error);
              }
            );
          });
        }
      };
    }

    function ServerSideDatasource3(server: DatagridInfiniteServerSideComponent): IServerSideDatasource {
      return {
        getRows(params: IServerSideGetRowsParams): Promise<IDatagridResultObject> {
          return new Promise((resolve, reject) => {
            // We're faking an error that comes from the API.
            if (params.request.offset >= 20 && params.request.offset < 30) {
              reject('Unknown error occurs. Please contact your administrator.');
            } else {
              server.rowDataService.getRows(params, 500, false).subscribe(
                (results: IDatagridResultObject) => {
                  const delay: number = server.networkBandwith;
                  setTimeout(() => {
                    resolve(results);
                  }, delay);
                },
                error => {
                  reject(error);
                }
              );
            }
          });
        }
      };
    }
  }

  storeSelection() {
    this.storedSelectionList = this.datagrid1.getSelectedNodes();
  }

  resetToInitialSelection() {
    // HACK ::: DEMO PAGE ONLY ::: We ensure that the selected nodes are selected.
    // Because of javascript object mutation, the object list from 'this.storedSelectionList' will be mutated each time the
    // datagrid selection objects get mutated. To be sure that our selected nodes are selected, we force it.
    // This won't happen in a real world implementation.
    this.storedSelectionList.forEach(rowNode => rowNode.setSelected(true, false));
    this.initialSelectionListSub.next(this.storedSelectionList);
  }
}
