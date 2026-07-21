<script lang="ts" setup>
const isBeianMode = import.meta.env.VITE_BEIAN_MODE === 'true'
</script>

<template>
  <YunCard v-if="!isBeianMode">
    <a
      href="mailto:me@yunyoujun.cn"
      target="_blank"
      class="inline-flex-center gap-1"
    >
      <div class="i-ri-advertisement-line" />
      <span>广告位招租</span>
    </a>
  </YunCard>
</template>
