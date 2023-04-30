<script lang="ts" setup>
const netdun = {
  name: '网盾星球',
  url: 'https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral',
  // url: 'https://www.netdun.net',
  logo: 'https://cdn.yunyoujun.cn/img/logo/upyun-logo.png',
}
</script>

<template>
  <div class="flex-center">
    <span mr-1>由</span>
    <a inline-flex :href="netdun.url" target="_blank" :title="netdun.name">
      <img class="netdun-logo" w="18" m="b-2px l-1 r-2" :src="netdun.logo">
    </a>
    <span>提供 CDN 支持</span>
  </div>
</template>

<style lang="scss">
// .dark {
  // .netdun-logo {
  //   filter: grayscale(1) invert(1);
  // }
// }
</style>
