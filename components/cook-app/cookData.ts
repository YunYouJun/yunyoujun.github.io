export type CookIngredientCategory = 'veg' | 'protein' | 'staple'

export type CookToolId = 'wok' | 'rice-cooker' | 'air-fryer' | 'pot'

export interface CookIngredient {
  id: string
  name: string
  emoji: string
  category: CookIngredientCategory
}

export interface CookTool {
  id: CookToolId
  name: string
}

export interface CookRecipe {
  id: string
  name: string
  ingredients: string[]
  tool: CookToolId
  minutes: number
  summary: string
  tip: string
}

export interface CookFridgeItem {
  id: string
  name: string
  emoji: string
  storage: string
  remainingDays: number
  shelfLifeDays: number
  ingredientId?: string
  scanNote?: string
}

export type CookFridgeStatus = 'fresh' | 'expiring' | 'expired'

export interface CookChapter {
  seconds: number
  title: string
  sectionId?: string
  sectionLabel?: string
}

export interface CookRecipeMatch {
  recipe: CookRecipe
  matchedIds: string[]
  missingIds: string[]
  exact: boolean
  score: number
}

export const COOK_INGREDIENTS: CookIngredient[] = [
  { id: 'tomato', name: '番茄', emoji: '🍅', category: 'veg' },
  { id: 'egg', name: '鸡蛋', emoji: '🥚', category: 'protein' },
  { id: 'potato', name: '土豆', emoji: '🥔', category: 'veg' },
  { id: 'greens', name: '小青菜', emoji: '🥬', category: 'veg' },
  { id: 'mushroom', name: '香菇', emoji: '🍄', category: 'veg' },
  { id: 'pork', name: '五花肉', emoji: '🥩', category: 'protein' },
  { id: 'chicken', name: '鸡翅', emoji: '🍗', category: 'protein' },
  { id: 'shrimp', name: '鲜虾仁', emoji: '🦐', category: 'protein' },
  { id: 'cucumber', name: '黄瓜', emoji: '🥒', category: 'veg' },
  { id: 'corn', name: '玉米', emoji: '🌽', category: 'veg' },
  { id: 'rice', name: '米饭', emoji: '🍚', category: 'staple' },
  { id: 'noodle', name: '挂面', emoji: '🍜', category: 'staple' },
]

export const COOK_TOOLS: CookTool[] = [
  { id: 'wok', name: '炒锅' },
  { id: 'rice-cooker', name: '电饭煲' },
  { id: 'air-fryer', name: '空气炸锅' },
  { id: 'pot', name: '汤锅 / 蒸锅' },
]

export const COOK_FRIDGE_DEFAULTS: CookFridgeItem[] = [
  {
    id: 'greens',
    name: '小青菜',
    emoji: '🥬',
    storage: '冷藏蔬果格',
    remainingDays: 1,
    shelfLifeDays: 3,
    ingredientId: 'greens',
  },
  {
    id: 'tomato',
    name: '番茄',
    emoji: '🍅',
    storage: '冷藏室',
    remainingDays: 2,
    shelfLifeDays: 5,
    ingredientId: 'tomato',
  },
  {
    id: 'shrimp',
    name: '鲜虾仁',
    emoji: '🦐',
    storage: '微冻室',
    remainingDays: 2,
    shelfLifeDays: 3,
    ingredientId: 'shrimp',
  },
  {
    id: 'egg',
    name: '鲜鸡蛋',
    emoji: '🥚',
    storage: '门架蛋托',
    remainingDays: 9,
    shelfLifeDays: 14,
    ingredientId: 'egg',
  },
  {
    id: 'potato',
    name: '土豆',
    emoji: '🥔',
    storage: '蔬果格',
    remainingDays: 12,
    shelfLifeDays: 21,
    ingredientId: 'potato',
  },
]

export const COOK_SCAN_PRESETS: CookFridgeItem[] = [
  {
    id: 'scanned-chicken',
    name: '冰鲜鸡翅',
    emoji: '🍗',
    storage: '冷藏肉禽格',
    remainingDays: 2,
    shelfLifeDays: 4,
    ingredientId: 'chicken',
    scanNote: '包装标注：2 天前生产 · 保质期 4 天 → 自动算出剩 2 天',
  },
  {
    id: 'scanned-mushroom',
    name: '盒装鲜香菇',
    emoji: '🍄',
    storage: '冷藏蔬果格',
    remainingDays: 3,
    shelfLifeDays: 5,
    ingredientId: 'mushroom',
    scanNote: '包装标注：2 天前生产 · 保质期 5 天 → 自动算出剩 3 天',
  },
  {
    id: 'scanned-pork',
    name: '盒装五花肉',
    emoji: '🥩',
    storage: '微冻室',
    remainingDays: 2,
    shelfLifeDays: 3,
    ingredientId: 'pork',
    scanNote: '包装标注：1 天前生产 · 保质期 3 天 → 自动算出剩 2 天',
  },
]

export const COOK_RECIPES: CookRecipe[] = [
  {
    id: 'tomato-egg',
    name: '番茄炒蛋',
    ingredients: ['tomato', 'egg'],
    tool: 'wok',
    minutes: 10,
    summary: '鸡蛋先滑炒盛出，番茄炒出沙后再合炒收汁，拌饭最稳的一道热菜。',
    tip: '起锅前加一小撮白糖提鲜，酸甜感会柔和很多。',
  },
  {
    id: 'tomato-egg-noodle',
    name: '番茄鸡蛋面',
    ingredients: ['tomato', 'egg', 'noodle'],
    tool: 'pot',
    minutes: 12,
    summary: '先炒出浓稠番茄汤底，加水煮沸下面，最后淋蛋液滚一圈即可。',
    tip: '面条快熟时再下蛋液，汤底清亮不浑。',
  },
  {
    id: 'garlic-greens',
    name: '清炒蒜蓉青菜',
    ingredients: ['greens'],
    tool: 'wok',
    minutes: 6,
    summary: '大火热油爆香蒜末，青菜先下菜梗翻炒，再放菜叶断生出锅。',
    tip: '临期小青菜尽量用大火快炒，3 分钟内保持脆嫩。',
  },
  {
    id: 'shrimp-greens',
    name: '虾仁炒青菜',
    ingredients: ['shrimp', 'greens'],
    tool: 'wok',
    minutes: 10,
    summary: '虾仁抓少许料酒去腥，先炒变色再下青菜同炒，清淡又有蛋白。',
    tip: '微冻虾仁化冻后用厨房纸吸干水分，下锅更易锁鲜。',
  },
  {
    id: 'tomato-shrimp-egg',
    name: '番茄虾仁滑蛋',
    ingredients: ['tomato', 'shrimp', 'egg'],
    tool: 'wok',
    minutes: 12,
    summary: '番茄炒软出汁，铺入烫熟虾仁和蛋液小火推匀，滑嫩下饭。',
    tip: '蛋液里加一勺清水，滑蛋不容易老。',
  },
  {
    id: 'steamed-shrimp-egg',
    name: '虾仁蒸蛋',
    ingredients: ['shrimp', 'egg'],
    tool: 'pot',
    minutes: 15,
    summary: '蛋液按 1:1.5 兑温水过筛，盖盘中火蒸 8 分钟，摆上虾仁再焖熟。',
    tip: '用温水兑蛋液并撇去浮沫，蛋羹就会像布丁一样平滑。',
  },
  {
    id: 'greens-mushroom-noodle',
    name: '青菜香菇炒面',
    ingredients: ['greens', 'mushroom', 'noodle'],
    tool: 'wok',
    minutes: 15,
    summary: '挂面煮七分熟过凉，与香菇片、青菜一起大火拌炒，两勺生抽收香。',
    tip: '香菇切片先煸出水分，香味才会彻底渗进面条里。',
  },
  {
    id: 'cola-wings',
    name: '可乐鸡翅',
    ingredients: ['chicken'],
    tool: 'wok',
    minutes: 20,
    summary: '鸡翅划两刀煎到两面微焦，倒半罐可乐和生抽加盖焖煮收汁。',
    tip: '最后几分钟开盖转大火，糖浆挂汁更亮。',
  },
  {
    id: 'airfryer-wings',
    name: '空气炸锅蒜香鸡翅',
    ingredients: ['chicken'],
    tool: 'air-fryer',
    minutes: 18,
    summary: '鸡翅抓盐、黑胡椒与蒜末腌一刻钟，180°C 烤 16 分钟中途翻面。',
    tip: '鸡皮朝下先烤，最后翻面逼油，外皮酥脆不腻。',
  },
  {
    id: 'chicken-mushroom-rice',
    name: '香菇鸡翅焖饭',
    ingredients: ['chicken', 'mushroom', 'rice'],
    tool: 'rice-cooker',
    minutes: 30,
    summary: '大米淘好放少许生抽老抽，铺上香菇与鸡翅按下煮饭键，一锅全熟。',
    tip: '水量比平时焖白米饭略少一指节，香菇会自己出汁。',
  },
  {
    id: 'potato-pork-rice',
    name: '土豆五花肉焖饭',
    ingredients: ['potato', 'pork', 'rice'],
    tool: 'rice-cooker',
    minutes: 30,
    summary: '五花肉煸出油脂炒香土豆块，连米入电饭煲一次焖出油润米香。',
    tip: '土豆切 1.5 厘米见方的小块，焖完刚好绵软不散。',
  },
  {
    id: 'airfryer-potato',
    name: '空气炸锅烤薯角',
    ingredients: ['potato'],
    tool: 'air-fryer',
    minutes: 20,
    summary: '土豆切月牙角拌少许食用油、盐和辣椒粉，200°C 烤 18 分钟。',
    tip: '提前焯水 2 分钟晾干再烤，外酥里糯像现炸。',
  },
  {
    id: 'sour-spicy-potato',
    name: '酸辣土豆丝',
    ingredients: ['potato'],
    tool: 'wok',
    minutes: 12,
    summary: '土豆切细丝淘去淀粉，干辣椒蒜末爆香后大火快炒，沿锅边烹入米醋。',
    tip: '出锅前再来一圈香醋，酸香更足而且土豆丝保持爽脆。',
  },
  {
    id: 'tomato-potato-pork',
    name: '番茄土豆焖五花肉',
    ingredients: ['tomato', 'potato', 'pork'],
    tool: 'pot',
    minutes: 35,
    summary: '五花肉煸香后加番茄炒出红汤，放土豆块中小火咕嘟到汤汁浓稠。',
    tip: '番茄去皮切碎更容易融进浓汤里，土豆吸满汤汁特别下饭。',
  },
  {
    id: 'pork-mushroom-greens',
    name: '五花肉炒香菇青菜',
    ingredients: ['pork', 'mushroom', 'greens'],
    tool: 'wok',
    minutes: 15,
    summary: '先煸出五花肉的猪油，用肉香把香菇炒软，最后投青菜旺火合炒。',
    tip: '不用额外多放油，五花肉本身的油脂就够香了。',
  },
  {
    id: 'cucumber-egg',
    name: '黄瓜炒鸡蛋',
    ingredients: ['cucumber', 'egg'],
    tool: 'wok',
    minutes: 8,
    summary: '鸡蛋炒散盛出，黄瓜切片大火断生后合炒调味，清爽解腻的快手菜。',
    tip: '黄瓜斜切薄片，下锅翻几下就出锅，口感最清甜。',
  },
  {
    id: 'corn-shrimp-rice',
    name: '玉米虾仁蛋炒饭',
    ingredients: ['corn', 'shrimp', 'egg', 'rice'],
    tool: 'wok',
    minutes: 12,
    summary: '蛋液裹住隔夜米饭炒散，拌入脆甜玉米粒和弹嫩虾仁，色香味都齐。',
    tip: '冷藏隔夜饭粒更分明，小火炒散后再转大火出锅气。',
  },
  {
    id: 'tomato-corn-soup',
    name: '番茄玉米蛋花汤',
    ingredients: ['tomato', 'corn', 'egg'],
    tool: 'pot',
    minutes: 12,
    summary: '番茄炒软加水与玉米粒煮沸，细细淋入蛋液关火，清甜暖胃的一碗汤。',
    tip: '汤沸后转小火呈螺旋淋入蛋液，静置几秒再轻搅，蛋花像云朵一样散开。',
  },
]

export const COOK_DEFAULT_LEARNED_CANDIDATES = [
  'tomato-egg',
  'cola-wings',
  'potato-pork-rice',
  'garlic-greens',
  'tomato-egg-noodle',
] as const

export const COOK_VIDEO_CHAPTERS: CookChapter[] = [
  { seconds: 0, title: '从「隔离食用手册」到 620 万次请求', sectionId: 'cook-origin', sectionLabel: '缘起' },
  { seconds: 31, title: '去掉「隔离」与「云食册」的命名来历', sectionId: 'cook-origin', sectionLabel: '改名' },
  { seconds: 45, title: '点选食材 / 说句话找菜、887 道本地菜谱与横向滑卡随机抽签', sectionId: 'cook-playground', sectionLabel: '试玩' },
  { seconds: 60, title: '冰箱离线扫包装算保质期（AI 拍照入库与帮找菜正在大模型备案审批中）', sectionId: 'cook-fridge', sectionLabel: '冰箱' },
  { seconds: 73, title: 'iPad 分栏厨房工作台、折叠屏适配与 iCloud 云同步' },
  { seconds: 86, title: '不设打卡与排行榜：用「今天学会了」解锁 3D 软陶小菜徽章', sectionId: 'cook-learned', sectionLabel: '记录' },
  { seconds: 111, title: '四年之后的一顿热乎饭 & 开源与内测入口' },
  { seconds: 136, title: '片尾彩蛋' },
]

export const INGREDIENT_MAP: Record<string, CookIngredient> = Object.fromEntries(
  COOK_INGREDIENTS.map(item => [item.id, item]),
)

export const TOOL_MAP: Record<CookToolId, CookTool> = Object.fromEntries(
  COOK_TOOLS.map(item => [item.id, item]),
) as Record<CookToolId, CookTool>

export const RECIPE_MAP: Record<string, CookRecipe> = Object.fromEntries(
  COOK_RECIPES.map(item => [item.id, item]),
)

export function getFridgeItemStatus(remainingDays: number, offsetDays: number, shelfLifeDays = 7): {
  effectiveDays: number
  status: CookFridgeStatus
  ratio: number
  label: string
  daysText: string
} {
  const effectiveDays = remainingDays - offsetDays
  const safeShelf = Math.max(1, shelfLifeDays)
  const ratio = Math.max(0, Math.min(1, effectiveDays / safeShelf))

  let status: CookFridgeStatus = 'fresh'
  let label = '状态新鲜'
  if (effectiveDays <= 0) {
    status = 'expired'
    label = '建议尽快处理'
  }
  else if (effectiveDays <= 2) {
    status = 'expiring'
    label = '临期优先'
  }

  let daysText = `剩 ${effectiveDays} 天`
  if (effectiveDays === 0)
    daysText = '今天吃完'
  else if (effectiveDays < 0)
    daysText = `已超期 ${Math.abs(effectiveDays)} 天`

  return {
    effectiveDays,
    status,
    ratio,
    label,
    daysText,
  }
}

export function matchRecipes(
  selectedIngredientIds: string[],
  selectedTool: CookToolId | 'all' = 'all',
): CookRecipeMatch[] {
  const selectedSet = new Set(selectedIngredientIds)
  const pool = selectedTool === 'all'
    ? COOK_RECIPES
    : COOK_RECIPES.filter(recipe => recipe.tool === selectedTool)

  if (selectedSet.size === 0) {
    return pool.map(recipe => ({
      recipe,
      matchedIds: [],
      missingIds: [...recipe.ingredients],
      exact: false,
      score: 0,
    }))
  }

  const matches: CookRecipeMatch[] = []
  for (const recipe of pool) {
    const matchedIds = recipe.ingredients.filter(id => selectedSet.has(id))
    if (matchedIds.length === 0)
      continue
    const missingIds = recipe.ingredients.filter(id => !selectedSet.has(id))
    const exact = missingIds.length === 0
    const score = (exact ? 1000 : 0) + matchedIds.length * 100 - missingIds.length * 10 - recipe.minutes * 0.1
    matches.push({
      recipe,
      matchedIds,
      missingIds,
      exact,
      score,
    })
  }

  matches.sort((a, b) => {
    if (a.exact !== b.exact)
      return a.exact ? -1 : 1
    if (a.matchedIds.length !== b.matchedIds.length)
      return b.matchedIds.length - a.matchedIds.length
    if (a.missingIds.length !== b.missingIds.length)
      return a.missingIds.length - b.missingIds.length
    return a.recipe.minutes - b.recipe.minutes
  })

  return matches
}

export function formatChapterTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds))
  const mins = Math.floor(safe / 60)
  const secs = safe % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}
