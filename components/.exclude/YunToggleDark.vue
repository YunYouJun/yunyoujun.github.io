<script lang="ts" setup>
import { useSound } from '@vueuse/sound'
import { useAppStore } from 'valaxy'
import { computed } from 'vue'

import { useI18n } from 'vue-i18n'

const props = defineProps<{
  transition?: boolean
}>()

const theWorldIn = useSound('/audios/the-world-in.mp3', {
  volume: 0.1,
})
const theWorldOut = useSound('/audios/the-world-out.mp3', {
  volume: 0.1,
})

const appStore = useAppStore()
const { t } = useI18n()

const themeTitle = computed(() => {
  return appStore.isDark ? t('button.toggle_light') : t('button.toggle_dark')
})

const styles = computed(() => {
  return {
    color: appStore.isDark ? '' : '#f1cb64',
  }
})

function toggle(e: MouseEvent) {
  const mode = appStore.isDark ? 'blue' : 'dark'
  // eslint-disable-next-line no-console
  console.log(
    `%c The World %c ${mode} `,
    'background:#35495e; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
    `background:${mode === 'dark' ? 'black' : 'white'}; padding: 1px; border-radius: 0 3px 3px 0;  color: ${mode === 'dark' ? 'white' : 'black'}`,
  )
  if (appStore.isDark) {
    theWorldOut.play()
    theWorldOut.sound.value.fade(0.1, 0, 800)
  }
  else {
    theWorldIn.play()
    theWorldIn.sound.value.fade(0.1, 0, 1000)
  }
  props.transition ? appStore.toggleDarkWithTransition(e) : appStore.toggleDark()
}
</script>

<template>
  <button
    class="yun-icon-btn"
    :title="themeTitle"
    :style="styles"
    @mousedown.prevent="() => {}"
    @click="toggle"
  >
    <div i="ri-sun-line dark:ri-moon-line" />
  </button>
</template>
