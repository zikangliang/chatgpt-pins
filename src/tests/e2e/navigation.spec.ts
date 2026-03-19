import { expect, test } from '@playwright/test'

test('renders user anchors and navigates to target turn', async ({ page }) => {
  await page.goto('/playground/mock-chatgpt.html')

  const items = page.locator('[data-testid="pins-item"]')
  await expect(items).toHaveCount(4)

  const targetItem = items.nth(2)
  const anchorId = await targetItem.getAttribute('data-anchor-id')
  await targetItem.click()

  await expect(targetItem).toHaveAttribute('aria-current', 'true')
  await expect
    .poll(async () =>
      page.locator('.chat-scroll-area').evaluate((element) => element.scrollTop),
    )
    .toBeGreaterThan(0)
  await expect(
    page.locator(`[data-chatgpt-pins-anchor-id="${anchorId}"].chatgpt-pins-highlight`),
  ).toHaveCount(1)
})
