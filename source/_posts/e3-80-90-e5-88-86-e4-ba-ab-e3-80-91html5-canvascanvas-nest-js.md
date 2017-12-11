---
title: 【分享】网页背景效果插件Canvas-Nest.js
tags:
  - 分享
  - 前端
id: 80
categories:
  - 朋友吃安利吗？
date: 2017-01-23 21:04:48
---

一个基于html5 canvas绘制的网页背景效果,=w=很绚丽啊。mark一下。

> ### Github项目源地址：
> 
>   [https://github.com/hustcc/canvas-nest.js](https://github.com/hustcc/canvas-nest.js)

### 配置方法：

<del>（极其简洁=v=）</del>
将下面的代码插入到`&lt;body&gt;`和`&lt;/body&gt;`标签之间

    &lt;script type="text/javascript" src="//cdn.bootcss.com/canvas-nest.js/1.0.1/canvas-nest.min.js"&gt;
    &lt;/script&gt;
    `</pre>

    #### 自定义样式：

*   **color** : 线条颜色, 默认: '0,0,0' ；三个数字分别为(R,G,B)，注意用,分割
*   **opacity** : 线条透明度（0~1）, 默认: 0.5
*   **count** : 线条的总数量, 默认: 150
*   **zIndex** : 背景的z-index属性，css属性用于控制所在层的位置, 默认: -1

    #### Example：

    <pre class="line-numbers prism-highlight" data-start="1">`&lt;script type="text/javascript" color="0,0,255" opacity='0.7' zIndex="-2" count="99" src="//cdn.bootcss.com/canvas-nest.js/1.0.1/canvas-nest.min.js"&gt;
    &lt;/script&gt;

> 效果就如 [canvas-nest-demo](http://www.yunyoujun.cn/2017/01/23/democanvas-nest-js/) 啦！