export function FUI_DEFAULT_DATE_COMPARATOR(filterDate: Date, searchValue: Date): number {
  if (searchValue < filterDate) {
    return -1;
  }
  if (searchValue > filterDate) {
    return 1;
  }
  return searchValue !== null ? 0 : -1;
}
