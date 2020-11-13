import { FuiDatagridNumberFilterComponent } from '../../datagrid/components/filters/filter/number-filter';
import { Comparator } from '../../datagrid/components/filters/interfaces/filter';
import { FuiFilterOptionDefInterface } from '../interfaces/filter';
import { FuiFilterOptionsEnum } from '../interfaces/filter-options.enum';

export interface FuiNullComparator {
  equals?: boolean;
  lessThan?: boolean;
  greaterThan?: boolean;
}

export const FUI_DEFAULT_NULL_COMPARATOR: FuiNullComparator = {
  equals: false,
  lessThan: false,
  greaterThan: false
};

export function FUI_FILTER_TRANSLATE_NULL(option: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null): boolean {
  let reducedOptionString: string;
  if (typeof option !== 'string' && option.hasOwnProperty('displayKey')) {
    reducedOptionString =
      option.displayKey.indexOf('greater') > -1
        ? 'greaterThan'
        : option.displayKey.indexOf('lessThan') > -1
        ? 'lessThan'
        : 'equals';
  } else if (typeof option === 'string') {
    reducedOptionString =
      option.indexOf('greater') > -1 ? 'greaterThan' : option.indexOf('lessThan') > -1 ? 'lessThan' : 'equals';
  }
  return (FUI_DEFAULT_NULL_COMPARATOR as FuiNullComparator)[reducedOptionString];
}

export function FUI_DEFAULT_NULL_COMPARATOR_FUNC(
  selectedOption: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null,
  comparator: Comparator<number | Date>
): Comparator<number | Date> {
  return (filterValue: number, gridValue: number): number => {
    if (gridValue === null) {
      const nullValue = FUI_FILTER_TRANSLATE_NULL(selectedOption);
      switch (selectedOption) {
        case FuiDatagridNumberFilterComponent.EMPTY:
          return 0;
        case FuiDatagridNumberFilterComponent.EQUALS:
          return nullValue ? 0 : 1;
        case FuiDatagridNumberFilterComponent.GREATER_THAN:
        case FuiDatagridNumberFilterComponent.GREATER_THAN_OR_EQUAL:
          return nullValue ? 1 : -1;
        case FuiDatagridNumberFilterComponent.LESS_THAN_OR_EQUAL:
        case FuiDatagridNumberFilterComponent.LESS_THAN:
          return nullValue ? -1 : 1;
        case FuiDatagridNumberFilterComponent.NOT_EQUAL:
          return nullValue ? 1 : 0;
        default:
          break;
      }
    }
    return comparator(filterValue, gridValue);
  };
}
