<script setup lang="ts">
import type { CookToolId } from './cookData'
import { computed, shallowRef, watch } from 'vue'
import CookAppFrame from './CookAppFrame.vue'
import {
  COOK_INGREDIENTS,
  COOK_RECIPES,
  COOK_TOOLS,
  INGREDIENT_MAP,
  matchRecipes,
  RECIPE_MAP,
  TOOL_MAP,
} from './cookData'
import { prefersReducedMotion, useCookArticle } from './useCookArticle'

const {
  state,
  toggleIngredient,
  setSelectedTool,
  setPlaygroundMode,
  clearIngredients,
  pickRandomIngredients,
  dismissFridgeSync,
  chooseRecipe,
  scrollToSection,
} = useCookArticle()

const showAllMatches = shallowRef(false)
const swipeScope = shallowRef<'all' | 'matched'>('all')
const customOrder = shallowRef<number[] | null>(null)
const deckIndex = shallowRef(0)

const isDragging = shallowRef(false)
const dragX = shallowRef(0)
const startX = shallowRef(0)
const activePointerId = shallowRef<number | null>(null)

const ingredientMatches = computed(() =>
  matchRecipes(state.selectedIngredients, state.selectedTool),
)

const visibleMatches = computed(() =>
  showAllMatches.value ? ingredientMatches.value : ingredientMatches.value.slice(0, 6),
)

const hiddenCount = computed(() =>
  Math.max(0, ingredientMatches.value.length - 6),
)

const chosenRecipe = computed(() =>
  state.chosenRecipeId ? RECIPE_MAP[state.chosenRecipeId] ?? null : null,
)

const swipeBasePool = computed(() => {
  if (swipeScope.value === 'matched' && state.selectedIngredients.length > 0 && ingredientMatches.value.length > 0)
    return ingredientMatches.value.map(item => item.recipe)
  return COOK_RECIPES
})

const swipeDeck = computed(() => {
  const pool = swipeBasePool.value
  if (!customOrder.value || customOrder.value.length !== pool.length)
    return pool
  return customOrder.value.map(idx => pool[idx]).filter(Boolean)
})

const visibleDeckCards = computed(() => {
  const deck = swipeDeck.value
  if (deck.length === 0)
    return []
  const count = Math.min(3, deck.length)
  return Array.from({ length: count }, (_, offset) => {
    const idx = (deckIndex.value + offset) % deck.length
    return {
      recipe: deck[idx],
      offset,
      deckPos: idx,
    }
  })
})

const currentSwipeCard = computed(() => visibleDeckCards.value[0]?.recipe ?? null)

const topCardStyle = computed(() => {
  if (dragX.value === 0 || prefersReducedMotion())
    return {}
  const rotate = Math.max(-10, Math.min(10, dragX.value / 18))
  return {
    transform: `translate3d(${dragX.value}px, ${Math.abs(dragX.value) * 0.04}px, 0) rotate(${rotate.toFixed(2)}deg)`,
    transition: isDragging.value ? 'none' : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
  }
})

const skipIndicatorOpacity = computed(() =>
  dragX.value < -12 ? Math.min(1, Math.abs(dragX.value) / 80) : 0,
)

const chooseIndicatorOpacity = computed(() =>
  dragX.value > 12 ? Math.min(1, dragX.value / 80) : 0,
)

watch(
  () => [state.selectedIngredients.join(','), state.selectedTool],
  () => {
    showAllMatches.value = false
    deckIndex.value = 0
    customOrder.value = null
  },
)

watch(swipeScope, () => {
  deckIndex.value = 0
  customOrder.value = null
})

function handleToolSelect(tool: CookToolId | 'all') {
  setSelectedTool(tool)
}

function resetFilters() {
  clearIngredients()
  setSelectedTool('all')
}

function skipCard() {
  const len = swipeDeck.value.length
  if (len <= 1)
    return
  deckIndex.value = (deckIndex.value + 1) % len
}

function chooseCurrentCard() {
  if (!currentSwipeCard.value)
    return
  chooseRecipe(currentSwipeCard.value.id)
}

function shuffleDeck() {
  const len = swipeBasePool.value.length
  if (len <= 1)
    return
  const order = Array.from({ length: len }, (_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  const currentId = currentSwipeCard.value?.id
  if (currentId && swipeBasePool.value[order[0]]?.id === currentId && len > 1)
    [order[0], order[1]] = [order[1], order[0]]

  customOrder.value = order
  deckIndex.value = 0
}

function onPointerDown(event: PointerEvent) {
  if (event.button !== 0 && event.pointerType === 'mouse')
    return
  const el = event.currentTarget as HTMLElement | null
  activePointerId.value = event.pointerId
  startX.value = event.clientX
  dragX.value = 0
  isDragging.value = true
  try {
    el?.setPointerCapture(event.pointerId)
  }
  catch {
    // Ignore pointer capture failures
  }
}

function onPointerMove(event: PointerEvent) {
  if (!isDragging.value || activePointerId.value !== event.pointerId)
    return
  dragX.value = event.clientX - startX.value
}

function finishPointer(event: PointerEvent, commit: boolean) {
  if (!isDragging.value || activePointerId.value !== event.pointerId)
    return
  const el = event.currentTarget as HTMLElement | null
  try {
    if (el?.hasPointerCapture(event.pointerId))
      el.releasePointerCapture(event.pointerId)
  }
  catch {
    // Ignore pointer release failures
  }
  const delta = dragX.value
  isDragging.value = false
  activePointerId.value = null
  dragX.value = 0

  if (!commit)
    return
  if (delta <= -72)
    skipCard()
  else if (delta >= 72)
    chooseCurrentCard()
}

function formatMissingNames(ids: string[]) {
  const names = ids.slice(0, 2).map(id => INGREDIENT_MAP[id]?.name ?? id)
  return ids.length > 2 ? `${names.join('、')}等` : names.join('、')
}
</script>

<template>
  <CookAppFrame
    id="cook-playground"
    eyebrow="今天吃什么？微缩试玩"
    status="精选 18 道 · 完整 887 道见云食册"
    caption="这里仅收录 18 道家常菜作互动演示；完整 887 道菜谱与语音找菜可在云食册内体验。"
  >
    <template #icon>
      <span class="i-ri-restaurant-2-line cook-eyebrow-icon" aria-hidden="true" />
    </template>

    <template #head-right>
      <div class="cook-segmented" role="tablist" aria-label="试玩模式">
        <button
          id="cook-tab-pick"
          type="button"
          role="tab"
          class="cook-seg-btn"
          :class="{ 'is-active': state.playgroundMode === 'pick' }"
          :aria-selected="state.playgroundMode === 'pick'"
          aria-controls="cook-panel-pick"
          @click="setPlaygroundMode('pick')"
        >
          点选食材
        </button>
        <button
          id="cook-tab-swipe"
          type="button"
          role="tab"
          class="cook-seg-btn"
          :class="{ 'is-active': state.playgroundMode === 'swipe' }"
          :aria-selected="state.playgroundMode === 'swipe'"
          aria-controls="cook-panel-swipe"
          @click="setPlaygroundMode('swipe')"
        >
          横向滑卡抽签
        </button>
      </div>
    </template>

    <div v-if="state.fridgeSyncNames.length > 0" class="cook-sync-banner" aria-live="polite">
      <span>
        已从冰箱带入：<strong>{{ state.fridgeSyncNames.join('、') }}</strong>
      </span>
      <button type="button" class="cook-chip" @click="dismissFridgeSync">
        知道了
      </button>
    </div>

    <!-- Pick Mode -->
    <div
      v-show="state.playgroundMode === 'pick'"
      id="cook-panel-pick"
      role="tabpanel"
      aria-labelledby="cook-tab-pick"
    >
      <div class="cook-pick-toolbar">
        <span class="cook-pick-label">
          手头有什么（已选 {{ state.selectedIngredients.length }} 样）
        </span>
        <div class="cook-pick-quick">
          <button type="button" class="cook-chip" @click="pickRandomIngredients">
            随机选几样
          </button>
          <button
            type="button"
            class="cook-chip"
            :disabled="state.selectedIngredients.length === 0"
            @click="clearIngredients"
          >
            清空
          </button>
        </div>
      </div>

      <div class="cook-ingredient-grid" role="group" aria-label="选择食材">
        <button
          v-for="item in COOK_INGREDIENTS"
          :key="item.id"
          type="button"
          class="cook-chip"
          :class="{ 'is-active': state.selectedIngredients.includes(item.id) }"
          :aria-pressed="state.selectedIngredients.includes(item.id)"
          @click="toggleIngredient(item.id)"
        >
          <span aria-hidden="true">{{ item.emoji }}</span>
          <span>{{ item.name }}</span>
        </button>
      </div>

      <div class="cook-tool-row" role="group" aria-label="按厨具筛选">
        <span class="cook-pick-label">厨具</span>
        <button
          type="button"
          class="cook-chip"
          :class="{ 'is-active': state.selectedTool === 'all' }"
          :aria-pressed="state.selectedTool === 'all'"
          @click="handleToolSelect('all')"
        >
          全部厨具
        </button>
        <button
          v-for="tool in COOK_TOOLS"
          :key="tool.id"
          type="button"
          class="cook-chip"
          :class="{ 'is-active': state.selectedTool === tool.id }"
          :aria-pressed="state.selectedTool === tool.id"
          @click="handleToolSelect(tool.id)"
        >
          {{ tool.name }}
        </button>
      </div>

      <div class="cook-match-summary">
        <span v-if="state.selectedIngredients.length === 0">
          未限定食材，展示 {{ ingredientMatches.length }} 道精选家常菜
        </span>
        <span v-else>
          匹配到 <strong>{{ ingredientMatches.length }}</strong> 道家常菜
        </span>
      </div>

      <div v-if="ingredientMatches.length === 0" class="cook-empty-box">
        <p>当前食材和厨具组合还没有对应的示例菜谱。</p>
        <button type="button" class="cook-btn cook-btn--primary" @click="resetFilters">
          重置筛选条件
        </button>
      </div>

      <ul v-else class="cook-recipe-list">
        <li
          v-for="match in visibleMatches"
          :key="match.recipe.id"
          class="cook-recipe-card"
          :class="{ 'is-chosen': state.chosenRecipeId === match.recipe.id }"
        >
          <div class="cook-recipe-main">
            <div class="cook-recipe-title-row">
              <span class="cook-recipe-name">{{ match.recipe.name }}</span>
              <span
                v-if="state.selectedIngredients.length === 0"
                class="cook-pill"
              >
                精选示范
              </span>
              <span
                v-else-if="match.exact"
                class="cook-pill cook-pill--green"
              >
                食材齐了
              </span>
              <span
                v-else
                class="cook-pill cook-pill--warm"
              >
                差 {{ match.missingIds.length }} 样：{{ formatMissingNames(match.missingIds) }}
              </span>
            </div>

            <p class="cook-recipe-summary">
              {{ match.recipe.summary }}
            </p>

            <div class="cook-recipe-tags">
              <span class="cook-recipe-meta">
                {{ TOOL_MAP[match.recipe.tool].name }} · {{ match.recipe.minutes }} 分钟
              </span>
              <span
                v-for="ingId in match.recipe.ingredients"
                :key="ingId"
                class="cook-ing-tag"
                :class="{ 'is-matched': state.selectedIngredients.includes(ingId) }"
              >
                {{ INGREDIENT_MAP[ingId]?.emoji }} {{ INGREDIENT_MAP[ingId]?.name ?? ingId }}
              </span>
            </div>
          </div>

          <button
            type="button"
            class="cook-btn cook-recipe-choose"
            :class="{ 'cook-btn--primary': state.chosenRecipeId === match.recipe.id }"
            :aria-pressed="state.chosenRecipeId === match.recipe.id"
            @click="chooseRecipe(match.recipe.id)"
          >
            {{ state.chosenRecipeId === match.recipe.id ? '已选为今晚菜谱 ✓' : '就做这道' }}
          </button>
        </li>
      </ul>

      <div v-if="hiddenCount > 0 || showAllMatches" class="cook-expand-row">
        <button
          v-if="!showAllMatches && hiddenCount > 0"
          type="button"
          class="cook-chip"
          @click="showAllMatches = true"
        >
          展开其余 {{ hiddenCount }} 道
        </button>
        <button
          v-else-if="showAllMatches && ingredientMatches.length > 6"
          type="button"
          class="cook-chip"
          @click="showAllMatches = false"
        >
          收起列表
        </button>
      </div>
    </div>

    <!-- Swipe Mode -->
    <div
      v-show="state.playgroundMode === 'swipe'"
      id="cook-panel-swipe"
      role="tabpanel"
      aria-labelledby="cook-tab-swipe"
    >
      <div class="cook-swipe-scope">
        <button
          type="button"
          class="cook-chip"
          :class="{ 'is-active': swipeScope === 'all' }"
          :aria-pressed="swipeScope === 'all'"
          @click="swipeScope = 'all'"
        >
          从全部 {{ COOK_RECIPES.length }} 道抽签
        </button>
        <button
          type="button"
          class="cook-chip"
          :class="{ 'is-active': swipeScope === 'matched' }"
          :aria-pressed="swipeScope === 'matched'"
          :disabled="state.selectedIngredients.length === 0 || ingredientMatches.length === 0"
          @click="swipeScope = 'matched'"
        >
          按当前食材抽签（{{ ingredientMatches.length }} 道）
        </button>
        <span class="cook-swipe-hint-keys">
          支持拖拽滑卡，或用 <kbd class="cook-kbd">←</kbd> / <kbd class="cook-kbd">→</kbd>
        </span>
      </div>

      <div
        class="cook-swipe-stage"
        tabindex="0"
        aria-label="横向滑卡抽签区，可用左右方向键切换或选择"
        @keydown.left.prevent="skipCard"
        @keydown.right.prevent="chooseCurrentCard"
        @keydown.enter.prevent="chooseCurrentCard"
      >
        <div
          v-for="card in visibleDeckCards"
          :key="`${card.recipe.id}-${card.offset}`"
          class="cook-swipe-card"
          :class="{
            'is-top': card.offset === 0,
            'is-mid': card.offset === 1,
            'is-back': card.offset === 2,
            'is-chosen': state.chosenRecipeId === card.recipe.id,
          }"
          :style="card.offset === 0 ? topCardStyle : undefined"
          @pointerdown="card.offset === 0 ? onPointerDown($event) : undefined"
          @pointermove="card.offset === 0 ? onPointerMove($event) : undefined"
          @pointerup="card.offset === 0 ? finishPointer($event, true) : undefined"
          @pointercancel="card.offset === 0 ? finishPointer($event, false) : undefined"
        >
          <div v-if="card.offset === 0" class="cook-swipe-badges" aria-hidden="true">
            <span class="cook-pill" :style="{ opacity: skipIndicatorOpacity }">← 换一道</span>
            <span class="cook-pill cook-pill--green" :style="{ opacity: chooseIndicatorOpacity }">就吃它 →</span>
          </div>

          <div class="cook-swipe-card-head">
            <span class="cook-pill cook-pill--warm">
              {{ TOOL_MAP[card.recipe.tool].name }} · {{ card.recipe.minutes }} 分钟
            </span>
            <span class="cook-swipe-counter">
              {{ (deckIndex % swipeDeck.length) + 1 }} / {{ swipeDeck.length }}
            </span>
          </div>

          <h4 class="cook-swipe-title">
            {{ card.recipe.name }}
          </h4>

          <p class="cook-swipe-summary">
            {{ card.recipe.summary }}
          </p>

          <div class="cook-recipe-tags">
            <span
              v-for="ingId in card.recipe.ingredients"
              :key="ingId"
              class="cook-ing-tag"
              :class="{ 'is-matched': state.selectedIngredients.includes(ingId) }"
            >
              {{ INGREDIENT_MAP[ingId]?.emoji }} {{ INGREDIENT_MAP[ingId]?.name ?? ingId }}
            </span>
          </div>

          <p class="cook-swipe-tip">
            小贴士：{{ card.recipe.tip }}
          </p>
        </div>
      </div>

      <div class="cook-swipe-controls">
        <button type="button" class="cook-btn" @click="skipCard">
          ← 换一道
        </button>
        <button type="button" class="cook-btn" @click="shuffleDeck">
          <span class="i-ri-shuffle-line" aria-hidden="true" />
          <span>洗牌重抽</span>
        </button>
        <button
          type="button"
          class="cook-btn cook-btn--primary"
          @click="chooseCurrentCard"
        >
          {{ state.chosenRecipeId === currentSwipeCard?.id ? '已选这道 ✓' : '就吃这道 ✓' }}
        </button>
      </div>
    </div>

    <div v-if="chosenRecipe" class="cook-chosen-bar" aria-live="polite">
      <span>
        已选定「<strong>{{ chosenRecipe.name }}</strong>」，今晚就做这一顿吧。
      </span>
      <button
        type="button"
        class="cook-btn cook-btn--primary"
        @click="scrollToSection('cook-learned')"
      >
        去文末记下「今天学会了」↓
      </button>
    </div>

    <template #actions>
      <span class="cook-playground-foot">想用完整 887 道菜谱或「说句话找菜」？</span>
      <div class="cook-playground-links">
        <a
          class="cook-btn"
          href="https://cook.yunyoujun.cn"
          target="_blank"
          rel="noopener noreferrer"
        >
          去网页版看完整 887 道 ↗
        </a>
        <a
          class="cook-btn cook-btn--primary"
          href="https://cook.yunle.fun"
          target="_blank"
          rel="noopener noreferrer"
        >
          了解云食册 App ↗
        </a>
      </div>
    </template>
  </CookAppFrame>
</template>

<style scoped>
.cook-sync-banner {
  margin-bottom: 0.75rem;
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--cook-accent-border);
  border-radius: 0.45rem;
  background: var(--cook-surface-tint);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--va-c-text);
}

.cook-pick-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.45rem;
}

.cook-pick-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--va-c-text-2);
}

.cook-pick-quick {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.cook-ingredient-grid {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.cook-tool-row {
  margin-top: 0.75rem;
  padding-top: 0.65rem;
  border-top: 1px solid var(--yun-surface-line);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}

.cook-match-summary {
  margin-top: 0.7rem;
  font-size: 0.8rem;
  color: var(--va-c-text-2);
}

.cook-empty-box {
  margin-top: 0.65rem;
  padding: 1rem;
  border: 1px dashed var(--yun-surface-line);
  border-radius: 0.5rem;
  text-align: center;
  font-size: 0.84rem;
  color: var(--va-c-text-2);
}

.cook-empty-box p {
  margin: 0 0 0.6rem;
}

.cook-recipe-list {
  list-style: none;
  margin: 0.55rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.55rem;
}

.cook-recipe-card {
  padding: 0.7rem 0.75rem;
  border: 1px solid var(--yun-surface-line);
  border-radius: 0.5rem;
  background: var(--va-c-bg-alt);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem 0.85rem;
  transition: border-color 160ms ease;
}

.cook-recipe-card.is-chosen {
  border-color: var(--cook-accent-border);
  background: var(--cook-surface-tint);
}

.cook-recipe-main {
  flex: 1 1 16rem;
  min-width: 0;
}

.cook-recipe-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}

.cook-recipe-name {
  font-size: 0.94rem;
  font-weight: 700;
  color: var(--va-c-text-dark);
}

.cook-recipe-summary {
  margin: 0.3rem 0 0;
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--va-c-text-2);
}

.cook-recipe-tags {
  margin-top: 0.45rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem 0.4rem;
}

.cook-recipe-meta {
  font-size: 0.74rem;
  font-weight: 500;
  color: var(--va-c-text-2);
  font-variant-numeric: tabular-nums;
  margin-right: 0.2rem;
}

.cook-ing-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.1rem 0.42rem;
  border-radius: 999px;
  font-size: 0.72rem;
  border: 1px solid var(--yun-surface-line);
  color: var(--va-c-text-2);
  background: transparent;
}

.cook-ing-tag.is-matched {
  border-color: var(--cook-accent-border);
  background: var(--cook-accent-soft);
  color: var(--cook-accent-strong);
  font-weight: 600;
}

.cook-recipe-choose {
  flex-shrink: 0;
}

.cook-expand-row {
  margin-top: 0.65rem;
  display: flex;
  justify-content: center;
}

/* Swipe Deck */
.cook-swipe-scope {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 0.5rem;
}

.cook-swipe-hint-keys {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--va-c-text-2);
}

.cook-swipe-stage {
  position: relative;
  margin: 0.9rem auto 0;
  max-width: 26rem;
  min-height: 14.5rem;
  padding-bottom: 0.9rem;
  outline: none;
  touch-action: pan-y;
}

.cook-swipe-stage:focus-visible {
  outline: 2px solid var(--yun-focus-color);
  outline-offset: 6px;
  border-radius: 0.75rem;
}

.cook-swipe-card {
  border: 1px solid var(--yun-surface-line);
  border-radius: 0.75rem;
  background: var(--va-c-bg);
  padding: 0.95rem 1rem;
  user-select: none;
}

.cook-swipe-card.is-top {
  position: relative;
  z-index: 3;
  cursor: grab;
  box-shadow: 0 10px 28px rgb(20 20 30 / 0.08);
}

.dark .cook-swipe-card.is-top {
  background: var(--va-c-bg-light);
  box-shadow: 0 10px 28px rgb(0 0 0 / 0.35);
}

.cook-swipe-card.is-top:active {
  cursor: grabbing;
}

.cook-swipe-card.is-top.is-chosen {
  border-color: var(--cook-accent-border);
}

.cook-swipe-card.is-mid,
.cook-swipe-card.is-back {
  position: absolute;
  inset: 0 0 0.9rem;
  pointer-events: none;
  background: var(--va-c-bg-alt);
}

.cook-swipe-card.is-mid {
  z-index: 2;
  transform: translateY(7px) scale(0.97);
  opacity: 0.75;
}

.cook-swipe-card.is-back {
  z-index: 1;
  transform: translateY(14px) scale(0.94);
  opacity: 0.45;
}

.cook-swipe-badges {
  display: flex;
  justify-content: space-between;
  min-height: 1.4rem;
  margin-bottom: 0.25rem;
}

.cook-swipe-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.cook-swipe-counter {
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: var(--va-c-text-2);
}

.cook-swipe-title {
  margin: 0.55rem 0 0.3rem;
  font-family: var(--yun-post-title-font-family, var(--va-font-serif));
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--va-c-text-dark);
}

.cook-swipe-summary {
  margin: 0;
  font-size: 0.84rem;
  line-height: 1.55;
  color: var(--va-c-text);
}

.cook-swipe-tip {
  margin: 0.65rem 0 0;
  padding-top: 0.55rem;
  border-top: 1px dashed var(--yun-surface-line);
  font-size: 0.78rem;
  color: var(--va-c-text-2);
}

.cook-swipe-controls {
  margin-top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.55rem;
}

.cook-chosen-bar {
  margin-top: 0.85rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--cook-accent-border);
  border-radius: 0.5rem;
  background: var(--cook-surface-tint);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 0.75rem;
  font-size: 0.82rem;
  color: var(--va-c-text);
}

.cook-playground-foot {
  font-size: 0.78rem;
  color: var(--va-c-text-2);
}

.cook-playground-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
}

@media (prefers-reduced-motion: reduce) {
  .cook-recipe-card {
    transition: none;
  }
}
</style>
