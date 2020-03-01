---
title: hexo-theme-yun
date: 2019-04-27 12:00:00
updated: 2019-04-27 12:00:00
tags:
  - 项目
  - 笔记
categories:
  - 云游的小笔记
---

Hexo-Theme-Yun 制作进行中~

## 前言

还在用 `WordPress` 的时候，总是喜新厌旧，经常换主题。
而迁移到 `Hexo` 之后，光是 `hexo-theme-next` 的配置项，便让我花了好一番功夫。
导致觉得自己不一直用下去，感到十分对不起一个一个配置过来的自己。

当然，还是改不了喜新厌旧的毛病。加之 next 主题过于广泛，显得自己泯然众人。心中颇有愤懑。（~~虽然本就如此~~）

而如今，诸事已毕，终于腾出空来。
便决定开发一款专属于自己的主题。

暂且命名为 [hexo-theme-starry](https://github.com/YunYouJun/hexo-theme-starry)。
现更名为 [hexo-theme-yun](https://github.com/YunYouJun/hexo-theme-yun)。

然而，其实还并没有写多少，所以只是占位与预告。

嗯，预告！（~~谁说没人看的博客就不能有预告了！？~~）

<!-- more -->

### 名字的由来

起初打算叫做 `Starry`，在咕咕咕的期间发现已经有人做了这个名字的主题，遂改名为 `Yun`。

## Progress

### 优化

fancybox 的确用的不多，但又依赖于 jQuery。
~~决定使用 [medium-zoom](https://medium-zoom.francoischalifour.com/) 替代~~，并全部使用 Vanilla JavaScript，以移除 jQuery。
medium-zoom 干脆也别用了，大家都会右键的*(:з」∠)*
jQuery 的确用起来很爽，但这位老前辈已经将它的理念逐渐融入现代浏览器的标砖 API 中（譬如 `querySelector`、`classList.add|remove|contains`），所以使用原生 JS 来写往往更有优势。

也能加深对原生 JavaScript 的理解。

## Thanks

### Ref

- [Hexo 主题开发经验杂谈](https://molunerfinn.com/make-a-hexo-theme/)
- [hexo-theme-next](https://github.com/theme-next/hexo-theme-next)
- [hexo-theme-melody](https://github.com/Molunerfinn/hexo-theme-melody)

### Inspiration

- [【洛天依原创】异样的风暴中心【杉田朗】](https://www.bilibili.com/video/av4018008)
- [【洛天依原创】星宿计时【杉田朗】](https://www.bilibili.com/video/av7036967)
