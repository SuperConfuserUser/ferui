import { Subscription } from 'rxjs';

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { DATAGRID_GLOBAL_SEARCH_ID, FuiDatagridFilterService } from '../../../services/datagrid-filter.service';
import { DatagridStateService } from '../../../services/datagrid-state.service';
import { Column } from '../../entities/column';
import { RowModel } from '../../row-models/row-model';
import {
  FuiDatagridActiveGlobalFilter,
  FuiDatagridIGlobalSearchFilter,
  IDoesGlobalFilterPassParams,
  IGlobalFilterParams
} from '../interfaces/filter';
import { FilterType } from '../interfaces/filter.enum';

import { FuiDatagridBaseFilter } from './base-filter';
import { FuiDatagridTextFilterComponent, TextComparator, TextFormatter } from './text-filter';

@Component({
  selector: 'fui-datagrid-global-search-filter',
  template: `
    <input
      placeholder="Global search"
      type="search"
      name="datagridSearch"
      [(ngModel)]="selectedSearch"
      (ngModelChange)="onFilterInputChanged($event)"
    />
    <clr-icon class="fui-datagrid-search-icon" shape="fui-search"></clr-icon>
    <clr-icon
      class="fui-datagrid-clear-search-icon"
      *ngIf="selectedSearch"
      (click)="clearFilter()"
      shape="fui-clear-field"
    ></clr-icon>
  `,
  host: {
    class: 'fui-datagrid-filters-search'
  }
})
export class FuiDatagridGlobalSearchFilterComponent implements FuiDatagridIGlobalSearchFilter, OnInit, OnDestroy {
  @Output() readonly searchChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() columns: Column[];
  @Input() filterParams: IGlobalFilterParams;

  selectedSearch: string = null;

  protected defaultParams: IGlobalFilterParams = {
    columns: this.getColumns(),
    rowData: null
  };
  protected _isActive: boolean;

  private onFilterChangeBebounce: NodeJS.Timer;
  private subscriptions: Subscription[] = [];
  private selectedType: string;
  private comparator: TextComparator;
  private formatter: TextFormatter;

  constructor(
    private filterService: FuiDatagridFilterService,
    private rowModel: RowModel,
    private stateService: DatagridStateService
  ) {
    this.subscriptions.push(
      this.filterService.filtersSub().subscribe(filters => {
        const globalFilter: FuiDatagridActiveGlobalFilter = filters.find(
          filter => filter && filter.index === DATAGRID_GLOBAL_SEARCH_ID
        ) as FuiDatagridActiveGlobalFilter;
        if (!globalFilter && this.selectedSearch) {
          this.clearFilter();
        }
      })
    );
  }

  doesFilterPass(params: IDoesGlobalFilterPassParams): boolean {
    const rowData: any = params.rowData;
    let pass: boolean = false;
    if (this.getColumns().length > 0 && rowData) {
      this.getColumns().forEach(column => {
        if (this.formatter(rowData[column.getColId()]) !== null) {
          const filterPass: boolean = this.comparator(
            this.selectedType,
            this.formatter(rowData[column.getColId()]),
            this.formatter(this.selectedSearch)
          );
          if (filterPass === true) {
            pass = true;
          }
        }
      });
    }
    return pass;
  }

  getFilterType(): FilterType {
    return FilterType.GLOBAL_SEARCH;
  }

  setFilterActive(value: boolean): void {
    this._isActive = value;
  }

  //This is used to let the grid know if the filter is active or not
  isFilterActive(): boolean {
    return this._isActive;
  }

  getColumns(): Column[] {
    return this.columns;
  }

  getColumn(): Column {
    return this.columns[0];
  }

  getFilterOption(): string {
    return this.selectedType;
  }

  getFilterValue(): string {
    return this.selectedSearch;
  }

  getFilterParams(): IGlobalFilterParams {
    return this.filterParams;
  }

  clearFilter() {
    if (!this.rowModel.isClientSideRowModel()) {
      this.stateService.setLoading();
      this.stateService.setRefreshing();
    }
    this.onFilterInputChanged('');
  }

  // This method should be called every-time the user do a change with the filter.
  // This will update the saved filter or remove it if the user remove the filter.
  addOrRemoveFilter(condition: boolean, filter: FuiDatagridIGlobalSearchFilter): void {
    if (this.filterService) {
      if (condition) {
        filter.setFilterActive(true);
        this.filterService.addGlobalSearchFilter(filter);
      } else {
        filter.setFilterActive(false);
        this.filterService.removeGlobalSearchFilter();
      }
    }
  }

  ngOnInit(): void {
    this.selectedType = FuiDatagridBaseFilter.CONTAINS;
    if (!this.filterParams) {
      this.filterParams = this.defaultParams;
    }
    if (!this.filterParams.caseSensitive) {
      this.filterParams.caseSensitive = false;
    }
    if (!this.filterParams.defaultOption) {
      this.filterParams.defaultOption = this.selectedType;
    } else {
      this.selectedType = this.filterParams.defaultOption;
    }

    this.comparator = this.filterParams.textCustomComparator
      ? this.filterParams.textCustomComparator
      : FuiDatagridTextFilterComponent.DEFAULT_COMPARATOR;
    this.formatter = this.filterParams.textFormatter
      ? this.filterParams.textFormatter
      : this.filterParams.caseSensitive === true
      ? FuiDatagridTextFilterComponent.DEFAULT_FORMATTER
      : FuiDatagridTextFilterComponent.DEFAULT_LOWERCASE_FORMATTER;
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions = undefined;
    }
  }

  onFilterInputChanged(value: string) {
    if (this.onFilterChangeBebounce) {
      clearTimeout(this.onFilterChangeBebounce);
    }
    if (!this.rowModel.isClientSideRowModel()) {
      this.stateService.setRefreshing();
      this.stateService.setLoading();
    }
    this.selectedSearch = value;
    this.onFilterChangeBebounce = setTimeout(() => {
      const filter: FuiDatagridIGlobalSearchFilter = {
        getColumn: () => this.getColumn(),
        getFilterType: () => this.getFilterType(),
        getFilterOption: () => this.getFilterOption(),
        getFilterValue: () => this.getFilterValue(),
        getFilterParams: () => this.getFilterParams(),
        isFilterActive: () => this.isFilterActive(),
        setFilterActive: (val: boolean) => this.setFilterActive(val),
        doesFilterPass: (params: IDoesGlobalFilterPassParams) => this.doesFilterPass(params),
        addOrRemoveFilter: (condition: boolean, fil: FuiDatagridIGlobalSearchFilter) => this.addOrRemoveFilter(condition, fil),
        getColumns: () => this.getColumns()
      };
      this.addOrRemoveFilter(this.selectedSearch !== '', filter);
      this.searchChange.emit(value);
    }, 200);
  }
}
