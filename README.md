# ChatGPT Pins

Message-level navigation for long ChatGPT conversations.

`ChatGPT Pins` is a browser extension for ChatGPT Web that builds a lightweight navigation panel from your own messages, so you can jump back to previous prompts, constraints, code snippets, and decision points without fighting the scrollbar.

English | [简体中文](README.zh-CN.md)

## Quick start (TL;DR)

Runtime: Node `>= 22`.

Primary tested setup so far: MacBook on macOS, using Chrome.

```bash
npm install
npm run build
```

Then:

1. Open `chrome://extensions` or `edge://extensions`
2. Turn on Developer mode
3. Click `Load unpacked`
4. Select `dist/`
5. Open a ChatGPT conversation at `https://chatgpt.com/*` or `https://chat.openai.com/*`

For local development:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:4173/playground/mock-chatgpt.html
```

## Why this exists

In long ChatGPT threads, the hardest thing to recover is usually not the assistant output. It is your own earlier input:

- the original requirement
- the corrected constraint
- the pasted code block
- the error log
- the branch where the conversation split

ChatGPT already gives you a full conversation timeline. What it does not give you is a usable message index.

`ChatGPT Pins` fills that gap with a low-interference, message-aware navigation layer.

## Highlights

- Detects user messages in the current ChatGPT conversation
- Builds a floating navigation panel on the right side
- Renders each anchor as `index + truncated summary`
- Shows a preview on hover
- Smooth-scrolls to the selected message
- Temporarily highlights the target after navigation
- Keeps the active item in sync with the current reading position
- Rebuilds automatically when new messages arrive
- Rebuilds automatically when the conversation changes
- Supports both light and dark themes
- Handles real ChatGPT internal scroll containers instead of assuming `window` scroll

## Current scope

This repository is focused on the first useful version of the product:

- current-conversation navigation
- user-message indexing
- hover preview
- click-to-jump
- active item sync
- dynamic refresh

Not included yet:

- cross-conversation indexing
- full-text search
- bookmarks or favorites
- export
- cloud sync
- settings UI

## Tested environment

Manual development and real-site validation to date have been performed primarily on:

- macOS on MacBook
- Google Chrome

Chrome is the primary verified browser for the current implementation. Edge remains part of the intended support matrix, but the day-to-day validation loop has been centered on Chrome first.

## From source (development)

Clone and install:

```bash
git clone <your-repo-url>
cd chatgpt-pins
npm install
```

Run the local playground:

```bash
npm run dev
```

Build the extension:

```bash
npm run build
```

Watch extension builds during development:

```bash
npm run dev:extension
```

## Load in browser

Build output is written to `dist/`.

To load the extension in Chrome or Edge:

1. Open `chrome://extensions` or `edge://extensions`
2. Enable Developer mode
3. Click `Load unpacked`
4. Select the `dist/` directory
5. Open a ChatGPT conversation page

Supported hosts:

- `https://chatgpt.com/*`
- `https://chat.openai.com/*`

If you rebuild the project:

1. Run `npm run build`
2. Click `Reload` on the extension card
3. Hard refresh the ChatGPT tab

## Development workflow

This project has two primary loops:

### 1. UI / interaction loop

Use the local playground to iterate on:

- panel rendering
- click navigation
- active item sync
- dynamic updates
- internal scroll container behavior

Command:

```bash
npm run dev
```

### 2. Extension validation loop

Use the built extension against the real ChatGPT site to validate:

- DOM selector stability
- content script injection
- host permissions
- real conversation rendering behavior
- compatibility with ChatGPT layout changes

Command:

```bash
npm run build
```

## Scripts

```bash
npm run dev
npm run dev:playground
npm run dev:extension
npm run lint
npm run test
npm run test:e2e
npm run build
```

What they do:

- `npm run dev`
  Starts the local playground server.
- `npm run dev:playground`
  Explicit playground-only Vite config.
- `npm run dev:extension`
  Rebuilds the extension in watch mode.
- `npm run lint`
  Runs ESLint over source and tooling files.
- `npm run test`
  Runs Vitest unit tests.
- `npm run test:e2e`
  Runs Playwright end-to-end tests against the local mock page.
- `npm run build`
  Builds the MV3 extension and validates generated bundle syntax.

## Testing strategy

The project currently uses three layers of validation:

### Unit tests

Focused on:

- message extraction
- summary generation
- navigation state
- scroll helper logic
- active anchor selection

### E2E tests

Focused on:

- panel rendering
- click-to-jump behavior
- active item synchronization
- dynamic updates after new messages
- conversation switching

### Real-site verification

Focused on:

- content script injection
- selector compatibility with real ChatGPT DOM
- host permission behavior
- internal scroll container compatibility

## Real-site verification checklist

When testing against real ChatGPT conversations, verify in this order:

1. The `ChatGPT Pins` panel appears on the right
2. The panel only lists user messages
3. Hover shows the expected summary/preview
4. Clicking an item scrolls to the correct message
5. The target message is highlighted after navigation
6. Manual scrolling updates the active item correctly
7. Sending a new message refreshes the list automatically
8. Switching to another conversation clears and rebuilds the panel

## Architecture

The codebase is intentionally split around the actual extension responsibilities:

```text
.
├─ docs/                  product and development docs
├─ playground/            local mock ChatGPT page
├─ src/
│  ├─ background/         MV3 background worker
│  ├─ content/            content script, navigation logic, injected UI
│  ├─ shared/             types, constants, DOM and scroll helpers
│  └─ tests/              unit tests, fixtures, E2E tests
├─ dist/                  build output
└─ public/                static assets
```

Core modules:

- `src/content/extractor.ts`
  Extracts user-message anchors from the rendered conversation DOM.
- `src/content/navigator.ts`
  Handles scroll-to-anchor behavior.
- `src/content/active-tracker.ts`
  Tracks current reading position and updates the active navigation item.
- `src/content/ui/`
  Owns the floating panel, tooltip, styling, and Shadow DOM injection.
- `src/shared/scroll.ts`
  Resolves the actual scroll container used by the page.

## Debugging

Start with these values in the ChatGPT page console:

```js
window.__chatgptPinsBootstrapped__
document.getElementById('chatgpt-pins-root')
```

Expected:

- `window.__chatgptPinsBootstrapped__ === true`
- `document.getElementById('chatgpt-pins-root')` returns the injected root node

Useful debugging path:

1. If the root is missing, suspect injection or host permission issues
2. If the root exists but no items render, suspect selector drift
3. If items render but clicking does not move the page, suspect scroll container resolution

## Build notes

`npm run build` does more than emit `dist/`.

It also runs a post-build syntax check over generated JavaScript bundles. This was added to catch a class of failures where the extension technically built, but the content script failed immediately at runtime due to broken emitted output.

## Known constraints

- ChatGPT DOM structure can change without notice
- The selector layer will need periodic maintenance
- The current version targets desktop web usage first
- The current implementation is intentionally local-first and session-scoped

## Roadmap

Likely next steps:

- search / filter inside the navigation panel
- user-only / assistant-only / all-message modes
- alternate navigation display styles
- bookmarks
- settings page
- cross-conversation navigation

## Documentation

- Product requirements: [`docs/chatgpt_message_navigation_prd_v1.md`](docs/chatgpt_message_navigation_prd_v1.md)
- Development plan: [`docs/chatgpt_message_navigation_development_plan_v1.md`](docs/chatgpt_message_navigation_development_plan_v1.md)
