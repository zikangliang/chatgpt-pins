export class Tooltip {
  private readonly element: HTMLDivElement

  constructor(root: ShadowRoot) {
    this.element = document.createElement('div')
    this.element.className = 'pins-tooltip'
    this.element.hidden = true
    root.append(this.element)
  }

  show(anchor: HTMLElement, content: string): void {
    this.element.textContent = content
    this.element.hidden = false

    const rect = anchor.getBoundingClientRect()
    const tooltipRect = this.element.getBoundingClientRect()
    const right = window.innerWidth - rect.left + 18
    const top = Math.min(
      Math.max(rect.top - 6, 12),
      window.innerHeight - tooltipRect.height - 12,
    )

    this.element.style.right = `${right}px`
    this.element.style.top = `${top}px`
  }

  hide(): void {
    this.element.hidden = true
  }
}
