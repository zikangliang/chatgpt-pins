import type { MessageAnchor } from '../shared/types'
import { NAVIGATION_SCROLL_OFFSET_PX } from '../shared/constants'
import type { ScrollContainer } from '../shared/scroll'
import { getElementScrollOffset, scrollContainerTo } from '../shared/scroll'

export function scrollToAnchor(
  anchor: MessageAnchor,
  scrollContainer: ScrollContainer,
): void {
  const targetTop = getElementScrollOffset(anchor.element, scrollContainer)
  scrollContainerTo(scrollContainer, {
    top: Math.max(targetTop - NAVIGATION_SCROLL_OFFSET_PX, 0),
    behavior: 'smooth',
  })
}
