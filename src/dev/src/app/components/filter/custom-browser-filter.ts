import { Component, OnInit } from '@angular/core';

import {
  FeruiUtils,
  FuiBaseFilter,
  FuiFilterComponentInterface,
  FuiFilterInterface,
  FuiFilterOptionsEnum,
  FuiFilterParamsInterface,
  FuiFilterService,
  FuiI18nService
} from '@ferui/components';

import { DatagridService } from '../datagrid/datagrid.service';

export interface DemoBrowserFilterValue {
  [key: string]: boolean;
}

@Component({
  selector: 'demo-browser-filter',
  template: ` <div class="col-3 fui-filters-column-name" unselectable="on">
      {{ getFilterName() }}
    </div>
    <div class="col-9">
      <div class="container-fluid">
        <div class="row">
          <div class="col-4" *ngFor="let browser of availableBrowsers">
            <fui-checkbox-wrapper>
              <input
                type="checkbox"
                fuiCheckbox
                (ngModelChange)="onChange($event, browser)"
                [(ngModel)]="selectedSearch[browser]"
              />
              <label fuiLabel [title]="browser" [innerHTML]="browserService.getIconFor(browser) | fuiSafeHtml"></label>
            </fui-checkbox-wrapper>
          </div>
        </div>
      </div>
    </div>`,
  providers: [DatagridService],
  host: {
    '[class.row]': 'true'
  }
})
export class DemoBrowserCustomFilterComponent<
    T extends DemoBrowserFilterValue = DemoBrowserFilterValue,
    P extends FuiFilterParamsInterface<T> = FuiFilterParamsInterface<T>,
    F extends FuiFilterInterface<T, P> = FuiFilterInterface<T, P>
  >
  extends FuiBaseFilter<T, P, F>
  implements FuiFilterComponentInterface<T, P, F>, FuiFilterInterface<T, P>, OnInit {
  availableBrowsers: string[];
  filterDefaultName: string = FeruiUtils.generateUniqueId('fui-filter-browser');

  constructor(
    public browserService: DatagridService,
    protected filterService: FuiFilterService,
    protected fuiI18nService: FuiI18nService
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    // You shouldn't do any filter attribute initialisation here. Instead, use the setInitialValues() method to do your initial
    // initialisation.
    // Here you should do only initialisation specific to this component but not to inherited attributes.
    // This attribute is dedicated to this component and it is not inherited from parent. So i can initialise it here.
    this.availableBrowsers = this.browserService.getAvailableBrowsers();
  }

  getFilterOption(): FuiFilterOptionsEnum | null {
    return null;
  }

  getFilterValue(): T | null {
    return this.selectedSearch;
  }

  onChange(value: boolean, browser: string) {
    // Be careful when using objects for this.selectedSearch as objects mutations are NOT supported.
    // Instead of directly call 'this.selectedSearch[gender] = value;' you need to ASSIGN the whole this.selectedSearch object
    // (this.selectedSearch = selectedSearch;) by doing the following.
    const selectedSearch: T = Object.assign({}, this.selectedSearch);
    selectedSearch[browser] = value;
    this.selectedSearch = selectedSearch;
    this.addOrRemoveFilter(!FeruiUtils.isNullOrUndefined(this.selectedSearch), this.getFilterInstance() as F);
    this.filterChange.emit(this.getFilterInstance() as F);
  }

  /**
   * Initialise the values. This method will be called by the parent ngOnInit() method after default initialisation and before
   * adding the mandatory cancel watcher.
   * @protected
   */
  protected setInitialValues() {
    // tslint:disable-next-line
    this.selectedSearch = {} as T;
    // Since super.setInitialValues(); will take care of adding the mandatory initialVoCache object, you should call it after your
    // own initialisation. Here, my selectedSearch attribute is an object, so i need to assign it to an empty object by default.
    super.setInitialValues();
  }
}
