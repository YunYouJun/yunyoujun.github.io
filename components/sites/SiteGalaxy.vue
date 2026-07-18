<script setup lang="ts">
import type { SiteStatus, YunSiteGroup } from '../../config/sites'
import { computed, ref } from 'vue'

import { siteGroups, siteMapCenter } from '../../config/sites'

type FaviconStage = 'ico' | 'fallback'

const activeGroupId = ref(siteGroups[0].id)

const activeGroup = computed(() => {
  return siteGroups.find(group => group.id === activeGroupId.value) || siteGroups[0]
})

const activeLeadSite = computed(() => activeGroup.value.sites[0])

const faviconStages = ref<Record<string, FaviconStage>>({})

const totalSites = computed(() => {
  return siteGroups.reduce((total, group) => total + group.sites.length, 0)
})

const connectorLines = computed(() => {
  return siteGroups.map((group, index) => {
    const curveX = (50 + group.x) / 2 + (index % 2 === 0 ? 4 : -4)
    const curveY = (50 + group.y) / 2 + (index % 3 === 0 ? -5 : 5)

    return {
      id: group.id,
      accent: group.accent,
      d: `M 50 50 Q ${curveX} ${curveY} ${group.x} ${group.y}`,
    }
  })
})

const stars = [
  { x: 6, y: 10, s: 2, d: 0 },
  { x: 11, y: 35, s: 1, d: 1.3 },
  { x: 15, y: 76, s: 2, d: 0.5 },
  { x: 19, y: 18, s: 1, d: 2.2 },
  { x: 23, y: 62, s: 1, d: 1.6 },
  { x: 29, y: 9, s: 1, d: 0.8 },
  { x: 34, y: 42, s: 2, d: 1.8 },
  { x: 39, y: 67, s: 1, d: 2.7 },
  { x: 43, y: 18, s: 2, d: 0.4 },
  { x: 47, y: 33, s: 1, d: 2.1 },
  { x: 55, y: 12, s: 1, d: 1.1 },
  { x: 58, y: 67, s: 2, d: 2.4 },
  { x: 63, y: 31, s: 1, d: 0.7 },
  { x: 68, y: 84, s: 1, d: 2 },
  { x: 77, y: 12, s: 2, d: 1.4 },
  { x: 81, y: 38, s: 1, d: 0.2 },
  { x: 84, y: 69, s: 2, d: 1.9 },
  { x: 91, y: 21, s: 1, d: 2.8 },
  { x: 94, y: 56, s: 1, d: 1.5 },
  { x: 88, y: 83, s: 2, d: 0.9 },
]

const satelliteOffsets = [
  { x: -4, y: -7 },
  { x: 6, y: -4 },
  { x: 5, y: 7 },
]

const statusLabels: Record<SiteStatus, string> = {
  active: '运行中',
  wip: '生长中',
  archive: '归档',
  service: '服务',
  external: '外部',
}

function setActiveGroup(id: string) {
  activeGroupId.value = id
}

function getHost(url: string) {
  return new URL(url, siteMapCenter.url).host
}

function getSiteOrigin(url: string) {
  return new URL(url, siteMapCenter.url).origin
}

function getDisplayHost(url: string) {
  return getHost(url).replace(/^www\./, '')
}

function getFaviconUrl(url: string) {
  const origin = getSiteOrigin(url)
  const file = faviconStages.value[origin] === 'ico' ? 'favicon.ico' : 'favicon.svg'

  return `${origin}/${file}`
}

function shouldShowFavicon(url: string) {
  return faviconStages.value[getSiteOrigin(url)] !== 'fallback'
}

function markFaviconFailed(url: string) {
  const origin = getSiteOrigin(url)
  faviconStages.value[origin] = faviconStages.value[origin] === 'ico' ? 'fallback' : 'ico'
}

function getStatusLabel(status?: SiteStatus) {
  return statusLabels[status || 'active']
}

function getSatelliteStyle(group: YunSiteGroup, index: number) {
  const offset = satelliteOffsets[index % satelliteOffsets.length]

  return {
    '--satellite-color': group.accent,
    'left': `${group.x + offset.x}%`,
    'top': `${group.y + offset.y}%`,
  }
}
</script>

<template>
  <section class="site-galaxy not-prose" aria-label="云游星图">
    <header class="site-galaxy__intro">
      <p class="site-galaxy__subtitle">
        散落在不同域名里的小站、项目与实验。
      </p>
      <p class="site-galaxy__summary">
        {{ siteGroups.length }} 个星系，{{ totalSites }} 个入口，从主站出发。
      </p>
    </header>

    <div class="site-galaxy__map" role="group" aria-label="云游君站点星图">
      <span
        v-for="star in stars"
        :key="`${star.x}-${star.y}`"
        class="site-galaxy__star"
        aria-hidden="true"
        :style="{
          left: `${star.x}%`,
          top: `${star.y}%`,
          width: `${star.s + 2}px`,
          height: `${star.s + 2}px`,
          animationDelay: `${star.d}s`,
        }"
      />

      <svg class="site-galaxy__lines" viewBox="0 0 100 100" aria-hidden="true">
        <path
          v-for="line in connectorLines"
          :key="line.id"
          class="site-galaxy__line"
          :d="line.d"
          :style="{ '--line-color': line.accent }"
        />
      </svg>

      <a
        class="site-galaxy__center"
        :href="siteMapCenter.url"
        :aria-label="`前往${siteMapCenter.name}`"
        :style="{ '--node-color': siteMapCenter.accent }"
      >
        <span class="site-galaxy__center-mark i-ri-planet-line" aria-hidden="true" />
        <span class="site-galaxy__center-name">{{ siteMapCenter.shortTitle }}</span>
        <span class="site-galaxy__center-url" :title="getHost(siteMapCenter.url)">
          {{ getDisplayHost(siteMapCenter.url) }}
        </span>
      </a>

      <span
        v-for="group in siteGroups"
        :key="`${group.id}-halo`"
        class="site-galaxy__halo"
        :class="{ 'is-active': activeGroup.id === group.id }"
        :style="{
          '--node-color': group.accent,
          'left': `${group.x}%`,
          'top': `${group.y}%`,
        }"
      />

      <button
        v-for="group in siteGroups"
        :key="group.id"
        type="button"
        class="site-galaxy__node"
        :class="{ 'is-active': activeGroup.id === group.id }"
        :style="{
          '--node-color': group.accent,
          'left': `${group.x}%`,
          'top': `${group.y}%`,
        }"
        :aria-pressed="activeGroup.id === group.id"
        @click="setActiveGroup(group.id)"
        @focus="setActiveGroup(group.id)"
        @mouseenter="setActiveGroup(group.id)"
      >
        <span class="site-galaxy__node-mark" aria-hidden="true">
          <span :class="group.icon" />
        </span>
        <span class="site-galaxy__node-label">{{ group.shortTitle }}</span>
      </button>

      <span
        v-for="group in siteGroups"
        :key="`${group.id}-satellites`"
        class="site-galaxy__satellite-cluster"
      >
        <span
          v-for="site, index in group.sites.slice(0, 3)"
          :key="site.url"
          class="site-galaxy__satellite"
          aria-hidden="true"
          :title="site.name"
          :style="getSatelliteStyle(group, index)"
        />
      </span>
    </div>

    <aside class="site-galaxy__tooltip" :style="{ '--active-color': activeGroup.accent }">
      <p class="site-galaxy__tooltip-label">
        {{ activeGroup.shortTitle }}
      </p>
      <strong>{{ activeGroup.title }}</strong>
      <a
        v-if="activeLeadSite"
        class="site-galaxy__tooltip-url"
        :href="activeLeadSite.url"
        target="_blank"
        rel="noopener noreferrer"
        :title="getHost(activeLeadSite.url)"
      >
        {{ getDisplayHost(activeLeadSite.url) }}
        <span class="i-ri-arrow-right-up-line" aria-hidden="true" />
      </a>
      <p>{{ activeGroup.desc }}</p>
    </aside>

    <section class="site-directory" aria-labelledby="site-directory-title">
      <div class="site-directory__header">
        <div>
          <h2 id="site-directory-title">
            站点列表
          </h2>
          <p>按用途分组，保留每个站点自己的 sitemap.xml。</p>
        </div>
        <a class="site-directory__home" :href="siteMapCenter.url">
          回到主站
          <span class="i-ri-arrow-right-up-line" aria-hidden="true" />
        </a>
      </div>

      <div class="site-directory__groups">
        <article
          v-for="group in siteGroups"
          :id="`sites-${group.id}`"
          :key="group.id"
          class="site-directory__group"
          :style="{ '--group-color': group.accent }"
        >
          <header class="site-directory__group-header">
            <span class="site-directory__group-mark" aria-hidden="true">
              <span :class="group.icon" />
            </span>
            <div>
              <h3>{{ group.title }}</h3>
              <p>{{ group.desc }}</p>
            </div>
          </header>

          <ul class="site-directory__list">
            <li v-for="site in group.sites" :key="site.url">
              <a :href="site.url" target="_blank" rel="noopener noreferrer">
                <span class="site-directory__site-icon" aria-hidden="true">
                  <img
                    v-if="shouldShowFavicon(site.url)"
                    :src="getFaviconUrl(site.url)"
                    alt=""
                    decoding="async"
                    loading="lazy"
                    referrerpolicy="no-referrer"
                    @error="markFaviconFailed(site.url)"
                  >
                  <span v-else :class="group.icon" />
                </span>
                <span class="site-directory__site-main">
                  <strong>{{ site.name }}</strong>
                  <span :title="getHost(site.url)">{{ getDisplayHost(site.url) }}</span>
                </span>
                <span class="site-directory__site-desc">{{ site.desc }}</span>
                <span class="site-directory__site-meta" :data-status="site.status || 'active'">
                  {{ getStatusLabel(site.status) }}
                </span>
              </a>
            </li>
          </ul>
        </article>
      </div>
    </section>
  </section>
</template>

<style scoped>
.site-galaxy {
  --sites-panel: rgba(255, 255, 255, 0.78);
  --sites-panel-strong: rgba(255, 255, 255, 0.92);
  --sites-text: var(--va-c-text, #1f2937);
  --sites-muted: var(--va-c-text-light, #64748b);
  --sites-stage-grid-x: rgba(37, 99, 235, 0.08);
  --sites-stage-grid-y: rgba(37, 99, 235, 0.07);
  --sites-stage-gradient:
    radial-gradient(ellipse at 50% 46%, rgba(37, 99, 235, 0.12), transparent 46%),
    linear-gradient(135deg, rgba(248, 250, 252, 0.82), rgba(238, 242, 255, 0.58) 45%, rgba(236, 253, 245, 0.48));
  --sites-stage-glass: rgba(255, 255, 255, 0.46);

  box-sizing: border-box;
  color: var(--sites-text);
  padding-inline: clamp(0.75rem, 1.8vw, 1rem);
}

:global(.site-galaxy-page-title) {
  color: #1d4ed8 !important;
  font-size: 2.25rem !important;
  letter-spacing: 0;
  line-height: 1.2 !important;
}

:global(.content.no-aside:has(.site-galaxy)) {
  width: min(1040px, calc(100vw - var(--va-sidebar-width, 18rem) - 2rem)) !important;
}

.site-galaxy__intro {
  margin: 0 auto 1.75rem;
  text-align: center;
}

.site-galaxy__subtitle {
  margin: 0;
  color: var(--sites-muted);
  font-size: 1.05rem;
  line-height: 1.8;
}

.site-galaxy__summary {
  display: inline-flex;
  margin: 0.55rem 0 0;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.06);
  color: rgba(29, 78, 216, 0.82);
  font-size: 0.9rem;
  line-height: 1.7;
  padding: 0.12rem 0.65rem;
}

.site-galaxy__map {
  position: relative;
  isolation: isolate;
  min-height: clamp(510px, 54vw, 570px);
  margin: 0 auto;
  overflow: visible;
  border: 0;
  border-radius: 8px;
  background: var(--sites-stage-gradient);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72), 0 20px 56px rgba(37, 99, 235, 0.08);
}

.site-galaxy__map::before {
  position: absolute;
  z-index: 0;
  inset: 0;
  border-radius: inherit;
  background:
    linear-gradient(90deg, var(--sites-stage-grid-x) 1px, transparent 1px),
    linear-gradient(180deg, var(--sites-stage-grid-y) 1px, transparent 1px);
  background-size: 4.5rem 4.5rem;
  content: "";
  -webkit-mask-image: linear-gradient(180deg, transparent, #000 18%, #000 82%, transparent);
  mask-image: linear-gradient(180deg, transparent, #000 18%, #000 82%, transparent);
  opacity: 0.28;
  pointer-events: none;
}

.site-galaxy__star {
  position: absolute;
  z-index: 1;
  border-radius: 999px;
  background: #60a5fa;
  opacity: 0.72;
  animation: site-star-twinkle 3.8s ease-in-out infinite;
}

.site-galaxy__star:nth-child(4n) {
  background: #fbbf24;
}

.site-galaxy__star:nth-child(5n) {
  background: #8b5cf6;
}

.site-galaxy__lines {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
}

.site-galaxy__line {
  fill: none;
  stroke: var(--line-color);
  stroke-dasharray: 4 5;
  stroke-linecap: round;
  stroke-width: 0.28;
  opacity: 0.44;
}

.site-galaxy__center,
.site-galaxy__node,
.site-galaxy__halo,
.site-galaxy__satellite {
  position: absolute;
  z-index: 3;
  transform: translate(-50%, -50%);
}

.site-galaxy__center {
  top: 50%;
  left: 50%;
  display: inline-flex;
  width: 9.2rem;
  height: 9.2rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: 0;
  border-radius: 999px;
  background:
    radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 0.94), var(--sites-stage-glass)),
    color-mix(in srgb, var(--node-color), white 92%);
  box-shadow:
    0 0 0 1rem rgba(37, 99, 235, 0.04),
    0 0 0 3rem rgba(99, 102, 241, 0.025),
    0 18px 42px rgba(37, 99, 235, 0.13);
  color: var(--node-color);
  overflow: hidden;
  padding: 1rem 0.78rem 0.9rem;
  text-align: center;
  text-decoration: none;
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.site-galaxy__center:hover,
.site-galaxy__center:focus-visible {
  transform: translate(-50%, -50%) scale(1.03);
  outline: 2px solid color-mix(in srgb, var(--node-color), white 32%);
  outline-offset: 0.35rem;
  box-shadow:
    0 0 0 1rem rgba(37, 99, 235, 0.06),
    0 0 0 3rem rgba(99, 102, 241, 0.04),
    0 22px 48px rgba(37, 99, 235, 0.16);
}

.site-galaxy__center-mark {
  flex: none;
  font-size: 2rem;
  line-height: 1;
}

.site-galaxy__center-name {
  margin-top: 0.28rem;
  color: #1e3a8a;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.25;
}

.site-galaxy__center-url {
  display: block;
  max-width: 100%;
  margin-top: 0.34rem;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.1);
  color: rgba(30, 64, 175, 0.86);
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1.45;
  padding: 0.12rem 0.48rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-galaxy__halo {
  width: 5rem;
  height: 5rem;
  border: 0;
  border-radius: 999px;
  background: radial-gradient(circle, color-mix(in srgb, var(--node-color), transparent 82%), transparent 68%);
  opacity: 0.62;
  pointer-events: none;
}

.site-galaxy__halo.is-active {
  opacity: 0.9;
  animation: site-node-pulse 2.8s ease-in-out infinite;
}

.site-galaxy__node {
  display: inline-flex;
  width: 6.25rem;
  min-height: 5.35rem;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border: 0;
  background: transparent;
  color: var(--sites-text);
  cursor: pointer;
  font: inherit;
  text-align: center;
  touch-action: manipulation;
  transform: translate(-50%, -1.5rem);
}

.site-galaxy__node-mark {
  display: inline-flex;
  width: 3.1rem;
  height: 3.1rem;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 999px;
  background: color-mix(in srgb, var(--node-color), white 86%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    0 10px 24px color-mix(in srgb, var(--node-color), transparent 82%);
  color: var(--node-color);
  font-size: 1.35rem;
  line-height: 1;
  transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
}

.site-galaxy__node-label {
  margin-top: 0.45rem;
  font-size: 0.98rem;
  font-weight: 700;
  line-height: 1.2;
  overflow-wrap: anywhere;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.88), 0 10px 18px rgba(15, 23, 42, 0.08);
}

.site-galaxy__node:hover,
.site-galaxy__node:focus-visible {
  outline: none;
}

.site-galaxy__node:hover .site-galaxy__node-mark,
.site-galaxy__node:focus-visible .site-galaxy__node-mark,
.site-galaxy__node.is-active .site-galaxy__node-mark {
  background: color-mix(in srgb, var(--node-color), white 78%);
  box-shadow: 0 14px 30px color-mix(in srgb, var(--node-color), transparent 70%);
  transform: scale(1.07);
}

.site-galaxy__node:focus-visible .site-galaxy__node-mark {
  outline: 2px solid color-mix(in srgb, var(--node-color), white 26%);
  outline-offset: 0.22rem;
}

.site-galaxy__node.is-active .site-galaxy__node-label {
  color: var(--node-color);
}

.site-galaxy__satellite {
  z-index: 2;
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  background: var(--satellite-color);
  box-shadow: 0 0 0 0.35rem color-mix(in srgb, var(--satellite-color), transparent 90%);
  opacity: 0.62;
}

.site-galaxy__tooltip {
  position: relative;
  z-index: 4;
  display: grid;
  width: 100%;
  grid-template-columns: auto minmax(10rem, 0.72fr) minmax(0, 1.35fr);
  align-items: center;
  gap: 0.2rem 1.1rem;
  margin: 1rem 0 0;
  border: 0;
  border-radius: 8px;
  background:
    linear-gradient(120deg, color-mix(in srgb, var(--active-color), white 90%), var(--sites-panel-strong) 46%, rgba(255, 255, 255, 0.78)),
    var(--sites-panel-strong);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.07);
  padding: 0.95rem 1.05rem;
  text-align: left;
}

.site-galaxy__tooltip::before {
  position: absolute;
  top: 0;
  right: 1rem;
  left: 1rem;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, var(--active-color), transparent);
  content: "";
  opacity: 0.72;
}

.site-galaxy__tooltip-label {
  display: inline-flex;
  grid-row: 1 / span 2;
  align-items: center;
  justify-content: center;
  margin: 0;
  border-radius: 999px;
  background: color-mix(in srgb, var(--active-color), transparent 88%);
  color: var(--active-color);
  font-size: 0.76rem;
  font-weight: 700;
  line-height: 1.5;
  padding: 0.2rem 0.65rem;
}

.site-galaxy__tooltip strong {
  display: block;
  grid-column: 2;
  color: var(--sites-text);
  font-size: 1.05rem;
  line-height: 1.5;
}

.site-galaxy__tooltip-url {
  display: inline-flex;
  grid-column: 2;
  align-items: center;
  gap: 0.25rem;
  width: fit-content;
  max-width: 100%;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.58);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--active-color), transparent 86%);
  color: #1d4ed8;
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1.45;
  padding: 0.12rem 0.52rem;
  text-decoration: none;
  transition: background 160ms ease, box-shadow 160ms ease, color 160ms ease;
  white-space: nowrap;
}

.site-galaxy__tooltip-url:hover,
.site-galaxy__tooltip-url:focus-visible {
  background: color-mix(in srgb, var(--active-color), white 88%);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--active-color), transparent 72%);
  outline: none;
}

.site-galaxy__tooltip p:last-of-type {
  grid-column: 3;
  grid-row: 1 / span 2;
  margin: 0;
  color: var(--sites-muted);
  font-size: 0.88rem;
  line-height: 1.65;
}

.site-directory {
  margin-top: 1.55rem;
}

.site-directory__header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.site-directory h2,
.site-directory h3,
.site-directory p {
  margin: 0;
}

.site-directory h2 {
  color: var(--sites-text);
  font-size: 1.25rem;
  line-height: 1.4;
}

.site-directory__header p {
  margin-top: 0.3rem;
  color: var(--sites-muted);
  font-size: 0.9rem;
  line-height: 1.7;
}

.site-directory__home {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 0.25rem;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.08);
  box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.08);
  color: #1d4ed8;
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.45;
  padding: 0.38rem 0.7rem;
  text-decoration: none;
  transition: background 160ms ease, box-shadow 160ms ease, color 160ms ease;
}

.site-directory__home:hover {
  background: rgba(37, 99, 235, 0.12);
  box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.14);
}

.site-directory__home:focus-visible {
  outline: 2px solid rgba(37, 99, 235, 0.42);
  outline-offset: 0.2rem;
}

.site-directory__groups {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.site-directory__group {
  position: relative;
  border: 0;
  border-radius: 8px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--group-color), white 94%), var(--sites-panel)),
    var(--sites-panel);
  box-shadow: 0 14px 34px color-mix(in srgb, var(--group-color), transparent 92%);
  overflow: hidden;
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.site-directory__group::before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--group-color), white 18%), transparent);
  content: "";
  opacity: 0.72;
}

.site-directory__group:hover {
  box-shadow: 0 18px 42px color-mix(in srgb, var(--group-color), transparent 88%);
  transform: translateY(-2px);
}

.site-directory__group-header {
  display: flex;
  gap: 0.85rem;
  align-items: center;
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
  padding: 1rem;
}

.site-directory__group-mark {
  display: inline-flex;
  width: 2.25rem;
  height: 2.25rem;
  flex: none;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: color-mix(in srgb, var(--group-color), white 86%);
  color: var(--group-color);
  font-size: 1.1rem;
}

.site-directory__group h3 {
  color: var(--sites-text);
  font-size: 1rem;
  line-height: 1.45;
}

.site-directory__group-header p {
  margin-top: 0.15rem;
  color: var(--sites-muted);
  font-size: 0.84rem;
  line-height: 1.55;
}

.site-directory__list {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.site-directory__list li + li {
  border-top: 1px solid rgba(148, 163, 184, 0.12);
}

.site-directory__list a {
  display: grid;
  grid-template-columns: 2.35rem minmax(8.5rem, 0.9fr) minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: center;
  min-height: 4.2rem;
  padding: 0.85rem 1rem;
  color: inherit;
  text-decoration: none;
  transition: background 160ms ease, box-shadow 160ms ease;
}

.site-directory__list a:hover,
.site-directory__list a:focus-visible {
  background: color-mix(in srgb, var(--group-color), transparent 94%);
  outline: none;
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--group-color), transparent 82%);
  text-decoration: none;
}

.site-directory__site-main {
  display: grid;
  min-width: 0;
  gap: 0.2rem;
}

.site-directory__site-icon {
  display: inline-flex;
  width: 2.35rem;
  height: 2.35rem;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: color-mix(in srgb, var(--group-color), white 90%);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--group-color), transparent 88%),
    0 8px 18px color-mix(in srgb, var(--group-color), transparent 90%);
  color: var(--group-color);
  overflow: hidden;
}

.site-directory__site-icon img {
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 4px;
  object-fit: contain;
}

.site-directory__site-icon span {
  font-size: 1.08rem;
  line-height: 1;
}

.site-directory__site-main strong {
  color: var(--sites-text);
  font-size: 0.94rem;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.site-directory__site-main span {
  color: var(--sites-muted);
  font-size: 0.78rem;
  line-height: 1.5;
  overflow-wrap: break-word;
  word-break: normal;
}

.site-directory__site-desc {
  font-size: 0.84rem;
  overflow-wrap: anywhere;
  color: var(--sites-muted);
  line-height: 1.5;
}

.site-directory__site-meta {
  justify-self: end;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.4;
  padding: 0.16rem 0.5rem;
}

.site-directory__site-meta[data-status="wip"] {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.site-directory__site-meta[data-status="archive"] {
  background: rgba(100, 116, 139, 0.12);
  color: #64748b;
}

.site-directory__site-meta[data-status="service"] {
  background: rgba(14, 165, 233, 0.1);
  color: #0284c7;
}

.site-directory__site-meta[data-status="external"] {
  background: rgba(99, 102, 241, 0.1);
  color: #4f46e5;
}

@keyframes site-star-twinkle {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(1);
  }

  50% {
    opacity: 0.9;
    transform: scale(1.38);
  }
}

@keyframes site-node-pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    transform: translate(-50%, -50%) scale(1.24);
  }
}

:global(html.dark .site-galaxy) {
  --sites-panel: rgba(15, 23, 42, 0.66);
  --sites-panel-strong: rgba(15, 23, 42, 0.88);
  --sites-stage-glass: rgba(15, 23, 42, 0.62);
  --sites-stage-grid-x: rgba(125, 211, 252, 0.08);
  --sites-stage-grid-y: rgba(167, 139, 250, 0.07);
}

:global(html.dark .site-galaxy-page-title) {
  color: #93c5fd !important;
}

:global(html.dark .site-galaxy__map) {
  background:
    radial-gradient(ellipse at 50% 48%, rgba(56, 189, 248, 0.16), transparent 50%),
    linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(30, 41, 59, 0.64) 52%, rgba(17, 24, 39, 0.82));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 20px 56px rgba(2, 6, 23, 0.28);
}

:global(html.dark .site-galaxy__summary) {
  background: rgba(147, 197, 253, 0.12);
  color: #bfdbfe;
}

:global(html.dark .site-galaxy__center) {
  background:
    radial-gradient(circle at 50% 35%, rgba(30, 41, 59, 0.92), var(--sites-stage-glass)),
    color-mix(in srgb, var(--node-color), #020617 68%);
  box-shadow:
    0 0 0 1rem rgba(56, 189, 248, 0.035),
    0 0 0 3rem rgba(167, 139, 250, 0.025),
    0 18px 42px rgba(2, 6, 23, 0.42);
}

:global(html.dark .site-galaxy__tooltip) {
  background:
    linear-gradient(120deg, color-mix(in srgb, var(--active-color), #020617 80%), var(--sites-panel-strong) 48%, rgba(15, 23, 42, 0.74)),
    var(--sites-panel-strong);
  box-shadow: 0 16px 36px rgba(2, 6, 23, 0.34);
}

:global(html.dark .site-galaxy__tooltip-label) {
  background: color-mix(in srgb, var(--active-color), transparent 84%);
}

:global(html.dark .site-galaxy__center-name) {
  color: #bfdbfe;
}

:global(html.dark .site-galaxy__center-url),
:global(html.dark .site-galaxy__tooltip-url) {
  background: rgba(15, 23, 42, 0.68);
  box-shadow: inset 0 0 0 1px rgba(147, 197, 253, 0.12);
}

:global(html.dark .site-galaxy__center-url),
:global(html.dark .site-galaxy__tooltip-url),
:global(html.dark .site-directory__home) {
  color: #93c5fd;
}

:global(html.dark .site-galaxy__tooltip-url:hover),
:global(html.dark .site-galaxy__tooltip-url:focus-visible),
:global(html.dark .site-directory__home:hover) {
  background: rgba(59, 130, 246, 0.16);
  box-shadow: inset 0 0 0 1px rgba(147, 197, 253, 0.18);
}

:global(html.dark .site-galaxy__node-label) {
  text-shadow: 0 1px 0 rgba(2, 6, 23, 0.92), 0 10px 20px rgba(2, 6, 23, 0.42);
}

:global(html.dark .site-directory__group) {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--group-color), #020617 82%), var(--sites-panel)),
    var(--sites-panel);
  box-shadow: 0 14px 34px color-mix(in srgb, var(--group-color), transparent 88%);
}

:global(html.dark .site-directory__group-mark) {
  background: color-mix(in srgb, var(--group-color), #020617 72%);
}

:global(html.dark .site-directory__site-icon) {
  background: color-mix(in srgb, var(--group-color), #020617 78%);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--group-color), transparent 82%),
    0 8px 18px color-mix(in srgb, var(--group-color), transparent 88%);
}

:global(html.dark .site-directory__home) {
  background: rgba(37, 99, 235, 0.12);
  box-shadow: inset 0 0 0 1px rgba(147, 197, 253, 0.12);
}

:global(html.dark .site-directory__site-meta) {
  background: rgba(34, 197, 94, 0.16);
  color: #86efac;
}

:global(html.dark .site-directory__site-meta[data-status="wip"]) {
  background: rgba(59, 130, 246, 0.18);
  color: #93c5fd;
}

:global(html.dark .site-directory__site-meta[data-status="archive"]) {
  background: rgba(148, 163, 184, 0.18);
  color: #cbd5e1;
}

:global(html.dark .site-directory__site-meta[data-status="service"]) {
  background: rgba(14, 165, 233, 0.18);
  color: #7dd3fc;
}

:global(html.dark .site-directory__site-meta[data-status="external"]) {
  background: rgba(129, 140, 248, 0.2);
  color: #c4b5fd;
}

@media (max-width: 860px) {
  :global(.content.no-aside:has(.site-galaxy)) {
    width: 100% !important;
  }

  .site-galaxy__map {
    min-height: 500px;
  }

  .site-galaxy__center {
    width: 7.65rem;
    height: 7.65rem;
    padding: 0.82rem 0.62rem 0.72rem;
  }

  .site-galaxy__tooltip {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.35rem;
    width: 100%;
  }

  .site-galaxy__tooltip-label,
  .site-galaxy__tooltip strong,
  .site-galaxy__tooltip-url,
  .site-galaxy__tooltip p:last-of-type {
    grid-column: 1;
    grid-row: auto;
  }

  .site-galaxy__tooltip-label {
    justify-self: start;
  }

  .site-directory__groups {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  :global(.site-galaxy-page-title) {
    font-size: 1.85rem;
  }

  .site-galaxy__subtitle {
    font-size: 0.98rem;
  }

  .site-galaxy__map {
    min-height: 540px;
  }

  .site-galaxy__center {
    width: 7rem;
    height: 7rem;
  }

  .site-galaxy__center-mark {
    font-size: 1.55rem;
  }

  .site-galaxy__center-name {
    font-size: 0.82rem;
  }

  .site-galaxy__center-url {
    max-width: 100%;
    margin-top: 0.28rem;
    font-size: 0.58rem;
    padding: 0.1rem 0.38rem;
  }

  .site-galaxy__node {
    width: 4.5rem;
    min-height: 4.5rem;
    transform: translate(-50%, -1.275rem);
  }

  .site-galaxy__node-mark {
    width: 2.55rem;
    height: 2.55rem;
    font-size: 1.1rem;
  }

  .site-galaxy__node-label {
    font-size: 0.82rem;
  }

  .site-galaxy__satellite {
    display: none;
  }

  .site-directory__header {
    align-items: start;
    flex-direction: column;
  }

  .site-directory__list a {
    grid-template-columns: 2.35rem minmax(0, 1fr) auto;
    gap: 0.45rem 0.75rem;
    align-items: start;
  }

  .site-directory__site-icon {
    grid-column: 1;
    grid-row: 1;
  }

  .site-directory__site-main {
    grid-column: 2;
    grid-row: 1;
  }

  .site-directory__site-desc {
    grid-column: 2 / -1;
  }

  .site-directory__site-meta {
    grid-column: 3;
    grid-row: 1;
    justify-self: end;
    margin-top: 0.1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-galaxy__star,
  .site-galaxy__halo.is-active {
    animation: none;
  }

  .site-galaxy__center,
  .site-galaxy__node-mark,
  .site-directory__list a {
    transition: none;
  }
}
</style>
