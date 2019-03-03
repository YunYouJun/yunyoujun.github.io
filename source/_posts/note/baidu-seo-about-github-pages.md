---
title: 让百度收录你的 GitHub Pages 博客
date: 2019-03-03 21:52:57
updated: 2019-03-03 21:52:57
tags:
  - SEO
  - 笔记
categories:
  - 云游的小笔记
---

## 前言

因为历史的一些缘故，GitHub 拒绝了百度的爬虫检索。
而这也导致托管在 GitHub 之上的博客无法被百度检索到。

虽然标题是让百度收录你的 GitHub Pages 博客，但终究还是走了取巧的措施。

<!-- more -->

## 过程

那就是使用 [Coding Pages](https://coding.net/pages) 托管，但这就又似乎背离了我们的初衷，显得不够优雅。

GitHub 只是不能被百度收录，但 Bing, Google 等搜索引擎，均可正常收录。

所以只需要针对百度的搜索引擎做特定的解析，只有当百度爬虫检索时，才会将域名解析至 Coding Pages 搭建的镜像网站上。

Coding Pages 可以和 GitHub Pages 使用方式相差无几，不再多述。
（为方便推送，可以编写个脚本，向两端同时推送内容。）

Example:

```sh
# backup.sh
info=$1
git add -A
git commit -m "$info"
git push github hexo
git push coding hexo
```

重点则在于设置域名的解析。
我使用的是腾讯云。

添加记录 设置 CNAME 的线路类型 -> 搜索引擎 -> 百度

![set-domain-cname-type-baidu.png](/images/posts/baidu-seo-about-github-pages/set-domain-cname-type-baidu.png)

此时再使用[百度站点管理](https://ziyuan.baidu.com/site)抓取，便可显示抓取成功。

在百度搜索框中输入 `site: 你的域名` 就可以检索域名收录情况。

当然估计还要几天的刷新才会有结果。

## 后话

此前为了能够被收录，便迁移使用了 Coding Pages，但是 Coding Pages 没有提供 IP 地址以供 A 记录解析，
而腾讯域名邮箱 MX 记录解析又和 CNAME 冲突（在很久前是可以设置的，但是我手贱调整了一下后就……），
便又迁移回了 GitHub Pages 。

而百度以往收录的索引，随着时间，便几乎消失殆尽了。
