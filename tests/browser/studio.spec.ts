import { expect, test } from '@playwright/test'

// External font stylesheets can block DOMContentLoaded; navigation tests use system fonts.
test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }))
})

test('column links to article, discloses AI, and loads video only on keyboard activation', async ({ page, isMobile }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('Failed to load resource'))
      errors.push(message.text())
  })
  // Test the host integration without depending on third-party playback availability.
  let playerRequests = 0
  await page.route('https://player.bilibili.com/**', async (route) => {
    playerRequests++
    await route.fulfill({ contentType: 'text/html', body: '<p>Test player</p>' })
  })
  await page.goto('/collections/xiaoyun/', { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveTitle(/小云梦工坊/)
  expect(await page.evaluate(() => window.innerWidth)).toBe(page.viewportSize()!.width)
  await expect(page.getByRole('heading', { name: /把没做完的想法，\s*继续做下去。/ })).toBeVisible()
  await expect(page.locator('vite-error-overlay')).toHaveCount(0)
  await expect(page.locator('.studio-video iframe')).toHaveCount(0)
  expect(playerRequests).toBe(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: test.info().outputPath('studio.png'), fullPage: true })

  await page.getByRole('link', { name: '阅读本期手记' }).click()
  await expect(page).toHaveURL(/\/posts\/xiaoyun-studio-01-ak-ui/)
  await expect(page).toHaveTitle(/小云梦工坊 #01/)
  const disclosure = page.locator('.ai-disclosure')
  await expect(disclosure.locator('button')).toHaveText('AI 生成')
  await expect(disclosure.locator('svg[aria-hidden="true"]')).toBeVisible()
  const tooltip = page.getByRole('dialog', { name: /AI 生成/ })
  if (!isMobile) {
    await disclosure.locator('button').hover()
    await expect(tooltip).toContainText('本文由 AI 根据作者已发布')
    await expect(tooltip).toBeVisible()
    await page.screenshot({ path: test.info().outputPath('ai-tooltip.png'), animations: 'disabled' })
    await page.keyboard.press('Escape')
    await expect(tooltip).toHaveCount(0)
    await page.mouse.move(0, 0)
  }
  await disclosure.locator('button').focus()
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Tab')
  await expect(tooltip).toContainText('本文由 AI 根据作者已发布')
  await expect(tooltip).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(tooltip).toHaveCount(0)
  const before = await disclosure.boundingBox()
  const triggerBox = (await disclosure.locator('button').boundingBox())!
  expect(Math.abs(triggerBox.x + triggerBox.width / 2 - before!.x - before!.width / 2)).toBeLessThan(1)
  if (isMobile)
    await disclosure.locator('button').tap()
  else
    await page.keyboard.press('Enter')
  await expect(tooltip).toBeVisible()
  const bubble = (await tooltip.boundingBox())!
  expect(Math.abs(bubble.x + bubble.width / 2 - triggerBox.x - triggerBox.width / 2)).toBeLessThan(1)
  expect(bubble.x).toBeGreaterThanOrEqual(16)
  expect(bubble.x + bubble.width).toBeLessThanOrEqual(page.viewportSize()!.width)
  expect(await disclosure.boundingBox()).toEqual(before)
  await page.keyboard.press('Escape')
  await expect(tooltip).toHaveCount(0)
  const play = page.getByRole('button', { name: /^加载视频：/ })
  await play.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.studio-video iframe')).toHaveAttribute('src', /bvid=BV11RY26oEs6.*autoplay=0/)
  await expect.poll(() => playerRequests).toBe(1)
  await expect(page.getByRole('link', { name: '在 B 站观看' })).toHaveAttribute('href', 'https://www.bilibili.com/video/BV11RY26oEs6')
  await page.screenshot({ path: test.info().outputPath('article.png'), fullPage: true })
  await page.getByRole('link', { name: '小云梦工坊视频专栏' }).click()
  await expect(page).toHaveURL(/\/collections\/xiaoyun\/?$/)
  await expect(page.locator('.studio-video iframe')).toHaveCount(0)

  await page.goto('/posts/death-and-rebirth-of-open-source-projects', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: '开源项目的「死与新生」', exact: true })).toBeVisible()
  await expect(page.locator('.ai-disclosure')).toHaveCount(0)
  expect(errors).toEqual([])
})

test('video stays usable when the cover fails', async ({ page }) => {
  await page.route('**/63bd1317e9d1c16d5f187be334b6c841c4b8dd72.jpg', route => route.abort())
  await page.goto('/collections/xiaoyun/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.studio-video-fallback')).toBeVisible()
  await expect(page.getByRole('button', { name: /^加载视频：/ })).toBeEnabled()
  await expect(page.getByRole('link', { name: '在 B 站观看' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('collection index and legacy URL lead to the single-collection directory', async ({ page }) => {
  await page.goto('/studio/', { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveURL(/\/collections\/xiaoyun\/?$/)
  await expect(page.getByRole('heading', { name: '小云梦工坊', exact: true })).toBeVisible()
  await expect(page.locator('.yun-collection-sidebar select')).toHaveCount(0)
  await expect(page.locator('.post-meta')).toHaveCount(0)
  if (page.viewportSize()!.width < 1024)
    await page.getByRole('button', { name: '合集目录', exact: true }).click()
  const directory = page.locator('.yun-collection-sidebar:visible')
  await directory.getByRole('link', { name: '第 01 期 · 用 AI 复活七年前的 ak-ui' }).click()
  await expect(page).toHaveURL(/\/posts\/xiaoyun-studio-01-ak-ui/)
  if (page.viewportSize()!.width < 1024) {
    const toggle = page.getByRole('button', { name: '合集目录', exact: true })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await toggle.click()
  }
  await expect(page.locator('.yun-collection-sidebar:visible .item a[aria-current="page"]')).toBeVisible()
  await page.goto('/collections/', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('link', { name: /小云梦工坊/ }).first()).toBeVisible()
  await expect(page.locator('.yun-collection-sidebar')).toHaveCount(0)
})

test('mobile collection drawer supports keyboard control without shifting its trigger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/collections/xiaoyun/', { waitUntil: 'domcontentloaded' })
  const directory = page.getByRole('complementary', { name: '合集目录', exact: true })
  const toggle = page.getByRole('button', { name: '合集目录', exact: true })
  await expect(toggle).toBeVisible()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  const initial = (await toggle.boundingBox())!
  for (let index = 0; index < 2; index++) {
    await toggle.focus()
    await page.keyboard.press('Enter')
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(directory).toBeVisible()
    await expect(directory.getByRole('button', { name: '关闭菜单' })).toBeFocused()
    const current = (await toggle.boundingBox())!
    expect(Math.abs(current.x - initial.x)).toBeLessThan(1)
    expect(Math.abs(current.y - initial.y)).toBeLessThan(1)
    expect(Math.abs(current.width - initial.width)).toBeLessThan(1)
    expect(Math.abs(current.height - initial.height)).toBeLessThan(1)
    await page.keyboard.press('Escape')
    await expect(directory).not.toBeVisible()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(toggle).toBeFocused()
  }
  await page.keyboard.press('Enter')
  await expect(directory.getByRole('link', { name: '第 01 期 · 用 AI 复活七年前的 ak-ui' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: test.info().outputPath('collection-directory.png'), animations: 'disabled' })
})

test('ak-ui surfaces switch palettes with readable text and stay local to the project', async ({ page }) => {
  await page.goto('/collections/xiaoyun/', { waitUntil: 'domcontentloaded' })
  const card = page.locator('.studio-episode[data-project-theme="ak-ui"]')
  await expect(card).toBeVisible()
  const surfaces: string[] = []
  for (const dark of [false, true]) {
    if (await page.locator('html').evaluate(el => el.classList.contains('dark')) !== dark)
      await page.locator('.yun-toggle-dark').click()
    await expect.poll(() => page.locator('html').evaluate(el => el.classList.contains('dark'))).toBe(dark)
    const colors = await card.evaluate((element) => {
      const style = getComputedStyle(element)
      const primary = getComputedStyle(element.querySelector('.studio-primary-link')!)
      return {
        surface: style.backgroundColor,
        text: getComputedStyle(element.querySelector('h3')!).color,
        muted: getComputedStyle(element.querySelector('.studio-episode-body p')!).color,
        link: getComputedStyle(element.querySelector('.studio-links a:last-child')!).color,
        button: primary.backgroundColor,
        buttonText: primary.color,
        rootAccent: getComputedStyle(document.documentElement).getPropertyValue('--studio-accent'),
      }
    })
    function luminance(color: string) {
      const values = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map((channel) => {
        const value = channel / 255
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
      })
      return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722
    }
    function contrast(a: string, b: string) {
      const values = [luminance(a), luminance(b)].sort((x, y) => x - y)
      return (values[1] + 0.05) / (values[0] + 0.05)
    }
    for (const foreground of [colors.text, colors.muted, colors.link])
      expect(contrast(foreground, colors.surface)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(colors.buttonText, colors.button)).toBeGreaterThanOrEqual(4.5)
    expect(colors.rootAccent).toBe('')
    surfaces.push(colors.surface)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    await card.screenshot({ path: test.info().outputPath(`ak-ui-${dark ? 'dark' : 'light'}.png`), animations: 'disabled' })
  }
  expect(surfaces[0]).not.toBe(surfaces[1])
})
