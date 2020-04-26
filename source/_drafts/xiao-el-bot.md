---
title: 机器人 - 小艾尔
date: 2020-04-25 01:59:56
updated: 2020-04-25 01:59:56
tags:
categories:
---

<!-- more -->

此前使用 [酷 Q](https://cqp.cc/) 做过 QQ 的机器人[小爱](https://www.yunyoujun.cn/project/QQ-XiaoAi/)。

但总觉得有哪里不对劲。

发现了 [mirai](https://github.com/mamoe/mirai) 这个框架，看起来不错，实在等不及发布稳定版，便来尝试。

索性 Archive 了 [小爱](https://github.com/YunYouJun/xiao-ai)，建了新的 [小艾尔 xiao-el](https://github.com/YunYouJun/xiao-el)。

一来是发音相近（还挺好听），二来是自己有个 <elpsy.cn> 的域名。

## Progress

最方便

```sh
pip install kuriyama
```

我尝试从 GitHub 安装，但是 `requirements.txt` 里的各依赖（譬如 `aiohttp`）版本是 `*`，却没有自动安装最新版本，而是提示：

```sh
ERROR: No matching distribution found for aiohttp=="*" (from -r requirements.txt (line 1))
```

---

To Be Continued.
