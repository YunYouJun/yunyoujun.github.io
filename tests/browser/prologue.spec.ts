import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }))
})

test('homepage hero navigation and social icons reflect harmonized theme styling', async ({ page, isMobile }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))

  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2500)

  if (testInfo.project.name === 'dark')
    await expect(page.locator('html')).toHaveClass(/\bdark\b/)

  const prologueContent = page.locator('.yun-home-prologue-content.is-intro-complete')
  await expect(prologueContent).toBeVisible()

  const info = prologueContent.locator('.yun-square-container .info')
  await expect(info).toBeVisible()

  const nav = page.locator('.prologue-navigation')
  await expect(nav).toBeVisible()
  await expect(nav).toHaveAttribute('data-style', 'glass')

  const navLinks = nav.locator('.yun-site-link-item')
  await expect(navLinks.first()).toBeVisible()
  await expect.poll(async () => {
    return nav.evaluate(el => getComputedStyle(el).opacity)
  }).toBe('1')

  const labelColors = await nav.locator('.yun-site-link-label').evaluateAll(els =>
    els.map(el => getComputedStyle(el).color),
  )
  expect(labelColors.length).toBeGreaterThanOrEqual(6)
  expect(new Set(labelColors).size).toBe(1)

  const iconColors = await nav.locator('.yun-site-link-item .icon').evaluateAll(els =>
    els.map(el => getComputedStyle(el).color),
  )
  expect(new Set(iconColors).size).toBeGreaterThanOrEqual(5)
  expect(iconColors).not.toContain('rgb(255, 0, 0)')
  expect(iconColors).not.toContain('rgb(255, 105, 180)')

  const socialIcons = page.locator('.prologue-social .links-of-author-item .icon')
  const socialCount = await socialIcons.count()
  expect(socialCount).toBeGreaterThan(0)
  const restingSocialColors = await socialIcons.evaluateAll(els =>
    els.map(el => getComputedStyle(el).color),
  )
  expect(new Set(restingSocialColors).size).toBeGreaterThan(1)

  const bilibiliLink = page.locator('.prologue-social .links-of-author-item[title="哔哩哔哩"]')
  await expect(bilibiliLink).toBeVisible()
  const bilibiliRestingColor = await bilibiliLink.locator('.icon').evaluate(el => getComputedStyle(el).color)
  expect(bilibiliRestingColor).not.toBe('rgb(255, 142, 179)')

  if (!isMobile) {
    await bilibiliLink.hover()
    await expect.poll(async () => {
      return bilibiliLink.locator('.icon').evaluate(el => getComputedStyle(el).color)
    }).toBe('rgb(255, 142, 179)')
    await page.mouse.move(0, 0)
    await expect.poll(async () => {
      return bilibiliLink.locator('.icon').evaluate(el => getComputedStyle(el).color)
    }).toBe(bilibiliRestingColor)
  }

  const goDown = page.locator('#yun-banner .go-down')
  await expect(goDown).toBeVisible()
  const goDownRadius = await goDown.evaluate(el => Number.parseFloat(getComputedStyle(el).borderTopLeftRadius))
  expect(goDownRadius).toBeGreaterThanOrEqual(20)

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('prologue-hero.png'), animations: 'disabled' })

  const firstCard = page.locator('.yun-post-list :is(.post-card-wrapper, .collection-card)').first()
  await expect(firstCard).toBeVisible()
  await firstCard.scrollIntoViewIfNeeded()

  const backToTop = page.locator('.back-to-top.show')
  await expect(backToTop).toBeVisible()

  const firstTag = page.locator('.yun-card-actions .post-tag').first()
  await expect(firstTag).toBeVisible()
  if (!isMobile) {
    await firstTag.scrollIntoViewIfNeeded()
    const tagRestingBg = await firstTag.evaluate(el => getComputedStyle(el).backgroundColor)
    await firstTag.hover()
    await expect.poll(async () => {
      return firstTag.evaluate(el => getComputedStyle(el).backgroundColor)
    }).not.toBe(tagRestingBg)
    const hoveredTag = await firstTag.evaluate((el) => {
      const style = getComputedStyle(el)
      return {
        bg: style.backgroundColor,
        color: style.color,
      }
    })
    expect(hoveredTag.bg).not.toBe('rgb(59, 130, 246)')
    expect(hoveredTag.bg).not.toBe(hoveredTag.color)
    await page.mouse.move(0, 0)
  }

  await firstCard.scrollIntoViewIfNeeded()
  await page.waitForTimeout(200)
  await page.screenshot({ path: testInfo.outputPath('home-feed.png'), animations: 'disabled' })

  const pagination = page.locator('nav.pagination')
  await expect(pagination).toBeVisible()
  await pagination.scrollIntoViewIfNeeded()
  await expect(backToTop).toBeVisible()
  await page.waitForTimeout(200)
  await page.screenshot({ path: testInfo.outputPath('home-pagination.png'), animations: 'disabled' })

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  expect(errors).toEqual([])
})
