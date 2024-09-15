import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'
import { addonAlgolia } from 'valaxy-addon-algolia'

import { addonComponents } from 'valaxy-addon-components'
import { addonWaline } from 'valaxy-addon-waline'

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
    safelist: [
      'i-ri-home-line',
    ],
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
    template: {
      compilerOptions: {
        isCustomElement: (tag: string) => ['meting-js'].includes(tag),
      },
    },
  },
})
