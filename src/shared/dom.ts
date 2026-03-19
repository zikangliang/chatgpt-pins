export function dedupeElements<T extends Element>(elements: T[]): T[] {
  return Array.from(new Set(elements))
}

export function hashText(value: string): string {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return `m${Math.abs(hash)}`
}

export function waitForElement<T extends Element>(
  getter: () => T | null,
  options: {
    timeoutMs?: number
    intervalMs?: number
  } = {},
): Promise<T | null> {
  const { timeoutMs = 15_000, intervalMs = 250 } = options
  const existing = getter()
  if (existing) {
    return Promise.resolve(existing)
  }

  return new Promise((resolve) => {
    const startedAt = Date.now()
    const timer = window.setInterval(() => {
      const element = getter()
      if (element) {
        window.clearInterval(timer)
        resolve(element)
        return
      }

      if (Date.now() - startedAt >= timeoutMs) {
        window.clearInterval(timer)
        resolve(null)
      }
    }, intervalMs)
  })
}
