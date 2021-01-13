import { Injectable } from '@angular/core';

import { FuiFilterComparatorService, FuiFilterEnum, FuiFilterModel, FuiFilterOptionsEnum } from '@ferui/components';

@Injectable({
  providedIn: 'root'
})
export class DemoFilterService extends FuiFilterComparatorService {
  // We override the base class's original method to handle a custom filter.
  protected doesFilterPass(filter: FuiFilterModel, data: any): boolean {
    const { filterType, field, filterValue } = filter;

    // Check for the filter(s) that needs custom logic first.
    // Two conditional statements are used for illustration purposes to show that 'gender' is a custom filter.
    // Only one would actually be needed, since there's only one custom filter and fields are unique in this case.
    if (filterType === FuiFilterEnum.CUSTOM) {
      // Mockup for the gender field.
      if (field === 'gender') {
        const filterValues: string[] = Object.keys(filterValue).filter(key => filterValue[key] === true);
        return filterValues.some(value => this.textFilter(FuiFilterOptionsEnum.EQUALS, value, data));
      }
    } else {
      // We're not changing anything else, so let the base method handle the rest of the filter types.
      return super.doesFilterPass(filter, data);
    }
  }
}
