<script setup lang="ts">
import type { FriendsStorage } from '../utils/friends'
import { onMounted, ref } from 'vue'
import {
  chooseInitialFriends,
  FRIENDS_SOURCE_URL,
  readFriendsCache,
  refreshFriends,
  shuffleFriends,
} from '../utils/friends'
import generatedFriends from '../utils/generated-friends'

const links = ref(generatedFriends)

const unavailableStorage: FriendsStorage = {
  getItem: () => null,
  removeItem: () => {},
  setItem: () => {},
}

function getStorage() {
  try {
    return window.localStorage
  }
  catch {
    return unavailableStorage
  }
}

onMounted(() => {
  const storage = getStorage()
  const cachedLinks = readFriendsCache(storage)
  links.value = shuffleFriends(chooseInitialFriends(generatedFriends, cachedLinks))

  void refreshFriends(links.value, {
    storage,
    url: FRIENDS_SOURCE_URL,
  }).then((result) => {
    if (result.changed)
      links.value = shuffleFriends(result.links)
  }).catch(() => {
    // Keep the SSG or cached links when the runtime request is unavailable.
  })
})
</script>

<template>
  <YunLinks v-if="links.length" :links="links" :random="false" />
  <div v-else class="friends-loading" aria-live="polite">
    友链加载中…
  </div>
</template>

<style scoped>
.friends-loading {
  min-height: 8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--va-c-text-light);
}
</style>
