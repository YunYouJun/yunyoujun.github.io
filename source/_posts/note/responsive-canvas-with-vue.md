---
title: Vue 中 canvas 的自适应
tags:
  - Canvas
  - Web
  - Vue
  - 笔记
  - 学习
categories:
  - 云游的小笔记
date: 2018-03-27 11:44:33
updated: 2018-03-27 11:44:33
---

> 最近又在写一些没什么用的小玩意儿。
> ref: https://github.com/YunYouJun/star-timer/blob/master/docs/.vuepress/components/StarMap.vue

在过程中尝试使用 Vue 来实现 Html5 中 `Canvas` 标签的自适应。

<!-- more -->

```html
<template>
  <canvas id="star-map" ref="starMap">
    Sorry, your browser doesn't support the &lt;canvas&gt; element.
  </canvas>
</template>
```

`window.onresize` 方法挂载在 `mounted` 方法上。（mounted 可参见 Vue [生命周期钩子](https://cn.vuejs.org/v2/api/#mounted)）

```js
<script>
export default {
  name: 'StarMap',
  mounted () {
    this.resizeCanvas();
    this.drawStarMap();
    window.addEventListener("resize", () => {
      this.resizeCanvas();
      // 等待 canvas 变换好，再延时绘制，不然可能会没有内容
      setTimeout(function() {
        this.drawStarMap();
      }, 100);
    });
  },
  methods: {
    resizeCanvas() {
      this.canvas = document.getElementById("star-map");
      let parentStyle = window.getComputedStyle(this.canvas.parentNode);
      this.canvas.width = parseInt(parentStyle.width);
      this.canvas.height = document.body.clientHeight - 400;
    },
  }
}
</script>
```

> [Window.getComputedStyle() | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getComputedStyle)
> Window.getComputedStyle()方法返回一个对象，该对象在应用活动样式表并解析这些值可能包含的任何基本计算后报告元素的所有 CSS 属性的值。

这里使用 getComputedStyle 来获取父节点的样式，它会展现所有呈现出来的 CSS 属性的值。而 element.style.xxx 只能获取被设置过的数值。

根据不同需求也可以使用 `document.body.clientHeight` 之类的。
