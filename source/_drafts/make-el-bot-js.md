---
title: el-bot-js 制作笔记
date: 2020-06-22 02:16:53
updated: 2020-06-22 02:16:53
tags:
categories:
---

<!-- more -->

el-bot-go

## Progresss

### 2020-06-21 TypeScript Yes! node-mirai No!

起初，我是使用 [node-mirai](https://github.com/RedBeanN/node-mirai/) 进行开发的。

但是其似乎并不活跃，文档也不完善（约等于没有），开发过程中遇到了一些语义不明确的问题，尝试提了几个 ISSUE，也始终没有收到回复。
缺少一些更易用的辅助函数，控制台的输出消息不明确，一些语法习惯也有所冲突。

便索性自己直接根据 mirai-api-http 封装 SDK。为了与 node-mirai 相区别，并提供更好的代码提示，我决定使用 TypeScript 编写，并命名为 [mirai-ts](https://github.com/ElpsyCN/el-bot-js/tree/dev/packages/mirai-ts)。

截止今日，el-bot-js 已经完全去除 node-mirai 的依赖，转为 mirai-ts。

而 mirai-ts 也将长期作为 el-bot-js 的子项目置于 packages 目录下，直至其可以独当一面（完全封装实现 mirai-api-http）后，分离出来发布。

---

To Be Continued.

<!-- Q.E.D. -->
