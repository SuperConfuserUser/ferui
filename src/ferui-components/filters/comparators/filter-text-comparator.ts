import { FuiFilterOptionDefInterface } from '../interfaces/filter';
import { FuiFilterOptionsEnum } from '../interfaces/filter-options.enum';

export function FUI_DEFAULT_TEXT_COMPARATOR(
  filterOption: FuiFilterOptionDefInterface | FuiFilterOptionsEnum | null,
  value: string,
  filterText: string
): boolean {
  switch (filterOption) {
    case FuiFilterOptionsEnum.CONTAINS:
      return value.indexOf(filterText) >= 0;
    case FuiFilterOptionsEnum.NOT_CONTAINS:
      return value.indexOf(filterText) === -1;
    case FuiFilterOptionsEnum.EQUALS:
      return value === filterText;
    case FuiFilterOptionsEnum.NOT_EQUAL:
      return value !== filterText;
    case FuiFilterOptionsEnum.STARTS_WITH:
      return value.indexOf(filterText) === 0;
    case FuiFilterOptionsEnum.ENDS_WITH:
      const index = value.lastIndexOf(filterText);
      return index >= 0 && index === value.length - filterText.length;
    default:
      // should never happen
      console.warn('invalid filter type ' + filterOption);
      return false;
  }
}
