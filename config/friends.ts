import type { FriendLink } from '../utils/friends'

export interface HiddenFriend extends FriendLink {
  hiddenAt: string
  reason: string
}

export const HIDDEN_FRIENDS_CHECKED_AT = '2026-07-19'

export const friendOverrides: Record<string, Partial<FriendLink>> = {
  'https://blog.besscroft.com/': {
    avatar: 'https://github.com/besscroft.png?size=512',
    url: 'https://besscroft.com/',
  },
}

const hiddenFriends = [
  {
    avatar: 'https://upyun.yunyoujun.cn/images/angelic47-avatar.jpg',
    name: 'Angelic47',
    url: 'https://www.angelic47.com/',
    color: '#4fbff9',
    blog: 'Angelic47\'s Home',
    desc: '弱小，无助，又可怜！～',
    hiddenAt: HIDDEN_FRIENDS_CHECKED_AT,
    reason: '域名已无法解析',
  },
  {
    avatar: 'https://fastly.jsdelivr.net/gh/BigCoke233/image-hosting/avatars/avatar.jpg',
    name: 'Eltrac',
    url: 'https://guhub.cn',
    color: '#6688DD',
    blog: 'Eltrac\'s Track',
    desc: '暗夜行路，终遇奇迹。',
    hiddenAt: HIDDEN_FRIENDS_CHECKED_AT,
    reason: '域名已无法解析',
  },
  {
    avatar: 'https://upyun.yunyoujun.cn/images/hydropower-avatar.jpg',
    name: 'Andy Chen',
    url: 'https://hydropwr.ca/',
    color: '#00A9EF',
    blog: 'Hydropower Hub',
    desc: 'また，一緒に輝きたい．',
    hiddenAt: HIDDEN_FRIENDS_CHECKED_AT,
    reason: '域名已无法解析',
  },
  {
    avatar: 'https://haozi.moe/css/images/logo.png',
    name: '月月月子喵',
    url: 'https://haozi.moe/',
    color: '#42b983',
    blog: '月月月子喵~',
    desc: '可爱的月子酱',
    hiddenAt: HIDDEN_FRIENDS_CHECKED_AT,
    reason: 'HTTPS 连接失败，HTTP 返回 404 页面',
  },
  {
    avatar: 'https://github.com/cbhua/cbhua.github.io/raw/master/images/icon.png',
    name: 'Kurakun',
    url: 'https://timegg.top',
    color: '#1C5A97',
    blog: 'Timegg',
    desc: '把手上的东西放进时光蛋。',
    hiddenAt: HIDDEN_FRIENDS_CHECKED_AT,
    reason: '域名已无法解析',
  },
  {
    avatar: 'https://fastly.jsdelivr.net/gh/sanshiliuxiao/blog-static/avatar.jpg',
    name: '椎咲良田',
    url: 'https://sanshiliuxiao.top/',
    color: '#4f5b97',
    blog: '椎咲良田',
    desc: '快走吧，趁风停止之前',
    hiddenAt: HIDDEN_FRIENDS_CHECKED_AT,
    reason: '域名已无法解析',
  },
  {
    avatar: 'https://fastly.jsdelivr.net/gh/DavinciEvans/Imgs-bed@master/gallery/avatar.jpg',
    name: 'Davinci',
    url: 'https://davincievans.top/',
    color: '#42b8dd',
    blog: 'Davinci の 红茶馆',
    desc: 'You are all stardust.',
    hiddenAt: HIDDEN_FRIENDS_CHECKED_AT,
    reason: '域名已无法解析',
  },
  {
    avatar: 'https://img.cdn.gaein.cn/website_used/avatars/avatar-128x.webp',
    name: 'Gaein nidb',
    url: 'https://gaein.cn/',
    color: '#519BFF',
    blog: 'Gaein nidb 的小站',
    desc: '记录生活',
    hiddenAt: HIDDEN_FRIENDS_CHECKED_AT,
    reason: '域名已无法解析',
  },
] satisfies HiddenFriend[]

export default hiddenFriends
