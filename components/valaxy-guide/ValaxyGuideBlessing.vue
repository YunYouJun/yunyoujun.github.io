<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue'
import { prefersReducedMotion } from './useGuideSite'
import '../../styles/valaxy-guide.scss'

const STORAGE_KEY = 'valaxy-guide-blessing:v1'

const messages = [
  '2020 → 2026 · 感谢你读到这里 ☁️',
  '祝你的小站早日亮起第一盏灯 ✨',
  '山高水长，我们在自己的域名下重逢',
] as const

const sparks = [
  { dx: '-28px', dy: '-18px', delay: '0ms' },
  { dx: '-10px', dy: '-26px', delay: '60ms' },
  { dx: '12px', dy: '-24px', delay: '30ms' },
  { dx: '30px', dy: '-16px', delay: '90ms' },
  { dx: '-18px', dy: '-10px', delay: '120ms' },
  { dx: '22px', dy: '-12px', delay: '140ms' },
] as const

const lightCount = shallowRef(0)
const shimmering = shallowRef(false)
const showSparks = shallowRef(false)
const sparkBurstKey = shallowRef(0)

let shimmerTimer: ReturnType<typeof setTimeout> | undefined
let sparkTimer: ReturnType<typeof setTimeout> | undefined

const activeWhisper = computed(() => {
  if (lightCount.value <= 0)
    return ''
  return messages[(lightCount.value - 1) % messages.length]
})

function triggerBlessing() {
  lightCount.value += 1

  try {
    window.localStorage.setItem(STORAGE_KEY, String(lightCount.value))
  }
  catch {
    // Ignore storage write failures
  }

  if (prefersReducedMotion())
    return

  shimmering.value = false
  void (typeof document !== 'undefined' && document.body.offsetWidth)
  shimmering.value = true
  clearTimeout(shimmerTimer)
  shimmerTimer = setTimeout(() => {
    shimmering.value = false
  }, 850)

  sparkBurstKey.value += 1
  showSparks.value = true
  clearTimeout(sparkTimer)
  sparkTimer = setTimeout(() => {
    showSparks.value = false
  }, 950)
}

onMounted(() => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = Number.parseInt(saved, 10)
      if (Number.isFinite(parsed) && parsed > 0)
        lightCount.value = parsed
    }
  }
  catch {
    // Ignore storage read failures
  }
})

onBeforeUnmount(() => {
  clearTimeout(shimmerTimer)
  clearTimeout(sparkTimer)
})
</script>

<template>
  <blockquote class="vg-blessing">
    <p class="vg-blessing-quote">
      <button
        type="button"
        class="vg-blessing-trigger"
        :aria-label="`永远相信美好的事情即将发生${lightCount > 0 ? `（已点亮 ${lightCount} 次）` : '，轻点一下试试'}`"
        @click="triggerBlessing"
      >
        <span class="vg-blessing-text" :class="{ 'is-shimmer': shimmering }">
          <slot />
        </span>

        <span v-if="showSparks" :key="sparkBurstKey" class="vg-blessing-sparks" aria-hidden="true">
          <span
            v-for="(spark, idx) in sparks"
            :key="idx"
            class="vg-blessing-spark"
            :style="{
              '--vg-dx': spark.dx,
              '--vg-dy': spark.dy,
              '--vg-delay': spark.delay,
            }"
          />
        </span>
      </button>
    </p>

    <p v-if="lightCount > 0" class="vg-blessing-whisper" aria-live="polite">
      <span>{{ activeWhisper }}</span>
      <span class="vg-pill vg-blessing-count">已点亮 {{ lightCount }} 次</span>
    </p>
  </blockquote>
</template>

<style scoped>
.vg-blessing {
  position: relative;
}

.vg-blessing-quote {
  margin: 0;
}

.vg-blessing-trigger {
  position: relative;
  display: inline;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: inherit;
  cursor: pointer;
}

.vg-blessing-trigger:focus-visible {
  outline: 2px solid var(--yun-focus-color);
  outline-offset: 4px;
  border-radius: 4px;
}

.vg-blessing-text {
  position: relative;
  display: inline-block;
  background-image: linear-gradient(
    110deg,
    currentColor 0%,
    currentColor 38%,
    var(--va-c-link) 50%,
    currentColor 62%,
    currentColor 100%
  );
  background-size: 240% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  background-clip: text;
}

.vg-blessing-text.is-shimmer {
  color: transparent;
  animation: vg-blessing-sheen 820ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.vg-blessing-sparks {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
}

.vg-blessing-spark {
  position: absolute;
  left: 0;
  top: 0;
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: var(--va-c-primary);
  opacity: 0;
  animation: vg-blessing-spark 900ms cubic-bezier(0.22, 1, 0.36, 1) var(--vg-delay, 0ms) forwards;
}

.vg-blessing-whisper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  margin: 0.45rem 0 0;
  color: var(--va-c-text-2);
  font-size: 0.8125rem;
}

.vg-blessing-count {
  font-size: 0.72rem;
  font-variant-numeric: tabular-nums;
}

@keyframes vg-blessing-sheen {
  0% {
    background-position: 100% 0;
  }

  100% {
    background-position: 0% 0;
  }
}

@keyframes vg-blessing-spark {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.4);
  }

  25% {
    opacity: 0.9;
  }

  100% {
    opacity: 0;
    transform: translate(calc(-50% + var(--vg-dx)), calc(-50% + var(--vg-dy))) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .vg-blessing-text.is-shimmer {
    color: inherit;
    animation: none;
  }

  .vg-blessing-sparks {
    display: none;
  }
}
</style>
