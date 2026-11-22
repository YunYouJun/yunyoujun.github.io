<script setup lang="ts">
import type { GuideHighlightZone } from './useGuideSite'
import { computed } from 'vue'
import { useGuideSite } from './useGuideSite'

const props = withDefaults(defineProps<{
  highlightZone?: GuideHighlightZone
  flashZone?: GuideHighlightZone
  urlOverride?: string
  brokenBase?: boolean
  compact?: boolean
  logLine?: string
  bannerReplayKey?: number
  postTitleOverride?: string
}>(), {
  highlightZone: 'none',
  flashZone: 'none',
  brokenBase: false,
  compact: false,
  bannerReplayKey: 0,
})

const { state, primaryRgb } = useGuideSite()

const charSizePattern = [1.02, 0.88, 0.94, 1.0, 0.9, 0.96, 0.88, 0.94]

const displayUrl = computed(() => props.urlOverride || 'http://localhost:4859/')
const displayBannerTitle = computed(() => {
  const raw = state.bannerTitle.trim() || 'Valaxy'
  return Array.from(raw).slice(0, 8).join('')
})
const bannerCharSizes = computed(() =>
  Array.from(displayBannerTitle.value, (_, i) => charSizePattern[i % charSizePattern.length]),
)
const displayPostTitle = computed(() => props.postTitleOverride || state.postSavedTitle || 'Hello, Valaxy!')

const themeCascadeStyle = computed(() => ({
  '--va-c-primary': state.primaryColor,
  '--va-c-primary-rgb': primaryRgb.value,
}))

function zoneClasses(zone: Exclude<GuideHighlightZone, 'none' | 'all'>) {
  return {
    'is-zone-active': props.highlightZone === zone || props.highlightZone === 'all',
    'is-zone-flash': props.flashZone === zone,
  }
}
</script>

<template>
  <div
    class="vg-minisite"
    :class="{ 'is-broken-base': brokenBase, 'is-compact': compact }"
    :style="themeCascadeStyle"
  >
    <div class="vg-minisite-bar">
      <span class="vg-minisite-url" :title="displayUrl">
        <span class="i-ri-global-line vg-minisite-url-icon" aria-hidden="true" />
        <span>{{ displayUrl }}</span>
      </span>

      <span v-if="brokenBase" class="vg-pill vg-pill--red">
        <span class="i-ri-error-warning-line" aria-hidden="true" />
        <span>CSS 404</span>
      </span>
      <span v-else class="vg-minisite-theme-tag">
        <span class="vg-minisite-swatch-dot" aria-hidden="true" />
        <span>theme-yun</span>
      </span>
    </div>

    <div v-if="brokenBase" class="vg-broken-viewport">
      <div class="vg-broken-alert">
        <code>GET {{ displayUrl }}assets/index.css → 404 Not Found</code>
      </div>
      <div class="vg-broken-raw">
        <h1>{{ state.siteTitle || 'Valaxy Blog' }}</h1>
        <p>{{ state.authorName || 'Author' }}</p>
        <hr>
        <h2>{{ displayPostTitle }}</h2>
        <p>样式表路径少了仓库名前缀，浏览器退回到无样式纯 HTML。</p>
      </div>
    </div>

    <div v-else class="vg-minisite-viewport vg-stage">
      <header class="vg-minisite-nav" :class="zoneClasses('theme')">
        <span class="vg-minisite-brand" :class="zoneClasses('title')">
          {{ state.siteTitle || 'Valaxy Blog' }}
        </span>
        <span class="vg-minisite-author" :class="zoneClasses('author')">
          <span class="i-ri-user-line" aria-hidden="true" />
          <span>{{ state.authorName || '你的名字' }}</span>
        </span>
      </header>

      <div
        v-if="state.bannerEnabled && !compact"
        class="vg-minisite-banner"
        :class="zoneClasses('banner')"
      >
        <YunBannerCharContainer
          :key="`${displayBannerTitle}-${bannerReplayKey}`"
          :title="displayBannerTitle"
          :chars="bannerCharSizes"
        />
      </div>

      <article class="yun-card vg-minisite-post" :class="zoneClasses('post')">
        <div class="vg-minisite-post-title-row">
          <span class="i-ri-pushpin-line vg-minisite-pin" aria-hidden="true" />
          <span class="post-card-title yun-title-effects vg-minisite-post-title">
            {{ displayPostTitle }}
          </span>
        </div>

        <div class="vg-minisite-post-meta">
          <span class="vg-minisite-meta-item">
            <span class="i-ri-folder-line" aria-hidden="true" />
            <span>笔记</span>
          </span>
          <span class="yun-post-badge vg-minisite-badge" :class="zoneClasses('theme')">
            #Valaxy
          </span>
        </div>

        <p v-if="!compact" class="vg-minisite-post-excerpt">
          用一条命令把网站搭起来，打开本地预览边写边看效果。
        </p>

        <div class="vg-minisite-post-footer">
          <span class="vg-minisite-read-link" :class="zoneClasses('theme')">
            <span>阅读全文</span>
            <span class="i-ri-arrow-right-s-line" aria-hidden="true" />
          </span>
        </div>
      </article>

      <div v-if="highlightZone === 'workflow'" class="vg-minisite-workflow-bar">
        <span class="i-ri-flashlight-line" aria-hidden="true" />
        <span>由 .github/workflows/gh-pages.yml 构建并发布</span>
      </div>
    </div>

    <div v-if="logLine" class="vg-minisite-log">
      <code>{{ logLine }}</code>
    </div>
  </div>
</template>

<style scoped lang="scss">
.vg-minisite {
  --va-c-link: var(--va-c-primary);
  --va-c-primary-light: color-mix(in srgb, var(--va-c-primary) 80%, white);
  --va-c-primary-lighter: color-mix(in srgb, var(--va-c-primary) 42%, white);
  --banner-line-color: color-mix(in srgb, var(--va-c-link) 36%, var(--yun-surface-line));
  --banner-char-color: var(--va-c-text-dark);
  --banner-char-bg-color: color-mix(in srgb, var(--va-c-bg-light) 86%, transparent);
  --banner-char-hover-color: color-mix(in srgb, var(--va-c-link) 18%, var(--va-c-bg-light));
  --banner-char-size: 0.82rem;
  --line-animation-duration: 0.08s;

  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  color: var(--va-c-text);
}

:global(.dark) .vg-minisite {
  --va-c-link: color-mix(in srgb, var(--va-c-primary) 50%, white);
  --va-c-primary-light: color-mix(in srgb, var(--va-c-primary) 64%, white);
  --va-c-primary-lighter: color-mix(in srgb, var(--va-c-primary) 46%, white);
}

.vg-minisite-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.45rem 0.75rem;
  border-bottom: 1px solid var(--yun-surface-line);
  background: transparent;
  font-size: 0.75rem;
}

.vg-minisite-url {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  color: var(--va-c-text-2);
  font-family: var(--va-font-mono);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vg-minisite-url-icon {
  flex: none;
  color: var(--va-c-link);
}

.vg-minisite-theme-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  flex: none;
  color: var(--va-c-text-3);
  font-family: var(--va-font-mono);
  font-size: 0.7rem;
}

.vg-minisite-swatch-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--va-c-link);
}

.vg-minisite-viewport {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.65rem;
  padding: 0.75rem;
  min-height: 11rem;
}

.vg-minisite.is-compact .vg-minisite-viewport {
  min-height: 0;
  gap: 0.5rem;
  padding: 0.65rem;
}

.vg-minisite-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.2rem 0.35rem;
  border-radius: 4px;
  transition: outline-color 180ms ease;
}

.vg-minisite-brand {
  padding: 0.08rem 0.25rem;
  border-radius: 4px;
  color: var(--va-c-text-dark);
  font-family: var(--yun-post-title-font-family, var(--va-font-serif));
  font-size: 0.88rem;
  font-weight: 700;
}

.vg-minisite-author {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.08rem 0.25rem;
  border-radius: 4px;
  color: var(--va-c-text-2);
  font-size: 0.75rem;
}

/* Scoped YunBannerCharContainer styling so chars stack vertically cleanly in any post view */
.vg-minisite-banner {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 0.35rem 0;
  border-radius: 6px;
}

.vg-minisite-banner::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  transform: translateX(-50%);
  background: var(--banner-line-color);
  pointer-events: none;
}

.vg-minisite-banner :deep(.banner-char-container) {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.14rem;
  font-family: var(--va-font-serif);
  font-weight: 700;
}

.vg-minisite-banner :deep(.char-box) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.6rem;
  min-height: 1.5rem;
}

.vg-minisite-banner :deep(.char-left),
.vg-minisite-banner :deep(.char-right) {
  display: flex;
  width: 100%;
  opacity: 1;
  animation: vg-banner-char-in 260ms var(--yun-ease-in, ease-out) both;
}

.vg-minisite-banner :deep(.char-left) {
  justify-content: flex-start;
}

.vg-minisite-banner :deep(.char-right) {
  justify-content: flex-end;
}

.vg-minisite-banner :deep(.char) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.65rem;
  min-height: 1.5rem;
  padding: 0.12rem 0.22rem;
  border: 1px solid var(--yun-surface-line);
  background: var(--banner-char-bg-color);
  color: var(--banner-char-color);
  font-size: var(--banner-char-size, 0.92rem);
  line-height: 1;
  transition:
    background-color 180ms ease,
    color 180ms ease,
    border-color 180ms ease;
}

.vg-minisite-banner :deep(.char:hover) {
  border-color: var(--va-c-link);
  background: var(--banner-char-hover-color);
  color: var(--va-c-link);
}

@keyframes vg-banner-char-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.vg-minisite-post {
  display: flex;
  flex-direction: column;
  gap: 0.38rem;
  margin: 0;
  padding: 0.65rem 0.78rem;
  border: 1px solid var(--yun-surface-line);
  border-radius: var(--va-card-border-radius, 0.5rem);
  background: var(--va-c-bg-light);
  box-shadow: none;
}

.vg-minisite-post-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.32rem;
}

.vg-minisite-pin {
  flex: none;
  color: var(--va-c-link);
  font-size: 0.85rem;
}

.vg-minisite-post-title {
  margin: 0;
  font-size: 0.94rem;
  font-weight: 700;
  line-height: 1.35;
  text-align: center;
  background-image: linear-gradient(90deg, var(--va-c-link), var(--va-c-primary-light));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.vg-minisite-post-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  color: var(--va-c-text-3);
  font-size: 0.72rem;
}

.vg-minisite-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.22rem;
}

.vg-minisite-badge {
  color: var(--va-c-link);
  background: color-mix(in srgb, var(--va-c-primary) 12%, transparent);
  padding: 0.08rem 0.42rem;
  border-radius: 999px;
  font-size: 0.7rem;
}

.vg-minisite-post-excerpt {
  margin: 0.1rem 0 0;
  color: var(--va-c-text-2);
  font-size: 0.76rem;
  line-height: 1.5;
  text-align: center;
}

.vg-minisite-post-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.1rem;
}

.vg-minisite-read-link {
  display: inline-flex;
  align-items: center;
  gap: 0.12rem;
  color: var(--va-c-link);
  font-size: 0.74rem;
  font-weight: 500;
}

.vg-minisite-workflow-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.35rem 0.55rem;
  border-top: 1px dashed color-mix(in srgb, var(--va-c-link) 36%, var(--yun-surface-line));
  color: var(--va-c-link);
  font-size: 0.73rem;
}

/* Zone highlight & flash */
.is-zone-active {
  outline: 1.5px solid color-mix(in srgb, var(--va-c-link) 62%, transparent);
  outline-offset: 2px;
}

.is-zone-flash {
  animation: vg-zone-pulse 900ms var(--yun-ease-in, ease-out);
}

@keyframes vg-zone-pulse {
  0% {
    outline: 2px solid var(--va-c-link);
    outline-offset: 3px;
    background-color: color-mix(in srgb, var(--va-c-link) 14%, transparent);
  }
  100% {
    outline-offset: 2px;
    background-color: transparent;
  }
}

/* Broken base 404 unstyled mode */
.vg-broken-viewport {
  display: flex;
  flex: 1;
  flex-direction: column;
  background: #fff;
  color: #111;
}

.vg-broken-alert {
  padding: 0.45rem 0.75rem;
  border-bottom: 1px solid color-mix(in srgb, var(--va-c-red-1) 30%, transparent);
  background: var(--va-c-red-soft);
  color: var(--va-c-red-1);
  font-size: 0.72rem;
}

.vg-broken-raw {
  padding: 0.75rem 0.85rem;
  font-family: Georgia, 'Times New Roman', serif;
  line-height: 1.45;
}

.vg-broken-raw h1 {
  margin: 0 0 0.25rem;
  font-size: 1.25rem;
  font-weight: 700;
}

.vg-broken-raw h2 {
  margin: 0.5rem 0 0.25rem;
  font-size: 1.02rem;
  font-weight: 700;
}

.vg-broken-raw p {
  margin: 0.25rem 0;
  font-size: 0.84rem;
}

.vg-broken-raw hr {
  margin: 0.45rem 0;
  border: none;
  border-top: 1px solid #999;
}

.vg-minisite-log {
  padding: 0.35rem 0.75rem;
  border-top: 1px solid var(--yun-surface-line);
  background: transparent;
  color: var(--va-c-text-3);
  font-size: 0.72rem;
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .vg-minisite-banner :deep(.char-left),
  .vg-minisite-banner :deep(.char-right),
  .is-zone-flash {
    animation: none;
  }
}
</style>
