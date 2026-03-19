export class ConversationObserver {
  private observer: MutationObserver | null = null
  private debounceTimer: number | null = null
  private readonly onChange: () => void

  constructor(onChange: () => void) {
    this.onChange = onChange
  }

  observe(root: HTMLElement | null): void {
    if (!root) {
      this.disconnect()
      return
    }

    if (this.observer) {
      this.disconnect()
    }

    this.observer = new MutationObserver(() => {
      if (this.debounceTimer !== null) {
        window.clearTimeout(this.debounceTimer)
      }

      this.debounceTimer = window.setTimeout(() => {
        this.onChange()
      }, 120)
    })

    this.observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
    })
  }

  disconnect(): void {
    this.observer?.disconnect()
    this.observer = null
    if (this.debounceTimer !== null) {
      window.clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }
  }
}
