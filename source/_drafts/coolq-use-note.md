---
title: 酷 Q 使用笔记
date: 2019-05-15 19:45:31
updated: 2019-05-15 19:45:31
tags:
categories:
---

## Intro

[Webqq](https://web2.qq.com/) 早已于 2019-01-01 起正式停止服务。

那么以此为基础的 qq 机器人便全部失效。以前折腾的也已作废。

- [qqbot](https://github.com/pandolia/qqbot)

因此，所剩的尚跨可靠的选择似乎只有 [酷Q](https://cqp.cc/) 还说得过去。

本文便用于记录配置过程中的坑。

<!-- more -->

## Progress

想要长久在线，自然是要挂在服务器上的。
那么 Linux 便是跨不过去的坎。

想让 酷Q 在 Linux 上运行则推荐使用 [docker](https://www.docker.com/) 。

[[发布]酷Q on Docker 2.0](https://cqp.cc/t/34558)

### Install Docker

Linux 不同主流发行版本在官方文档中都有详细的安装过程。

> [Get Docker CE](https://docs.docker.com/install/linux/docker-ce/debian/)

但 Deepin (即深度) 基于 Debian 进行了定制，本以为按照 Debian 进行安装就可以，但没能成功。
无法找到 Deepin 的安装版本。

[深度系统如何安装docker？](https://bbs.deepin.org/forum.php?mod=viewthread&tid=139514&page=1&authorid=76809)

尝试了文中的做法也没有成功。
问题出在 `sudo add-apt-repository` 。

尝试修改了 `/etc/lsb-release`，竟然成功了。

```ini
; DISTRIB_ID=Deepin
DISTRIB_ID=Debian
DISTRIB_RELEASE="15.10"
DISTRIB_DESCRIPTION="Deepin 15.10"
; DISTRIB_CODENAME=stable
DISTRIB_CODENAME=wheezy
```

等安装好后，为防止以后系统更新等 Bug，又改回了 `Deepin/stable`。

### Install [coolq-http-api](https://github.com/richardchien/coolq-http-api)

- Docs: <https://cqhttp.cc/docs/4.10/#/>

因为自己 C++ 并不怎么熟悉，所以打算使用 api 插件，来使用 Node.js/Python 来开发。

参见文档进行安装。