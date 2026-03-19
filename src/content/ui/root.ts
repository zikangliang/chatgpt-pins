import { EXTENSION_ROOT_ID, ROOT_Z_INDEX } from '../../shared/constants'
import styles from './styles.css?inline'

export type UiRoot = {
  host: HTMLDivElement
  shadowRoot: ShadowRoot
}

export function createUiRoot(): UiRoot {
  const existing = document.getElementById(EXTENSION_ROOT_ID)
  if (existing) {
    existing.remove()
  }

  const host = document.createElement('div')
  host.id = EXTENSION_ROOT_ID
  host.style.position = 'fixed'
  host.style.inset = '0 auto auto 0'
  host.style.width = '0'
  host.style.height = '0'
  host.style.pointerEvents = 'none'
  host.style.zIndex = ROOT_Z_INDEX

  const shadowRoot = host.attachShadow({ mode: 'open' })
  const styleTag = document.createElement('style')
  styleTag.textContent = styles
  shadowRoot.append(styleTag)

  document.documentElement.append(host)

  return { host, shadowRoot }
}
