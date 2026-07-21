<script lang="ts" setup>
import ThemeYunSponsor from 'valaxy-theme-yun/components/YunSponsor.vue'

const isBeianMode = import.meta.env.VITE_BEIAN_MODE === 'true'
</script>

<template>
  <ThemeYunSponsor v-if="!isBeianMode" />
</template>
