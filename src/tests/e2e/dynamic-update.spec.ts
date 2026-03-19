import { expect, test } from '@playwright/test'

test('refreshes anchors on new messages and conversation switch', async ({ page }) => {
  await page.goto('/playground/mock-chatgpt.html')

  const items = page.locator('[data-testid="pins-item"]')
  await expect(items).toHaveCount(4)

  await page.click('#add-user-message')
  await expect(items).toHaveCount(5)

  await page.click('#switch-conversation')
  await expect(items).toHaveCount(2)
})
