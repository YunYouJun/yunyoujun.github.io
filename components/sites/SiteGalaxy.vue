<script setup lang="ts">
import type { SiteStatus, YunSiteGroup } from '../../config/sites'
import { computed, ref } from 'vue'

import { siteGroups, siteMapCenter } from '../../config/sites'

const activeGroupId = ref(siteGroups[0].id)

const activeGroup = computed(() => {
  return siteGroups.find(group => group.id === activeGroupId.value) || siteGroups[0]
})

const activeLeadSite = computed(() => activeGroup.value.sites[0])

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
  <section class="site-galaxy" aria-label="云游星图">
    <header class="site-galaxy__intro">
      <p class="site-galaxy__subtitle">
        散落在不同域名里的小站、项目与实验。
      </p>
      <p class="site-galaxy__summary">
        {{ siteGroups.length }} 个星系，{{ totalSites }} 个入口，从主站出发。
      </p>
    </header>

    <div class="site-galaxy__map" aria-label="云游君站点星图">
      <span
        v-for="star in stars"
        :key="`${star.x}-${star.y}`"
        class="site-galaxy__star"
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
        :style="{ '--node-color': siteMapCenter.accent }"
      >
        <span class="site-galaxy__center-mark i-ri-planet-line" aria-hidden="true" />
        <span class="site-galaxy__center-name">{{ siteMapCenter.shortTitle }}</span>
        <span class="site-galaxy__center-url">{{ getHost(siteMapCenter.url) }}</span>
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
      <span v-if="activeLeadSite" class="site-galaxy__tooltip-url">
        {{ getHost(activeLeadSite.url) }}
        <span class="i-ri-arrow-right-up-line" aria-hidden="true" />
      </span>
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
                <span class="site-directory__site-main">
                  <strong>{{ site.name }}</strong>
                  <span>{{ getHost(site.url) }}</span>
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
    radial-gradient(ellipse at 50% 48%, rgba(37, 99, 235, 0.13), transparent 48%),
    linear-gradient(135deg, rgba(240, 249, 255, 0.76), rgba(245, 243, 255, 0.56) 48%, rgba(240, 253, 250, 0.46));
  --sites-stage-glass: rgba(255, 255, 255, 0.46);

  color: var(--sites-text);
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
  margin: -0.35rem auto 1.75rem;
  text-align: center;
}

.site-galaxy__subtitle {
  margin: 0;
  color: var(--sites-muted);
  font-size: 1.05rem;
  line-height: 1.8;
}

.site-galaxy__summary {
  margin: 0.35rem 0 0;
  color: rgba(37, 99, 235, 0.76);
  font-size: 0.9rem;
  line-height: 1.7;
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
  width: 8.75rem;
  height: 8.75rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  font-size: 2rem;
}

.site-galaxy__center-name {
  margin-top: 0.3rem;
  color: #1e3a8a;
  font-size: 0.95rem;
  font-weight: 700;
}

.site-galaxy__center-url {
  margin-top: 0.18rem;
  color: rgba(30, 58, 138, 0.78);
  font-size: 0.72rem;
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
  width: min(20rem, 42%);
  margin: 1.15rem 0 0 auto;
  border: 0;
  border-radius: 8px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--active-color), white 88%), var(--sites-panel-strong)),
    var(--sites-panel-strong);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
  padding: 0.9rem 1rem;
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
  margin: 0 0 0.2rem;
  color: var(--active-color);
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.5;
}

.site-galaxy__tooltip strong {
  display: block;
  color: var(--sites-text);
  font-size: 1.05rem;
  line-height: 1.5;
}

.site-galaxy__tooltip-url {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
  color: #1d4ed8;
  font-size: 0.86rem;
  text-decoration: none;
}

.site-galaxy__tooltip p:last-of-type {
  margin: 0.55rem 0 0;
  color: var(--sites-muted);
  font-size: 0.88rem;
  line-height: 1.65;
}

.site-directory {
  margin-top: 2.1rem;
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
  color: #1d4ed8;
  font-size: 0.92rem;
  font-weight: 700;
  text-decoration: none;
}

.site-directory__home:focus-visible {
  border-radius: 4px;
  outline: 2px solid rgba(37, 99, 235, 0.42);
  outline-offset: 0.28rem;
}

.site-directory__groups {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.site-directory__group {
  border: 0;
  border-radius: 8px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--group-color), white 94%), var(--sites-panel)),
    var(--sites-panel);
  box-shadow: 0 14px 34px color-mix(in srgb, var(--group-color), transparent 92%);
  overflow: hidden;
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
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.25fr) auto;
  gap: 0.9rem;
  align-items: center;
  min-height: 4.2rem;
  padding: 0.85rem 1rem;
  color: inherit;
  text-decoration: none;
  transition: background 160ms ease;
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

.site-directory__site-main strong {
  overflow: hidden;
  color: var(--sites-text);
  font-size: 0.94rem;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-directory__site-main span,
.site-directory__site-desc {
  overflow-wrap: anywhere;
  color: var(--sites-muted);
  font-size: 0.78rem;
  line-height: 1.5;
}

.site-directory__site-desc {
  font-size: 0.84rem;
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
    linear-gradient(135deg, color-mix(in srgb, var(--active-color), #020617 78%), var(--sites-panel-strong)),
    var(--sites-panel-strong);
  box-shadow: 0 16px 36px rgba(2, 6, 23, 0.34);
}

:global(html.dark .site-galaxy__center-name) {
  color: #bfdbfe;
}

:global(html.dark .site-galaxy__center-url),
:global(html.dark .site-galaxy__tooltip-url),
:global(html.dark .site-directory__home) {
  color: #93c5fd;
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

@media (max-width: 860px) {
  :global(.content.no-aside:has(.site-galaxy)) {
    width: 100% !important;
  }

  .site-galaxy__map {
    min-height: 500px;
  }

  .site-galaxy__center {
    width: 7.2rem;
    height: 7.2rem;
  }

  .site-galaxy__tooltip {
    width: 100%;
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
    width: 6.2rem;
    height: 6.2rem;
  }

  .site-galaxy__center-mark {
    font-size: 1.55rem;
  }

  .site-galaxy__center-name {
    font-size: 0.82rem;
  }

  .site-galaxy__center-url {
    display: none;
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
    grid-template-columns: 1fr;
    gap: 0.45rem;
  }

  .site-directory__site-meta {
    justify-self: start;
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
