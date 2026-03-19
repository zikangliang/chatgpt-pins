export type MessageRole = 'user' | 'assistant'

export type MessageAnchor = {
  id: string
  index: number
  role: MessageRole
  text: string
  summary: string
  element: HTMLElement
  topOffset: number
  timestamp?: string
}

export type ThemeMode = 'light' | 'dark'

export type NavigationState = {
  anchors: MessageAnchor[]
  activeId: string | null
  collapsed: boolean
  theme: ThemeMode
  conversationKey: string | null
}
