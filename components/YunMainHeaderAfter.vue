<script setup lang="ts">
import { useFrontmatter } from 'valaxy'
import ThemeMainHeaderAfter from 'valaxy-theme-yun/components/layout/YunMainHeaderAfter.vue'
import { computed } from 'vue'
import { getAiDisclosure } from '../utils/ai'
import AiDisclosure from './AiDisclosure.vue'

const frontmatter = useFrontmatter()
const disclosure = computed(() => getAiDisclosure(frontmatter.value.ai))
const note = computed(() => frontmatter.value.ai?.note || '本文创作过程中使用了 AI。')
</script>

<template>
  <ThemeMainHeaderAfter />
  <AiDisclosure v-if="disclosure" :label="disclosure" :note="note" />
</template>
