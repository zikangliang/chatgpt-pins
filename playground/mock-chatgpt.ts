type Turn = {
  role: 'user' | 'assistant'
  content: string
  kind?: 'text' | 'code' | 'image'
}

const conversations: Record<string, Turn[]> = {
  'mock-1': [
    { role: 'user', content: '请帮我整理一个浏览器扩展的 MVP 范围。' },
    { role: 'assistant', content: '可以，先确定用户消息导航、跳转和高亮。' },
    {
      role: 'user',
      content: '我需要右侧目录，只显示用户消息，并且能在滚动时同步当前位置。',
    },
    {
      role: 'assistant',
      content: '建议再补 tooltip 预览和动态更新，这样会形成完整闭环。',
    },
    {
      role: 'user',
      content: `const root = document.querySelector('main')\nconst turns = root?.querySelectorAll('article')`,
      kind: 'code',
    },
    { role: 'user', content: '最后还要覆盖会话切换和深浅主题。' },
  ],
  'mock-2': [
    { role: 'user', content: '这是切换后的另一个会话。' },
    { role: 'assistant', content: '旧导航应当被清空。' },
    { role: 'user', content: '新会话里只有两条用户消息。' },
  ],
}

const conversationRoot = document.querySelector<HTMLElement>('#conversation-root')
const conversationScrollArea =
  document.querySelector<HTMLElement>('.chat-scroll-area')
const addUserButton = document.querySelector<HTMLButtonElement>('#add-user-message')
const addAssistantButton = document.querySelector<HTMLButtonElement>('#add-assistant-message')
const switchConversationButton = document.querySelector<HTMLButtonElement>('#switch-conversation')
const toggleThemeButton = document.querySelector<HTMLButtonElement>('#toggle-theme')

let currentConversationKey = 'mock-1'
let nextUserIndex = 1
let nextAssistantIndex = 1

function renderConversation(): void {
  if (!conversationRoot) {
    return
  }

  const turns = conversations[currentConversationKey]
  if (!turns) {
    return
  }

  conversationRoot.innerHTML = turns
    .map((turn, index) => createTurnMarkup(turn, index + 1))
    .join('')

  document.body.dataset.conversationKey = currentConversationKey
  history.replaceState({}, '', `/c/${currentConversationKey}`)
  nextUserIndex = turns.filter((turn) => turn.role === 'user').length + 1
  nextAssistantIndex = turns.filter((turn) => turn.role === 'assistant').length + 1
}

function createTurnMarkup(turn: Turn, index: number): string {
  const messageId = `${turn.role}-${index}`

  if (turn.kind === 'code') {
    return `
      <article data-testid="conversation-turn-${index}" data-message-id="${messageId}">
        <div data-message-author-role="${turn.role}">
          <pre><code>${escapeHtml(turn.content)}</code></pre>
        </div>
      </article>
    `
  }

  if (turn.kind === 'image') {
    return `
      <article data-testid="conversation-turn-${index}" data-message-id="${messageId}">
        <div data-message-author-role="${turn.role}">
          <img alt="Mock attachment" src="https://placehold.co/320x180" />
        </div>
      </article>
    `
  }

  return `
    <article data-testid="conversation-turn-${index}" data-message-id="${messageId}">
      <div data-message-author-role="${turn.role}">
        <p>${escapeHtml(turn.content)}</p>
      </div>
    </article>
  `
}

function appendTurn(turn: Turn): void {
  conversations[currentConversationKey]?.push(turn)
  renderConversation()
  conversationScrollArea?.scrollTo({
    top: conversationScrollArea.scrollHeight,
    behavior: 'instant',
  })
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

addUserButton?.addEventListener('click', () => {
  appendTurn({
    role: 'user',
    content: `新增用户消息 ${nextUserIndex}`,
  })
  nextUserIndex += 1
})

addAssistantButton?.addEventListener('click', () => {
  appendTurn({
    role: 'assistant',
    content: `新增助手消息 ${nextAssistantIndex}`,
  })
  nextAssistantIndex += 1
})

switchConversationButton?.addEventListener('click', () => {
  currentConversationKey = currentConversationKey === 'mock-1' ? 'mock-2' : 'mock-1'
  renderConversation()
  conversationScrollArea?.scrollTo({
    top: 0,
    behavior: 'instant',
  })
})

toggleThemeButton?.addEventListener('click', () => {
  document.body.classList.toggle('dark')
  document.documentElement.classList.toggle('dark')
})

renderConversation()
