import { expect, test } from '@playwright/test'

test('updates active item when the page scrolls', async ({ page }) => {
  await page.goto('/playground/mock-chatgpt.html')

  const items = page.locator('[data-testid="pins-item"]')
  await expect(items).toHaveCount(4)

  await page.locator('.chat-scroll-area').evaluate((element) => {
    element.scrollTo({
      top: element.scrollHeight,
      behavior: 'instant',
    })
  })

  await expect(items.nth(3)).toHaveAttribute('aria-current', 'true')
})
