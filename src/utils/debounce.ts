export function debounce<T extends (...args: never[]) => unknown>(
  fn: T,
  waitMs = 300
): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return ((...args: unknown[]) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...(args as Parameters<T>))
      timeoutId = null
    }, waitMs)
  }) as unknown as T
}
