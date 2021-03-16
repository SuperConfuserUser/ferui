import { Component, OnInit } from '@angular/core';

import { DatagridUtils } from '../../datagrid/utils/datagrid-utils';
import { FeruiUtils } from '../../utils/ferui-utils';
import { FuiI18nService } from '../../utils/i18n/fui-i18n.service';
import {
  FuiDateFilterParamsInterface,
  FuiFilterComponentInterface,
  FuiFilterOptionDefInterface,
  FuiScalarFilterInterface
} from '../interfaces/filter';
import { FuiFilterOptionsEnum } from '../interfaces/filter-options.enum';
import { FuiFilterEnum } from '../interfaces/filter.enum';
import { FuiFilterService } from '../providers/filter.service';

import { FuiScalarFilter } from './abstracts/abstract-scalar-filter';

@Component({
  selector: 'fui-number-filter',
  template: `
    <div class="row">
      <div class="col-3 fui-filters-name" unselectable="on">
        {{ getFilterName() }}
      </div>
      <div [class.col-3]="isInRange()" [class.col-5]="!isInRange()">
        <fui-select-container>
          <label fuiLabel></label>
          <fui-select
            fuiSelect
            [disabled]="getFilterService()?.isDisabled$() | async"
            [name]="filterOptionsDefaultName"
            [appendTo]="appendTo"
            [layout]="fuiFormLayoutEnum.SMALL"
            [clearable]="false"
            (ngModelChange)="onFilterOptionChanged($event)"
            [(ngModel)]="selectedOption"
          >
            <ng-option
              *ngFor="let option of getApplicableFilterOptions()"
              [value]="option.displayKey ? option.displayKey : option"
              >{{ translate(option.displayName ? option.displayName : option) }}</ng-option
            >
          </fui-select>
        </fui-select-container>
      </div>
      <div [class.col-3]="isInRange()" [class.col-4]="!isInRange()">
        <fui-number-container>
          <label fuiLabel>{{ isInRange() ? translate('filterBetween') : translate('filterOoo') }}</label>
          <input
            fuiNumber
            [disabled]="getFilterService()?.isDisabled$() | async"
            [layout]="fuiFormLayoutEnum.SMALL"
            type="number"
            (ngModelChange)="onFilterInputChanged($event, 'search')"
            [name]="filterDefaultName"
            [required]="isInRange()"
            [(ngModel)]="selectedSearch"
          />
        </fui-number-container>
      </div>
      <div class="col-3" *ngIf="isInRange()">
        <fui-number-container>
          <label fuiLabel>{{ translate('filterAnd') }}</label>
          <input
            fuiNumber
            [layout]="fuiFormLayoutEnum.SMALL"
            type="number"
            [disabled]="getFilterService()?.isDisabled$() | async"
            (ngModelChange)="onFilterInputChanged($event, 'searchTo')"
            [name]="filterToDefaultName"
            [(ngModel)]="selectedSearchTo"
            [greaterThan]="selectedSearch"
            required
          />
        </fui-number-container>
      </div>
    </div>
  `,
  host: {
    '[class.fui-number-filter]': 'true',
    '[class.container-fluid]': 'true',
    '[id]': 'filterViewId'
  }
})
export class FuiNumberFilterComponent<
    T extends number,
    P extends FuiDateFilterParamsInterface<T>,
    F extends FuiScalarFilterInterface<T, P>
  >
  extends FuiScalarFilter<T, P, F>
  implements FuiFilterComponentInterface<T, P, F>, FuiScalarFilterInterface<T, P>, OnInit {
  filterOptionsDefaultName: string = FeruiUtils.generateUniqueId('fui-filter-number-option');
  filterDefaultName: string = FeruiUtils.generateUniqueId('fui-filter-number');
  filterToDefaultName: string = FeruiUtils.generateUniqueId('fui-filter-to-number');

  constructor(protected filterService: FuiFilterService, protected fuiI18nService: FuiI18nService) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  /**
   * Get filter type. Here we force it to NUMBER.
   */
  getFilterType(): FuiFilterEnum {
    return FuiFilterEnum.NUMBER;
  }

  /**
   * Get filter value. Here the value can be either a number or an array of number if we select the Range option.
   */
  getFilterValue(): T | T[] {
    if (FeruiUtils.isNullOrUndefined(this.selectedSearch)) {
      return null;
    }
    // We force the values to be numbers.
    return this.selectedOption !== FuiFilterOptionsEnum.IN_RANGE
      ? this.asNumber(this.selectedSearch)
      : [this.asNumber(this.selectedSearch), this.asNumber(this.selectedSearchTo)];
  }

  /**
   * Everytime we update the option we need to update the filterService filter list.
   * @param value
   */
  onFilterOptionChanged(value: FuiFilterOptionDefInterface | FuiFilterOptionsEnum) {
    this.selectedOption = value;
    this.onChange();
  }

  /**
   * We update the models and save/update/delete the filter from filter service.
   * @param value
   * @param type
   */
  onFilterInputChanged(value: T, type: string) {
    if (type === 'search') {
      this.selectedSearch = value;
    } else {
      this.selectedSearchTo = value;
    }
    this.onChange();
  }

  /**
   * Everytime we update the models (option or selected search) we add/update or remove the filter from
   * the selectedFilter list of the filterService.
   * @private
   */
  private onChange() {
    const condition: boolean = this.isInRange()
      ? !FeruiUtils.isNullOrUndefined(this.selectedSearch) && !FeruiUtils.isNullOrUndefined(this.selectedSearchTo)
      : !FeruiUtils.isNullOrUndefined(this.selectedSearch);
    this.addOrRemoveFilter(condition, this.getFilterInstance() as F);
    this.filterChange.emit(this.getFilterInstance() as F);
  }

  /**
   * Unsure that we have a number.
   * @param value
   * @private
   */
  private asNumber(value: any): T | null {
    return DatagridUtils.isNumeric(value) ? value : null;
  }
}
