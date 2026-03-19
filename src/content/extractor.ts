import type { MessageAnchor, MessageRole } from '../shared/types'
import { hashText } from '../shared/dom'
import type { ScrollContainer } from '../shared/scroll'
import { getElementScrollOffset } from '../shared/scroll'
import { buildMessageSummary } from './summary'
import {
  queryTurnElements,
  resolveMessageRole,
  resolveRoleNode,
  resolveTargetElement,
} from './selectors'

type ExtractAnchorsOptions = {
  conversationKey: string
  roleFilter?: MessageRole
  scrollContainer: ScrollContainer
}

export function extractAnchors(
  root: ParentNode,
  options: ExtractAnchorsOptions,
): MessageAnchor[] {
  const turns = queryTurnElements(root)
  const roleFilter = options.roleFilter ?? 'user'
  const anchors: MessageAnchor[] = []
  let visibleIndex = 0

  for (const turn of turns) {
    const role = resolveMessageRole(turn)
    if (!role || role !== roleFilter) {
      continue
    }

    const roleNode = resolveRoleNode(turn) ?? turn
    const targetElement = resolveTargetElement(turn)
    const text = extractMessageText(roleNode)
    const summary = buildMessageSummary(roleNode, text)
    visibleIndex += 1

    const id =
      targetElement.dataset.messageId ??
      hashText(
        `${options.conversationKey}:${visibleIndex}:${role}:${summary}:${text.slice(0, 160)}`,
      )

    targetElement.dataset.chatgptPinsAnchorId = id

    anchors.push({
      id,
      index: visibleIndex,
      role,
      text,
      summary,
      element: targetElement,
      topOffset: calculateTopOffset(targetElement, options.scrollContainer),
    })
  }

  return anchors
}

function extractMessageText(element: HTMLElement): string {
  const clone = element.cloneNode(true) as HTMLElement
  clone
    .querySelectorAll('button, textarea, input, select, nav, aside, script, style')
    .forEach((node) => {
      node.remove()
    })

  const blockNodes = Array.from(
    clone.querySelectorAll<HTMLElement>(
      'p, li, pre, blockquote, h1, h2, h3, h4, h5, td, th',
    ),
  )
  const textParts = (blockNodes.length > 0 ? blockNodes : [clone])
    .map((node) => node.textContent?.trim() ?? '')
    .filter(Boolean)

  return Array.from(new Set(textParts)).join('\n').trim()
}

function calculateTopOffset(
  element: HTMLElement,
  scrollContainer: ScrollContainer,
): number {
  return getElementScrollOffset(element, scrollContainer)
}
