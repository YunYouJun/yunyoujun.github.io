export type SiteStatus = 'active' | 'wip' | 'archive' | 'service' | 'external'

export interface YunSite {
  name: string
  url: string
  desc: string
  status?: SiteStatus
}

export interface YunSiteGroup {
  id: string
  title: string
  shortTitle: string
  desc: string
  icon: string
  accent: string
  x: number
  y: number
  sites: YunSite[]
}

export const siteMapCenter = {
  name: '云游君的小站',
  shortTitle: '主站',
  url: 'https://www.yunyoujun.cn/',
  desc: '个人博客、作品橱窗与所有站点的总入口。',
  accent: '#2563eb',
}

export const siteGroups: YunSiteGroup[] = [
  {
    id: 'blog',
    title: '博客',
    shortTitle: '博客',
    desc: '文章、归档、友链与关于页面，承载长期内容。',
    icon: 'i-ri-article-line',
    accent: '#f59e0b',
    x: 72,
    y: 22,
    sites: [
      {
        name: '云游君的小站',
        url: 'https://www.yunyoujun.cn/',
        desc: '主站首页，个人内容与站点导航的起点。',
      },
      {
        name: '博客文章',
        url: 'https://www.yunyoujun.cn/posts/',
        desc: '技术、生活、创作与回忆。',
      },
      {
        name: '归档',
        url: 'https://www.yunyoujun.cn/archives/',
        desc: '按时间回看所有公开文章。',
      },
      {
        name: '关于我',
        url: 'https://www.yunyoujun.cn/about/',
        desc: '云游君的个人介绍与公开联系方式。',
      },
      {
        name: '关于站点',
        url: 'https://www.yunyoujun.cn/about/site/',
        desc: '本站历史、设定与维护记录。',
      },
      {
        name: '友情链接',
        url: 'https://www.yunyoujun.cn/links/',
        desc: '朋友们的小站与随机邂逅。',
      },
    ],
  },
  {
    id: 'notes',
    title: '笔记',
    shortTitle: '笔记',
    desc: '更碎片、更私人、也更适合持续迭代的知识记录。',
    icon: 'i-ri-sticky-note-line',
    accent: '#8b5cf6',
    x: 32,
    y: 23,
    sites: [
      {
        name: '云游笔记',
        url: 'https://notes.yunyoujun.cn/',
        desc: '笔记、摘录与正在生长中的想法。',
        status: 'wip',
      },
      {
        name: '在线交友笔记',
        url: 'https://www.yunyoujun.cn/notes/online-dating/',
        desc: '主站内的加密笔记页面。',
        status: 'archive',
      },
    ],
  },
  {
    id: 'docs',
    title: '文档',
    shortTitle: '文档',
    desc: '项目文档、主题说明与长期维护的使用指南。',
    icon: 'i-ri-book-open-line',
    accent: '#3b82f6',
    x: 19,
    y: 49,
    sites: [
      {
        name: 'Valaxy',
        url: 'https://valaxy.yyj.moe/',
        desc: '新一代静态博客框架。',
      },
      {
        name: 'Yun 主题文档',
        url: 'https://yun.yunyoujun.cn/',
        desc: 'Yun / valaxy-theme-yun 的主题文档。',
      },
      {
        name: 'Vtuber Docs',
        url: 'https://docs.vtuber.yunyoujun.cn/',
        desc: '从零开始的 Vtuber 项目文档。',
        status: 'wip',
      },
      {
        name: 'mirai-ts',
        url: 'https://yunyoujun.github.io/mirai-ts/',
        desc: 'Mirai TypeScript SDK 文档。',
      },
      {
        name: 'el-bot Docs',
        url: 'https://docs.bot.elpsy.cn/',
        desc: '基于 mirai-ts 的机器人框架文档。',
      },
      {
        name: 'Augma Docs',
        url: 'https://docs.augma.elpsy.cn/',
        desc: '增强现实风格 UI 组件库文档。',
        status: 'wip',
      },
    ],
  },
  {
    id: 'projects',
    title: '项目',
    shortTitle: '项目',
    desc: '开源项目、作品橱窗与仍在推进的应用。',
    icon: 'i-ri-code-box-line',
    accent: '#10b981',
    x: 76,
    y: 56,
    sites: [
      {
        name: '项目橱窗',
        url: 'https://www.yunyoujun.cn/projects/',
        desc: '主站内的项目总览。',
      },
      {
        name: 'Air Conditioner',
        url: 'https://ac.yunyoujun.cn/',
        desc: '便携小空调，纯 CSS 冷笑话。',
      },
      {
        name: 'AI 春联',
        url: 'https://ai-sfc.yunyoujun.cn/',
        desc: '用 AI 生成春联。',
      },
      {
        name: 'ADV.JS',
        url: 'https://advjs.org/',
        desc: '面向未来与前端的 ADV 文字冒险游戏引擎。',
        status: 'wip',
      },
      {
        name: 'VTuber',
        url: 'https://vtuber.yunyoujun.cn/',
        desc: '从零开始的 Web 端 Vtuber 实验。',
        status: 'wip',
      },
      {
        name: 'Uncolor',
        url: 'https://uncolor.yunyoujun.cn/',
        desc: '统一色彩空间。',
      },
      {
        name: 'Kotodama',
        url: 'https://kotodama.yunyoujun.cn/',
        desc: '纯静态评论管理后台。',
        status: 'wip',
      },
    ],
  },
  {
    id: 'labs',
    title: '实验',
    shortTitle: '实验',
    desc: '小应用、可视化、玩具和一些轻量探索。',
    icon: 'i-ri-flask-line',
    accent: '#14b8a6',
    x: 28,
    y: 71,
    sites: [
      {
        name: 'yyj.moe',
        url: 'https://www.yyj.moe/',
        desc: '更国际化的另一个家。',
        status: 'wip',
      },
      {
        name: 'Chat Generator',
        url: 'https://chat.yunyoujun.cn/',
        desc: '经典聊天记录生成器。',
      },
      {
        name: 'Birthday',
        url: 'https://birthday.yunyoujun.cn/',
        desc: '祝你生日快乐。',
      },
      {
        name: 'NASA Vis',
        url: 'https://nasa.yunyoujun.cn/',
        desc: 'NASA API 数据可视化实验。',
      },
      {
        name: 'Go Far Away',
        url: 'https://yunyoujun.github.io/go-far-away/',
        desc: '去往这个世界上最遥远的地方。',
      },
      {
        name: 'FC',
        url: 'https://fc.elpsy.cn/',
        desc: '基于 JSNES 与 Vue 的红白机。',
      },
    ],
  },
  {
    id: 'tools',
    title: '工具与服务',
    shortTitle: '工具',
    desc: '实用工具、包、CDN、评论与数据服务。',
    icon: 'i-ri-tools-line',
    accent: '#0ea5e9',
    x: 50,
    y: 80,
    sites: [
      {
        name: 'Color Dust',
        url: 'https://color-dust.yunyoujun.cn/',
        desc: '基于 K-Means 的主题色提取。',
      },
      {
        name: 'Char Dust',
        url: 'https://yunyoujun.github.io/char-dust/',
        desc: '在线图片转字符画。',
      },
      {
        name: 'Pixi Painter',
        url: 'https://pixi-painter.pages.dev/',
        desc: '基于 Pixi.js 的绘图工具。',
      },
      {
        name: 'Web Resume',
        url: 'https://resume.elpsy.cn/',
        desc: '可在线编辑的 Web 简历。',
      },
      {
        name: 'CDN',
        url: 'https://cdn.yunyoujun.cn/',
        desc: '图片与静态资源 CDN。',
        status: 'service',
      },
      {
        name: 'Sponsors Data',
        url: 'https://sponsors.yunyoujun.cn/',
        desc: '赞助者数据与相关资源。',
        status: 'service',
      },
      {
        name: 'Waline',
        url: 'https://waline.yunyoujun.cn/',
        desc: '主站评论服务。',
        status: 'service',
      },
      {
        name: 'RSS',
        url: 'https://www.yunyoujun.cn/atom.xml',
        desc: '主站订阅源。',
        status: 'service',
      },
    ],
  },
  {
    id: 'social',
    title: '社交',
    shortTitle: '社交',
    desc: '代码、视频、动态与可公开联系到我的地方。',
    icon: 'i-ri-share-line',
    accent: '#6366f1',
    x: 73,
    y: 89,
    sites: [
      {
        name: 'GitHub',
        url: 'https://github.com/YunYouJun',
        desc: '主要的开源代码与项目协作入口。',
        status: 'external',
      },
      {
        name: '哔哩哔哩',
        url: 'https://space.bilibili.com/1579790',
        desc: '视频、动态与一些创作记录。',
        status: 'external',
      },
      {
        name: 'X / Twitter',
        url: 'https://twitter.com/YunYouJun',
        desc: '项目预告、碎碎念与公开动态。',
        status: 'external',
      },
      {
        name: 'Telegram Channel',
        url: 'https://t.me/elpsycn',
        desc: 'Telegram 频道。',
        status: 'external',
      },
      {
        name: '微博',
        url: 'https://weibo.com/jizhideyunyoujun',
        desc: '微博动态。',
        status: 'external',
      },
      {
        name: '赞助者们',
        url: 'https://www.yunyoujun.cn/sponsors/',
        desc: '赞助说明与赞助者名单。',
      },
    ],
  },
]
