import { expect, test } from '@playwright/test'

const missingPath = `/missing-article-${'x'.repeat(80)}`
const issuePage = 'https://github.com/YunYouJun/yunyoujun.github.io/issues/new'

test.beforeEach(async ({ page }) => {
  await page.route(`**${missingPath}*`, route => route.fulfill({
    path: 'dist/404.html',
    contentType: 'text/html',
    status: 404,
  }))
})

test('reports a missing page and provides a way back', async ({ context, page }) => {
  await context.route(`${issuePage}?*`, route => route.fulfill({ body: 'Issue form' }))

  const response = await page.goto(`${missingPath}?preview=sample#section`)
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
  await expect(page.locator('.yun-404-path')).toHaveText(missingPath)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth))

  const report = page.getByRole('link', { name: /GitHub/ })
  await expect(report).toHaveAttribute('rel', 'noreferrer')
  const [issue] = await Promise.all([page.waitForEvent('popup'), report.click()])
  await expect(issue.getByText('Issue form')).toBeVisible()
  const url = new URL(issue.url())
  expect(url.searchParams.get('title')).toBe(`404: ${missingPath}`)
  expect(url.searchParams.get('body')).toContain(missingPath)
  expect(url.searchParams.get('body')).not.toMatch(/preview=sample|#section/)
  await issue.close()

  await page.getByRole('button', { name: '返回', exact: true }).click()
  await expect(page).toHaveURL('/')
})

test.describe('before hydration', () => {
  test.use({ javaScriptEnabled: false })

  test('offers a generic report link on the static fallback', async ({ page }) => {
    await page.goto(missingPath)

    const report = page.getByRole('link', { name: /GitHub/ })
    await expect(report).toBeVisible()
    await expect(report).toHaveAttribute('href', /\/issues\/new\?title=404&body=/)
    await expect(page.locator('.yun-404-path')).toHaveCount(0)
  })
})
