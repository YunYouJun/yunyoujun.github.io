<script lang="ts" setup>
import YunFooter from 'valaxy-theme-yun/components/YunFooter.vue'

const netdun = {
  name: '网盾星球',
  url: 'https://www.netdun.net',
}
</script>

<template>
  <YunFooter>
    由 <a :href="netdun.url" target="_blank" :title="netdun.name">{{ netdun.name }}</a>  提供 CDN 支持
  </YunFooter>
</template>
