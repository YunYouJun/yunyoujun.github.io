<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { computed } from 'vue'

export interface YunSliderMark {
  value: number
  label: string
}

const props = withDefaults(defineProps<{
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  ariaLabel?: string
  marks?: YunSliderMark[]
}>(), {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
})

const model = defineModel<number>({ required: true })

const sliderValue = computed({
  get: () => [model.value],
  set: (next: number[]) => {
    if (typeof next[0] === 'number' && !Number.isNaN(next[0]))
      model.value = next[0]
  },
})

function selectMark(value: number) {
  if (props.disabled)
    return
  model.value = value
}
</script>

<template>
  <div class="yun-slider" :class="{ 'is-disabled': disabled }">
    <SliderRoot
      v-model="sliderValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      class="yun-slider-root"
    >
      <SliderTrack class="yun-slider-track">
        <SliderRange class="yun-slider-range" />
      </SliderTrack>
      <SliderThumb class="yun-slider-thumb" :aria-label="ariaLabel" />
    </SliderRoot>

    <div
      v-if="marks?.length"
      class="yun-slider-marks"
      :style="{ '--yun-slider-cols': marks.length }"
      role="group"
      :aria-label="ariaLabel ? `${ariaLabel}快捷选项` : undefined"
    >
      <button
        v-for="mark in marks"
        :key="mark.value"
        type="button"
        class="yun-slider-mark"
        :class="{ 'is-active': model === mark.value }"
        :aria-pressed="model === mark.value"
        :disabled="disabled"
        @click="selectMark(mark.value)"
      >
        {{ mark.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.yun-slider {
  width: 100%;
  min-width: 0;
}

.yun-slider.is-disabled {
  opacity: 0.5;
}

.yun-slider-root {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 1.75rem;
  touch-action: none;
  user-select: none;
}

.yun-slider-track {
  position: relative;
  flex-grow: 1;
  height: 4px;
  border-radius: 999px;
  background: var(--yun-surface-line);
}

.yun-slider-range {
  position: absolute;
  height: 100%;
  border-radius: 999px;
  background: var(--yun-slider-accent, var(--va-c-link));
}

.yun-slider-thumb {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid var(--yun-slider-accent, var(--va-c-link));
  background: var(--yun-bg-elevated, var(--va-c-bg));
  box-shadow: 0 1px 4px rgb(0 0 0 / 0.14);
  cursor: pointer;
  transition: transform 140ms ease, box-shadow 140ms ease;
}

.yun-slider-thumb:hover {
  transform: scale(1.1);
}

.yun-slider-thumb:focus-visible {
  outline: 2px solid var(--yun-focus-color);
  outline-offset: 2px;
}

.yun-slider-marks {
  display: grid;
  grid-template-columns: repeat(var(--yun-slider-cols, 6), minmax(0, 1fr));
  gap: 0.25rem;
  margin-top: 0.2rem;
}

.yun-slider-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0.15rem;
  border: 1px solid transparent;
  border-radius: 0.35rem;
  background: transparent;
  color: var(--va-c-text-2);
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 1.25;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 140ms ease,
    border-color 140ms ease,
    color 140ms ease;
}

.yun-slider-mark:hover:not(:disabled) {
  background: var(--yun-action-btn-hover-bg);
  color: var(--va-c-text);
}

.yun-slider-mark:focus-visible {
  outline: 2px solid var(--yun-focus-color);
  outline-offset: 2px;
}

.yun-slider-mark.is-active {
  color: var(--yun-slider-accent, var(--va-c-link));
  font-weight: 600;
  background: color-mix(in srgb, var(--yun-slider-accent, var(--va-c-link)) 10%, transparent);
}

.yun-slider-mark:disabled {
  cursor: not-allowed;
}

@media (pointer: coarse) {
  .yun-slider-root {
    min-height: 44px;
  }

  .yun-slider-mark {
    min-height: 36px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .yun-slider-thumb,
  .yun-slider-mark {
    transition: none;
  }
}
</style>
