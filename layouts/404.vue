<script setup lang="ts">
import { useBack, useFrontmatter } from 'valaxy'
import { useThemeConfig } from 'valaxy-theme-yun/client'
import { computed, onMounted, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const { back } = useBack()
const route = useRoute()
const frontmatter = useFrontmatter()
const themeConfig = useThemeConfig()

const chars = ['4', '0', '4']
const title = computed(() => frontmatter.value.title || t('not_found.title'))

// 静态托管共用同一份 404.html，挂载后才读取访客访问的路径。
const mounted = shallowRef(false)
onMounted(() => {
  mounted.value = true
})
const missingPath = computed(() =>
  mounted.value && !/^\/404(?:\.html)?\/?$/.test(route.path) ? route.path : '',
)

const issueLink = computed(() => {
  const issueUrl = themeConfig.value.notFound?.issueLink
  if (!issueUrl)
    return ''

  const url = new URL(issueUrl)
  const path = missingPath.value
  url.searchParams.set('title', path ? `404: ${path}` : '404')
  url.searchParams.set('body', t('not_found.issue_body', { path }))
  return url.href
})
</script>

<template>
  <main class="yun-404 va-main w-full min-h-screen" text="center" flex="~ col" justify="center" items="center">
    <div class="yun-404-line top" aria-hidden="true" />

    <h1 class="yun-404-code" aria-label="404">
      <span
        v-for="(char, i) in chars" :key="i"
        class="yun-404-char" :style="{ '--char-index': i }"
        aria-hidden="true"
      >{{ char }}</span>
    </h1>

    <div class="yun-404-line bottom" aria-hidden="true" />

    <p class="yun-404-title">
      {{ title }}
    </p>
    <code v-if="missingPath" class="yun-404-path">{{ missingPath }}</code>

    <div class="yun-404-actions" flex="~ wrap" justify="center" items="center" gap="2">
      <button type="button" class="yun-404-action yun-404-back" @click="back">
        <span i-ri-arrow-left-line aria-hidden="true" />
        {{ t('button.back') }}
      </button>
      <AppLink
        v-if="issueLink" class="yun-404-action yun-404-report"
        :to="issueLink" rel="noreferrer" show-external-icon
      >
        <span i-ri-github-line aria-hidden="true" />
        {{ t('not_found.report') }}
      </AppLink>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@use 'valaxy-theme-yun/styles/mixins/_glass.scss' as glass;

$line-duration: 0.25s;
$char-duration: 0.3s;
$char-stagger: 0.06s;

.yun-404 {
  --yun-404-line-color: color-mix(in srgb, var(--banner-line-color) 42%, transparent);

  min-height: 100svh;
  padding: 2rem 1rem;
}

// 与首页 banner 一致：竖线先延伸，字块再浮现
.yun-404-line {
  width: 1px;
  height: var(--yun-404-line-height);
  background-color: var(--yun-404-line-color);
  animation: yun-404-extend $line-duration var(--yun-ease-in) both;

  &.top {
    --yun-404-line-height: clamp(2rem, 8vh, 4.5rem);

    transform-origin: bottom;
  }

  &.bottom {
    --yun-404-line-height: clamp(1rem, 4vh, 2.25rem);

    animation-delay: calc($line-duration + $char-duration + 2 * $char-stagger);
    transform-origin: top;
  }
}

.yun-404-code {
  display: flex;
  margin: 0;
  font-family: var(--va-font-serif);
  font-size: clamp(4rem, 18vw, 8rem);
  font-weight: 900;
  line-height: 1;
}

.yun-404-char {
  padding: 0.08em 0.16em;
  color: var(--banner-char-color);
  background-color: var(--banner-char-bg-color);
  border: 1px solid var(--yun-404-line-color);
  transition:
    color var(--va-transition-duration) ease-in-out,
    background-color var(--va-transition-duration) ease-in-out;
  animation: yun-404-char-in $char-duration var(--yun-ease-in) both;
  animation-delay: calc($line-duration + var(--char-index) * $char-stagger);

  & + & {
    margin-left: -1px;
  }

  @media (hover: hover) {
    &:hover {
      color: var(--banner-char-hover-color);
      background-color: var(--banner-char-color);
    }
  }
}

.yun-404-title {
  margin: 0.875rem 0 0;
  font-family: var(--va-font-serif);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.yun-404-path {
  max-width: min(100%, 48ch);
  margin-top: 0.375rem;
  overflow-wrap: anywhere;
  font-size: 0.8125rem;
  color: var(--va-c-text-2);
  background: none;
}

.yun-404-actions {
  margin-top: 1.25rem;
}

.yun-404-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.5rem 0.875rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 9999px;
  transition:
    color var(--va-transition-duration),
    background-color var(--va-transition-duration),
    box-shadow var(--va-transition-duration);

  &:focus-visible {
    outline: 2px solid var(--yun-focus-color);
    outline-offset: 2px;
  }

  > span,
  :deep(.icon-link) {
    flex: none;
    font-size: 1rem;
  }
}

.yun-404-back {
  @include glass.surface;

  color: var(--va-c-text);
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      background-color: var(--yun-glass-hover-fill);
      box-shadow: var(--yun-glass-hover-shadow);
    }
  }

  @media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
    &,
    &:hover {
      @include glass.solid;
    }
  }
}

.yun-404-report {
  color: var(--va-c-text-2);

  &:hover,
  &:focus-visible {
    color: var(--va-c-link);
    background-color: color-mix(in srgb, var(--va-c-link) 8%, transparent);
  }
}

@keyframes yun-404-extend {
  from {
    transform: scaleY(0);
  }
}

@keyframes yun-404-char-in {
  from {
    opacity: 0;
    transform: translateY(0.15em);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .yun-404-line,
  .yun-404-char {
    animation: none;
  }

  .yun-404-char,
  .yun-404-action {
    transition: none;
  }
}
</style>
