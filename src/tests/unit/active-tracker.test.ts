import type { MessageAnchor } from '../../shared/types'
import { pickActiveAnchor } from '../../content/active-tracker'

function createAnchor(id: string, topOffset: number): MessageAnchor {
  return {
    id,
    index: 1,
    role: 'user',
    text: id,
    summary: id,
    element: document.createElement('div'),
    topOffset,
  }
}

describe('pickActiveAnchor', () => {
  test('pins the last anchor when the reader reaches the page bottom', () => {
    const anchors = [
      createAnchor('a', 0),
      createAnchor('b', 260),
      createAnchor('c', 800),
    ]

    expect(pickActiveAnchor(anchors, 340, 900, 1_200)?.id).toBe('c')
  })

  test('picks the latest anchor above the focus line', () => {
    const anchors = [
      createAnchor('a', 0),
      createAnchor('b', 200),
      createAnchor('c', 500),
    ]

    expect(pickActiveAnchor(anchors, 60, 900, 1_600)?.id).toBe('b')
    expect(pickActiveAnchor(anchors, 420, 900, 1_600)?.id).toBe('c')
  })

  test('returns null with no anchors', () => {
    expect(pickActiveAnchor([], 0, 900, 1_600)).toBeNull()
  })
})
