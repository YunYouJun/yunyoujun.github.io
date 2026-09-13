<script setup lang="ts">
import { useCollection } from 'valaxy'
import { computed } from 'vue'
import { studioVideos } from '../../config/studio'
import StudioEpisodeCard from './StudioEpisodeCard.vue'

const { collection } = useCollection()
const episodes = computed(() => (collection.value?.items || []).flatMap((item) => {
  const video = item.link && studioVideos[item.link]
  return video ? [{ ...video, article: item.link! }] : []
}))
</script>

<template>
  <section class="studio-showcase not-prose" aria-label="小云梦工坊视频专栏">
    <header class="studio-intro">
      <span class="studio-eyebrow">YUNYOUJUN / CREATIVE STUDIO</span>
      <h2>把没做完的想法，<br>继续做下去。</h2>
      <p>这里是小云梦工坊。用视频记录开源项目的故事，<br class="studio-break">也收集那些从想法变成作品的瞬间。</p>
      <span class="studio-count">视频手记 · {{ episodes.length }} 期</span>
    </header>

    <StudioEpisodeCard
      v-for="episode in episodes"
      :key="episode.id"
      :episode="episode"
      :article="episode.article"
    />
    <p class="studio-outro">
      一些代码，一点想象力，和小云一起慢慢实现。
    </p>
  </section>
</template>

<style scoped>
.studio-showcase { max-width: 880px; margin: 0 auto; color: var(--va-c-text); }
.studio-intro { padding: clamp(24px, 5vw, 48px) 0 32px; background: radial-gradient(ellipse at 85% 20%, #38bdf818, transparent 60%); }
.studio-eyebrow { font-size: 11px; letter-spacing: .18em; color: var(--va-c-primary); }
.studio-intro h2 { border: 0; margin: 18px 0; padding: 0; font-size: clamp(28px, 4vw, 42px); line-height: 1.45; letter-spacing: .03em; }
.studio-intro p { color: var(--va-c-text-light); line-height: 1.9; }
.studio-count { display: inline-block; margin-top: 16px; font-size: 12px; color: var(--va-c-text-light); }
.studio-outro { text-align: center; margin: 32px 0; font-size: 13px; color: var(--va-c-text-light); }
@media (max-width: 480px) { .studio-break { display: none; } }
</style>
