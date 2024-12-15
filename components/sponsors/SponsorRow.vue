<script lang="ts" setup>
import type { RankSponsor } from '@yunyoujun/sponsors'
import { ref } from 'vue'

defineProps<{
  i: number
  sponsor: RankSponsor
}>()

const expand = ref(false)

/**
 * 根据索引获取对应 class
 */
function sponsorClassName(order: number) {
  let className = ''
  switch (order) {
    case 0:
      className = 'first'
      break
    case 1:
      className = 'second'
      break
    case 2:
      className = 'third'
      break
    default:
      break
  }
  return className ? `${className}-sponsor` : ''
}
</script>

<template>
  <div class="sponsor-row flex justify-between" p="1" :class="sponsorClassName(i)">
    <div w="10" class="inline-flex cursor-pointer items-center justify-start" font="mono" text="gray" @click="expand = !expand">
      <div v-if="!expand" m="r-1" i-ri-arrow-right-s-line />
      <div v-else m="r-1" i-ri-arrow-down-s-line />
      <span>{{ i + 1 }}</span>
    </div>
    <div w="40" class="inline-flex items-center justify-start" font="serif black">
      <SponsorAvatar :email="sponsor.email" :avatar="sponsor.avatar" />
      <a
        v-if="sponsor.url"
        :href="sponsor.url"
        target="_blank"
        :alt="sponsor.name"
        class="sponsor-url"
      >
        <span>{{ sponsor.name || "不知名的好心人" }}</span>
      </a>
      <span v-else>{{ sponsor.name || "不知名的好心人" }}</span>
    </div>
    <div w="24" class="inline-flex justify-end" font="mono">
      {{ sponsor.total.toFixed(2) }}
    </div>
    <div w="12" class="inline-flex justify-end" font="mono">
      {{ sponsor.children.length }}
    </div>
  </div>
  <Transition>
    <SponsorDetailList v-if="expand" :details="sponsor.children" />
  </Transition>
</template>

<style lang="scss">
.first-sponsor {
  color: #ff9800;
  font-weight: bold;
}

.second-sponsor {
  color: #607d8b;
  font-weight: bold;
}

.third-sponsor {
  color: #795548;
  font-weight: bold;
}
</style>
