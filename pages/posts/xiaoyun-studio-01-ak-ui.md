---
title: '小云梦工坊 #01：用 AI 复活七年前的 ak-ui'
date: 2026-09-12
updated: 2026-09-12
description: 小云梦工坊第一期，从七年前的 ak-ui 出发，聊聊一个停更项目的重新启动。
categories:
  - 小云梦工坊
tags:
  - 开源
  - AI
  - ak-ui
  - 视频
ai:
  mode: generated
  reviewed: false
  note: 本文由 AI 根据作者已发布的视频简介与 ak-ui 公开文档整理撰写；视频的 AI 参与方式另见文末说明。
---

小云梦工坊的第一期视频发布了：**我用 AI 复活了七年前咕掉的明日方舟风格 UI**。

2019 年，《明日方舟》开服，ak-ui 也在那时开始。七年后，这个停更的个人项目借助 AI 重新启动，成为这次视频的主角。

博客也为这个系列留了一个位置：[小云梦工坊视频专栏](/collections/xiaoyun/)。视频展示界面和变化，文章则留下项目入口与补充资料，方便看完后继续探索。

<!-- more -->

<script setup>
import { studioVideos } from '../../config/studio'
</script>

<StudioVideo :episode="studioVideos['/posts/xiaoyun-studio-01-ak-ui']" />

## 从一个旧项目继续出发

七年前没有做完的项目，还能继续吗？第一期视频给出的答案，是重新打开 ak-ui。

这次重启保留了明日方舟风格的界面探索，也把成果整理成能够接入其他项目的样式基础。想先看效果，可以打开 [ak-ui 演示与文档](https://ak-ui.yyj.moe/)；想了解实现，可以从 [GitHub 仓库](https://github.com/YunYouJun/ak-ui) 开始。

## 现在的 ak-ui 可以怎样使用

根据项目文档，ak-ui 提供几种不同的接入方式：

- **设计 Token**：把颜色、间距等视觉约定用于自己的界面。
- **CSS Core**：使用不依赖特定前端框架的样式基础。
- **Vue Registry**：将组件代码复制到项目中，再按需要修改。
- **Agent Skill**：让 AI 先了解项目，再选择合适的接入路径。

如果你也在使用 AI 编程工具，可以安装项目提供的 Skill：

```bash
npx skills add YunYouJun/ak-ui --skill ak-ui
```

具体使用方式见 [AI Skill 指南](https://ak-ui.yyj.moe/guide/ai-skill)。项目后续仍会变化，安装与接口说明以文档为准。

## 视频里有哪些内容

全片约 2 分 44 秒，可以按这些位置回看：

| 时间 | 内容 |
| --- | --- |
| 00:00 | 七年前的夏天 |
| 00:31 | 再度复活 |
| 00:47 | 设计 Token 与接入方式 |
| 00:58 | 界面效果与 AI 的真实作用 |
| 01:15 | Agent Skill |
| 01:23 | 把没做完的想法继续做下去 |
| 02:12 | 组件巡礼与制作名单 |

## 关于 AI 参与和制作

视频简介中说明：方向、审美和最终验收由作者负责，AI 参与了开发、画面制作与小云配音，开场和结尾使用作者本人录音。界面演示采用项目真实截图、终端交互录像与编辑式动效。

本篇文章的 AI 参与情况独立标注在标题下方；视频的素材来源和完整制作名单请查看 [B 站视频简介](https://www.bilibili.com/video/BV11RY26oEs6)。ak-ui 是非官方粉丝项目，与《明日方舟》及其官方无隶属关系。

这也是小云梦工坊第一期留下的题目：把没做完的想法继续做下去。下期想听哪个项目的故事，欢迎到视频评论区聊聊。
