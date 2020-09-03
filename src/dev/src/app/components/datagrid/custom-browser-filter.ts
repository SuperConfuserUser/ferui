import { Component, Input, OnInit } from '@angular/core';

import { Column, FuiDatagridBaseFilter, IComparableFilterParams, IDoesFilterPassParams } from '@ferui/components';

import { DatagridService } from './datagrid.service';

export interface IBrowserFilterParams extends IComparableFilterParams {}

@Component({
  selector: 'fui-datagrid-browser-filter',
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-3 fui-dg-filters-column-name" unselectable="on">
          {{ getColumnName() }}
        </div>
        <div class="col-9">
          <div class="container-fluid">
            <div class="row">
              <div class="col-4" *ngFor="let browser of possibleValues">
                <fui-checkbox-wrapper>
                  <input
                    type="checkbox"
                    fuiCheckbox
                    (ngModelChange)="onChange($event, browser)"
                    [(ngModel)]="modelValues[browser]"
                  />
                  <label [title]="browser" [innerHTML]="datagridService.getIconFor(browser) | safeHtml"></label>
                </fui-checkbox-wrapper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  host: {
    class: 'fui-datagrid-browser-filter'
  },
  styles: [
    `
      .fui-checkbox-wrapper {
        height: auto;
      }
    `
  ]
})
export class CustomBrowserFilterComponent extends FuiDatagridBaseFilter<IBrowserFilterParams> implements OnInit {
  @Input() filterParams: IBrowserFilterParams;
  @Input() column: Column;

  possibleValues: string[] = [];
  modelValues = {};

  constructor(public datagridService: DatagridService) {
    super();
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    if (!params.data) {
      return false;
    }
    const browser = this.datagridService.identifyBrowser(params.data);
    return this.modelValues[browser.toLowerCase()] === true;
  }

  getFilterOption(): string {
    return null;
  }

  getFilterValue(): any {
    return this.modelValues;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.possibleValues = this.datagridService.getAvailableBrowsers();
    this.possibleValues.forEach(value => {
      const filter = this.getFilterService()
        ? this.getFilterService().activeFilters.find(aFilter => {
            return aFilter.index === this.column.getColId();
          })
        : null;
      this.modelValues[value] = filter ? (filter.filter as CustomBrowserFilterComponent).modelValues[value] : null;
    });
  }

  onChange(value, browser) {
    let hasFilterModels: boolean = false;
    if (this.modelValues[browser] !== value) {
      this.modelValues[browser] = value;
    }
    for (const mValueIndex in this.modelValues) {
      if (this.modelValues.hasOwnProperty(mValueIndex)) {
        const modelValue = this.modelValues[mValueIndex];
        if (modelValue === true) {
          hasFilterModels = true;
        }
      }
    }
    this.addOrRemoveFilter(hasFilterModels, this);
  }
}
