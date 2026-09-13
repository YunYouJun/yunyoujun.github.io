<script lang="ts" setup>
import { promotions } from '../config/promotions'

const isBeianMode = import.meta.env.VITE_BEIAN_MODE === 'true'
</script>

<template>
  <YunCard v-if="!isBeianMode">
    <aside class="recommendations" aria-label="小云广告之家">
      <div class="recommendations-heading">
        <span>小云广告之家</span>
        <span class="recommendations-note">自家作品</span>
      </div>
      <a
        v-for="item in promotions"
        :key="item.href"
        :href="item.href"
        :target="item.external ? '_blank' : undefined"
        :rel="item.external ? 'noopener noreferrer' : undefined"
        class="recommendation"
      >
        <span :class="item.icon" class="recommendation-icon" aria-hidden="true" />
        <span class="recommendation-copy">
          <span class="recommendation-label">{{ item.label }}</span>
          <strong class="recommendation-title">{{ item.title }}</strong>
          <span class="recommendation-description">{{ item.description }}</span>
        </span>
        <span class="i-ri-arrow-right-up-line recommendation-arrow" aria-hidden="true" />
      </a>
      <a href="/about/advertise" class="recommendations-contact">
        推广合作 <span aria-hidden="true">↗</span>
      </a>
    </aside>
  </YunCard>
</template>

<style scoped>
.recommendations {
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  text-align: left;
}

.recommendations-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.recommendations-note,
.recommendation-label {
  font-size: 0.7rem;
  font-weight: 400;
  opacity: 0.65;
}

.recommendation {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.8rem 0.5rem;
  border-radius: 0.5rem;
  color: inherit;
  text-decoration: none;
}

.recommendation:hover,
.recommendation:focus-visible {
  background: var(--va-c-bg-soft);
  color: var(--va-c-primary);
}

.recommendation:focus-visible,
.recommendations-contact:focus-visible {
  outline: 2px solid var(--va-c-primary);
  outline-offset: 2px;
}

.recommendation-icon {
  flex-shrink: 0;
  margin-top: 0.25rem;
  font-size: 1.25rem;
  color: var(--va-c-primary);
}

.recommendation-copy {
  display: grid;
  gap: 0.2rem;
  min-width: 0;
}

.recommendation-title {
  font-size: 0.9rem;
  line-height: 1.5;
}

.recommendation-description {
  font-size: 0.75rem;
  line-height: 1.6;
  opacity: 0.75;
}

.recommendation-arrow {
  flex-shrink: 0;
  margin: 0.25rem 0 0 auto;
  opacity: 0.5;
}

.recommendations-contact {
  display: block;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--va-c-divider);
  font-size: 0.75rem;
  text-align: right;
}
</style>
