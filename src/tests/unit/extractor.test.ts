import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { extractAnchors } from '../../content/extractor'

function loadFixture(name: string): string {
  return readFileSync(resolve(process.cwd(), 'src/tests/fixtures', name), 'utf8')
}

describe('extractAnchors', () => {
  test('only extracts user messages in order', () => {
    document.body.innerHTML = loadFixture('chat-thread-basic.html')

    const root = document.querySelector('main')
    expect(root).not.toBeNull()

    const anchors = extractAnchors(root!, {
      conversationKey: '/c/test-1',
      roleFilter: 'user',
      scrollContainer: window,
    })

    expect(anchors).toHaveLength(2)
    expect(anchors.map((anchor) => anchor.index)).toEqual([1, 2])
    expect(anchors.map((anchor) => anchor.summary)).toEqual([
      '请帮我整理需求',
      '我要做一个 ChatGPT 长会话导航插件。',
    ])
  })

  test('keeps stable ids from message attributes', () => {
    document.body.innerHTML = loadFixture('chat-thread-basic.html')

    const anchors = extractAnchors(document.querySelector('main')!, {
      conversationKey: '/c/test-1',
      roleFilter: 'user',
      scrollContainer: window,
    })

    expect(anchors[0]?.id).toBe('user-1')
    expect(anchors[1]?.id).toBe('user-2')
  })
})
