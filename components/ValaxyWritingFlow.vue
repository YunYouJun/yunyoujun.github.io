<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef } from 'vue'
import { prefersReducedMotion, useGuideSite } from './valaxy-guide/useGuideSite'
import ValaxyGuideFrame from './valaxy-guide/ValaxyGuideFrame.vue'

type FlowTab = 'hmr' | 'more'

const logoUrl = `${import.meta.env.BASE_URL}images/valaxy-guide/valaxy-logo.png`

const sampleParagraphs = [
  '今天用 pnpm create valaxy 搭好了个人小站，默认自带了 Yun 主题。',
  '每篇文章只要放进 pages/posts/，写好顶部的 YAML 标题和分类就行。',
  '如果正文里想放点互动小部件，直接在 Markdown 里写 Vue 标签，状态也能跨热更新保留。',
  '把 <!-- more --> 插在合适的段落下面，首页卡片就不会把长文一次全铺开。',
]

const { state } = useGuideSite()
const activeTab = shallowRef<FlowTab>('hmr')
const tabEls = shallowRef<HTMLButtonElement[]>([])

const count = shallowRef(0)
const bumpKey = shallowRef(0)
const showBump = shallowRef(false)
const hmrFlash = shallowRef(false)
const reloadFlash = shallowRef(false)
const statusNote = shallowRef('已保存 · 等待编辑 Markdown')
const lastEventKind = shallowRef<'idle' | 'hmr' | 'reload'>('idle')
const moreCutIndex = shallowRef(2)

let bumpTimer: ReturnType<typeof setTimeout> | undefined
let flashTimer: ReturnType<typeof setTimeout> | undefined

onBeforeUnmount(() => {
  clearTimeout(bumpTimer)
  clearTimeout(flashTimer)
})

const hasUnsavedChanges = computed(
  () => state.postDraftTitle.trim() !== state.postSavedTitle.trim(),
)

const displaySavedTitle = computed(
  () => state.postSavedTitle.trim() || 'Hello, Valaxy!',
)

const excerptParagraphs = computed(
  () => sampleParagraphs.slice(0, moreCutIndex.value),
)

const isTruncated = computed(() => moreCutIndex.value < sampleParagraphs.length)

function incrementCounter() {
  count.value += 1
  bumpKey.value += 1
  showBump.value = true
  clearTimeout(bumpTimer)
  bumpTimer = setTimeout(() => {
    showBump.value = false
  }, 500)
}

function triggerHmrSave() {
  state.postSavedTitle = state.postDraftTitle.trim() || 'Hello, Valaxy!'
  state.postDraftTitle = state.postSavedTitle
  lastEventKind.value = 'hmr'
  statusNote.value = count.value > 0
    ? `valaxy:pageData 已局部更新 · 计数器保留为 ${count.value}`
    : 'valaxy:pageData 已局部更新 · 无整页刷新'

  if (!prefersReducedMotion()) {
    hmrFlash.value = true
    clearTimeout(flashTimer)
    flashTimer = setTimeout(() => {
      hmrFlash.value = false
    }, 650)
  }
}

function triggerFullReload() {
  state.postSavedTitle = state.postDraftTitle.trim() || 'Hello, Valaxy!'
  state.postDraftTitle = state.postSavedTitle
  count.value = 0
  lastEventKind.value = 'reload'
  statusNote.value = '触发整页刷新 · 组件内存状态被清空（计数归零）'

  if (!prefersReducedMotion()) {
    reloadFlash.value = true
    clearTimeout(flashTimer)
    flashTimer = setTimeout(() => {
      reloadFlash.value = false
    }, 650)
  }
}

function resetTitleDemo() {
  state.postDraftTitle = '我的第一篇 Valaxy 笔记'
  lastEventKind.value = 'idle'
  statusNote.value = '标题已改未保存 · 点按钮或按 Ctrl/Cmd + S 热更新'
}

function handleEditorKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
    event.preventDefault()
    triggerHmrSave()
  }
}

function handleTabKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault()
    activeTab.value = activeTab.value === 'hmr' ? 'more' : 'hmr'
    tabEls.value[activeTab.value === 'hmr' ? 0 : 1]?.focus()
  }
}

function moveCut(delta: number) {
  const next = Math.min(sampleParagraphs.length, Math.max(1, moreCutIndex.value + delta))
  moreCutIndex.value = next
}

function handleDividerKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
    event.preventDefault()
    moveCut(-1)
  }
  else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
    event.preventDefault()
    moveCut(1)
  }
}
</script>

<template>
  <ValaxyGuideFrame
    class="vg-flow"
    eyebrow="写作即时预览"
    :status="activeTab === 'hmr' ? (hasUnsavedChanges ? '● 未保存' : '已同步') : `第 ${moreCutIndex} 段后截断`"
    caption="先点几次 HelloCounter，再改标题按 Ctrl/Cmd + S 保存，对比局部热更新与整页刷新的区别；第二个标签可体验 &lt;!-- more --&gt; 摘要裁剪。"
    flush
    @keydown="handleEditorKeydown"
  >
    <template #icon>
      <span class="vg-flow-logo" aria-hidden="true">
        <img :src="logoUrl" alt="" width="16" height="16">
      </span>
    </template>

    <template #head-right>
      <span
        class="vg-pill"
        :class="lastEventKind === 'hmr' ? 'vg-pill--green' : lastEventKind === 'reload' ? 'vg-pill--amber' : ''"
      >
        {{ activeTab === 'hmr' ? (lastEventKind === 'reload' ? '状态已清空' : '组件状态保留') : '首页摘要控制' }}
      </span>
    </template>

    <div class="vg-code-tabs">
      <div class="vg-code-tablist" role="tablist" aria-label="写作体验切换">
        <button
          :ref="(el) => { if (el) tabEls[0] = el as HTMLButtonElement }"
          type="button"
          role="tab"
          class="vg-tab"
          :class="{ 'is-active': activeTab === 'hmr' }"
          :aria-selected="activeTab === 'hmr'"
          :tabindex="activeTab === 'hmr' ? 0 : -1"
          @click="activeTab = 'hmr'"
          @keydown="handleTabKeydown"
        >
          <span class="i-ri-flashlight-line" aria-hidden="true" />
          <span>热更新体验</span>
        </button>
        <button
          :ref="(el) => { if (el) tabEls[1] = el as HTMLButtonElement }"
          type="button"
          role="tab"
          class="vg-tab"
          :class="{ 'is-active': activeTab === 'more' }"
          :aria-selected="activeTab === 'more'"
          :tabindex="activeTab === 'more' ? 0 : -1"
          @click="activeTab = 'more'"
          @keydown="handleTabKeydown"
        >
          <span class="i-ri-scissors-cut-line" aria-hidden="true" />
          <span>&lt;!-- more --&gt; 摘要裁剪</span>
        </button>
      </div>

      <span class="vg-flow-path-badge">pages/posts/hello-valaxy.md</span>
    </div>

    <!-- Tab 1: Live Markdown HMR + Stateful Vue Counter -->
    <div v-if="activeTab === 'hmr'" class="vg-split vg-flow-split" role="tabpanel">
      <div class="vg-split-pane vg-flow-editor">
        <div class="vg-flow-pane-head">
          <span>Markdown 源文件</span>
          <span class="vg-flow-dirty" :class="{ 'is-dirty': hasUnsavedChanges }">
            {{ hasUnsavedChanges ? '● 未保存' : '✓ 已保存' }}
          </span>
        </div>

        <div class="language-md vg-shiki">
          <pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">---</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">title</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><input
  v-model="state.postDraftTitle"
  type="text"
  class="vg-shiki-input vg-flow-title-input"
  :style="{ width: `${Math.max(state.postDraftTitle.length * 1.8 + 2, 14)}ch` }"
  aria-label="文章标题 title"
></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">categories</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">笔记</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">---</span></span>
<span class="line" />
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">直接点击这个按钮测试状态保持：</span></span>
<span class="line" />
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">HelloCounter</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> /&gt;</span></span></code></pre>
        </div>

        <div class="vg-flow-save-row">
          <button type="button" class="vg-btn vg-btn--primary" @click="triggerHmrSave">
            <span class="i-ri-save-3-line" aria-hidden="true" />
            <span>保存并热更新</span>
            <kbd class="vg-kbd">⌘/Ctrl+S</kbd>
          </button>

          <button type="button" class="vg-btn" @click="resetTitleDemo">
            <span>先改一行未保存标题</span>
          </button>
        </div>
      </div>

      <div
        class="vg-split-pane vg-flow-preview vg-stage"
        :class="{ 'is-hmr-flash': hmrFlash, 'is-reload-flash': reloadFlash }"
      >
        <div class="vg-flow-pane-head vg-flow-pane-head--preview">
          <span>浏览器 `/posts/hello-valaxy`</span>
          <span class="vg-flow-counter-badge">计数：{{ count }}</span>
        </div>

        <article class="yun-card vg-flow-article">
          <h5 class="vg-flow-article-title">
            {{ displaySavedTitle }}
          </h5>
          <p class="vg-flow-article-desc">
            直接点击这个按钮测试状态保持：
          </p>

          <div class="vg-flow-counter-row">
            <button
              type="button"
              class="bg-blue rounded px-4 py-2 text-white vg-flow-counter"
              @click="incrementCounter"
            >
              <span>Count: {{ count }}</span>
              <span v-if="showBump" :key="bumpKey" class="vg-flow-plus" aria-hidden="true">+1</span>
            </button>

            <span class="vg-flow-state-note">
              {{ lastEventKind === 'hmr' && count > 0 ? '标题变了，计数还在' : lastEventKind === 'reload' ? '整页刷新归零了' : '点几下再按保存' }}
            </span>
          </div>
        </article>

        <div class="vg-flow-status-line">
          <code>{{ statusNote }}</code>
        </div>
      </div>
    </div>

    <!-- Tab 2: more excerpt slicer -->
    <div v-else class="vg-split vg-more-split" role="tabpanel">
      <div class="vg-split-pane vg-more-editor">
        <div class="vg-flow-pane-head">
          <span>拖动或点击调整截断位置</span>
          <span class="vg-flow-dirty">{{ moreCutIndex }} / {{ sampleParagraphs.length }} 段</span>
        </div>

        <div class="vg-more-lines">
          <template v-for="(para, idx) in sampleParagraphs" :key="idx">
            <div class="vg-more-para" :class="{ 'is-after': idx >= moreCutIndex }">
              <span class="vg-more-lnum">{{ idx + 1 }}</span>
              <span class="vg-more-ptext">{{ para }}</span>
            </div>

            <div v-if="moreCutIndex === idx + 1" class="vg-more-marker-row">
              <div
                class="vg-more-marker"
                role="slider"
                tabindex="0"
                aria-label="调整 &lt;!-- more --&gt; 截断段落位置"
                :aria-valuemin="1"
                :aria-valuemax="sampleParagraphs.length"
                :aria-valuenow="moreCutIndex"
                @keydown="handleDividerKeydown"
              >
                <code>&lt;!-- more --&gt;</code>
                <span class="vg-more-marker-controls">
                  <button
                    type="button"
                    class="vg-more-step-btn"
                    :disabled="moreCutIndex <= 1"
                    aria-label="上移截断线"
                    @click="moveCut(-1)"
                  >
                    <span class="i-ri-arrow-up-s-line" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    class="vg-more-step-btn"
                    :disabled="moreCutIndex >= sampleParagraphs.length"
                    aria-label="下移截断线"
                    @click="moveCut(1)"
                  >
                    <span class="i-ri-arrow-down-s-line" aria-hidden="true" />
                  </button>
                </span>
              </div>
            </div>
            <button
              v-else
              type="button"
              class="vg-more-gap-btn"
              :aria-label="`把 <!-- more --> 移到第 ${idx + 1} 段后面`"
              @click="moreCutIndex = idx + 1"
            >
              <span>移到这里</span>
            </button>
          </template>
        </div>
      </div>

      <div class="vg-split-pane vg-more-preview vg-stage">
        <div class="vg-flow-pane-head vg-flow-pane-head--preview">
          <span>首页 YunPostCard 效果</span>
          <span class="vg-pill">{{ isTruncated ? '已收起长文' : '全文展开' }}</span>
        </div>

        <article class="yun-card vg-more-card">
          <div class="vg-more-card-title">
            {{ displaySavedTitle }}
          </div>

          <div class="vg-more-excerpt-wrap">
            <div class="vg-more-excerpt-body">
              <p v-for="(para, idx) in excerptParagraphs" :key="idx">
                {{ para }}
              </p>
            </div>
            <YunExcerptBottomGradient v-if="isTruncated" />
          </div>

          <div class="vg-more-card-foot">
            <span v-if="isTruncated" class="vg-more-readmore">
              <span>阅读全文</span>
              <span class="i-ri-arrow-right-s-line" aria-hidden="true" />
            </span>
            <span v-else class="vg-more-full-hint">未截断 · 首页卡片会显示整篇</span>
          </div>
        </article>
      </div>
    </div>

    <template #actions>
      <span class="vg-flow-foot-note">
        {{ activeTab === 'hmr'
          ? 'Valaxy 开发服务器通过 valaxy:pageData 事件推送单页修改'
          : '建议放在开头 1–2 段之后，让首页列表节奏更匀称' }}
      </span>

      <button
        v-if="activeTab === 'hmr'"
        type="button"
        class="vg-btn"
        @click="triggerFullReload"
      >
        <span class="i-ri-refresh-line" aria-hidden="true" />
        <span>模拟整页刷新（会清零计数）</span>
      </button>
      <button
        v-else
        type="button"
        class="vg-btn"
        @click="moreCutIndex = 2"
      >
        <span class="i-ri-restart-line" aria-hidden="true" />
        <span>恢复第 2 段截断</span>
      </button>
    </template>
  </ValaxyGuideFrame>
</template>

<style scoped>
.vg-flow-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.vg-flow-logo img {
  display: block;
  width: 1rem;
  height: 1rem;
  pointer-events: none;
  user-select: none;
}

.vg-flow-path-badge {
  color: var(--va-c-text-3);
  font-family: var(--va-font-mono);
  font-size: 0.72rem;
  white-space: nowrap;
}

.vg-flow-editor {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--va-code-block-bg);
}

.vg-flow-pane-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.85rem;
  border-bottom: 1px solid var(--yun-surface-line);
  color: var(--va-c-text-2);
  font-size: 0.74rem;
  font-weight: 600;
}

.vg-flow-pane-head--preview {
  background: transparent;
}

.vg-flow-dirty {
  color: var(--va-c-green-1);
  font-family: var(--va-font-mono);
  font-size: 0.72rem;
}

.vg-flow-dirty.is-dirty {
  color: var(--va-c-yellow-1);
}

.vg-flow-save-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 0.85rem;
  border-top: 1px solid var(--yun-surface-line);
}

.vg-flow-preview {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: opacity 180ms ease;
}

.vg-flow-preview.is-hmr-flash .vg-flow-article {
  outline: 2px solid var(--va-c-green-1);
  outline-offset: 2px;
}

.vg-flow-preview.is-reload-flash {
  animation: vg-full-reload 480ms ease;
}

@keyframes vg-full-reload {
  0% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
}

.vg-flow-counter-badge {
  color: var(--va-c-text-3);
  font-family: var(--va-font-mono);
  font-size: 0.72rem;
  font-variant-numeric: tabular-nums;
}

.vg-flow-article {
  margin: 0.75rem;
  padding: 0.78rem 0.88rem;
  border: 1px solid var(--yun-surface-line);
  border-radius: var(--va-card-border-radius, 0.5rem);
  background: var(--va-c-bg-light);
  box-shadow: none;
}

.vg-flow-article-title {
  margin: 0 0 0.35rem;
  color: var(--va-c-text-dark);
  font-family: var(--yun-post-title-font-family, var(--va-font-serif));
  font-size: 1rem;
  font-weight: 700;
}

.vg-flow-article-desc {
  margin: 0 0 0.6rem;
  color: var(--va-c-text-2);
  font-size: 0.8rem;
}

.vg-flow-counter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
}

.vg-flow-counter {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border: none;
  font-family: var(--va-font-mono);
  font-size: 0.8rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
}

.vg-flow-counter:focus-visible {
  outline: 2px solid var(--yun-focus-color);
  outline-offset: 2px;
}

.vg-flow-plus {
  position: absolute;
  top: -0.9rem;
  right: 0.35rem;
  color: var(--va-c-link);
  font-size: 0.72rem;
  font-weight: 700;
  animation: vg-float-plus 450ms ease-out forwards;
}

@keyframes vg-float-plus {
  0% {
    opacity: 1;
    transform: translateY(4px);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}

.vg-flow-state-note {
  color: var(--va-c-text-2);
  font-size: 0.76rem;
}

.vg-flow-status-line {
  padding: 0.4rem 0.85rem;
  border-top: 1px solid var(--yun-surface-line);
  color: var(--va-c-text-3);
  font-size: 0.72rem;
}

/* <!-- more --> editor & excerpt card */
.vg-more-editor {
  display: flex;
  flex-direction: column;
  background: var(--va-code-block-bg);
}

.vg-more-lines {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.65rem 0.75rem;
}

.vg-more-para {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.3rem 0.4rem;
  border-radius: 4px;
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--va-c-text);
  transition: opacity 150ms ease;
}

.vg-more-para.is-after {
  opacity: 0.45;
}

.vg-more-lnum {
  flex: none;
  width: 1.2ch;
  color: var(--va-c-text-3);
  font-family: var(--va-font-mono);
  font-size: 0.72rem;
}

.vg-more-marker-row {
  padding: 0.18rem 0;
}

.vg-more-marker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.22rem 0.55rem;
  border: 1px dashed var(--va-c-link);
  border-radius: 5px;
  background: color-mix(in srgb, var(--va-c-primary) 10%, transparent);
  color: var(--va-c-link);
  font-size: 0.75rem;
}

.vg-more-marker:focus-visible {
  outline: 2px solid var(--yun-focus-color);
  outline-offset: 2px;
}

.vg-more-marker-controls {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.vg-more-step-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid var(--yun-surface-line);
  border-radius: 4px;
  background: var(--va-c-bg);
  color: var(--va-c-text);
  cursor: pointer;
}

.vg-more-step-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.vg-more-gap-btn {
  align-self: flex-end;
  padding: 0.06rem 0.45rem;
  border: 1px dashed transparent;
  border-radius: 4px;
  background: transparent;
  color: var(--va-c-text-3);
  font-family: inherit;
  font-size: 0.7rem;
  cursor: pointer;
}

.vg-more-gap-btn:hover {
  border-color: var(--yun-surface-line);
  background: var(--yun-action-btn-hover-bg);
  color: var(--va-c-link);
}

.vg-more-preview {
  display: flex;
  flex-direction: column;
}

.vg-more-card {
  margin: 0.75rem;
  padding: 0.78rem 0.88rem;
  border: 1px solid var(--yun-surface-line);
  border-radius: var(--va-card-border-radius, 0.5rem);
  background: var(--va-c-bg-light);
  box-shadow: none;
}

.vg-more-card-title {
  margin-bottom: 0.45rem;
  color: var(--va-c-text-dark);
  font-family: var(--yun-post-title-font-family, var(--va-font-serif));
  font-size: 0.96rem;
  font-weight: 700;
  text-align: center;
}

.vg-more-excerpt-wrap {
  position: relative;
  overflow: hidden;
}

.vg-more-excerpt-body p {
  margin: 0 0 0.42rem;
  color: var(--va-c-text-2);
  font-size: 0.78rem;
  line-height: 1.55;
}

.vg-more-excerpt-body p:last-child {
  margin-bottom: 0;
}

.vg-more-card-foot {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.vg-more-readmore {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  color: var(--va-c-link);
  font-size: 0.76rem;
  font-weight: 500;
}

.vg-more-full-hint {
  color: var(--va-c-yellow-1);
  font-size: 0.74rem;
}

.vg-flow-foot-note {
  color: var(--va-c-text-2);
  font-size: 0.76rem;
}

@media (prefers-reduced-motion: reduce) {
  .vg-flow-preview.is-reload-flash,
  .vg-flow-plus {
    animation: none;
  }
}

@media (pointer: coarse) {
  .vg-flow-counter,
  .vg-more-step-btn {
    min-height: 44px;
    min-width: 44px;
  }
}
</style>
