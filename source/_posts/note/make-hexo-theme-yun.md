---
title: hexo-theme-yun 制作笔记
date: 2019-04-27 12:00:00
updated: 2020-03-24 12:00:00
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

起初打算叫做 `Starry`，在咕咕咕的期间发现已经有人做了这个名字的主题，遂改名为 `Yun`。

## Progress

发布历史及功能增删直接看 [releases](https://github.com/YunYouJun/hexo-theme-yun/releases) 就可以了，在这里记录 CHANGELOG 似乎也没啥意义。

所以可能只是单纯写写开发过程中想法的记录。

### v0.0.1 (2019-05-19) 试验

自己充当自己的小白鼠，Bug 多多

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
