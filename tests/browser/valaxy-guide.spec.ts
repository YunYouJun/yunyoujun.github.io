import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { expect, test } from '@playwright/test'

const tutorialSource = readFileSync(
  resolve(process.cwd(), 'pages/posts/build-your-site-with-valaxy.md'),
  'utf-8',
)
const frontmatterMatch = tutorialSource.match(/^---\r?\n([\s\S]*?)\r?\n---/)
const isTutorialDraft = Boolean(frontmatterMatch && /^draft:\s*true\b/m.test(frontmatterMatch[1]))

// Isolate third-party fonts/analytics/comment network requests so offline or flaky TLS does not mask app errors.
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

test('tutorial guide components render and work end-to-end without console errors', async ({ page }, testInfo) => {
  // Note: PLAYWRIGHT_INCLUDE_DRAFTS=1 only lifts this skip guard; production `pnpm build`
  // still filters out draft posts, so pair it with `pnpm dev`.
  test.skip(
    isTutorialDraft && process.env.PLAYWRIGHT_INCLUDE_DRAFTS !== '1',
    'Skip production SSG check while build-your-site-with-valaxy.md is marked draft: true',
  )
  test.setTimeout(60_000)
  const consoleErrors: string[] = []
  const pageErrors: string[] = []

  page.on('console', (msg) => {
    if (msg.type() === 'error')
      consoleErrors.push(msg.text())
  })

  page.on('pageerror', (err) => {
    pageErrors.push(err.message)
  })

  await page.goto('/posts/build-your-site-with-valaxy', { waitUntil: 'domcontentloaded' })

  const stack = page.locator('.vg-stack')
  const roadmap = page.locator('.vg-roadmap')
  const env = page.locator('.vg-env')
  const cli = page.locator('.vg-cli')
  const tree = page.locator('.vg-tree')
  const playground = page.locator('.vg-playground')
  const flow = page.locator('.vg-flow')
  const deploy = page.locator('.vg-deploy')
  const hosts = page.locator('.vg-hosts')
  const mcp = page.locator('.vg-mcp')

  await expect(stack).toBeVisible({ timeout: 12000 })
  await expect(roadmap).toBeVisible()
  await expect(env).toBeVisible()
  await expect(cli).toBeVisible()
  await expect(tree).toBeVisible()
  await expect(playground).toBeVisible()
  await expect(flow).toBeVisible()
  await expect(deploy).toBeVisible()
  await expect(hosts).toBeVisible()
  await expect(mcp).toBeVisible()

  // 00. Adaptive Vue cover component renders, animates, and switches light/dark modes
  const pageCover = page.locator('.vg-cover[data-context="page"]')
  await expect(pageCover).toBeVisible({ timeout: 12000 })
  const coverSvgBox = await pageCover.locator('.vg-cover-svg').boundingBox()
  expect(coverSvgBox?.width).toBeGreaterThan(200)
  expect(coverSvgBox?.height).toBeGreaterThan(100)

  const initialDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  const lightCoverBg = 'rgb(238, 241, 249)'
  const darkCoverBg = 'rgb(21, 24, 34)'
  const initialCoverBg = initialDark ? darkCoverBg : lightCoverBg
  const toggledCoverBg = initialDark ? lightCoverBg : darkCoverBg

  await expect(pageCover).toHaveCSS('background-color', initialCoverBg)
  await pageCover.screenshot({ path: testInfo.outputPath(`cover-page-${initialDark ? 'dark' : 'light'}.png`), animations: 'disabled' })

  const orbitBtn = pageCover.locator('.vg-cover-orbit-btn')
  const orbitHit = pageCover.locator('.vg-cover-orbit-hit')
  const controlsBox = await pageCover.locator('.vg-cover-controls').boundingBox()
  const orbitHitBox = await orbitHit.boundingBox()
  expect(controlsBox).not.toBeNull()
  expect(orbitHitBox).not.toBeNull()
  expect(controlsBox!.x + controlsBox!.width).toBeLessThan(orbitHitBox!.x)
  await orbitBtn.click()
  await expect(orbitBtn).toHaveAttribute('aria-pressed', 'true')
  await expect(pageCover).toHaveClass(/\bis-orbiting\b/)
  await orbitHit.click()
  await expect(orbitBtn).toHaveAttribute('aria-pressed', 'false')
  await expect(pageCover).not.toHaveClass(/\bis-orbiting\b/)

  const themeBtn = pageCover.locator('.vg-cover-theme-btn')
  await expect(themeBtn).toBeVisible()
  await themeBtn.click()
  await expect(page.locator('html')).toHaveClass(initialDark ? /^(?!.*\bdark\b).*$/ : /\bdark\b/)
  await expect(pageCover).toHaveCSS('background-color', toggledCoverBg)
  await pageCover.screenshot({ path: testInfo.outputPath(`cover-page-${initialDark ? 'light' : 'dark'}.png`), animations: 'disabled' })

  // Restore initial theme so downstream contrast assertions test the project's native color scheme
  await themeBtn.click()
  await expect(pageCover).toHaveCSS('background-color', initialCoverBg)

  // Ensure no horizontal overflow on desktop or mobile viewports
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)

  // 0a. Inline tech-stack links render leading icons with valid links and non-img elements
  const inlineTechLabels = ['React', 'Vue', 'Svelte', 'Solid', 'Hexo', 'hexo-theme-yun', 'GitHub Pages', 'Travis CI', 'Valaxy']
  for (const label of inlineTechLabels) {
    const link = page.locator('.markdown-body a', { hasText: label }).first()
    await expect(link).toBeVisible()
    const href = await link.getAttribute('href')
    expect(href).toBeTruthy()
    const icon = link.locator('.inline-tech-icon')
    await expect(icon).toBeVisible()
    const box = await icon.boundingBox()
    expect(box?.width).toBeGreaterThan(0)
    expect(box?.height).toBeGreaterThan(0)
    await expect(link.locator('img')).toHaveCount(0)
  }

  // 0. Tech stack pills + Valaxy logo pointer-events check
  const stackLogoStyles = await stack.locator('.vg-stack-img').evaluate((el) => {
    const cs = window.getComputedStyle(el)
    return {
      pointerEvents: cs.pointerEvents,
      marginTop: cs.marginTop,
      marginBottom: cs.marginBottom,
      boxShadow: cs.boxShadow,
    }
  })
  expect(stackLogoStyles).toEqual({
    pointerEvents: 'none',
    marginTop: '0px',
    marginBottom: '0px',
    boxShadow: 'none',
  })
  const valaxyBox = await stack.getByRole('tab', { name: 'Valaxy' }).boundingBox()
  const mcpBox = await stack.getByRole('tab', { name: 'MCP' }).boundingBox()
  expect(valaxyBox).not.toBeNull()
  expect(mcpBox).not.toBeNull()
  expect(Math.abs(valaxyBox!.height - mcpBox!.height)).toBeLessThanOrEqual(1)
  expect(valaxyBox!.height).toBeLessThanOrEqual(48)
  await stack.getByRole('tab', { name: 'Vue 3' }).click()
  await expect(stack.locator('.vg-stack-note')).toContainText('交互组件体系')

  // 0.5 Env checklist -> syncs Step 1 completion with Roadmap (and stays PowerShell 5.1 compatible)
  await expect(env).toContainText('npm install -g pnpm')
  await expect(env).toContainText('pnpm --version')
  await expect(env).not.toContainText('&&')
  await expect(roadmap).not.toContainText('&&')
  await env.getByRole('button', { name: '标记 Node.js 已就绪' }).click()
  await env.getByRole('button', { name: '标记 pnpm 已就绪' }).click()
  await env.getByRole('button', { name: '标记 Git 已就绪' }).click()
  await env.getByRole('button', { name: '标记 VS Code 已就绪' }).click()
  await expect(env).toContainText('4/4 已就绪')
  await expect(roadmap).toContainText('1/5 已完成')
  await env.getByRole('button', { name: '清空勾选' }).click()
  await expect(env).toContainText('0/4 已就绪')
  await expect(roadmap).toContainText('0/5 已完成')

  // 1. Roadmap step selection & persistent checklist
  await expect(roadmap.locator('.vg-roadmap-jump')).toHaveAttribute('href', '#准备环境')
  await roadmap.getByRole('tab', { name: '第 5 步：部署上线' }).click()
  await expect(roadmap.locator('.vg-roadmap-detail')).toContainText('git push -u origin main')
  const jumpHref = await roadmap.locator('.vg-roadmap-jump').getAttribute('href')
  expect(jumpHref).toBe('#部署')

  await roadmap.getByRole('button', { name: '我做完了' }).click()
  await expect(roadmap).toContainText('1/5 已完成')
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(roadmap).toContainText('1/5 已完成')

  // Complete remaining steps 1..4 to trigger 5/5 milestone celebration
  for (const tabLabel of ['第 1 步：准备环境', '第 2 步：一条命令建站', '第 3 步：基础配置', '第 4 步：开始写作']) {
    await roadmap.getByRole('tab', { name: tabLabel }).click()
    await roadmap.getByRole('button', { name: '我做完了' }).click()
  }
  await expect(roadmap).toContainText('5/5 已完成')
  await expect(roadmap).toContainText('全程通关')
  await expect(roadmap.locator('.vg-roadmap-celebrate')).toContainText('5/5 全部完成')

  // 2. CLI simulator + shared project name propagation + compact preview drawer
  const projectInput = cli.getByLabel('Project name')
  await projectInput.fill('my-notes')
  await expect(cli.locator('.vg-cli-next-cmds')).toContainText('cd my-notes')
  await expect(tree.locator('.vg-tree-root')).toContainText('my-notes/')

  await cli.locator('.vg-cli-port-btn').click()
  await expect(cli.locator('.vg-cli-preview-drawer .vg-minisite')).toBeVisible()
  await cli.getByRole('button', { name: '重置默认选项' }).click()
  await expect(tree.locator('.vg-tree-root')).toContainText('valaxy-blog/')

  // 3. File tree explorer + collapsible hierarchy + beginner filter
  await tree.getByRole('treeitem', { name: /site\.config\.ts/ }).click()
  await expect(tree.locator('.vg-tree-detail')).toContainText('站点基本信息配置文件')
  await expect(tree.locator('.vg-tree-detail')).toContainText('Hexo: _config.yml')

  await tree.getByRole('treeitem', { name: /AGENTS\.md/ }).click()
  await expect(tree.locator('.vg-tree-detail')).toContainText('写给 AI 编程助手看的项目说明书')

  await tree.getByRole('button', { name: '只看新手必改 3 项' }).click()
  await expect(tree.locator('.vg-tree-detail')).toContainText('pages/posts/hello-valaxy.md')

  // 4. Config Playground ("Code IS the Control") + YunBannerCharContainer + Popover
  const bannerChars = playground.locator('.vg-minisite-banner .char')
  await expect(bannerChars).toHaveCount(5)
  await expect.poll(async () => {
    const rects = await bannerChars.evaluateAll(nodes =>
      nodes.map((node) => {
        const wrapper = node.closest('.char-left, .char-right') ?? node
        const style = window.getComputedStyle(wrapper)
        const charStyle = window.getComputedStyle(node)
        return {
          top: Math.round(node.getBoundingClientRect().top),
          opacity: Number(style.opacity),
          fontSize: Number.parseFloat(charStyle.fontSize),
        }
      }),
    )
    if (rects.length !== 5)
      return false
    for (let i = 0; i < rects.length; i++) {
      if (rects[i].opacity <= 0.9 || rects[i].fontSize <= 10)
        return false
      if (i > 0 && rects[i].top <= rects[i - 1].top)
        return false
    }
    return true
  }).toBe(true)

  await playground.getByRole('tab', { name: 'site.config.ts' }).click()
  await playground.getByLabel('站点标题 title').fill('星海博客')
  await expect(playground.locator('.vg-minisite-brand')).toHaveText('星海博客')
  await expect(playground).toContainText('整页刷新：0 次')

  await playground.getByRole('tab', { name: 'valaxy.config.ts' }).click()
  await playground.getByRole('button', { name: /选择主题主色/ }).click()
  const teleportedPopover = page.locator('#valaxy-teleports .vg-popover')
  await teleportedPopover.getByRole('button', { name: 'Valaxy 紫' }).click()
  await page.keyboard.press('Escape')
  const primaryCssVar = await playground.locator('.vg-minisite').evaluate(el =>
    (el as HTMLElement).style.getPropertyValue('--va-c-primary').trim(),
  )
  expect(primaryCssVar).toBe('#6E44FF')

  await playground.locator('.vg-shiki-bool').click()
  await expect(playground.locator('.vg-minisite-banner')).toHaveCount(0)

  await playground.locator('.vg-shiki-key', { hasText: 'primary' }).click()
  await expect(teleportedPopover).toContainText('colors?: { primary?: string }')
  await page.keyboard.press('Escape')

  // 5. Writing flow (HMR vs Full Reload + <!-- more --> excerpt slicer)
  const counterBtn = flow.locator('.vg-flow-counter')
  await counterBtn.click()
  await counterBtn.click()
  await expect(counterBtn).toContainText('Count: 2')

  await flow.getByLabel('文章标题 title').fill('Hello, Valaxy!')
  await flow.getByRole('button', { name: /保存并热更新/ }).click()
  await expect(flow.locator('.vg-flow-article-title')).toHaveText('Hello, Valaxy!')
  await expect(counterBtn).toContainText('Count: 2')

  await flow.getByRole('button', { name: /模拟整页刷新/ }).click()
  await expect(counterBtn).toContainText('Count: 0')

  const flowLogoStyles = await flow.locator('.vg-flow-logo img').evaluate((el) => {
    const cs = window.getComputedStyle(el)
    return {
      pointerEvents: cs.pointerEvents,
      marginTop: cs.marginTop,
      marginBottom: cs.marginBottom,
      boxShadow: cs.boxShadow,
    }
  })
  expect(flowLogoStyles).toEqual({
    pointerEvents: 'none',
    marginTop: '0px',
    marginBottom: '0px',
    boxShadow: 'none',
  })

  await flow.getByRole('tab', { name: /<!-- more --> 摘要裁剪/ }).click()
  await flow.getByRole('button', { name: '把 <!-- more --> 移到第 1 段后面' }).click()
  await expect(flow.locator('.vg-more-excerpt-body p')).toHaveCount(1)
  await expect(flow.locator('.vg-more-readmore')).toContainText('阅读全文')

  // 6. Deploy pipeline + repo base diff + broken base 404 mode
  await expect(deploy).toContainText('actions/checkout@v7')
  await expect(deploy).toContainText('fetch-depth: 0')

  await deploy.getByRole('button', { name: /pnpm install/ }).click()
  await expect(deploy.locator('.vg-deploy-step-detail code')).toHaveText('run: pnpm install')

  await deploy.getByRole('button', { name: /actions\/deploy-pages/ }).click()
  await expect(deploy).toContainText('actions/deploy-pages@v5')

  await deploy.getByRole('button', { name: 'my-blog' }).click()
  await expect(deploy.locator('.vg-deploy-repo-result')).toContainText('https://you.github.io/my-blog/')
  await expect(deploy.locator('.vg-deploy-repo-result')).toContainText('vite: { base: \'/my-blog/\' }')

  await deploy.getByRole('button', { name: '模拟忘了加 base' }).click()
  await expect(deploy.locator('.vg-minisite.is-broken-base')).toBeVisible()
  await expect(deploy.locator('.vg-broken-alert')).toContainText('GET https://you.github.io/assets/index.css → 404 Not Found')
  await expect(deploy.locator('.vg-broken-alert')).not.toContainText('/my-blog/assets/index.css')

  // 6.5 Multi-platform hosting switcher
  await hosts.getByRole('tab', { name: 'Vercel' }).click()
  await expect(hosts.locator('.vg-host-panel')).toContainText('vercel.json')
  await hosts.getByRole('tab', { name: 'Cloudflare Pages' }).click()
  await expect(hosts.locator('.vg-host-panel')).toContainText('pnpm build')

  // 7. MCP missing-link diagnostic popover + dark/light text contrast
  const squiggleBtn = mcp.getByRole('button', { name: /\[入门指南\]\(\/posts\/getting-started\)/ })
  const expectedSquiggleColor = await page.evaluate(() => {
    const isDark = document.documentElement.classList.contains('dark')
    const el = document.querySelector('.vg-mcp-squiggle')
    return {
      isDark,
      color: el ? window.getComputedStyle(el).color : '',
    }
  })
  expect(expectedSquiggleColor.color).toBe(
    expectedSquiggleColor.isDark ? 'rgb(158, 203, 255)' : 'rgb(3, 47, 98)',
  )
  await squiggleBtn.click()
  await expect(teleportedPopover).toContainText('missing-link')
  await expect(teleportedPopover).toContainText('/posts/getting-started')
  await page.keyboard.press('Escape')

  // 8. Epilogue Easter eggs (first-post launch card + postcard + AI prompt, blessing quote) & closing feedback section
  const firstPost = page.locator('.vg-firstpost')
  await expect(firstPost).toBeVisible()
  await expect(firstPost.locator('img')).toHaveCount(0)
  await firstPost.getByRole('button', { name: /给自己的小站立个项，顺手写下第一句/ }).click()
  const firstPostPanel = firstPost.locator('.vg-firstpost-panel')
  await expect(firstPostPanel).toBeVisible()
  await expect(firstPostPanel).toContainText('星海博客')
  await firstPost.getByLabel('写下第一句').fill('今晚点亮了我的小站。')
  await expect(firstPost.locator('.vg-postcard')).toContainText('今晚点亮了我的小站。')
  await firstPost.getByRole('button', { name: '立项盖章' }).click()
  await expect(firstPost.locator('.vg-postcard-stamp.is-stamped')).toContainText('已立项')
  await firstPost.getByRole('tab', { name: 'AI 建站指令' }).click()
  await expect(firstPost.locator('.vg-firstpost-prompt')).toContainText('星海博客')
  await expect(firstPost.locator('.vg-firstpost-prompt')).toContainText('#6E44FF')
  await expect(firstPost.locator('.vg-firstpost-prompt')).toContainText('今晚点亮了我的小站。')
  await expect(firstPost.getByRole('button', { name: '复制 AI 建站提示词' })).toBeVisible()
  await expect(firstPost.getByRole('button', { name: '保存明信片 PNG' })).toBeVisible()
  await expect(firstPost.getByRole('button', { name: '去评论区立个 Flag' })).toBeVisible()

  const blessing = page.locator('.vg-blessing')
  await expect(blessing).toBeVisible()
  await blessing.locator('.vg-blessing-trigger').click()
  await expect(blessing.locator('.vg-blessing-whisper')).toContainText('2020 → 2026')
  await expect(blessing.locator('.vg-blessing-whisper')).toContainText('已点亮 1 次')

  const feedback = page.locator('.vg-feedback')
  await expect(feedback).toBeVisible()
  await expect(feedback.locator('img')).toHaveCount(0)
  await expect(feedback.getByRole('button', { name: '前往评论区' })).toBeVisible()
  const discussionsLink = feedback.getByRole('link', { name: /Valaxy Discussions/ })
  const issuesLink = feedback.getByRole('link', { name: /Issues/ })
  await expect(discussionsLink).toHaveAttribute(
    'href',
    'https://github.com/YunYouJun/valaxy/discussions',
  )
  await expect(issuesLink).toHaveAttribute(
    'href',
    'https://github.com/YunYouJun/valaxy/issues',
  )
  for (const btnLink of [roadmap.locator('.vg-roadmap-jump'), discussionsLink, issuesLink]) {
    await expect(btnLink).toHaveCSS('border-bottom-width', '1px')
    await expect(btnLink).toHaveCSS('border-bottom-style', 'solid')
  }

  const hasOverflowAtEnd = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflowAtEnd).toBe(false)

  expect(consoleErrors).toEqual([])
  expect(pageErrors).toEqual([])
})

test('homepage post card renders adaptive ValaxyGuideCover without blocking navigation', async ({ page }, testInfo) => {
  test.skip(
    isTutorialDraft && process.env.PLAYWRIGHT_INCLUDE_DRAFTS !== '1',
    'Skip production SSG check while build-your-site-with-valaxy.md is marked draft: true',
  )
  test.setTimeout(60_000)
  const consoleErrors: string[] = []
  const pageErrors: string[] = []

  page.on('console', (msg) => {
    if (msg.type() === 'error')
      consoleErrors.push(msg.text())
  })

  page.on('pageerror', (err) => {
    pageErrors.push(err.message)
  })

  await page.goto('/', { waitUntil: 'domcontentloaded' })

  const card = page.locator('.yun-post-list .post-card-wrapper', {
    hasText: '用 Valaxy 从零搭建一个属于自己的网站',
  }).first()
  await card.scrollIntoViewIfNeeded()
  await expect(card).toBeVisible({ timeout: 12000 })

  const cardCover = card.locator('.vg-cover[data-context="card"]')
  await expect(cardCover).toBeVisible({ timeout: 12000 })

  const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  await expect(cardCover).toHaveCSS('background-color', isDark ? 'rgb(21, 24, 34)' : 'rgb(238, 241, 249)')

  const cardCoverBox = await cardCover.locator('.vg-cover-svg').boundingBox()
  expect(cardCoverBox?.width).toBeGreaterThan(150)
  expect(cardCoverBox?.height).toBeGreaterThan(80)

  const orbitBtn = cardCover.locator('.vg-cover-orbit-btn')
  await expect(orbitBtn).toBeVisible()
  await expect(cardCover.locator('.vg-cover-theme-btn')).toHaveCount(0)

  await orbitBtn.click()
  await expect(orbitBtn).toHaveAttribute('aria-pressed', 'true')
  await expect(cardCover).toHaveClass(/\bis-orbiting\b/)
  await expect(page).toHaveURL(/\/$/)

  await card.screenshot({ path: testInfo.outputPath(`cover-card-${isDark ? 'dark' : 'light'}.png`), animations: 'disabled' })

  await card.locator('.post-title-link').click()
  await expect(page).toHaveURL(/\/posts\/build-your-site-with-valaxy\/?$/)

  expect(consoleErrors).toEqual([])
  expect(pageErrors).toEqual([])
})
