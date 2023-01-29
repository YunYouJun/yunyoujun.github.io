import { defineValaxyConfig } from 'valaxy'
import type { UserThemeConfig } from 'valaxy-theme-yun'
import { addonWaline } from 'valaxy-addon-waline'
import { addonAlgolia } from 'valaxy-addon-algolia'

/**
 * User Config
 * do not use export const
 */
export default defineValaxyConfig<UserThemeConfig> ({
  theme: 'yun',

  themeConfig: {
    banner: {
      enable: true,
      title: '云游君的小站',
      cloud: {
        enable: true,
      },
    },

    pages: [
      {
        name: '我的小伙伴们',
        url: '/links/',
        icon: 'i-ri-genderless-line',
        color: 'dodgerblue',
      },
      {
        name: '赞助者们',
        url: 'https://sponsors.yunyoujun.cn',
        icon: 'i-ri-heart-line',
        color: 'red',
      },
      {
        name: '喜欢的女孩子',
        url: '/girls/',
        icon: 'i-ri-women-line',
        color: 'hotpink',
      },
    ],

    footer: {
      since: 2016,
      beian: {
        enable: true,
        icp: '苏ICP备17038157号',
      },
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
    addonWaline({
      serverURL: 'https://waline.yunyoujun.cn',
      // pageview: true,
      comment: true,
    }),
  ],
})
