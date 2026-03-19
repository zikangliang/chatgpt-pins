import { buildMessageSummary, buildTooltipPreview, truncateText } from '../../content/summary'

describe('summary helpers', () => {
  test('truncates long text', () => {
    expect(truncateText('abcdefghijklmnopqrstuvwxyz', 10)).toBe('abcdefghi…')
  })

  test('returns code summary for code-only content', () => {
    const element = document.createElement('div')
    element.innerHTML = '<pre><code>const root = document.querySelector("main")</code></pre>'

    expect(
      buildMessageSummary(element, 'const root = document.querySelector("main")'),
    ).toContain('代码片段')
  })

  test('returns fallback for non-text messages', () => {
    const element = document.createElement('div')
    element.innerHTML = '<img alt="diagram" src="/foo.png" />'

    expect(buildMessageSummary(element, '')).toBe('非文本消息')
  })

  test('builds longer tooltip preview from original text', () => {
    expect(buildTooltipPreview('这是一段比较长的原始消息内容，用于验证 tooltip 预览优先显示原文。', '短摘要')).toContain(
      '这是一段比较长的原始消息内容',
    )
  })
})
