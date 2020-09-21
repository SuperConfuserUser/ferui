import { Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

import { Column } from '../components/entities/column';
import {
  FuiDatagridActiveGlobalFilter,
  FuiDatagridIFilter,
  FuiDatagridIGlobalSearchFilter,
  IDoesGlobalFilterPassParams
} from '../components/filters/interfaces/filter';
import { ChangedPath } from '../types/refresh-model-params';

export interface FuiDatagridActiveFilter {
  index: string;
  filter: FuiDatagridIFilter;
}

export const DATAGRID_GLOBAL_SEARCH_ID: string = 'globalSearch';

@Injectable()
export class FuiDatagridFilterService {
  private filters$: Subject<Array<FuiDatagridActiveFilter | FuiDatagridActiveGlobalFilter>> = new Subject<
    Array<FuiDatagridActiveFilter | FuiDatagridActiveGlobalFilter>
  >();
  private _activeFilters: FuiDatagridActiveFilter[] = [];
  private _globalSearchFilter: FuiDatagridActiveGlobalFilter;

  constructor() {}

  get activeFilters(): FuiDatagridActiveFilter[] {
    return this._activeFilters;
  }

  set activeFilters(value: FuiDatagridActiveFilter[]) {
    this._activeFilters = value;
  }

  get globalSearchFilter(): FuiDatagridActiveGlobalFilter {
    return this._globalSearchFilter;
  }

  set globalSearchFilter(value: FuiDatagridActiveGlobalFilter) {
    this._globalSearchFilter = value;
  }

  addGlobalSearchFilter(filter: FuiDatagridIGlobalSearchFilter): void {
    if (filter) {
      this.globalSearchFilter = {
        index: DATAGRID_GLOBAL_SEARCH_ID,
        filter: filter
      };
    }
  }

  removeGlobalSearchFilter(): void {
    if (this.globalSearchFilter && this.globalSearchFilter.filter !== null) {
      this.globalSearchFilter = {
        index: DATAGRID_GLOBAL_SEARCH_ID,
        filter: null
      };
    }
  }

  addFilter(filter: FuiDatagridIFilter): void {
    if (filter && filter.getColumn instanceof Function) {
      const id = filter.getColumn().getColId();
      const filterIndex: number = this.activeFilters.findIndex(f => f.index === id);
      // If the filter is already present in the active filters list, we just update its values.
      if (filterIndex > -1) {
        this._activeFilters[filterIndex].filter = filter;
      } else {
        this._activeFilters.push({ index: id, filter: filter });
      }
      this.filters$.next([...this._activeFilters, this.globalSearchFilter]);
    }
  }

  removeFilter(filter: FuiDatagridIFilter): void {
    if (filter) {
      const id = filter.getColumn().getColId();
      const filterIndex: number = this.activeFilters.findIndex(f => f.index === id);
      if (filterIndex > -1) {
        this._activeFilters.splice(filterIndex, 1);
      }
      this.filters$.next([...this._activeFilters, this.globalSearchFilter]);
    }
  }

  getFilterFor(column: Column): FuiDatagridIFilter | null {
    if (this.activeFilters.length > 0) {
      const activeFilter = this.activeFilters.find(aFilter => {
        return aFilter.index === column.getColId();
      });
      return activeFilter ? activeFilter.filter : null;
    }
  }

  hasActiveFilters(): boolean {
    return this.activeFilters.length > 0;
  }

  hasGlobalSearchFilter(): boolean {
    return this.globalSearchFilter && this.globalSearchFilter.filter !== null;
  }

  hasFilters(): boolean {
    return this.hasActiveFilters() || this.hasGlobalSearchFilter();
  }

  resetFilters(): void {
    this.globalSearchFilter = null;
    this.activeFilters = [];
    this.filters$.next([]);
  }

  filter(changedPath: ChangedPath): void {
    if (!changedPath.rowNodes) {
      return;
    }
    let filteredData = [];
    if (!this.hasActiveFilters() && !this.hasGlobalSearchFilter) {
      filteredData = changedPath.rowNodes;
    } else {
      let doesFiltersPass: boolean = true;
      let added: boolean = false;
      let globalSearchPass: boolean = false;
      const condition: string = 'and';

      changedPath.rowNodes.forEach(node => {
        const data = node.data;
        added = false;
        doesFiltersPass = true;

        if (this.hasActiveFilters()) {
          for (const aFilter of this.activeFilters) {
            const filter: FuiDatagridIFilter = aFilter.filter;
            const doesFilterPass: boolean = filter.doesFilterPass({ data: data[filter.getColumn().getColId()] });
            if (condition === 'and' && !doesFilterPass) {
              doesFiltersPass = false;
              break;
            } else if (condition === 'or' && !added && doesFilterPass) {
              filteredData.push(node);
              added = true;
              break;
            }
          }
        }

        if (this.hasGlobalSearchFilter()) {
          const filter: FuiDatagridIGlobalSearchFilter = this.globalSearchFilter.filter;
          const doesPassParams: IDoesGlobalFilterPassParams = {
            rowData: data,
            data: null
          };
          globalSearchPass = filter.doesFilterPass(doesPassParams);
          if (
            (condition === 'or' && globalSearchPass && !added) ||
            (condition === 'and' && globalSearchPass && doesFiltersPass)
          ) {
            added = true;
            filteredData.push(node);
          }
        } else if (condition === 'and' && doesFiltersPass) {
          filteredData.push(node);
        }
      });
    }
    changedPath.rowNodes = filteredData;
  }

  filtersSub(): Observable<Array<FuiDatagridActiveFilter | FuiDatagridActiveGlobalFilter>> {
    return this.filters$.asObservable();
  }
}
