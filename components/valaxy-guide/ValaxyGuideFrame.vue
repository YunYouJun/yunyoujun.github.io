<script setup lang="ts">
import '../../styles/valaxy-guide.scss'

defineProps<{
  eyebrow: string
  status?: string
  caption: string
  flush?: boolean
}>()
</script>

<template>
  <figure class="vg-figure not-prose">
    <div class="vg-box">
      <div class="vg-head">
        <div class="vg-eyebrow-group">
          <slot name="icon" />
          <span class="vg-eyebrow">{{ eyebrow }}</span>
          <span v-if="status" class="vg-status">{{ status }}</span>
        </div>

        <div v-if="$slots['head-right']" class="vg-head-right">
          <slot name="head-right" />
        </div>
      </div>

      <div class="vg-body" :class="{ 'vg-body--flush': flush }">
        <slot />
      </div>

      <div v-if="$slots.actions" class="vg-actions-bar yun-card-actions">
        <slot name="actions" />
      </div>
    </div>

    <figcaption class="vg-caption">
      {{ caption }}
    </figcaption>
  </figure>
</template>
