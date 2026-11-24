import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

async function waitForHydration(page: Page) {
  await page.waitForFunction(() => {
    const app = document.querySelector('#app')
    return Boolean(app && '__vue_app__' in app)
  })
}

test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }))
  await page.route('https://fonts.gstatic.com/**', route => route.fulfill({ contentType: 'font/woff2', body: '' }))
  await page.route('https://waline.yunyoujun.cn/**', (route) => {
    const url = route.request().url()
    if (url.includes('/api/comment') && url.includes('type=count')) {
      return route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ errno: 0, errmsg: '', data: [0] }),
      })
    }
    if (url.includes('/api/article')) {
      return route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ errno: 0, errmsg: '', data: [{ time: 0 }] }),
      })
    }
    return route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        errno: 0,
        errmsg: '',
        data: { data: [], count: 0, totalPages: 1, page: 1, pageSize: 10 },
      }),
    })
  })
  await page.route('https://unpkg.com/**', route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ name: 'emoji', folder: '', icon: 'smile', prefix: '', type: 'png', items: [] }),
  }))
  await page.route('https://www.googletagmanager.com/**', route => route.fulfill({ contentType: 'text/javascript', body: '' }))
  await page.route('https://analytics.google.com/**', route => route.fulfill({ contentType: 'text/javascript', body: '' }))
})

test('cook-app interactive components work end-to-end across desktop, mobile, and dark mode', async ({ page }) => {
  test.setTimeout(60_000)

  const consoleErrors: string[] = []
  const pageErrors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !msg.text().includes('Failed to load resource'))
      consoleErrors.push(msg.text())
  })
  page.on('pageerror', err => pageErrors.push(err.message))

  let playerRequests = 0
  await page.route('https://player.bilibili.com/**', async (route) => {
    playerRequests += 1
    await route.fulfill({ contentType: 'text/html', body: '<p>Mock Bilibili Player</p>' })
  })

  await page.goto('/posts/cook-app', { waitUntil: 'domcontentloaded' })
  await waitForHydration(page)
  await expect(page).toHaveTitle(/云食册/)
  await expect(page.locator('vite-error-overlay')).toHaveCount(0)

  // Lazy video load contract preserved
  await expect(page.locator('.studio-video iframe')).toHaveCount(0)
  expect(playerRequests).toBe(0)

  // No horizontal overflow
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)

  // 1. CookAppRenameStamp
  const origin = page.locator('#cook-origin')
  await expect(origin).toBeVisible({ timeout: 12000 })
  const renameBtn = origin.getByRole('button', { name: '去掉「隔离」' })
  await expect(renameBtn).toHaveAttribute('aria-pressed', 'false')
  await renameBtn.click()
  await expect(origin.getByRole('button', { name: '恢复原名' })).toHaveAttribute('aria-pressed', 'true')
  await expect(origin).toContainText('云食册')

  // 2. CookAppFridgeSim
  const fridge = page.locator('#cook-fridge')
  await expect(fridge).toBeVisible()
  await expect(fridge.locator('.cook-status')).toHaveText('3 项临期优先')

  const slider = fridge.getByRole('slider', { name: '向后推演天数' })
  await expect(slider).toBeVisible()
  await expect(slider).toHaveAttribute('aria-valuenow', '0')

  await fridge.getByRole('button', { name: '+2 天' }).click()
  await expect(slider).toHaveAttribute('aria-valuenow', '2')
  await expect(fridge.locator('.cook-fridge-days').first()).toContainText('已超期')

  await slider.focus()
  await page.keyboard.press('ArrowRight')
  await expect(slider).toHaveAttribute('aria-valuenow', '3')

  await fridge.getByRole('button', { name: '模拟离线扫包装算保质期' }).click()
  await expect(fridge.locator('.cook-fridge-item')).toHaveCount(6)
  await expect(fridge.locator('.cook-scan-callout')).toContainText('自动算出剩 2 天')
  await expect(fridge.locator('.cook-status')).toHaveText('4 项临期优先')

  await fridge.getByRole('button', { name: /用临期食材去挑菜/ }).click()

  // 3. CookAppDishPlayground (Pick + Swipe)
  const playground = page.locator('#cook-playground')
  await expect(playground).toBeVisible()
  await expect(playground.locator('.cook-sync-banner')).toContainText('已从冰箱带入')
  await expect(playground.locator('.cook-sync-banner')).toContainText('鸡翅')

  await playground.getByRole('button', { name: '空气炸锅' }).click()
  await expect(playground.locator('.cook-recipe-card')).toContainText('空气炸锅蒜香鸡翅')

  await playground.getByRole('button', { name: '全部厨具' }).click()
  const chooseFirstBtn = playground.locator('.cook-recipe-choose').first()
  await chooseFirstBtn.click()
  await expect(chooseFirstBtn).toHaveAttribute('aria-pressed', 'true')
  await expect(playground.locator('.cook-chosen-bar')).toBeVisible()

  // Switch to swipe tab
  const swipeTab = playground.getByRole('tab', { name: '横向滑卡抽签' })
  await swipeTab.click()
  await expect(swipeTab).toHaveAttribute('aria-selected', 'true')
  const topTitleBefore = await playground.locator('.cook-swipe-card.is-top .cook-swipe-title').textContent()
  await playground.getByRole('button', { name: /换一道/ }).click()
  const topTitleAfter = await playground.locator('.cook-swipe-card.is-top .cook-swipe-title').textContent()
  expect(topTitleAfter).not.toBe(topTitleBefore)
  await playground.getByRole('button', { name: /就吃这道|已选这道/ }).click()
  await expect(playground.locator('.cook-chosen-bar')).toContainText(topTitleAfter!.trim())

  // 4. CookAppLearnedNote (localStorage persistence, no fake 3D badges)
  const learned = page.locator('#cook-learned')
  await expect(learned).toBeVisible()
  await expect(learned.locator('.cook-learned-name')).toHaveText(topTitleAfter!.trim())
  await learned.getByRole('button', { name: '今天学会了' }).click()
  await expect(learned.getByRole('button', { name: '今天已记下 ✓' })).toHaveAttribute('aria-pressed', 'true')
  await expect(learned.locator('.cook-learned-record')).toContainText(topTitleAfter!.trim())

  // Reload and verify localStorage persistence
  await page.reload({ waitUntil: 'domcontentloaded' })
  await waitForHydration(page)
  const learnedAfterReload = page.locator('#cook-learned')
  await expect(learnedAfterReload.locator('.cook-learned-record')).toContainText(topTitleAfter!.trim())

  // 5. CookAppChapters -> triggers StudioVideo seek
  const chapters = page.locator('#cook-chapters')
  await expect(chapters).toBeVisible()
  await chapters.getByRole('button', { name: /01:26/ }).click()

  const iframe = page.locator('.studio-video iframe')
  await expect(iframe).toBeVisible()
  await expect(iframe).toHaveAttribute('src', /bvid=BV14LyezKE6J.*t=86.*autoplay=0/)
  await expect.poll(() => playerRequests).toBeGreaterThanOrEqual(1)
  await expect(page.getByRole('link', { name: 'B 站空降 01:26 ↗' })).toHaveAttribute(
    'href',
    'https://www.bilibili.com/video/BV14LyezKE6J?t=86',
  )
  await expect(page.getByRole('link', { name: '在 B 站观看' })).toHaveAttribute(
    'href',
    'https://www.bilibili.com/video/BV14LyezKE6J',
  )

  // Verify zero horizontal overflow after interactions
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)

  // Contrast check on active .cook-figure elements in current theme (desktop/dark/mobile)
  const contrastReport = await page.evaluate(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext('2d')!

    function toRgba(cssColor: string): [number, number, number, number] {
      ctx.clearRect(0, 0, 1, 1)
      ctx.fillStyle = cssColor
      ctx.fillRect(0, 0, 1, 1)
      const data = ctx.getImageData(0, 0, 1, 1).data
      return [data[0], data[1], data[2], data[3] / 255]
    }

    function compositeOver(fg: [number, number, number, number], bg: [number, number, number]): [number, number, number] {
      const a = fg[3]
      return [
        fg[0] * a + bg[0] * (1 - a),
        fg[1] * a + bg[1] * (1 - a),
        fg[2] * a + bg[2] * (1 - a),
      ]
    }

    function luminance(rgb: [number, number, number]): number {
      const [r, g, b] = rgb.map((channel) => {
        const value = channel / 255
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    function contrast(a: [number, number, number], b: [number, number, number]): number {
      const lumA = luminance(a)
      const lumB = luminance(b)
      const [lo, hi] = [lumA, lumB].sort((x, y) => x - y)
      return (hi + 0.05) / (lo + 0.05)
    }

    function resolveEffectiveBg(el: Element): [number, number, number] {
      const isDark = document.documentElement.classList.contains('dark')
      let base: [number, number, number] = isDark ? [17, 17, 20] : [255, 255, 255]
      const chain: Element[] = []
      let curr: Element | null = el
      while (curr) {
        chain.unshift(curr)
        curr = curr.parentElement
      }
      for (const node of chain) {
        const bg = getComputedStyle(node).backgroundColor
        if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
          const parsed = toRgba(bg)
          if (parsed[3] > 0)
            base = compositeOver(parsed, base)
        }
      }
      return base
    }

    const targets = [
      document.querySelector('#cook-origin .cook-rename-base'),
      document.querySelector('#cook-origin .cook-btn--primary'),
      document.querySelector('#cook-fridge .yun-slider-mark.is-active'),
      document.querySelector('#cook-fridge .cook-btn--primary'),
      document.querySelector('#cook-learned .cook-btn--primary'),
      document.querySelector('#cook-chapters .cook-chapter-time'),
    ].filter((el): el is Element => Boolean(el))

    return targets.map((el) => {
      const bg = resolveEffectiveBg(el)
      const fg = compositeOver(toRgba(getComputedStyle(el).color), bg)
      return {
        text: el.textContent?.trim() ?? '',
        ratio: contrast(fg, bg),
      }
    })
  })

  expect(contrastReport.length).toBe(6)
  for (const item of contrastReport)
    expect(item.ratio, `Contrast failed for "${item.text}"`).toBeGreaterThanOrEqual(4.5)

  expect(consoleErrors).toEqual([])
  expect(pageErrors).toEqual([])
})
