<script lang="ts" setup>
import YunFooter from 'valaxy-theme-yun/components/YunFooter.vue'

const isBeianMode = import.meta.env.VITE_BEIAN_MODE === 'true'
</script>

<template>
  <YunFooter>
    <!-- <CdnLogo /> -->
    <a v-if="!isBeianMode" href="/about/advertise">
      推广合作
    </a>
  </YunFooter>
</template>
