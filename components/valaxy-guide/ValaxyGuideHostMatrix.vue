<script setup lang="ts">
import { computed, nextTick, shallowRef } from 'vue'
import ValaxyGuideFrame from './ValaxyGuideFrame.vue'

interface HostPlatform {
  id: 'netlify' | 'vercel' | 'cloudflare' | 'github'
  name: string
  iconClass: string
  configFile: string
  buildCmd: string
  outDir: string
  steps: string[]
  note: string
}

const platforms: HostPlatform[] = [
  {
    id: 'netlify',
    name: 'Netlify',
    iconClass: 'i-logos-netlify-icon',
    configFile: 'netlify.toml（脚手架已内置）',
    buildCmd: 'pnpm run build',
    outDir: 'dist',
    steps: [
      '登录 Netlify，选择 Import from Git 连接你的 GitHub 仓库。',
      '仓库根目录已带 netlify.toml，Netlify 会自动填入构建命令与发布目录。',
      '确认部署；后续每次推送代码都会自动触发构建。',
    ],
    note: '省心零配置，适合不想自己在后台逐栏填写构建参数的新手。',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    iconClass: 'i-simple-icons-vercel',
    configFile: 'vercel.json（已开启 cleanUrls）',
    buildCmd: 'pnpm build',
    outDir: 'dist',
    steps: [
      '在 Vercel 点击 Add New... -> Project，选择仓库后点 Import。',
      '将 Framework Preset 设为 Other，Output Directory 设为 dist。',
      '点击 Deploy，借助内置的 vercel.json 即可获得不带 .html 的干净 URL。',
    ],
    note: '构建速度快、自带预览部署链接，配合 cleanUrls 观感很好。',
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Pages',
    iconClass: 'i-logos-cloudflare-icon',
    configFile: '控制台填写参数即可',
    buildCmd: 'pnpm build',
    outDir: 'dist',
    steps: [
      '在 Cloudflare 控制台进入「Workers 和 Pages」，创建项目并连接 Git 仓库。',
      '选择要部署的源码分支，将构建命令设为 pnpm build。',
      '将构建输出目录设为 dist，保存并完成首次部署。',
    ],
    note: '全球边缘节点分发，免费额度宽裕，对个人博客很友好。',
  },
  {
    id: 'github',
    name: 'GitHub Pages',
    iconClass: 'i-simple-icons-github',
    configFile: '.github/workflows/gh-pages.yml',
    buildCmd: 'pnpm run build',
    outDir: 'dist',
    steps: [
      '进入仓库 Settings -> Pages，把 Source 设为 GitHub Actions。',
      '如使用子路径仓库（非 用户名.github.io），需在 valaxy.config.ts 配置 vite.base。',
      '把源码推送到 main / master / valaxy 分支后自动打包并上线。',
    ],
    note: '无需绑定第三方平台账号，代码和网站托管都在同一个 GitHub 仓库里。',
  },
]

const activeId = shallowRef<HostPlatform['id']>('netlify')
const tabEls = shallowRef<HTMLButtonElement[]>([])

const activePlatform = computed(
  () => platforms.find(item => item.id === activeId.value) ?? platforms[0],
)

function focusIndex(nextIndex: number) {
  activeId.value = platforms[nextIndex].id
  void nextTick(() => {
    tabEls.value[nextIndex]?.focus()
  })
}

function handleTabKeydown(event: KeyboardEvent, index: number) {
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    focusIndex((index + 1) % platforms.length)
  }
  else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    focusIndex((index - 1 + platforms.length) % platforms.length)
  }
  else if (event.key === 'Home') {
    event.preventDefault()
    focusIndex(0)
  }
  else if (event.key === 'End') {
    event.preventDefault()
    focusIndex(platforms.length - 1)
  }
}
</script>

<template>
  <ValaxyGuideFrame
    class="vg-hosts"
    eyebrow="静态托管平台对照"
    status="构建命令 pnpm build · 输出 dist"
    caption="几个免费平台只要在「连接仓库后」填好构建命令与输出目录即可上线。"
    flush
  >
    <template #icon>
      <span class="i-ri-cloud-line vg-head-icon" aria-hidden="true" />
    </template>

    <div class="vg-code-tabs">
      <div class="vg-code-tablist" role="tablist" aria-label="选择托管平台">
        <button
          v-for="(item, idx) in platforms"
          :key="item.id"
          :ref="(el) => { if (el) tabEls[idx] = el as HTMLButtonElement }"
          type="button"
          role="tab"
          class="vg-tab vg-host-tab"
          :class="{ 'is-active': item.id === activeId }"
          :aria-selected="item.id === activeId"
          :tabindex="item.id === activeId ? 0 : -1"
          @click="activeId = item.id"
          @keydown="handleTabKeydown($event, idx)"
        >
          <span class="vg-host-logo" :class="item.iconClass" aria-hidden="true" />
          <span>{{ item.name }}</span>
        </button>
      </div>
    </div>

    <div class="vg-host-panel" role="tabpanel">
      <div class="vg-host-meta">
        <div class="vg-host-meta-item">
          <span class="vg-host-meta-label">配置文件</span>
          <code class="vg-code-inline">{{ activePlatform.configFile }}</code>
        </div>
        <div class="vg-host-meta-item">
          <span class="vg-host-meta-label">构建命令</span>
          <code class="vg-code-inline">{{ activePlatform.buildCmd }}</code>
        </div>
        <div class="vg-host-meta-item">
          <span class="vg-host-meta-label">输出目录</span>
          <code class="vg-code-inline">{{ activePlatform.outDir }}</code>
        </div>
      </div>

      <ol class="vg-host-steps">
        <li v-for="(step, idx) in activePlatform.steps" :key="idx">
          {{ step }}
        </li>
      </ol>

      <p class="vg-host-note">
        {{ activePlatform.note }}
      </p>
    </div>

    <template #actions>
      <span class="vg-host-foot">
        换到 Render、Nginx 或 Docker 自托管时，同样只需要交付 <code>pnpm build</code> 输出的 <code>dist/</code>
      </span>

      <a
        class="vg-btn"
        href="https://valaxy.site/zh/guide/deploy"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>完整部署文档</span>
        <span class="i-ri-external-link-line" aria-hidden="true" />
      </a>
    </template>
  </ValaxyGuideFrame>
</template>

<style scoped>
.vg-head-icon {
  color: var(--va-c-link);
  font-size: 1rem;
}

.vg-host-logo {
  font-size: 0.96rem;
  color: var(--va-c-text-dark);
}

.vg-host-panel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.9rem;
}

.vg-host-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.65rem;
  padding-bottom: 0.7rem;
  border-bottom: 1px dashed var(--yun-surface-line);
}

.vg-host-meta-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  min-width: 0;
}

.vg-host-meta-label {
  color: var(--va-c-text-3);
  font-size: 0.72rem;
  font-weight: 600;
}

.vg-host-steps {
  margin: 0;
  padding-left: 1.25rem;
  color: var(--va-c-text);
  font-size: 0.84rem;
  line-height: 1.65;
}

.vg-host-note {
  margin: 0;
  padding-left: 0.65rem;
  border-left: 2px solid color-mix(in srgb, var(--va-c-link) 45%, var(--yun-surface-line));
  color: var(--va-c-text-2);
  font-size: 0.8rem;
}

.vg-host-foot {
  color: var(--va-c-text-2);
  font-size: 0.76rem;
}

@container vg-card (max-width: 560px) {
  .vg-host-meta {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
