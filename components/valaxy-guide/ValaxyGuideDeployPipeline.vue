<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef } from 'vue'
import { prefersReducedMotion, useGuideSite } from './useGuideSite'
import ValaxyGuideFrame from './ValaxyGuideFrame.vue'
import ValaxyGuideMiniSite from './ValaxyGuideMiniSite.vue'

interface ActionStep {
  id: string
  name: string
  duration: string
  command: string
  note: string
}

const actionSteps: ActionStep[] = [
  {
    id: 'push',
    name: '触发工作流 · push main',
    duration: '0.4s',
    command: '$ git push -u origin main',
    note: '本地只提交 Markdown 与配置源码，不需要提前打包 dist/。',
  },
  {
    id: 'checkout',
    name: 'Checkout · fetch-depth: 0',
    duration: '1.8s',
    command: 'uses: actions/checkout@v4  # with: { fetch-depth: 0 }',
    note: '拉取完整 Git 提交历史，确保文章创建与更新时间准确读取。',
  },
  {
    id: 'install',
    name: '安装依赖 · pnpm install',
    duration: '14.2s',
    command: 'run: pnpm install --frozen-lockfile',
    note: '按锁文件还原完全一致的 Valaxy 与 Yun 主题版本。',
  },
  {
    id: 'build',
    name: '静态构建 · pnpm run build',
    duration: '9.6s',
    command: 'run: pnpm run build  # SSG 预渲染全站到 dist/',
    note: '输出纯静态 HTML、CSS 与搜索索引，没有服务器端运行时依赖。',
  },
  {
    id: 'deploy',
    name: '发布站点 · actions/deploy-pages',
    duration: '5.1s',
    command: 'uses: actions/deploy-pages@v4  # 托管 dist/ 产物',
    note: '直接由官方 Pages Actions 部署上线，无需额外维护 gh-pages 分支。',
  },
]

const { state, normalizedRepo, isRootRepo, basePath, siteUrl } = useGuideSite()

const expandedStepId = shallowRef<string>('checkout')
const runningStepIndex = shallowRef<number>(-1)
const completedCount = shallowRef<number>(actionSteps.length)
const isRunning = shallowRef(false)
const simulateBrokenBase = shallowRef(false)

let stepTimer: ReturnType<typeof setTimeout> | undefined

onBeforeUnmount(() => {
  clearTimeout(stepTimer)
})

const showBrokenBase = computed(() => !isRootRepo.value && simulateBrokenBase.value)

function stepStatus(idx: number): 'done' | 'running' | 'pending' {
  if (isRunning.value) {
    if (idx < runningStepIndex.value)
      return 'done'
    if (idx === runningStepIndex.value)
      return 'running'
    return 'pending'
  }
  return idx < completedCount.value ? 'done' : 'pending'
}

function advanceStep(idx: number) {
  runningStepIndex.value = idx
  expandedStepId.value = actionSteps[idx].id
  completedCount.value = idx

  stepTimer = setTimeout(() => {
    if (idx + 1 < actionSteps.length) {
      advanceStep(idx + 1)
    }
    else {
      isRunning.value = false
      runningStepIndex.value = -1
      completedCount.value = actionSteps.length
    }
  }, 600)
}

function simulatePush() {
  clearTimeout(stepTimer)
  if (prefersReducedMotion()) {
    isRunning.value = false
    runningStepIndex.value = -1
    completedCount.value = actionSteps.length
    expandedStepId.value = 'deploy'
    return
  }

  isRunning.value = true
  completedCount.value = 0
  advanceStep(0)
}

function toggleStep(id: string) {
  expandedStepId.value = expandedStepId.value === id ? '' : id
}

function selectRepoPreset(name: string) {
  state.repoName = name
  if (/\.github\.io$/i.test(name))
    simulateBrokenBase.value = false
}
</script>

<template>
  <ValaxyGuideFrame
    class="vg-deploy"
    eyebrow="GitHub Pages 自动部署"
    :status="isRunning ? '工作流执行中…' : `已上线 · ${siteUrl}`"
    caption="试试模拟一次 git push，或把仓库名改成 my-blog，看子路径仓库为什么需要配置 vite.base。"
    flush
  >
    <template #icon>
      <span class="i-ri-git-branch-line vg-head-icon" aria-hidden="true" />
    </template>

    <template #head-right>
      <button
        type="button"
        class="vg-btn vg-btn--primary"
        :disabled="isRunning"
        @click="simulatePush"
      >
        <span class="i-ri-play-fill" aria-hidden="true" />
        <span>{{ isRunning ? '部署中…' : '模拟一次 git push' }}</span>
      </button>
    </template>

    <div class="vg-split vg-deploy-split">
      <!-- Left: Actions 5-step log + Repo base rule -->
      <div class="vg-split-pane vg-deploy-left">
        <div class="vg-deploy-subhead">
          <span>.github/workflows/gh-pages.yml</span>
          <span class="vg-pill" :class="isRunning ? 'vg-pill--amber' : 'vg-pill--green'">
            {{ isRunning ? 'Running' : 'Success · 31.1s' }}
          </span>
        </div>

        <ul class="vg-deploy-steps" aria-label="GitHub Actions 构建步骤">
          <li
            v-for="(step, idx) in actionSteps"
            :key="step.id"
            class="vg-deploy-step"
            :class="`is-${stepStatus(idx)}`"
          >
            <button
              type="button"
              class="vg-deploy-step-btn"
              :aria-expanded="expandedStepId === step.id"
              @click="toggleStep(step.id)"
            >
              <span
                class="vg-deploy-step-icon"
                :class="{
                  'i-ri-checkbox-circle-fill is-done': stepStatus(idx) === 'done',
                  'i-ri-loader-4-line is-running': stepStatus(idx) === 'running',
                  'i-ri-time-line is-pending': stepStatus(idx) === 'pending',
                }"
                aria-hidden="true"
              />
              <span class="vg-deploy-step-name">{{ step.name }}</span>
              <span class="vg-deploy-step-dur">{{ step.duration }}</span>
              <span
                class="vg-deploy-chevron"
                :class="expandedStepId === step.id ? 'i-ri-arrow-down-s-line' : 'i-ri-arrow-right-s-line'"
                aria-hidden="true"
              />
            </button>

            <div v-if="expandedStepId === step.id" class="vg-deploy-step-detail">
              <code>{{ step.command }}</code>
              <p>{{ step.note }}</p>
            </div>
          </li>
        </ul>

        <!-- Repo name & base diff -->
        <div class="vg-deploy-repo-box">
          <div class="vg-deploy-repo-head">
            <label class="vg-deploy-repo-label" for="vg-deploy-repo-input">仓库名</label>
            <div class="vg-deploy-repo-presets">
              <button
                type="button"
                class="vg-chip"
                :class="{ 'is-active': isRootRepo }"
                @click="selectRepoPreset('you.github.io')"
              >
                you.github.io
              </button>
              <button
                type="button"
                class="vg-chip"
                :class="{ 'is-active': !isRootRepo && normalizedRepo === 'my-blog' }"
                @click="selectRepoPreset('my-blog')"
              >
                my-blog
              </button>
            </div>
          </div>

          <div class="vg-deploy-repo-input-row">
            <span class="vg-deploy-repo-prefix">github.com/you/</span>
            <input
              id="vg-deploy-repo-input"
              v-model="state.repoName"
              type="text"
              class="vg-deploy-repo-input"
              placeholder="you.github.io"
              aria-label="GitHub 仓库名"
            >
          </div>

          <div class="vg-deploy-repo-result">
            <div class="vg-deploy-url-row">
              <span class="vg-deploy-meta-key">访问地址</span>
              <code>{{ siteUrl }}</code>
            </div>
            <div class="vg-deploy-url-row">
              <span class="vg-deploy-meta-key">路由前缀</span>
              <code>base: '{{ basePath }}'</code>
            </div>

            <div v-if="!isRootRepo" class="vg-deploy-diff-wrap">
              <div class="language-ts vg-shiki">
                <pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">export default</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> defineValaxyConfig</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">({</span></span>
<span class="line diff add"><span>  vite: { base: '{{ basePath }}' },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">})</span></span></code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Live online preview + optional broken base 404 simulator -->
      <div class="vg-split-pane vg-deploy-right">
        <ValaxyGuideMiniSite
          :url-override="siteUrl"
          :broken-base="showBrokenBase"
          :log-line="showBrokenBase
            ? `缺少 vite: { base: '${basePath}' }，资源去根目录 /assets/ 找文件了`
            : isRunning
              ? 'GitHub Actions 正在打包构建 dist/…'
              : `已成功发布到 ${siteUrl}`"
        />
      </div>
    </div>

    <template #actions>
      <span class="vg-deploy-foot-hint">
        {{ isRootRepo
          ? '主站仓库（*.github.io）默认就是根目录 /，不用额外加 base'
          : '子目录仓库必须加上仓库名前缀，否则部署后样式与脚本会 404' }}
      </span>

      <button
        v-if="!isRootRepo"
        type="button"
        class="vg-chip"
        :class="{ 'is-active': simulateBrokenBase }"
        :aria-pressed="simulateBrokenBase"
        @click="simulateBrokenBase = !simulateBrokenBase"
      >
        <span class="i-ri-error-warning-line" aria-hidden="true" />
        <span>{{ simulateBrokenBase ? '恢复正确 base' : '模拟忘了加 base' }}</span>
      </button>
    </template>
  </ValaxyGuideFrame>
</template>

<style scoped>
.vg-head-icon {
  color: var(--va-c-link);
  font-size: 1rem;
}

.vg-deploy-left {
  display: flex;
  flex-direction: column;
}

.vg-deploy-subhead {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  padding: 0.55rem 0.85rem;
  border-bottom: 1px solid var(--yun-surface-line);
  color: var(--va-c-text-2);
  font-family: var(--va-font-mono);
  font-size: 0.76rem;
}

.vg-deploy-steps {
  margin: 0;
  padding: 0.35rem 0.5rem;
  list-style: none;
}

.vg-deploy-step + .vg-deploy-step {
  border-top: 1px dashed var(--yun-surface-line);
}

.vg-deploy-step-btn {
  display: flex;
  align-items: center;
  gap: 0.42rem;
  width: 100%;
  min-height: 2.15rem;
  padding: 0.3rem 0.4rem;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: var(--va-c-text);
  font-family: inherit;
  font-size: 0.78rem;
  text-align: left;
  cursor: pointer;
}

.vg-deploy-step-btn:hover {
  background: var(--yun-action-btn-hover-bg);
}

.vg-deploy-step-btn:focus-visible {
  outline: 2px solid var(--yun-focus-color);
  outline-offset: 1px;
}

.vg-deploy-step-icon {
  flex: none;
  font-size: 0.92rem;
}

.vg-deploy-step-icon.is-done {
  color: var(--va-c-green-1);
}

.vg-deploy-step-icon.is-running {
  color: var(--va-c-link);
  animation: vg-spin 1s linear infinite;
}

.vg-deploy-step-icon.is-pending {
  color: var(--va-c-text-3);
}

@keyframes vg-spin {
  to {
    transform: rotate(360deg);
  }
}

.vg-deploy-step-name {
  flex: 1;
  min-width: 0;
  font-weight: 500;
}

.vg-deploy-step-dur {
  color: var(--va-c-text-3);
  font-family: var(--va-font-mono);
  font-size: 0.72rem;
  font-variant-numeric: tabular-nums;
}

.vg-deploy-chevron {
  color: var(--va-c-text-3);
}

.vg-deploy-step-detail {
  margin: 0 0.4rem 0.45rem 1.75rem;
  padding: 0.42rem 0.6rem;
  border-radius: 4px;
  background: var(--va-code-block-bg);
  font-size: 0.75rem;
}

.vg-deploy-step-detail code {
  display: block;
  color: var(--va-c-text-dark);
  font-family: var(--va-font-mono);
  font-size: 0.74rem;
  word-break: break-all;
}

.vg-deploy-step-detail p {
  margin: 0.25rem 0 0;
  color: var(--va-c-text-2);
  line-height: 1.45;
}

.vg-deploy-repo-box {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
  padding: 0.75rem 0.85rem;
  border-top: 1px solid var(--yun-surface-line);
}

.vg-deploy-repo-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
}

.vg-deploy-repo-label {
  color: var(--va-c-text-dark);
  font-size: 0.78rem;
  font-weight: 600;
}

.vg-deploy-repo-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.vg-deploy-repo-input-row {
  display: flex;
  align-items: center;
  border: 1px solid var(--yun-surface-line);
  border-radius: 6px;
  background: var(--va-code-block-bg);
  overflow: hidden;
}

.vg-deploy-repo-prefix {
  padding: 0.32rem 0 0.32rem 0.6rem;
  color: var(--va-c-text-3);
  font-family: var(--va-font-mono);
  font-size: 0.76rem;
  white-space: nowrap;
}

.vg-deploy-repo-input {
  flex: 1;
  min-width: 0;
  padding: 0.32rem 0.6rem 0.32rem 0.2rem;
  border: none;
  background: transparent;
  color: var(--va-c-link);
  font-family: var(--va-font-mono);
  font-size: 0.78rem;
  font-weight: 600;
}

.vg-deploy-repo-input:focus-visible {
  outline: 2px solid var(--yun-focus-color);
  outline-offset: -2px;
}

.vg-deploy-repo-result {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.76rem;
}

.vg-deploy-url-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
}

.vg-deploy-meta-key {
  color: var(--va-c-text-3);
}

.vg-deploy-url-row code {
  color: var(--va-c-text-dark);
  font-family: var(--va-font-mono);
  font-size: 0.75rem;
}

.vg-deploy-diff-wrap {
  margin-top: 0.3rem;
  border: 1px solid var(--yun-surface-line);
  border-radius: 6px;
  overflow: hidden;
}

.vg-deploy-diff-wrap .line.diff.add {
  display: inline-block;
  width: 100%;
  background: var(--va-code-line-diff-add-color);
  color: var(--va-code-line-diff-add-symbol-color);
}

.vg-deploy-diff-wrap .line.diff.add::before {
  content: '+ ';
  font-weight: 700;
}

.vg-deploy-foot-hint {
  color: var(--va-c-text-2);
  font-size: 0.76rem;
}

@media (prefers-reduced-motion: reduce) {
  .vg-deploy-step-icon.is-running {
    animation: none;
  }
}

@media (pointer: coarse) {
  .vg-deploy-step-btn {
    min-height: 44px;
  }
}
</style>
