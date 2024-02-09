import { defineThemeConfig } from 'valaxy-theme-yun/node'

export default defineThemeConfig({
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
})
