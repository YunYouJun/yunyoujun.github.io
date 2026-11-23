<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { prefersReducedMotion, useGuideSite } from './useGuideSite'
import ValaxyGuideFrame from './ValaxyGuideFrame.vue'

interface RoadmapStep {
  id: string
  headingId: string
  index: number
  title: string
  summary: string
  anchor: string
  command: string
  outcome: string
  timeHint: string
}

const steps: RoadmapStep[] = [
  {
    id: 'env',
    headingId: '准备环境',
    index: 1,
    title: '准备环境',
    summary: '安装 Node.js（≥22.12.0）、pnpm（≥10.26.0）、Git 与 VS Code。',
    anchor: '#准备环境',
    command: 'node --version · pnpm --version',
    outcome: '终端可运行 Valaxy 脚手架，编辑器打开即可获得类型提示。',
    timeHint: '约 5 分钟',
  },
  {
    id: 'create',
    headingId: '一条命令建站',
    index: 2,
    title: '一条命令建站',
    summary: '运行官方脚手架，依次选择 Blog 与 Yun 主题，装好依赖并启动预览。',
    anchor: '#一条命令建站',
    command: 'pnpm create valaxy@latest',
    outcome: '浏览器打开 http://localhost:4859/，看到默认小站与《Hello, Valaxy!》。',
    timeHint: '约 2 分钟',
  },
  {
    id: 'config',
    headingId: '配置',
    index: 3,
    title: '基础配置',
    summary: '在两个 TypeScript 配置文件里修改站点标题、作者信息与主题配色。',
    anchor: '#配置',
    command: 'site.config.ts · valaxy.config.ts',
    outcome: '鼠标悬浮字段就能看说明，保存文件浏览器立刻局部热更新。',
    timeHint: '约 3 分钟',
  },
  {
    id: 'write',
    headingId: '开始写作',
    index: 4,
    title: '开始写作',
    summary: '在 pages/posts/ 下新建 Markdown 文章，构建后会在 dist/ 输出纯静态文件。',
    anchor: '#开始写作',
    command: 'pnpm exec valaxy new first-post',
    outcome: '首页列表、标签、分类与归档同步更新，pnpm build 生成可发布产物。',
    timeHint: '随时可写',
  },
  {
    id: 'deploy',
    headingId: '部署',
    index: 5,
    title: '部署上线',
    summary: '把代码推送到 GitHub，由内置 GitHub Actions 工作流自动构建并发布。',
    anchor: '#部署',
    command: 'git push -u origin main',
    outcome: '几分钟后即可访问线上小站，后续推送到 main 自动触发更新。',
    timeHint: '约 3 分钟',
  },
]

const burstParticles = [
  { dx: '-52px', dy: '-20px', delay: '0ms', color: 'var(--va-c-primary)' },
  { dx: '-28px', dy: '-28px', delay: '40ms', color: 'var(--va-c-green-1)' },
  { dx: '-10px', dy: '-24px', delay: '80ms', color: 'var(--va-c-yellow-1)' },
  { dx: '8px', dy: '-28px', delay: '20ms', color: 'var(--va-c-primary)' },
  { dx: '26px', dy: '-22px', delay: '70ms', color: 'var(--va-c-green-1)' },
  { dx: '48px', dy: '-26px', delay: '50ms', color: 'var(--va-c-link)' },
  { dx: '-38px', dy: '-14px', delay: '110ms', color: 'var(--va-c-yellow-1)' },
  { dx: '38px', dy: '-15px', delay: '95ms', color: 'var(--va-c-primary)' },
] as const

const { state, siteUrl, toggleStepCompleted } = useGuideSite()
const activeIndex = shallowRef(0)
const readingIndex = shallowRef<number | null>(null)
const tabEls = shallowRef<HTMLButtonElement[]>([])
const burstKey = shallowRef(0)
const showBurst = shallowRef(false)

const currentStep = computed(() => steps[activeIndex.value])
const completedCount = computed(() => state.completedSteps.length)
const allCompleted = computed(() => steps.every(step => state.completedSteps.includes(step.id)))
const currentCompleted = computed(() => state.completedSteps.includes(currentStep.value.id))
const currentOutcome = computed(() =>
  currentStep.value.id === 'deploy'
    ? `几分钟后即可访问 ${siteUrl.value}，后续推送到 main 自动触发更新。`
    : currentStep.value.outcome,
)

let observer: IntersectionObserver | undefined
let flashTimer: ReturnType<typeof setTimeout> | undefined
let burstTimer: ReturnType<typeof setTimeout> | undefined
let readyTimer: ReturnType<typeof setTimeout> | undefined
let mountedReady = false

watch(allCompleted, (next, prev) => {
  if (!mountedReady || !next || prev || prefersReducedMotion())
    return

  burstKey.value += 1
  showBurst.value = true
  clearTimeout(burstTimer)
  burstTimer = setTimeout(() => {
    showBurst.value = false
  }, 1200)
})

function selectStep(index: number) {
  activeIndex.value = index
}

function goPrev() {
  if (activeIndex.value > 0)
    activeIndex.value -= 1
}

function goNext() {
  if (activeIndex.value < steps.length - 1)
    activeIndex.value += 1
}

function focusTab(index: number) {
  activeIndex.value = index
  void nextTick(() => {
    tabEls.value[index]?.focus()
  })
}

function handleTabKeydown(event: KeyboardEvent, index: number) {
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    focusTab((index + 1) % steps.length)
  }
  else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    focusTab((index - 1 + steps.length) % steps.length)
  }
  else if (event.key === 'Home') {
    event.preventDefault()
    focusTab(0)
  }
  else if (event.key === 'End') {
    event.preventDefault()
    focusTab(steps.length - 1)
  }
}

function jumpToAnchor() {
  const target = document.getElementById(currentStep.value.headingId)
  if (!target)
    return

  target.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  })

  target.classList.remove('is-vg-target')
  void target.offsetWidth
  target.classList.add('is-vg-target')
  clearTimeout(flashTimer)
  flashTimer = setTimeout(() => {
    target.classList.remove('is-vg-target')
  }, 1150)
}

function isStepDone(stepId: string): boolean {
  return state.completedSteps.includes(stepId)
}

onMounted(() => {
  readyTimer = setTimeout(() => {
    mountedReady = true
  }, 0)

  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined')
    return

  const headingToIndex = new Map<Element, number>()
  steps.forEach((step, idx) => {
    const el = document.getElementById(step.headingId)
    if (el)
      headingToIndex.set(el, idx)
  })

  if (headingToIndex.size === 0)
    return

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const idx = headingToIndex.get(entry.target)
          if (idx !== undefined)
            readingIndex.value = idx
        }
      }
    },
    { rootMargin: '-15% 0px -68% 0px', threshold: 0 },
  )

  for (const el of headingToIndex.keys())
    observer.observe(el)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  clearTimeout(flashTimer)
  clearTimeout(burstTimer)
  clearTimeout(readyTimer)
})
</script>

<template>
  <ValaxyGuideFrame
    class="vg-roadmap"
    eyebrow="建站路线图"
    :status="`${completedCount}/${steps.length} 已完成`"
    caption="一共 5 步，点任一步即可查看操作细节与完成标志，勾选进度会保存在本地浏览器。"
  >
    <template #icon>
      <span class="i-ri-compass-3-line vg-head-icon" aria-hidden="true" />
    </template>

    <template #head-right>
      <span v-if="allCompleted" class="vg-pill vg-pill--green">
        <span class="i-ri-sparkling-2-line" aria-hidden="true" />
        <span>全程通关</span>
      </span>
      <span v-else class="vg-pill">预计 15 分钟</span>
    </template>

    <div class="vg-roadmap-track" role="tablist" aria-label="建站步骤切换">
      <button
        v-for="(step, idx) in steps"
        :key="step.id"
        :ref="(el) => { if (el) tabEls[idx] = el as HTMLButtonElement }"
        type="button"
        role="tab"
        class="vg-roadmap-node"
        :class="{
          'is-active': idx === activeIndex,
          'is-done': isStepDone(step.id),
          'is-reading': readingIndex === idx && idx !== activeIndex,
        }"
        :aria-selected="idx === activeIndex"
        :aria-label="`第 ${step.index} 步：${step.title}`"
        :tabindex="idx === activeIndex ? 0 : -1"
        @click="selectStep(idx)"
        @keydown="handleTabKeydown($event, idx)"
      >
        <span class="vg-roadmap-dot" aria-hidden="true">
          <span v-if="isStepDone(step.id)" class="i-ri-check-line" />
          <template v-else>{{ step.index }}</template>
        </span>
        <span class="vg-roadmap-label">{{ step.title }}</span>
      </button>
    </div>

    <div v-if="allCompleted" class="vg-roadmap-celebrate" role="status" aria-live="polite">
      <span class="i-ri-sparkling-2-line vg-roadmap-celebrate-icon" aria-hidden="true" />
      <span>
        <strong>5/5 全部完成</strong> · 你的小站已在 <code>{{ siteUrl }}</code> 就位，去写下第一篇吧！
      </span>

      <span v-if="showBurst" :key="burstKey" class="vg-roadmap-particles" aria-hidden="true">
        <span
          v-for="(particle, idx) in burstParticles"
          :key="idx"
          class="vg-roadmap-particle"
          :style="{
            '--vg-dx': particle.dx,
            '--vg-dy': particle.dy,
            '--vg-delay': particle.delay,
            '--vg-color': particle.color,
          }"
        />
      </span>
    </div>

    <div class="vg-roadmap-detail" role="tabpanel">
      <div class="vg-roadmap-detail-head">
        <div>
          <div class="vg-roadmap-step-tag">
            STEP {{ currentStep.index }} / {{ steps.length }} · {{ currentStep.timeHint }}
          </div>
          <div class="vg-roadmap-step-title">
            {{ currentStep.title }}
          </div>
        </div>

        <a
          class="vg-btn vg-roadmap-jump"
          :href="currentStep.anchor"
          @click.prevent="jumpToAnchor"
        >
          <span>跳到这一节</span>
          <span class="i-ri-corner-down-right-line" aria-hidden="true" />
        </a>
      </div>

      <p class="vg-roadmap-summary">
        {{ currentStep.summary }}
      </p>

      <div class="vg-roadmap-meta">
        <div class="vg-roadmap-meta-item">
          <span class="vg-roadmap-meta-label">核心命令 / 文件</span>
          <code class="vg-code-inline">{{ currentStep.command }}</code>
        </div>
        <div class="vg-roadmap-meta-item">
          <span class="vg-roadmap-meta-label">完成标志</span>
          <span class="vg-roadmap-outcome">{{ currentOutcome }}</span>
        </div>
      </div>
    </div>

    <template #actions>
      <div class="vg-roadmap-nav-group">
        <button type="button" class="vg-btn" :disabled="activeIndex === 0" @click="goPrev">
          <span class="i-ri-arrow-left-s-line" aria-hidden="true" />
          <span>上一步</span>
        </button>
        <button
          type="button"
          class="vg-btn"
          :class="{ 'vg-btn--primary': !currentCompleted }"
          @click="toggleStepCompleted(currentStep.id)"
        >
          <span
            :class="currentCompleted ? 'i-ri-checkbox-circle-fill' : 'i-ri-checkbox-blank-circle-line'"
            aria-hidden="true"
          />
          <span>{{ currentCompleted ? '已完成这一步' : '我做完了' }}</span>
        </button>
      </div>

      <button type="button" class="vg-btn vg-btn--primary" :disabled="activeIndex === steps.length - 1" @click="goNext">
        <span>下一步</span>
        <span class="i-ri-arrow-right-s-line" aria-hidden="true" />
      </button>
    </template>
  </ValaxyGuideFrame>
</template>

<style scoped>
.vg-head-icon {
  color: var(--va-c-link);
  font-size: 1rem;
}

.vg-roadmap-track {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.45rem;
  margin-bottom: 0.85rem;
}

.vg-roadmap-node {
  display: flex;
  align-items: center;
  gap: 0.42rem;
  min-width: 0;
  min-height: 2.25rem;
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--yun-surface-line);
  border-radius: var(--yun-action-btn-radius, 0.625rem);
  background: transparent;
  color: var(--va-c-text-2);
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    background-color 160ms ease,
    color 160ms ease;
}

.vg-roadmap-node:hover {
  background: var(--yun-action-btn-hover-bg);
  color: var(--va-c-text);
}

.vg-roadmap-node:focus-visible {
  outline: 2px solid var(--yun-focus-color);
  outline-offset: 2px;
}

.vg-roadmap-node.is-active {
  border-color: color-mix(in srgb, var(--va-c-primary) 42%, var(--yun-surface-line));
  background: color-mix(in srgb, var(--va-c-primary) 10%, transparent);
  color: var(--va-c-link);
}

.vg-roadmap-node.is-done:not(.is-active) {
  border-color: color-mix(in srgb, var(--va-c-green-1) 34%, var(--yun-surface-line));
  color: var(--va-c-text);
}

.vg-roadmap-node.is-reading {
  border-style: dashed;
}

.vg-roadmap-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 999px;
  background: var(--yun-action-btn-hover-bg);
  color: var(--va-c-text-2);
  font-size: 0.72rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.vg-roadmap-node.is-active .vg-roadmap-dot {
  background: var(--va-c-link);
  color: #fff;
}

.dark .vg-roadmap-node.is-active .vg-roadmap-dot {
  color: #111114;
}

.vg-roadmap-node.is-done .vg-roadmap-dot {
  background: var(--va-c-green-soft);
  color: var(--va-c-green-1);
}

.vg-roadmap-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vg-roadmap-detail {
  padding-top: 0.2rem;
}

.vg-roadmap-detail-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.6rem;
}

.vg-roadmap-step-tag {
  color: var(--va-c-link);
  font-family: var(--va-font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.vg-roadmap-step-title {
  margin-top: 0.12rem;
  color: var(--va-c-text-dark);
  font-family: var(--yun-post-title-font-family, var(--va-font-serif));
  font-size: 1.02rem;
  font-weight: 700;
}

.vg-roadmap-summary {
  margin: 0.55rem 0 0.75rem;
  color: var(--va-c-text);
  font-size: 0.875rem;
}

.vg-roadmap-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  padding-top: 0.7rem;
  border-top: 1px dashed var(--yun-surface-line);
}

.vg-roadmap-meta-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  min-width: 0;
}

.vg-roadmap-meta-label {
  color: var(--va-c-text-3);
  font-size: 0.73rem;
  font-weight: 600;
}

.vg-roadmap-outcome {
  color: var(--va-c-text-2);
  font-size: 0.8125rem;
}

.vg-roadmap-nav-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
}

.vg-roadmap-celebrate {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.8rem;
  padding: 0.55rem 0.75rem;
  border: 1px solid color-mix(in srgb, var(--va-c-green-1) 36%, var(--yun-surface-line));
  border-radius: var(--yun-action-btn-radius, 0.625rem);
  background: var(--va-c-green-soft);
  color: var(--va-c-text);
  font-size: 0.8125rem;
  line-height: 1.5;
  overflow: visible;
}

.vg-roadmap-celebrate code {
  padding: 0.08em 0.32em;
  border-radius: 4px;
  background: color-mix(in srgb, var(--va-c-bg) 70%, transparent);
  font-family: var(--va-font-mono);
  font-size: 0.85em;
}

.vg-roadmap-celebrate-icon {
  flex: none;
  color: var(--va-c-green-1);
  font-size: 1rem;
}

.vg-roadmap-particles {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
}

.vg-roadmap-particle {
  position: absolute;
  left: 0;
  top: 0;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--vg-color, var(--va-c-primary));
  opacity: 0;
  animation: vg-roadmap-burst 1100ms cubic-bezier(0.22, 1, 0.36, 1) var(--vg-delay, 0ms) forwards;
}

@keyframes vg-roadmap-burst {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.4);
  }

  20% {
    opacity: 0.95;
  }

  100% {
    opacity: 0;
    transform: translate(calc(-50% + var(--vg-dx)), calc(-50% + var(--vg-dy))) scale(1);
  }
}

@container vg-card (max-width: 544px) {
  .vg-roadmap-node {
    justify-content: center;
    padding: 0.35rem 0.25rem;
  }

  .vg-roadmap-label {
    display: none;
  }

  .vg-roadmap-meta {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (pointer: coarse) {
  .vg-roadmap-node {
    min-height: 44px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .vg-roadmap-particles {
    display: none;
  }
}
</style>
