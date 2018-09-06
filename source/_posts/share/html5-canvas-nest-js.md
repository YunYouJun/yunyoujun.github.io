---
title: 【分享】网页背景效果插件 Canvas-Nest.js
tags:
  - 分享
  - 前端
categories:
  - 云游的小安利
date: 2017-01-23 21:04:48
updated: 2017-01-23 21:04:48
---

# Intro

一个基于html5 canvas绘制的网页背景效果,=w=很绚丽啊。mark一下。

## Github

[canvas-nest.js](https://github.com/hustcc/canvas-nest.js)

<!-- more -->

## 配置方法

使用 [BootCDN](http://www.bootcdn.cn/) 提供的免费 CDN 服务。

~~（极其简洁=v=）~~
将下面的代码插入到`<body>`和`</body>`标签之间

```js
<script type="text/javascript" src="//cdn.bootcss.com/canvas-nest.js/1.0.1/canvas-nest.min.js"></script>
```

### 自定义样式

- **color** : 线条颜色, 默认: '0,0,0' ；三个数字分别为(R,G,B)，注意用,分割
- **opacity** : 线条透明度（0~1）, 默认: 0.5
- **count** : 线条的总数量, 默认: 150
- **zIndex** : 背景的 z-index 属性，css 属性用于控制所在层的位置, 默认: -1

### Example

```js
<script type="text/javascript" color="0,0,255" opacity='0.7' zIndex="-2" count="99" src="//cdn.bootcss.com/canvas-nest.js/1.0.1/canvas-nest.min.js"></script>
```

> 效果就如本页面所示！

<script type="text/javascript" color="0,0,255" opacity='0.7' zIndex="-2" count="99" src="//cdn.bootcss.com/canvas-nest.js/1.0.1/canvas-nest.min.js"></script>