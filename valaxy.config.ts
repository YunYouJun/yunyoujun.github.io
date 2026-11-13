import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'

import { addonComponents } from 'valaxy-addon-components'
import { addonGirls } from 'valaxy-addon-girls'
import { addonWaline } from 'valaxy-addon-waline'
import { isBeianMode } from './config/beian'

const safelist = [
  'i-ri-home-line',
  'i-ri-article-line',
  'i-ri-book-open-line',
  'i-ri-code-box-line',
  'i-ri-flask-line',

  'i-ri-qq-line',
  'i-ri-share-line',
  'i-ri-sticky-note-line',
  'i-ri-tools-line',
  'i-ri-wechat-pay-line',
  'i-ri-alipay-line',
]
const colors = ['purple', 'green', 'blue', 'dark']
colors.forEach((c) => {
  safelist.push(...[
    `border-${c}-300`,
    `text-${c}-600`,
    `hover:bg-${c}-600`,
    `dark:text-${c}-300`,
    `focus:ring-${c}-300`,
  ])
})

/**
 * User Config
 * do not use export const
 */
export default defineValaxyConfig<UserThemeConfig> ({
  theme: 'yun',

  modules: {
    rss: {
      enable: true,
      fullText: false,
    },
  },

  unocss: {
    safelist,
  },

  addons: [
    addonComponents(),
    addonGirls(),
    addonWaline({
      serverURL: 'https://waline.yunyoujun.cn',
      cdn: 'https://unpkg.com/',
      // pageview: true,
      comment: !isBeianMode,
      // Protocol-relative //unpkg.com becomes http on the preview server.
      // That host redirects to https without CORS headers, so emoji fetches
      // fail in browser tests. Production is already https.
      cdn: 'https://unpkg.com/',
    }),
  ],

  vue: {
    isCustomElement: [(tag: string) => ['meting-js'].includes(tag)],
  },
})
