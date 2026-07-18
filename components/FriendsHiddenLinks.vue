<script setup lang="ts">
import type { FriendLink } from '../utils/friends'

defineProps<{
  checkedAt: string
  links: FriendLink[]
  revision: number
}>()
</script>

<template>
  <section v-if="links.length" class="hidden-friends" aria-labelledby="hidden-friends-title">
    <details class="hidden-friends-details">
      <summary class="hidden-friends-summary">
        <span class="hidden-friends-icon i-ri-ghost-line" aria-hidden="true" />
        <span class="hidden-friends-copy">
          <strong id="hidden-friends-title">神隐友链</strong>
          <span>有些朋友只是暂时离线，保留在这里等待重逢。</span>
        </span>
        <span class="hidden-friends-count" :aria-label="`${links.length} 个站点`">
          {{ links.length }}
        </span>
        <span class="hidden-friends-chevron i-ri-arrow-down-s-line" aria-hidden="true" />
      </summary>

      <div class="hidden-friends-body">
        <p>
          以下站点在 {{ checkedAt }} 的多次检查中均无法访问，之后会定期复查。
        </p>
        <YunLinks :key="revision" :links="links" :random="false" />
      </div>
    </details>
  </section>
</template>

<style scoped>
.hidden-friends {
  margin: 2rem 0 1rem;
}

.hidden-friends-details {
  overflow: hidden;
  background: color-mix(in srgb, var(--va-c-bg-soft) 72%, transparent);
  border: 1px dashed color-mix(in srgb, var(--va-c-border) 82%, transparent);
  border-radius: 0.875rem;
  transition: border-color var(--va-transition-duration-fast) ease;
}

.hidden-friends-details[open] {
  border-style: solid;
  border-color: color-mix(in srgb, var(--va-c-primary) 32%, var(--va-c-border));
}

.hidden-friends-summary {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  gap: 0.75rem;
  align-items: center;
  padding: 1rem 1.125rem;
  color: var(--va-c-text);
  cursor: pointer;
  list-style: none;
  transition: background-color var(--va-transition-duration-fast) ease;
}

.hidden-friends-summary::-webkit-details-marker {
  display: none;
}

.hidden-friends-summary:hover {
  background: color-mix(in srgb, var(--va-c-primary) 6%, transparent);
}

.hidden-friends-summary:focus-visible {
  outline: 2px solid var(--va-c-primary);
  outline-offset: -2px;
}

.hidden-friends-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--va-c-text-light);
}

.hidden-friends-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.15rem;
}

.hidden-friends-copy strong {
  font-family: var(--va-font-serif);
  font-size: 1rem;
}

.hidden-friends-copy span {
  color: var(--va-c-text-light);
  font-size: 0.82rem;
  line-height: 1.45;
}

.hidden-friends-count {
  min-width: 1.75rem;
  padding: 0.15rem 0.5rem;
  color: var(--va-c-text-light);
  text-align: center;
  font-size: 0.75rem;
  background: var(--va-c-bg);
  border: 1px solid var(--va-c-border);
  border-radius: 999px;
}

.hidden-friends-chevron {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--va-c-text-light);
  transition: transform var(--va-transition-duration-fast) ease;
}

.hidden-friends-details[open] .hidden-friends-chevron {
  transform: rotate(180deg);
}

.hidden-friends-body {
  padding: 0 1.125rem 1.125rem;
  border-top: 1px solid color-mix(in srgb, var(--va-c-border) 60%, transparent);
}

.hidden-friends-body > p {
  margin: 1rem 0 0;
  color: var(--va-c-text-light);
  font-size: 0.85rem;
}

.hidden-friends-body :deep(.yun-link-items) {
  margin-bottom: 0;
}

.hidden-friends-body :deep(.yun-link-url) {
  border-style: dashed;
  box-shadow: none;
  filter: saturate(0.55);
  opacity: 0.8;
}

@media (max-width: 640px) {
  .hidden-friends-summary {
    gap: 0.625rem;
    padding: 0.875rem;
  }

  .hidden-friends-copy span {
    font-size: 0.76rem;
  }

  .hidden-friends-body {
    padding: 0 0.875rem 0.875rem;
  }
}
</style>
