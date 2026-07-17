import { defineThemeConfig } from 'valaxy-theme-yun'

export default defineThemeConfig({
  banner: {
    enable: true,
    title: '云游君的小站',
    cloud: {
      enable: true,
    },
  },

  nav: [
    { text: 'menu.posts', link: '/posts/', icon: 'i-ri-article-line' },
    { text: '项目列表', link: '/projects', icon: 'i-ri-gallery-view' },
    { text: '站点地图', link: '/sites/', icon: 'i-ri-planet-line' },
    { text: '友情链接', link: '/links/', icon: 'i-ri-link' },
    { text: '老婆列表', link: '/girls/', icon: 'i-ri-women-line' },
    { text: '赞助者们', link: '/sponsors/', icon: 'i-ri-heart-line' },
  ],

  pages: [
    {
      name: '项目橱窗',
      url: '/projects/',
      icon: 'i-ri-code-s-slash-line',
      // color: 'var',
    },
    {
      name: '站点地图',
      url: '/sites/',
      icon: 'i-ri-planet-line',
      color: '#2563eb',
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
      url: '/sponsors/',
      icon: 'i-ri-heart-line',
      color: 'red',
    },
  ],

  footer: {
    since: 2016,
    beian: {
      enable: true,
      icp: '苏ICP备17038157号',
      police: '',
    },
  },
})
