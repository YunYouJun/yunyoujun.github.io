<script setup lang="ts">
import type { StudioEpisode } from '../../config/studio'
import { computed, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
import '../../styles/studio-projects.css'

const props = defineProps<{
  episode: StudioEpisode
  seekSeconds?: number | null
  seekNonce?: number
  seekLabel?: string
}>()
const playing = shallowRef(false)
const coverFailed = shallowRef(false)
const coverImage = useTemplateRef<HTMLImageElement>('coverImage')
const activeSeekSeconds = shallowRef<number | null>(null)
const iframeKey = shallowRef(0)

function formatTimestamp(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds))
  const mins = Math.floor(safe / 60)
  const secs = safe % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const iframeSrc = computed(() => {
  const base = `https://player.bilibili.com/player.html?bvid=${props.episode.id}&page=1`
  if (activeSeekSeconds.value != null)
    return `${base}&t=${activeSeekSeconds.value}&autoplay=0`
  return `${base}&autoplay=0`
})

const activeSeekTime = computed(() =>
  activeSeekSeconds.value != null ? formatTimestamp(activeSeekSeconds.value) : null,
)

// An SSR image can fail before hydration attaches the error listener.
onMounted(() => {
  const image = coverImage.value
  if (image?.complete && image.naturalWidth === 0)
    coverFailed.value = true
})

watch(() => props.episode.id, () => {
  playing.value = false
  coverFailed.value = false
  activeSeekSeconds.value = null
})

watch(() => props.seekNonce, (nonce) => {
  if (nonce && nonce > 0 && typeof props.seekSeconds === 'number') {
    activeSeekSeconds.value = props.seekSeconds
    iframeKey.value += 1
    playing.value = true
  }
})
</script>

<template>
  <div class="studio-video not-prose" :data-project-theme="episode.appearance">
    <div class="studio-video-frame">
      <iframe
        v-if="playing"
        :key="iframeKey"
        :src="iframeSrc"
        :title="episode.title"
        allow="fullscreen"
        allowfullscreen
      />
      <button v-else class="studio-video-start" type="button" :aria-label="`加载视频：${episode.title}`" @click="playing = true">
        <img v-if="!coverFailed" ref="coverImage" :src="episode.cover" alt="" width="960" height="540" loading="lazy" referrerpolicy="no-referrer" @error="coverFailed = true">
        <span v-else class="studio-video-fallback">小云梦工坊{{ episode.number ? ` / ${episode.number}` : '' }}<br>{{ episode.title }}</span>
        <span class="studio-video-play"><span aria-hidden="true">▶</span> 加载视频</span>
      </button>
    </div>
    <div class="studio-video-caption">
      <span>
        {{ episode.duration }} · {{ playing ? '若播放受限，可前往 B 站观看' : '点击后加载 B 站播放器' }}
        <template v-if="activeSeekTime">
          · <span class="studio-video-seek" :title="seekLabel || undefined">已定位到 {{ activeSeekTime }}</span>
        </template>
      </span>
      <span class="studio-video-links">
        <a
          v-if="activeSeekTime && activeSeekSeconds !== null"
          :href="`https://www.bilibili.com/video/${episode.id}?t=${activeSeekSeconds}`"
          target="_blank"
          rel="noopener noreferrer"
        >B 站空降 {{ activeSeekTime }} ↗</a>
        <a :href="`https://www.bilibili.com/video/${episode.id}`" target="_blank" rel="noopener noreferrer">在 B 站观看 ↗</a>
      </span>
    </div>
  </div>
</template>

<style scoped>
.studio-video { width: 100%; }
.studio-video-frame { aspect-ratio: 16 / 9; overflow: hidden; border-radius: 14px; background: #152131; }
.studio-video-frame iframe { display: block; width: 100%; height: 100%; border: 0; }
.studio-video-start { position: relative; display: grid; place-items: center; width: 100%; height: 100%; color: white; cursor: pointer; border: 0; padding: 0; background: transparent; }
.studio-video-start img { width: 100%; height: 100%; object-fit: cover; margin: 0; }
.studio-video-play { position: absolute; bottom: 18px; left: 18px; display: flex; gap: 10px; align-items: center; padding: 9px 16px; border: 1px solid #ffffff70; border-radius: 30px; background: #101b2ee8; font-size: 14px; }
.studio-video-start:hover .studio-video-play { background: #225c93; }
.studio-video-start:focus-visible { outline: 3px solid #38bdf8; outline-offset: -4px; }
.studio-video-fallback { padding: 24px; line-height: 1.8; align-self: start; }
.studio-video-caption { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; padding-top: 10px; font-size: 12px; color: var(--va-c-text-light); }
.studio-video-links { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.studio-video-seek { font-variant-numeric: tabular-nums; font-weight: 600; color: var(--va-c-text); }
.studio-video-caption a { color: var(--va-c-primary); }
</style>
