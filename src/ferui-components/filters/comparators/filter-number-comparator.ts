export function FUI_DEFAULT_NUMBER_COMPARATOR(left: number, right: number): number {
  if (left === right) {
    return 0;
  }
  if (left < right) {
    return 1;
  }
  if (left > right) {
    return -1;
  }
}
