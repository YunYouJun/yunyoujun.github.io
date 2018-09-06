---
title: Discourse 新一代开源论坛
tags:
  - 分享
  - 论坛
id: 544
categories:
  - 云游的小安利
date: 2017-10-15 17:38:06
updated: 2017-10-15 17:38:06
---

平时搭建 xx 网站时，总会想添加个可供讨论的论坛，随后便是按着自己想要的功能瞎写，和真正全面实用的论坛功能要差很多。

也查了查知道有诸如 [Discuz](http://www.discuz.net/forum.php) 、[phpwind](http://www.phpwind.net/) 之类的开源论坛可以使用，但是界面以及一些看着繁琐的功能着实不是自己喜欢的。

<!-- more -->

后来上了 `cocos` 、`Vue` 、`React` 的论坛，可以发现他们的论坛是同一个论坛框架，而且觉得看和用起来也挺简洁舒服的，便去找了找。

> 啰嗦完了……

找到的便是

# [Discourse](https://www.discourse.org/)

使用 Ruby 编写

## 优点

- 开源、免费（虽然也有收费版本
- 界面简洁、体验良好
- 大量使用 ajax ，许多功能页面使用无需刷新
- 支持 markdown 与 emoji
- ……

## 参考教程

### 安装

- [30 分钟内在云上部署 Discourse](https://meta.discoursecn.org/t/topic/26)
- [在大陆地区的云上部署 Discourse](https://meta.discoursecn.org/t/topic/28)
- [开源论坛之discourse搭建](http://itfish.net/article/52781.html)(与官方教程大同小异，教了几个查看 docker 的指令)
- [在同一台机器上运行 Discourse 和其他站点](https://meta.discoursecn.org/t/topic/684)
- [在终端激活管理员帐号](https://meta.discourse.org/t/create-admin-account-from-console/17274)

### 配置

- [Discourse 单点登录功能](https://meta.discoursecn.org/t/topic/52)(中文翻译有些问题，把变量名 `payload` 翻译为负荷了)
- [[英文] Discourse 单点登录链接](https://meta.discourse.org/t/official-single-sign-on-for-discourse-sso/13045)

### 遇到的问题

- 执行 `./launcher bootstrap app` 指令时，会使用到国外的资源，所以可能速度较慢，资源不稳定，容易失败。（不用 `vpn` 有一定几率成功。）重新执行相同指令即可。（反正我是这么成功的，鼠标激活命令行的光标，保持连接~~玄学~~）
- 无法收到事先设定的邮箱发送的邮件，来激活管理员账号（可参考：[在终端激活管理员帐号](https://meta.discourse.org/t/create-admin-account-from-console/17274)）(我使用的是腾讯企业邮箱 smtp ，虽然帮助是用465端口，最后发现还是使用587默认端口方可行)