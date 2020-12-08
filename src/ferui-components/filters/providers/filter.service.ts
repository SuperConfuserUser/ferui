import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

import { FeruiUtils } from '../../utils/ferui-utils';
import {
  FuiFilterFieldInterface,
  FuiFilterInterface,
  FuiFilterParamsInterface,
  FuiSelectedFilterInterface
} from '../interfaces/filter';
import { FuiFilterEnum } from '../interfaces/filter.enum';
import { FuiFilterIdGenerator } from '../utils/filter-id-generator';

@Injectable()
export class FuiFilterService {
  private _filterFields: FuiFilterFieldInterface[] = [];
  private _filtersSub: BehaviorSubject<FuiSelectedFilterInterface[]> = new BehaviorSubject<FuiSelectedFilterInterface[]>([]);
  private _filterAppliedSub: Subject<FuiSelectedFilterInterface[]> = new Subject<FuiSelectedFilterInterface[]>();
  private _filterCanceledSub: Subject<boolean> = new Subject<boolean>();
  private _selectedFilters: FuiSelectedFilterInterface[] = [];
  private _disabledSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _hasUnAppliedChanges: boolean = false;

  get hasUnAppliedChanges(): boolean {
    return this._hasUnAppliedChanges;
  }

  set hasUnAppliedChanges(value: boolean) {
    this._hasUnAppliedChanges = value;
  }

  /**
   * Get the selected filters.
   */
  get selectedFilters(): FuiSelectedFilterInterface[] {
    return this._selectedFilters;
  }

  /**
   * Set the selected filters.
   * @param value
   */
  set selectedFilters(value: FuiSelectedFilterInterface[]) {
    this._selectedFilters = value;
  }

  /**
   * Get the filter fields. A filter field represent the field upon with you want to apply a filter.
   */
  get filterFields(): FuiFilterFieldInterface[] {
    return this._filterFields;
  }

  /**
   * Set the filter fields.
   * @param value
   */
  set filterFields(value: FuiFilterFieldInterface[]) {
    this._filterFields = value;
  }

  /**
   * Apply the selected filters.
   */
  applyFilters() {
    this.hasUnAppliedChanges = false;
    this._filterAppliedSub.next(this.selectedFilters);
  }

  /**
   * Get the filter for specific filterID if it exist within the service.
   * @param filterId
   */
  getFilterFor<T, P extends FuiFilterParamsInterface<T>, F extends FuiFilterInterface<T, P>>(filterId: string): F | null {
    if (this.selectedFilters.length > 0 && !FeruiUtils.isNullOrUndefined(filterId)) {
      const activeFilter = this.selectedFilters.find(aFilter => {
        return aFilter.filter.filterId === filterId;
      });
      return activeFilter ? (activeFilter.filter as F) : null;
    }
    return null;
  }

  /**
   * Get the filter for specific filterID if it exist within the service.
   * @param field
   */
  getFilterByField<T, P extends FuiFilterParamsInterface<T>, F extends FuiFilterInterface<T, P>>(
    field: FuiFilterFieldInterface
  ): F | null {
    if (this.selectedFilters.length > 0 && !FeruiUtils.isNullOrUndefined(field)) {
      const activeFilter = this.selectedFilters.find(aFilter => {
        return aFilter.filter.filterId === FuiFilterIdGenerator.getFilterPrefix(field.type) + field.key;
      });
      return activeFilter ? (activeFilter.filter as F) : null;
    }
    return null;
  }

  /**
   * Add a filter by it ID.
   * @param filter
   */
  addFilter<T, P extends FuiFilterParamsInterface<T>, F extends FuiFilterInterface<T, P>>(filter: F): void {
    if (filter && filter.filterId) {
      const filterIndex: number = this.selectedFilters.findIndex(f => f.filter.filterId === filter.filterId);
      // If the filter is already present in the selected filters list, we just update its values.
      if (filterIndex > -1) {
        this._selectedFilters[filterIndex].filter = filter;
      } else {
        this._selectedFilters.push({ index: filter.filterId, filter: filter });
      }
      this._filtersSub.next(this._selectedFilters);
      this.hasUnAppliedChanges = true;
    }
  }

  /**
   * Remove a filter by its ID.
   * @param filter
   */
  removeFilter<T, P extends FuiFilterParamsInterface<T>, F extends FuiFilterInterface<T, P>>(filter: F | string): void {
    let filterId: string;
    if (typeof filter === 'string') {
      filterId = filter;
    } else if (filter && filter.filterId) {
      filterId = filter.filterId;
    }
    if (filterId) {
      const filterIndex: number = this.selectedFilters.findIndex(f => f.filter.filterId === filterId);
      if (filterIndex > -1) {
        this._selectedFilters.splice(filterIndex, 1);
      }
      this._filtersSub.next(this._selectedFilters);
      this.hasUnAppliedChanges = true;
    }
  }

  /**
   * Whether or not there is filters selected.
   * @param exception
   */
  hasSelectedFilters(exception?: FuiFilterEnum): boolean {
    return this.selectedFilters.filter(f => (exception ? f.filter.getFilterType() !== exception : true)).length > 0;
  }

  /**
   * Whether or not there is active filters selected.
   * @param exception
   */
  hasActiveFilters(exception?: FuiFilterEnum): boolean {
    return (
      this.selectedFilters.filter(f => (exception ? f.filter.getFilterType() !== exception : true) && f.filter.isFilterActive())
        .length > 0
    );
  }

  /**
   * Whether or not there are filter fields.
   */
  hasFilters(): boolean {
    return this.filterFields && this.filterFields.length > 0;
  }

  /**
   * Reset the selected filters to their previous state.
   */
  resetFilters(): void {
    this.hasUnAppliedChanges = false;
    this._filterCanceledSub.next(true);
  }

  /**
   * Clear the selected filters list.
   */
  clearFilters(): void {
    this.selectedFilters = [];
    this._filtersSub.next([]);
    this.applyFilters();
  }

  /**
   * List of selected filters. This observable will be updated each time we add/update or remove a filter.
   */
  filters$(): Observable<FuiSelectedFilterInterface[]> {
    return this._filtersSub.asObservable();
  }

  /**
   * List of selected filters. This observable will be updated each time we apply the filters.
   * Not to be confused with filters$() which will be triggered everytime the user update a filter even though it is not active.
   */
  filtersApplied$(): Observable<FuiSelectedFilterInterface[]> {
    return this._filterAppliedSub.asObservable();
  }

  /**
   * Observable to track when the user cancel (close the popover) without applying the filters.
   */
  filtersCanceled$(): Observable<boolean> {
    return this._filterCanceledSub.asObservable();
  }

  /**
   * Whether or not the filter is disabled.
   */
  isDisabled$(): Observable<boolean> {
    return this._disabledSub.asObservable();
  }

  /**
   * Set the disabled state.
   * @param value
   */
  setDisabled(value: boolean) {
    this._disabledSub.next(value);
  }
}
