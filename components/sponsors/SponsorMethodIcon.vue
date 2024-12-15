<script lang="ts" setup>
import { methodMap } from '@yunyoujun/sponsors'
import { computed } from 'vue'

const props = defineProps<{
  method: string
}>()

const property = computed<{
  icon?: string
  color?: string
  title?: string
}>(() => {
  for (const key in methodMap) {
    if (methodMap[key as keyof typeof methodMap].title === props.method)
      return methodMap[key as keyof typeof methodMap]
  }
  return {}
})
</script>

<template>
  <div :class="property.icon" :style="`color:${property.color}`" text="md" :title="method" />
</template>
