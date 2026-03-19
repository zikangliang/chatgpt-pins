import type { MessageAnchor, NavigationState, ThemeMode } from '../shared/types'

type Listener = (state: NavigationState) => void

function createInitialState(): NavigationState {
  return {
    anchors: [],
    activeId: null,
    collapsed: false,
    theme: 'light',
    conversationKey: null,
  }
}

export class NavigationStore {
  private state: NavigationState = createInitialState()
  private listeners = new Set<Listener>()

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    listener(this.snapshot())

    return () => {
      this.listeners.delete(listener)
    }
  }

  snapshot(): NavigationState {
    return {
      ...this.state,
      anchors: [...this.state.anchors],
    }
  }

  setAnchors(nextAnchors: MessageAnchor[]): void {
    const activeStillExists = nextAnchors.some((anchor) => anchor.id === this.state.activeId)
    this.state = {
      ...this.state,
      anchors: nextAnchors,
      activeId: activeStillExists ? this.state.activeId : nextAnchors[0]?.id ?? null,
    }
    this.notify()
  }

  setActiveId(activeId: string | null): void {
    if (this.state.activeId === activeId) {
      return
    }

    this.state = {
      ...this.state,
      activeId,
    }
    this.notify()
  }

  setCollapsed(collapsed: boolean): void {
    if (this.state.collapsed === collapsed) {
      return
    }

    this.state = {
      ...this.state,
      collapsed,
    }
    this.notify()
  }

  setTheme(theme: ThemeMode): void {
    if (this.state.theme === theme) {
      return
    }

    this.state = {
      ...this.state,
      theme,
    }
    this.notify()
  }

  setConversationKey(conversationKey: string | null): void {
    if (this.state.conversationKey === conversationKey) {
      return
    }

    this.state = {
      ...this.state,
      conversationKey,
      anchors: [],
      activeId: null,
    }
    this.notify()
  }

  private notify(): void {
    const snapshot = this.snapshot()
    for (const listener of this.listeners) {
      listener(snapshot)
    }
  }
}
