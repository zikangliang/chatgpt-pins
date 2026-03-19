import type { MessageAnchor } from '../shared/types'
import { ACTIVE_TRACKER_OFFSET_PX } from '../shared/constants'
import type { ScrollContainer } from '../shared/scroll'
import {
  addScrollListener,
  getScrollPosition,
  getScrollableHeight,
  getViewportHeight,
  removeScrollListener,
} from '../shared/scroll'
import { throttle } from '../shared/throttle'

export function pickActiveAnchor(
  anchors: MessageAnchor[],
  scrollPosition: number,
  viewportHeight: number,
  scrollableHeight: number,
): MessageAnchor | null {
  if (anchors.length === 0) {
    return null
  }

  if (scrollPosition + viewportHeight >= scrollableHeight - 24) {
    return anchors.at(-1) ?? null
  }

  const targetLine =
    scrollPosition + Math.min(ACTIVE_TRACKER_OFFSET_PX, viewportHeight * 0.24)
  let active = anchors[0] ?? null

  for (const anchor of anchors) {
    if (anchor.topOffset <= targetLine) {
      active = anchor
      continue
    }

    break
  }

  return active
}

export class ActiveTracker {
  private anchors: MessageAnchor[] = []
  private scrollContainer: ScrollContainer = window
  private isStarted = false
  private readonly onChange: (activeId: string | null) => void
  private readonly handleScroll = throttle(() => {
    this.sync()
  }, 60)

  constructor(onChange: (activeId: string | null) => void) {
    this.onChange = onChange
  }

  start(): void {
    this.isStarted = true
    addScrollListener(this.scrollContainer, this.handleScroll)
    window.addEventListener('resize', this.handleScroll)
  }

  stop(): void {
    this.isStarted = false
    removeScrollListener(this.scrollContainer, this.handleScroll)
    window.removeEventListener('resize', this.handleScroll)
  }

  setScrollContainer(scrollContainer: ScrollContainer): void {
    if (this.scrollContainer === scrollContainer) {
      return
    }

    if (this.isStarted) {
      removeScrollListener(this.scrollContainer, this.handleScroll)
    }

    this.scrollContainer = scrollContainer

    if (this.isStarted) {
      addScrollListener(this.scrollContainer, this.handleScroll)
    }
  }

  setAnchors(anchors: MessageAnchor[]): void {
    this.anchors = anchors
  }

  sync(): void {
    const active = pickActiveAnchor(
      this.anchors,
      getScrollPosition(this.scrollContainer),
      getViewportHeight(this.scrollContainer),
      getScrollableHeight(this.scrollContainer),
    )
    this.onChange(active?.id ?? null)
  }
}
