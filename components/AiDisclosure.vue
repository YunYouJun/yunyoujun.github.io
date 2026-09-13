<script setup lang="ts">
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { onBeforeUnmount, shallowRef } from 'vue'

defineProps<{ label: string, note: string }>()
const open = shallowRef(false)
let closeTimer: ReturnType<typeof setTimeout> | undefined
function cancelClose() {
  clearTimeout(closeTimer)
}
function showOnHover(event: PointerEvent) {
  if (event.pointerType !== 'mouse')
    return
  cancelClose()
  open.value = true
}
function scheduleClose() {
  cancelClose()
  closeTimer = setTimeout(() => {
    open.value = false
  }, 150)
}
function leaveOnMouse(event: PointerEvent) {
  if (event.pointerType === 'mouse')
    scheduleClose()
}
function showOnFocus(event: FocusEvent) {
  if ((event.target as HTMLElement).matches(':focus-visible')) {
    cancelClose()
    open.value = true
  }
}
onBeforeUnmount(cancelClose)
</script>

<template>
  <div class="ai-disclosure">
    <PopoverRoot v-model:open="open">
      <PopoverTrigger as-child>
        <button
          class="ai-disclosure-trigger" type="button" :aria-label="`${label}，查看创作说明`"
          @pointerenter="showOnHover" @pointerleave="leaveOnMouse" @focus="showOnFocus" @blur="scheduleClose"
        >
          <svg class="ai-disclosure-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z" />
            <path d="M20 2v4m-2-2h4" />
          </svg>
          <span>{{ label }}</span>
        </button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          class="ai-disclosure-popover" side="bottom" align="center" :side-offset="6" :collision-padding="16"
          :aria-label="`${label}：创作说明`"
          @open-auto-focus.prevent @close-auto-focus.prevent
          @pointerenter="cancelClose" @pointerleave="leaveOnMouse"
        >
          <span class="ai-disclosure-caption">创作说明</span>
          <p class="ai-disclosure-note">
            {{ note }}
          </p>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </div>
</template>

<style>
.ai-disclosure {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 8px;
}
.ai-disclosure-trigger {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 28px;
  padding: 4px 7px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #68686d;
  font: 400 11px/1.5 -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  cursor: pointer;
  transition: background-color 120ms ease;
}
.ai-disclosure-trigger:hover,
.ai-disclosure-trigger[data-state='open'] { background: rgb(118 118 128 / 8%); }
.ai-disclosure-trigger:focus-visible { outline: 2px solid #007aff; outline-offset: 2px; }
.ai-disclosure-icon { width: 13px; height: 13px; flex: none; }
.ai-disclosure-popover {
  box-sizing: border-box;
  width: 280px;
  max-width: calc(100vw - 32px);
  padding: 12px 14px;
  border: 1px solid rgb(60 60 67 / 12%);
  border-radius: 12px;
  background: rgb(250 250 252 / 98%);
  color: #48484d;
  box-shadow: 0 4px 20px rgb(0 0 0 / 10%), 0 1px 3px rgb(0 0 0 / 4%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  font: 400 12px/1.65 -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  text-align: left;
  z-index: 100;
}
.ai-disclosure-caption { display: block; margin-bottom: 4px; font-size: 11px; font-weight: 600; color: #68686d; }
.ai-disclosure-note { margin: 0; }
.dark .ai-disclosure-trigger { color: #aaaab1; }
.dark .ai-disclosure-popover {
  background: rgb(44 44 46 / 98%);
  color: #dedee3;
  border-color: rgb(255 255 255 / 12%);
  box-shadow: 0 6px 24px rgb(0 0 0 / 25%);
}
.dark .ai-disclosure-caption { color: #aaaab1; }
@media (pointer: coarse) {
  .ai-disclosure-trigger { min-height: 44px; padding-inline: 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .ai-disclosure-trigger { transition: none; }
}
</style>
