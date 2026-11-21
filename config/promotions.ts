export interface PromotionItem {
  label: string
  title: string
  description: string
  href: string
  external: boolean
  icon: string
}

// 在这里替换推荐的项目或博文，按数组顺序展示。
// 待 `pages/posts/cook-app.md` 取消 `draft: true` 发布后，
// 可将下方「云食册」卡片改为站内文章 `/posts/cook-app`（external: false）。
export const promotions: PromotionItem[] = [
  {
    label: '新作品 · 原生 App',
    title: '云食册',
    description: '四年前的「隔离食用手册」，做成原生 iOS App 了。',
    href: 'https://cook.yunle.fun',
    external: true,
    icon: 'i-ri-bowl-line',
  },
  {
    label: '视频专栏',
    title: '小云梦工坊',
    description: '用视频记录开源项目的故事，查看各期手记。',
    href: '/collections/studio/',
    external: false,
    icon: 'i-ri-film-line',
  },
]
