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

> GitHub: <https://github.com/YunYouJun/adv>
> Demo: <https://adv.yunyoujun.cn>

## 前言

按照惯例，开坑前先来三问。是什么？为什么？怎么做？

<!-- more -->

### ADV 是个啥？

> 冒险游戏（Adventure Game，缩写为 AVG 或 ADV）是电子游戏中的最早的类型之一。此类型游戏采取玩家输入或选择指令以改变行动的形式。强调故事线索的发掘及故事剧情，主要考验玩家的观察力和分析能力。该类游戏有时候很像角色扮演游戏，但不同的是，冒险游戏中玩家操控的游戏主角本身的等级、属性能力一般是固定不变并且不会影响游戏的进程。
> 通常 galgame 类型为 ADV 形式的，不是纯剧情+CG+选项的，而带一些其他方式操作，比如游戏里有卡牌对战或者战斗场面（例：恋姬无双）。
> —— 摘自[「百度百科 - ADV」](https://baike.baidu.com/item/ADV/5109709)

简而言之，平时我们常见的 [Galgame](https://baike.baidu.com/item/Galgame) / 视觉小说便是 ADV/AVG 的一种。

> Galgame（日文假名：ギャルゲーム，平文式罗马字：Gyaru Gēmu，又称美少女游戏）是一种玩家可以与动画美少女进行互动的电子游戏，其受众主体曾经是日本男性，但现在的全年龄 GalGame 剧情面向受众已经不分男女。Galgame 的游戏类型大多数是 VNG（视觉小说）但是也有交互式的 Galgame。
> —— 摘自[「百度百科 - Galgame」](https://baike.baidu.com/item/Galgame)

一般情况下，Galgame ∈ ADV = AVG。

> [ADV、AVG 和 Galgame 有什么区别？](https://www.zhihu.com/question/65520382)

### 为啥要做 ADV 游戏引擎？

#### 调研

ADV/AVG 的游戏引擎已经有很多，但都各有千秋。

> [视觉小说引擎列表 - 维基百科](https://zh.wikipedia.org/wiki/%E8%A7%86%E8%A7%89%E5%B0%8F%E8%AF%B4%E5%BC%95%E6%93%8E%E5%88%97%E8%A1%A8)

**以下是个人的调研（搜索）简要评估，仅为个人观点，欢迎指正。**

- [吉里吉里](https://zh.wikipedia.org/wiki/%E5%90%89%E9%87%8C%E5%90%89%E9%87%8C): C++，老牌 AVG 游戏引擎，著名的 Fate/stay night 便是用其制作。但是上一个稳定版本已经是十年前，很久没有更新了。
- [Ren'Py](http://www.renpy.org/): Python，代表作「心跳文学部」(~~我老婆的 [Tittwer](https://twitter.com/lilmonix3)~~)，开源万岁，并且直到现在更新也很活跃，如果喜欢 Python，是个不错的选择。不过需要预编译，剧本与程序未分离。（定位于浏览器端的话，JS 更有优势。）
- [NScripter](http://www.nscripter.com/): C++，非商业免费，Windows 平台，代表作「寒蝉鸣泣之时」，上一个稳定版本发布于 2015 年。
- [AVG32、RealLive、SiglusEngine](https://zh.wikipedia.org/wiki/Visual_Art%27s)：[Visual Art's](http://visual-arts.jp/) 公司开发，Key 社游戏「CLANNAD」等均用此开发，但很明显这种商业级咱接触不到。
- [BKEngine](https://bke.bakery.moe/): C++，面包工坊，非商业免费、跨平台，但是制作工具不跨平台（只有 Windows）。
- [AVG.js](https://avgjs.org/)：JavaScript，开源，基于 Pixi.js 与 React，Web 端运行。但是作者 [Icemic](https://github.com/Icemic) 是个大 🐦，所以已经几年没有更新了。（不过作者也在 BKEngine 的面包工坊。）
- [Librian](https://github.com/RimoChan/Librian): Python，开源，跨平台，Galgame | Visual Novel 引擎，[作者](https://github.com/RimoChan) 还有在做 [Vtuber](https://space.bilibili.com/546884063/)，可惜是个变态。
- [橙光制作工具](https://www.66rpg.com/redirect/doDownload)：免费易操作，只有 Windows 平台，但是因为 [如何看待橙光游戏签约合同中版权永久属于橙光，而作者仅保留署名权？](https://www.zhihu.com/question/50741861)，好感直线下降。

以上便是我目前大致了解到的 ADV/AVG 相关的游戏引擎。

那么已经有这么多的引擎，为什么还要执意造轮子呢？

因为自己日常开发使用 Mac，所以必须得支持跨平台，基本可以排除掉大半，去掉过于古老的，去掉客户端开发的，再排除掉鸽子和变态（~~开玩笑，当然这个不是主要原因，难道是次要的？？？~~）。

我想要制作一个更偏向于前端、轻量可扩展的 AVG 游戏引擎（框架？），尽可能使用 HTML/CSS 本身属性效果替代 Canvas 绘制。（当然，后续 Canvas 可以用于一些复杂的 3D 场景、模型之类的展示。）

目前尚未发现同类型项目，其次，即便功能相似，只要语言不同，对于不同语言的偏好者便有其存在的意义，就不算重复造轮子，有了 Spring Boot，同样也有 Express/Koa/Nest.js、Laravel、Django 的诞生。

（~~至于跑在浏览器，又有什么比得过 JavaScript 的天然优势呢？~~）

> 近年来，也有云游戏的概念诞生，但此多基于视频流。对于 AVG/ADV 类型游戏来说，显然是不划算的，我们完全可以将压力不大的运算放到用户浏览器，将需要额外加载的图片/音频等资源放至云端的 CDN，只预加载临近的资源。既降低了带宽压力也不用担心操作的延迟。

浏览器自带的控制台、可选中的元素、可扩展的前端 UI 与背靠 Node.js npm 庞大生态的程序也很适合做 [Meta Game - 元游戏](https://en.wikipedia.org/wiki/Metagaming)。

> [metagame 是什么？ - 知乎](https://www.zhihu.com/question/23820876)

#### 技术之外的原因

高中时，朋友向我推荐了「Fate/stay night」，并借我 U 盘拷贝。但家里的古董电脑不知为何总是安装失败，好不容易解决了玩了没多久便报了各种兼容错误。所以至今我也未曾进一步了解 Fate 系列的作品。

第一次看完「CLANNAD」的时候，我在宿舍感动地泪流满面，以至于怅然若失。便想要找来游戏以备日后重温，游戏大小 2/3G，加之宿舍带宽才 2M（是的，你没看错，是个位数！很老的线路，后来才有新的线路铺来），再者电脑系统那时都已经 Win8 及以上了。

而 CLANNAD 的平台则分别是 Windows 98/Me/2000/XP(初回限定版/通常版)，Windows 2000/XP/Vista/7(完全语音版/全年龄对象版)。期间自又有一番曲折。

过了感伤的时段，也很难再在宿舍中静下心来回顾，到了排队等各类需要消磨时间的情况时，又会想着要是能在手机上游玩就好了。（看官您可能要说了，装虚拟机啊等等的方式应有尽有。但因为贫穷，手机容量本就捉襟见肘，套壳的各类体验也未必佳。）所以除此之外，从根本上有一种更为便捷的方式该有多好。

我始终觉得 AVG/ADV 一类对性能不敏感（但占用空间较大、CG/语音动辄数 G）的文字冒险游戏，将其放在云端是最好的选择。用户随时随地可以跨平台游玩，而无需过高性能的机器、充足的本地空间。而已有的此类型游戏的大部分演出效果，在浏览器端也基本可以实现。（当然，这也可能与近年来前端技术大爆炸有关。）

但我一直很奇怪为何很少此类型游戏的诞生。即便有，也是少数兴趣之作的 Demo。

当然，我能想到的有旧时代浏览器性能特性不足、服务器成本高、网速慢、游戏资源无法加密等。不过放到现今，却可排除大半，Chrome 无须多言，游戏的静态资源无需频繁更改，平均下来成本并不高，~~5G时代~~网速还行，游戏资源本就有各类技巧提取，此外对于正版验证，反而线上账户更有利。

我很早前便有此想法，几年前发现了 [AVG.js](https://avgjs.org/) ，认识了 [Icemic](https://github.com/Icemic)，但没想他一鸽便鸽至如今。后来又发现了 [Librian](https://github.com/RimoChan/Librian)，认识了到了 [RimoChan](https://github.com/RimoChan) ~~的变态~~，但终究与我期望的想法与设计偏好有所冲突。

除此之外，我也未能在开源社区，找到类似定位与功能的 AVG/ADV 引擎。

回顾起来，自己写过不少玩具项目，也干过不少活，提过些无关紧要的 PR，混了些 Star。
但就像东一榔头，西一棒槌，没有一个持之以恒的施力点。

> 虽然此前还整过个[机器人项目](https://github.com/YunYouJun/el-bot)，但因为依附 QQ 与腾讯的垄断策略而行走在灰色边缘，也亲眼见证了晨风作者被抓、酷 Q 关闭等风声鹤唳。我仍旧会坚持维护（毕竟自己有在用），但也很难再投入过多精力于其上。

真让我拿出一个自鸣得意、有完善生态体系的大项目，我反倒无言以对。

社区中见到的大牛们也多是专注围绕一个点，展开自己的工作，并持之以恒。譬如 尤雨溪与 Vue.js、Mike Bostock 与 D3.js、mrdoob 与 Three.js……（你问我为啥提这三个？因为感觉好像刚好可以用到。）

而写 AVG/ADV 引擎的上限可以很高，可以研究的内容也很多。~~我也有将自己无人问津的小说游戏化的打算。~~

至此，我决定从零开始，遵循本心，面向未来，开始这一项目。

### 怎么做？

且慢，万事开头难，起名最优先。

为了凸显大气，并避免与 AVG.js 重名，我决定将其命名为 ADV.js。（不过似乎少了很多个性化的感觉，所以还不确定是否是最终的名字。有啥好的建议欢迎提出！）

> 其次是因为「命运石之门」等一系列 5pb 作品，官方将之称为科学 ADV 系列，索性便也取此 ADV 之名。

目前预定的技术栈是 TypeScript + Vue3。

规范开发，上 TypeScript 已经无须异议。（虽然还是会有很多 `any` 的样子。）

而 Vue3 正式版总算姗姗来迟，且本身便使用了 TypeScript 重写，对 TS 的支持也有了提升。（次要原因则是练习一下 Vue3 啦。~~👴 学不动了~~）

> 为什么不用 React？AVG.js 便是基于 React，翻新这件事应该原 🐦 本人来做，而我用 React 重写类似功能一来未必胜过原作，二来也未必有必要，三则设计理念与最终目的也不尽相同。此外个人 Vue 相比 React 要熟悉一些。并打算更面向未来。

本身想要在浏览器端实现各种效果，必然要使用许多新特性。（Chrome 天下第一，兼容 IE 是不可能的，这辈子不可能的。）

为了面向未来，也顺带直接上 [vite](https://github.com/vitejs/vite)。踩了不少坑（等咱这基本完善了，它也差不多稳定了吧），但一个字，快！

游戏内容无需也不应该考虑 SEO，本身内容演出也全部通过直接请求文本并实时解析。（面向未来，axios 都没有安装，直接用了 fetch，\_(:з」∠)_ 虽然可能后续还是会用到）

这样对于编剧来说，只要简单的更改文本，而无需重新构建。

#### 词法解析

但是在此之前，我们应当有一个剧本文本解析器，用于解析按照一定格式编写的剧本。

目前打算兼容 Markdown 语法，并采用 JS 实现，以在浏览器端展示实时解析的效果。

至于剩下的……，等我先写完当前的再说吧！

- GitHub: [@advjs/parser](https://github.com/advjs/parser)
- Demo: [Demo for @advjs/parser](https://advjs.github.io/parser/)

...

#### 人物立绘

...

后续可能有（🐦）的其他内容，自定义配置文件（支持 JSON/YML ?）、多设备适配、支线选项控制、音乐系统（BGM 与配音）、摄像机系统（镜头）、立绘与 Live2D、front-matter 与更多兼容 Markdown 的剧本语法及自定义脚本、进度存储读取槽（本地 localStorage/ 网络 MongoDB）、场景路由、背景管理（融合 3D）、人物小传/关系、UI 主题、资源一键 CDN/预加载……

其他 [Todo](https://github.com/YunYouJun/adv/projects/1)。

---

To Be Continued.
