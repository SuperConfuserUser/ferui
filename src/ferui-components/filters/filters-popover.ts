import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Injector, Input, OnInit, SkipSelf } from '@angular/core';

import { FuiFormLayoutEnum } from '../forms/common/layout.enum';
import { NgOption } from '../forms/select/ng-select/ng-select.types';
import { AbstractPopover } from '../popover/common/abstract-popover';
import { Point } from '../popover/common/popover-options.interface';
import { FeruiUtils } from '../utils/ferui-utils';
import { FuiI18nService } from '../utils/i18n/fui-i18n.service';

import { FuiFilterCustomContextInterface, FuiFilterFieldInterface, FuiSelectedFilterInterface } from './interfaces/filter';
import { FuiFilterPopoverPositionEnum } from './interfaces/filter-popover.enum';
import { FuiFilterEnum } from './interfaces/filter.enum';
import { FuiFilterService } from './providers/filter.service';

@Component({
  selector: 'fui-filters-popover',
  template: ` <form novalidate>
    <div class="fui-filters-popover-header">
      <div class="container-fluid">
        <div class="row">
          <div class="col-3 fui-filters-field-name" unselectable="on">{{ filterI18nService.keys.displayedFilterName }}</div>
          <div class="col">
            <fui-select
              fuiSelect
              [disabled]="filterService?.isDisabled$() | async"
              [name]="filterFieldsDefaultName"
              [layout]="fuiFormLayoutEnum.SMALL"
              [multiple]="true"
              [clearable]="false"
              [appendTo]="'#' + popoverId"
              [closeOnSelect]="true"
              [(ngModel)]="selectedFields"
              (remove)="onFilterRemove($event)"
            >
              <ng-option *ngFor="let field of filterService?.filterFields" [value]="field">{{ field.label }}</ng-option>
            </fui-select>
          </div>
        </div>
      </div>
    </div>
    <div class="fui-filters-popover-body" *ngIf="selectedFields.length > 0">
      <div class="container-fluid">
        <div class="fui-filter-row row" *ngFor="let field of selectedFields">
          <fui-date-filter
            [appendTo]="'#' + popoverId"
            [filterField]="field"
            [filterParams]="field.params"
            *ngIf="field.type === fuiFilterType.DATE"
          ></fui-date-filter>

          <fui-text-filter
            [appendTo]="'#' + popoverId"
            [filterField]="field"
            [filterParams]="field.params"
            *ngIf="field.type === fuiFilterType.STRING"
          ></fui-text-filter>

          <fui-boolean-filter
            [appendTo]="'#' + popoverId"
            [filterField]="field"
            [filterParams]="field.params"
            *ngIf="field.type === fuiFilterType.BOOLEAN"
          ></fui-boolean-filter>

          <fui-number-filter
            [appendTo]="'#' + popoverId"
            [filterField]="field"
            [filterParams]="field.params"
            *ngIf="field.type === fuiFilterType.NUMBER"
          ></fui-number-filter>

          <fui-custom-filter
            [appendTo]="'#' + popoverId"
            [field]="field"
            *ngIf="field.type === fuiFilterType.CUSTOM"
          ></fui-custom-filter>
        </div>
      </div>
    </div>
    <div class="fui-filters-popover-footer container-fluid">
      <div class="row pl-4 pr-4">
        <div class="col-auto">
          <button
            class="btn btn-clear"
            type="reset"
            tabindex="1"
            unselectable="on"
            [disabled]="filterService?.isDisabled$() | async"
            *ngIf="filterService?.hasActiveFilters(fuiFilterType.GLOBAL_SEARCH)"
            (click)="clearCallback($event)"
          >
            {{ filterI18nService.keys.clearAllFilters }}
          </button>
        </div>
        <div class="col col-right">
          <button tabindex="1" class="btn btn-link" type="button" unselectable="on" (click)="cancelCallback($event)">
            {{ filterI18nService.keys.cancel }}
          </button>
          <button
            class="btn btn-primary btn-lg"
            tabindex="1"
            type="submit"
            [disabled]="
              !filterService?.hasSelectedFilters() ||
              (filterService?.isDisabled$() | async) ||
              !filterService?.hasUnAppliedChanges
            "
            unselectable="on"
            (click)="applyCallback($event)"
          >
            {{ filterI18nService.keys.applyFilter }}
          </button>
        </div>
      </div>
    </div>
  </form>`,
  host: {
    '[class.fui-filters-popover]': 'true',
    '[id]': 'popoverId'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuiFiltersPopoverComponent extends AbstractPopover implements OnInit {
  @Input() onFiltersApplied: EventEmitter<FuiSelectedFilterInterface[]>;
  @Input() onFiltersCanceled: EventEmitter<boolean>;
  @Input() position: FuiFilterPopoverPositionEnum = FuiFilterPopoverPositionEnum.LEFT;

  fuiFormLayoutEnum = FuiFormLayoutEnum;
  fuiFilterType = FuiFilterEnum;
  filterFieldsDefaultName: string = FeruiUtils.generateUniqueId('fui-filter-fields');
  selectedFields: FuiFilterFieldInterface[] = [];
  popoverId: string = FeruiUtils.generateUniqueId('fuiFilterPopover', '');

  constructor(
    @SkipSelf() parent: ElementRef,
    _injector: Injector,
    public filterService: FuiFilterService,
    public filterI18nService: FuiI18nService
  ) {
    super(_injector, parent, null, 0);
  }

  ngOnInit(): void {
    this.configurePopover();
    this.selectedFields = this.filterService.selectedFilters
      .filter(aFilter => this.fuiFilterType.GLOBAL_SEARCH !== aFilter.filter.getFilterType() && aFilter.filter.isFilterActive())
      .map(aFilter => aFilter.filter.filterField);
  }

  /**
   * Close the popover.
   * @param event
   */
  cancelCallback(event: MouseEvent | TouchEvent): void {
    if (this.onFiltersCanceled) {
      this.onFiltersCanceled.emit(true);
    }
    this.closePopover(event);
  }

  /**
   * Clear all filter and close popover.
   * @param event
   */
  clearCallback(event: MouseEvent | TouchEvent): void {
    this.filterService.clearFilters();
    this.onFilterChange();
    if (this.onFiltersApplied) {
      this.onFiltersApplied.emit([]);
    }
    this.closePopover(event);
  }

  /**
   * Apply filters.
   * @param event
   */
  applyCallback(event: MouseEvent | TouchEvent): void {
    // We activate the filters.
    this.filterService.selectedFilters.forEach(aFilter => aFilter.filter.setFilterActive(true));
    this.onFilterChange();
    this.filterService.applyFilters();
    if (this.onFiltersApplied) {
      this.onFiltersApplied.emit(this.filterService.selectedFilters);
    }
    // Just close the popover once we're done.
    this.closePopover(event);
  }

  /**
   * Remove the un-active filter from the filterService if we remove it from the select list.
   * @param option
   */
  onFilterRemove(option: NgOption): void {
    if (!option) {
      return;
    }
    const filter = this.filterService.getFilterByField(option.value as FuiFilterFieldInterface);
    if (filter && !filter.isFilterActive()) {
      this.filterService.removeFilter(filter);
    }
    // We inform the service that we might have un-applied changes.
    this.filterService.hasUnAppliedChanges = true;
  }

  /**
   * Get context for custom filter component.
   * @param field
   */
  getContextForCustomFilter(field: FuiFilterFieldInterface): FuiFilterCustomContextInterface {
    return {
      appendTo: '#' + this.popoverId,
      field: field
    };
  }

  /**
   * Close the popover.
   * @param event
   * @private
   */
  private closePopover(event: MouseEvent | TouchEvent): void {
    this.ifOpenService.toggleWithEvent(event);
  }

  /**
   * Call this method on every filter change event.
   * When we remove a filtered field, we need to remove the filter from filterService as well.
   * @private
   */
  private onFilterChange(): void {
    this.filterService.selectedFilters.forEach(aFilter => {
      if (aFilter.filter && aFilter.filter.filterField) {
        const filterExistIndex = this.selectedFields.findIndex(field => field.key === aFilter.filter.filterField.key);
        if (filterExistIndex < 0) {
          this.filterService.removeFilter(aFilter.filter);
        }
      }
    });
  }

  /**
   * Configure Popover Direction and Close indicators
   */
  private configurePopover(): void {
    if (this.position === FuiFilterPopoverPositionEnum.LEFT) {
      this.anchorPoint = Point.BOTTOM_LEFT;
      this.popoverPoint = Point.LEFT_TOP;
    } else if (this.position === FuiFilterPopoverPositionEnum.RIGHT) {
      this.anchorPoint = Point.BOTTOM_RIGHT;
      this.popoverPoint = Point.RIGHT_TOP;
    }
    this.closeOnOutsideClick = false;
  }
}
