---
title: nnrm - 一个极简的 npm/yarn registry 切换管理器
date: 2021-03-05 17:57:17
updated: 2021-03-05 17:57:17
tags:
  - npm
  - 镜像源
  - 工具
categories:
  - 云游的小项目
type: github
url: https://github.com/YunYouJun/nnrm/
readmore: true
---

## 简介

nnrm 即 new nrm。

GitHub: <https://github.com/YunYouJun/nnrm/>

[nnrm - 一个极简的 npm/yarn registry 切换管理器 | V2EX](https://www.v2ex.com/t/758624)

一个简单的 npm/yarn registry （镜像源）切换工具

> [中文使用文档](https://github.com/YunYouJun/nnrm/blob/main/README.zh-CN.md)

## Why new nrm - nnrm?

首先，我赞成重复造轮子是不好的行为。

nrm 的确使得切换更加方便，譬如我们可以简单地使用 `nrm use taobao` 的方式切换镜像。
但是在切换镜像前，安装 nrm 本身也是一件很慢的事情，nrm 依赖了已 deprecated 的且包体较大的 `request`，`npm` 包，以及一些其他依赖。

而我自身至今使用过的实际只有 `nrm ls` 与 `nrm use` 命令而已。（偶尔可能尝试一下 nrm test 进行测速）。当然它现在也支持了自定义源的操作。

此外因为经常需要在不同的机器上操作，所以我希望它足够简洁，安装迅速，并且我不想总是看到依赖的包已 deprecated 的提示（强迫症？）。这便是它诞生的原因。

好！就是这样！更多就请见 [项目 README](https://github.com/YunYouJun/nnrm/) 吧！

<!-- more -->

---

Q.E.D.
