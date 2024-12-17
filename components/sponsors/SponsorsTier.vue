<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  title: string
  /**
   * 尺寸
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * 金额
   */
  amount: string
  /**
   * 好处
   */
  advantages: string[]
}>()

const sizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'text-base'
    case 'medium':
      return 'text-lg'
    case 'large':
      return 'text-xl'
    default:
      return ''
  }
})

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div
    flex="~ col gap-2"
    class="w-full shadow items-start justify-start p-4 text-shadow transition hover:shadow-lg bg-$va-c-bg-soft rounded"
    @click="scrollToTop"
  >
    <div class="flex font-black font-serif gap-2 items-center" :class="sizeClass">
      {{ title }}
    </div>

    <div class="text-base" font="mono">
      {{ amount }}
    </div>

    <ul class="text-sm">
      <li v-for="advantage in advantages" :key="advantage">
        {{ advantage }}
      </li>
    </ul>
  </div>
</template>
