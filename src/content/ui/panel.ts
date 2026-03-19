import type { MessageAnchor, NavigationState } from '../../shared/types'
import { PANEL_WIDTH_PX } from '../../shared/constants'
import { buildTooltipPreview } from '../summary'
import type { NavigationStore } from '../store'
import { Tooltip } from './tooltip'

type PanelOptions = {
  onNavigate: (anchor: MessageAnchor) => void
  onToggleCollapsed: (collapsed: boolean) => void
}

export class NavigationPanel {
  private readonly store: NavigationStore
  private readonly options: PanelOptions
  private readonly tooltip: Tooltip
  private readonly shell: HTMLDivElement
  private anchorsById = new Map<string, MessageAnchor>()

  constructor(root: ShadowRoot, store: NavigationStore, options: PanelOptions) {
    this.store = store
    this.options = options
    this.tooltip = new Tooltip(root)
    this.shell = document.createElement('div')
    this.shell.className = 'pins-shell'
    root.append(this.shell)
    this.bindEvents()
    this.store.subscribe((state) => {
      this.render(state)
    })
  }

  private bindEvents(): void {
    this.shell.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const item = target.closest<HTMLElement>('[data-anchor-id]')
      if (item) {
        const anchor = this.anchorsById.get(item.dataset.anchorId ?? '')
        if (anchor) {
          this.options.onNavigate(anchor)
        }
        return
      }

      const toggle = target.closest<HTMLElement>('[data-action="toggle-panel"]')
      if (toggle) {
        const collapsed = toggle.dataset.collapsed === 'true'
        this.options.onToggleCollapsed(!collapsed)
      }
    })

    this.shell.addEventListener('mouseover', (event) => {
      const target = event.target as HTMLElement
      const item = target.closest<HTMLElement>('[data-anchor-id]')
      if (!item) {
        return
      }

      const anchor = this.anchorsById.get(item.dataset.anchorId ?? '')
      if (!anchor) {
        return
      }

      this.tooltip.show(item, buildTooltipPreview(anchor.text, anchor.summary))
    })

    this.shell.addEventListener('mouseout', (event) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-anchor-id]')) {
        return
      }

      this.tooltip.hide()
    })
  }

  private render(state: NavigationState): void {
    this.anchorsById = new Map(state.anchors.map((anchor) => [anchor.id, anchor]))
    const title = `我的消息 (${state.anchors.length})`
    const items = state.anchors
      .map((anchor) => {
        const isActive = anchor.id === state.activeId
        return `
          <button
            type="button"
            class="pins-item${isActive ? ' is-active' : ''}"
            data-testid="pins-item"
            data-anchor-id="${anchor.id}"
            aria-current="${isActive ? 'true' : 'false'}"
          >
            <span class="pins-item-index">[${String(anchor.index).padStart(2, '0')}]</span>
            <span class="pins-item-summary">${escapeHtml(anchor.summary)}</span>
          </button>
        `
      })
      .join('')

    const themeClass = state.theme === 'dark' ? 'theme-dark' : 'theme-light'
    if (state.collapsed) {
      this.shell.innerHTML = `
        <div class="pins-mini ${themeClass}">
          <button
            type="button"
            class="pins-mini-button"
            data-action="toggle-panel"
            data-collapsed="true"
          >
            Pins
          </button>
        </div>
      `
      return
    }

    this.shell.innerHTML = `
      <aside class="pins-panel ${themeClass}" style="--pins-panel-width: ${PANEL_WIDTH_PX}px;">
        <header class="pins-header">
          <div>
            <div class="pins-eyebrow">ChatGPT Pins</div>
            <div class="pins-title">${title}</div>
          </div>
          <button
            type="button"
            class="pins-collapse-button"
            data-action="toggle-panel"
            data-collapsed="false"
          >
            收起
          </button>
        </header>
        <div class="pins-list" data-testid="pins-list">
          ${
            items ||
            '<div class="pins-empty">当前会话还没有识别到可导航的用户消息。</div>'
          }
        </div>
      </aside>
    `

    const activeItem = this.shell.querySelector<HTMLElement>('.pins-item.is-active')
    activeItem?.scrollIntoView({ block: 'nearest' })
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
