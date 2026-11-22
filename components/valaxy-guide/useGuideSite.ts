import { computed, onMounted, reactive, watch } from 'vue'

export type GuideHighlightZone = 'none' | 'all' | 'title' | 'author' | 'banner' | 'theme' | 'post' | 'workflow'

export const ENV_TOOL_IDS = ['node', 'pnpm', 'git', 'vscode'] as const
export type EnvToolId = (typeof ENV_TOOL_IDS)[number]

export interface GuideSiteState {
  projectName: string
  siteTitle: string
  authorName: string
  primaryColor: string
  bannerEnabled: boolean
  bannerTitle: string
  postDraftTitle: string
  postSavedTitle: string
  repoName: string
  completedSteps: string[]
  envCheckedTools: string[]
}

export const DEFAULT_GUIDE_SITE: Omit<GuideSiteState, 'completedSteps' | 'envCheckedTools'> = {
  projectName: 'valaxy-blog',
  siteTitle: '我的小站',
  authorName: '你的名字',
  primaryColor: '#0078E7',
  bannerEnabled: true,
  bannerTitle: '你好，世界',
  postDraftTitle: '你好，Valaxy！',
  postSavedTitle: '你好，Valaxy！',
  repoName: 'you.github.io',
}

export const COLOR_PRESETS = [
  { name: 'Yun 蓝', value: '#0078E7' },
  { name: 'Valaxy 紫', value: '#6E44FF' },
  { name: '墨黑', value: '#000000' },
  { name: '松绿', value: '#2D8A68' },
  { name: '绯红', value: '#C45B88' },
] as const

const SESSION_KEY = 'valaxy-guide-site:v1'
const ROADMAP_KEY = 'valaxy-guide-roadmap:v1'
const ENV_KEY = 'valaxy-guide-env:v1'

const state = reactive<GuideSiteState>({
  ...DEFAULT_GUIDE_SITE,
  completedSteps: [],
  envCheckedTools: [],
})

let storageBootstrapped = false

function sanitizeRepoSlug(raw: string): string {
  const cleaned = raw.trim().replace(/^\/+|\/+$/g, '')
  return cleaned || DEFAULT_GUIDE_SITE.repoName
}

export function normalizeHex(hex: string): string {
  const trimmed = hex.trim()
  if (/^#[0-9a-f]{6}$/i.test(trimmed))
    return trimmed.toUpperCase()
  if (/^#[0-9a-f]{3}$/i.test(trimmed)) {
    const [, r, g, b] = trimmed
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase()
  }
  return DEFAULT_GUIDE_SITE.primaryColor
}

export function hexToRgb(hex: string): string {
  const full = normalizeHex(hex).slice(1)
  const r = Number.parseInt(full.slice(0, 2), 16)
  const g = Number.parseInt(full.slice(2, 4), 16)
  const b = Number.parseInt(full.slice(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
    return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function initGuideStorage() {
  if (storageBootstrapped || typeof window === 'undefined')
    return
  storageBootstrapped = true

  try {
    const savedSite = window.sessionStorage.getItem(SESSION_KEY)
    if (savedSite) {
      const parsed = JSON.parse(savedSite) as Partial<Omit<GuideSiteState, 'completedSteps' | 'envCheckedTools'>>
      if (typeof parsed.projectName === 'string' && parsed.projectName.trim())
        state.projectName = parsed.projectName
      if (typeof parsed.siteTitle === 'string')
        state.siteTitle = parsed.siteTitle
      if (typeof parsed.authorName === 'string')
        state.authorName = parsed.authorName
      if (typeof parsed.primaryColor === 'string')
        state.primaryColor = normalizeHex(parsed.primaryColor)
      if (typeof parsed.bannerEnabled === 'boolean')
        state.bannerEnabled = parsed.bannerEnabled
      if (typeof parsed.bannerTitle === 'string')
        state.bannerTitle = parsed.bannerTitle
      if (typeof parsed.postDraftTitle === 'string')
        state.postDraftTitle = parsed.postDraftTitle
      if (typeof parsed.postSavedTitle === 'string')
        state.postSavedTitle = parsed.postSavedTitle
      if (typeof parsed.repoName === 'string' && parsed.repoName.trim())
        state.repoName = parsed.repoName
    }
  }
  catch {
    // Ignore storage access failures in private/restricted environments
  }

  try {
    const savedRoadmap = window.localStorage.getItem(ROADMAP_KEY)
    if (savedRoadmap) {
      const parsed = JSON.parse(savedRoadmap)
      if (Array.isArray(parsed))
        state.completedSteps = parsed.filter((item): item is string => typeof item === 'string')
    }
  }
  catch {
    // Ignore storage access failures
  }

  try {
    const savedEnv = window.localStorage.getItem(ENV_KEY)
    if (savedEnv) {
      const parsed = JSON.parse(savedEnv)
      if (Array.isArray(parsed)) {
        state.envCheckedTools = parsed.filter(
          (item): item is string => typeof item === 'string' && ENV_TOOL_IDS.includes(item as EnvToolId),
        )
      }
    }
  }
  catch {
    // Ignore storage access failures
  }

  watch(
    () => ({
      projectName: state.projectName,
      siteTitle: state.siteTitle,
      authorName: state.authorName,
      primaryColor: state.primaryColor,
      bannerEnabled: state.bannerEnabled,
      bannerTitle: state.bannerTitle,
      postDraftTitle: state.postDraftTitle,
      postSavedTitle: state.postSavedTitle,
      repoName: state.repoName,
    }),
    (snapshot) => {
      try {
        window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(snapshot))
      }
      catch {
        // Ignore storage write errors
      }
    },
    { deep: true },
  )

  watch(
    () => [...state.completedSteps],
    (steps) => {
      try {
        window.localStorage.setItem(ROADMAP_KEY, JSON.stringify(steps))
      }
      catch {
        // Ignore storage write errors
      }
    },
  )

  watch(
    () => [...state.envCheckedTools],
    (tools) => {
      try {
        window.localStorage.setItem(ENV_KEY, JSON.stringify(tools))
      }
      catch {
        // Ignore storage write errors
      }
    },
  )
}

export function useGuideSite() {
  onMounted(() => {
    initGuideStorage()
  })

  const normalizedRepo = computed(() => sanitizeRepoSlug(state.repoName))
  const isRootRepo = computed(() => /\.github\.io$/i.test(normalizedRepo.value))
  const basePath = computed(() => (isRootRepo.value ? '/' : `/${normalizedRepo.value}/`))
  const siteUrl = computed(() =>
    isRootRepo.value
      ? `https://${normalizedRepo.value}/`
      : `https://you.github.io/${normalizedRepo.value}/`,
  )
  const primaryRgb = computed(() => hexToRgb(state.primaryColor))

  function syncEnvCompletion() {
    const allReady = ENV_TOOL_IDS.every(id => state.envCheckedTools.includes(id))
    const envIndex = state.completedSteps.indexOf('env')
    if (allReady && envIndex === -1)
      state.completedSteps.push('env')
    else if (!allReady && envIndex !== -1)
      state.completedSteps.splice(envIndex, 1)
  }

  function toggleEnvTool(toolId: string) {
    const idx = state.envCheckedTools.indexOf(toolId)
    if (idx === -1)
      state.envCheckedTools.push(toolId)
    else
      state.envCheckedTools.splice(idx, 1)
    syncEnvCompletion()
  }

  function setAllEnvTools(checked: boolean) {
    state.envCheckedTools = checked ? [...ENV_TOOL_IDS] : []
    syncEnvCompletion()
  }

  function toggleStepCompleted(stepId: string) {
    const idx = state.completedSteps.indexOf(stepId)
    if (idx === -1)
      state.completedSteps.push(stepId)
    else
      state.completedSteps.splice(idx, 1)
  }

  function resetSiteConfig() {
    state.siteTitle = DEFAULT_GUIDE_SITE.siteTitle
    state.authorName = DEFAULT_GUIDE_SITE.authorName
    state.primaryColor = DEFAULT_GUIDE_SITE.primaryColor
    state.bannerEnabled = DEFAULT_GUIDE_SITE.bannerEnabled
    state.bannerTitle = DEFAULT_GUIDE_SITE.bannerTitle
  }

  function resetAllSiteState() {
    Object.assign(state, {
      ...DEFAULT_GUIDE_SITE,
      completedSteps: [...state.completedSteps],
      envCheckedTools: [...state.envCheckedTools],
    })
  }

  return {
    state,
    normalizedRepo,
    isRootRepo,
    basePath,
    siteUrl,
    primaryRgb,
    toggleEnvTool,
    setAllEnvTools,
    toggleStepCompleted,
    resetSiteConfig,
    resetAllSiteState,
  }
}
