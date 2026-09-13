<script setup lang="ts">
import type { StudioEpisode } from '../../config/studio'
import StudioVideo from './StudioVideo.vue'
import '../../styles/studio-projects.css'

defineProps<{ episode: StudioEpisode, article: string }>()
</script>

<template>
  <article class="studio-episode" :data-project-theme="episode.appearance">
    <div class="studio-episode-heading">
      <span class="studio-number">EP. {{ episode.number }}</span>
      <time :datetime="episode.date">{{ episode.date }}</time>
    </div>
    <div v-if="episode.appearance" class="studio-project-heading">
      <span class="studio-project-name">{{ episode.projectName }}</span>
      <span class="studio-project-label">项目影像 / 小云梦工坊</span>
    </div>
    <StudioVideo :episode="episode" />
    <div class="studio-episode-body">
      <h3>{{ episode.title }}</h3>
      <p>{{ episode.description }}</p>
      <nav class="studio-links" :aria-label="`第 ${episode.number} 期相关链接`">
        <RouterLink class="studio-primary-link" :to="article">
          阅读本期手记 →
        </RouterLink>
        <a :href="episode.website" target="_blank" rel="noopener noreferrer">体验 {{ episode.projectName }} ↗</a>
        <a :href="episode.project" target="_blank" rel="noopener noreferrer">项目源码 ↗</a>
      </nav>
    </div>
  </article>
</template>

<style scoped>
.studio-episode {
  padding: clamp(16px, 3vw, 28px);
  border: 1px solid var(--va-c-divider, #8883);
  border-radius: 20px;
  background: var(--va-c-bg-light);
  box-shadow: 0 12px 36px #16355608;
}

.studio-episode + .studio-episode { margin-top: 28px; }
.studio-episode-heading { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-size: 12px; color: var(--va-c-text-light); }
.studio-number { color: var(--va-c-primary); letter-spacing: .12em; font-weight: 700; }
.studio-episode-body h3 { margin: 24px 0 12px; font-size: clamp(20px, 3vw, 26px); line-height: 1.6; }
.studio-episode-body p { color: var(--va-c-text-light); line-height: 1.9; }
.studio-links { display: flex; flex-wrap: wrap; align-items: center; gap: 16px 24px; margin-top: 24px; font-size: 14px; }
.studio-links a { color: var(--va-c-primary); }
.studio-links .studio-primary-link { padding: 10px 18px; border-radius: 24px; background: var(--va-c-primary); color: var(--va-c-bg); }
.studio-links a:focus-visible, .studio-links a:hover { outline: 2px solid var(--va-c-primary); outline-offset: 5px; }
@media (max-width: 480px) { .studio-links { gap: 16px; } }
</style>
