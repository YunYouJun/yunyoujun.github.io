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

在过程中尝试使用 Vue 来实现 Html5 中 `Canvas` 标签的自适应。

<!-- more -->

先将 canvas 的 `width` 和 `height` 属性与 `data` 进行绑定。

```html
<template>
  <canvas id="canvas" :width="canvas.width" :height="canvas.height">
    Sorry, your browser doesn't support the &lt;canvas&gt; element.
  </canvas>
</template>
```

`window.onresize` 方法挂载在 `mounted` 方法上。（mounted 可参见 Vue [生命周期钩子](https://cn.vuejs.org/v2/api/#mounted)）

```js
<script>
export default {
  name: 'StarMap',
  data () {
    return {
      // canvas 数据赋予初始值
      canvas: {
        width: document.body.clientWidth - 30,
        height: document.body.clientHeight - 30
      }
    }
  },
  mounted () {
    const _this = this  // 区分 Vue 自身的 this 与 window 自身的 this
    window.onresize = function () {
      _this.resizeCanvas()
      setTimeout(function () {  // 等待 canvas 变换好，再延时绘制，不然可能会没有内容
        _this.drawStarMap()
      }, 100)
    }
  },
  methods: {
    resizeCanvas () {
      this.canvas.width = document.body.clientWidth - 30
      this.canvas.height = document.body.clientHeight -30
    }
  }
}
</script>
```

最后为了美观设置一下画布 `margin` & `padding` 。

```css
<style>
canvas {
  box-shadow: 0px 2px 13px #8e71c7;
  margin: 13px;
  padding: 0;
}
</style>
```