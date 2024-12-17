<script setup lang="ts">
import { useAppStore } from 'valaxy'

import { useI18n } from 'vue-i18n'

const app = useAppStore()

const { t } = useI18n()
</script>

<template>
  <div class="post-card" m="auto" p="4">
    <div flex="~ wrap" class="m-2 items-center justify-center gap-4">
      <a
        class="flex items-center justify-center border-none!"
        href="https://afdian.com/@yunyoujun"
        target="_blank"
      >
        <SponsorBtn>
          <span>通过</span>
          <span class="flex items-center justify-center" m="x-1">
            <div i-ri-flashlight-line />爱发电
          </span>
          <span>赞助我</span>
        </SponsorBtn>
      </a>

      <a
        class="flex items-center justify-center border-none!"
        href="https://mp.weixin.qq.com/s?__biz=MzU3NTI4MjQwNQ==&mid=2247484117&idx=1&sn=9fcc396ed89c709401f3438e7991ebe1&chksm=fd24cf5fca534649dc016d938db26d9a244fea9e824552e99033e531c0232acc95b96ec5698a#rd"
        target="_blank"
      >
        <SponsorBtn color="green">
          <span>通过</span>
          <span class="flex items-center justify-center" m="x-1">
            <div i-ri-wechat-line />微信公众号
          </span>
          <span>文章赞赏</span>
        </SponsorBtn>
      </a>

      <a
        class="flex items-center justify-center border-none!"
        href="https://github.com/sponsors/YunYouJun"
        target="_blank"
      >
        <SponsorBtn :color="app.isDark ? 'blue' : 'dark'">
          <span>通过</span>
          <span class="flex items-center justify-center" m="x-1">
            <div i-ri-github-line />GitHub
          </span>
          <span>赞助我</span>
        </SponsorBtn>
      </a>
    </div>

    <div class="p-2 flex-center">
      {{ t("tooltip") }}
    </div>
  </div>
</template>
