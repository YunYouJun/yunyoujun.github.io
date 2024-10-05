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
      name: '项目橱窗',
      url: '/projects/',
      icon: 'i-ri-code-s-slash-line',
      // color: 'var',
    },
    {
      name: '友情链接',
      url: '/links/',
      icon: 'i-ri-genderless-line',
      color: 'dodgerblue',
    },
    {
      name: '老婆列表',
      url: '/girls/',
      icon: 'i-ri-women-line',
      color: 'hotpink',
    },
    {
      name: '赞助者们',
      url: 'https://sponsors.yunyoujun.cn',
      icon: 'i-ri-heart-line',
      color: 'red',
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
