<script lang="ts" setup>
import type { ProjectDataType, ProjectItem } from 'valaxy-theme-yun/theme'
import { useFrontmatter } from 'valaxy'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface BeianProjectItem extends ProjectItem {
  hideInBeian?: boolean
}

const fm = useFrontmatter()
const { t } = useI18n()
const isBeianMode = import.meta.env.VITE_BEIAN_MODE === 'true'

const projects = computed(() => {
  const data = fm.value.projects as ProjectDataType

  if (!isBeianMode)
    return data

  return Object.fromEntries(Object.entries(data).map(([key, category]) => [
    key,
    {
      ...category,
      collection: (category.collection as BeianProjectItem[]).filter(project => !project.hideInBeian),
    },
  ])) as ProjectDataType
})

const curCategory = ref('all')
</script>

<template>
  <div flex="~ col center">
    <YunPageHeader
      :title="fm.title || t('title.projects')"
      :icon="fm.icon"
      :page-title-class="fm.pageTitleClass"
    />

    <div class="mt-3" flex="~ wrap" justify="center">
      <YunProjectToggleButton
        :active="curCategory === 'all'"
        @click="curCategory = 'all'"
      >
        全部
      </YunProjectToggleButton>
      <YunProjectToggleButton
        v-for="(category, key) in projects"
        :key="key"
        :active="key === curCategory"
        @click="curCategory = key as string"
      >
        <span class="inline-flex">{{ category.emoji }}</span>
        <span class="inline-flex">{{ category.title }}</span>
      </YunProjectToggleButton>
    </div>

    <div flex="~ wrap" justify="center">
      <template v-for="(category, key) in projects" :key="key">
        <YunProjectCollection
          v-if="curCategory === 'all' || curCategory === key"
          :title="category.title"
          :projects="projects[key].collection"
        />
      </template>
    </div>
  </div>
</template>
