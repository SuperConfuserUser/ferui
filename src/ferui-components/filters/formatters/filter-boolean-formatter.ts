export function FUI_DEFAULT_BOOLEAN_FORMATTER<T extends string | boolean>(value: T): boolean {
  switch (value) {
    case 'true':
    case 'yes':
    case true:
      return true;
    default:
      return false;
  }
}
