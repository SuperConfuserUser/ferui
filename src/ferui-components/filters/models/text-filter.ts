import { Component } from '@angular/core';

import { FeruiUtils } from '../../utils/ferui-utils';
import { FuiI18nService } from '../../utils/i18n/fui-i18n.service';
import {
  FuiComparableFilterInterface,
  FuiFilterComponentInterface,
  FuiFilterOptionDefInterface,
  FuiTextFilterParamsInterface
} from '../interfaces/filter';
import { FuiFilterOptionsEnum } from '../interfaces/filter-options.enum';
import { FuiFilterEnum } from '../interfaces/filter.enum';
import { FuiFilterService } from '../providers/filter.service';

import { FuiComparableFilter } from './abstracts/abstract-comparable-filter';

@Component({
  selector: 'fui-text-filter',
  template: `
    <div class="row">
      <div class="col-3 fui-filters-name" unselectable="on">
        {{ getFilterName() }}
      </div>
      <div class="col-5">
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
      <div class="col-4">
        <fui-input-container>
          <label fuiLabel>{{ translate('filterOoo') }}</label>
          <input
            [disabled]="getFilterService()?.isDisabled$() | async"
            [layout]="fuiFormLayoutEnum.SMALL"
            type="text"
            (ngModelChange)="onFilterInputChanged($event)"
            fuiInput
            [name]="filterDefaultName"
            [(ngModel)]="selectedSearch"
          />
        </fui-input-container>
      </div>
    </div>
  `,
  host: {
    '[class.fui-text-filter]': 'true',
    '[class.container-fluid]': 'true',
    '[id]': 'filterViewId'
  }
})
export class FuiTextFilterComponent<
    T extends string,
    P extends FuiTextFilterParamsInterface,
    F extends FuiComparableFilterInterface<T, P>
  >
  extends FuiComparableFilter<T, P, F>
  implements FuiFilterComponentInterface<T, P, F>, FuiComparableFilterInterface<T, P> {
  filterOptionsDefaultName: string = FeruiUtils.generateUniqueId('fui-filter-text-option');
  filterDefaultName: string = FeruiUtils.generateUniqueId('fui-filter-text');

  constructor(protected filterService: FuiFilterService, protected fuiI18nService: FuiI18nService) {
    super();
  }

  /**
   * Get filter type. Here we force the STRING type.
   */
  getFilterType(): FuiFilterEnum {
    return FuiFilterEnum.STRING;
  }

  /**
   * Get the filter value.
   */
  getFilterValue(): T {
    return this.selectedSearch;
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
   */
  onFilterInputChanged(value: T) {
    this.selectedSearch = value;
    this.onChange();
  }

  /**
   * Everytime we update the models (option or selected search) we add or remove the filter from
   * the selectedFilter list of the filterService.
   * @private
   */
  private onChange() {
    this.addOrRemoveFilter(this.selectedSearch !== '', this.getFilterInstance() as F);
    this.filterChange.emit(this.getFilterInstance() as F);
  }
}
