import { waitForElement } from '../shared/dom'
import { logger } from '../shared/logger'
import { resolveScrollContainer } from '../shared/scroll'
import { ActiveTracker } from './active-tracker'
import { extractAnchors } from './extractor'
import { highlightElement } from './highlighter'
import { scrollToAnchor } from './navigator'
import { ConversationObserver } from './observer'
import { findConversationRoot, getConversationKey } from './selectors'
import { NavigationStore } from './store'
import { trackTheme } from './theme'
import { NavigationPanel } from './ui/panel'
import { createUiRoot } from './ui/root'

const BOOTSTRAP_FLAG = '__chatgptPinsBootstrapped__'

declare global {
  interface Window {
    __chatgptPinsBootstrapped__?: boolean
  }
}

export async function bootstrap(): Promise<void> {
  if (window[BOOTSTRAP_FLAG]) {
    return
  }

  window[BOOTSTRAP_FLAG] = true
  await waitForElement(() => document.body)

  const store = new NavigationStore()
  const uiRoot = createUiRoot()
  const activeTracker = new ActiveTracker((activeId) => {
    store.setActiveId(activeId)
  })
  const observer = new ConversationObserver(() => {
    rebuild('mutation')
  })

  let observedRoot: HTMLElement | null = null
  let currentConversationKey = getConversationKey()
  let scrollContainer = resolveScrollContainer(document.body)

  new NavigationPanel(uiRoot.shadowRoot, store, {
    onNavigate: (anchor) => {
      store.setActiveId(anchor.id)
      scrollToAnchor(anchor, scrollContainer)
      highlightElement(anchor.element)
    },
    onToggleCollapsed: (collapsed) => {
      store.setCollapsed(collapsed)
    },
  })

  trackTheme((theme) => {
    store.setTheme(theme)
  })

  activeTracker.start()

  const rebuild = (reason: string) => {
    const root = findConversationRoot()
    if (!root) {
      logger.debug('conversation root not found')
      store.setAnchors([])
      observer.observe(null)
      return
    }

    const nextConversationKey = getConversationKey()
    if (nextConversationKey !== currentConversationKey) {
      currentConversationKey = nextConversationKey
      store.setConversationKey(nextConversationKey)
    }

    if (observedRoot !== root) {
      observedRoot = root
      observer.observe(root)
    }

    scrollContainer = resolveScrollContainer(root)
    activeTracker.setScrollContainer(scrollContainer)

    const anchors = extractAnchors(root, {
      conversationKey: nextConversationKey,
      roleFilter: 'user',
      scrollContainer,
    })
    logger.debug(`rebuild (${reason})`, anchors.length)
    store.setAnchors(anchors)
    activeTracker.setAnchors(anchors)
    activeTracker.sync()
  }

  rebuild('initial')

  window.setInterval(() => {
    const nextConversationKey = getConversationKey()
    if (nextConversationKey !== currentConversationKey) {
      rebuild('route-change')
      return
    }

    if (store.snapshot().anchors.length === 0) {
      rebuild('recheck')
    }
  }, 800)
}
