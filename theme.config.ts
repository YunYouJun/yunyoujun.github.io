import { defineThemeConfig } from 'valaxy-theme-yun'
import { isBeianMode } from './config/beian'

export default defineThemeConfig({
  serifFont: 'except-home',
  postCard: {
    excerptGradient: false,
    titleClass: '',
  },
  navbar: { glass: 'always' },
  notFound: {
    issueLink: 'https://github.com/YunYouJun/yunyoujun.github.io/issues/new',
  },

  banner: {
    enable: true,
    title: '云游君的小站',
    grid: { enable: true, fade: true, interactive: true },
    prologue: 'grouped',
    navStyle: 'glass',
    cloud: {
      enable: true,
    },
  },

  nav: [
    { text: 'menu.posts', link: '/posts/', icon: 'i-ri-article-line' },
    { text: '小云梦工坊', link: '/collections/xiaoyun/', icon: 'i-ri-film-line' },
    { text: '项目橱窗', link: '/projects/', icon: 'i-ri-code-s-slash-line' },
    { text: '站点地图', link: '/sites/', icon: 'i-ri-planet-line' },
    { text: '友情链接', link: '/links/', icon: 'i-ri-link' },
    { text: '老婆列表', link: '/girls/', icon: 'i-ri-women-line' },
    ...(!isBeianMode
      ? [{ text: '赞助者们', link: '/sponsors/', icon: 'i-ri-heart-line' }]
      : []),
  ],

  pages: [
    {
      name: '小云梦工坊',
      url: '/collections/xiaoyun/',
      icon: 'i-ri-film-line',
      iconColor: 'var(--yun-nav-accent-studio)',
    },
    {
      name: '项目橱窗',
      url: '/projects/',
      icon: 'i-ri-code-s-slash-line',
      iconColor: 'var(--yun-nav-accent-projects)',
    },
    {
      name: '站点地图',
      url: '/sites/',
      icon: 'i-ri-planet-line',
      iconColor: 'var(--yun-nav-accent-sites)',
    },
    {
      name: '友情链接',
      url: '/links/',
      icon: 'i-ri-link',
      iconColor: 'var(--yun-nav-accent-links)',
    },
    {
      name: '老婆列表',
      url: '/girls/',
      icon: 'i-ri-women-line',
      iconColor: 'var(--yun-nav-accent-girls)',
    },
    ...(!isBeianMode
      ? [{
          name: '赞助者们',
          url: '/sponsors/',
          icon: 'i-ri-heart-line',
          iconColor: 'var(--yun-nav-accent-sponsors)',
        }]
      : []),
  ],

  footer: {
    since: 2016,
    icon: {
      enable: !isBeianMode,
    },
    beian: {
      enable: true,
      icp: '苏ICP备17038157号',
      police: '',
    },
  },
})
