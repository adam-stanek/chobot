export function defaultFormatter(value: any) {
  return value == null ? value : encodeURIComponent(value)
}
