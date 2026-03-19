export function throttle<T extends (...args: never[]) => void>(
  callback: T,
  waitMs: number,
): (...args: Parameters<T>) => void {
  let isScheduled = false
  let lastArgs: Parameters<T> | null = null

  return (...args: Parameters<T>) => {
    lastArgs = args
    if (isScheduled) {
      return
    }

    isScheduled = true
    window.setTimeout(() => {
      isScheduled = false
      const nextArgs = lastArgs
      lastArgs = null
      if (nextArgs) {
        callback(...nextArgs)
      }
    }, waitMs)
  }
}
