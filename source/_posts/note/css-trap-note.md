---
title: CSS 陷阱
date: 2019-06-27 18:32:55
updated: 2019-06-27 18:32:55
tags:
  - 学习
  - 笔记
  - CSS
categories:
  - 云游的小笔记
---

<!-- more -->

## FAQ

### Margin 塌陷

DEMO: [Margin Collapse](https://codepen.io/YunYouJun/pen/WqXGpo)

<p class="codepen" data-height="304" data-theme-id="0" data-default-tab="css,result" data-user="YunYouJun" data-slug-hash="WqXGpo" style="height: 304px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Margin Collapse">
  <span>See the Pen <a href="https://codepen.io/YunYouJun/pen/WqXGpo/">
  Margin Collapse</a> by YunYouJun (<a href="https://codepen.io/YunYouJun">@YunYouJun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 父子间

添加 `overflow: hidden;`

### 兄弟间

添加 `float:left;`
