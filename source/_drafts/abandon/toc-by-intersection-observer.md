---
title: 使用 Intersection Observer 实现导航目录的激活效果
date: 2020-03-20 17:53:18
updated: 2020-03-20 17:53:18
tags:
categories:
---

<!-- more -->

我的主题文章目录的滚动效果起初是参考 [hexo-theme-melody/source/js/sidebar.js](https://github.com/Molunerfinn/hexo-theme-melody/blob/dev/source/js/sidebar.js) 实现的。

> 其他也可以参考 [hexo-theme-next/source/js/utils.js](https://github.com/theme-next/hexo-theme-next/blob/master/source/js/utils.js#L232)

随后为了移除 jQuery 依赖，使用 Vanilla JavaScript 进行了重写，并混合 CSS 选择器来实现，（应该）提升了性能。

监听 `scroll` 事件，传入 `window.scrollY`。（再加上所谓的节流函数）

> 关于滚动优化还有个 [移动 Web 滚动性能优化: Passive event listeners](https://zhuanlan.zhihu.com/p/24555031) 可以了解一下

看了苏卡卡大佬的 [使 Disqus 不再拖累性能和页面加载](https://blog.skk.moe/post/prevent-disqus-from-slowing-your-site/)，才知道还有 Intersection Observer 这个东西。

还看了小伙伴 ChrAlpha 的 [Lazyload 不让 Valine 评论组件拖慢页面加载](https://blog.ichr.me/post/valine-lazyload/)，打算也应用到主题的优化上来，但想到自己本来就是放在 `DOMContentLoaded` 里才初始化的，而且来访次数和文章的阅读数也是直接用的 Valine ，使用 `Observer` 来懒加载可能不大合适，所以干脆作罢（其实主要是懒）。

不过我觉得文章的目录的滚动激活效果倒是可以尝试使用这种方法来优化看看。
虽然现在也并没有觉得速度受到什么影响，但是总觉得冥冥之中应该是能提升的（玄学），同时可以去掉节流函数等代码。~~新 API 用就是了~~

顺道看了一下 Vuepress 的[实现](https://github.com/vuejs/vuepress/tree/master/packages/@vuepress/plugin-active-header-links)，也是用的 `scroll` 加 `denounce`。

（话说总觉得新时代浏览器不应该手写节流防抖函数，不够优雅，但又似乎的确能有些作用，不知道有没有什么更好的方案，还请看官多指教。）

## 旧方案

总之先记录一下此前的做法，以备老板说「还是用初稿吧！」（等等，我自己就是自己的老板，笑）。

```js
if (document.querySelectorAll(".toc-link").length) {
  let list = document
    .querySelector(".post-content")
    .querySelectorAll("h1, h2, h3, h4, h5, h6");

  window.addEventListener(
    "scroll",
    throttle(
      function() {
        findHeadPosition(window.scrollY);
      },
      50,
      100
    ),
    {
      passive: true
    }
  );
}

function findHeadPosition(top) {
  let curId = "";
  for (let i = 0; i < list.length; i++) {
    const el = list[i];
    if (top > el.offsetTop - 25) {
      curId = "#" + el.attributes.id.value;
    } else {
      break;
    }
  }

  let curActiveLink = document.querySelector(".toc-link.active");
  if (curId) {
    if (!curActiveLink || curActiveLink.attributes.href !== curId) {
      let curLink = document.querySelector(".toc-link[href='" + curId + "']");
      activeLink(curLink);
      updateAnchor(curId);
    }
  }
}
```

## 新方案

···

---

To Be Continued.

<!-- Q.E.D. -->
