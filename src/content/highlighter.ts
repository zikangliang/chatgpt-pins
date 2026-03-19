import { GLOBAL_HIGHLIGHT_STYLE_ID } from '../shared/constants'

const HIGHLIGHT_CLASS = 'chatgpt-pins-highlight'

export function highlightElement(element: HTMLElement, durationMs = 1_800): void {
  ensureHighlightStyle()
  element.classList.remove(HIGHLIGHT_CLASS)
  void element.offsetWidth
  element.classList.add(HIGHLIGHT_CLASS)

  window.setTimeout(() => {
    element.classList.remove(HIGHLIGHT_CLASS)
  }, durationMs)
}

function ensureHighlightStyle(): void {
  if (document.getElementById(GLOBAL_HIGHLIGHT_STYLE_ID)) {
    return
  }

  const style = document.createElement('style')
  style.id = GLOBAL_HIGHLIGHT_STYLE_ID
  style.textContent = `
    @keyframes chatgpt-pins-flash {
      0% {
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.7), 0 0 0 8px rgba(59, 130, 246, 0.18);
        background-color: rgba(59, 130, 246, 0.14);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
        background-color: transparent;
      }
    }

    .${HIGHLIGHT_CLASS} {
      border-radius: 18px;
      animation: chatgpt-pins-flash 1.8s ease;
    }
  `

  document.head.append(style)
}
