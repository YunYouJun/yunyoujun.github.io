<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { prefersReducedMotion, useGuideSite } from './useGuideSite'
import '../../styles/valaxy-guide.scss'

const STORAGE_KEY = 'valaxy-guide-first-post:v1'
const DEFAULT_TITLE = '你好，世界'

const starterPrompts = [
  '今天终于搭好了属于自己的小站。',
  '不用在意流量，先记下今晚的心情。',
  'Hello, Valaxy! 这是我的第一篇文章。',
] as const

const { state, siteUrl, basePath, isRootRepo, primaryRgb } = useGuideSite()

const isOpen = shallowRef(false)
const rightTab = shallowRef<'postcard' | 'prompt'>('postcard')
const title = shallowRef(DEFAULT_TITLE)
const body = shallowRef('')
const stamped = shallowRef(false)
const stampAnimKey = shallowRef(0)
const isDroppingStamp = shallowRef(false)
const todayDate = shallowRef('2026-11-20')
const hasCommentSection = shallowRef(false)
const feedbackKind = shallowRef<'none' | 'prompt' | 'png' | 'flag'>('none')

let storageReady = false
let stampTimer: ReturnType<typeof setTimeout> | undefined
let feedbackTimer: ReturnType<typeof setTimeout> | undefined

function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function escapeSingleQuote(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/\r?\n/g, ' ').trim()
}

function formatYamlTitle(raw: string): string {
  const cleaned = raw.replace(/\r?\n/g, ' ').trim() || DEFAULT_TITLE
  if (/[:#'"[\]{},&*!?|<>=%@`]|^-/.test(cleaned))
    return `'${cleaned.replace(/'/g, '\'\'')}'`
  return cleaned
}

const hasDraft = computed(
  () => Boolean(body.value.trim()) || (Boolean(title.value.trim()) && title.value.trim() !== DEFAULT_TITLE),
)

const displayTitle = computed(() => title.value.trim() || DEFAULT_TITLE)
const displayBody = computed(() => body.value.trim() || '写下你的第一句话，它就会印在这张明信片上。')
const stampMonth = computed(() => todayDate.value.slice(0, 7))

const aiSetupPrompt = computed(() => {
  const lines = [
    `请帮我用 Valaxy（Yun 主题）从零搭建我的个人博客（项目目录：${state.projectName}）：`,
    '',
    '1. 初始化项目：',
    `   - 执行 pnpm create valaxy@latest（Blog / Yun / ${state.projectName}）并安装依赖`,
    '',
    '2. 配置 site.config.ts：',
    `   - url: '${siteUrl.value}'`,
    `   - title: '${escapeSingleQuote(state.siteTitle)}'`,
    `   - author.name: '${escapeSingleQuote(state.authorName)}'`,
    '',
    '3. 配置 valaxy.config.ts：',
    '   - theme: \'yun\'',
    `   - themeConfig.colors.primary: '${state.primaryColor}'`,
    `   - themeConfig.banner: { enable: ${state.bannerEnabled}, title: '${escapeSingleQuote(state.bannerTitle)}' }`,
  ]

  if (!isRootRepo.value)
    lines.push(`   - vite: { base: '${basePath.value}' }`)

  lines.push(
    '',
    '4. 创建第一篇文章 pages/posts/first-post.md：',
    '   ---',
    `   title: ${formatYamlTitle(title.value)}`,
    `   date: ${todayDate.value}`,
    '   tags:',
    '     - 随笔',
    '   ---',
    `   ${displayBody.value}`,
    '',
    '5. 运行 pnpm dev 检查本地预览效果，并准备推送到 GitHub Actions 发布。',
  )

  return lines.join('\n')
})

function setFeedback(kind: 'prompt' | 'png' | 'flag') {
  feedbackKind.value = kind
  clearTimeout(feedbackTimer)
  feedbackTimer = setTimeout(() => {
    feedbackKind.value = 'none'
  }, 2000)
}

async function copyTextSafe(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText)
    return false

  try {
    await navigator.clipboard.writeText(text)
    return true
  }
  catch {
    return false
  }
}

function applyStarter(prompt: string) {
  body.value = prompt
}

function stampCard() {
  rightTab.value = 'postcard'
  stamped.value = true
  if (prefersReducedMotion())
    return

  stampAnimKey.value += 1
  isDroppingStamp.value = true
  clearTimeout(stampTimer)
  stampTimer = setTimeout(() => {
    isDroppingStamp.value = false
  }, 550)
}

async function copyAiPrompt() {
  await copyTextSafe(aiSetupPrompt.value)
  setFeedback('prompt')
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const paragraphs = text.replace(/\r\n/g, '\n').split('\n')
  const lines: string[] = []

  for (const para of paragraphs) {
    if (!para) {
      if (lines.length < maxLines)
        lines.push('')
      continue
    }

    let current = ''
    for (const ch of para) {
      const candidate = current + ch
      if (ctx.measureText(candidate).width > maxWidth && current) {
        lines.push(current)
        current = ch
        if (lines.length >= maxLines)
          break
      }
      else {
        current = candidate
      }
    }

    if (lines.length >= maxLines)
      break
    if (current)
      lines.push(current)
    if (lines.length >= maxLines)
      break
  }

  return lines.slice(0, maxLines)
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function triggerDownload(url: string, filename: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function exportPostcardPng() {
  if (typeof document === 'undefined')
    return

  const width = 640
  const height = 380
  const scale = 2
  const canvas = document.createElement('canvas')
  canvas.width = width * scale
  canvas.height = height * scale

  const ctx = canvas.getContext('2d')
  if (!ctx)
    return

  const isDark = document.documentElement.classList.contains('dark')
  const bg = isDark ? '#161619' : '#f9f9fb'
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(20, 20, 30, 0.05)'
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(20, 20, 30, 0.12)'
  const textMain = isDark ? '#e8e8ed' : '#1f2328'
  const textMuted = isDark ? '#a1a1aa' : '#57606a'
  const accent = state.primaryColor

  ctx.scale(scale, scale)

  // Card background
  drawRoundedRect(ctx, 0.5, 0.5, width - 1, height - 1, 12)
  ctx.fillStyle = bg
  ctx.fill()

  ctx.save()
  ctx.clip()

  // Yun 40px graph-paper grid
  ctx.strokeStyle = gridColor
  ctx.lineWidth = 1
  for (let x = 40; x < width; x += 40) {
    ctx.beginPath()
    ctx.moveTo(x + 0.5, 0)
    ctx.lineTo(x + 0.5, height)
    ctx.stroke()
  }
  for (let y = 40; y < height; y += 40) {
    ctx.beginPath()
    ctx.moveTo(0, y + 0.5)
    ctx.lineTo(width, y + 0.5)
    ctx.stroke()
  }

  // Top accent bar
  ctx.fillStyle = accent
  ctx.fillRect(0, 0, width, 4)

  ctx.restore()

  // Outer hairline border
  drawRoundedRect(ctx, 0.5, 0.5, width - 1, height - 1, 12)
  ctx.strokeStyle = borderColor
  ctx.lineWidth = 1
  ctx.stroke()

  const padX = 36

  // Kicker + site URL
  ctx.fillStyle = textMuted
  ctx.font = '600 12px ui-monospace, SFMono-Regular, Menlo, monospace'
  ctx.fillText(`SITE LAUNCH · ${todayDate.value}`, padX, 42)
  ctx.font = '400 12px ui-monospace, SFMono-Regular, Menlo, monospace'
  ctx.fillText(siteUrl.value, padX, 62)

  // Site title badge
  ctx.font = '600 13px system-ui, -apple-system, sans-serif'
  const siteLabel = state.siteTitle.trim() || '我的小站'
  const pillW = Math.min(260, ctx.measureText(siteLabel).width + 24)
  drawRoundedRect(ctx, padX, 88, pillW, 28, 14)
  ctx.fillStyle = `rgba(${primaryRgb.value}, 0.14)`
  ctx.fill()
  ctx.strokeStyle = `rgba(${primaryRgb.value}, 0.35)`
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.fillStyle = accent
  ctx.fillText(siteLabel, padX + 12, 107)

  // Article title
  ctx.fillStyle = textMain
  ctx.font = '700 26px "Songti SC", "Noto Serif SC", serif'
  const titleLines = wrapCanvasText(ctx, displayTitle.value, width - padX * 2 - 110, 2)
  let cursorY = 152
  for (const line of titleLines) {
    ctx.fillText(line, padX, cursorY)
    cursorY += 34
  }

  // Body quote with left accent line
  ctx.font = '400 16px system-ui, -apple-system, sans-serif'
  const bodyLines = wrapCanvasText(ctx, displayBody.value, width - padX * 2 - 20, 4)
  const quoteStartY = cursorY + 8
  const quoteHeight = Math.max(24, bodyLines.length * 26)
  ctx.fillStyle = accent
  ctx.fillRect(padX, quoteStartY - 16, 3, quoteHeight)

  ctx.fillStyle = textMain
  let bodyY = quoteStartY + 2
  for (const line of bodyLines) {
    ctx.fillText(line, padX + 14, bodyY)
    bodyY += 26
  }

  // Footer divider and signature
  ctx.strokeStyle = borderColor
  ctx.beginPath()
  ctx.moveTo(padX, height - 54)
  ctx.lineTo(width - padX, height - 54)
  ctx.stroke()

  ctx.fillStyle = textMuted
  ctx.font = '500 13px system-ui, -apple-system, sans-serif'
  ctx.fillText(`by ${state.authorName || '你的名字'}`, padX, height - 26)

  const brandText = 'valaxy-theme-yun · 小站立项纪念'
  const brandW = ctx.measureText(brandText).width
  ctx.fillText(brandText, width - padX - brandW, height - 26)

  // Optional circular postmark stamp
  if (stamped.value) {
    ctx.save()
    ctx.translate(width - 82, 84)
    ctx.rotate(-12 * (Math.PI / 180))

    ctx.strokeStyle = accent
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(0, 0, 38, 0, Math.PI * 2)
    ctx.stroke()

    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.arc(0, 0, 32, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = accent
    ctx.textAlign = 'center'
    ctx.font = '700 9px ui-monospace, monospace'
    ctx.fillText('VALAXY', 0, -14)
    ctx.font = '700 14px system-ui, sans-serif'
    ctx.fillText('已立项', 0, 5)
    ctx.font = '600 9px ui-monospace, monospace'
    ctx.fillText(stampMonth.value, 0, 20)

    ctx.restore()
  }

  const safeSlug = state.projectName.trim().replace(/[^\w-]+/g, '-') || 'valaxy-blog'
  const filename = `${safeSlug}-postcard.png`

  if (typeof canvas.toBlob === 'function') {
    canvas.toBlob((blob) => {
      if (!blob)
        return
      const url = URL.createObjectURL(blob)
      triggerDownload(url, filename)
      URL.revokeObjectURL(url)
      setFeedback('png')
    }, 'image/png')
  }
  else {
    triggerDownload(canvas.toDataURL('image/png'), filename)
    setFeedback('png')
  }
}

async function checkInToComments() {
  const flagText = `来立个 Flag！准备搭「${state.siteTitle}」，写下第一句：${displayBody.value}`
  await copyTextSafe(flagText)
  setFeedback('flag')

  const commentEl = document.querySelector<HTMLElement>('.yun-comment')
  if (!commentEl)
    return

  commentEl.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  })

  const textarea = commentEl.querySelector<HTMLTextAreaElement>('textarea.wl-editor, textarea')
  if (textarea && !textarea.value.trim())
    textarea.focus({ preventScroll: true })
}

onMounted(() => {
  todayDate.value = formatLocalDate(new Date())
  hasCommentSection.value = Boolean(document.querySelector('.yun-comment'))

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as { title?: unknown, body?: unknown, stamped?: unknown }
      if (typeof parsed.title === 'string' && parsed.title.trim())
        title.value = parsed.title
      if (typeof parsed.body === 'string')
        body.value = parsed.body
      if (typeof parsed.stamped === 'boolean')
        stamped.value = parsed.stamped
    }
  }
  catch {
    // Ignore storage read failures
  }

  storageReady = true
})

watch([title, body, stamped], ([nextTitle, nextBody, nextStamped]) => {
  if (!storageReady || typeof window === 'undefined')
    return

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ title: nextTitle, body: nextBody, stamped: nextStamped }),
    )
  }
  catch {
    // Ignore storage write failures
  }
})

onBeforeUnmount(() => {
  clearTimeout(stampTimer)
  clearTimeout(feedbackTimer)
})
</script>

<template>
  <figure class="vg-figure vg-firstpost not-prose">
    <div class="vg-box">
      <button
        type="button"
        class="vg-firstpost-trigger"
        :aria-expanded="isOpen"
        @click="isOpen = !isOpen"
      >
        <span class="vg-firstpost-trigger-left">
          <span class="i-ri-quill-pen-line vg-firstpost-lead-icon" aria-hidden="true" />
          <span class="vg-firstpost-trigger-text">
            {{ hasDraft || stamped ? '打开你的小站立项卡' : '给自己的小站立个项，顺手写下第一句' }}
          </span>
          <span class="vg-pill">{{ state.siteTitle }}</span>
          <span v-if="stamped" class="vg-pill vg-pill--green">已立项</span>
        </span>

        <span class="vg-firstpost-trigger-right">
          <span>{{ isOpen ? '收起' : '展开卡片' }}</span>
          <span :class="isOpen ? 'i-ri-arrow-up-s-line' : 'i-ri-arrow-down-s-line'" aria-hidden="true" />
        </span>
      </button>

      <div
        v-if="isOpen"
        class="vg-firstpost-panel"
        :style="{
          '--vg-fp-accent': state.primaryColor,
          '--vg-fp-accent-rgb': primaryRgb,
        }"
      >
        <div class="vg-split vg-firstpost-split">
          <div class="vg-split-pane vg-firstpost-editor">
            <div class="vg-firstpost-meta-bar">
              <span class="vg-firstpost-meta-site">
                <span class="vg-firstpost-dot" aria-hidden="true" />
                <strong>{{ state.siteTitle }}</strong>
                <span class="vg-firstpost-url">{{ siteUrl }}</span>
              </span>
              <span class="vg-firstpost-hint">沿用前文配置</span>
            </div>

            <div class="vg-firstpost-field">
              <label for="vg-fp-title" class="vg-firstpost-label">第一篇标题</label>
              <input
                id="vg-fp-title"
                v-model="title"
                type="text"
                class="vg-firstpost-input"
                placeholder="给第一篇文章起个标题"
              >
            </div>

            <div class="vg-firstpost-field">
              <label for="vg-fp-body" class="vg-firstpost-label">写下第一句</label>
              <textarea
                id="vg-fp-body"
                v-model="body"
                rows="2"
                class="vg-firstpost-textarea"
                placeholder="写下你的第一句话，比如：今晚我拥有了属于自己的第一个网站。"
              />
            </div>

            <div class="vg-firstpost-prompts" aria-label="灵感开头">
              <button
                v-for="prompt in starterPrompts"
                :key="prompt"
                type="button"
                class="vg-chip"
                :class="{ 'is-active': body === prompt }"
                @click="applyStarter(prompt)"
              >
                {{ prompt }}
              </button>
            </div>

            <div class="vg-firstpost-stamp-row">
              <button
                type="button"
                class="vg-btn"
                :class="{ 'vg-btn--primary': !stamped }"
                @click="stampCard"
              >
                <span class="i-ri-award-line" aria-hidden="true" />
                <span>{{ stamped ? '重新盖章' : '立项盖章' }}</span>
              </button>
              <span class="vg-firstpost-stamp-tip">
                {{ stamped ? `已盖上 ${stampMonth} 开业邮戳` : '盖上今日日期印章留作纪念' }}
              </span>
            </div>
          </div>

          <div class="vg-split-pane vg-firstpost-stage">
            <div class="vg-code-tabs">
              <div class="vg-code-tablist" role="tablist" aria-label="小站立项预览切换">
                <button
                  type="button"
                  role="tab"
                  class="vg-tab"
                  :class="{ 'is-active': rightTab === 'postcard' }"
                  :aria-selected="rightTab === 'postcard'"
                  @click="rightTab = 'postcard'"
                >
                  <span class="i-ri-image-2-line" aria-hidden="true" />
                  <span>开业明信片</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  class="vg-tab"
                  :class="{ 'is-active': rightTab === 'prompt' }"
                  :aria-selected="rightTab === 'prompt'"
                  @click="rightTab = 'prompt'"
                >
                  <span class="i-ri-robot-2-line" aria-hidden="true" />
                  <span>AI 建站指令</span>
                </button>
              </div>
            </div>

            <div v-if="rightTab === 'postcard'" class="vg-firstpost-stage-body" role="tabpanel">
              <article class="vg-postcard vg-stage">
                <div class="vg-postcard-top">
                  <div class="vg-postcard-kicker">
                    <span class="vg-postcard-date">SITE LAUNCH · {{ todayDate }}</span>
                    <span class="vg-postcard-url">{{ siteUrl }}</span>
                  </div>

                  <button
                    :key="stampAnimKey"
                    type="button"
                    class="vg-postcard-stamp"
                    :class="{
                      'is-stamped': stamped,
                      'is-dropping': isDroppingStamp,
                    }"
                    :aria-label="stamped ? `已立项印章 ${stampMonth}，点击重新盖章` : '点击盖上立项印章'"
                    @click="stampCard"
                  >
                    <template v-if="stamped">
                      <span class="vg-stamp-top">VALAXY</span>
                      <span class="vg-stamp-main">已立项</span>
                      <span class="vg-stamp-date">{{ stampMonth }}</span>
                    </template>
                    <template v-else>
                      <span class="vg-stamp-idle">点击盖章</span>
                    </template>
                  </button>
                </div>

                <div class="vg-postcard-site">
                  {{ state.siteTitle }}
                </div>

                <h4 class="vg-postcard-title">
                  {{ displayTitle }}
                </h4>

                <p class="vg-postcard-body">
                  {{ displayBody }}
                </p>

                <div class="vg-postcard-foot">
                  <span>by {{ state.authorName }}</span>
                  <span>valaxy-theme-yun · 小站立项纪念</span>
                </div>
              </article>
            </div>

            <div v-else class="vg-firstpost-stage-body" role="tabpanel">
              <pre class="vg-firstpost-prompt"><code>{{ aiSetupPrompt }}</code></pre>
            </div>
          </div>
        </div>

        <div class="vg-actions-bar">
          <div class="vg-firstpost-actions">
            <button type="button" class="vg-btn vg-btn--primary" @click="copyAiPrompt">
              <span :class="feedbackKind === 'prompt' ? 'i-ri-check-line' : 'i-ri-sparkling-2-line'" aria-hidden="true" />
              <span>{{ feedbackKind === 'prompt' ? '已复制 AI 指令' : '复制 AI 建站提示词' }}</span>
            </button>

            <button type="button" class="vg-btn" @click="exportPostcardPng">
              <span :class="feedbackKind === 'png' ? 'i-ri-check-line' : 'i-ri-image-2-line'" aria-hidden="true" />
              <span>{{ feedbackKind === 'png' ? '已保存明信片' : '保存明信片 PNG' }}</span>
            </button>

            <button v-if="hasCommentSection" type="button" class="vg-btn" @click="checkInToComments">
              <span :class="feedbackKind === 'flag' ? 'i-ri-check-line' : 'i-ri-chat-3-line'" aria-hidden="true" />
              <span>{{ feedbackKind === 'flag' ? '已复制，前往评论区' : '去评论区立个 Flag' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.vg-firstpost {
  margin: 1.35rem 0;
}

.vg-firstpost-trigger {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 0.75rem;
  width: 100%;
  min-height: 2.65rem;
  padding: 0.6rem 0.9rem;
  border: none;
  background: transparent;
  color: var(--va-c-text);
  font-family: inherit;
  font-size: 0.85rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 160ms var(--yun-ease-in, ease);
}

.vg-firstpost-trigger:hover {
  background: var(--yun-action-btn-hover-bg);
}

.vg-firstpost-trigger:focus-visible,
.vg-firstpost-input:focus-visible,
.vg-firstpost-textarea:focus-visible,
.vg-postcard-stamp:focus-visible {
  outline: 2px solid var(--yun-focus-color);
  outline-offset: 2px;
}

.vg-firstpost-trigger-left {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
}

.vg-firstpost-lead-icon {
  flex: none;
  font-size: 1rem;
  color: var(--va-c-link);
}

.vg-firstpost-trigger-text {
  color: var(--va-c-text-dark);
  font-weight: 600;
}

.vg-firstpost-trigger-right {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--va-c-text-2);
  font-size: 0.78rem;
}

.vg-firstpost-panel {
  border-top: 1px solid var(--yun-surface-line);
}

.vg-firstpost-split {
  grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.12fr);
}

.vg-firstpost-editor {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 0.85rem 0.9rem;
}

.vg-firstpost-meta-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem 0.6rem;
  padding-bottom: 0.55rem;
  border-bottom: 1px dashed var(--yun-surface-line);
  font-size: 0.76rem;
}

.vg-firstpost-meta-site {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  color: var(--va-c-text);
}

.vg-firstpost-dot {
  flex: none;
  width: 0.52rem;
  height: 0.52rem;
  border-radius: 999px;
  background: var(--vg-fp-accent, var(--va-c-primary));
}

.vg-firstpost-url {
  color: var(--va-c-text-2);
  font-family: var(--va-font-mono);
  font-size: 0.72rem;
  overflow-wrap: anywhere;
}

.vg-firstpost-hint {
  color: var(--va-c-text-3);
  font-size: 0.72rem;
}

.vg-firstpost-field {
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
}

.vg-firstpost-label {
  color: var(--va-c-text-2);
  font-size: 0.75rem;
  font-weight: 600;
}

.vg-firstpost-input,
.vg-firstpost-textarea {
  width: 100%;
  padding: 0.45rem 0.65rem;
  border: 1px solid var(--yun-surface-line);
  border-radius: var(--yun-action-btn-radius, 0.625rem);
  background: var(--va-c-bg-alt);
  color: var(--va-c-text);
  font-family: inherit;
  font-size: 0.84rem;
  line-height: 1.5;
  resize: vertical;
}

.vg-firstpost-prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.vg-firstpost-stamp-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem;
  margin-top: auto;
  padding-top: 0.25rem;
}

.vg-firstpost-stamp-tip {
  color: var(--va-c-text-3);
  font-size: 0.74rem;
}

.vg-firstpost-stage {
  display: flex;
  flex-direction: column;
}

.vg-firstpost-stage-body {
  display: flex;
  flex: 1;
  padding: 0.85rem 0.9rem;
}

.vg-postcard {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid color-mix(in srgb, var(--vg-fp-accent, var(--va-c-primary)) 26%, var(--yun-surface-line));
  border-top: 3px solid var(--vg-fp-accent, var(--va-c-primary));
  border-radius: var(--va-card-border-radius, 0.5rem);
}

.vg-postcard-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.65rem;
}

.vg-postcard-kicker {
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
  min-width: 0;
  font-family: var(--va-font-mono);
  font-size: 0.7rem;
  color: var(--va-c-text-3);
}

.vg-postcard-date {
  font-weight: 600;
  letter-spacing: 0.03em;
}

.vg-postcard-url {
  overflow-wrap: anywhere;
}

.vg-postcard-stamp {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 3.9rem;
  height: 3.9rem;
  padding: 0.25rem;
  border: 1.5px dashed var(--yun-surface-line);
  border-radius: 999px;
  background: transparent;
  color: var(--va-c-text-3);
  font-family: inherit;
  cursor: pointer;
  transform: rotate(-10deg);
  transition:
    border-color 180ms ease,
    color 180ms ease,
    background-color 180ms ease,
    transform 180ms ease;
}

.vg-postcard-stamp:hover {
  border-color: var(--vg-fp-accent, var(--va-c-primary));
  color: var(--vg-fp-accent, var(--va-c-link));
}

.vg-postcard-stamp.is-stamped {
  border: 2px solid var(--vg-fp-accent, var(--va-c-primary));
  background: rgba(var(--vg-fp-accent-rgb, 0, 120, 231), 0.08);
  color: var(--vg-fp-accent, var(--va-c-link));
  box-shadow: inset 0 0 0 3px transparent, inset 0 0 0 4px color-mix(in srgb, var(--vg-fp-accent, var(--va-c-primary)) 45%, transparent);
}

.vg-postcard-stamp.is-dropping {
  animation: vg-stamp-drop 460ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.vg-stamp-top,
.vg-stamp-date {
  font-family: var(--va-font-mono);
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  line-height: 1.1;
}

.vg-stamp-main {
  font-size: 0.78rem;
  font-weight: 800;
  line-height: 1.2;
}

.vg-stamp-idle {
  font-size: 0.65rem;
  font-weight: 600;
  line-height: 1.2;
}

.vg-postcard-site {
  align-self: flex-start;
  padding: 0.14rem 0.55rem;
  border: 1px solid rgba(var(--vg-fp-accent-rgb, 0, 120, 231), 0.34);
  border-radius: 999px;
  background: rgba(var(--vg-fp-accent-rgb, 0, 120, 231), 0.1);
  color: var(--vg-fp-accent, var(--va-c-link));
  font-size: 0.74rem;
  font-weight: 600;
}

.vg-postcard-title {
  margin: 0;
  color: var(--va-c-text-dark);
  font-family: var(--yun-post-title-font-family, var(--va-font-serif));
  font-size: 1.06rem;
  font-weight: 700;
  line-height: 1.35;
}

.vg-postcard-body {
  margin: 0.1rem 0 0.35rem;
  padding-left: 0.65rem;
  border-left: 2px solid var(--vg-fp-accent, var(--va-c-primary));
  color: var(--va-c-text);
  font-size: 0.86rem;
  line-height: 1.65;
  overflow-wrap: break-word;
}

.vg-postcard-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.3rem 0.65rem;
  margin-top: auto;
  padding-top: 0.55rem;
  border-top: 1px dashed var(--yun-surface-line);
  color: var(--va-c-text-3);
  font-size: 0.72rem;
}

.vg-firstpost-prompt {
  width: 100%;
  margin: 0;
  padding: 0.75rem 0.85rem;
  border: 1px solid var(--yun-surface-line);
  border-radius: var(--yun-action-btn-radius, 0.625rem);
  background: var(--va-code-block-bg);
  color: var(--va-c-text);
  font-family: var(--va-font-mono);
  font-size: 0.76rem;
  line-height: 1.55;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.vg-firstpost-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
}

@keyframes vg-stamp-drop {
  0% {
    opacity: 0.3;
    transform: rotate(-16deg) scale(1.65);
  }

  65% {
    opacity: 1;
    transform: rotate(-8deg) scale(0.94);
  }

  100% {
    opacity: 1;
    transform: rotate(-10deg) scale(1);
  }
}

@container vg-card (max-width: 600px) {
  .vg-firstpost-split {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (pointer: coarse) {
  .vg-firstpost-trigger {
    min-height: 44px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .vg-firstpost-trigger,
  .vg-postcard-stamp {
    transition: none;
  }

  .vg-postcard-stamp.is-dropping {
    animation: none;
  }
}
</style>
