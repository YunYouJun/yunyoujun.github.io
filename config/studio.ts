export interface StudioEpisode {
  projectName: string
  appearance?: 'ak-ui'
  id: string
  number: string
  title: string
  description: string
  date: string
  duration: string
  cover: string
  project: string
  website: string
}

// Public video metadata: https://www.bilibili.com/video/BV11RY26oEs6
export const studioVideos: Record<string, StudioEpisode> = {
  '/posts/xiaoyun-studio-01-ak-ui': {
    projectName: 'ak-ui',
    appearance: 'ak-ui',
    id: 'BV11RY26oEs6',
    number: '01',
    title: '我用 AI 复活了七年前咕掉的明日方舟风格 UI',
    description: '从 2019 年的 ak-ui，到设计 Token、CSS Core 与 Agent Skill。把没做完的想法，继续做下去。',
    date: '2026-09-11',
    duration: '02:44',
    cover: 'https://i2.hdslb.com/bfs/archive/63bd1317e9d1c16d5f187be334b6c841c4b8dd72.jpg',
    project: 'https://github.com/YunYouJun/ak-ui',
    website: 'https://ak-ui.yyj.moe/',
  },
}
