---
title: hexo-theme-yun 制作笔记
date: 2019-04-27 12:00:00
updated: 2020-05-31 20:00:00
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

但是自己的想法偶尔还是会和设计规范冲突，而且作为自己的主题，肯定希望它更独一无二一点。此后便渐渐移除原先引入的 Material CDN，改用自己的审美来实现。
同时也能减少引入文件的大小。

微软的 [Fluent UI](https://www.microsoft.com/design/fluent/) 我也很喜欢，线条、扁平的设计风格。

还有当初看了 [【洛天依原创】异样的风暴中心【杉田朗】](https://www.bilibili.com/video/av4018008)、[【洛天依原创】星宿计时【杉田朗】](https://www.bilibili.com/video/av7036967) 的 PV（歌也很好听！），
里面的动效、线条设计也觉得很是喜欢。（顺带去问了 PV 作者 [Eight-脑感电波-](https://weibo.com/aaapplemilk) 能否参考，得到肯定答复后，……，我就咕咕咕了。）

> 10 Years Later ...

于是乎，自己的四不像主题诞生了。（还是太菜了。）

文章的 Markdown 样式，其实是大致使用的我此前写的一个 [star-markdown-css](https://github.com/YunYouJun/star-markdown-css)。（这也是此前的主题名也打算叫做 `Starry` 的原因之一。）

> 细细的字体很好看！

[star-markdown-css](https://yunyoujun.github.io/star-markdown-css/) 是我编写的 Markdown 样式（也就是转译后常见的 HTML 标签样式），大致构想是编写多种有趣好看的文本主题样式，同时也可以作为 CDN 由用户自行引入，自由切换。

但为了搭配主题（譬如根据主题色改变水平线的颜色等），还是进行了些许修改，并直接写在了 `stylus` 里。（日后也许还是会分离？自选文本样式主题？咕咕咕！）

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

移除 `embeddedVideoTransformer`，[hexo-tag-aplayer](https://github.com/MoePlayer/hexo-tag-aplayer) 太香了。

### 2020-03-24

改使用 [SATA 协议( The Star And Thank Author License (SATA) )](https://github.com/zTrix/sata-license)，笑。

简而言之，就是在 MIT 协议上，加个 Star 的要求。

[![GitHub stars](https://img.shields.io/github/stars/YunYouJun/hexo-theme-yun?style=social)](https://github.com/YunYouJun/hexo-theme-yun)

快快快，都给我去 Star，不准白嫖。

### 2020-03-26

去 V2EX 发了一帖 [一个轻量、快速、可爱（自认为）的 Hexo 主题： Yun](https://www.v2ex.com/t/656234)。

结果因为滑动不流畅被吐槽惨了。（自己测试的确没有感受到这个问题。）

> 想起一个程序员经典口头禅：奇怪哦，我本地测试没问题，怎么上线后就有问题了。

还不知道怎么解决。

拿 Safari 测试了下，……，我错了，真的好卡。

一一排除后，发现原来是背景 `filter: blur(30px)` 的原因，咨询群里的大家都还觉得挺好看。
决定还是保留为配置项，并在文档提醒可以手动用图像处理工具模糊。

### 2020-03-30

偶然测试了早期的 `v0.1.0`, `v0.2.0`（我都是使用 `::before` 实现的背景），即便使用了 `blur` 滤镜滚动仍然很流畅。

发现使用 `::before` 实现背景渲染速度提升很多。

某一天我作死的换成了单独的 `div` 来实现，然后发了一个主题宣传帖，于是有了前几天的一幕。（Safari 最为明显）

目前通过切回 `::before` 实现和移除 `background-attachment: fixed` 来优化，即便开启滤镜仍然滚动流畅。

> [使用 CSS3 will-change 提高页面滚动、动画等渲染性能](https://www.zhangxinxu.com/wordpress/2015/11/css3-will-change-improve-paint/)

继续做减法，移除默认不开启的 [`rymd`](https://codepen.io/hakimel/pen/bzrZGo)（群星移动效果），挺吃性能，而且也没怎么优化页面展示效果。

---

持续迭代 ing...

Ten Years Later

### 2020-05-05 PJAX

pjax 适配一些插件和第三方功能时（而且有些根本就不支持重载），实在是太痛苦了。

因为自己没用全局播放器，以及为了避免隐藏的 BUG，自己博客干脆就没开 pjax 了。

### 2020-05-31 滚动

我的主题文章目录的滚动效果起初是参考 [hexo-theme-melody/source/js/sidebar.js](https://github.com/Molunerfinn/hexo-theme-melody/blob/dev/source/js/sidebar.js) 实现的。
随后为了移除 jQuery 依赖，使用 Vanilla JavaScript 进行了重写，并混合 CSS 选择器来实现，（应该）提升了性能。
监听 `scroll` 事件，传入 `window.scrollY`。（再加上所谓的节流函数）

> 关于滚动优化还有个 [移动 Web 滚动性能优化: Passive event listeners](https://zhuanlan.zhihu.com/p/24555031) 可以了解一下

看了苏卡卡大佬的 [使 Disqus 不再拖累性能和页面加载](https://blog.skk.moe/post/prevent-disqus-from-slowing-your-site/)，才知道还有 Intersection Observer 这个东西。

还看了小伙伴 ChrAlpha 的 [Lazyload 不让 Valine 评论组件拖慢页面加载](https://blog.ichr.me/post/valine-lazyload/)，打算也应用到主题的优化上来，但想到自己本来就是放在 `DOMContentLoaded` 里才初始化的，而且文章的阅读数也是直接用的 Valine ，使用 `Observer` 来懒加载可能不大合适，所以干脆作罢（~~其实主要是懒~~）。

不过我觉得文章目录的滚动激活效果倒是可以尝试使用这种方法来优化看看。
虽然现在也并没有觉得速度受到什么影响，但是总觉得冥冥之中应该是能提升的（玄学），同时可以去掉节流函数等代码。~~新 API 用就是了~~

顺道看了一下 Vuepress 的[实现](https://github.com/vuejs/vuepress/tree/master/packages/@vuepress/plugin-active-header-links)，也是用的 `scroll` 加 `denounce`。

（话说总觉得新时代浏览器不应该手写节流防抖函数，不够优雅，但又似乎的确能有些作用，不知道有没有什么更好的方案，还请看官多指教。）

> v0.3.0 时，我便是使用的 `debounce`，[sidebar.js - v0.3.0](https://github.com/YunYouJun/hexo-theme-yun/blob/v0.3.0/source/js/sidebar.js)
> v0.4.0-v0.7.0，直接去掉了（代码看起来比较简洁），[sidebar.js - v0.7.0](https://github.com/YunYouJun/hexo-theme-yun/blob/v0.7.0/source/js/sidebar.js)

简而言之，我便想用 [Intersection Observer](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver) 重构一下目录滚动监听功能，然后……写出了些 BUG，没调出来，就搁置了一段时间。

再腾出时间想要重构时，突然发现 [hexo-theme-next/source/js/utils.js](https://github.com/next-theme/hexo-theme-next/blob/master/source/js/utils.js#L236) 就是用这种方式写的。

> 咳，读书人的事情怎么能叫抄呢？叫参考！

于是，我参考了下，并简化了些许代码，火速收工。[sidebar.js - v0.8.0](https://github.com/YunYouJun/hexo-theme-yun/blob/v0.8.0/source/js/sidebar.js)

### 2020-06-01 亮暗模式

基础的暗色模式开发完成，我可以不用，但不能没有系列。

参考的小伙伴的文章：

- [给博客增加深色模式支持 | BLOG@GIUEM](https://www.giuem.com/dark-mode/)
- [你好黑暗，我的老朋友 —— 为网站添加用户友好的深色模式支持 | Sukka's Blog](https://blog.skk.moe/post/hello-darkmode-my-old-friend/)

---

To Be Continued.

<!-- Q.E.D. -->
