<script setup lang="ts">
import { useCookArticle } from './useCookArticle'
import '../../styles/cook-app.scss'

const { state, toggleQuarantineCrossed } = useCookArticle()
</script>

<template>
  <div
    id="cook-origin"
    class="cook-inline cook-rename-strip not-prose"
    :class="{ 'is-renamed': state.quarantineCrossed }"
  >
    <div class="cook-rename-display" aria-live="polite">
      <div class="cook-rename-line">
        <span class="cook-pill cook-pill--warm cook-rename-years">2022 → 2026</span>
        <span class="cook-rename-title">
          <span class="cook-rename-word" :class="{ 'is-crossed': state.quarantineCrossed }">隔离</span>
          <span class="cook-rename-base">食用手册</span>
          <template v-if="state.quarantineCrossed">
            <span class="cook-rename-arrow" aria-hidden="true">→</span>
            <span class="cook-rename-next">云食册</span>
          </template>
        </span>
      </div>
      <p class="cook-rename-sub">
        {{ state.quarantineCrossed ? '云端的食用手册 · 把做饭留给日常' : '轻点右侧按钮，把名字变轻一点' }}
      </p>
    </div>

    <button
      type="button"
      class="cook-btn cook-btn--primary"
      :aria-pressed="state.quarantineCrossed"
      @click="toggleQuarantineCrossed"
    >
      {{ state.quarantineCrossed ? '恢复原名' : '去掉「隔离」' }}
    </button>
  </div>
</template>

<style scoped>
.cook-rename-strip {
  box-sizing: border-box;
  margin: 1.15rem 0;
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--yun-surface-line);
  border-radius: var(--va-card-border-radius, 0.5rem);
  background: var(--cook-surface-tint);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem 0.9rem;
  transition: border-color 180ms ease;
}

.cook-rename-strip.is-renamed {
  border-color: var(--cook-accent-border);
}

.cook-rename-display {
  min-width: 0;
}

.cook-rename-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.55rem;
}

.cook-rename-years {
  font-variant-numeric: tabular-nums;
}

.cook-rename-title {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.18rem 0.4rem;
  font-family: var(--yun-post-title-font-family, var(--va-font-serif));
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--va-c-text-dark);
}

.cook-rename-word {
  position: relative;
  display: inline-block;
  transition: color 220ms ease, opacity 220ms ease;
}

.cook-rename-word::after {
  content: '';
  position: absolute;
  left: -3px;
  right: -3px;
  top: 52%;
  height: 2.5px;
  border-radius: 2px;
  background: var(--cook-accent-strong);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.cook-rename-word.is-crossed {
  color: var(--va-c-text-2);
  opacity: 0.65;
}

.cook-rename-word.is-crossed::after {
  transform: scaleX(1);
}

.cook-rename-arrow,
.cook-rename-next {
  color: var(--cook-accent-strong);
}

.cook-rename-sub {
  margin: 0.25rem 0 0;
  font-size: 0.78rem;
  line-height: 1.45;
  color: var(--va-c-text-2);
}

@media (prefers-reduced-motion: reduce) {
  .cook-rename-strip,
  .cook-rename-word,
  .cook-rename-word::after {
    transition: none;
  }
}
</style>
