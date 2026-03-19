import type { ThemeMode } from '../shared/types'

export function detectTheme(): ThemeMode {
  if (
    document.documentElement.classList.contains('dark') ||
    document.body.classList.contains('dark')
  ) {
    return 'dark'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function trackTheme(onChange: (theme: ThemeMode) => void): () => void {
  const applyTheme = () => {
    onChange(detectTheme())
  }

  const observer = new MutationObserver(applyTheme)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme'],
  })
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class', 'data-theme'],
  })

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', applyTheme)

  applyTheme()

  return () => {
    observer.disconnect()
    mediaQuery.removeEventListener('change', applyTheme)
  }
}
