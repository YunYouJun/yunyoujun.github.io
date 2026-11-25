---
title: 四年前的「隔离食用手册」，我把它做成了原生 iOS App｜云食册
date: 2026-11-22
updated: 2026-11-25
description: 从 2022 年的开源小网页「隔离食用手册」出发，聊聊原生 iOS / iPadOS App「云食册」的诞生与功能。
categories:
  - 小云梦工坊
tags:
  - 开源
  - iOS
  - 云食册
  - 视频
ai:
  mode: generated
  reviewed: false
  note: 本文正文与交互试玩组件由 AI 根据作者已发布的 B 站视频简介与项目公开信息整理制作；视频的制作与配音说明另见文末。
---

小云梦工坊的新视频发布了：**四年前的隔离食用手册，我把它做成了原生 iOS App｜云食册**。

2022 年春天花一下午写出来的开源小网页「隔离食用手册」，本以为早该退休了，结果这两年各大平台一直有人自发安利，2023 年底 QQ 空间又冲来六百多万次请求。大家每天还是在问同一件事：今天吃什么呀？于是干脆去掉「隔离」，把它做成原生 App「云食册」。

这篇笔记也收录于[小云梦工坊视频专栏](/collections/studio/)，下面可以直接看视频，也整理了项目入口与几个可以上手点一点的交互小试玩。

<!-- more -->

<script setup>
import { useCookArticle } from '../../components/cook-app/useCookArticle'
import { studioVideos } from '../../config/studio'

const { state } = useCookArticle()
</script>

<div id="cook-video">
  <StudioVideo :episode="studioVideos['/posts/cook-app']" :seek-seconds="state.videoSeek?.seconds ?? null" :seek-nonce="state.videoSeek?.nonce ?? 0" :seek-label="state.videoSeek?.label" />
</div>

## 从「隔离食用手册」到「云食册」

既然做饭成了日常，干脆去掉「隔离」，做成原生 iOS / iPadOS App，取「云端的食用手册」，定名为「云食册」：

<CookAppRenameStamp />

云食册已在 App Store 上架，Android 版也在开发中。从网页到 App，菜谱和代码依然全部开源在 GitHub，欢迎点 Star、提 Issue 反馈建议，也欢迎提 PR 添一道你的拿手家常菜：

- **iPhone / iPad 下载**：[App Store（中国大陆）](https://apps.apple.com/cn/app/id6824589542)
- **App 官网**：[cook.yunle.fun](https://cook.yunle.fun)
- **网页版**：[cook.yunyoujun.cn](https://cook.yunyoujun.cn)
- **开源仓库**：[YunYouJun/cook](https://github.com/YunYouJun/cook)
- **内测反馈 QQ 群**：`1108267397`

## 现在的「云食册」有哪些功能

### 冰箱保质期：先吃掉快临期的菜

相比 2022 年的网页版，原生 App 把「家里还有什么」往前多走了一步——放进冰箱的食材会记录保质期，扫一眼包装上的日期就能离线算出还剩几天（AI 拍照入库与帮找菜功能目前仍在等待大模型备案审批）。

你可以滑动时间轴或点击「模拟离线扫包装算保质期」，再一键把临期食材带到下面的选菜台：

<CookAppFridgeSim />

### 点选食材与横向滑卡抽签

云食册内置 887 道本地菜谱，支持点选食材、说句话找菜，也能直接横向滑卡随机抽签。下面这个微缩试玩只挑了 18 道家常菜，可以直接点选食材和厨具，或者切到「横向滑卡抽签」体验手感：

<CookAppDishPlayground />

### 多端适配与同步

除了手机随手翻看，云食册也适配了 iPad 分栏厨房工作台与折叠屏布局，左侧选料看配比、右侧对照步骤做菜，配合 iCloud 云同步在不同设备间顺畅衔接（实机多端界面演示可直接看视频 `01:13` 处）。

### 轻松记录：把压力留在厨房外

做菜不是上班打卡，所以云食册刻意不设连续打卡和排行榜，只留下一个「今天学会了」的轻记录。在上面挑好一道菜后，可以在这里安静记下它，或直接看视频 `01:26` 里的 3D 软陶小菜徽章实机展示：

<CookAppLearnedNote />

## 视频里有哪些内容

全片约 2 分 22 秒（2 分 21.5 秒），点击任意时间点可以直接定位上方播放器：

<CookAppChapters />

## 关于制作与参与说明

根据视频简介说明，本期视频使用 HyperFrames（HTML 动画）制作，小云语音为克隆配音，BGM 来自 HeyGen 音乐库。

本篇文章的 AI 参与情况独立标注在标题下方；完整视频信息请查看 [B 站视频简介](https://www.bilibili.com/video/BV14LyezKE6J)。
