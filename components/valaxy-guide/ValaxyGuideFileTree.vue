<script setup lang="ts">
import type { GuideHighlightZone } from './useGuideSite'
import { computed, nextTick, onBeforeUnmount, reactive, shallowRef } from 'vue'
import { DEFAULT_GUIDE_SITE, useGuideSite } from './useGuideSite'
import ValaxyGuideFrame from './ValaxyGuideFrame.vue'
import ValaxyGuideMiniSite from './ValaxyGuideMiniSite.vue'

type FileStage = '新手必改' | '上线前看' | '进阶扩展' | '自动维护'
type EntryIcon = 'folder' | 'markdown' | 'typescript' | 'yaml' | 'robot' | 'config'

interface TreeNode {
  id: string
  parentId?: string
  name: string
  path: string
  depth: number
  hasChildren?: boolean
  essential?: boolean
  stage: FileStage
  icon: EntryIcon
  highlightZone: GuideHighlightZone
  hexoEquivalent?: string
  summary: string
  tip: string
  example?: string
}

const nodes: TreeNode[] = [
  {
    id: 'gh-dir',
    name: '.github/',
    path: '.github/',
    depth: 0,
    hasChildren: true,
    stage: '上线前看',
    icon: 'folder',
    highlightZone: 'workflow',
    summary: '存放 GitHub 仓库自动化工作流配置的隐藏目录。',
    tip: '推上 GitHub 后，Actions 会自动读取里面的 YAML 工作流帮你打包和发布。',
  },
  {
    id: 'gh-pages',
    parentId: 'gh-dir',
    name: 'workflows/gh-pages.yml',
    path: '.github/workflows/gh-pages.yml',
    depth: 1,
    stage: '上线前看',
    icon: 'yaml',
    highlightZone: 'workflow',
    hexoEquivalent: 'Hexo: hexo-deployer-git / CI',
    summary: 'GitHub Actions 自动发布工作流。把代码推上 GitHub 后，它会安装依赖、构建并部署到 GitHub Pages。',
    tip: '如果你的源码分支不是 main / master / valaxy，记得改这里的 branches；fetch-depth: 0 也要保留以读取 Git 提交时间。',
  },
  {
    id: 'agents-md',
    name: 'AGENTS.md',
    path: 'AGENTS.md',
    depth: 0,
    stage: '进阶扩展',
    icon: 'robot',
    highlightZone: 'none',
    summary: '写给 AI 编程助手看的项目说明书，记录了目录约定、常用命令与注意事项。',
    tip: '让 Cursor、Claude Code 之类的工具帮你改博客样式或修问题时，它能先读这份说明，不容易改错文件。',
  },
  {
    id: 'components-dir',
    name: 'components/',
    path: 'components/',
    depth: 0,
    stage: '进阶扩展',
    icon: 'folder',
    highlightZone: 'post',
    summary: '自定义 Vue 组件目录。放在这里的 .vue 文件会被自动全局注册，在 Markdown 文章里直接写标签就能渲染。',
    tip: '适合给教程、笔记加交互示意图或可点击的小工具，本文里的互动示意组件就放在这个目录里。',
  },
  {
    id: 'pages-dir',
    name: 'pages/',
    path: 'pages/',
    depth: 0,
    hasChildren: true,
    essential: true,
    stage: '新手必改',
    icon: 'folder',
    highlightZone: 'post',
    hexoEquivalent: 'Hexo: source/',
    summary: '所有页面与文章的源文件目录，文件路径会直接映射为网站访问路由。',
    tip: '例如 pages/about/index.md 对应 /about，博客文章则放在 pages/posts/ 下。',
  },
  {
    id: 'hello-post',
    parentId: 'pages-dir',
    name: 'posts/hello-valaxy.md',
    path: 'pages/posts/hello-valaxy.md',
    depth: 1,
    essential: true,
    stage: '新手必改',
    icon: 'markdown',
    highlightZone: 'post',
    hexoEquivalent: 'Hexo: source/_posts',
    summary: '所有博客文章都放在 pages/posts/ 下。脚手架附带的示例文章就是它，你可以直接照着改，或者删掉换成自己的第一篇。',
    tip: '保存后首页列表和文章页都会热更新，不用重启服务器。用 pnpm exec valaxy new first-post 也能一键生成同款模板。',
    example: 'title: 你好，Valaxy！',
  },
  {
    id: 'public-dir',
    name: 'public/',
    path: 'public/',
    depth: 0,
    stage: '上线前看',
    icon: 'folder',
    highlightZone: 'none',
    hexoEquivalent: 'Hexo: source/（静态资源）',
    summary: '纯静态资源目录。构建时 Valaxy 会把这里的文件原样复制到 dist/ 根目录，不做编译处理。',
    tip: '文章插图或头像放进 public/images/avatar.jpg 后，在文章或配置里直接用 /images/avatar.jpg 引用即可。',
  },
  {
    id: 'styles-dir',
    name: 'styles/',
    path: 'styles/',
    depth: 0,
    stage: '进阶扩展',
    icon: 'folder',
    highlightZone: 'theme',
    summary: '覆盖主题默认样式的入口目录（如 index.scss / CSS 变量）。想微调字体、行高、配色时可以写在这里。',
    tip: '新手初期完全不用碰它；等你有个性化视觉想法时再动手改也不迟。',
  },
  {
    id: 'site-config',
    name: 'site.config.ts',
    path: 'site.config.ts',
    depth: 0,
    essential: true,
    stage: '新手必改',
    icon: 'typescript',
    highlightZone: 'title',
    hexoEquivalent: 'Hexo: _config.yml',
    summary: '站点基本信息配置文件，和具体主题无关：站名、副标题、作者头像、社交链接以及上线域名都在这里改。',
    tip: '上线前别忘了把占位 url: "https://example.com/" 换成你的真实域名，站点地图、RSS 和 llms.txt 都会用到它。',
    example: 'export default defineSiteConfig({ title: "我的小站" })',
  },
  {
    id: 'valaxy-config',
    name: 'valaxy.config.ts',
    path: 'valaxy.config.ts',
    depth: 0,
    essential: true,
    stage: '新手必改',
    icon: 'typescript',
    highlightZone: 'theme',
    hexoEquivalent: 'Hexo: _config.yun.yml',
    summary: '主题与框架配置。选择使用哪套主题、调整主题配色、首页竖排大字、页脚备案号以及接入评论插件都在这里。',
    tip: '带着 defineValaxyConfig<UserThemeConfig> 的类型定义，在 VS Code 里悬停字段就能看到默认值和中文注释。',
    example: 'themeConfig: { colors: { primary: "#0078E7" } }',
  },
  {
    id: 'package-json',
    name: 'package.json',
    path: 'package.json',
    depth: 0,
    stage: '自动维护',
    icon: 'config',
    highlightZone: 'none',
    summary: '项目依赖清单与常用命令脚本（dev、build、serve 等），pnpm install 会按这里列出的版本装包。',
    tip: '安装第三方评论插件（比如 valaxy-addon-waline）时，包名会自动记录进这里。',
  },
  {
    id: 'pnpm-workspace',
    name: 'pnpm-workspace.yaml',
    path: 'pnpm-workspace.yaml',
    depth: 0,
    stage: '自动维护',
    icon: 'config',
    highlightZone: 'none',
    summary: 'pnpm 工作区与依赖构建权限配置。脚手架用它显式声明允许运行构建脚本的依赖包。',
    tip: '千万不要随手删掉，否则在新版 pnpm 下安装依赖时可能出现构建脚本权限异常。',
  },
]

const iconClassMap: Record<EntryIcon, string> = {
  folder: 'i-ri-folder-line',
  markdown: 'i-ri-markdown-line',
  typescript: 'i-ri-file-code-line',
  yaml: 'i-ri-flow-chart',
  robot: 'i-ri-robot-2-line',
  config: 'i-ri-settings-3-line',
}

const { state } = useGuideSite()
const expandedDirs = reactive<Record<string, boolean>>({
  'gh-dir': true,
  'pages-dir': true,
})
const selectedId = shallowRef<string>('hello-post')
const onlyEssential = shallowRef(false)
const copiedTree = shallowRef(false)
const itemEls = reactive<Record<string, HTMLButtonElement | undefined>>({})

let copyTimer: ReturnType<typeof setTimeout> | undefined

onBeforeUnmount(() => {
  clearTimeout(copyTimer)
})

const safeProjectName = computed(() => state.projectName.trim() || DEFAULT_GUIDE_SITE.projectName)

const visibleNodes = computed(() =>
  nodes.filter((node) => {
    if (onlyEssential.value && !node.essential)
      return false
    if (node.parentId && !expandedDirs[node.parentId])
      return false
    return true
  }),
)

const selectedNode = computed(
  () => nodes.find(node => node.id === selectedId.value) ?? nodes.find(node => node.id === 'hello-post')!,
)

function stagePillClass(stage: FileStage) {
  if (stage === '新手必改')
    return 'vg-pill--green'
  if (stage === '上线前看')
    return 'vg-pill--brand'
  if (stage === '进阶扩展')
    return 'vg-pill--amber'
  return ''
}

function selectNode(node: TreeNode) {
  selectedId.value = node.id
  if (node.hasChildren)
    expandedDirs[node.id] = !expandedDirs[node.id]
}

function toggleEssential() {
  onlyEssential.value = !onlyEssential.value
  if (onlyEssential.value) {
    expandedDirs['pages-dir'] = true
    if (!selectedNode.value.essential)
      selectedId.value = 'hello-post'
  }
}

function focusById(id: string) {
  selectedId.value = id
  void nextTick(() => {
    itemEls[id]?.focus()
  })
}

function handleTreeKeydown(event: KeyboardEvent, node: TreeNode, index: number) {
  const list = visibleNodes.value
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    const next = list[index + 1]
    if (next)
      focusById(next.id)
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    const prev = list[index - 1]
    if (prev)
      focusById(prev.id)
  }
  else if (event.key === 'ArrowRight') {
    event.preventDefault()
    if (node.hasChildren) {
      if (!expandedDirs[node.id]) {
        expandedDirs[node.id] = true
      }
      else {
        const firstChild = list.find(item => item.parentId === node.id)
        if (firstChild)
          focusById(firstChild.id)
      }
    }
  }
  else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    if (node.hasChildren && expandedDirs[node.id]) {
      expandedDirs[node.id] = false
    }
    else if (node.parentId) {
      focusById(node.parentId)
    }
  }
}

const asciiTree = computed(() => `${safeProjectName.value}
├── .github/workflows/gh-pages.yml   # GitHub Actions 自动部署
├── .vscode/                         # 推荐的 VS Code 插件
├── AGENTS.md                        # 给 AI 编程助手看的说明
├── components/                      # 自定义组件（会被自动注册）
├── layouts/                         # 自定义布局
├── locales/                         # 自定义国际化文字
├── pages/                           # 所有页面和文章
│   └── posts/hello-valaxy.md        # 示例文章
├── public/                          # 静态资源（原样复制）
├── styles/                          # 覆盖主题样式
├── netlify.toml                     # Netlify 配置
├── vercel.json                      # Vercel 配置
├── site.config.ts                   # 站点信息
├── valaxy.config.ts                 # 主题与框架配置
├── package.json
└── pnpm-workspace.yaml`)

async function copyTreeText() {
  try {
    await navigator.clipboard?.writeText(asciiTree.value)
  }
  catch {
    // Ignore clipboard failure in headless/restricted contexts
  }
  copiedTree.value = true
  clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    copiedTree.value = false
  }, 1600)
}
</script>

<template>
  <ValaxyGuideFrame
    class="vg-tree"
    eyebrow="项目目录浏览器"
    :status="`${safeProjectName}/ · 选中 ${selectedNode.path}`"
    caption="点选或用方向键浏览生成后的目录，右侧同步标出这个文件影响的站点区域。"
    flush
  >
    <template #icon>
      <span class="i-ri-folder-open-line vg-head-icon" aria-hidden="true" />
    </template>

    <template #head-right>
      <button
        type="button"
        class="vg-chip"
        :class="{ 'is-active': onlyEssential }"
        :aria-pressed="onlyEssential"
        @click="toggleEssential"
      >
        <span class="i-ri-filter-3-line" aria-hidden="true" />
        <span>只看新手必改 3 项</span>
      </button>
    </template>

    <div class="vg-split vg-tree-split">
      <div class="vg-split-pane vg-tree-pane">
        <div class="vg-tree-root">
          <span class="i-ri-folder-open-line" aria-hidden="true" />
          <span>{{ safeProjectName }}/</span>
        </div>

        <div class="vg-tree-list" role="tree" aria-label="项目文件目录">
          <button
            v-for="(node, idx) in visibleNodes"
            :key="node.id"
            :ref="(el) => { if (el) itemEls[node.id] = el as HTMLButtonElement }"
            type="button"
            role="treeitem"
            class="vg-tree-row"
            :class="{
              'is-selected': node.id === selectedNode.id,
              'is-nested': node.depth > 0,
              'is-essential': node.essential,
            }"
            :aria-selected="node.id === selectedNode.id"
            :aria-expanded="node.hasChildren ? !!expandedDirs[node.id] : undefined"
            :aria-level="node.depth + 1"
            :tabindex="node.id === selectedNode.id ? 0 : -1"
            @click="selectNode(node)"
            @keydown="handleTreeKeydown($event, node, idx)"
          >
            <span v-if="node.hasChildren" class="vg-tree-chevron" aria-hidden="true">
              <span :class="expandedDirs[node.id] ? 'i-ri-arrow-down-s-line' : 'i-ri-arrow-right-s-line'" />
            </span>
            <span v-else-if="node.depth > 0" class="vg-tree-branch" aria-hidden="true" />
            <span v-else class="vg-tree-spacer" aria-hidden="true" />

            <span
              class="vg-tree-icon"
              :class="node.hasChildren && expandedDirs[node.id] ? 'i-ri-folder-open-line' : iconClassMap[node.icon]"
              aria-hidden="true"
            />
            <span class="vg-tree-name">{{ node.name }}</span>

            <span v-if="node.essential && !onlyEssential" class="vg-pill vg-pill--green vg-tree-tag">
              必改
            </span>
          </button>
        </div>
      </div>

      <div class="vg-split-pane vg-tree-right">
        <div class="vg-tree-detail" role="region" :aria-label="`${selectedNode.path} 说明`">
          <div class="vg-tree-detail-head">
            <code class="vg-tree-path">{{ selectedNode.path }}</code>
            <span class="vg-pill" :class="stagePillClass(selectedNode.stage)">
              {{ selectedNode.stage }}
            </span>
            <span v-if="selectedNode.hexoEquivalent" class="vg-pill">
              {{ selectedNode.hexoEquivalent }}
            </span>
          </div>

          <p class="vg-tree-summary">
            {{ selectedNode.summary }}
          </p>

          <p class="vg-tree-tip">
            {{ selectedNode.tip }}
          </p>

          <pre v-if="selectedNode.example" class="vg-tree-example"><code>{{ selectedNode.example }}</code></pre>
        </div>

        <div class="vg-tree-minisite-wrap">
          <ValaxyGuideMiniSite :highlight-zone="selectedNode.highlightZone" compact />
        </div>
      </div>
    </div>

    <template #actions>
      <span class="vg-tree-foot-hint">
        其余 <code>netlify.toml</code>、<code>vercel.json</code> 与 <code>Dockerfile</code> 仅作对应平台部署备用
      </span>

      <button type="button" class="vg-btn" @click="copyTreeText">
        <span :class="copiedTree ? 'i-ri-check-line' : 'i-ri-file-copy-line'" aria-hidden="true" />
        <span>{{ copiedTree ? '已复制目录文本' : '复制纯文本目录' }}</span>
      </button>
    </template>
  </ValaxyGuideFrame>
</template>

<style scoped>
.vg-head-icon {
  color: var(--va-c-link);
  font-size: 1rem;
}

.vg-tree-pane {
  padding: 0.75rem 0.65rem;
}

.vg-tree-root {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0 0.45rem 0.45rem;
  color: var(--va-c-text-dark);
  font-family: var(--va-font-mono);
  font-size: 0.8rem;
  font-weight: 600;
}

.vg-tree-list {
  display: flex;
  flex-direction: column;
  gap: 0.14rem;
}

.vg-tree-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  width: 100%;
  min-height: 2rem;
  padding: 0.25rem 0.45rem;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--va-c-text-2);
  font-family: var(--va-font-mono);
  font-size: 0.78rem;
  text-align: left;
  cursor: pointer;
  transition:
    background-color 140ms ease,
    border-color 140ms ease,
    color 140ms ease;
}

.vg-tree-row.is-nested {
  padding-left: 1.35rem;
}

.vg-tree-row:hover {
  background: var(--yun-action-btn-hover-bg);
  color: var(--va-c-text);
}

.vg-tree-row:focus-visible {
  outline: 2px solid var(--yun-focus-color);
  outline-offset: 1px;
}

.vg-tree-row.is-selected {
  border-color: color-mix(in srgb, var(--va-c-primary) 34%, var(--yun-surface-line));
  background: color-mix(in srgb, var(--va-c-primary) 10%, transparent);
  color: var(--va-c-link);
  font-weight: 600;
}

.vg-tree-chevron,
.vg-tree-spacer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 0.9rem;
  color: var(--va-c-text-3);
}

.vg-tree-branch {
  display: inline-block;
  flex: none;
  width: 0.75rem;
  height: 0.75rem;
  margin-top: -0.25rem;
  border-left: 1px solid var(--yun-surface-line);
  border-bottom: 1px solid var(--yun-surface-line);
  border-bottom-left-radius: 3px;
}

.vg-tree-icon {
  flex: none;
  font-size: 0.9rem;
  color: var(--va-c-text-3);
}

.vg-tree-row.is-selected .vg-tree-icon {
  color: var(--va-c-link);
}

.vg-tree-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vg-tree-tag {
  flex: none;
  font-family: var(--va-font-sans);
}

.vg-tree-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.vg-tree-detail {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.8rem 0.9rem;
}

.vg-tree-detail-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}

.vg-tree-path {
  color: var(--va-c-text-dark);
  font-family: var(--va-font-mono);
  font-size: 0.82rem;
  font-weight: 600;
}

.vg-tree-summary {
  margin: 0;
  color: var(--va-c-text);
  font-size: 0.84rem;
  line-height: 1.55;
}

.vg-tree-tip {
  margin: 0;
  padding-left: 0.65rem;
  border-left: 2px solid color-mix(in srgb, var(--va-c-link) 45%, var(--yun-surface-line));
  color: var(--va-c-text-2);
  font-size: 0.8rem;
  line-height: 1.5;
}

.vg-tree-example {
  margin: 0.1rem 0 0;
  padding: 0.45rem 0.65rem;
  border-radius: 4px;
  background: var(--va-code-block-bg);
  color: var(--va-c-text-dark);
  font-family: var(--va-font-mono);
  font-size: 0.76rem;
  overflow-x: auto;
}

.vg-tree-minisite-wrap {
  border-top: 1px solid var(--yun-surface-line);
}

.vg-tree-foot-hint {
  color: var(--va-c-text-2);
  font-size: 0.76rem;
}

@media (pointer: coarse) {
  .vg-tree-row {
    min-height: 44px;
  }
}
</style>
