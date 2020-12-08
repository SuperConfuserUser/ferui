import { Subscription } from 'rxjs';

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

import { IfOpenService } from '../utils/conditional/if-open.service';
import { FuiI18nService } from '../utils/i18n/fui-i18n.service';

import { FuiFilterHeaderLabelDirective } from './directives/filter-header-label.directive';
import { FuiFilterFieldInterface, FuiSelectedFilterInterface } from './interfaces/filter';
import { FuiFilterPopoverPositionEnum } from './interfaces/filter-popover.enum';
import { FuiFilterEnum } from './interfaces/filter.enum';
import { FuiFilterService } from './providers/filter.service';

@Component({
  selector: 'fui-filter',
  template: `
    <div class="fui-filter-header">
      <ng-content select="[fuiFilterHeaderLabel]"></ng-content>
      <div *ngIf="!withGlobalSearch && withFilters && filterService.hasFilters()" style="height: 100%;"></div>
      <div
        class="fui-filters-container"
        [class.fui-filter-with-search]="withGlobalSearch"
        [class.fui-filter-with-filters]="withFilters && filterService.hasFilters()"
      >
        <fui-global-search-filter class="fui-filter-search" *ngIf="withGlobalSearch"></fui-global-search-filter>
        <button
          *ngIf="withFilters && filterService.hasFilters()"
          class="btn fui-filter-trigger"
          [class.has-active-filters]="filterService.hasActiveFilters(fuiFilterType.GLOBAL_SEARCH)"
          [class.is-open]="isPopupOpen"
          (click)="toggleFilters($event)"
        >
          <span class="fui-filter-label" unselectable="on">{{ filterI18nService.keys.filters }}</span>
          <clr-icon
            shape="fui-filter"
            class="fui-filter-icon"
            [class.has-badge]="filterService.hasActiveFilters(fuiFilterType.GLOBAL_SEARCH)"
          ></clr-icon>
        </button>
        <fui-filters-popover
          [position]="popoverPosition"
          [onFiltersCanceled]="onFiltersCanceled"
          [onFiltersApplied]="onFiltersApplied"
          *fuiIfOpen
        ></fui-filters-popover>
      </div>
    </div>
    <ng-content></ng-content>
  `,
  host: {
    '[class.fui-filter]': 'true'
  },
  providers: [FuiFilterService, IfOpenService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuiFilterComponent implements OnInit, OnDestroy, AfterContentInit {
  @Output() readonly onFiltersChange: EventEmitter<FuiSelectedFilterInterface[]> = new EventEmitter<
    FuiSelectedFilterInterface[]
  >();
  @Output() readonly onFiltersApplied: EventEmitter<FuiSelectedFilterInterface[]> = new EventEmitter<
    FuiSelectedFilterInterface[]
  >();
  @Output() readonly onFiltersCanceled: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ContentChild(FuiFilterHeaderLabelDirective) headerTitle: FuiFilterHeaderLabelDirective;

  @Input() set withGlobalSearch(value: boolean) {
    this._withGlobalSearch = value;
    this.setupPosition();
    this.cd.markForCheck();
  }

  get withGlobalSearch(): boolean {
    return this._withGlobalSearch;
  }

  @Input() set withFilters(value: boolean) {
    this._withFilters = value;
    this.setupPosition();
    this.cd.markForCheck();
  }

  get withFilters(): boolean {
    return this._withFilters;
  }

  @Input() set disabled(isDisabled: boolean) {
    if (this.filterService) {
      this.filterService.setDisabled(isDisabled);
    }
  }

  @Input() set filterFields(filterFields: FuiFilterFieldInterface[]) {
    if (this.filterService) {
      this.filterService.filterFields = filterFields;
      this.cd.markForCheck();
    }
  }

  popoverPosition: FuiFilterPopoverPositionEnum = FuiFilterPopoverPositionEnum.LEFT;
  isPopupOpen: boolean = false;
  fuiFilterType = FuiFilterEnum;
  private subscriptions: Subscription[] = [];
  private _withGlobalSearch: boolean = true;
  private _withFilters: boolean = true;

  constructor(
    private ifOpenService: IfOpenService,
    private cd: ChangeDetectorRef,
    public filterService: FuiFilterService,
    public filterI18nService: FuiI18nService
  ) {
    this.subscriptions.push(
      ifOpenService.openChange.subscribe(isOpen => {
        if (this.filterService) {
          if (!isOpen && this.filterService.hasUnAppliedChanges) {
            this.filterService.resetFilters();
          }
          this.filterService.hasUnAppliedChanges = false;
        }
        this.isPopupOpen = isOpen;
        this.cd.markForCheck();
      }),
      filterService.filters$().subscribe(activeFilter => {
        this.onFiltersChange.emit(activeFilter);
        // If filters has been updated, we markForCheck for next change detection run.
        this.cd.markForCheck();
      })
    );
  }

  ngOnInit(): void {
    this.setupPosition();
    this.cd.markForCheck();
    // We throw an error if both withFilters and withGlobalSearch are set to false because this is a bad usage of this component.
    // You should never have both of those variable set to false. If you want to hide the component, use the ngIf instead.
    if (!this.withGlobalSearch && !this.withFilters) {
      throw new Error(
        '[FerUI Filter] [WARNING] You need whether [withFilters] or [withGlobalSearch] to be set to true. Otherwise nothing will be displayed on screen. Use the ngIf directive instead if you want to hide the whole component.'
      );
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
  }

  ngAfterContentInit() {
    this.setupPosition();
  }

  /**
   * Toggles the filters Popover.
   */
  toggleFilters(event: MouseEvent) {
    this.ifOpenService.toggleWithEvent(event);
  }

  /**
   * Setup the position of the filters depending on if we want both filters and global search or only one of those.
   * @private
   */
  private setupPosition(): void {
    if ((this._withFilters && !this._withGlobalSearch) || (this._withFilters && this.headerTitle)) {
      this.popoverPosition = FuiFilterPopoverPositionEnum.RIGHT;
    } else {
      this.popoverPosition = FuiFilterPopoverPositionEnum.LEFT;
    }
  }
}
