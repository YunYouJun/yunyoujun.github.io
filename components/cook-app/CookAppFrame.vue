<script setup lang="ts">
import '../../styles/cook-app.scss'

defineProps<{
  eyebrow: string
  status?: string
  caption?: string
  flush?: boolean
  id?: string
}>()
</script>

<template>
  <figure :id="id" class="cook-figure not-prose">
    <div class="cook-box">
      <div class="cook-head">
        <div class="cook-eyebrow-group">
          <slot name="icon" />
          <span class="cook-eyebrow">{{ eyebrow }}</span>
          <span v-if="status" class="cook-status">{{ status }}</span>
        </div>

        <div v-if="$slots['head-right']" class="cook-head-right">
          <slot name="head-right" />
        </div>
      </div>

      <div class="cook-body" :class="{ 'cook-body--flush': flush }">
        <slot />
      </div>

      <div v-if="$slots.actions" class="cook-actions-bar yun-card-actions">
        <slot name="actions" />
      </div>
    </div>

    <figcaption v-if="caption" class="cook-caption">
      {{ caption }}
    </figcaption>
  </figure>
</template>
