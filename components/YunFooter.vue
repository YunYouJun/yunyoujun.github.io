<script lang="ts" setup>
import YunFooter from 'valaxy-theme-yun/components/YunFooter.vue'

const isBeianMode = import.meta.env.VITE_BEIAN_MODE === 'true'
</script>

<template>
  <YunFooter>
    <!-- <CdnLogo /> -->
    <a v-if="!isBeianMode" href="mailto:me@yunyoujun.cn" target="_blank">
      广告位招租
    </a>
  </YunFooter>
</template>
