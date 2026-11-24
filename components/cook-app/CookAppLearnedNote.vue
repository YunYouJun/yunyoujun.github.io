<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'
import CookAppFrame from './CookAppFrame.vue'
import {
  COOK_DEFAULT_LEARNED_CANDIDATES,
  RECIPE_MAP,
  TOOL_MAP,
} from './cookData'
import { prefersReducedMotion, useCookArticle } from './useCookArticle'

const {
  state,
  toggleLearnedRecipe,
  requestVideoSeek,
} = useCookArticle()

const activeCandidateId = shallowRef<string>(COOK_DEFAULT_LEARNED_CANDIDATES[0])
const stampAnimating = shallowRef(false)
const whisperText = shallowRef('')
const quoteTapCount = shallowRef(0)
const quoteSheen = shallowRef(false)

let stampTimer: ReturnType<typeof setTimeout> | undefined
let quoteTimer: ReturnType<typeof setTimeout> | undefined

const quoteMessages = [
  '今天也照顾好自己了 🍲',
  '一顿热乎饭，就足够值得记下来 ✨',
  '做给自己的饭，不必打卡给谁看',
] as const

const candidateIds = computed(() => {
  const ids: string[] = []
  if (state.chosenRecipeId && RECIPE_MAP[state.chosenRecipeId])
    ids.push(state.chosenRecipeId)
  for (const id of COOK_DEFAULT_LEARNED_CANDIDATES) {
    if (!ids.includes(id) && RECIPE_MAP[id])
      ids.push(id)
  }
  return ids
})

const activeRecipe = computed(() =>
  RECIPE_MAP[activeCandidateId.value] ?? RECIPE_MAP[candidateIds.value[0]],
)

const isActiveLearned = computed(() =>
  Boolean(activeRecipe.value && state.learnedRecipeIds.includes(activeRecipe.value.id)),
)

const learnedRecipes = computed(() =>
  state.learnedRecipeIds
    .map(id => RECIPE_MAP[id])
    .filter(Boolean),
)

const activeQuoteWhisper = computed(() => {
  if (quoteTapCount.value <= 0)
    return ''
  return quoteMessages[(quoteTapCount.value - 1) % quoteMessages.length]
})

watch(() => state.chosenRecipeId, (chosenId) => {
  if (chosenId && RECIPE_MAP[chosenId])
    activeCandidateId.value = chosenId
})

function cycleCandidate() {
  const list = candidateIds.value
  if (list.length <= 1)
    return
  const idx = list.indexOf(activeCandidateId.value)
  const nextIdx = idx === -1 ? 0 : (idx + 1) % list.length
  activeCandidateId.value = list[nextIdx]
}

function handleToggleLearned() {
  const recipe = activeRecipe.value
  if (!recipe)
    return

  const wasLearned = state.learnedRecipeIds.includes(recipe.id)
  toggleLearnedRecipe(recipe.id)

  if (wasLearned) {
    whisperText.value = `已从记录里收起「${recipe.name}」，想起来时随时再记。`
    return
  }

  whisperText.value = `已安静记下「${recipe.name}」——没有连续打卡，也没有排行榜。`

  if (prefersReducedMotion())
    return

  stampAnimating.value = false
  void (typeof document !== 'undefined' && document.body.offsetWidth)
  stampAnimating.value = true
  clearTimeout(stampTimer)
  stampTimer = setTimeout(() => {
    stampAnimating.value = false
  }, 600)
}

function handleQuoteTap() {
  quoteTapCount.value += 1
  if (prefersReducedMotion())
    return
  quoteSheen.value = false
  void (typeof document !== 'undefined' && document.body.offsetWidth)
  quoteSheen.value = true
  clearTimeout(quoteTimer)
  quoteTimer = setTimeout(() => {
    quoteSheen.value = false
  }, 850)
}

function jumpToBadgeVideo() {
  requestVideoSeek(86, '不设打卡与排行榜：用「今天学会了」解锁 3D 软陶小菜徽章')
}

onBeforeUnmount(() => {
  clearTimeout(stampTimer)
  clearTimeout(quoteTimer)
})
</script>

<template>
  <CookAppFrame
    id="cook-learned"
    eyebrow="轻松记录 · 不设打卡与排行榜"
    status="本地安静保存"
    caption="记录只是给自己留个念想；App 里的 3D 软陶小菜徽章不靠平面图标勉强模拟，欢迎看视频实机。"
  >
    <template #icon>
      <span class="i-ri-bookmark-3-line cook-eyebrow-icon" aria-hidden="true" />
    </template>

    <div v-if="activeRecipe" class="cook-learned-card" :class="{ 'is-stamped': stampAnimating }">
      <div class="cook-learned-info">
        <div class="cook-learned-title-row">
          <strong class="cook-learned-name">{{ activeRecipe.name }}</strong>
          <span class="cook-pill">
            {{ TOOL_MAP[activeRecipe.tool].name }} · {{ activeRecipe.minutes }} 分钟
          </span>
          <button
            type="button"
            class="cook-chip"
            @click="cycleCandidate"
          >
            换一道
          </button>
        </div>
        <p class="cook-learned-summary">
          {{ activeRecipe.summary }}
        </p>
      </div>

      <button
        type="button"
        class="cook-btn cook-btn--primary"
        :aria-pressed="isActiveLearned"
        @click="handleToggleLearned"
      >
        {{ isActiveLearned ? '今天已记下 ✓' : '今天学会了' }}
      </button>
    </div>

    <p v-if="whisperText" class="cook-learned-whisper" aria-live="polite">
      {{ whisperText }}
    </p>

    <p v-if="learnedRecipes.length > 0" class="cook-learned-record">
      本机已安静记下：{{ learnedRecipes.map(dish => dish.name).join('、') }}
    </p>

    <blockquote class="cook-quote-block">
      <p class="cook-quote-p">
        <button
          type="button"
          class="cook-quote-trigger"
          @click="handleQuoteTap"
        >
          <span class="cook-quote-text" :class="{ 'is-sheen': quoteSheen }">
            做饭本来就不用演给谁看，给自己做好一顿热乎饭，就已经很了不起啦。
          </span>
        </button>
      </p>
      <p v-if="activeQuoteWhisper" class="cook-quote-whisper" aria-live="polite">
        {{ activeQuoteWhisper }}
      </p>
    </blockquote>

    <template #actions>
      <span class="cook-badge-handoff-text">
        App 里点「今天学会了」会解锁真实的 3D 软陶小菜徽章——文章里不做平面模拟，直接看实机：
      </span>
      <div class="cook-badge-handoff-actions">
        <button
          type="button"
          class="cook-btn cook-btn--primary"
          @click="jumpToBadgeVideo"
        >
          跳到视频 01:26 看实机
        </button>
        <a
          class="cook-btn"
          href="https://cook.yunle.fun"
          target="_blank"
          rel="noopener noreferrer"
        >
          前往 App 官网 ↗
        </a>
      </div>
    </template>
  </CookAppFrame>
</template>

<style scoped>
.cook-learned-card {
  padding: 0.75rem 0.85rem;
  border: 1px solid var(--yun-surface-line);
  border-radius: 0.5rem;
  background: var(--cook-surface-tint);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem 0.85rem;
}

.cook-learned-card.is-stamped {
  animation: cook-stamp-pulse 520ms cubic-bezier(0.22, 1, 0.36, 1);
}

.cook-learned-info {
  flex: 1 1 15rem;
  min-width: 0;
}

.cook-learned-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 0.5rem;
}

.cook-learned-name {
  font-size: 0.96rem;
  color: var(--va-c-text-dark);
}

.cook-learned-summary {
  margin: 0.3rem 0 0;
  font-size: 0.8rem;
  color: var(--va-c-text-2);
}

.cook-learned-whisper {
  margin: 0.55rem 0 0;
  font-size: 0.8rem;
  color: var(--cook-accent-strong);
}

.cook-learned-record {
  margin: 0.5rem 0 0;
  font-size: 0.78rem;
  color: var(--va-c-text-2);
}

.cook-quote-block {
  margin: 0.8rem 0 0;
  padding: 0.45rem 0 0.1rem 0.85rem;
  border-left: 3px solid var(--cook-accent-border);
}

.cook-quote-p {
  margin: 0;
}

.cook-quote-trigger {
  padding: 0;
  border: none;
  background: transparent;
  color: var(--va-c-text-dark);
  font: inherit;
  font-size: 0.88rem;
  line-height: 1.6;
  text-align: start;
  cursor: pointer;
}

.cook-quote-trigger:focus-visible {
  outline: 2px solid var(--yun-focus-color);
  outline-offset: 3px;
  border-radius: 4px;
}

.cook-quote-text {
  display: inline-block;
  background-image: linear-gradient(
    110deg,
    currentColor 0%,
    currentColor 38%,
    var(--cook-accent-strong) 50%,
    currentColor 62%,
    currentColor 100%
  );
  background-size: 240% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  background-clip: text;
}

.cook-quote-text.is-sheen {
  color: transparent;
  animation: cook-quote-sheen 820ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.cook-quote-whisper {
  margin: 0.3rem 0 0;
  font-size: 0.78rem;
  color: var(--va-c-text-2);
}

.cook-badge-handoff-text {
  flex: 1 1 16rem;
  font-size: 0.78rem;
  color: var(--va-c-text-2);
}

.cook-badge-handoff-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
}

@keyframes cook-stamp-pulse {
  0% {
    transform: scale(0.99);
  }
  40% {
    transform: scale(1.01);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes cook-quote-sheen {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cook-learned-card.is-stamped,
  .cook-quote-text.is-sheen {
    color: inherit;
    animation: none;
  }
}
</style>
