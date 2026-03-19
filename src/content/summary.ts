import { SUMMARY_LENGTH, TOOLTIP_PREVIEW_LENGTH } from '../shared/constants'

export function sanitizeMessageText(text: string): string {
  return text.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim()
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}…`
}

export function buildMessageSummary(element: HTMLElement, text: string): string {
  const normalized = sanitizeMessageText(text)
  const hasCodeBlock = Boolean(element.querySelector('pre, code'))
  const hasBodyText = Boolean(element.querySelector('p, li, blockquote'))
  const hasMedia = Boolean(element.querySelector('img, video, canvas, picture, svg'))

  if (hasCodeBlock && !hasBodyText) {
    if (!normalized) {
      return '代码片段'
    }

    const firstLine = normalized.split('\n')[0] ?? normalized
    return truncateText(`代码片段：${firstLine}`, SUMMARY_LENGTH)
  }

  if (normalized) {
    return truncateText(normalized, SUMMARY_LENGTH)
  }

  if (hasMedia) {
    return '非文本消息'
  }

  return '空白消息'
}

export function buildTooltipPreview(text: string, summary: string): string {
  const normalized = sanitizeMessageText(text)
  if (!normalized) {
    return summary
  }

  return truncateText(normalized, TOOLTIP_PREVIEW_LENGTH)
}
