import { Component, Inject, OnInit } from '@angular/core';

import {
  CsvExportParams,
  FUI_MODAL_CTRL_TOKEN,
  FUI_MODAL_WINDOW_CTRL_TOKEN,
  FuiColumnDefinitions,
  FuiModalCtrl,
  FuiModalStandardWindowCtrl,
  FuiModalStandardWindowScreen,
  FuiRowSelectionEnum
} from '@ferui/components';

@Component({
  template: `
    <h4>Synchronous data in Modal</h4>
    <fui-datagrid
      [checkboxSelection]="true"
      [rowSelection]="rowSelectionEnum.MULTIPLE"
      [withHeader]="true"
      [withFooter]="true"
      [exportParams]="exportParams2"
      [maxDisplayedRows]="itemPerPageSynchronous"
      [defaultColDefs]="defaultColumnDefs"
      [columnDefs]="columnDefsSynchronous"
      [rowData]="synchronousRowData"
    >
    </fui-datagrid>
  `
})
export class DatagridModalTestingComponent implements OnInit, FuiModalStandardWindowScreen {
  params: string;
  resolves: string;
  synchronousRowData: Array<any>;
  columnDefsSynchronous: Array<FuiColumnDefinitions>;
  defaultColumnDefs: FuiColumnDefinitions;
  exportParams2: CsvExportParams = {
    fileName: 'ferUI-export-test-modal-2'
  };
  itemPerPageSynchronous: number = 5;
  rowSelectionEnum: typeof FuiRowSelectionEnum = FuiRowSelectionEnum;

  constructor(
    @Inject(FUI_MODAL_CTRL_TOKEN) public modalCtrl: FuiModalCtrl,
    @Inject(FUI_MODAL_WINDOW_CTRL_TOKEN) public windowCtrl: FuiModalStandardWindowCtrl
  ) {}

  $onInit(): Promise<void> {
    // Lets be wild and update the window title dynamically.
    this.windowCtrl.title = 'My super wild title!';
    return Promise.resolve();
  }

  ngOnInit(): void {
    // You can use either modalCtrl and windowCtrl now.
    this.params = JSON.stringify(this.modalCtrl.params);
    this.resolves = JSON.stringify(this.modalCtrl.resolves);

    this.columnDefsSynchronous = [
      { headerName: 'GUID', field: 'id' },
      { headerName: 'Name', field: 'name' },
      { headerName: 'Email', field: 'email' },
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
      filter: true
    };
  }
}
