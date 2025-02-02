import { Component, OnInit } from '@angular/core';

import { FuiDatagridIFilter, IComparableFilterParams, IDoesFilterPassParams } from '../interfaces/filter';
import { FilterType } from '../interfaces/filter.enum';

import { FuiDatagridBaseFilter } from './base-filter';

export interface TextFormatter {
  (from: string): string;
}

export interface TextComparator {
  (filter: string, gridValue: any, filterText: string): boolean;
}

export interface ITextFilterParams extends IComparableFilterParams {
  textCustomComparator?: TextComparator;
  debounceMs?: number;
  caseSensitive?: boolean;
}

export function DEFAULT_TEXT_FORMATTER(from: string): string {
  return from;
}

export function DEFAULT_TEXT_LOWERCASE_FORMATTER(from: string): string {
  if (!from) {
    return null;
  }
  return from.toString().toLowerCase();
}

export function DEFAULT_TEXT_COMPARATOR(filter: string, value: any, filterText: string): boolean {
  switch (filter) {
    case FuiDatagridTextFilterComponent.CONTAINS:
      return value.indexOf(filterText) >= 0;
    case FuiDatagridTextFilterComponent.NOT_CONTAINS:
      return value.indexOf(filterText) === -1;
    case FuiDatagridTextFilterComponent.EQUALS:
      return value === filterText;
    case FuiDatagridTextFilterComponent.NOT_EQUAL:
      return value !== filterText;
    case FuiDatagridTextFilterComponent.STARTS_WITH:
      return value.indexOf(filterText) === 0;
    case FuiDatagridTextFilterComponent.ENDS_WITH:
      const index = value.lastIndexOf(filterText);
      return index >= 0 && index === value.length - filterText.length;
    default:
      // should never happen
      console.warn('invalid filter type ' + filter);
      return false;
  }
}

@Component({
  selector: 'fui-datagrid-text-filter',
  template: `
    <div class="row">
      <div class="col-3 fui-dg-filters-column-name" unselectable="on">
        {{ getColumnName() }}
      </div>
      <div class="col-5">
        <fui-select-container>
          <label fuiLabel></label>
          <fui-select
            fuiSelect
            name="fuiDatagridTextFilterType"
            appendTo=".fui-datagrid-filters-popover"
            [layout]="fuiFormLayoutEnum.SMALL"
            [clearable]="false"
            (ngModelChange)="onFilterTypeChanged($event)"
            [(ngModel)]="selectedType"
          >
            <ng-option *ngFor="let type of getApplicableFilterTypes()" [value]="type">{{ translate(type) }}</ng-option>
          </fui-select>
        </fui-select-container>
      </div>
      <div class="col-4">
        <fui-input-container>
          <label fuiLabel>{{ translate('filterOoo') }}</label>
          <input
            [layout]="fuiFormLayoutEnum.SMALL"
            type="text"
            (ngModelChange)="onFilterInputChanged($event)"
            fuiInput
            name="fuiDatagridTextFilterSearch"
            [(ngModel)]="selectedSearch"
          />
        </fui-input-container>
      </div>
    </div>
  `,
  host: {
    class: 'fui-datagrid-text-filter container-fluid'
  }
})
export class FuiDatagridTextFilterComponent extends FuiDatagridBaseFilter<ITextFilterParams> implements OnInit {
  static DEFAULT_FORMATTER: TextFormatter = DEFAULT_TEXT_FORMATTER;
  static DEFAULT_LOWERCASE_FORMATTER: TextFormatter = DEFAULT_TEXT_LOWERCASE_FORMATTER;
  static DEFAULT_COMPARATOR: TextComparator = DEFAULT_TEXT_COMPARATOR;

  selectedType: string;
  selectedSearch: string = '';

  private comparator: TextComparator;
  private formatter: TextFormatter;

  getApplicableFilterTypes(): string[] {
    return [
      FuiDatagridTextFilterComponent.EQUALS,
      FuiDatagridTextFilterComponent.NOT_EQUAL,
      FuiDatagridTextFilterComponent.STARTS_WITH,
      FuiDatagridTextFilterComponent.ENDS_WITH,
      FuiDatagridTextFilterComponent.CONTAINS,
      FuiDatagridTextFilterComponent.NOT_CONTAINS
    ];
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    return this.comparator(this.selectedType, this.formatter(params.data), this.formatter(this.selectedSearch));
  }

  getFilterType(): FilterType {
    return FilterType.STRING;
  }

  getFilterOption(): string {
    return this.selectedType;
  }

  getFilterValue(): any {
    return this.selectedSearch;
  }

  onFilterTypeChanged(value: string) {
    this.selectedType = value;
    this.onChange();
  }

  onFilterInputChanged(value: string) {
    this.selectedSearch = value;
    this.onChange();
  }

  onChange() {
    const filter: FuiDatagridIFilter = {
      isFilterActive: () => this.isFilterActive(),
      setFilterActive: (value: boolean) => this.setFilterActive(value),
      doesFilterPass: (params: IDoesFilterPassParams) => this.doesFilterPass(params),
      addOrRemoveFilter: (condition: boolean, fil: FuiDatagridIFilter) => this.addOrRemoveFilter(condition, fil),
      getColumn: () => this.getColumn(),
      getFilterType: () => this.getFilterType(),
      getFilterOption: () => this.getFilterOption(),
      getFilterValue: () => this.getFilterValue(),
      getFilterParams: () => this.getFilterParams()
    };
    this.addOrRemoveFilter(this.selectedSearch !== '', filter);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.selectedType = FuiDatagridTextFilterComponent.getDefaultType();

    if (this.getFilterService()) {
      const filter: FuiDatagridIFilter = this.getFilterService().getFilterFor(this.column);
      if (filter) {
        this.selectedSearch = filter.getFilterValue();
        this.selectedType = filter.getFilterOption();
      }
    }

    this.defaultFilter = this.selectedType;
    if (!this.filterParams.caseSensitive) {
      this.filterParams.caseSensitive = false;
    }
    if (!this.filterParams.suppressAndOrCondition) {
      this.filterParams.suppressAndOrCondition = false;
    }
    if (!this.filterParams.defaultOption) {
      this.filterParams.defaultOption = FuiDatagridTextFilterComponent.getDefaultType();
    }
    super.init();
    this.comparator = this.filterParams.textCustomComparator
      ? this.filterParams.textCustomComparator
      : FuiDatagridTextFilterComponent.DEFAULT_COMPARATOR;
    this.formatter = this.filterParams.textFormatter
      ? this.filterParams.textFormatter
      : this.filterParams.caseSensitive === true
      ? FuiDatagridTextFilterComponent.DEFAULT_FORMATTER
      : FuiDatagridTextFilterComponent.DEFAULT_LOWERCASE_FORMATTER;
  }

  static getDefaultType(): string {
    return FuiDatagridTextFilterComponent.EQUALS;
  }
}
