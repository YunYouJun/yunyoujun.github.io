---
title: CSS 陷阱
date: 2019-06-27 18:32:55
updated: 2020-02-03 18:32:55
tags:
  - 学习
  - 笔记
  - CSS
categories:
  - 云游的小笔记
---

CSS 的奇妙 Bug

<!-- more -->

<!-- for codepen -->
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## FAQ

### Margin 塌陷

DEMO: [Margin Collapse](https://codepen.io/YunYouJun/pen/WqXGpo)

<p class="codepen" data-height="304" data-theme-id="0" data-default-tab="css,result" data-user="YunYouJun" data-slug-hash="WqXGpo" style="height: 304px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Margin Collapse">
  <span>See the Pen <a href="https://codepen.io/YunYouJun/pen/WqXGpo/">
  Margin Collapse</a> by YunYouJun (<a href="https://codepen.io/YunYouJun">@YunYouJun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

#### 父子间

添加 `overflow: hidden;`

#### 兄弟间

添加 `float:left;`

### transform 后 z-index 属性失效

Demo:

<p class="codepen" data-height="265" data-theme-id="default" data-default-tab="css,result" data-user="YunYouJun" data-slug-hash="PowMQjP" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="transform vs z-index">
  <span>See the Pen <a href="https://codepen.io/YunYouJun/pen/PowMQjP">
  transform vs z-index</a> by YunYouJun (<a href="https://codepen.io/YunYouJun">@YunYouJun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

原因主要是 `transform` 新创建了层叠上下文，影响了正常的 `z-index`。

**解决方案**：添加 `transform-style: preserve-3d;`，使之变成 3d 显示方式。再通过 `transform: translateZ(-1px);` 来控制层级顺序。

- [张鑫旭博文：深入理解css中的层叠上下文和层叠顺序](https://link.jianshu.com/?t=http://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/)
- [Segmentfault回答：Transform 引起的 z-index "失效"](https://link.jianshu.com/?t=https://segmentfault.com/q/1010000002480824)
