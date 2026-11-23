<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import '../../styles/valaxy-guide.scss'

const hasCommentSection = shallowRef(false)

onMounted(() => {
  hasCommentSection.value = Boolean(document.querySelector('.yun-comment'))
})

function scrollToComments() {
  const commentEl = document.querySelector<HTMLElement>('.yun-comment')
  if (!commentEl)
    return

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  commentEl.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start',
  })
}
</script>

<template>
  <aside class="vg-figure vg-feedback not-prose" aria-label="讨论与反馈">
    <div class="vg-box">
      <div class="vg-split vg-feedback-split">
        <section class="vg-split-pane vg-feedback-pane">
          <h3 class="vg-eyebrow vg-feedback-eyebrow">
            <span class="i-ri-chat-3-line vg-feedback-icon" aria-hidden="true" />
            <span>文章讨论</span>
          </h3>

          <p class="vg-feedback-desc">
            文章相关的讨论，可以直接在文末评论区留言。
          </p>

          <div v-if="hasCommentSection" class="vg-feedback-actions">
            <button type="button" class="vg-btn" @click="scrollToComments">
              <span class="i-ri-arrow-down-line" aria-hidden="true" />
              <span>前往评论区</span>
            </button>
          </div>
        </section>

        <section class="vg-split-pane vg-feedback-pane">
          <h3 class="vg-eyebrow vg-feedback-eyebrow">
            <span class="vg-feedback-valaxy-logo" aria-hidden="true" />
            <span>Valaxy 反馈</span>
          </h3>

          <p class="vg-feedback-desc">
            如果是 Valaxy 本身的问题或建议，欢迎到这里反馈。
          </p>

          <div class="vg-feedback-actions">
            <a
              class="vg-btn vg-btn--primary"
              href="https://github.com/YunYouJun/valaxy/discussions"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="i-ri-discuss-line" aria-hidden="true" />
              <span>Valaxy Discussions</span>
              <span class="i-ri-external-link-line vg-feedback-ext" aria-hidden="true" />
            </a>

            <a
              class="vg-btn"
              href="https://github.com/YunYouJun/valaxy/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="i-ri-bug-line" aria-hidden="true" />
              <span>Issues</span>
              <span class="i-ri-external-link-line vg-feedback-ext" aria-hidden="true" />
            </a>
          </div>
        </section>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.vg-feedback {
  margin-bottom: 0.5rem;
}

.vg-feedback-split {
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
}

.vg-feedback-pane {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 0.9rem 1rem;
}

.vg-feedback-eyebrow {
  margin: 0;
  font-size: 0.92rem;
}

.vg-feedback-icon {
  flex: none;
  font-size: 1rem;
  color: var(--va-c-link);
}

.vg-feedback-valaxy-logo {
  flex: none;
  width: 1rem;
  height: 1rem;
  background: url('/images/valaxy-guide/valaxy-logo.png') center / contain no-repeat;
}

.vg-feedback-desc {
  margin: 0;
  color: var(--va-c-text-2);
  font-size: 0.84rem;
  line-height: 1.6;
}

.vg-feedback-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  margin-top: auto;
  padding-top: 0.2rem;
}

.vg-feedback-ext {
  font-size: 0.82em;
  opacity: 0.72;
}

@container vg-card (max-width: 600px) {
  .vg-feedback-split {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
