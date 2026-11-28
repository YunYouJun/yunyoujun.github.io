<script setup lang="ts">
import { computed, nextTick, shallowRef } from 'vue'
import '../../styles/valaxy-guide.scss'

interface TechItem {
  id: string
  name: string
  role: string
  detail: string
  iconClass?: string
  logoSrc?: string
}

const logoUrl = `${import.meta.env.BASE_URL}images/valaxy-guide/valaxy-logo.png`

const stackItems: TechItem[] = [
  {
    id: 'valaxy',
    name: 'Valaxy',
    role: '静态博客框架',
    detail: '基于 Vue 3 与 Vite 的静态站点生成器，兼容 Hexo 习惯并自带 Yun 等主题与 AI 协作能力。',
    logoSrc: logoUrl,
  },
  {
    id: 'vite',
    name: 'Vite',
    role: '构建与热更新引擎',
    detail: '开发时无需全站重编译，修改 Markdown 或配置文件保存后浏览器毫秒级局部更新。',
    iconClass: 'i-logos-vitejs',
  },
  {
    id: 'vue',
    name: 'Vue 3',
    role: '交互组件体系',
    detail: 'theme-yun 与自定义 components/ 都由 Vue 驱动，本文的所有互动控件也是直接写在 Markdown 里的。',
    iconClass: 'i-logos-vue',
  },
  {
    id: 'unocss',
    name: 'UnoCSS',
    role: '原子化样式引擎',
    detail: '按需生成 rounded、bg-blue 等工具类与图标字体，在文章或自定义组件里都能直接写。',
    iconClass: 'i-logos-unocss',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    role: '配置文件类型提示',
    detail: '让 site.config.ts 与 valaxy.config.ts 自带字段说明、自动补全与拼写检查，比 YAML 更稳。',
    iconClass: 'i-logos-typescript-icon',
  },
  {
    id: 'github-pages',
    name: 'GitHub Pages',
    role: '免费托管与 CI',
    detail: '把源码推上 GitHub 后由官方 Actions 自动构建 dist/ 并部署，免服务器运维。',
    iconClass: 'i-simple-icons-github',
  },
  {
    id: 'mcp',
    name: 'MCP',
    role: 'AI 只读巡检接口',
    detail: '在 pnpm dev 期间向本地编程助手开放只读工具，检查文章路由、布局和失效链接。',
    iconClass: 'i-simple-icons-modelcontextprotocol',
  },
]

const activeId = shallowRef<string>('valaxy')
const tabEls = shallowRef<HTMLButtonElement[]>([])

const activeItem = computed(
  () => stackItems.find(item => item.id === activeId.value) ?? stackItems[0],
)

function focusIndex(nextIndex: number) {
  activeId.value = stackItems[nextIndex].id
  void nextTick(() => {
    tabEls.value[nextIndex]?.focus()
  })
}

function handleKeydown(event: KeyboardEvent, index: number) {
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    focusIndex((index + 1) % stackItems.length)
  }
  else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    focusIndex((index - 1 + stackItems.length) % stackItems.length)
  }
  else if (event.key === 'Home') {
    event.preventDefault()
    focusIndex(0)
  }
  else if (event.key === 'End') {
    event.preventDefault()
    focusIndex(stackItems.length - 1)
  }
}
</script>

<template>
  <div class="vg-stack not-prose" aria-label="本文涉及的技术栈">
    <div class="vg-stack-pills" role="tablist" aria-label="技术栈徽标">
      <button
        v-for="(item, idx) in stackItems"
        :key="item.id"
        :ref="(el) => { if (el) tabEls[idx] = el as HTMLButtonElement }"
        type="button"
        role="tab"
        class="vg-chip vg-stack-pill"
        :class="{ 'is-active': item.id === activeId }"
        :aria-selected="item.id === activeId"
        :tabindex="item.id === activeId ? 0 : -1"
        @click="activeId = item.id"
        @keydown="handleKeydown($event, idx)"
      >
        <img
          v-if="item.logoSrc"
          :src="item.logoSrc"
          alt=""
          width="15"
          height="15"
          class="vg-stack-img"
        >
        <span v-else class="vg-stack-icon" :class="item.iconClass" aria-hidden="true" />
        <span>{{ item.name }}</span>
      </button>
    </div>

    <div class="vg-stack-note" role="tabpanel">
      <strong class="vg-stack-role">{{ activeItem.name }} · {{ activeItem.role }}</strong>
      <span class="vg-stack-detail">{{ activeItem.detail }}</span>
    </div>
  </div>
</template>

<style scoped>
.vg-stack {
  box-sizing: border-box;
  margin: 1rem 0 1.4rem;
  padding: 0.72rem 0.85rem;
  border: 1px solid var(--yun-surface-line);
  border-radius: var(--va-card-border-radius, 0.5rem);
  background: transparent;
}

.vg-stack *,
.vg-stack *::before,
.vg-stack *::after {
  box-sizing: border-box;
}

.vg-stack-pills {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.42rem;
}

.vg-stack-pill {
  min-height: 2rem;
  padding: 0.22rem 0.68rem;
  gap: 0.4rem;
}

.vg-stack-img {
  display: block;
  flex: none;
  width: 0.95rem;
  height: 0.95rem;
  margin: 0;
  border-radius: 0;
  box-shadow: none;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
}

.vg-stack-icon {
  flex: none;
  font-size: 0.96rem;
  color: var(--va-c-text-dark);
}

.vg-stack-note {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 0.55rem;
  margin-top: 0.6rem;
  padding-top: 0.55rem;
  border-top: 1px dashed var(--yun-surface-line);
  font-size: 0.8125rem;
  line-height: 1.55;
}

.vg-stack-role {
  flex: none;
  color: var(--va-c-link);
  font-weight: 600;
}

.vg-stack-detail {
  color: var(--va-c-text-2);
}

@media (pointer: coarse) {
  .vg-stack-pill {
    min-height: 44px;
  }
}
</style>
