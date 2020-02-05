---
title: 使用 CCD 或 FABRIK 实现逆向动力学
date: 2020-01-14 22:16:27
updated: 2020-01-14 22:16:27
tags:
  - 学习
  - 笔记
  - 计算机图形学
categories:
  - 云游的小笔记
---

<!-- more -->

动力学主要分为正向动力学（FK）和反向动力学（IK）。
正向动力学实现起来十分简单，了解点基本原理，或者网上一搜，都能写出来。
反向动力学中比较流行的方法则是 Cyclic Coordinate Descent（CCD）和 [Forward And Backward Reaching Inverse Kinematics](https://www.sciencedirect.com/science/article/pii/S1524070311000178) (FABRIK)。
还有几何分析与雅可比矩阵的方法，计算起来比较复杂，用的不是太多。

- [Inverse kinematics](https://en.wikipedia.org/wiki/Inverse_kinematics)
- [Making Kine More Flexible](http://www.cs.cmu.edu/~15464-s13/lectures/lecture6/jlander_gamedev_nov98.pdf)
- [角色动画研究 —— IK的三种结算方法](https://blog.csdn.net/noahzuo/article/details/53908141)

维基百科和一些论文、博客也讲得很清楚了。
~~（摔，那你水这篇文章干什么？）~~
为了大家更方便地从代码层级来理解，这篇文章最主要的作用大概就是提供 Demo 了。

下面主要分为 CCD 和 FABRIK（话说 IK 代表的就是逆向动力学，为啥 CCD 缩写不带 IK，而 FABRIK 缩写通常带 IK 呢？） 两种方法来说。

## CCD

- [角色动画研究 —— IK的三种结算方法](https://blog.csdn.net/noahzuo/article/details/53908141)
- [Cyclic Coordinate Descent in 2D](http://www.ryanjuckett.com/programming/cyclic-coordinate-descent-in-2d/)

### CCD - [p5.js](https://p5js.org/zh-Hans/)

Fullscreen: <https://editor.p5js.org/YunYouJun/full/kJJqXPATQ>
Editor: <https://editor.p5js.org/YunYouJun/sketches/kJJqXPATQ>

> 代码参考自：[Simple Inverse Kinematics - Dave Pagurek](https://www.davepagurek.com/blog/inverse-kinematics/)

## FABRIK

FABRIK 是一种[启发式算法](https://baike.baidu.com/item/%E5%90%AF%E5%8F%91%E5%BC%8F%E7%AE%97%E6%B3%95/938987)。实现起来较为简单，计算又少又快。

原文的算法出自这篇论文 [FABRIK: A fast, iterative solver for the Inverse Kinematics problem](https://www.sciencedirect.com/science/article/pii/S1524070311000178)

算法的大致描述看[这里](https://blog.csdn.net/noahzuo/article/details/80188366)也可以理解，就不再多述。

### FABRIK - [p5.js](https://p5js.org/zh-Hans/)

Fullscreen: <https://editor.p5js.org/YunYouJun/embed/bS8jB3EsC>
Editor: <https://editor.p5js.org/YunYouJun/sketches/bS8jB3EsC>

> 代码参考自：[Inverse Kinematics - Fixed Point - Coding Challenge #64.3 · The Coding Train](https://thecodingtrain.com/CodingChallenges/064.3-inverse-kinematics-fixed-point)

### Cocos Creator

新年 🧨 版（小 bug 之后修）

![image.png](https://i.loli.net/2020/01/16/aw4Z2vzNULps586.png)

GitHub: <https://github.com/YunYouJun/cocos-creator-ik/>

---

To Be Continued.
