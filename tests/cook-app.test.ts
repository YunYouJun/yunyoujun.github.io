import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test
import test from 'node:test'
import {
  COOK_DEFAULT_LEARNED_CANDIDATES,
  COOK_FRIDGE_DEFAULTS,
  COOK_INGREDIENTS,
  COOK_RECIPES,
  COOK_SCAN_PRESETS,
  COOK_TOOLS,
  COOK_VIDEO_CHAPTERS,
  formatChapterTime,
  getFridgeItemStatus,
  INGREDIENT_MAP,
  matchRecipes,
  RECIPE_MAP,
  TOOL_MAP,
} from '../components/cook-app/cookData.ts'

test('cook-app curated dataset has valid references and coverage', () => {
  assert.equal(COOK_INGREDIENTS.length, 12)
  assert.equal(COOK_TOOLS.length, 4)
  assert.equal(COOK_RECIPES.length, 18)
  assert.equal(COOK_FRIDGE_DEFAULTS.length, 5)
  assert.equal(COOK_SCAN_PRESETS.length, 3)
  assert.equal(COOK_VIDEO_CHAPTERS.length, 8)

  for (const recipe of COOK_RECIPES) {
    assert.ok(TOOL_MAP[recipe.tool], `Missing tool for ${recipe.id}`)
    assert.ok(recipe.ingredients.length > 0, `Empty ingredients for ${recipe.id}`)
    for (const ingId of recipe.ingredients)
      assert.ok(INGREDIENT_MAP[ingId], `Unknown ingredient ${ingId} in ${recipe.id}`)
  }

  for (const item of [...COOK_FRIDGE_DEFAULTS, ...COOK_SCAN_PRESETS]) {
    if (item.ingredientId)
      assert.ok(INGREDIENT_MAP[item.ingredientId], `Unknown fridge ingredient ${item.ingredientId}`)
  }

  for (const id of COOK_DEFAULT_LEARNED_CANDIDATES)
    assert.ok(RECIPE_MAP[id], `Unknown default learned candidate ${id}`)
})

test('matchRecipes prioritizes exact matches, counts matched ingredients, and filters by utensil', () => {
  const tomatoEgg = matchRecipes(['tomato', 'egg'], 'all')
  assert.ok(tomatoEgg.length > 0)
  assert.equal(tomatoEgg[0].recipe.id, 'tomato-egg')
  assert.equal(tomatoEgg[0].exact, true)

  const partial = matchRecipes(['tomato', 'egg'], 'pot')
  assert.ok(partial.every(item => item.recipe.tool === 'pot'))
  assert.ok(partial.some(item => item.recipe.id === 'tomato-egg-noodle' && !item.exact))

  const allFallback = matchRecipes([], 'air-fryer')
  assert.equal(allFallback.length, 2)
  assert.ok(allFallback.every(item => item.recipe.tool === 'air-fryer'))
})

test('getFridgeItemStatus and formatChapterTime compute deterministic boundaries', () => {
  const fresh = getFridgeItemStatus(5, 1, 5)
  assert.equal(fresh.status, 'fresh')
  assert.equal(fresh.effectiveDays, 4)
  assert.equal(fresh.daysText, '剩 4 天')

  const expiring = getFridgeItemStatus(2, 0, 5)
  assert.equal(expiring.status, 'expiring')
  assert.equal(expiring.daysText, '剩 2 天')

  const today = getFridgeItemStatus(2, 2, 5)
  assert.equal(today.status, 'expired')
  assert.equal(today.daysText, '今天吃完')

  const overdue = getFridgeItemStatus(1, 3, 3)
  assert.equal(overdue.status, 'expired')
  assert.equal(overdue.daysText, '已超期 2 天')

  assert.equal(formatChapterTime(0), '00:00')
  assert.equal(formatChapterTime(86), '01:26')
  assert.equal(formatChapterTime(136), '02:16')
})
