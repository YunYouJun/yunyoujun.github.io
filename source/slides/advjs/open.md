---
title: ADVJS 开题答辩
date: 2020-06-23 16:27:24
updated: 2020-06-23 16:27:24
layout: slide
slide:
  separator: ===
  theme: white
  config:
    history: true
    mouseWheel: true
---

<link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet">

<style>
.reveal {
  font-family: PingFang SC;
  font-weight: 300;
}

i[class^="ri-"] {
  vertical-align: -0.15em;
}

hr {
  opacity: 0.3;
}

.reveal img {
  margin: 0px;
}

.large-icon {
  font-size: 6rem;
}

.reveal ul {
  margin: 0;
}

iframe {
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  border: none;
}
</style>

## 跨平台文字冒险游戏引擎<br/>研究与实现

<i class="ri-gamepad-line" style="font-size: 6rem;"></i>

19 硕士 1 班 杨睿

<small><i class="ri-computer-line"></i>计算机应用技术 数字娱乐与动画技术<i class="ri-game-line"></i></small>

导师：温宇俊、李春芳

<small>2020.11.27 <i class="ri-community-line"></i> 中国传媒大学</small>

Note: 老师们中午好。

===

### 背景与意义

<i class="ri-question-line" style="font-size: 6rem;"></i>

~~

#### [Newzoo 2020 全球游戏市场报告](https://newzoo.com/insights/trend-reports/global-games-market-report-2020-chinese/)

<!-- https://resources.newzoo.com/e2t/tc/VV_kZ289GwJnW6P2Vgt5T1mcQW1KLHGL4jSn21N76MZ_m3p_9LV1-WJV7CgHFPW1Q4-_r2pJ_pbM6wRFDJD8MzW52sjTM3CZF9QN4H2mqf7GbwJW7PN7Fb8XSM4hW5FlbDv57-HNkW66MR7Y5x82BZW5zGsp73LYrrrVCsRS85DhXjxN8lLKCRXXWdXW4NtfXY5QGsmLW3jsdy23QCFRpW8lHjwF32zD7JW5xmQLL35CTF6W2ylnDy3rtFr9W2TXXkK8_MmjXW7J2BWT4-94CGW40vNXW5-lBq4W2xfRmX4kPjbqW5Wq30d7Xjym6W66BwcC7Gd4XHVTX1gx1X2GR8W45TwsS9l8mxSW5JDQ3d91R7xlW77hvXm3pQcFVW6_CsQv8xdhz0W46PPNr32Z9TQW2TP-LD4flcyR3nvX1 -->

<i class="ri-group-line"></i> ⬆
<i class="ri-money-cny-box-line"></i> ⬆
<i class="ri-eye-line"></i>

- 全球游戏玩家数量 ⬆，2023 > 三十亿。
- 全球游戏市场收入将在 2020 年 ⬆ 1593 亿美元，⬆ 9.3%。
- 未来，游戏如何成为新的社交媒体 <i class="ri-group-line"></i>，以及下一代游戏机会否带来新的商业模式等。

Note: 由全球游戏、电竞及移动市场的数据研究分析公司 Newzoo 发布

简而言之，用户/经济/关注度均在上升

~~

COVID-19

游戏 —— 居家娱乐活动

<small>用户活跃度/游戏收入 ⬆</small>

为越来越多的人所接受

~~

新模式 云游戏

<i class="ri-cloud-line"></i> + <i class="ri-game-line"></i>

- 微软 <i class="ri-microsoft-line"></i> xCloud
- 谷歌 <i class="ri-google-line"></i> Stadia
- 腾讯 <i class="ri-qq-line"></i> START
- 索尼 <img style="margin:0px;" width="40" src="https://simpleicons.org/icons/playstation.svg" alt="Play Station"> PlayStation Now

Note: 云游戏也称为游戏点播，它可以让玩家在任何设备上游玩游戏，而无需拥有运行游戏所需的实体硬件或本地游戏文件。

此外还有云游戏的模式诞生，有限的硬件资源。

著名的几大厂商也在布局。

~~

回到主题

~~

什么是文字冒险游戏？

---

ADV/AVG => Adventure Game

> Galgame/视觉小说 ∈ ADV = AVG

Note: ADV 可以说是电子游戏中的最早的类型之一。此类型游戏以剧本内容为主，采取玩家输入或选择指令以改变行动的形式。强调故事线索的发掘及故事剧情，主要考验玩家的观察力和分析能力。该类游戏有时候很像角色扮演游戏，简化了沉浸式的画面/交互，但也因此有更多精力开发扩展更多的故事内容/支线。

~~

<img width="300" src="https://i.loli.net/2020/11/25/V9H2sU3LSYZuIfP.png" alt="巨洞冒险" />

1977 巨洞冒险

威廉·克罗塞

<small>ARPANET (Internet 前身) 设计者之一</small>

<!-- 1979年雅达利公司设计的《魔幻历险》是《巨洞冒险》的改良版，此游戏有添加图形，亦是世上第一个添加彩蛋的电子游戏。 -->

Note:

有趣的是，它的起源正与因特网与人工智能的起源微妙地纠缠在了一起。

克罗赛为了让女儿以及非电脑使用族群能够轻松玩游戏。设定玩家使用自然语言输入指令，而非标准化指令。

1976，史丹佛大学人工智能实验室程序员唐纳德·伍兹，扩充了此游戏。

~~

为什么要做 ADV 游戏引擎？

Note: ADV/AVG 的游戏引擎已经有很多，但都各有千秋。

~~

| 引擎    |                                                                                                             | 特点          |
| ------- | ----------------------------------------------------------------------------------------------------------- | ------------- |
| Cocos   | <img width="60" src="https://www.cocos.com/wp-content/themes/cocos/image/apple-touch-icon.png" alt="Cocos"> | 移动端/轻量   |
| Unity   | <img width="60" src="https://simpleicons.org/icons/unity.svg" alt="Unity">                                  | 多平台/通用   |
| Unreal  | <img width="60" src="https://simpleicons.org/icons/unrealengine.svg" alt="Unreal Engine">                   | PC 渲染质量高 |
| Blender | <img width="60" src="https://simpleicons.org/icons/blender.svg" alt="Blender">                              | 建模为主      |

Note: 目前已有的引擎，以其各自的优势与定位占有一席之地。

其本身还是一个通用型的游戏引擎，可以用来做任意类型的游戏。

想要制作一个拥有大量文本的文字冒险游戏，使用他们来制作过于繁琐。
游戏开发商/甚至玩家自己也是游戏的制作者，只想要快速实现自己的想法创意，而不想被其他冗余的功能干扰，便会因此诞生出特定领域的游戏引擎。

~~

<i class="ri-microscope-line large-icon"></i>

调研

~~

<small>

| 引擎         | 代表作          |                                                                                                                                 |                                                |                         |
| ------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ----------------------- |
| KiriKiri     | Fate/stay night | <img width="120" src="https://i.loli.net/2020/11/26/V36fWETGKhlNzmy.png" alt="Fate/stay night">                                 | IP 周边游戏 FGO 历史总收入突破 50 亿美元       | Fate 系列 2006 活跃至今 |
| Ren'Py       | 心动文学俱乐部  | <img width="120" src="https://i.loli.net/2020/11/26/bztegG7wd1UNryY.png" alt="心动文学俱乐部">                                  | 2017 IGN 最佳游戏奖 亚军                       | Meta Game               |
| NScripter    | 寒蝉鸣泣之时    | <img width="120" src="https://upload.wikimedia.org/wikipedia/zh/0/07/Higurashi_no_Naku_Koro_Ni_V1.jpg" alt="心动文学俱乐部">    | 相继被改编为动画/电影                          | 同人游戏 典范           |
| SiglusEngine | CLANNAD         | <img width="120" src="https://upload.wikimedia.org/wikipedia/zh/c/c5/CLANNAD_PC_common_version_cover.jpg" alt="心动文学俱乐部"> | 游戏豆瓣评分 9.4 ，改编动画一二季评分 8.9、9.4 | TOP250                  |

</small>

~~

明日方舟剧情系统

![明日方舟剧情系统.png](https://i.loli.net/2020/11/26/T1JEjLmxa7Notq3.png)

Note: 其他类型游戏，同样也有类似的剧情系统。

~~

#### <i class="ri-settings-line"></i> 各有千秋

<small>

- [KiriKiri](https://zh.wikipedia.org/wiki/%E5%90%89%E9%87%8C%E5%90%89%E9%87%8C): C++，老牌 AVG 游戏引擎，著名的 [Fate/stay night](https://zh.wikipedia.org/zh/Fate/stay_night) 便是用其制作。但是上一个稳定版本已经是十年前，很久没有更新了。
- [Ren'Py](http://www.renpy.org/): Python，代表作「[心跳文学部](https://zh.wikipedia.org/zh-hans/%E5%BF%83%E8%B7%B3%E6%96%87%E5%AD%B8%E9%83%A8%EF%BC%81)」，开源，更新活跃。不过需要预编译，剧本与程序未分离。Web 端采用 Web Assembly 的解决方案，难以实现实时解析与更多特性的跨平台。
- [NScripter](http://www.nscripter.com/): C++，非商业免费，Windows 平台，代表作「[寒蝉鸣泣之时](https://zh.wikipedia.org/wiki/%E6%9A%AE%E8%9F%AC%E6%82%B2%E9%B3%B4%E6%99%82)」，上一个稳定版本发布于 2015 年。
- [AVG32、RealLive、SiglusEngine](https://zh.wikipedia.org/wiki/Visual_Art%27s)：[Visual Art's](http://visual-arts.jp/) 公司开发，Key 社游戏「[CLANNAD](https://zh.wikipedia.org/zh/CLANNAD)」等均用此开发，商业不开源，无法跨平台。
- [BKEngine](https://bke.bakery.moe/): C++，面包工坊，非商业免费、跨平台，但是制作工具不跨平台（只有 Windows）。
- [AVG.js](https://avgjs.org/)：JavaScript，开源，基于 Pixi.js 与 React，Web 端运行。四年未更新。（作者同在 BKEngine 的面包工坊。）
- [Librian](https://github.com/RimoChan/Librian): Python，开源，跨平台，Galgame | Visual Novel 引擎。需预编译。
- [橙光制作工具](https://www.66rpg.com/redirect/doDownload)：免费易操作，只有 Windows 平台，功能弱，限制多。此外 「[如何看待橙光游戏签约合同中版权永久属于橙光，而作者仅保留署名权？](https://www.zhihu.com/question/50741861)」。

</small>

Note: 大多停更/编写使用繁琐/无法跨平台/技术陈旧

每个人都能快速创作出自己的游戏/实现自己的想法

我也认识了 [AVG.js](https://avgjs.org/) 的作者 [Icemic](https://github.com/Icemic) 与 [Librian](https://github.com/RimoChan/Librian) 的作者 [RimoChan](https://github.com/RimoChan)，但终究与我期望的想法与设计偏好有所冲突。

~~

不仅仅是文字冒险游戏

- 实时解析
- 剧本演出
- 立绘生成
- ...

~~

<i class="ri-game-line" style="font-size: 6rem;"></i>

游戏 = 快乐

~~

<i class="ri-cloud-line" style="font-size: 6rem;"></i>

云 = 随时随地

~~

<i class="ri-cloud-line" style="font-size: 6rem;"></i> <i class="ri-add-line" style="font-size: 6rem;"></i> <i class="ri-game-line" style="font-size: 6rem;"></i>

云游戏

让每个人都能随时随地享受到快乐

~~

<i class="ri-gamepad-line large-icon"></i>

<i class="ri-windows-line"></i>
<i class="ri-apple-line"></i>
<i class="ri-ubuntu-line"></i>

跨平台

<i class="ri-mac-line"></i>
<i class="ri-macbook-line"></i>
<i class="ri-tablet-line"></i>
<i class="ri-smartphone-line"></i>

让每个人随时随地创造分享快乐

~~

<img src="https://i.loli.net/2020/11/26/cydGhkHvztNYj6P.png" width="500">

Ready Player One

> Thanks for playing my game.  
> —— James Halliday

~~

便是游戏本身意义所在

===

### 内容与思路

<i class="ri-mind-map large-icon"></i>

~~

<i class="ri-error-warning-line"></i> 存在的问题

- 游戏包体过大
- 平台限制过多
- 制作流程繁琐
- 盗版资源横行
- ...

~~

<i class="ri-pushpin-2-line"></i> 可行性支持

- AVG 游戏性能不敏感
- 不断提升的浏览器特性
- 强大的 WebGL 绘制能力
- 丰富的社区公共库资源
- 云端校验
- 资源 CDN
- 5G
- ...

~~

云游戏

<del><i class="ri-video-line"></i>视频流</del>

按需加载的应用程序

<i class="ri-live-line"></i> 文本实时解析/绘制

Note: 云游戏并不仅仅是视频流的实现方案，而是一个按需加载的应用程序。AVG 类型游戏本就对性能不敏感，而游戏本体却往往非常巨大，

视频流对于运营商成本过高。

地区各节点布置服务器。只有大厂商能做。

只传输必要的数据流，客户端按需加载，渲染。

~~

<img width="300" src="https://media.prod.mdn.mozit.cloud/attachments/2019/06/14/16742/4a5f228a878fe1e8de5213bdb599eeef/pwa.png" alt="PWA">

渐进式 Web 应用 (PWA)

- 可被发现
- 易安装
- 可链接
- 独立于网络
- 渐进式
- 可重用
- 响应性
- 安全

===

### 方法与过程

<i class="ri-tools-line large-icon"></i>

~~

<i class="ri-file-text-line"></i> 基于 Markdown 的剧本解析器

> 像写小说一样制作 ADV

定义剧本语法 & 文本解析器 & 实时解析

Note: 例如本 Slides 便是通过 Markdown 按照一定规范编写，自动生成。

~~

All in Text.

文本驱动

~~

时间 地点 人物

~~

故事 场景 立绘

~~

[A documental approach to adventure game development](https://www.sciencedirect.com/science/article/pii/S0167642307000524)

Markup

```html
<adv-game></adv-game>
```

~~

[markdown-it](https://github.com/markdown-it/markdown-it) VS [marked](https://github.com/markedjs/marked)

<iframe width="1200" height="600" src="https://adv.js.org/parser/"></iframe>

Note: markdown-it，vuepress 等文档工具所采用，可扩展。

~~

<iframe width="1200" height="600" src="https://adv.yunyoujun.cn/#/demo"></iframe>

~~

面向未来的 AR UI 框架 —— [Augma](https://augma.elpsy.cn)

<i class="ri-palette-line large-icon"></i>

~~

语法约定的 UI 框架

- 单色
- 透明度
- 可配置的深度/位置信息
- 与现实场景区分而不突兀

Note: 一套可以通过语法进行配置的 UI 组件库。

~~

![Augma.png](https://i.loli.net/2020/11/26/ftZEm5rN4iz7MDs.png)

Vue + Vite + Vitepress

~~

AK-UI

<iframe width="1200" height="600" src="https://ak-ui.yunyoujun.cn/components/ak-panel.html#ak-status-%E7%8A%B6%E6%80%81%E6%A0%8F"></iframe>

Note: 陀螺仪

~~

<i class="ri-user-line"></i> Live2D

会动的 2D 人物角色

<iframe width="1000" height="400" src="https://www.zhangxinxu.com/sp/demo/live2d/"></iframe>

~~

AR.js + Web Live2D

![Live2D with AR](https://i.loli.net/2020/11/26/bd2McTgkZWDh5X7.png)

Note: 其实之前 LM 同学已经演示过了 Web AR 的效果。

> [CubismWebARSample](https://github.com/Live2D/CubismWebARSample)

~~

文本情感分析？

<i class="ri-file-text-line"></i>
<i class="ri-arrow-right-line"></i>
<i class="ri-emotion-line"></i>

~~

<i class="ri-user-2-line"></i> [Vtuber](https://vtuber.yunyoujun.cn/)

快速制作人物动画

Note: Web 端 Vtuber 的可能

~~

<i class="ri-text"></i>
<i class="ri-arrow-right-line"></i>
<i class="ri-image-line"></i>

<small>

[StackGAN](https://github.com/hanzhanggit/StackGAN)

[StackGAN: Text to Photo-realistic Image Synthesis with Stacked Generative Adversarial Networks](https://arxiv.org/pdf/1612.03242v1.pdf)

</small>

<img height="350" src="https://github.com/Kuntal-G/StackGAN/raw/master/examples/framework.png">

Note: 文本转图片 描述鸟 生成鸟相关的图

~~

![yellow bird](https://github.com/hanzhanggit/StackGAN/raw/master/examples/bird1.jpg)
![flower](https://github.com/hanzhanggit/StackGAN/raw/master/examples/flower1.jpg)

~~

<i class="ri-women-line"></i>

<small>

- [WAIFU LABS](https://waifulabs.com/): <i class="ri-image-line"></i><i class="ri-arrow-right-line"></i><i class="ri-image-line"></i>
- [MakeGirlsMoe](https://make.girls.moe/#/): <i class="ri-text"></i><i class="ri-arrow-right-line"></i><i class="ri-image-line"></i>
- [This Waifu Does Not Exist](https://www.thiswaifudoesnotexist.net/): Random <i class="ri-image-line"></i> & <i class="ri-text"></i>

</small>

<img width="600" src="https://i.loli.net/2020/11/26/OkTzCaSK4bgwc6x.png" alt="MakeGirlsMoe">

~~

<i class="ri-landscape-line"></i> 场景风格化 Low Poly

![low-poly.jpg](https://i.loli.net/2020/11/26/BqJmbXeLosOaDkI.jpg)

~~

<i class="ri-shape-2-line"></i> 2D in 3D

<img width="600" src="https://i.loli.net/2020/11/26/BTjYV6qyOHs2fUb.jpg" alt="2D in 3D shadow">

Note: 把人物立绘放到现实场景的图片中，自动对人物图片进行一些如阴影等效果的处理以达到尽可能和谐的效果。

~~

<i class="ri-vuejs-line large-icon"></i>

Vue 不仅仅是 Vue

<img width="60" src="https://www.cocos.com/wp-content/themes/cocos/image/apple-touch-icon.png" alt="Cocos">
<img width="60" src="https://simpleicons.org/icons/unity.svg" alt="Unity">

---

- 生命周期
- 组件式开发
- 数据驱动

Note: GitHub 上最为流行的前端框架，与 Cocos / Unity 的生命周期/组件式开发/数据驱动的理念均有相似之处。

~~

Vite

<small>
面向未来的开发构建工具

按需加载 / 极速 / 最新 ES 标准
</small>

<img width="480" src="https://i.loli.net/2020/11/23/6jbnHI3kRfdlZXx.png" alt="尤雨溪发推">

~~

<img width="60" src="https://simpleicons.org/icons/visualstudiocode.svg">
<img width="60" src="https://simpleicons.org/icons/vue-dot-js.svg">
<img width="60" src="https://simpleicons.org/icons/typescript.svg">
<img width="60" src="https://simpleicons.org/icons/d3-dot-js.svg">
<img width="60" src="https://simpleicons.org/icons/webgl.svg">
<img width="60" src="https://simpleicons.org/icons/tensorflow.svg">
<img width="60" src="https://simpleicons.org/icons/github.svg">

---

<img width="60" src="https://simpleicons.org/icons/googlechrome.svg">
<img width="60" src="https://simpleicons.org/icons/safari.svg">
<img width="60" src="https://simpleicons.org/icons/firefoxbrowser.svg">

===

### 目标与计划

<i class="ri-focus-line large-icon"></i>

~~

一个**可用的**智能的跨平台文字冒险游戏引擎

<i class="ri-gamepad-line large-icon"></i>

Note:

我们的专业便是计算机应用技术

我希望能做出一个真正可以应用，一个目前没有的，但在未来真正可以使用的，帮助每一个人快速实现自己想法的产品。

~~

<small>

- 自定义配置文件（支持 JSON/YML）
- 多设备适配
- 支线系统控制
- 音乐系统（BGM 与配音）
- 摄像机系统（镜头）
- 立绘与 Live2D
- front-matter 与更多兼容 Markdown 的剧本语法及自定义脚本
- 进度存储读取槽（本地 localStorage/ 网络 MongoDB）
- 场景路由
- 背景管理（融合 3D）
- 人物小传/关系 知识图谱
- AR 场景
- UI 主题
- CDN/资源校验
- ...

</small>

~~

<small>

| 日期              | 日程                       |
| ----------------- | -------------------------- |
| 2020.12 ~ 2021.01 | 剧本语法 & 解析器          |
| 2021.01 ~ 2021.03 | Live2D & Vtuber            |
| 2021.03 ~ 2021.05 | AR UI Framework            |
| 2021.05 ~ 2021.08 | 引擎开发/整合              |
| 2021.08 ~ 2021.10 | 场景风格化/融合/等探索尝试 |
| 2021.10 ~ 2021.12 | 论文撰写，迭代更新         |
| 2022              | 修改及定稿                 |

</small>

Note: 但显然未必能完全做完。

~~

持续迭代

...

~~

尽力而为

===

Thanks for listening my speech.

<i class="ri-emotion-happy-line large-icon"></i>

Note:

- [A documental approach to adventure game development](https://www.sciencedirect.com/science/article/pii/S0167642307000524):
- [Web AR: A Promising Future for Mobile Augmented Reality—State of the Art, Challenges, and Insights](https://ieeexplore-ieee-org-443.w.cuc.edu.cn/document/8643424/)
