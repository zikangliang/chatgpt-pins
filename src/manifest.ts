import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  manifest_version: 3,
  name: 'ChatGPT Pins',
  version: '0.1.0',
  description: 'Navigate long ChatGPT conversations by user message anchors.',
  action: {
    default_title: 'ChatGPT Pins',
  },
  host_permissions: ['https://chatgpt.com/*', 'https://chat.openai.com/*'],
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://chatgpt.com/*', 'https://chat.openai.com/*'],
      js: ['src/content/index.ts'],
      run_at: 'document_idle',
    },
  ],
})
