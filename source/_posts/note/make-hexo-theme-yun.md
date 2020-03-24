---
title: hexo-theme-yun 制作笔记
date: 2019-04-27 12:00:00
updated: 2020-03-24 20:00:00
tags:
  - 项目
  - 笔记
  - 分享
  - GitHub
categories:
  - 云游的小笔记
---

Hexo-Theme-Yun 绝赞开发中~

## 前言

还在用 `WordPress` 的时候，总是喜新厌旧，经常换主题。且装了一堆插件，速度慢还容易崩。
而迁移到 `Hexo` 之后（小水管服务器太慢，拿去挂 MC 了。~~根本原因是没钱~~），光是 `hexo-theme-next` 的配置项，便让我花了好一番功夫。
导致觉得自己不一直用下去，感到十分对不起仔细一个一个配置过来的自己。

当然，还是改不了喜新厌旧的毛病。加之 next 主题过于广泛，显得自己泯然众人。心中颇有愤懑。（~~虽然本就如此~~）

而如今，诸事已毕，终于腾出空来。
便决定开发一款属于自己的主题。

<!-- more -->

暂且命名为 [hexo-theme-starry](https://github.com/YunYouJun/hexo-theme-starry)。
现更名为 [hexo-theme-yun](https://github.com/YunYouJun/hexo-theme-yun)。

然而，其实还并没有写多少，所以只是占位与预告。

嗯，预告！（~~谁说没人看的博客就不能有预告了！？~~）

- GitHub: <https://github.com/YunYouJun/hexo-theme-yun>
- Docs: <https://yun.yunyoujun.cn>
- Example: <https://www.yunyoujun.cn>

### 名字的由来

起初打算叫做 `Starry`，向往星空的美丽，在咕咕咕的期间发现已经有人做了这个名字的主题，遂改名为 `Yun`。

因为确实没有重名了，也是自己常用 ID 的一部分，遮住星空的也自然是云了。

## 设计风格

起初咱也打算遵循 [Google Material Design](https://material.io/) 风格来设计（很喜欢），顺便也借用了栅格、卡片和按钮等组件。所以最初能够快速成型。

但是自己的想法偶尔还是会和设计规范冲突，而且作为自己的主题，肯定希望它更独一无二一点。此后便渐渐移除原先引入的 Materail CDN，改用自己的审美来实现。
同时也能减少引入文件的大小。

微软的 [Fluent UI](https://www.microsoft.com/design/fluent/) 我也很喜欢，线条、扁平的设计风格。

还有当初看了 [【洛天依原创】异样的风暴中心【杉田朗】](https://www.bilibili.com/video/av4018008)、[【洛天依原创】星宿计时【杉田朗】](https://www.bilibili.com/video/av7036967) 的 PV（歌也很好听！），
里面的动效、线条设计也觉得很是喜欢。（顺带去问了 PV 作者 [Eight-脑感电波-](https://weibo.com/aaapplemilk) 能否参考，得到肯定答复后，……，我就咕咕咕了。）

> 10 Years Later ...

于是乎，自己的四不像主题诞生了。（还是太菜了。）

文章的 Markdown 样式，其实是大致使用的我此前写的一个 [star-markdown-css](https://github.com/YunYouJun/star-markdown-css)。（这也是此前的主题名也打算叫做 `Starry` 的原因之一。）

[star-markdown-css](https://yunyoujun.github.io/star-markdown-css/) 是我编写的 Markdown 样式（也就是转译后常见 HTML 标签样式），大致构想是编写多种有趣好看的文本主题样式，同时也可以作为 CDN 由用户自行引入，自由切换。

为了可以自由设置主题色，还是进行了些许修改直接写在了 `stylus` 里。（日后也许还是会分离？自选文本样式主题？咕咕咕！）

## Progress

发布历史及功能增删直接看 [releases](https://github.com/YunYouJun/hexo-theme-yun/releases) 就可以了，在这里记录 CHANGELOG 似乎也没啥意义。

所以可能只是单纯写写开发过程中想法的记录。

### v0.0.1 (2019-05-19) 试验

自己充当自己的小白鼠，Bug 多多。

### v0.1.0 (2020-03-06) 优化

移除 jQuery 依赖

更快、更高、更强！？？？

fancybox 的确用的不多，但又依赖于 jQuery。
~~决定使用 [medium-zoom](https://medium-zoom.francoischalifour.com/) 替代~~，并全部使用 Vanilla JavaScript，以移除 jQuery。
medium-zoom 干脆也别用了，大家都会右键的\_(:з」∠)\_
jQuery 的确用起来很爽，但这位老前辈已经将它的理念逐渐融入现代浏览器的标准 API 中（譬如 `querySelector`、`classList.add|remove|contains`），所以使用原生 JS 来写往往更有优势。

也能加深对原生 JavaScript 的理解。

![pagespeed-insights-score.png](https://i.loli.net/2020/03/12/cUIuDPJfo379ZOk.png)_谷歌 [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)_

![Audits - Lighthouse](https://i.loli.net/2020/03/08/DhfLu5yngb7NZE2.png)_谷歌浏览器 Audits - Lighthouse 检测分数_

尽可能使用 CDN，提高访问速度。也算是符合了 云 ☁️ 的名字。

虽然很想用 WebP，奈何万恶的 Safari 与 iOS 不支持，故又都切回了 JPG。

最后似乎变成了面向 Audits 优化。

---

顺道给大家看看主题特色功能？[老婆展示页](https://www.yunyoujun.cn/girls/)？

### v0.2.0 (2020-03-17) 修补

拖拖拉拉，直到最近才算较为完善，查漏补缺，开始小宣传。

为了宣传主题，写了篇小教程 [教你如何从零开始搭建一个属于自己的网站](https://www.yunyoujun.cn/share/how-to-build-your-site/)。

但愿不是买椟还珠。

### v0.3.0 (2020-03-23)

移除 embeddedVideoTransformer ，[hexo-tag-aplayer](https://github.com/MoePlayer/hexo-tag-aplayer) 太香了。

### 2020-03-24

改使用 [SATA 协议(The Star And Thank Author License (SATA))](https://github.com/zTrix/sata-license)，笑。

---

持续迭代 ing...

---

To Be Continued.

<!-- Q.E.D. -->
