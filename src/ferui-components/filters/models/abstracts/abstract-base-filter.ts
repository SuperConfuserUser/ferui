import { isFunction } from 'util';

import { Subscription } from 'rxjs';

import { EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { DatagridUtils } from '../../../datagrid/utils/datagrid-utils';
import { FuiFormLayoutEnum } from '../../../forms/common/layout.enum';
import { FeruiUtils } from '../../../utils/ferui-utils';
import { FuiI18nStrings } from '../../../utils/i18n/fui-i18n-interface';
import { FuiI18nService } from '../../../utils/i18n/fui-i18n.service';
import {
  FuiFilterComponentInterface,
  FuiFilterFieldInterface,
  FuiFilterInterface,
  FuiFilterOptionDefInterface,
  FuiFilterParamsInterface,
  FuiFilterVo
} from '../../interfaces/filter';
import { FuiFilterOptionsEnum } from '../../interfaces/filter-options.enum';
import { FuiFilterEnum } from '../../interfaces/filter.enum';
import { FuiFilterService } from '../../providers/filter.service';
import { FuiFilterIdGenerator } from '../../utils/filter-id-generator';

/**
 * Fui base filter.
 */
export abstract class FuiBaseFilter<T, P extends FuiFilterParamsInterface<T>, F extends FuiFilterInterface<T, P>>
  implements FuiFilterComponentInterface<T, P, F>, FuiFilterInterface<T, P>, OnInit, OnDestroy {
  @Output() readonly filterChange: EventEmitter<F> = new EventEmitter<F>();

  filterIdPrefix: string = FuiFilterIdGenerator.getFilterPrefix(this.getFilterType());
  fuiFormLayoutEnum: typeof FuiFormLayoutEnum = FuiFormLayoutEnum;
  filterViewId: string = FuiFilterIdGenerator.generateFilterId(this.getFilterType());
  selectedSearch: T | null = null;

  // @ts-ignore
  @Input() filterParams: P = {};
  @Input() filterField: FuiFilterFieldInterface<T, P>;
  @Input() filterId: string = this.filterViewId;
  @Input() appendTo: string = '#' + this.filterViewId;

  protected abstract filterService: FuiFilterService;
  protected abstract fuiI18nService: FuiI18nService;

  protected defaultFilterOption: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null;
  protected _isActive: boolean;
  protected initialFilterVoCache: FuiFilterVo<T, P> = null;
  protected subscriptions: Subscription[] = [];

  ngOnInit(): void {
    if (this.filterField && !FeruiUtils.isNullOrUndefined(this.filterField.key)) {
      this.filterId = this.filterIdPrefix + this.filterField.key;
    }
    this.filterParams = DatagridUtils.mergeObjects(
      { filterDisplayedName: this.fuiI18nService.keys.displayedFilterName },
      this.filterParams
    ) as P;
    this.setInitialValues();
    this.addCancelWatcher();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Get filter selected option
   */
  abstract getFilterOption(): FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null;

  /**
   * Get filter value.
   */
  abstract getFilterValue(): T | T[] | null;

  setFilterActive(value: boolean): void {
    this._isActive = value;
  }

  /**
   * Whether or not the filter is active.
   * This is used to let the filter component knows if the filter should be displayed as active or not.
   */
  isFilterActive(): boolean {
    return this._isActive;
  }

  /**
   * Get the filter type.
   * By default the filter is set to custom that way, when we create custom filter we don't need to bother with this function.
   */
  getFilterType(): FuiFilterEnum {
    return FuiFilterEnum.CUSTOM;
  }

  /**
   * Get filter params.
   */
  getFilterParams(): P {
    return this.filterParams;
  }

  /**
   * Get filter name. The name is displayed within the popover list when you select the filter. It can be override though config.
   */
  getFilterName(): string {
    return this.filterParams.filterLabel || this.filterField.label || 'Filter';
  }

  /**
   * Add or remove a filter within the filter service.
   * This method should be called every-time the user do a change with the filter.
   * This will update the saved filter or remove it if the user remove the filter.
   * @param condition
   * @param filter
   */
  addOrRemoveFilter(condition: boolean, filter: F): void {
    if (this.getFilterService()) {
      if (condition) {
        this.getFilterService().addFilter<T, P, F>(filter);
      } else {
        this.getFilterService().removeFilter<T, P, F>(filter);
      }
    }
  }

  /**
   * Use default translations. The translations can be override by the devs.
   * @param toTranslate
   */
  translate<K extends keyof FuiI18nStrings>(toTranslate: K | FuiFilterOptionsEnum): FuiI18nStrings[K] {
    return this.fuiI18nService.keys[toTranslate] || toTranslate;
  }

  /**
   * Get filter service.
   */
  getFilterService(): FuiFilterService {
    return this.filterService;
  }

  /**
   * This method will return the JSON representation of a filter.
   * This object is immutable (thanks to Object.freeze).
   * The filterValue can be any kind of types (object, string, number... etc).
   */
  toJson(): FuiFilterVo<T, P> {
    return Object.freeze({
      filterId: this.filterId,
      filterField: this.filterField,
      isActive: this.isFilterActive(),
      filterName: this.getFilterName(),
      filterType: this.getFilterType(),
      filterOption: this.getFilterOption(),
      filterValue: this.getFilterValue(),
      filterParams: this.getFilterParams()
    });
  }

  /**
   * Get filter instance only.
   * @protected
   */
  protected getFilterInstance(): FuiFilterInterface<T, P> {
    return {
      filterId: this.filterId,
      filterField: this.filterField,
      selectedSearch: this.selectedSearch,
      isFilterActive: () => this.isFilterActive(),
      setFilterActive: (val: boolean) => this.setFilterActive(val),
      getFilterName: () => this.getFilterName(),
      getFilterType: () => this.getFilterType(),
      getFilterOption: () => this.getFilterOption(),
      getFilterValue: () => this.getFilterValue(),
      getFilterParams: () => this.getFilterParams(),
      toJson: () => this.toJson()
    };
  }

  /**
   * Set selectedSearch to its initial values.
   * @protected
   */
  protected setFilterValueToInitial(): void {
    const initialFilterVo = this.getFilterVoFromCache();
    if (!initialFilterVo) {
      return;
    }
    this.filterParams = initialFilterVo.filterParams;
    this._isActive = initialFilterVo.isActive;
    this.selectedSearch = initialFilterVo.filterValue as T;
  }

  /**
   * Get the cached Value Object for the filter.
   * @protected
   */
  protected getFilterVoFromCache(): FuiFilterVo<T, P> {
    if (!this.initialFilterVoCache) {
      return null;
    }
    return this.initialFilterVoCache;
  }

  /**
   * Whenever we cancel (or close the popover without applying the filters) we need to reset the value to their initials.
   * @protected
   */
  protected addCancelWatcher() {
    if (this.getFilterService()) {
      this.subscriptions.push(
        this.getFilterService()
          .filtersCanceled$()
          .subscribe(isCanceled => {
            if (isCanceled) {
              this.setFilterValueToInitial();
              // We force the currently saved filter to be replaced by this new one
              // (with all its value set back to the initial values)
              const filter: F = this.getFilterInstance() as F;
              this.addOrRemoveFilter(filter.isFilterActive(), filter);
            }
          })
      );
    }
  }

  /**
   * If the filter already exist, we use the filter value as defaults.
   * @protected
   */
  protected setInitialValues() {
    if (this.getFilterService()) {
      const filter: F = this.getFilterService().getFilterFor(this.filterId);
      if (filter && isFunction(filter.toJson)) {
        this.initialFilterVoCache = filter.toJson();
        this.setFilterValueToInitial();
      }
    }
  }
}
