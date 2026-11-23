<script setup lang="ts">
import { useAppStore } from 'valaxy'
import { computed, onMounted, onUnmounted, shallowRef, useId, useTemplateRef } from 'vue'

withDefaults(defineProps<{
  context?: 'card' | 'page' | 'body'
  src?: string
  siteName?: string
  kicker?: string
  eyebrow?: string
  title?: string
  subtitle?: string
}>(), {
  context: 'body',
  siteName: '云游君的小站',
  kicker: '建站指南',
  eyebrow: 'Hello,',
  title: 'Valaxy!',
  subtitle: '从零搭建属于自己的网站',
})

const id = useId()
const appStore = useAppStore()
const root = shallowRef<HTMLElement>()
const svg = useTemplateRef<SVGSVGElement>('svg')
defineExpose({ svg })

const mounted = shallowRef(false)
const orbiting = shallowRef(false)
const inView = shallowRef(false)
const pageVisible = shallowRef(true)
const pointerX = shallowRef(0)
const pointerY = shallowRef(0)

const isPlaying = computed(() => orbiting.value && inView.value && pageVisible.value)
const themeButtonLabel = computed(() => {
  if (!mounted.value)
    return '切换亮暗主题'
  return appStore.isDark ? '切换为浅色模式' : '切换为深色模式'
})
const frameStyle = computed(() => ({
  '--vg-px': pointerX.value.toFixed(3),
  '--vg-py': pointerY.value.toFixed(3),
}))

let observer: IntersectionObserver | undefined

function updateVisibility() {
  pageVisible.value = document.visibilityState !== 'hidden'
}

function toggleOrbit() {
  orbiting.value = !orbiting.value
}

function toggleSiteTheme() {
  appStore.toggleDark()
}

function handlePointerMove(event: PointerEvent) {
  if (event.pointerType !== 'mouse')
    return
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
    return
  const el = event.currentTarget as HTMLElement | null
  if (!el)
    return
  const rect = el.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0)
    return
  const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1
  pointerX.value = Math.max(-1, Math.min(1, nx))
  pointerY.value = Math.max(-1, Math.min(1, ny))
}

function resetPointer() {
  pointerX.value = 0
  pointerY.value = 0
}

onMounted(() => {
  mounted.value = true
  updateVisibility()
  document.addEventListener('visibilitychange', updateVisibility)
  if (typeof IntersectionObserver !== 'undefined') {
    observer = new IntersectionObserver(([entry]) => {
      inView.value = Boolean(entry?.isIntersecting)
    })
    if (root.value)
      observer.observe(root.value)
  }
  else {
    inView.value = true
  }
})

onUnmounted(() => {
  observer?.disconnect()
  document.removeEventListener('visibilitychange', updateVisibility)
})
</script>

<template>
  <div
    ref="root"
    class="vg-cover not-prose"
    :data-context="context"
    :class="{ 'is-orbiting': orbiting, 'is-playing': isPlaying }"
  >
    <div class="vg-cover-frame" :style="frameStyle">
      <svg
        ref="svg"
        class="vg-cover-svg"
        viewBox="0 0 1440 810"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <pattern
            :id="`${id}-grid`"
            width="42"
            height="42"
            patternUnits="userSpaceOnUse"
            x="824"
            y="243"
          >
            <path d="M 42 0 L 0 0 0 42" fill="none" class="vg-cover-grid-path" stroke-width="1" />
          </pattern>

          <clipPath :id="`${id}-panel-clip`">
            <rect x="818" y="216" width="389" height="431" />
          </clipPath>

          <radialGradient :id="`${id}-aura`" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="var(--vg-cover-aura)" stop-opacity="1" />
            <stop offset="65%" stop-color="var(--vg-cover-aura)" stop-opacity="0.35" />
            <stop offset="100%" stop-color="var(--vg-cover-aura)" stop-opacity="0" />
          </radialGradient>

          <linearGradient
            :id="`${id}-ring-a`"
            x1="472.734"
            y1="695.005"
            x2="499.213"
            y2="841.207"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="var(--vg-cover-ring-start)" />
            <stop offset="1" stop-color="var(--vg-cover-ring-end)" />
          </linearGradient>

          <linearGradient
            :id="`${id}-ring-b`"
            x1="543.866"
            y1="836.077"
            x2="534.684"
            y2="776.831"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#000000" stop-opacity="0.19" />
            <stop offset="1" stop-color="#000000" stop-opacity="0" />
          </linearGradient>

          <radialGradient
            :id="`${id}-logo-grad`"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(510 767) rotate(-90) scale(1452.5)"
          >
            <stop stop-color="var(--vg-cover-logo-start)" />
            <stop offset="1" stop-color="var(--vg-cover-logo-end)" />
          </radialGradient>

          <mask
            :id="`${id}-mask1`"
            style="mask-type:alpha"
            maskUnits="userSpaceOnUse"
            x="97"
            y="121"
            width="830"
            height="748"
          >
            <g style="mix-blend-mode:darken">
              <ellipse
                cx="512"
                cy="766"
                rx="102.062"
                ry="102.062"
                transform="rotate(-15 512 766)"
                fill="#9038FF"
              />
            </g>
            <rect
              x="-0.183013"
              y="-0.683013"
              width="579"
              height="159"
              transform="matrix(0.5 -0.866025 -0.866025 -0.5 635.881 702.112)"
              fill="#D9D9D9"
              stroke="black"
              stroke-linejoin="round"
            />
            <rect
              x="387.183"
              y="702.612"
              width="579"
              height="159"
              transform="rotate(-120 387.183 702.612)"
              fill="#D9D9D9"
              stroke="black"
              stroke-linejoin="round"
            />
          </mask>

          <mask
            :id="`${id}-mask0`"
            style="mask-type:alpha"
            maskUnits="userSpaceOnUse"
            x="97"
            y="222"
            width="830"
            height="647"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M729.48 756.469C729.478 756.471 729.475 756.473 729.472 756.475C729.606 756.361 729.625 756.36 729.48 756.469ZM690.046 767.723C685.618 766.845 680.868 765.982 675.803 765.143C634.63 758.32 576.843 753.701 512.383 753.12C447.923 752.538 390.063 756.114 348.774 762.193C343.694 762.941 338.929 763.717 334.486 764.515C338.914 765.394 343.664 766.256 348.729 767.095C389.902 773.918 447.689 778.537 512.149 779.119C576.609 779.7 634.469 776.124 675.758 770.045C680.838 769.298 685.603 768.521 690.046 767.723ZM295.261 752.552C295.118 752.441 295.137 752.442 295.269 752.558C295.266 752.556 295.264 752.554 295.261 752.552ZM295.052 775.769C295.054 775.768 295.057 775.766 295.06 775.764C294.926 775.877 294.907 775.878 295.052 775.769ZM729.263 779.68C729.266 779.682 729.268 779.684 729.271 779.686C729.413 779.798 729.395 779.796 729.263 779.68ZM511.932 803.118C642.542 804.296 748.572 788.686 748.756 768.252C748.941 747.819 643.21 730.299 512.6 729.121C381.99 727.942 275.96 743.552 275.776 763.986C275.591 784.42 381.322 801.939 511.932 803.118Z"
              :fill="`url(#${id}-ring-a)`"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M729.48 756.469C729.478 756.471 729.475 756.473 729.472 756.475C729.606 756.361 729.625 756.36 729.48 756.469ZM690.046 767.723C685.618 766.845 680.868 765.982 675.803 765.143C634.63 758.32 576.843 753.701 512.383 753.12C447.923 752.538 390.063 756.114 348.774 762.193C343.694 762.941 338.929 763.717 334.486 764.515C338.914 765.394 343.664 766.256 348.729 767.095C389.902 773.918 447.689 778.537 512.149 779.119C576.609 779.7 634.469 776.124 675.758 770.045C680.838 769.298 685.603 768.521 690.046 767.723ZM295.261 752.552C295.118 752.441 295.137 752.442 295.269 752.558C295.266 752.556 295.264 752.554 295.261 752.552ZM295.052 775.769C295.054 775.768 295.057 775.766 295.06 775.764C294.926 775.877 294.907 775.878 295.052 775.769ZM729.263 779.68C729.266 779.682 729.268 779.684 729.271 779.686C729.413 779.798 729.395 779.796 729.263 779.68ZM511.932 803.118C642.542 804.296 748.572 788.686 748.756 768.252C748.941 747.819 643.21 730.299 512.6 729.121C381.99 727.942 275.96 743.552 275.776 763.986C275.591 784.42 381.322 801.939 511.932 803.118Z"
              :fill="`url(#${id}-ring-b)`"
            />
            <g :mask="`url(#${id}-mask1)`">
              <rect x="-15" y="222" width="1071" height="979" fill="#D9D9D9" />
            </g>
          </mask>
        </defs>

        <!-- Solid canvas backdrop -->
        <rect width="1440" height="810" fill="var(--vg-cover-bg)" />

        <!-- Top editorial masthead -->
        <text x="232" y="88" class="vg-cover-site">{{ siteName }}</text>
        <text x="1207" y="88" text-anchor="end" class="vg-cover-kicker">{{ kicker }}</text>

        <!-- Editorial hairlines -->
        <line x1="84" y1="116" x2="1356" y2="116" class="vg-cover-rule" stroke-width="1.2" />
        <line x1="84" y1="749" x2="1356" y2="749" class="vg-cover-rule" stroke-width="1.2" />

        <!-- Left editorial typography -->
        <text x="232" y="324" class="vg-cover-eyebrow">{{ eyebrow }}</text>
        <text x="226" y="476" class="vg-cover-title">{{ title }}</text>
        <text x="236" y="566" class="vg-cover-subtitle">{{ subtitle }}</text>

        <!-- Right blueprint panel -->
        <rect x="818" y="216" width="389" height="431" fill="var(--vg-cover-panel-bg)" />
        <rect x="818" y="216" width="389" height="431" :fill="`url(#${id}-grid)`" />

        <g :clip-path="`url(#${id}-panel-clip)`">
          <circle
            class="vg-cover-aura"
            cx="1012.5"
            cy="431.5"
            r="148"
            :fill="`url(#${id}-aura)`"
          />

          <!-- Center crosshair -->
          <line x1="1012.5" y1="240" x2="1012.5" y2="623" class="vg-cover-axis" stroke-width="1" />
          <line x1="838" y1="431.5" x2="1187" y2="431.5" class="vg-cover-axis" stroke-width="1" />

          <!-- Orbital system -->
          <g class="vg-cover-orbits">
            <circle cx="1012.5" cy="431.5" r="174" fill="none" class="vg-cover-orbit-line" stroke-width="1" />

            <!-- Orbiting comet on outer circular track -->
            <g class="vg-cover-comet vg-cover-motion">
              <circle cx="1186.5" cy="431.5" r="10" fill="var(--vg-cover-comet)" opacity="0.24" />
              <circle cx="1186.5" cy="431.5" r="4.5" fill="var(--vg-cover-comet)" />
            </g>

            <!-- Tilted ellipse A -->
            <g transform="translate(1012.5 431.5) rotate(-35)">
              <ellipse rx="200" ry="88" fill="none" class="vg-cover-orbit-line" stroke-width="1.2" />
              <ellipse
                class="vg-cover-tracer vg-cover-tracer--a vg-cover-motion"
                rx="200"
                ry="88"
                pathLength="100"
                fill="none"
                stroke-width="2"
                stroke-linecap="round"
                stroke-dasharray="20 80"
              />
              <circle class="vg-cover-sat-halo" cx="198" cy="-12" r="11" fill="var(--vg-cover-dot-a)" />
              <circle cx="198" cy="-12" r="5.5" fill="var(--vg-cover-dot-a)" />
            </g>

            <!-- Tilted ellipse B -->
            <g transform="translate(1012.5 431.5) rotate(42)">
              <ellipse rx="186" ry="84" fill="none" class="vg-cover-orbit-line" stroke-width="1.15" />
              <ellipse
                class="vg-cover-tracer vg-cover-tracer--b vg-cover-motion"
                rx="186"
                ry="84"
                pathLength="100"
                fill="none"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-dasharray="16 84"
              />
              <circle class="vg-cover-sat-halo" cx="-186" cy="0" r="10" fill="var(--vg-cover-dot-b)" />
              <circle cx="-186" cy="0" r="4.5" fill="var(--vg-cover-dot-b)" />
            </g>
          </g>

          <!-- Official Valaxy emblem -->
          <g class="vg-cover-emblem">
            <g class="vg-cover-emblem-pulse vg-cover-motion">
              <g transform="translate(889.6 300.6) scale(0.24)">
                <g :mask="`url(#${id}-mask0)`">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1024 0H0V1024H1024V0ZM666 766C666 851.052 597.052 920 512 920C426.948 920 358 851.052 358 766C358 680.949 426.948 612 512 612C597.052 612 666 680.949 666 766ZM610.584 739.585C625.173 794.031 592.862 849.996 538.416 864.585C483.969 879.174 428.005 846.863 413.416 792.416C398.827 737.969 431.138 682.005 485.584 667.416C540.031 652.827 595.995 685.138 610.584 739.585Z"
                    :fill="`url(#${id}-logo-grad)`"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>

        <rect
          x="818.5"
          y="216.5"
          width="388"
          height="430"
          fill="none"
          class="vg-cover-panel-border"
          stroke-width="1.2"
        />
      </svg>

      <!-- Interactive overlay -->
      <span class="vg-cover-sr">{{ siteName }} · {{ kicker }} — {{ eyebrow }} {{ title }} {{ subtitle }}</span>

      <button
        type="button"
        class="vg-cover-orbit-hit"
        :aria-pressed="orbiting"
        :aria-label="orbiting ? '暂停封面轨道动画' : '启动封面轨道动画'"
        @click="toggleOrbit"
        @pointermove="handlePointerMove"
        @pointerleave="resetPointer"
      />

      <div class="vg-cover-controls">
        <button
          type="button"
          class="vg-cover-btn vg-cover-orbit-btn"
          :aria-pressed="orbiting"
          @click="toggleOrbit"
        >
          <span class="vg-cover-btn-dot" aria-hidden="true" />
          <span>{{ orbiting ? '暂停轨道' : '启动轨道' }}</span>
        </button>

        <button
          v-if="context !== 'card'"
          type="button"
          class="vg-cover-btn vg-cover-theme-btn"
          :aria-label="themeButtonLabel"
          @click="toggleSiteTheme"
        >
          <span class="vg-cover-only-light">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
            <span>切换深色</span>
          </span>
          <span class="vg-cover-only-dark">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
            <span>切换浅色</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vg-cover {
  --vg-cover-bg: #eef1f9;
  --vg-cover-rule: #b1bbc5;
  --vg-cover-edge: rgb(177 187 197 / 0.55);
  --vg-cover-site: #121d30;
  --vg-cover-kicker: #4e5d71;
  --vg-cover-eyebrow: #4a5b6f;
  --vg-cover-title: #0e1a34;
  --vg-cover-subtitle: #101a30;
  --vg-cover-panel-bg: #dfe8f5;
  --vg-cover-panel-border: #afbccc;
  --vg-cover-panel-border-hover: #7c8fb5;
  --vg-cover-grid: #d2dceb;
  --vg-cover-axis: rgb(95 114 148 / 0.34);
  --vg-cover-orbit: rgb(88 106 148 / 0.45);
  --vg-cover-orbit-active: rgb(104 78 232 / 0.85);
  --vg-cover-dot-a: #5246d5;
  --vg-cover-dot-b: #7285ac;
  --vg-cover-comet: #6d28d9;
  --vg-cover-aura: rgb(124 58 237 / 0.14);
  --vg-cover-logo-start: #8300ef;
  --vg-cover-logo-end: #3b82f6;
  --vg-cover-ring-start: #9444fb;
  --vg-cover-ring-end: #4d08a4;
  --vg-cover-btn-bg: rgb(255 255 255 / 0.72);
  --vg-cover-btn-bg-hover: rgb(255 255 255 / 0.94);
  --vg-cover-btn-border: rgb(126 144 176 / 0.42);
  --vg-cover-btn-text: #27364f;
  --vg-cover-btn-active-bg: rgb(110 68 255 / 0.12);
  --vg-cover-btn-active-border: rgb(110 68 255 / 0.45);
  --vg-cover-btn-active-text: #4c27c9;

  position: relative;
  isolation: isolate;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background-color: var(--vg-cover-bg);
  border-radius: inherit;
  user-select: none;
  transition: background-color 220ms ease;
}

:global(html.dark .vg-cover) {
  --vg-cover-bg: #151822;
  --vg-cover-rule: rgb(148 163 184 / 0.24);
  --vg-cover-edge: rgb(255 255 255 / 0.08);
  --vg-cover-site: #edf1fa;
  --vg-cover-kicker: #9aa8bf;
  --vg-cover-eyebrow: #98a8c2;
  --vg-cover-title: #f4f7ff;
  --vg-cover-subtitle: #cbd5e6;
  --vg-cover-panel-bg: #1b2234;
  --vg-cover-panel-border: rgb(148 163 184 / 0.28);
  --vg-cover-panel-border-hover: rgb(167 139 250 / 0.52);
  --vg-cover-grid: rgb(148 175 220 / 0.09);
  --vg-cover-axis: rgb(165 185 225 / 0.22);
  --vg-cover-orbit: rgb(165 185 225 / 0.34);
  --vg-cover-orbit-active: rgb(167 139 250 / 0.9);
  --vg-cover-dot-a: #a78bfa;
  --vg-cover-dot-b: #93c5fd;
  --vg-cover-comet: #c4b5fd;
  --vg-cover-aura: rgb(139 92 246 / 0.24);
  --vg-cover-logo-start: #a04dff;
  --vg-cover-logo-end: #60a5fa;
  --vg-cover-ring-start: #b574ff;
  --vg-cover-ring-end: #6d28d9;
  --vg-cover-btn-bg: rgb(28 34 50 / 0.8);
  --vg-cover-btn-bg-hover: rgb(38 46 68 / 0.94);
  --vg-cover-btn-border: rgb(148 163 184 / 0.28);
  --vg-cover-btn-text: #dce4f2;
  --vg-cover-btn-active-bg: rgb(167 139 250 / 0.18);
  --vg-cover-btn-active-border: rgb(167 139 250 / 0.55);
  --vg-cover-btn-active-text: #e2d4ff;
}

.vg-cover[data-context='card'],
.vg-cover[data-context='page'] {
  height: 100%;
  aspect-ratio: auto;
  display: grid;
  place-items: center;
  container-type: size;
}

.vg-cover[data-context='page'] {
  box-shadow: inset 0 -1px 0 var(--vg-cover-edge);
}

.vg-cover-frame {
  position: relative;
  width: 100%;
  height: 100%;
}

.vg-cover[data-context='card'] .vg-cover-frame,
.vg-cover[data-context='page'] .vg-cover-frame {
  width: min(100cqw, calc(100cqh * 16 / 9));
  height: auto;
  aspect-ratio: 16 / 9;
}

.vg-cover-svg {
  display: block;
  width: 100%;
  height: 100%;
}

/* SVG Typography */
.vg-cover-site {
  font-family: 'Yun Home Serif', 'Noto Serif SC', 'Songti SC', STSong, serif;
  font-size: 30px;
  font-weight: 700;
  fill: var(--vg-cover-site);
}

.vg-cover-kicker {
  font-family: system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 22px;
  letter-spacing: 0.06em;
  fill: var(--vg-cover-kicker);
}

.vg-cover-eyebrow {
  font-family: Georgia, 'Times New Roman', 'Noto Serif SC', serif;
  font-style: italic;
  font-size: 70px;
  fill: var(--vg-cover-eyebrow);
}

.vg-cover-title {
  font-family: Georgia, 'Times New Roman', 'Noto Serif SC', serif;
  font-size: 184px;
  font-weight: 500;
  letter-spacing: -0.02em;
  fill: var(--vg-cover-title);
}

.vg-cover-subtitle {
  font-family: 'Noto Serif SC', 'Songti SC', STSong, 'Source Han Serif SC', serif;
  font-size: 38px;
  font-weight: 600;
  letter-spacing: 0.04em;
  fill: var(--vg-cover-subtitle);
}

/* Panel & orbital motion */
.vg-cover-rule {
  stroke: var(--vg-cover-rule);
}

.vg-cover-grid-path {
  stroke: var(--vg-cover-grid);
}

.vg-cover-axis {
  stroke: var(--vg-cover-axis);
}

.vg-cover-orbit-line {
  stroke: var(--vg-cover-orbit);
}

.vg-cover-panel-border {
  stroke: var(--vg-cover-panel-border);
  transition: stroke 220ms ease;
}

.vg-cover-aura {
  opacity: 0.55;
  transition: opacity 320ms ease;
}

.is-orbiting .vg-cover-aura,
.vg-cover-frame:has(.vg-cover-orbit-hit:hover) .vg-cover-aura {
  opacity: 1;
}

.vg-cover-frame:has(.vg-cover-orbit-hit:hover) .vg-cover-panel-border,
.is-orbiting .vg-cover-panel-border {
  stroke: var(--vg-cover-panel-border-hover);
}

.vg-cover-orbits {
  transform: translate(calc(var(--vg-px, 0) * 3px), calc(var(--vg-py, 0) * 3px));
  transition: transform 180ms ease-out;
}

.vg-cover-emblem {
  transform: translate(calc(var(--vg-px, 0) * 6px), calc(var(--vg-py, 0) * 6px));
  transition: transform 180ms ease-out;
}

.vg-cover-emblem-pulse {
  transform-origin: 1012.5px 431.5px;
  animation: vg-cover-breathe 4.4s ease-in-out infinite alternate;
}

.vg-cover-comet {
  opacity: 0;
  transform-origin: 1012.5px 431.5px;
  transition: opacity 260ms ease;
  animation: vg-cover-spin 16s linear infinite;
}

.is-orbiting .vg-cover-comet {
  opacity: 1;
}

.vg-cover-tracer {
  opacity: 0;
  transition: opacity 280ms ease;
}

.is-orbiting .vg-cover-tracer {
  opacity: 0.9;
}

.vg-cover-tracer--a {
  stroke: var(--vg-cover-orbit-active);
  animation: vg-cover-dash-a 7s linear infinite;
}

.vg-cover-tracer--b {
  stroke: var(--vg-cover-dot-b);
  animation: vg-cover-dash-b 9s linear infinite;
}

.vg-cover-sat-halo {
  opacity: 0.14;
  transition: opacity 280ms ease;
}

.is-orbiting .vg-cover-sat-halo {
  opacity: 0.28;
}

.vg-cover-motion {
  animation-play-state: paused;
}

.is-playing .vg-cover-motion {
  animation-play-state: running;
}

/* Interactive HTML overlay */
.vg-cover-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.vg-cover-orbit-hit {
  position: absolute;
  left: 56.8%;
  top: 26.67%;
  width: 27.01%;
  height: 53.21%;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.vg-cover-orbit-hit:focus-visible {
  outline: 2px solid var(--vg-cover-orbit-active);
  outline-offset: 4px;
  border-radius: 2px;
}

.vg-cover-controls {
  position: absolute;
  left: 16.1%;
  top: 75.5%;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  z-index: 2;
}

.vg-cover-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.36rem;
  padding: 0.24rem 0.64rem;
  border: 1px solid var(--vg-cover-btn-border);
  border-radius: 999px;
  background: var(--vg-cover-btn-bg);
  color: var(--vg-cover-btn-text);
  font-family: system-ui, -apple-system, 'PingFang SC', sans-serif;
  font-size: clamp(0.68rem, 1.15vw, 0.78rem);
  font-weight: 500;
  line-height: 1.3;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease;
}

.vg-cover-btn:hover {
  background: var(--vg-cover-btn-bg-hover);
}

.vg-cover-btn svg {
  width: 1.05em;
  height: 1.05em;
  flex: none;
}

.vg-cover-btn:focus-visible {
  outline: 2px solid var(--vg-cover-orbit-active);
  outline-offset: 2px;
}

.vg-cover-orbit-btn[aria-pressed='true'] {
  background: var(--vg-cover-btn-active-bg);
  border-color: var(--vg-cover-btn-active-border);
  color: var(--vg-cover-btn-active-text);
}

.vg-cover-btn-dot {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 50%;
  background: var(--vg-cover-dot-b);
  transition: background-color 160ms ease, box-shadow 160ms ease;
}

.vg-cover-orbit-btn[aria-pressed='true'] .vg-cover-btn-dot {
  background: var(--vg-cover-orbit-active);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vg-cover-orbit-active) 26%, transparent);
}

.vg-cover-only-light {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.vg-cover-only-dark {
  display: none;
}

:global(html.dark .vg-cover .vg-cover-only-light) {
  display: none;
}

:global(html.dark .vg-cover .vg-cover-only-dark) {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.vg-cover[data-context='card'] .vg-cover-controls {
  top: 74%;
}

.vg-cover[data-context='card'] .vg-cover-btn {
  padding: 0.16rem 0.48rem;
  font-size: 0.68rem;
}

@media (max-width: 640px) {
  .vg-cover[data-context='page'] .vg-cover-controls,
  .vg-cover[data-context='body'] .vg-cover-controls {
    top: 75%;
    gap: 0.3rem;
  }

  .vg-cover[data-context='page'] .vg-cover-btn,
  .vg-cover[data-context='body'] .vg-cover-btn {
    gap: 0.24rem;
    padding: 0.14rem 0.44rem;
    font-size: 0.625rem;
  }
}

@keyframes vg-cover-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes vg-cover-dash-a {
  to {
    stroke-dashoffset: -100;
  }
}

@keyframes vg-cover-dash-b {
  to {
    stroke-dashoffset: 100;
  }
}

@keyframes vg-cover-breathe {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.03);
  }
}

@media (prefers-reduced-motion: reduce) {
  .vg-cover,
  .vg-cover-panel-border,
  .vg-cover-aura,
  .vg-cover-orbits,
  .vg-cover-emblem,
  .vg-cover-comet,
  .vg-cover-tracer,
  .vg-cover-sat-halo,
  .vg-cover-btn,
  .vg-cover-btn-dot {
    transition: none;
  }

  .vg-cover-motion {
    animation: none;
  }
}
</style>
