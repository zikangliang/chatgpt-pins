export type ScrollContainer = Window | HTMLElement

export function resolveScrollContainer(start: HTMLElement | null): ScrollContainer {
  let current: HTMLElement | null = start

  while (current && current !== document.body && current !== document.documentElement) {
    if (isElementScrollContainer(current)) {
      return current
    }

    current = current.parentElement
  }

  return window
}

export function getScrollPosition(container: ScrollContainer): number {
  return container === window ? window.scrollY : container.scrollTop
}

export function getViewportHeight(container: ScrollContainer): number {
  return container === window ? window.innerHeight : container.clientHeight
}

export function getScrollableHeight(container: ScrollContainer): number {
  if (container === window) {
    return Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
  }

  return container.scrollHeight
}

export function getElementScrollOffset(
  element: HTMLElement,
  container: ScrollContainer,
): number {
  const rect = element.getBoundingClientRect()
  if (container === window) {
    return rect.top + window.scrollY
  }

  const containerRect = container.getBoundingClientRect()
  return rect.top - containerRect.top + container.scrollTop
}

export function scrollContainerTo(
  container: ScrollContainer,
  options: ScrollToOptions,
): void {
  if (container === window) {
    window.scrollTo(options)
    return
  }

  container.scrollTo(options)
}

export function addScrollListener(
  container: ScrollContainer,
  listener: EventListenerOrEventListenerObject,
): void {
  if (container === window) {
    window.addEventListener('scroll', listener, { passive: true })
    return
  }

  container.addEventListener('scroll', listener, { passive: true })
}

export function removeScrollListener(
  container: ScrollContainer,
  listener: EventListenerOrEventListenerObject,
): void {
  if (container === window) {
    window.removeEventListener('scroll', listener)
    return
  }

  container.removeEventListener('scroll', listener)
}

function isElementScrollContainer(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element)
  return (
    /(auto|scroll|overlay)/.test(style.overflowY) &&
    element.scrollHeight > element.clientHeight + 1
  )
}
