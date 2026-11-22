<script setup lang="ts">
import type { EnvToolId } from './useGuideSite'
import { computed, onBeforeUnmount, shallowRef } from 'vue'
import { ENV_TOOL_IDS, useGuideSite } from './useGuideSite'
import ValaxyGuideFrame from './ValaxyGuideFrame.vue'

interface EnvToolCard {
  id: EnvToolId
  name: string
  requirement: string
  iconClass: string
  url: string
  urlLabel: string
  summary: string
  command?: string
  mirrorCommand?: string
  extraLink?: { label: string, url: string }
  extraNote?: string
}

const tools: EnvToolCard[] = [
  {
    id: 'node',
    name: 'Node.js',
    requirement: 'LTS >= 22.12.0',
    iconClass: 'i-logos-nodejs-icon',
    url: 'https://nodejs.org/',
    urlLabel: '官网下载',
    summary: '把 JavaScript 运行环境从浏览器搬到电脑上的「水缸」，Valaxy 的开发和构建都靠它运行（推荐选 LTS 版，更稳）。',
    command: 'node --version',
  },
  {
    id: 'pnpm',
    name: 'pnpm',
    requirement: '>= 10.26.0',
    iconClass: 'i-logos-pnpm',
    url: 'https://pnpm.io/installation',
    urlLabel: '安装文档',
    summary: '「软件商店的命令行版」，装依赖比 npm 更快、更省空间。装好 Node.js 后可用 npm 全局安装并核对版本。',
    command: 'npm install -g pnpm && pnpm --version',
    mirrorCommand: 'pnpm config set registry https://registry.npmmirror.com',
  },
  {
    id: 'git',
    name: 'Git',
    requirement: '版本管理',
    iconClass: 'i-logos-git-icon',
    url: 'https://git-scm.com/',
    urlLabel: '官网下载',
    summary: '代码「后悔药」，写乱了可以一键退回之前的版本，也是后面把小站代码推送到 GitHub 的桥梁。',
    command: 'git --version',
  },
  {
    id: 'vscode',
    name: 'VS Code',
    requirement: '推荐编辑器',
    iconClass: 'i-logos-visual-studio-code',
    url: 'https://code.visualstudio.com/',
    urlLabel: '官网下载',
    summary: 'Visual Studio Code，轻量又顺手的编辑器（注意不是体积大得多的 IDE Visual Studio）。',
    extraNote: '打开脚手架项目时会按 .vscode/extensions.json 推荐插件；也可以顺手装上 ',
    extraLink: {
      label: 'Valaxy 官方扩展',
      url: 'https://marketplace.visualstudio.com/items?itemName=YunYouJun.valaxy',
    },
  },
]

const batchCheckCmd = 'node --version && pnpm --version && git --version'

const { state, setAllEnvTools, toggleEnvTool } = useGuideSite()
const copiedKey = shallowRef<string>('')
const showMirror = shallowRef(false)

let copyTimer: ReturnType<typeof setTimeout> | undefined

onBeforeUnmount(() => {
  clearTimeout(copyTimer)
})

const checkedCount = computed(() => state.envCheckedTools.length)
const allChecked = computed(() => checkedCount.value === ENV_TOOL_IDS.length)

function isChecked(id: string): boolean {
  return state.envCheckedTools.includes(id)
}

async function copyText(key: string, text: string) {
  try {
    await navigator.clipboard?.writeText(text)
  }
  catch {
    // Ignore clipboard failure in restricted contexts
  }
  copiedKey.value = key
  clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    copiedKey.value = ''
  }, 1500)
}
</script>

<template>
  <ValaxyGuideFrame
    class="vg-env"
    eyebrow="环境准备清单"
    :status="`${checkedCount}/${tools.length} 已就绪`"
    caption="装完哪一项就随手打勾，全部 4 项就绪时顶部路线图的「准备环境」会自动点亮。"
    flush
  >
    <template #icon>
      <span class="i-ri-tools-line vg-head-icon" aria-hidden="true" />
    </template>

    <template #head-right>
      <span class="vg-pill" :class="{ 'vg-pill--green': allChecked }">
        {{ allChecked ? '环境已齐备' : '三件套 + 编辑器' }}
      </span>
    </template>

    <div class="vg-env-grid">
      <section
        v-for="tool in tools"
        :key="tool.id"
        class="vg-env-cell"
        :class="{ 'is-checked': isChecked(tool.id) }"
      >
        <div class="vg-env-cell-head">
          <div class="vg-env-brand">
            <span class="vg-env-logo" :class="tool.iconClass" aria-hidden="true" />
            <div class="vg-env-title-wrap">
              <strong class="vg-env-name">{{ tool.name }}</strong>
              <span class="vg-pill">{{ tool.requirement }}</span>
            </div>
          </div>

          <button
            type="button"
            class="vg-chip"
            :class="{ 'is-active': isChecked(tool.id) }"
            :aria-pressed="isChecked(tool.id)"
            :aria-label="`标记 ${tool.name} 已就绪`"
            @click="toggleEnvTool(tool.id)"
          >
            <span
              :class="isChecked(tool.id) ? 'i-ri-checkbox-circle-fill' : 'i-ri-checkbox-blank-circle-line'"
              aria-hidden="true"
            />
            <span>{{ isChecked(tool.id) ? '已就绪' : '标为已装好' }}</span>
          </button>
        </div>

        <p class="vg-env-summary">
          {{ tool.summary }}
        </p>

        <div v-if="tool.command" class="vg-env-cmd-row">
          <code class="vg-env-cmd">{{ tool.command }}</code>
          <button
            type="button"
            class="vg-env-copy-btn"
            :aria-label="`复制 ${tool.name} 命令`"
            @click="copyText(tool.id, tool.command)"
          >
            <span :class="copiedKey === tool.id ? 'i-ri-check-line' : 'i-ri-file-copy-line'" aria-hidden="true" />
            <span>{{ copiedKey === tool.id ? '已复制' : '复制' }}</span>
          </button>
        </div>

        <div v-if="tool.mirrorCommand" class="vg-env-mirror">
          <button
            type="button"
            class="vg-env-mirror-toggle"
            :aria-expanded="showMirror"
            @click="showMirror = !showMirror"
          >
            <span :class="showMirror ? 'i-ri-arrow-down-s-line' : 'i-ri-arrow-right-s-line'" aria-hidden="true" />
            <span>下载慢？切换 npmmirror 国内镜像</span>
          </button>

          <div v-if="showMirror" class="vg-env-mirror-box">
            <div class="vg-env-cmd-row">
              <code class="vg-env-cmd">{{ tool.mirrorCommand }}</code>
              <button
                type="button"
                class="vg-env-copy-btn"
                aria-label="复制镜像设置命令"
                @click="copyText('mirror', tool.mirrorCommand)"
              >
                <span :class="copiedKey === 'mirror' ? 'i-ri-check-line' : 'i-ri-file-copy-line'" aria-hidden="true" />
                <span>{{ copiedKey === 'mirror' ? '已复制' : '复制' }}</span>
              </button>
            </div>
            <p class="vg-env-mirror-tip">
              旧文里的 <code>registry.npm.taobao.org</code> 已停用，请改用上面的新域名。
            </p>
          </div>
        </div>

        <p v-if="tool.extraNote" class="vg-env-extra">
          {{ tool.extraNote }}
          <a
            v-if="tool.extraLink"
            :href="tool.extraLink.url"
            target="_blank"
            rel="noopener noreferrer"
          >{{ tool.extraLink.label }}</a>。
        </p>

        <div class="vg-env-cell-foot">
          <a
            class="vg-env-link"
            :href="tool.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{{ tool.urlLabel }}</span>
            <span class="i-ri-external-link-line" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>

    <template #actions>
      <button type="button" class="vg-btn" @click="copyText('batch', batchCheckCmd)">
        <span :class="copiedKey === 'batch' ? 'i-ri-check-line' : 'i-ri-terminal-line'" aria-hidden="true" />
        <span>{{ copiedKey === 'batch' ? '已复制组合自检命令' : '复制一行版本自检命令' }}</span>
      </button>

      <button
        type="button"
        class="vg-btn"
        :class="{ 'vg-btn--primary': !allChecked }"
        @click="setAllEnvTools(!allChecked)"
      >
        <span :class="allChecked ? 'i-ri-restart-line' : 'i-ri-check-double-line'" aria-hidden="true" />
        <span>{{ allChecked ? '清空勾选' : '我全部装好了' }}</span>
      </button>
    </template>
  </ValaxyGuideFrame>
</template>

<style scoped>
.vg-head-icon {
  color: var(--va-c-link);
  font-size: 1rem;
}

.vg-env-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.vg-env-cell {
  display: flex;
  flex-direction: column;
  gap: 0.48rem;
  padding: 0.75rem 0.8rem;
  border-bottom: 1px solid var(--yun-surface-line);
  transition: background-color 160ms ease;
}

.vg-env-cell.is-checked {
  background: color-mix(in srgb, var(--va-c-green-1) 4%, transparent);
}

@container vg-card (min-width: 481px) {
  .vg-env-cell:nth-child(odd) {
    border-right: 1px solid var(--yun-surface-line);
  }

  .vg-env-cell:nth-last-child(-n + 2) {
    border-bottom: none;
  }
}

@container vg-card (max-width: 480px) {
  .vg-env-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .vg-env-cell:last-child {
    border-bottom: none;
  }
}

.vg-env-cell-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.45rem;
}

.vg-env-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.vg-env-logo {
  flex: none;
  font-size: 1.35rem;
}

.vg-env-title-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
}

.vg-env-name {
  color: var(--va-c-text-dark);
  font-size: 0.92rem;
  font-weight: 700;
}

.vg-env-summary {
  margin: 0;
  color: var(--va-c-text-2);
  font-size: 0.8rem;
  line-height: 1.55;
}

.vg-env-cmd-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.45rem;
  padding: 0.35rem 0.55rem;
  border: 1px solid var(--yun-surface-line);
  border-radius: 5px;
  background: var(--va-code-block-bg);
}

.vg-env-cmd {
  min-width: 0;
  color: var(--va-c-text-dark);
  font-family: var(--va-font-mono);
  font-size: 0.74rem;
  overflow-x: auto;
  white-space: nowrap;
}

.vg-env-copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.22rem;
  flex: none;
  padding: 0.14rem 0.42rem;
  border: 1px solid var(--yun-surface-line);
  border-radius: 4px;
  background: transparent;
  color: var(--va-c-text-2);
  font-family: inherit;
  font-size: 0.72rem;
  cursor: pointer;
}

.vg-env-copy-btn:hover {
  background: var(--yun-action-btn-hover-bg);
  color: var(--va-c-link);
}

.vg-env-copy-btn:focus-visible,
.vg-env-mirror-toggle:focus-visible,
.vg-env-link:focus-visible {
  outline: 2px solid var(--yun-focus-color);
  outline-offset: 2px;
}

.vg-env-mirror-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--va-c-link);
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
}

.vg-env-mirror-box {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-top: 0.38rem;
}

.vg-env-mirror-tip,
.vg-env-extra {
  margin: 0;
  color: var(--va-c-text-3);
  font-size: 0.75rem;
  line-height: 1.5;
}

.vg-env-extra a {
  color: var(--va-c-link);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.vg-env-cell-foot {
  margin-top: auto;
  padding-top: 0.15rem;
}

.vg-env-link {
  display: inline-flex;
  align-items: center;
  gap: 0.22rem;
  color: var(--va-c-link);
  font-size: 0.76rem;
  font-weight: 500;
  text-decoration: none;
}

.vg-env-link:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (pointer: coarse) {
  .vg-env-copy-btn,
  .vg-env-mirror-toggle {
    min-height: 44px;
  }
}
</style>
