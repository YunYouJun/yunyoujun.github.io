---
title: LNMP一键安装包
tags:
  - 分享
categories:
  - 云游的小安利
date: 2017-08-20 19:33:25
updated: 2017-08-20 19:33:25
---

想起以前配置环境的话，都是网上随便搜点攻略记录，就照着做下来。但是往往会因为各种不可见因素而导致诸多问题。

= = ，以前在这方面真的是浪费了很多时间啊。而且环境一弄不好，还会重新去初始化磁盘什么的。

---

直到有一天，我发现了所谓的一键（~~女装~~）安装包。

> [https://lnmp.org/](https://lnmp.org/)

<!-- more -->

**使用方法：**
[https://lnmp.org/install.html](https://lnmp.org/install.html)

以后转移服务器什么的，应该会方便很多吧。

---

# Q&A

## 开启 fileinfo

可以到 lnmp/include 文件夹中，修改 upgrade_php.sh 。
将 `--disable-fileinfo` 修改为 `--enable-fileinfo`。（有多个 php 版本需要修改对应的 php 版本）
再 upgrade 。