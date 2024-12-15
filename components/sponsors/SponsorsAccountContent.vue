<script lang="ts" setup>
import type { Component } from 'vue'
import { computed, onMounted, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'

import SponsorExpenseTable from './SponsorsExpenseTable.vue'
import SponsorsList from './SponsorsList.vue'
import SponsorsOther from './SponsorsOther.vue'

import { store, sumExpense, sumIncome, useSponsorStore } from './store'

const sponsorStore = useSponsorStore()
const { t } = useI18n()
const state = store.state

interface TabItem {
  name: string
  component: Component
}

const tabs = computed<TabItem[]>(() => [{
  name: t('tab.sponsor_list'),
  component: SponsorsList,
}, {
  name: t('tab.other_sponsors'),
  component: SponsorsOther,
}, {
  name: t('tab.expense'),
  component: SponsorExpenseTable,
}])

const currentTab = shallowRef<TabItem>(tabs.value[0])

onMounted(async () => {
  await Promise.all([
    sponsorStore.fetchManualSponsorsData(),
    sponsorStore.fetchExpensesData(),
  ])

  sumIncome(sponsorStore.sponsors)
  sumExpense(sponsorStore.expenses)
})
</script>

<template>
  <div class="post-card bg-white/80 dark:bg-dark p-2">
    <div class="flex items-center justify-center" m="2" p="b-2" text="sm">
      <SponsorTag text="green-600 dark:green-100" bg="green-50 dark:(green-700 opacity-80)">
        <div class="inline-flex" m="r-1" i-icon-park-outline-income />
        <span>收入：</span>
        <span font="mono">{{ state.income.toFixed(2) }}</span>
      </SponsorTag>
      <span font="mono">-</span>
      <SponsorTag text="red-600 dark:red-100" bg="red-50 dark:(red-700 opacity-80)">
        <div class="inline-flex" m="r-1" i-icon-park-outline-expenses />
        <span>支出：</span>
        <span font="mono">{{ state.expense.toFixed(2) }}</span>
      </SponsorTag>
      <span font="mono">=</span>
      <SponsorTag text="yellow-600 dark:yellow-100" bg="yellow-50 dark:(yellow-700 opacity-80)">
        <div class="inline-flex" m="r-1" i-ri-scales-line />
        <span>盈余：</span>
        <span font="mono">{{ store.balance.value.toFixed(2) }}</span>
      </SponsorTag>
    </div>

    <div flex="~" class="items-center justify-center">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        class="tab-button" :class="[{ active: currentTab.name === tab.name }]"
        text="sm"
        font="serif black"
        @click="currentTab = tab"
      >
        {{ tab.name }}
      </button>
    </div>
    <div class="tab relative min-h-25">
      <YunLoading v-if="sponsorStore.isLoading" class="op-80" />
      <component :is="currentTab.component" />
    </div>
  </div>
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
