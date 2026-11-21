import { expect, test } from '@playwright/test'

// External font stylesheets can block DOMContentLoaded; tests use system fonts.
test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }))
})

test('ad board renders compact promotion cards with icons and navigates to studio collection', async ({ page }) => {
  await page.goto('/about/advertise', { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => {
    const app = document.querySelector('#app')
    return app && '__vue_app__' in app
  })

  const board = page.locator('aside[aria-label="小云广告之家"]:visible')
  await expect(board).toHaveCount(1)
  await expect(board).toBeVisible()
  await expect(board.locator('iframe')).toHaveCount(0)

  const cookLink = board.getByRole('link', { name: /云食册/ })
  const studioLink = board.getByRole('link', { name: /小云梦工坊/ })
  await expect(cookLink).toHaveAttribute('href', 'https://cook.yunle.fun')
  await expect(studioLink).toHaveAttribute('href', '/collections/studio/')

  const icons = board.locator('.recommendation-icon')
  await expect(icons).toHaveCount(2)
  for (let i = 0; i < 2; i++) {
    const box = await icons.nth(i).boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(0)
    expect(box!.height).toBeGreaterThan(0)
  }

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)

  await page.evaluate(() => {
    const aside = [...document.querySelectorAll('aside[aria-label="小云广告之家"]')]
      .find(el => (el as HTMLElement).offsetParent !== null)
    const cardEl = aside?.closest('.yun-card')
    if (cardEl) {
      const rect = cardEl.getBoundingClientRect()
      window.scrollTo(0, Math.max(0, window.scrollY + rect.top - 96))
    }
  })

  const card = page.locator('.yun-card:has(aside[aria-label="小云广告之家"]):visible')
  await card.screenshot({ path: test.info().outputPath('ad-board.png') })

  await studioLink.scrollIntoViewIfNeeded()
  await studioLink.click()
  await expect(page).toHaveURL(/\/collections\/studio\/?$/)
})
