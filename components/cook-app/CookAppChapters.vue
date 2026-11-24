<script setup lang="ts">
import type { CookChapter } from './cookData'
import { computed } from 'vue'
import CookAppFrame from './CookAppFrame.vue'
import { COOK_VIDEO_CHAPTERS, formatChapterTime } from './cookData'
import { useCookArticle } from './useCookArticle'

const { state, requestVideoSeek, scrollToSection } = useCookArticle()

const activeSeconds = computed(() => state.videoSeek?.seconds ?? null)

function handleSeek(chapter: CookChapter) {
  requestVideoSeek(chapter.seconds, chapter.title)
}
</script>

<template>
  <CookAppFrame
    id="cook-chapters"
    eyebrow="视频章节导航"
    status="全片 02:22 · 点击可定位播放器"
    caption="点击任意时间点可唤醒上方播放器定位片段；标有跳转的章节也可直达对应试玩块。"
    :flush="true"
  >
    <template #icon>
      <span class="i-ri-time-line cook-eyebrow-icon" aria-hidden="true" />
    </template>

    <ul class="cook-chapter-list">
      <li
        v-for="chapter in COOK_VIDEO_CHAPTERS"
        :key="chapter.seconds"
        class="cook-chapter-row"
        :class="{ 'is-active': activeSeconds === chapter.seconds }"
      >
        <button
          type="button"
          class="cook-chapter-btn"
          :aria-current="activeSeconds === chapter.seconds ? 'true' : undefined"
          @click="handleSeek(chapter)"
        >
          <span class="cook-chapter-time">{{ formatChapterTime(chapter.seconds) }}</span>
          <span class="cook-chapter-title">{{ chapter.title }}</span>
        </button>

        <button
          v-if="chapter.sectionId"
          type="button"
          class="cook-chip cook-chapter-jump"
          @click="scrollToSection(chapter.sectionId)"
        >
          跳到「{{ chapter.sectionLabel }}」↓
        </button>
      </li>
    </ul>
  </CookAppFrame>
</template>

<style scoped>
.cook-chapter-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.cook-chapter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.45rem 0.65rem;
  padding: 0.45rem 0.85rem;
  border-bottom: 1px solid var(--yun-surface-line);
  transition: background-color 140ms ease;
}

.cook-chapter-row:last-child {
  border-bottom: none;
}

.cook-chapter-row:hover {
  background: var(--yun-action-btn-hover-bg);
}

.cook-chapter-row.is-active {
  background: var(--cook-surface-tint);
}

.cook-chapter-btn {
  flex: 1 1 14rem;
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 0.65rem;
  padding: 0.25rem 0;
  border: none;
  background: transparent;
  color: var(--va-c-text);
  font: inherit;
  font-size: 0.85rem;
  line-height: 1.5;
  text-align: start;
  cursor: pointer;
}

.cook-chapter-btn:focus-visible {
  outline: 2px solid var(--yun-focus-color);
  outline-offset: 2px;
  border-radius: 4px;
}

.cook-chapter-time {
  flex-shrink: 0;
  padding: 0.08rem 0.45rem;
  border-radius: 0.35rem;
  background: var(--cook-accent-soft);
  color: var(--cook-accent-strong);
  font-family: var(--va-font-mono);
  font-size: 0.76rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.cook-chapter-row.is-active .cook-chapter-time {
  background: var(--cook-accent-strong);
  color: var(--cook-on-accent);
}

.cook-chapter-title {
  min-width: 0;
}

.cook-chapter-jump {
  flex-shrink: 0;
}

@media (prefers-reduced-motion: reduce) {
  .cook-chapter-row {
    transition: none;
  }
}
</style>
