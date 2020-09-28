---
title: ADV 游戏引擎计划
date: 2020-09-28 19:33:17
updated: 2020-09-28 19:33:17
tags:
  - 前端
  - Vue
  - ADV
  - AVG
categories:
  - 云游的小项目
---

ADV.JS 又一个遥遥无期的大坑。

## 前言

按照惯例，开坑前先来三问。是什么？为什么？怎么做？

<!-- more -->

### ADV 是个啥？

> 冒险游戏（Adventure Game，缩写为 AVG 或 ADV）是电子游戏中的最早的类型之一。此类型游戏采取玩家输入或选择指令以改变行动的形式。强调故事线索的发掘及故事剧情，主要考验玩家的观察力和分析能力。该类游戏有时候很像角色扮演游戏，但不同的是，冒险游戏中玩家操控的游戏主角本身的等级、属性能力一般是固定不变并且不会影响游戏的进程。
> 通常 galgame 类型为 ADV 形式的，不是纯剧情+CG+选项的，而带一些其他方式操作，比如游戏里有卡牌对战或者战斗场面（例：恋姬无双）。
> —— 摘自[「百度百科 - ADV」](https://baike.baidu.com/item/ADV/5109709)

简而言之，平时我们常见的 [Galgame](https://baike.baidu.com/item/Galgame) / 视觉小说便是 ADV/AVG 的一种。

> Galgame（日文假名：ギャルゲーム，平文式罗马字：Gyaru Gēmu，又称美少女游戏）是一种玩家可以与动画美少女进行互动的电子游戏，其受众主体曾经是日本男性，但现在的全年龄 GalGame 剧情面向受众已经不分男女。Galgame 的游戏类型大多数是 VNG (视觉小说)但是也有交互式的 Galgame。
> —— 摘自[「百度百科 - Galgame」]

一般情况下，Galgame ∈ ADV = AVG。

> [ADV、AVG 和 Galgame 有什么区别？](https://www.zhihu.com/question/65520382)

### 为啥要做 ADV 游戏引擎？

#### 调研

ADV/AVG 的游戏引擎已经有很多，但都各有千秋。

> [视觉小说引擎列表 - 维基百科](https://zh.wikipedia.org/wiki/%E8%A7%86%E8%A7%89%E5%B0%8F%E8%AF%B4%E5%BC%95%E6%93%8E%E5%88%97%E8%A1%A8)

**以下是个人的调研（搜索）简要评估，仅为个人观点，欢迎指正。**

- [吉里吉里](https://zh.wikipedia.org/wiki/%E5%90%89%E9%87%8C%E5%90%89%E9%87%8C): C++，老牌 AVG 游戏引擎，著名的 Fate/stay night 便是用其制作。但是上一个稳定版本已经是十年前，很久没有更新了。
- [Ren'Py](http://www.renpy.org/): Python，代表作「心跳文学部」(~~我老婆的 [Tittwer](https://twitter.com/lilmonix3)~~)，开源万岁，并且直到现在更新也很活跃，如果喜欢 Python，是个不错的选择。
- [NScripter](http://www.nscripter.com/): C++，非商业免费，Windows 平台，代表作「寒蝉鸣泣之时」，上一个稳定版本发布于 2015 年。
- [AVG32、RealLive、SiglusEngine](https://zh.wikipedia.org/wiki/Visual_Art%27s)：[Visual Art's](http://visual-arts.jp/) 公司开发，Key 社游戏「CLANNAD」等均用此开发，但很明显这种商业级咱接触不到。
- [BKEngine](https://bke.bakery.moe/): C++，面包工坊，非商业免费、跨平台，但是制作工具不跨平台（只有 Windows）。
- [AVG.js](https://avgjs.org/)：JavaScript，开源，基于 Pixi.js 与 React，Web 端运行。但是作者 [Icemic](https://github.com/Icemic) 是个大 🐦，所以已经几年没有更新了。（不过作者也在 BKEngine 的面包工坊。）
- [Librian](https://github.com/RimoChan/Librian): Python，开源，跨平台，Galgame | Visual Novel 引擎，[作者](https://github.com/RimoChan) 还有在做 [Vtuber](https://space.bilibili.com/546884063/)，可惜是个变态。
- [橙光制作工具](https://www.66rpg.com/redirect/doDownload)：免费易操作，只有 Windows 平台，但是因为 [如何看待橙光游戏签约合同中版权永久属于橙光，而作者仅保留署名权？](https://www.zhihu.com/question/50741861)，好感直线下降。

以上便是我目前大致了解到的 ADV/AVG 相关的游戏引擎。

那么已经有这么多的引擎，为什么还要执意造轮子呢？

因为自己日常开发使用 Mac，所以可以排除掉大半，去掉过于古老的，去掉客户端开发的，再排除掉鸽子和变态（~~开玩笑，当然这个不是主要原因，难道是次要的？？？~~）。

我想要制作一个更偏向于前端、轻量可扩展的 AVG 游戏引擎（框架？），尽可能使用 HTML/CSS 本身属性效果替代 Canvas 绘制。

其次，即便功能相似，只要语言不同，对于不同语言的偏好者便有其存在的意义，就不算重复造轮子，有了 Spring Boot，同样也有 Express/Koa/Nest.js、Laravel、Django 的诞生。

（~~至于跑在浏览器，又有什么比得过 JavaScript 的天然优势呢？~~）

### 怎么做？

目前预定的技术栈是 TypeScript + Vue@3.0。

规范开发，上 TypeScript 已经无须异议。

而 Vue3 正式版总算姗姗来迟，且本身便使用了 TypeScript 重写，对 TS 的支持也有了提升。（次要原因则是练习一下 Vue3 啦。~~👴 学不动了~~）

> 为什么不用 React？AVG.js 便是基于 React，翻新这件事应该原 🐦 本人来做，而我用 React 重写类似功能一来未必胜过原作，二来也未必有必要。此外个人 Vue 相比 React 要熟悉一些。

#### 词法解析

但是在此之前，我们应当有一个剧本文本解析器，用于解析按照一定格式编写的剧本。

目前打算参照 [liber-language](https://github.com/librian-center/liber-language)，采用 JS 实现，并在浏览器端展示实时解析的效果。

至于剩下的……，等我先写完当前的再说吧！

...

---

To Be Continued.
