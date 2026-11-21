<script setup lang="ts">
import { shallowRef } from 'vue'

const steps = [
  {
    label: '写作',
    source: 'pages/posts/hello-valaxy.md',
    title: '# 你好，Valaxy！',
    description: '在 Markdown 文件里写下第一篇文章。',
  },
  {
    label: '保存',
    source: 'Vite 热更新',
    title: '文章已保存',
    description: '本地开发服务器会检测到这次改动。',
  },
  {
    label: '预览',
    source: '/posts/hello-valaxy',
    title: '你好，Valaxy！',
    description: '浏览器里的标题已经更新，可以接着往下写了。',
  },
] as const

const logoUrl = `${import.meta.env.BASE_URL}images/valaxy-guide/valaxy-logo.png`
const activeStep = shallowRef<(typeof steps)[number]>(steps[0])
</script>

<template>
  <div class="writing-flow not-prose">
    <div class="flow-brand">
      <span class="flow-logo">
        <img :src="logoUrl" width="32" height="29" alt="" loading="lazy">
      </span>
      <span>Valaxy</span>
    </div>

    <div class="flow-steps" role="group" aria-label="演示步骤">
      <button
        v-for="step in steps"
        :key="step.label"
        type="button"
        class="flow-step"
        :aria-pressed="step === activeStep"
        @click="activeStep = step"
      >
        {{ step.label }}
      </button>
    </div>

    <div class="flow-screen" role="status" aria-atomic="true">
      <div :key="activeStep.label" class="flow-state">
        <div class="flow-source">
          {{ activeStep.source }}
        </div>
        <strong class="flow-title">{{ activeStep.title }}</strong>
        <div>{{ activeStep.description }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.writing-flow {
  box-sizing: border-box;
  max-width: 40rem;
  margin-block: 1.5rem;
  padding: clamp(1rem, 4vw, 1.75rem);
  border: 1px solid #3d4964;
  border-radius: 1rem;
  background: linear-gradient(128deg, #131d36, #202d4c);
  color: #dbe5fa;
  line-height: 1.5;
  text-align: start;
}

.flow-brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1rem;
  color: #fff;
  font-size: 1.125rem;
  font-weight: 700;
}

.flow-logo {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border-radius: 0.65rem;
  background: #f5f7ff;
}

.flow-logo img {
  display: block;
  margin: 0;
  object-fit: contain;
}

.flow-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.4rem;
  margin-bottom: 0.6rem;
}

.flow-step {
  min-height: 2.75rem;
  padding: 0.35rem 0.5rem;
  border: 1px solid #5c6e91;
  border-radius: 0.5rem;
  background: #252f49;
  color: #eef4ff;
  font: inherit;
  cursor: pointer;
}

.flow-step[aria-pressed="true"] {
  border-color: #b9e7ff;
  background: #b9e7ff;
  color: #14243d;
  font-weight: 700;
}

.flow-step:focus-visible {
  outline: 2px solid #f9d9a6;
  outline-offset: 2px;
}

.flow-screen {
  display: grid;
  align-content: center;
  min-height: 8.75rem;
  padding: 1rem;
  border: 1px solid #505e7b;
  border-radius: 0.65rem;
  background: #111a2c;
}

.flow-state {
  display: grid;
  gap: 0.35rem;
  overflow-wrap: anywhere;
}

.flow-source {
  color: #b9e7ff;
  font-family: ui-monospace, monospace;
  font-size: 0.8125rem;
}

.flow-title {
  color: #fff;
  font-size: 1.2rem;
}

@media (prefers-reduced-motion: no-preference) {
  .flow-state {
    animation: flow-appear 200ms ease-out;
  }

  @keyframes flow-appear {
    from {
      opacity: 0;
      transform: translateY(0.25rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
