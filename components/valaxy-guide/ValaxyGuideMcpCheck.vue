<script setup lang="ts">
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { shallowRef } from 'vue'
import ValaxyGuideFrame from './ValaxyGuideFrame.vue'

const diagnosticOpen = shallowRef(false)
</script>

<template>
  <ValaxyGuideFrame
    class="vg-mcp"
    eyebrow="MCP 诊断示例"
    status="valaxy_check_page"
    caption="点一下带波浪线的链接，即可看到 MCP 返回给 AI 的断链位置与排查提示。"
    flush
  >
    <template #icon>
      <span class="i-ri-bug-line vg-head-icon" aria-hidden="true" />
    </template>

    <template #head-right>
      <span class="vg-pill vg-pill--amber">1 个警告</span>
    </template>

    <div class="vg-mcp-editor">
      <div class="language-md vg-shiki">
        <pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D"> 8 | </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">周末随记里整理了几条配置经验。</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D"> 9 |</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">10 | </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">如果还没搭好博客，可以先看 </span><PopoverRoot v-model:open="diagnosticOpen"><PopoverTrigger as-child><button type="button" class="vg-mcp-squiggle">[入门指南](/posts/getting-started)</button></PopoverTrigger><PopoverPortal to="#valaxy-teleports"><PopoverContent class="vg-popover" :side-offset="6" align="start" @open-auto-focus.prevent @close-auto-focus.prevent><div class="vg-mcp-pop-head"><span class="vg-pill vg-pill--amber">warning · Line 10</span><code>missing-link</code></div><p class="vg-mcp-pop-msg">目标本地页面 <code>/posts/getting-started</code> 尚不存在，发布后会变成 404 断链。</p><p class="vg-mcp-pop-hint">排查提示：检查 pages/posts/ 下是否已创建该文件，或改链到已存在的文章路径。</p></PopoverContent></PopoverPortal></PopoverRoot><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">。</span></span></code></pre>
      </div>

      <div class="vg-mcp-problem-row">
        <span class="i-ri-alert-line vg-mcp-warn-icon" aria-hidden="true" />
        <span class="vg-mcp-problem-text">
          <strong>missing-link</strong> · <code>pages/posts/weekend-note.md:10</code> — 未找到 <code>/posts/getting-started</code>
        </span>
      </div>
    </div>
  </ValaxyGuideFrame>
</template>

<style scoped>
.vg-head-icon {
  color: var(--va-c-yellow-1);
  font-size: 1rem;
}

.vg-mcp-editor {
  display: flex;
  flex-direction: column;
  background: var(--va-code-block-bg);
}

.vg-mcp-problem-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 0.9rem;
  border-top: 1px solid var(--yun-surface-line);
  background: transparent;
  color: var(--va-c-text-2);
  font-size: 0.78rem;
}

.vg-mcp-warn-icon {
  flex: none;
  color: var(--va-c-yellow-1);
  font-size: 0.95rem;
}

.vg-mcp-problem-text {
  min-width: 0;
  word-break: break-word;
}

.vg-mcp-pop-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.vg-mcp-pop-msg {
  margin: 0 0 0.35rem;
  color: var(--va-c-text);
  font-size: 0.78rem;
}

.vg-mcp-pop-hint {
  margin: 0;
  color: var(--va-c-text-2);
  font-size: 0.75rem;
}
</style>
