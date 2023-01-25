<script lang="ts" setup>
import YunFooter from 'valaxy-theme-yun/components/YunFooter.vue'

const netdun = {
  name: '网盾星球',
  url: 'https://www.netdun.net',
  logo: 'https://data-static.netdun.net/netdun/0136.png',
}
</script>

<template>
  <YunFooter>
    <div class="flex-center">
      <span mr-1>由</span>
      <a inline-flex :href="netdun.url" target="_blank" :title="netdun.name">
        <img w="25" :src="netdun.logo">
      </a>
      <span>提供 CDN 支持</span>
    </div>
  </YunFooter>
</template>
