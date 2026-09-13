import { defineCollection } from 'valaxy'
import { studioVideos } from '../../../config/studio'

export default defineCollection({
  key: 'xiaoyun',
  title: '小云梦工坊',
  description: '用视频记录开源项目的故事，收集从想法变成作品的瞬间。',
  cover: studioVideos['/posts/xiaoyun-studio-01-ak-ui'].cover,
  collapse: false,
  items: [
    { title: '第 01 期 · 用 AI 复活七年前的 ak-ui', link: '/posts/xiaoyun-studio-01-ak-ui' },
  ],
})
