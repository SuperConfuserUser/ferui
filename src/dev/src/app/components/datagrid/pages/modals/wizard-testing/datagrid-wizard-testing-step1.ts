import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';

import {
  FUI_MODAL_WINDOW_CTRL_TOKEN,
  FilterType,
  FuiColumnDefinitions,
  FuiDatagridComponent,
  FuiDatagridSortDirections,
  FuiFieldTypes,
  FuiModalWizardWindowCtrl,
  FuiModalWizardWindowScreen,
  FuiRowSelectionEnum,
  IDateFilterParams,
  RowNode
} from '@ferui/components';

import { IDatagridRowData } from '../../../server-side-api/datagrid-row.service';
import { WizardSelectedNodes } from '../modals-interfaces';

@Component({
  template: `
    <h4>Modal wizard step 1</h4>
    <p>Testing the datagrid selection feature.</p>
    <fui-datagrid
      #datagrid
      [withFooterItemPerPage]="false"
      [initialSelectedRows]="initialSelectionList"
      [checkboxSelection]="true"
      [rowSelection]="rowSelectionEnum.MULTIPLE"
      [fixedHeight]="true"
      [maxDisplayedRows]="itemPerPage"
      [defaultColDefs]="defaultColumnDefs"
      [columnDefs]="columnDefs"
      [rowData]="rowData"
    >
    </fui-datagrid>
  `
})
export class DatagridModalWizardStep1Component implements FuiModalWizardWindowScreen, OnInit {
  rowData: any[];
  columnDefs: Array<FuiColumnDefinitions>;
  defaultColumnDefs: FuiColumnDefinitions;
  initialSelectionList: RowNode[];
  itemPerPage: number = 10;
  rowSelectionEnum: typeof FuiRowSelectionEnum = FuiRowSelectionEnum;

  @ViewChild('datagrid') datagrid: FuiDatagridComponent;

  constructor(
    @Inject(FUI_MODAL_WINDOW_CTRL_TOKEN) public windowCtrl: FuiModalWizardWindowCtrl,
    @Inject(HttpClient) private http: HttpClient
  ) {}

  ngOnInit(): void {
    const dateFilterParams: IDateFilterParams = {
      dateFormat: 'yyyy-mm-dd'
    };

    this.columnDefs = [
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
      { headerName: 'Address', field: 'address', minWidth: 200 },
      { headerName: 'Email', field: 'email' },
      { headerName: 'Phone', field: 'phone', minWidth: 200 },
      { headerName: 'Ip-address', field: 'ip_address', minWidth: 200 },
      { headerName: 'Active ?', field: 'is_active', filter: FilterType.BOOLEAN },
      { headerName: 'Registered ?', field: 'is_registered', filter: FilterType.BOOLEAN },
      { headerName: 'Favourite animal', field: 'favourite_animal', minWidth: 150 },
      { headerName: 'Favorite movie', field: 'favorite_movie', minWidth: 200 }
    ];

    this.defaultColumnDefs = {
      sortable: true,
      filter: true
    };

    this.http.get(document.baseURI + '/datagrid-10k-data.min.json').subscribe((results: IDatagridRowData[]) => {
      setTimeout(() => {
        this.rowData = results;
      }, 1000);
    });
  }

  $onInit(args?: WizardSelectedNodes): Promise<unknown> {
    if (args && args.selectedNodes && args.selectedNodes.length > 0) {
      this.initialSelectionList = args.selectedNodes;
    } else {
      this.initialSelectionList = [];
    }
    return Promise.resolve();
  }

  $onNext(): Promise<WizardSelectedNodes> {
    const selectedNodes: RowNode[] = this.datagrid.getSelectedNodes();
    if (selectedNodes.length === 0) {
      return Promise.reject('Please select at least one row.');
    } else {
      this.windowCtrl.error = null;
    }
    return Promise.resolve({ selectedNodes: selectedNodes });
  }
}
