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

test('tutorial guide components render and work end-to-end without console errors', async ({ page }) => {
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

  // Ensure no horizontal overflow on desktop or mobile viewports
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(hasOverflow).toBe(false)

  // 0. Tech stack pills + Valaxy logo pointer-events check
  const stackLogoPointerEvents = await stack.locator('.vg-stack-img').evaluate(
    el => window.getComputedStyle(el).pointerEvents,
  )
  expect(stackLogoPointerEvents).toBe('none')
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

  const logoPointerEvents = await flow.locator('.vg-flow-logo img').evaluate(
    el => window.getComputedStyle(el).pointerEvents,
  )
  expect(logoPointerEvents).toBe('none')

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

  expect(consoleErrors).toEqual([])
  expect(pageErrors).toEqual([])
})
