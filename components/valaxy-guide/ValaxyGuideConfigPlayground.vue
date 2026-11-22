<script setup lang="ts">
import type { GuideHighlightZone } from './useGuideSite'
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'
import { COLOR_PRESETS, useGuideSite } from './useGuideSite'
import ValaxyGuideFrame from './ValaxyGuideFrame.vue'
import ValaxyGuideMiniSite from './ValaxyGuideMiniSite.vue'

type ConfigTab = 'site' | 'theme'
type DocKey = 'url' | 'title' | 'primary' | 'enable'
type PopoverKey = DocKey | 'swatch'

interface IntelliSenseDoc {
  signature: string
  defaultValue: string
  description: string
}

const intelliSenseDocs: Record<DocKey, IntelliSenseDoc> = {
  url: {
    signature: '(property) SiteConfig.url?: string',
    defaultValue: '\'https://example.com/\'',
    description: '站点上线后的完整域名，用于生成文章链接、RSS 与站点地图，不影响本地预览端口。',
  },
  title: {
    signature: '(property) SiteConfig.title?: string',
    defaultValue: '\'Valaxy Blog\'',
    description: '显示在浏览器标签页和站点首页的主标题，保存即热更新。',
  },
  primary: {
    signature: '(property) colors?: { primary?: string }',
    defaultValue: '\'#0078E7\'',
    description: '主题主色调，通过 CSS 变量链统一作用到链接、按钮、徽章与渐变文字。',
  },
  enable: {
    signature: '(property) banner?: { enable?: boolean; title?: string }',
    defaultValue: 'true',
    description: '控制 Yun 主题首页顶部竖排字块横幅是否开启；关闭后首页直接展示文章卡片。',
  },
}

const { state, siteUrl, resetSiteConfig } = useGuideSite()

const activeTab = shallowRef<ConfigTab>('theme')
const openPopover = shallowRef<PopoverKey | null>(null)
const flashZone = shallowRef<GuideHighlightZone>('none')
const bannerReplayKey = shallowRef(0)
const hmrCount = shallowRef(0)
const lastUpdatedFile = shallowRef('valaxy.config.ts')
const tabEls = shallowRef<HTMLButtonElement[]>([])

let flashTimer: ReturnType<typeof setTimeout> | undefined

onBeforeUnmount(() => {
  clearTimeout(flashTimer)
})

function pulseZone(zone: GuideHighlightZone, file: string) {
  hmrCount.value += 1
  lastUpdatedFile.value = file
  flashZone.value = zone
  clearTimeout(flashTimer)
  flashTimer = setTimeout(() => {
    flashZone.value = 'none'
  }, 900)
}

watch(() => state.siteTitle, () => pulseZone('title', 'site.config.ts'))
watch(() => state.authorName, () => pulseZone('author', 'site.config.ts'))
watch(() => state.primaryColor, () => pulseZone('theme', 'valaxy.config.ts'))
watch(
  [() => state.bannerEnabled, () => state.bannerTitle],
  ([enabled]) => {
    if (enabled)
      bannerReplayKey.value += 1
    pulseZone('banner', 'valaxy.config.ts')
  },
)

const hmrLogLine = computed(() =>
  hmrCount.value === 0
    ? '[vite] connected · 直接改动左侧代码字段即可实时触发 HMR'
    : `[vite] hot updated ${lastUpdatedFile.value} · HMR ${hmrCount.value} 次 · 整页刷新：0 次`,
)

function bindPopover(key: PopoverKey) {
  return {
    'open': openPopover.value === key,
    'onUpdate:open': (next: boolean) => {
      openPopover.value = next ? key : (openPopover.value === key ? null : openPopover.value)
    },
  }
}

function handleTabKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault()
    activeTab.value = activeTab.value === 'site' ? 'theme' : 'site'
    openPopover.value = null
    const nextEl = tabEls.value[activeTab.value === 'site' ? 0 : 1]
    nextEl?.focus()
  }
}

function replayBanner() {
  if (!state.bannerEnabled)
    state.bannerEnabled = true
  bannerReplayKey.value += 1
  pulseZone('banner', 'valaxy.config.ts')
}

function inputWidth(text: string, minChars = 6): string {
  const visualLen = Array.from(text).reduce((acc, ch) => acc + (/[\u4E00-\u9FFF]/.test(ch) ? 2 : 1), 0)
  return `${Math.max(visualLen + 2, minChars)}ch`
}
</script>

<template>
  <ValaxyGuideFrame
    class="vg-playground"
    eyebrow="配置实验室"
    :status="`HMR 局部更新 · ${hmrCount} 次`"
    caption="代码即控件：直接在 TS 代码里修改字符串、点色块换主题色、切换布尔值，或点击带虚线的字段查看类型提示。"
    flush
  >
    <template #icon>
      <span class="i-ri-code-s-slash-line vg-head-icon" aria-hidden="true" />
    </template>

    <template #head-right>
      <span class="vg-pill">零整页刷新</span>
    </template>

    <div class="vg-split vg-pg-split">
      <div class="vg-split-pane vg-pg-editor">
        <div class="vg-code-tabs">
          <div class="vg-code-tablist" role="tablist" aria-label="切换配置文件">
            <button
              :ref="(el) => { if (el) tabEls[0] = el as HTMLButtonElement }"
              type="button"
              role="tab"
              class="vg-tab"
              :class="{ 'is-active': activeTab === 'site' }"
              :aria-selected="activeTab === 'site'"
              :tabindex="activeTab === 'site' ? 0 : -1"
              @click="activeTab = 'site'; openPopover = null"
              @keydown="handleTabKeydown"
            >
              site.config.ts
            </button>
            <button
              :ref="(el) => { if (el) tabEls[1] = el as HTMLButtonElement }"
              type="button"
              role="tab"
              class="vg-tab"
              :class="{ 'is-active': activeTab === 'theme' }"
              :aria-selected="activeTab === 'theme'"
              :tabindex="activeTab === 'theme' ? 0 : -1"
              @click="activeTab = 'theme'; openPopover = null"
              @keydown="handleTabKeydown"
            >
              valaxy.config.ts
            </button>
          </div>
          <span class="vg-pg-ts-hint">点击虚线字段看提示</span>
        </div>

        <div class="language-ts vg-shiki" role="tabpanel">
          <pre
            v-if="activeTab === 'site'"
            class="shiki shiki-themes github-light github-dark vp-code"
          ><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">defineSiteConfig</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'valaxy'</span></span>
<span class="line" />
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">export default</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> defineSiteConfig</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">({</span></span>
<span class="line">{{ '  ' }}<PopoverRoot v-bind="bindPopover('url')"><PopoverTrigger as-child><button type="button" class="vg-shiki-key" style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">url</button></PopoverTrigger><PopoverPortal to="#valaxy-teleports"><PopoverContent class="vg-popover" :side-offset="6" align="start" @open-auto-focus.prevent @close-auto-focus.prevent><code class="vg-pop-sig">{{ intelliSenseDocs.url.signature }}</code><p class="vg-pop-desc">{{ intelliSenseDocs.url.description }}</p><div class="vg-pop-def">默认值：<code>{{ intelliSenseDocs.url.defaultValue }}</code></div></PopoverContent></PopoverPortal></PopoverRoot><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'{{ siteUrl }}'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line">{{ '  ' }}<PopoverRoot v-bind="bindPopover('title')"><PopoverTrigger as-child><button type="button" class="vg-shiki-key" style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">title</button></PopoverTrigger><PopoverPortal to="#valaxy-teleports"><PopoverContent class="vg-popover" :side-offset="6" align="start" @open-auto-focus.prevent @close-auto-focus.prevent><code class="vg-pop-sig">{{ intelliSenseDocs.title.signature }}</code><p class="vg-pop-desc">{{ intelliSenseDocs.title.description }}</p><div class="vg-pop-def">默认值：<code>{{ intelliSenseDocs.title.defaultValue }}</code></div></PopoverContent></PopoverPortal></PopoverRoot><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'</span><input
  v-model="state.siteTitle"
  type="text"
  class="vg-shiki-input"
  :style="{ width: inputWidth(state.siteTitle) }"
  aria-label="站点标题 title"
><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  author: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    name: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'</span><input
  v-model="state.authorName"
  type="text"
  class="vg-shiki-input"
  :style="{ width: inputWidth(state.authorName) }"
  aria-label="作者名 author.name"
><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">})</span></span></code></pre>

          <pre
            v-else
            class="shiki shiki-themes github-light github-dark vp-code"
          ><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">defineValaxyConfig</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'valaxy'</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">UserThemeConfig</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'valaxy-theme-yun'</span></span>
<span class="line" />
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">export default</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> defineValaxyConfig</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">UserThemeConfig</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&gt;({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  theme: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'yun'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  themeConfig: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    colors: {</span></span>
<span class="line">{{ '      ' }}<PopoverRoot v-bind="bindPopover('primary')"><PopoverTrigger as-child><button type="button" class="vg-shiki-key" style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">primary</button></PopoverTrigger><PopoverPortal to="#valaxy-teleports"><PopoverContent class="vg-popover" :side-offset="6" align="start" @open-auto-focus.prevent @close-auto-focus.prevent><code class="vg-pop-sig">{{ intelliSenseDocs.primary.signature }}</code><p class="vg-pop-desc">{{ intelliSenseDocs.primary.description }}</p><div class="vg-pop-def">默认值：<code>{{ intelliSenseDocs.primary.defaultValue }}</code></div></PopoverContent></PopoverPortal></PopoverRoot><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><PopoverRoot v-bind="bindPopover('swatch')"><PopoverTrigger as-child><button type="button" class="vg-swatch-trigger" :aria-label="`选择主题主色，当前 ${state.primaryColor}`"><span class="vg-swatch-box" :style="{ background: state.primaryColor }" /><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'{{ state.primaryColor }}'</span></button></PopoverTrigger><PopoverPortal to="#valaxy-teleports"><PopoverContent class="vg-popover" :side-offset="6" align="start" @open-auto-focus.prevent @close-auto-focus.prevent><div class="vg-swatch-pop-head"><span>主题主色 · colors.primary</span><code>{{ state.primaryColor }}</code></div><div class="vg-swatch-grid"><button v-for="preset in COLOR_PRESETS" :key="preset.value" type="button" class="vg-chip" :class="{ 'is-active': state.primaryColor === preset.value }" @click="state.primaryColor = preset.value"><span class="vg-swatch-dot" :style="{ background: preset.value }" /><span>{{ preset.name }}</span></button></div><label class="vg-swatch-custom"><span>自定义色值</span><input v-model="state.primaryColor" type="color" aria-label="自定义主题颜色"></label></PopoverContent></PopoverPortal></PopoverRoot><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    banner: {</span></span>
<span class="line">{{ '      ' }}<PopoverRoot v-bind="bindPopover('enable')"><PopoverTrigger as-child><button type="button" class="vg-shiki-key" style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">enable</button></PopoverTrigger><PopoverPortal to="#valaxy-teleports"><PopoverContent class="vg-popover" :side-offset="6" align="start" @open-auto-focus.prevent @close-auto-focus.prevent><code class="vg-pop-sig">{{ intelliSenseDocs.enable.signature }}</code><p class="vg-pop-desc">{{ intelliSenseDocs.enable.description }}</p><div class="vg-pop-def">默认值：<code>{{ intelliSenseDocs.enable.defaultValue }}</code></div></PopoverContent></PopoverPortal></PopoverRoot><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><button
  type="button"
  class="vg-shiki-bool"
  style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"
  :aria-pressed="state.bannerEnabled"
  @click="state.bannerEnabled = !state.bannerEnabled"
>{{ state.bannerEnabled }}</button><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      title: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'</span><input
  v-model="state.bannerTitle"
  type="text"
  class="vg-shiki-input"
  :disabled="!state.bannerEnabled"
  :style="{ width: inputWidth(state.bannerTitle) }"
  aria-label="横幅文字 banner.title"
><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">})</span></span></code></pre>
        </div>
      </div>

      <div class="vg-split-pane vg-pg-preview">
        <ValaxyGuideMiniSite
          :flash-zone="flashZone"
          :banner-replay-key="bannerReplayKey"
          :log-line="hmrLogLine"
        />
      </div>
    </div>

    <template #actions>
      <div class="vg-pg-actions-left">
        <button
          type="button"
          class="vg-btn"
          :disabled="!state.bannerEnabled"
          @click="replayBanner"
        >
          <span class="i-ri-play-circle-line" aria-hidden="true" />
          <span>重播竖排字块</span>
        </button>
      </div>

      <button type="button" class="vg-btn" @click="resetSiteConfig">
        <span class="i-ri-restart-line" aria-hidden="true" />
        <span>恢复默认配置</span>
      </button>
    </template>
  </ValaxyGuideFrame>
</template>

<style scoped>
.vg-head-icon {
  color: var(--va-c-link);
  font-size: 1rem;
}

.vg-pg-editor {
  display: flex;
  flex-direction: column;
  background: var(--va-code-block-bg);
}

.vg-pg-ts-hint {
  color: var(--va-c-text-3);
  font-size: 0.72rem;
  white-space: nowrap;
}

.vg-swatch-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.32rem;
  padding: 0 0.28rem 0 0.2rem;
  border: 1px solid color-mix(in srgb, var(--va-c-link) 32%, var(--yun-surface-line));
  border-radius: 4px;
  background: transparent;
  font: inherit;
  cursor: pointer;
  transition: background-color 140ms ease;
}

.vg-swatch-trigger:hover {
  background: color-mix(in srgb, var(--va-c-link) 10%, transparent);
}

.vg-swatch-trigger:focus-visible {
  outline: 2px solid var(--yun-focus-color);
  outline-offset: 2px;
}

.vg-swatch-box {
  display: inline-block;
  width: 0.68rem;
  height: 0.68rem;
  border: 1px solid rgb(255 255 255 / 0.45);
  border-radius: 2px;
  box-shadow: 0 0 0 1px var(--yun-surface-line);
}

.vg-pg-actions-left {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
}

/* Popover inner styles inside #valaxy-teleports */
.vg-pop-sig {
  display: block;
  margin-bottom: 0.35rem;
  color: var(--va-c-link);
  font-family: var(--va-font-mono);
  font-size: 0.75rem;
  font-weight: 600;
}

.vg-pop-desc {
  margin: 0 0 0.35rem;
  color: var(--va-c-text);
  font-size: 0.78rem;
}

.vg-pop-def {
  color: var(--va-c-text-2);
  font-size: 0.74rem;
}

.vg-swatch-pop-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  margin-bottom: 0.5rem;
  color: var(--va-c-text-dark);
  font-size: 0.78rem;
  font-weight: 600;
}

.vg-swatch-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 0.55rem;
}

.vg-swatch-dot {
  display: inline-block;
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 999px;
}

.vg-swatch-custom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-top: 0.45rem;
  border-top: 1px solid var(--yun-surface-line);
  color: var(--va-c-text-2);
  font-size: 0.76rem;
}
</style>
