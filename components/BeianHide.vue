<script lang="ts" setup>
const isBeianMode = import.meta.env.VITE_BEIAN_MODE === 'true'
</script>

<template>
  <slot v-if="!isBeianMode" />
</template>
