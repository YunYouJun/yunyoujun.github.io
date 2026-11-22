<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { DEFAULT_GUIDE_SITE, useGuideSite } from './useGuideSite'
import ValaxyGuideFrame from './ValaxyGuideFrame.vue'
import ValaxyGuideMiniSite from './ValaxyGuideMiniSite.vue'

interface CliOption {
  id: string
  label: string
  hint: string
  recommended?: boolean
}

const typeOptions: CliOption[] = [
  { id: 'blog', label: 'Blog', hint: 'For Most Users', recommended: true },
  { id: 'theme', label: 'Theme', hint: 'For Theme Developers' },
  { id: 'addon', label: 'Addon', hint: 'For Addon Developers' },
]

const themeOptions: CliOption[] = [
  { id: 'yun', label: 'Yun', hint: 'A light & clean theme (default)', recommended: true },
  { id: 'press', label: 'Press', hint: 'A document-oriented theme' },
  { id: 'custom', label: 'Custom', hint: 'Enter a custom theme name' },
]

const { state } = useGuideSite()
const selectedType = shallowRef('blog')
const selectedTheme = shallowRef('yun')
const showPreview = shallowRef(false)

const safeProjectName = computed(() => state.projectName.trim() || DEFAULT_GUIDE_SITE.projectName)

const choiceWarning = computed(() => {
  if (selectedType.value !== 'blog')
    return '本教程以搭建个人博客为主，第 1 题建议选 Blog。'
  if (selectedTheme.value !== 'yun')
    return '后续配置示例以 Yun 主题为例，你也可以先体验再切回 Yun。'
  return ''
})

function cycleOption(
  event: KeyboardEvent,
  options: CliOption[],
  current: string,
  apply: (id: string) => void,
) {
  const idx = options.findIndex(opt => opt.id === current)
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    apply(options[(idx + 1) % options.length].id)
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    apply(options[(idx - 1 + options.length) % options.length].id)
  }
}

function resetCli() {
  selectedType.value = 'blog'
  selectedTheme.value = 'yun'
  state.projectName = DEFAULT_GUIDE_SITE.projectName
  showPreview.value = false
}
</script>

<template>
  <ValaxyGuideFrame
    class="vg-cli"
    eyebrow="脚手架交互模拟"
    :status="`目录 ./${safeProjectName}`"
    caption="用方向键或点击尝试切换选项、修改项目目录名，再点 Preview 端口预览本地首页。"
    flush
  >
    <template #icon>
      <span class="i-ri-terminal-box-line vg-head-icon" aria-hidden="true" />
    </template>

    <template #head-right>
      <span class="vg-code-inline">pnpm create valaxy@latest</span>
    </template>

    <div class="vg-cli-terminal">
      <div class="vg-cli-banner">
        <span class="vg-cli-prompt">$</span>
        <span>pnpm create valaxy@latest</span>
      </div>

      <fieldset
        class="vg-cli-group"
        @keydown="cycleOption($event, typeOptions, selectedType, (id) => { selectedType = id })"
      >
        <legend class="vg-cli-question">
          <span class="vg-cli-qmark">?</span>
          <span>Select a type:</span>
          <span class="vg-cli-help">↑/↓ 或点击切换</span>
        </legend>

        <div class="vg-cli-options" role="radiogroup" aria-label="Select a type">
          <button
            v-for="opt in typeOptions"
            :key="opt.id"
            type="button"
            role="radio"
            class="vg-cli-option"
            :class="{ 'is-selected': selectedType === opt.id }"
            :aria-checked="selectedType === opt.id"
            @click="selectedType = opt.id"
          >
            <span class="vg-cli-cursor" aria-hidden="true">{{ selectedType === opt.id ? '❯' : ' ' }}</span>
            <span class="vg-cli-opt-label">{{ opt.label }}</span>
            <span class="vg-cli-opt-hint">- {{ opt.hint }}</span>
            <span v-if="opt.recommended" class="vg-pill vg-pill--green">推荐</span>
          </button>
        </div>
      </fieldset>

      <fieldset
        class="vg-cli-group"
        @keydown="cycleOption($event, themeOptions, selectedTheme, (id) => { selectedTheme = id })"
      >
        <legend class="vg-cli-question">
          <span class="vg-cli-qmark">?</span>
          <span>Select a theme:</span>
        </legend>

        <div class="vg-cli-options" role="radiogroup" aria-label="Select a theme">
          <button
            v-for="opt in themeOptions"
            :key="opt.id"
            type="button"
            role="radio"
            class="vg-cli-option"
            :class="{ 'is-selected': selectedTheme === opt.id }"
            :aria-checked="selectedTheme === opt.id"
            @click="selectedTheme = opt.id"
          >
            <span class="vg-cli-cursor" aria-hidden="true">{{ selectedTheme === opt.id ? '❯' : ' ' }}</span>
            <span class="vg-cli-opt-label">{{ opt.label }}</span>
            <span class="vg-cli-opt-hint">- {{ opt.hint }}</span>
            <span v-if="opt.recommended" class="vg-pill vg-pill--green">默认</span>
          </button>
        </div>
      </fieldset>

      <div class="vg-cli-name-row">
        <label class="vg-cli-question" for="vg-cli-project-name">
          <span class="vg-cli-qmark">?</span>
          <span>Project name:</span>
          <span class="vg-cli-cursor" aria-hidden="true">›</span>
        </label>
        <input
          id="vg-cli-project-name"
          v-model="state.projectName"
          type="text"
          class="vg-cli-name-input"
          :style="{ width: `${Math.max((state.projectName || 'valaxy-blog').length + 2, 12)}ch` }"
          aria-label="Project name"
          placeholder="valaxy-blog"
        >
      </div>

      <p v-if="choiceWarning" class="vg-cli-note">
        <span class="i-ri-information-line" aria-hidden="true" />
        <span>{{ choiceWarning }}</span>
      </p>

      <div class="vg-cli-output">
        <div class="vg-cli-next-label">
          生成完毕，接下来在终端运行：
        </div>
        <div class="vg-cli-next-cmds">
          <code>cd {{ safeProjectName }}</code>
          <code>pnpm i</code>
          <code>pnpm dev</code>
        </div>
        <div class="vg-cli-preview-line">
          <span class="vg-cli-preview-key">Preview</span>
          <span aria-hidden="true">›</span>
          <button
            type="button"
            class="vg-cli-port-btn"
            :aria-expanded="showPreview"
            @click="showPreview = !showPreview"
          >
            <span class="i-ri-external-link-line" aria-hidden="true" />
            <span>http://localhost:4859/</span>
            <span class="vg-cli-port-hint">{{ showPreview ? '收起预览' : '点击预览' }}</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="showPreview" class="vg-cli-preview-drawer">
      <ValaxyGuideMiniSite compact />
    </div>

    <template #actions>
      <span class="vg-cli-sync-hint">
        目录名 <code>{{ safeProjectName }}</code> 会同步到下方的目录结构中
      </span>

      <button type="button" class="vg-btn" @click="resetCli">
        <span class="i-ri-restart-line" aria-hidden="true" />
        <span>重置默认选项</span>
      </button>
    </template>
  </ValaxyGuideFrame>
</template>

<style scoped>
.vg-head-icon {
  color: var(--va-c-link);
  font-size: 1rem;
}

.vg-cli-terminal {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: var(--va-code-block-bg);
  font-family: var(--va-font-mono);
  font-size: 0.8rem;
  line-height: 1.55;
}

.vg-cli-banner {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--va-c-text-dark);
  font-weight: 600;
}

.vg-cli-prompt {
  color: var(--va-c-link);
}

.vg-cli-group {
  margin: 0;
  padding: 0;
  border: none;
}

.vg-cli-question {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  padding: 0;
  color: var(--va-c-text-dark);
  font-weight: 600;
}

.vg-cli-qmark {
  color: var(--va-c-green-1);
}

.vg-cli-help {
  color: var(--va-c-text-3);
  font-size: 0.72rem;
  font-weight: 400;
}

.vg-cli-options {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-top: 0.3rem;
  padding-left: 0.4rem;
}

.vg-cli-option {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  padding: 0.22rem 0.45rem;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: var(--va-c-text-2);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    background-color 140ms ease,
    border-color 140ms ease,
    color 140ms ease;
}

.vg-cli-option:hover {
  background: var(--yun-action-btn-hover-bg);
  color: var(--va-c-text);
}

.vg-cli-option:focus-visible {
  outline: 2px solid var(--yun-focus-color);
  outline-offset: 1px;
}

.vg-cli-option.is-selected {
  border-color: color-mix(in srgb, var(--va-c-link) 32%, transparent);
  background: color-mix(in srgb, var(--va-c-primary) 10%, transparent);
  color: var(--va-c-link);
}

.vg-cli-cursor {
  display: inline-block;
  width: 1ch;
  color: var(--va-c-link);
  font-weight: 700;
}

.vg-cli-opt-label {
  font-weight: 600;
}

.vg-cli-opt-hint {
  color: var(--va-c-text-3);
  font-size: 0.75rem;
}

.vg-cli-option.is-selected .vg-cli-opt-hint {
  color: var(--va-c-text-2);
}

.vg-cli-name-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
}

.vg-cli-name-input {
  max-width: 100%;
  padding: 0.12rem 0.45rem;
  border: 1px solid color-mix(in srgb, var(--va-c-link) 40%, var(--yun-surface-line));
  border-radius: 4px;
  background: var(--va-c-bg);
  color: var(--va-c-link);
  font: inherit;
  font-weight: 600;
}

.vg-cli-name-input:focus-visible {
  outline: 2px solid var(--yun-focus-color);
  outline-offset: 1px;
}

.vg-cli-note {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  padding: 0.35rem 0.55rem;
  border-radius: 4px;
  background: var(--va-c-yellow-soft);
  color: var(--va-c-yellow-1);
  font-family: var(--va-font-sans);
  font-size: 0.78rem;
}

.vg-cli-output {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding-top: 0.6rem;
  border-top: 1px dashed var(--yun-surface-line);
}

.vg-cli-next-label {
  color: var(--va-c-text-2);
  font-family: var(--va-font-sans);
  font-size: 0.76rem;
}

.vg-cli-next-cmds {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.6rem;
  color: var(--va-c-text-dark);
}

.vg-cli-preview-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.15rem;
}

.vg-cli-preview-key {
  color: var(--va-c-green-1);
  font-weight: 600;
}

.vg-cli-port-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.18rem 0.55rem;
  border: 1px solid color-mix(in srgb, var(--va-c-link) 38%, var(--yun-surface-line));
  border-radius: var(--yun-action-btn-radius, 0.625rem);
  background: color-mix(in srgb, var(--va-c-primary) 10%, transparent);
  color: var(--va-c-link);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 140ms ease;
}

.vg-cli-port-btn:hover {
  background: color-mix(in srgb, var(--va-c-primary) 16%, transparent);
}

.vg-cli-port-btn:focus-visible {
  outline: 2px solid var(--yun-focus-color);
  outline-offset: 2px;
}

.vg-cli-port-hint {
  font-family: var(--va-font-sans);
  font-size: 0.72rem;
  font-weight: 500;
  opacity: 0.85;
}

.vg-cli-preview-drawer {
  border-top: 1px solid var(--yun-surface-line);
}

.vg-cli-sync-hint {
  color: var(--va-c-text-2);
  font-size: 0.76rem;
}

@media (pointer: coarse) {
  .vg-cli-option,
  .vg-cli-port-btn {
    min-height: 44px;
  }
}
</style>
