import { isArray } from 'util';

import { Component, OnInit } from '@angular/core';

import { DatagridUtils } from '../../../utils/datagrid-utils';
import { Comparator, FuiDatagridIFilter, IDoesFilterPassParams, IScalarFilterParams, NullComparator } from '../interfaces/filter';
import { FilterType } from '../interfaces/filter.enum';

import { FuiDatagridBaseFilter } from './base-filter';

export interface INumberFilterParams extends IScalarFilterParams {
  debounceMs?: number;
}

@Component({
  selector: 'fui-datagrid-number-filter',
  template: `
    <div class="row">
      <div class="col-3 fui-dg-filters-column-name" unselectable="on">
        {{ getColumnName() }}
      </div>
      <div [class.col-3]="isInRange()" [class.col-5]="!isInRange()">
        <fui-select-container>
          <label fuiLabel></label>
          <fui-select
            fuiSelect
            name="fuiDatagridNumberFilterType"
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
      <div [class.col-3]="isInRange()" [class.col-4]="!isInRange()">
        <fui-number-container>
          <label fuiLabel>{{ isInRange() ? translate('filterBetween') : translate('filterOoo') }}</label>
          <input
            [layout]="fuiFormLayoutEnum.SMALL"
            type="number"
            (ngModelChange)="onFilterInputChanged($event, 'search')"
            fuiNumber
            name="fuiDatagridNumberFilterSearch"
            [required]="isInRange()"
            [(ngModel)]="selectedSearch"
          />
        </fui-number-container>
      </div>
      <div class="col-3" *ngIf="isInRange()">
        <fui-number-container>
          <label fuiLabel>{{ translate('filterAnd') }}</label>
          <input
            [layout]="fuiFormLayoutEnum.SMALL"
            type="number"
            (ngModelChange)="onFilterInputChanged($event, 'searchTo')"
            fuiNumber
            name="fuiDatagridNumberFilterSearchTo"
            required
            [(ngModel)]="selectedSearchTo"
          />
        </fui-number-container>
      </div>
    </div>
  `,
  host: {
    class: 'fui-datagrid-number-filter container-fluid'
  }
})
export class FuiDatagridNumberFilterComponent extends FuiDatagridBaseFilter<INumberFilterParams> implements OnInit {
  static readonly DEFAULT_NULL_COMPARATOR: NullComparator = {
    equals: false,
    lessThan: false,
    greaterThan: false
  };

  selectedType: string;
  selectedSearch: string = '';
  selectedSearchTo: string = '';

  getApplicableFilterTypes(): string[] {
    return [
      FuiDatagridNumberFilterComponent.EQUALS,
      FuiDatagridNumberFilterComponent.NOT_EQUAL,
      FuiDatagridNumberFilterComponent.LESS_THAN,
      FuiDatagridNumberFilterComponent.LESS_THAN_OR_EQUAL,
      FuiDatagridNumberFilterComponent.GREATER_THAN,
      FuiDatagridNumberFilterComponent.GREATER_THAN_OR_EQUAL,
      FuiDatagridNumberFilterComponent.IN_RANGE
    ];
  }

  isInRange(): boolean {
    return this.selectedType === FuiDatagridNumberFilterComponent.IN_RANGE;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    const cellValue: any = params.data;
    const rawFilterValues: number[] | number = this.filterValues();
    const filterValue: number = Array.isArray(rawFilterValues) ? rawFilterValues[0] : rawFilterValues;

    const comparator: Comparator<number> = this.nullComparator(this.selectedType as string);
    const compareResult = comparator(filterValue, cellValue);

    switch (this.selectedType) {
      case FuiDatagridNumberFilterComponent.EMPTY:
        return false;
      case FuiDatagridNumberFilterComponent.EQUALS:
        return compareResult === 0;
      case FuiDatagridNumberFilterComponent.GREATER_THAN:
        return compareResult > 0;
      case FuiDatagridNumberFilterComponent.GREATER_THAN_OR_EQUAL:
        return compareResult >= 0;
      case FuiDatagridNumberFilterComponent.LESS_THAN_OR_EQUAL:
        return compareResult <= 0;
      case FuiDatagridNumberFilterComponent.LESS_THAN:
        return compareResult < 0;
      case FuiDatagridNumberFilterComponent.NOT_EQUAL:
        return compareResult !== 0;
      case FuiDatagridNumberFilterComponent.IN_RANGE:
        const compareToResult: number = comparator((rawFilterValues as number[])[1], cellValue);
        if (!this.filterParams.inRangeInclusive) {
          return compareResult > 0 && compareToResult < 0;
        } else {
          return compareResult >= 0 && compareToResult <= 0;
        }
      default:
        throw new Error('Unexpected type of filter: ' + this.selectedType);
    }
  }

  getFilterType(): FilterType {
    return FilterType.NUMBER;
  }

  getFilterOption(): string {
    return this.selectedType;
  }

  getFilterValue(): any {
    return this.filterValues();
  }

  filterValues(): number | number[] {
    return this.selectedType !== FuiDatagridNumberFilterComponent.IN_RANGE
      ? FuiDatagridNumberFilterComponent.asNumber(this.selectedSearch)
      : [
          FuiDatagridNumberFilterComponent.asNumber(this.selectedSearch),
          FuiDatagridNumberFilterComponent.asNumber(this.selectedSearchTo)
        ];
  }

  onFilterTypeChanged(value: string) {
    this.selectedType = value;
    this.onChange();
  }

  onFilterInputChanged(value: string, type: string) {
    if (type === 'search') {
      this.selectedSearch = value;
    } else {
      this.selectedSearchTo = value;
    }
    this.onChange();
  }

  onChange() {
    const condition: boolean = this.isInRange()
      ? this.selectedSearch !== '' && this.selectedSearchTo !== ''
      : this.selectedSearch !== '';

    const filter: FuiDatagridIFilter = {
      isFilterActive: () => this.isFilterActive(),
      setFilterActive: (value: boolean) => this.setFilterActive(value),
      doesFilterPass: (params: IDoesFilterPassParams) => this.doesFilterPass(params),
      addOrRemoveFilter: (cond: boolean, fil: FuiDatagridIFilter) => this.addOrRemoveFilter(cond, fil),
      getColumn: () => this.getColumn(),
      getFilterType: () => this.getFilterType(),
      getFilterOption: () => this.getFilterOption(),
      getFilterValue: () => this.getFilterValue(),
      getFilterParams: () => this.getFilterParams()
    };
    this.addOrRemoveFilter(condition, filter);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.selectedType = FuiDatagridNumberFilterComponent.getDefaultType();
    this.defaultFilter = this.selectedType;
    if (!this.filterParams.inRangeInclusive) {
      this.filterParams.inRangeInclusive = true;
    }
    if (!this.filterParams.suppressAndOrCondition) {
      this.filterParams.suppressAndOrCondition = false;
    }
    if (!this.filterParams.defaultOption) {
      this.filterParams.defaultOption = this.selectedType;
    }

    if (this.getFilterService()) {
      const filter: FuiDatagridIFilter = this.getFilterService().getFilterFor(this.column);
      if (filter) {
        if (isArray(filter.getFilterValue())) {
          this.selectedSearch = filter.getFilterValue()[0];
          this.selectedSearchTo = filter.getFilterValue()[1];
        } else {
          this.selectedSearch = filter.getFilterValue();
        }
        this.selectedType = filter.getFilterOption();
      }
    }
  }

  comparator(): Comparator<number> {
    return (left: number, right: number): number => {
      if (left === right) {
        return 0;
      }
      if (left < right) {
        return 1;
      }
      if (left > right) {
        return -1;
      }
    };
  }

  static getDefaultType(): string {
    return FuiDatagridNumberFilterComponent.EQUALS;
  }

  static asNumber(value: any): number {
    return DatagridUtils.isNumeric(value) ? value : null;
  }

  private translateNull(type: string): boolean {
    const reducedType: string =
      type.indexOf('greater') > -1 ? 'greaterThan' : type.indexOf('lessThan') > -1 ? 'lessThan' : 'equals';

    if (this.filterParams.nullComparator && (this.filterParams.nullComparator as NullComparator)[reducedType]) {
      return (this.filterParams.nullComparator as NullComparator)[reducedType];
    }

    return (FuiDatagridNumberFilterComponent.DEFAULT_NULL_COMPARATOR as NullComparator)[reducedType];
  }

  private nullComparator(type: string): Comparator<number> {
    return (filterValue: number, gridValue: number): number => {
      if (gridValue === null) {
        const nullValue = this.translateNull(type);
        switch (this.selectedType) {
          case FuiDatagridNumberFilterComponent.EMPTY:
            return 0;
          case FuiDatagridNumberFilterComponent.EQUALS:
            return nullValue ? 0 : 1;
          case FuiDatagridNumberFilterComponent.GREATER_THAN:
            return nullValue ? 1 : -1;
          case FuiDatagridNumberFilterComponent.GREATER_THAN_OR_EQUAL:
            return nullValue ? 1 : -1;
          case FuiDatagridNumberFilterComponent.LESS_THAN_OR_EQUAL:
            return nullValue ? -1 : 1;
          case FuiDatagridNumberFilterComponent.LESS_THAN:
            return nullValue ? -1 : 1;
          case FuiDatagridNumberFilterComponent.NOT_EQUAL:
            return nullValue ? 1 : 0;
          default:
            break;
        }
      }
      const actualComparator: Comparator<number> = this.comparator();
      return actualComparator(filterValue, gridValue);
    };
  }
}
