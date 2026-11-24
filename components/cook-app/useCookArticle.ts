import type { CookFridgeItem, CookToolId } from './cookData'
import { onMounted, reactive, watch } from 'vue'
import {
  COOK_INGREDIENTS,
  COOK_SCAN_PRESETS,
  INGREDIENT_MAP,
  matchRecipes,
  RECIPE_MAP,
} from './cookData'

export interface CookVideoSeek {
  seconds: number
  label: string
  nonce: number
}

export interface CookArticleState {
  quarantineCrossed: boolean
  fridgeOffsetDays: number
  scannedCount: number
  lastScanNote: string
  selectedIngredients: string[]
  selectedTool: CookToolId | 'all'
  playgroundMode: 'pick' | 'swipe'
  fridgeSyncNames: string[]
  chosenRecipeId: string | null
  learnedRecipeIds: string[]
  videoSeek: CookVideoSeek | null
}

export const LEARNED_STORAGE_KEY = 'cook-app-learned:v1'

const state = reactive<CookArticleState>({
  quarantineCrossed: false,
  fridgeOffsetDays: 0,
  scannedCount: 0,
  lastScanNote: '',
  selectedIngredients: ['tomato', 'egg'],
  selectedTool: 'all',
  playgroundMode: 'pick',
  fridgeSyncNames: [],
  chosenRecipeId: null,
  learnedRecipeIds: [],
  videoSeek: null,
})

let storageBootstrapped = false
let flashTimer: ReturnType<typeof setTimeout> | undefined

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
    return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function initCookStorage() {
  if (storageBootstrapped || typeof window === 'undefined')
    return
  storageBootstrapped = true

  try {
    const saved = window.localStorage.getItem(LEARNED_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        state.learnedRecipeIds = parsed.filter(
          (id): id is string => typeof id === 'string' && Boolean(RECIPE_MAP[id]),
        )
      }
    }
  }
  catch {
    // Ignore storage read failures in private/restricted environments
  }

  watch(
    () => [...state.learnedRecipeIds],
    (ids) => {
      try {
        window.localStorage.setItem(LEARNED_STORAGE_KEY, JSON.stringify(ids))
      }
      catch {
        // Ignore storage write failures
      }
    },
  )
}

export function scrollToSection(id: string) {
  if (typeof document === 'undefined')
    return
  const target = document.getElementById(id)
  if (!target)
    return

  target.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  })

  if (prefersReducedMotion())
    return

  target.classList.remove('is-cook-target')
  void target.offsetWidth
  target.classList.add('is-cook-target')
  clearTimeout(flashTimer)
  flashTimer = setTimeout(() => {
    target.classList.remove('is-cook-target')
  }, 1200)
}

export function useCookArticle() {
  onMounted(() => {
    initCookStorage()
  })

  function toggleQuarantineCrossed() {
    state.quarantineCrossed = !state.quarantineCrossed
  }

  function setFridgeOffsetDays(days: number) {
    const clamped = Math.max(0, Math.min(5, Math.round(days)))
    state.fridgeOffsetDays = clamped
  }

  function scanNextPackage() {
    if (state.scannedCount >= COOK_SCAN_PRESETS.length)
      return
    const nextItem = COOK_SCAN_PRESETS[state.scannedCount]
    state.scannedCount += 1
    state.lastScanNote = nextItem.scanNote ?? ''
  }

  function resetFridge() {
    state.fridgeOffsetDays = 0
    state.scannedCount = 0
    state.lastScanNote = ''
  }

  function toggleIngredient(id: string) {
    if (!INGREDIENT_MAP[id])
      return
    const idx = state.selectedIngredients.indexOf(id)
    if (idx === -1)
      state.selectedIngredients.push(id)
    else
      state.selectedIngredients.splice(idx, 1)
  }

  function setSelectedTool(tool: CookToolId | 'all') {
    state.selectedTool = tool
  }

  function setPlaygroundMode(mode: 'pick' | 'swipe') {
    state.playgroundMode = mode
  }

  function clearIngredients() {
    state.selectedIngredients = []
    state.fridgeSyncNames = []
  }

  function pickRandomIngredients() {
    const presets: string[][] = [
      ['tomato', 'egg'],
      ['potato', 'pork', 'rice'],
      ['shrimp', 'greens'],
      ['chicken', 'mushroom', 'rice'],
      ['tomato', 'corn', 'egg'],
      ['cucumber', 'egg'],
    ]
    const currentKey = [...state.selectedIngredients].sort().join(',')
    const candidates = presets.filter(pair => [...pair].sort().join(',') !== currentKey)
    const pool = candidates.length > 0 ? candidates : presets
    const chosen = pool[Math.floor(Math.random() * pool.length)]
    if (chosen && matchRecipes(chosen).length > 0) {
      state.selectedIngredients = [...chosen]
    }
    else {
      const fallback = COOK_INGREDIENTS.slice(0, 2).map(item => item.id)
      state.selectedIngredients = fallback
    }
    state.fridgeSyncNames = []
  }

  function sendExpiringToPlayground(items: CookFridgeItem[]) {
    const ids: string[] = []
    const names: string[] = []
    for (const item of items) {
      if (item.ingredientId && INGREDIENT_MAP[item.ingredientId] && !ids.includes(item.ingredientId)) {
        ids.push(item.ingredientId)
        names.push(INGREDIENT_MAP[item.ingredientId].name)
      }
    }
    if (ids.length === 0)
      return

    state.selectedIngredients = ids
    state.selectedTool = 'all'
    state.fridgeSyncNames = names
    state.playgroundMode = 'pick'
    scrollToSection('cook-playground')
  }

  function dismissFridgeSync() {
    state.fridgeSyncNames = []
  }

  function chooseRecipe(recipeId: string) {
    if (!RECIPE_MAP[recipeId])
      return
    state.chosenRecipeId = recipeId
  }

  function markRecipeLearned(recipeId: string) {
    if (!RECIPE_MAP[recipeId])
      return
    if (!state.learnedRecipeIds.includes(recipeId))
      state.learnedRecipeIds.unshift(recipeId)
  }

  function toggleLearnedRecipe(recipeId: string) {
    if (!RECIPE_MAP[recipeId])
      return
    const idx = state.learnedRecipeIds.indexOf(recipeId)
    if (idx === -1)
      state.learnedRecipeIds.unshift(recipeId)
    else
      state.learnedRecipeIds.splice(idx, 1)
  }

  function clearLearnedRecipes() {
    state.learnedRecipeIds = []
  }

  function requestVideoSeek(seconds: number, label: string) {
    const safeSeconds = Math.max(0, Math.floor(seconds))
    state.videoSeek = {
      seconds: safeSeconds,
      label,
      nonce: (state.videoSeek?.nonce ?? 0) + 1,
    }
    scrollToSection('cook-video')
  }

  return {
    state,
    toggleQuarantineCrossed,
    setFridgeOffsetDays,
    scanNextPackage,
    resetFridge,
    toggleIngredient,
    setSelectedTool,
    setPlaygroundMode,
    clearIngredients,
    pickRandomIngredients,
    sendExpiringToPlayground,
    dismissFridgeSync,
    chooseRecipe,
    markRecipeLearned,
    toggleLearnedRecipe,
    clearLearnedRecipes,
    requestVideoSeek,
    scrollToSection,
  }
}
