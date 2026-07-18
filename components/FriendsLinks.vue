<script setup lang="ts">
import type { FriendsStorage } from '../utils/friends'
import { onMounted, ref } from 'vue'
import hiddenFriends, {
  friendOverrides,
  HIDDEN_FRIENDS_CHECKED_AT,
} from '../config/friends'
import {
  applyFriendOverrides,
  chooseInitialFriends,
  FRIENDS_SOURCE_URL,
  readFriendsCache,
  refreshFriends,
  shuffleFriends,
  splitFriendsByHiddenLinks,
} from '../utils/friends'
import generatedFriends from '../utils/generated-friends'

const initialGroups = splitFriendsByHiddenLinks(
  applyFriendOverrides(generatedFriends, friendOverrides),
  hiddenFriends,
)
const links = ref(initialGroups.active)
const hiddenLinks = ref(initialGroups.hidden)
// YunLinks snapshots its initial links prop, so replacements must remount it.
const linksRevision = ref(0)

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

function replaceLinks(nextLinks: typeof generatedFriends) {
  const groups = splitFriendsByHiddenLinks(
    applyFriendOverrides(nextLinks, friendOverrides),
    hiddenFriends,
  )
  links.value = shuffleFriends(groups.active)
  hiddenLinks.value = groups.hidden
  linksRevision.value += 1
}

onMounted(() => {
  const storage = getStorage()
  const cachedLinks = readFriendsCache(storage)
  replaceLinks(chooseInitialFriends(generatedFriends, cachedLinks))

  void refreshFriends(links.value, {
    storage,
    url: FRIENDS_SOURCE_URL,
  }).then((result) => {
    if (result.changed)
      replaceLinks(result.links)
  }).catch(() => {
    // Keep the SSG or cached links when the runtime request is unavailable.
  })
})
</script>

<template>
  <YunLinks v-if="links.length" :key="linksRevision" :links="links" :random="false" />
  <div v-else class="friends-loading" aria-live="polite">
    友链加载中…
  </div>
  <FriendsHiddenLinks
    :links="hiddenLinks"
    :revision="linksRevision"
    :checked-at="HIDDEN_FRIENDS_CHECKED_AT"
  />
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
