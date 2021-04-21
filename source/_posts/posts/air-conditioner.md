---
title: 云空调，便携小空调
date: 2021-04-17 17:18:47
updated: 2021-04-21 17:18:47
tags:
  - 玩具
  - 前端
  - React
categories:
  - 云游的小项目
---

[![GitHub Repo stars](https://img.shields.io/github/stars/YunYouJun/air-conditioner?style=social)](https://github.com/YunYouJun/air-conditioner/)

## 简介

> ❄️ 云空调，便携小空调，为你的夏日带去清凉！

这又是一个差不多两年前的坑。

那么它能做什么呢？没错，**随时随地**打开空调。唯一的缺憾是，没有**风**。但我们也许可以「望空调止热」。

- GitHub: [air-conditioner](https://github.com/YunYouJun/air-conditioner/)
- 裸机: [云空调](https://www.yunyoujun.cn/air-conditioner/)
- 样板房: [空调间](https://www.yunyoujun.cn/air-conditioner-room/)

遵从最宽松的 MIT 协议，你可以自行 `clone` 本项目，并自定义地构建它。当然也可以通过 `iframe` 的方式直接嵌入你的网站。

```html
<iframe height="700" src="https://www.yunyoujun.cn/air-conditioner/"></iframe>
```

<!-- more -->

## 前言

最近似乎总是在 GitHub 开源个项目，README 里介绍一遍，然后又在自己的博客介绍一遍，而显得产生了许多冗余信息。

这似乎是不「优雅」的。

不过我更倾向于在 GitHub 的 README 中介绍正经的启动、使用方式，而在博客中则更个性化地介绍一下我做它的原因、衍生的内容和中途遇到的各种各样有趣的事情。

因此勉强也算各自有其存在的意义。

---

这篇文章实际是在 4 月 17 日 开始着手写的，未曾想到 4 月 18 日 突然因为被诸多 TG 和微博的沙雕频道转发，有些爆火，增加了很多 Star 和访问量。
让人诚惶诚恐，受宠若惊。

- [👴🏻 🔥 了 // @迷惑行為大賞 // @A 岛-匿名版 | 微博](https://weibo.com/5327759694/KbwQPxjEN)
- [TG 沙雕频道们 / 每日沙雕墙](https://github.com/YunYouJun/air-conditioner/issues/6#issuecomment-821961213)

## 来历

因此不妨借此机会，说说它的前世今生。

很早以前我看过的是一个电风扇 APP 截图（但我确实不记得来源了），这种冷笑话精神，着实让人心领神会。

于是几年前的我写了一个使用 CSS 动画的线上电风扇 [electric-fan | 夏日清凉小风扇](https://github.com/ElpsyCN/electric-fan)。
当然囿于技术和设计能力，美观上可以说是非常欠缺。

那么，夏天还有什么呢？没错，那就是「空调」。
因此后续则想着不妨试试实现一个空调，也就是「云空调」的来源了。

因为初衷便是一个玩具项目，所以我通常喜欢使用我最不熟练的技术来完成它，并借此学习一些东西。（所以它的代码可能并不是最最优雅的方式。）

也正因此技术栈我则选用了 [React](https://zh-hans.reactjs.org/) + [Material-UI](https://material-ui.com/)。

实现的话，说难也不难，说简单自己又不想承认是那么简单。
除去冷笑话本身的特点，最大的亮点想必便是纯 CSS 绘制了，比如能效标签。
当然这本质是一个苦力活，对着真实的能效标签，配合框架的循环语法，用 CSS 一个个画下来就是。

实质上在 2019 年的年底，我便实现了它，而后续的 2020 我又进行了一些细节样式的调整与依赖更新。
尽管也收到了一些 Star，但不温不火。

在 4 月 18 日前一周，我发现 CDN 的流量费用似乎有所上升，于是乎查看了下流量的统计，发现有不少的资源来自小空调的音频加载。
此前我使用的是未经压缩的 `wav` 格式，相比压缩后的 `mp3` 文件要大上数十倍。
也多亏于此，后续的流量暴增也没有过多地消耗我的 CDN 费用。（一看账单，没想到大头变成 CDN 的 HTTPS 请求费用了。）

## 后话

最近的实习将将尘埃落定，网友们却人人化身产品经理，给小空调提起 [Feature Request](https://github.com/YunYouJun/air-conditioner/issues) 来。

苦于实力、精力有限，加之 React 仍旧并不熟悉，我也只能慢慢追加功能了。
最近刚追加了 LED 字体，Redux 的全局状态管理和适应系统的亮暗模式。

---

最后的最后，说件趣闻，此前腾讯二面的时候面试官问我会不会 React，我只得老实承认自己主攻 Vue，React 的经验仅局限于小小的 Demo 们。

于是乎，我开启了屏幕共享，给面试官看了下我的小空调……

---

Q.E.D.
