---
title: 使用 CDN 加速你的 GitHub Pages 网站
date: 2020-02-05 20:28:57
updated: 2020-02-05 20:28:57
tags:
  - CDN
  - 笔记
  - GitHub Pages
categories:
  - 云游的小笔记
---

内容分发网络 Content Delivery Network

<!-- more -->

## 前言

除去 WordPress, 许多博客网站是托管于 GitHub Pages 上的，但其在国内的速度实在是难以称道。
所以使用国内服务商的 CDN 对其进行加速不失为一个好办法。

> 内容分发网络（Content Delivery Network，CDN）通过将站点内容发布至遍布全国的海量加速节点，使其用户可就近获取所需内容，避免网络拥堵、地域、运营商等因素带来的访问延迟问题，有效提升下载速度、降低响应时间，提供流畅的用户体验。

曾将我使用的策略是在国内托管 [Coding Pages](https://coding.net/)，以及为了让百度能抓取到博客内容，还做了一番配置。

> [让百度收录你的 GitHub Pages 博客](https://yunyoujun.cn/note/baidu-seo-about-github-pages/)

但是 Coding 的服务并不稳定，且经常变动一些策略。
现在更是下线整合到静态部署中，且似乎因为 API 的问题实名认证总是不能通过，所以暂时都无法使用。

所以便干脆使用 CDN 来进行加速。并且也可以轻松被百度抓取了。

因为我域名购置于腾讯云，且腾讯云 CDN 每月赠送免费 10G 流量。
所以我直接采用腾讯云的 CDN 来实现。

> 注意：域名需要备案（按需签发 SSL 证书）

## 步骤

首先开通[腾讯云 - 内容分发网络]((https://cloud.tencent.com/product/cdn))。

### 添加自己的域名

![add-domain-for-cdn](https://cos.yunyoujun.cn/blog/add-domain-for-cdn.png)

### 设置源站

管理 > 基本配置

![config-source-site](https://cos.yunyoujun.cn/blog/config-source-site.png)

这里是 GitHub Pages 提供的 IP 地址，可以添加多行。

> https://help.github.com/en/github/working-with-github-pages/about-custom-domains-and-github-pages

---

> 可选：建议前往 `高级配置` 开启 HTTPS 配置

### 回源协议

证书管理 > 编辑 > 协议跟随 (如果没开启 HTTPS，默认的 HTTP 也可以。)

![set-back-source-protocol](https://cos.yunyoujun.cn/blog/set-back-source-protocol.png)

### 设置 CNAME

前往 [域名解析](https://console.cloud.tencent.com/cns)

根据需要将 CDN 提供的 CNAME 线路类型设置为 `境内`。
`境外` 则仍默认解析回 GitHub Pages。

![set-different-cname-for-domain](https://cos.yunyoujun.cn/blog/set-different-cname-for-domain.png)

## 后话

测试发现首页基本可以秒开，速度确实不错。
至于流量万一不够用怎么办，emm，大概等这里真有这么大访问量的时候，就不至于还要在这样各处薅羊毛了吧。
