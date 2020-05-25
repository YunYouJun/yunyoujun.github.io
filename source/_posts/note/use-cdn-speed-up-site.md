---
title: 使用 CDN 加速你的 GitHub Pages 网站
date: 2020-02-05 20:28:57
updated: 2020-02-16 20:28:57
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

曾经我使用的策略是在国内托管 [Coding Pages](https://coding.net/)，以及为了让百度能抓取到博客内容，还做了一番配置。

> [让百度收录你的 GitHub Pages 博客](https://yunyoujun.cn/note/baidu-seo-about-github-pages/)

但是 Coding 的服务并不稳定，且经常变动一些策略。
现在更是下线整合到静态部署中，且似乎因为 API 的问题实名认证总是不能通过，暂时都无法使用。

所以便干脆使用 CDN 来进行加速。并且也可以轻松被百度抓取了。

因为我域名购置于腾讯云，且腾讯云 CDN 每月赠送免费 10G 流量。
所以我直接采用腾讯云的 CDN 来实现。

> 注意：域名需要备案（按需签发 SSL 证书）

## 步骤

首先开通[腾讯云 - 内容分发网络](<(https://cloud.tencent.com/product/cdn)>)。

### 添加自己的域名

![add-domain-for-cdn.png](https://i.loli.net/2020/03/25/gRyuXZCW5GHvKqx.png)

### 设置源站

管理 > 基本配置

![config-source-site.png](https://i.loli.net/2020/03/02/BfyolAHcKxhw27i.png)

这里是 GitHub Pages 提供的 IP 地址，可以添加多行。

> [About custom domains and GitHub Pages](https://help.github.com/en/github/working-with-github-pages/about-custom-domains-and-github-pages)

---

> 可选：建议前往 `高级配置` 开启 HTTPS 配置

### 回源协议

证书管理 > 编辑 > 协议跟随 (如果没开启 HTTPS，默认的 HTTP 也可以。)

![set-back-source-protocol.jpg](https://i.loli.net/2020/03/25/5BlPUpMfO3DxXCH.jpg)

### 设置 CNAME

前往 [域名解析](https://console.cloud.tencent.com/cns)

根据需要将 CDN 提供的 CNAME 线路类型设置为 `境内`。
`境外` 则仍默认解析回 GitHub Pages。

![set-different-cname-for-domain.png](https://i.loli.net/2020/03/25/Pw3257VtjLFqGNQ.png)

### 配置缓存

默认的缓存时间非常长，不配置的话就会导致 CDN 的文件长时间没有更新。

可以参见腾讯云文档 [缓存配置问题](https://cloud.tencent.com/document/product/228/2968#.E7.BC.93.E5.AD.98.E9.85.8D.E7.BD.AE.E9.97.AE.E9.A2.98)

也可以在 [刷新预热](https://console.cloud.tencent.com/cdn/refresh) 处手动刷新。

## 后话

测试发现首页基本可以秒开，速度确实不错。
至于流量万一不够用怎么办，emm，大概等这里真有这么大访问量的时候，就不至于还要在这样各处薅羊毛了吧。

## FAQ

### CNAME 与 MX 记录冲突导致邮件丢失

值得注意的是，设置 CDN 的方式是使用 CNAME 重定向到 CDN 域名。
如果你同时将裸域名（yunyoujun.cn）作为博客域名和域名邮箱（比如我的邮箱：me@yunyoujun.cn），那么你可能会遇到 CNAME 与 MX 记录冲突问题。

如果你的运营商没有这么提示你，那也最好不要这么做，因为这会导致域名邮箱发生邮件丢失。

在过去解析尚未规范时，部分运营商是允许同时在裸域名上设置 CNAME 和 MX 记录的。
但如今按照 RFC 标准协议，CNAME 优先级最高，所以在解析请求过程中，会优先返回 CNAME 解析记录结果。
这样设置的结果就是导致无法解析到用户设置的 MX 记录（设置权重也没有用），影响邮箱的正常收发。

现在，大部分运营商会提示 CNAME 与 MX 记录发生冲突，来避免这种情况。

> 更多信息请参阅 [RFC1034](https://www.rfc-editor.org/rfc/rfc1034.txt?spm=a2c4g.11186623.2.13.59ef4054LkHX23&file=rfc1034.txt) 和 [RFC2181](https://www.rfc-editor.org/rfc/rfc2181.txt?spm=a2c4g.11186623.2.14.59ef4054LkHX23&file=rfc2181.txt)。
> [记录冲突的规则](https://help.aliyun.com/knowledge_detail/39787.html#h2-u8BB0u5F55u51B2u7A81u7684u89C4u52193)

我此前之所以使用 GitHub Pages 托管，却仍然能够使用域名邮箱，是因为我使用了 GitHub 提供的 A 记录解析。

```txt
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

> [Managing a custom domain for your GitHub Pages site](https://help.github.com/en/github/working-with-github-pages/managing-a-custom-domain-for-your-github-pages-site)

而如今加了 CDN 又回到了这一两难的局面。

最后想着长痛不如短痛，下定决定将博客主域名更换为 `www.yunyoujun.cn`。

裸域名仍旧使用 A 记录和 MX 记录。
设置 A 记录的作用是用户访问 `yunyoujun.cn` 时（GitHub Pages 的 CNAME 文件提前设置为 `www.yunyoujun.cn`），那么 GitHub Pages 会自动从 `yunyoujun.cn` 跳转为 `www.yunyoujun.cn`。

此外，谷歌浏览器会自动隐藏 www 域名前缀，所以一定程度上减少观感的影响。

以及我发现一些企业的网站都采取的裸域名跳转 www 域名的方式。

譬如：

- 语雀：<https://yuque.com>,
- JetBrains（著名的 IDE 软件开发商）：<https://jetbrains.com>（我在几年前的视频里发现他们留的还是裸域名的网址，而现在则是跳转 www 链接。）

当然如果你对域名邮箱没有需求，且域名非常短又很酷，使用裸域名也并非不可。

---

此外还有一种解决方案就是 [CNAME Flattening](https://support.cloudflare.com/hc/en-us/articles/200169056-CNAME-Flattening-RFC-compliant-support-for-CNAME-at-the-root)。

有些服务商（如 [Cloudflare](https://www.cloudflare.com/)、[CloudXNS](https://www.cloudxns.net/)）可以直接将 CNAME 解析为对应的 A 记录（IP 地址），这时在裸域名上设置 CNAME 就相当于设置 A 记录。

以往腾讯云允许 CNAME 与 MX 并存，再然后提示冲突不允许，到了现在又可以同时设置了。但最好是一次性可以解析到 A 记录的 CNAME。

我尝试在 www 域名上加了 CNAME 开启了 CDN，裸域名 CNAME 到 www，就会影响邮箱。
这时的路径就相当于：`@ -> www(CNAME) -> cdn(CNAME) -> A`。可能无法使用 CNAME Flattening 。

而直接 CNAME 到 GitHub Pages 时，邮箱网址都可以正常工作。`@ -> GitHub Pages(CNAME) -> A`

> PS. 怎么感觉自己最近说话都有点翻译腔了。

### CDN 刷新

有了 CDN，这也意味着你的页面可能会因此延迟更新（对于用户来说）。

因此，CDN 往往提供了刷新预热功能。譬如指定 URL 或者目录进行更新。

其实延迟的一会儿也不算是什么事，遇到着急的链接手动去控制台刷新即可。
但说实话，每次登陆到网站上操作着实有些浪费时间。
那么不如考虑一下命令行工具。

> 需要 Python & pip

- [腾讯云命令行工具 TCCLI](https://cloud.tencent.com/document/product/440/39027)
- [安装 TCCLI](https://cloud.tencent.com/document/product/440/34011)：介绍如何安装 TCCLI。
- [配置 TCCLI](https://cloud.tencent.com/document/product/440/34012)：介绍在开始使用 TCCLI 之前，需要完成 TCCLI 的初始化配置。
- [使用 TCCLI](https://cloud.tencent.com/document/product/440/34013)：介绍如何使用 TCCLI 创建云服务器及相关使用说明。
- [使用高级功能](https://cloud.tencent.com/document/product/440/34015)：介绍 TCCLI 的高级功能，例如多版本接口访问、返回结果过滤等。

Example:

```sh
# 注意这里的参数是 Array
# 刷新目录
tccli cdn PurgePathCache --Paths '["https://www.yunyoujun.cn/links/"]' --FlushType flush
# 刷新链接
tccli cdn PurgeUrlsCache --Urls '["https://www.yunyoujun.cn/links/index.html"]'
```

#### PurgePathCache

PurgePathCache 用于批量提交目录刷新，根据域名的加速区域进行对应区域的刷新。
默认情况下境内、境外加速区域每日目录刷新额度为各 100 条，每次最多可提交 20 条。

**--Paths**
目录列表，需要包含协议头部 `http://` 或 `https://`

**--FlushType**
刷新类型

- flush：刷新产生更新的资源
- delete：刷新全部资源

#### PurgeUrlsCache

PurgeUrlsCache 用于批量提交 URL 进行刷新，根据 URL 中域名的当前加速区域进行对应区域的刷新。
默认情况下境内、境外加速区域每日 URL 刷新额度各为 10000 条，每次最多可提交 1000 条。

**--Urls**
URL 列表，需要包含协议头部 `http://` 或 `https://`

## 后后话

### 2020-03-26

因为不知腾讯云 CDN 为何挂了，转为使用 [Cloudflare](https://www.cloudflare.com/) 了，自动 Flattening。

> 后发现不是腾讯云的问题，是 GitHub Pages 的 HTTPS 证书被劫持了。[Github pages 的 HTTPS 是不是出问题了？](https://www.v2ex.com/t/656367)

既然已经更改为 `www` 主域名，也还是继续使用裸域名跳转 `www` 的策略吧。

### 2020-04-17

开始使用又拍云 CDN，申请了 [又拍云联盟](https://www.upyun.com/league)，拿到了代金券。

后来到了五月，发现百度索引竟然所剩无几。原本还以为国内 CDN （此前的腾讯云确实可以）会被收录的。

测试发现百度 [抓取诊断](https://ziyuan.baidu.com/crawltools/index?site=https://www.yunyoujun.cn/) 抓取失败时错误信息为 `拒绝访问`。

难不成时又拍云的一些 CDN 点也禁止百度抓取了？

我不断对抓取的 IP 进行报错，百度抓取诊断就会换一个 IP 抓，于是乎排除掉一些拒绝访问的 IP，有些 IP 倒是可以抓取成功了。

### 2020-05-24

但却并非如此，索引量仍旧在下降，我提交了又拍云工单，客服反馈是回源访问时源站本身便是 403 拒绝访问。（但我正常访问均正常。）

所以我猜想的是又拍云部分 CDN IP 有缓存时，所以回抓取成功，而其他 IP 无缓存时，则会回源，回源的过程中没有过滤百度爬虫的 User Agent，所以回源 GitHub Pages 仍旧会被拒绝。

此后我开启了又拍云的源站资源迁移，即可将源站静态资源无缝迁移到又拍云存储，当客户端下次访问相同的资源时，无需回用户自主源。

随后过了几天，索引量果然回升了……
