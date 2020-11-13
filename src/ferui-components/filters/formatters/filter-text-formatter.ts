export function FUI_DEFAULT_TEXT_LOWERCASE_FORMATTER<T extends string = string>(from: T): T {
  if (!from) {
    return null;
  }
  return from.toString().toLowerCase() as T;
}
