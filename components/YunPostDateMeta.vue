<script lang="ts" setup>
import type { Post } from 'valaxy'
import { dayjs, toZonedDayjs, useSiteConfig } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  frontmatter: Post
}>()

const NAIVE_DATE_TIME_RE = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/

const { t } = useI18n()
const siteConfig = useSiteConfig()

// Site-side workaround until Valaxy upstream parses naive `YYYY-MM-DD HH:mm:ss`
// strings in `siteConfig.timezone` inside `toZonedDayjs()` across non-UTC+8 browsers.
function formatPostDate(date: NonNullable<Post['date']>) {
  const timezone = siteConfig.value.timezone || undefined
  const zonedDate = typeof date === 'string' && NAIVE_DATE_TIME_RE.test(date.trim())
    ? (timezone ? dayjs.tz(date.trim(), timezone) : dayjs(date.trim()))
    : toZonedDayjs(date, timezone)
  return {
    label: zonedDate.format('YYYY-MM-DD'),
    timestamp: zonedDate.format('YYYY-MM-DD HH:mm:ss'),
  }
}

const posted = computed(() => {
  const { date } = props.frontmatter
  return date ? formatPostDate(date) : undefined
})
const edited = computed(() => {
  const { date, updated } = props.frontmatter
  return updated && updated !== date ? formatPostDate(updated) : undefined
})
</script>

<template>
  <div v-if="posted" class="post-time flex items-center gap-4">
    <span class="posted-time inline-flex-center gap-1" :title="t('post.posted') + posted.timestamp">
      <div class="inline-block" i-ri-calendar-line />
      <time class="op-80">{{ posted.label }}</time>
    </span>

    <span
      v-if="edited"
      class="edited-time inline-flex-center gap-1" :title="t('post.edited') + edited.timestamp"
    >
      <div i-ri-calendar-2-line />
      <time class="op-80">{{ edited.label }}</time>
    </span>
  </div>
</template>
