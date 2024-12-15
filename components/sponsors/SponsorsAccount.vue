<script lang="ts" setup>
import { ref } from 'vue'

const show = ref(false)
</script>

<template>
  <div
    class="cursor-pointer w-full items-center flex text-$va-c-primary bg-blue/10 hover:bg-blue/20 p-2 rounded gap-1 shadow transition"
    @click="show = !show"
  >
    <div i-ri-money-cny-box-line />
    {{ show ? '收起' : '查看' }}账簿
  </div>

  <SponsorsAccountContent v-if="show" class="shadow" />
</template>

<style>
.tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid var(--c-border);
  cursor: pointer;
  margin-bottom: -1px;
  margin-right: -1px;
}

.tab-button:hover {
  background: rgba(0, 120, 231, 0.1);
}
.tab-button.active {
  background: rgba(122, 122, 122, 0.1);
}
.tab {
  border: 1px solid var(--c-border);
  padding: 10px;
}
</style>
