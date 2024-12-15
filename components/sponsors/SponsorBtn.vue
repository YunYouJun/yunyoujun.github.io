<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  color?: string
}>(), {
  color: 'purple',
})

const classes = computed(() => {
  return [
    `border-${props.color}-300`,
    `text-${props.color}-600`,
    `hover:bg-${props.color}-600`,
    `dark:text-${props.color}-300`,
    `focus:ring-${props.color}-600`,
  ]
})
</script>

<template>
  <div
    font="semibold"
    p="x-4 y-1"
    border="~"
    bg="white/50 dark:black/20"
    text="lg"
    class="inline-flex items-center justify-center rounded-full transition hover:(border-transparent text-white) focus:(outline-none ring-2 ring-offset-2)"
    :class="classes"
  >
    <slot />
  </div>
</template>
