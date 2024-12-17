<script setup lang="ts">
import { onMounted, ref } from 'vue'

const sponsorSvgText = ref('')
onMounted(async () => {
  const sponsorSvg = 'https://sponsors.yunyoujun.cn/sponsors.svg'
  const svgRes = await fetch(sponsorSvg)
  sponsorSvgText.value = await svgRes.text()
})
</script>

<template>
  <SponsorIntro />

  <div class="py-2 rounded">
    <div m="t-2" text="xl purple-500" font="bold">
      <a class="flex items-center justify-center" href="https://github.com/sponsors/YunYouJun" target="_blank">
        <div i-ri-github-line m="x-1" /> Become a Sponsor in GitHub
      </a>
    </div>
    <!-- <SponsorSvg /> -->
    <!-- component missing of viewbox -->
    <div class="svg-container" v-html="sponsorSvgText" />
  </div>
</template>

<style lang="scss">
.svg-container {
  // width: 100%;
  svg {
    height: auto;
  }
}
</style>
