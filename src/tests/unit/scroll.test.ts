import {
  getElementScrollOffset,
  getScrollPosition,
  resolveScrollContainer,
} from '../../shared/scroll'

describe('scroll helpers', () => {
  test('resolves the nearest scrollable ancestor', () => {
    const outer = document.createElement('div')
    const middle = document.createElement('div')
    const inner = document.createElement('div')

    outer.style.overflowY = 'auto'
    Object.defineProperty(outer, 'scrollHeight', { configurable: true, value: 1_000 })
    Object.defineProperty(outer, 'clientHeight', { configurable: true, value: 300 })

    outer.append(middle)
    middle.append(inner)
    document.body.append(outer)

    expect(resolveScrollContainer(inner)).toBe(outer)
  })

  test('computes offsets relative to an element scroll container', () => {
    const container = document.createElement('div')
    const target = document.createElement('article')

    Object.defineProperty(container, 'scrollTop', { configurable: true, value: 240 })
    container.getBoundingClientRect = () =>
      ({ top: 120, bottom: 520, left: 0, right: 0, width: 0, height: 400, x: 0, y: 120, toJSON: () => ({}) }) as DOMRect
    target.getBoundingClientRect = () =>
      ({ top: 360, bottom: 560, left: 0, right: 0, width: 0, height: 200, x: 0, y: 360, toJSON: () => ({}) }) as DOMRect

    expect(getElementScrollOffset(target, container)).toBe(480)
    expect(getScrollPosition(container)).toBe(240)
  })
})
