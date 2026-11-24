<script setup lang="ts">
import { computed } from 'vue'
import YunSlider from '../YunSlider.vue'
import CookAppFrame from './CookAppFrame.vue'
import {
  COOK_FRIDGE_DEFAULTS,
  COOK_SCAN_PRESETS,
  getFridgeItemStatus,
} from './cookData'
import { useCookArticle } from './useCookArticle'

const {
  state,
  setFridgeOffsetDays,
  scanNextPackage,
  resetFridge,
  sendExpiringToPlayground,
} = useCookArticle()

const dayMarks = [
  { value: 0, label: '今天' },
  { value: 1, label: '+1 天' },
  { value: 2, label: '+2 天' },
  { value: 3, label: '+3 天' },
  { value: 4, label: '+4 天' },
  { value: 5, label: '+5 天' },
]

const fridgeDays = computed({
  get: () => state.fridgeOffsetDays,
  set: (days: number) => setFridgeOffsetDays(days),
})

const fridgeEntries = computed(() => {
  const allItems = [
    ...COOK_FRIDGE_DEFAULTS,
    ...COOK_SCAN_PRESETS.slice(0, state.scannedCount),
  ]
  return allItems.map(item => ({
    item,
    meta: getFridgeItemStatus(item.remainingDays, state.fridgeOffsetDays, item.shelfLifeDays),
  }))
})

const urgentEntries = computed(() =>
  fridgeEntries.value.filter(entry => entry.meta.status !== 'fresh'),
)

const statusText = computed(() => {
  if (urgentEntries.value.length > 0)
    return `${urgentEntries.value.length} 项临期优先`
  return '全部状态新鲜'
})

const allScanned = computed(() => state.scannedCount >= COOK_SCAN_PRESETS.length)
const isModified = computed(() => state.fridgeOffsetDays > 0 || state.scannedCount > 0)

const targetItems = computed(() => {
  if (urgentEntries.value.length > 0)
    return urgentEntries.value.map(entry => entry.item)
  return [...fridgeEntries.value]
    .sort((a, b) => a.meta.effectiveDays - b.meta.effectiveDays)
    .slice(0, 2)
    .map(entry => entry.item)
})

const handoffHint = computed(() => {
  const names = targetItems.value.map(item => item.name).join('、')
  if (urgentEntries.value.length > 0)
    return `待优先消化：${names}`
  return `当前都很新鲜，可先试试搭配：${names}`
})

function handleSendToPlayground() {
  sendExpiringToPlayground(targetItems.value)
}

function pillClass(status: 'fresh' | 'expiring' | 'expired') {
  if (status === 'expired')
    return 'cook-pill--red'
  if (status === 'expiring')
    return 'cook-pill--amber'
  return 'cook-pill--green'
}
</script>

<template>
  <CookAppFrame
    id="cook-fridge"
    eyebrow="冰箱保质期小模拟"
    :status="statusText"
    caption="不用联网传图，扫包装日期就能离线算出剩余天数；先把手头快临期的菜吃掉。"
  >
    <template #icon>
      <span class="i-ri-fridge-line cook-eyebrow-icon" aria-hidden="true" />
    </template>

    <template #head-right>
      <span class="cook-pill cook-pill--warm cook-fridge-offset">
        {{ state.fridgeOffsetDays === 0 ? '今天' : `+${state.fridgeOffsetDays} 天后` }}
      </span>
    </template>

    <div class="cook-fridge-slider-wrap">
      <div class="cook-fridge-slider-head">
        <span class="cook-fridge-slider-label">向后推演时间</span>
        <span class="cook-fridge-slider-tip">拖动滑块或点击刻度查看临期变化</span>
      </div>
      <YunSlider
        v-model="fridgeDays"
        :min="0"
        :max="5"
        :step="1"
        aria-label="向后推演天数"
        :marks="dayMarks"
      />
    </div>

    <ul class="cook-fridge-list">
      <li
        v-for="entry in fridgeEntries"
        :key="entry.item.id"
        class="cook-fridge-item"
      >
        <div class="cook-fridge-item-main">
          <span class="cook-fridge-emoji" aria-hidden="true">{{ entry.item.emoji }}</span>
          <div class="cook-fridge-names">
            <span class="cook-fridge-name">{{ entry.item.name }}</span>
            <span class="cook-fridge-storage">{{ entry.item.storage }}</span>
          </div>
        </div>

        <div class="cook-fridge-meter" aria-hidden="true">
          <span
            class="cook-fridge-fill"
            :class="`is-${entry.meta.status}`"
            :style="{ width: `${Math.max(8, Math.round(entry.meta.ratio * 100))}%` }"
          />
        </div>

        <div class="cook-fridge-meta">
          <span class="cook-fridge-days">{{ entry.meta.daysText }}</span>
          <span class="cook-pill" :class="pillClass(entry.meta.status)">{{ entry.meta.label }}</span>
        </div>
      </li>
    </ul>

    <div class="cook-fridge-tools">
      <div class="cook-fridge-scan-group">
        <button
          type="button"
          class="cook-btn"
          :disabled="allScanned"
          @click="scanNextPackage"
        >
          <span class="i-ri-barcode-box-line" aria-hidden="true" />
          <span>{{ allScanned ? '已演示全部 3 件包装' : '模拟离线扫包装算保质期' }}</span>
        </button>

        <button
          v-if="isModified"
          type="button"
          class="cook-btn"
          @click="resetFridge"
        >
          重置冰箱
        </button>
      </div>

      <div class="cook-fridge-ai-note" aria-label="AI 能力状态说明">
        <span>AI 拍照入库与帮找菜</span>
        <span class="cook-pill cook-pill--warm">大模型备案审批中</span>
      </div>
    </div>

    <div v-if="state.lastScanNote" class="cook-scan-callout" aria-live="polite">
      <span class="i-ri-check-line" aria-hidden="true" />
      <span>{{ state.lastScanNote }}</span>
    </div>

    <template #actions>
      <span class="cook-fridge-handoff">{{ handoffHint }}</span>
      <button
        type="button"
        class="cook-btn cook-btn--primary"
        @click="handleSendToPlayground"
      >
        用临期食材去挑菜 →
      </button>
    </template>
  </CookAppFrame>
</template>

<style scoped>
.cook-fridge-offset {
  font-variant-numeric: tabular-nums;
}

.cook-fridge-slider-wrap {
  --yun-slider-accent: var(--cook-accent-strong);

  padding-bottom: 0.7rem;
  border-bottom: 1px solid var(--yun-surface-line);
}

.cook-fridge-slider-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.25rem 0.65rem;
  margin-bottom: 0.25rem;
}

.cook-fridge-slider-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--va-c-text-dark);
}

.cook-fridge-slider-tip {
  font-size: 0.74rem;
  color: var(--va-c-text-2);
}

.cook-fridge-list {
  list-style: none;
  margin: 0.65rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.45rem;
}

.cook-fridge-item {
  display: grid;
  grid-template-columns: minmax(8.5rem, 1.15fr) minmax(4rem, 1fr) auto;
  align-items: center;
  gap: 0.5rem 0.75rem;
  padding: 0.45rem 0.6rem;
  border: 1px solid var(--yun-surface-line);
  border-radius: 0.45rem;
  background: var(--va-c-bg-alt);
}

@container cook-card (max-width: 520px) {
  .cook-fridge-item {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .cook-fridge-meter {
    grid-column: 1 / -1;
    order: 3;
  }
}

.cook-fridge-item-main {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.cook-fridge-emoji {
  font-size: 1.15rem;
  line-height: 1;
}

.cook-fridge-names {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.15rem 0.4rem;
  min-width: 0;
}

.cook-fridge-name {
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--va-c-text-dark);
}

.cook-fridge-storage {
  font-size: 0.72rem;
  color: var(--va-c-text-2);
}

.cook-fridge-meter {
  height: 6px;
  border-radius: 999px;
  background: var(--yun-surface-line);
  overflow: hidden;
}

.cook-fridge-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  transition: width 200ms ease, background-color 200ms ease;
}

.cook-fridge-fill.is-fresh {
  background: var(--va-c-green-1);
}

.cook-fridge-fill.is-expiring {
  background: var(--va-c-yellow-1);
}

.cook-fridge-fill.is-expired {
  background: var(--va-c-red-1);
}

.cook-fridge-meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.4rem;
}

.cook-fridge-days {
  font-size: 0.78rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--va-c-text);
  white-space: nowrap;
}

.cook-fridge-tools {
  margin-top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 0.75rem;
}

.cook-fridge-scan-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
}

.cook-fridge-ai-note {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.76rem;
  color: var(--va-c-text-2);
}

.cook-scan-callout {
  margin-top: 0.6rem;
  padding: 0.45rem 0.65rem;
  border: 1px solid var(--cook-accent-border);
  border-radius: 0.45rem;
  background: var(--cook-surface-tint);
  color: var(--va-c-text);
  font-size: 0.78rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.cook-fridge-handoff {
  font-size: 0.78rem;
  color: var(--va-c-text-2);
}

@media (prefers-reduced-motion: reduce) {
  .cook-fridge-fill {
    transition: none;
  }
}
</style>
