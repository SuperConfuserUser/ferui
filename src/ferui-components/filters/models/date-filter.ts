import { Component, OnInit } from '@angular/core';

import { FuiDatetimeModelTypes } from '../../forms/common/datetime-model-types.enum';
import { FeruiUtils } from '../../utils/ferui-utils';
import { FuiI18nService } from '../../utils/i18n/fui-i18n.service';
import { FuiDateFilterParamsInterface, FuiFilterComponentInterface, FuiScalarFilterInterface } from '../interfaces/filter';
import { FuiFilterOptionsEnum } from '../interfaces/filter-options.enum';
import { FuiFilterEnum } from '../interfaces/filter.enum';
import { FuiFilterService } from '../providers/filter.service';

import { FuiScalarFilter } from './abstracts/abstract-scalar-filter';

@Component({
  selector: 'fui-date-filter',
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
        <fui-date-container [appendTo]="appendTo">
          <label fuiLabel>{{ isInRange() ? translate('filterBetween') : translate('filterOoo') }}</label>
          <input
            [disabled]="getFilterService()?.isDisabled$() | async"
            [layout]="fuiFormLayoutEnum.SMALL"
            [name]="filterDefaultName"
            [fuiDate]="modelTypeDate"
            (ngModelChange)="onFilterInputChanged($event, 'search')"
            [(ngModel)]="selectedSearch"
            [required]="isInRange()"
          />
        </fui-date-container>
      </div>
      <div class="col-3" *ngIf="isInRange()">
        <fui-date-container [appendTo]="appendTo">
          <label fuiLabel>{{ translate('filterAnd') }}</label>
          <input
            [disabled]="getFilterService()?.isDisabled$() | async"
            [layout]="fuiFormLayoutEnum.SMALL"
            [name]="filterToDefaultName"
            [fuiDate]="modelTypeDate"
            (ngModelChange)="onFilterInputChanged($event, 'searchTo')"
            [(ngModel)]="selectedSearchTo"
            required
            [greaterThan]="selectedSearch"
          />
        </fui-date-container>
      </div>
    </div>
  `,
  host: {
    '[class.fui-date-filter]': 'true',
    '[class.container-fluid]': 'true',
    '[id]': 'filterViewId'
  }
})
export class FuiDateFilterComponent<
    T extends Date,
    P extends FuiDateFilterParamsInterface<T>,
    F extends FuiScalarFilterInterface<T, P>
  >
  extends FuiScalarFilter<T, P, F>
  implements FuiFilterComponentInterface<T, P, F>, FuiScalarFilterInterface<T, P>, OnInit {
  modelTypeDate = FuiDatetimeModelTypes.DATE;

  filterOptionsDefaultName: string = FeruiUtils.generateUniqueId('fui-filter-date-option');
  filterDefaultName: string = FeruiUtils.generateUniqueId('fui-filter-date');
  filterToDefaultName: string = FeruiUtils.generateUniqueId('fui-filter-to-date');

  constructor(protected filterService: FuiFilterService, protected fuiI18nService: FuiI18nService) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  /**
   * Get filter type. Here we force the DATE type.
   */
  getFilterType(): FuiFilterEnum {
    return FuiFilterEnum.DATE;
  }

  /**
   * Everytime we update the option we need to update the filterService filter list.
   * @param value
   */
  onFilterOptionChanged(value: FuiFilterOptionsEnum) {
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
      this.selectedSearch = this.cleanDate(value);
    } else {
      this.selectedSearchTo = this.cleanDate(value);
    }
    this.onChange();
  }

  /**
   * Everytime we update the models (option or selected search) we add or remove the filter from
   * the selectedFilter list of the filterService.
   * @private
   */
  private onChange() {
    const condition: boolean = this.isInRange() ? !!this.selectedSearch && !!this.selectedSearchTo : !!this.selectedSearch;
    this.addOrRemoveFilter(condition, this.getFilterInstance() as F);
    this.filterChange.emit(this.getFilterInstance() as F);
  }

  /**
   * We insure that the time part of the Date object is set to 0 for both filter value and cell value.
   * @param value
   * @private
   */
  private cleanDate(value?: T): T | null {
    if (!value) {
      return null;
    }
    value.setHours(0);
    value.setMinutes(0);
    value.setSeconds(0);
    value.setMilliseconds(0);
    return value;
  }
}
