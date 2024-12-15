<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div flex="~ col" class="items-center">
    <div class="relative flex flex-col animate-fade-in animate-duration-1000 animate-iteration-1 items-center justify-center">
      <img
        class="fade-in xiao-yun-q z-2 m-auto inline-flex shadow-none! m-0!"
        src="https://cdn.jsdelivr.net/gh/YunYouJun/yun/images/meme/yun-good-alpha-compressed.png"
        alt="小云觉得你很棒棒"
      >
      <p class="absolute bottom-0">
        我很可爱，请给我钱！
      </p>
    </div>
    <RouterLink to="/projects/" class="border-none!">
      <div
        font="semibold"
        p="x-4 y-1"
        border="~ purple-300"
        class="inline-block items-center justify-center rounded-full text-sm text-purple-600 hover:(border-transparent bg-purple-600 text-white) dark:(text-purple-300) focus:(outline-none ring-2 ring-offset-2 ring-purple-600)"
      >
        {{ t('message.projects') }}
      </div>
    </RouterLink>
  </div>
</template>

<style>
.xiao-yun-q {
  width: 200px;
  aspect-ratio: 1;
}
</style>
