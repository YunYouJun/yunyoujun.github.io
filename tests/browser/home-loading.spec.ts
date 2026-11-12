import { expect, test } from '@playwright/test'

const analyticsChunk = /\/assets\/analytics\.[^/]+\.js$/
const analyticsScript = /^https:\/\/(?:www\.clarity\.ms\/tag\/|www\.googletagmanager\.com\/gtag\/js\?)/
const fuseChunk = /\/YunFuseSearch\.[^/]+\.js$/
const fuseIndex = /\/valaxy-fuse-list\.json$/

test('defers analytics without delaying the home animation or first search', async ({ page }) => {
  const avatar = Promise.withResolvers<void>()
  const analytics = Promise.withResolvers<void>()
  const requests: string[] = []
  page.on('request', request => requests.push(request.url()))

  await page.route('https://**/*', route => route.abort())
  await page.route('**/images/avatar.webp', async (route) => {
    await avatar.promise
    await route.continue()
  })
  await page.route(analyticsChunk, async (route) => {
    await analytics.promise
    await route.continue()
  })
  await page.route(analyticsScript, route => route.fulfill({ contentType: 'text/javascript', body: '' }))
  await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }))

  try {
    const avatarRequested = page.waitForRequest('**/images/avatar.webp')
    await page.goto('/', { waitUntil: 'commit' })
    await avatarRequested
    await expect(page.locator('#yun-banner .banner-char-container')).toBeAttached()
    await expect(page.locator('.yun-home-prologue-content .line-burst-effects')).toBeAttached()
    expect(requests.filter(url => analyticsChunk.test(url) || analyticsScript.test(url))).toEqual([])
    expect(requests.filter(url => fuseChunk.test(url) || fuseIndex.test(url))).toEqual([])

    await page.locator('.yun-search-btn').click()
    const dialog = page.getByRole('dialog')
    const input = dialog.getByRole('searchbox')
    await expect(input).toBeFocused()
    await input.fill('Hexo 静态博客搭建笔记')
    const result = dialog.locator('.yun-search-result').first()
    await expect(result).toHaveAttribute('href', /^\/posts\//)
    const articlePath = (await result.getAttribute('href'))!
    expect(requests.filter(url => fuseChunk.test(url))).toHaveLength(1)
    expect(requests.filter(url => fuseIndex.test(url))).toHaveLength(1)
    expect(requests.filter(url => analyticsChunk.test(url) || analyticsScript.test(url))).toEqual([])

    const analyticsRequested = page.waitForRequest(analyticsChunk)
    avatar.resolve()
    await analyticsRequested
    await result.click()
    await expect(page).toHaveURL(url => url.pathname === articlePath)

    analytics.resolve()
    await expect.poll(() => page.evaluate(() => {
      const { dataLayer = [] } = window as Window & { dataLayer?: ArrayLike<unknown>[] }
      return dataLayer
        .filter(entry => entry[0] === 'event' && entry[1] === 'page_view')
        .map(entry => (entry[2] as { page_path: string }).page_path)
    })).toEqual(['/', articlePath])
    await expect.poll(() => requests.filter(url => analyticsScript.test(url)).map(url => new URL(url).hostname).sort())
      .toEqual(['www.clarity.ms', 'www.googletagmanager.com'])
  }
  finally {
    avatar.resolve()
    analytics.resolve()
  }
})
