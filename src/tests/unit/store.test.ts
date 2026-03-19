import type { MessageAnchor } from '../../shared/types'
import { NavigationStore } from '../../content/store'

function createAnchor(id: string, index: number): MessageAnchor {
  const element = document.createElement('div')
  return {
    id,
    index,
    role: 'user',
    text: `message-${id}`,
    summary: `summary-${id}`,
    element,
    topOffset: index * 100,
  }
}

describe('NavigationStore', () => {
  test('resets active item when anchors change', () => {
    const store = new NavigationStore()
    const anchorA = createAnchor('a', 1)
    const anchorB = createAnchor('b', 2)

    store.setAnchors([anchorA, anchorB])
    store.setActiveId(anchorB.id)
    store.setAnchors([anchorA])

    expect(store.snapshot().activeId).toBe(anchorA.id)
  })

  test('clears state on conversation switch', () => {
    const store = new NavigationStore()
    store.setAnchors([createAnchor('a', 1)])
    store.setConversationKey('/c/new-thread')

    expect(store.snapshot().anchors).toHaveLength(0)
    expect(store.snapshot().activeId).toBeNull()
  })
})
