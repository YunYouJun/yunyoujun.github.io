<script lang="ts" setup>
const netdun = {
  name: '网盾星球',
  url: 'https://www.netdun.net',
  logo: 'https://data-static.netdun.net/netdun/0136.png',
}
</script>

<template>
  <div class="flex-center">
    <span mr-1>由</span>
    <a inline-flex :href="netdun.url" target="_blank" :title="netdun.name">
      <img class="netdun-logo" w="25" :src="netdun.logo">
    </a>
    <span>提供 CDN 支持</span>
  </div>
</template>

<style lang="scss">
.dark {
  .netdun-logo {
    filter: grayscale(1) invert(1);
  }
}
</style>
