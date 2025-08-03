import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'
import { addonAlgolia } from 'valaxy-addon-algolia'

import { addonComponents } from 'valaxy-addon-components'
import { addonWaline } from 'valaxy-addon-waline'

const safelist = [
  'i-ri-home-line',

  'i-ri-qq-line',
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
    addonAlgolia({
      appId: 'CJXXAGRCYN',
      apiKey: 'ae1966d2aeab22bf9335679f45d2cd9a',
      indexName: 'my-hexo-blog',
    }),
    addonComponents(),
    addonWaline({
      serverURL: 'https://waline.yunyoujun.cn',
      // pageview: true,
      comment: true,
    }),
  ],

  vue: {
    isCustomElement: [(tag: string) => ['meting-js'].includes(tag)],
  },
})
