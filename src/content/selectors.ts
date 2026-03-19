import type { MessageRole } from '../shared/types'
import { dedupeElements } from '../shared/dom'

const TURN_SELECTORS = [
  'article[data-testid^="conversation-turn-"]',
  '[data-testid^="conversation-turn-"]',
]

const ROOT_SELECTORS = ['main', '[role="main"]', '#__next main']

export function findConversationRoot(root: ParentNode = document): HTMLElement | null {
  const candidates = dedupeElements(
    ROOT_SELECTORS.map((selector) => root.querySelector<HTMLElement>(selector)).filter(
      (element): element is HTMLElement => Boolean(element),
    ),
  )

  if (!candidates.length) {
    return document.body
  }

  return candidates.sort((left, right) => countTurns(right) - countTurns(left))[0] ?? null
}

export function queryTurnElements(root: ParentNode): HTMLElement[] {
  const directTurns = dedupeElements(
    TURN_SELECTORS.flatMap((selector) =>
      Array.from(root.querySelectorAll<HTMLElement>(selector)),
    ),
  )

  if (directTurns.length > 0) {
    return directTurns
  }

  return dedupeElements(
    Array.from(root.querySelectorAll<HTMLElement>('[data-message-author-role]')).map(
      (element) =>
        element.closest<HTMLElement>('article, section, div[data-message-author-role]') ?? element,
    ),
  )
}

export function resolveMessageRole(turn: HTMLElement): MessageRole | null {
  const roleNode = resolveRoleNode(turn)
  const role = roleNode?.getAttribute('data-message-author-role')
  if (role === 'user' || role === 'assistant') {
    return role
  }

  return null
}

export function resolveRoleNode(turn: HTMLElement): HTMLElement | null {
  if (turn.matches('[data-message-author-role]')) {
    return turn
  }

  return turn.querySelector<HTMLElement>('[data-message-author-role]')
}

export function resolveTargetElement(turn: HTMLElement): HTMLElement {
  return turn.closest<HTMLElement>('article') ?? turn
}

export function getConversationKey(): string {
  const path = window.location.pathname || '/'
  if (path !== '/') {
    return path
  }

  return document.body.dataset.conversationKey ?? '/'
}

function countTurns(root: ParentNode): number {
  return TURN_SELECTORS.reduce(
    (count, selector) => count + root.querySelectorAll(selector).length,
    0,
  )
}
