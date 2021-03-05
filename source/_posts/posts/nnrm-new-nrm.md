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

## Why new nrm - nnrm?

首先，我赞成重复造轮子是不好的行为。

nrm 的确使得切换更加方便，譬如我们可以简单地使用 `nrm use taobao` 的方式切换镜像。
但是在切换镜像前，安装 nrm 本身也是一件很慢的事情，nrm 依赖了已 deprecated 的且包体较大的 `request`，`npm` 包，以及一些其他依赖。

而我自身至今使用过的实际只有 `nrm ls` 与 `nrm use` 命令而已。（偶尔可能尝试一下 nrm test 进行测速）。

此外因为经常需要在不同的机器上操作，所以我希望它足够简洁，安装迅速，并且我不想总是看到依赖的包已 deprecated 的提示（强迫症？）。这便是它诞生的原因。

<!-- more -->

## Features

nnrm 相比 nrm 的改进之处：

- 支持 yarn （yarn 与 npm 的 registry 是互相独立的）
- 极小的依赖
  - 使用 `node-fetch` (289B) 替代 `request` (184.8KB) 进行测速 [node-fetch vs axios vs request | npmtrends](https://www.npmtrends.com/node-fetch-vs-axios-vs-request)
  - 使用 `execa` (8.4KB) 替代 `npm` (455.4KB) 通过终端而非 node API 实现切换 [execa vs npm | npmtrends](https://www.npmtrends.com/execa-vs-npm)
  - 使用 `cac` (3.6KB) 替代 `commander` (6.8KB) 实现简单的终端 [cac vs commander | npmtrends](https://www.npmtrends.com/minimist-vs-commander-vs-cac)
- 异步地显示源测速结果
- 彩色的输出结果
- 每次修改后自动显示 registry 列表，并标记当前 registry

### Default Registires

- npm -------- <https://registry.npmjs.org/>
- yarn ------- <https://registry.yarnpkg.com/>
- taobao ----- <https://registry.npm.taobao.org/>
- tencent ---- <https://mirrors.cloud.tencent.com/npm/>
- npmMirror -- <https://skimdb.npmjs.com/registry/>
- github ----- <https://npm.pkg.github.com/>

## 安装

```bash
yarn global add nnrm
# npm install -g nnrm
```

## 使用

`nnrm -h` 查看帮助。

```bash
Usage:
  $ nrm <command> [options]

Commands:
  ls                           List all the registries
  use [registry]               Change registry
  test                         Show response time for all registries
  add <registry> <url> [home]  Add a custom registry
  remove <registry>            Remove a custom registry

Options:
  -h, --help     Display this message
  -v, --version  Display version number
```

### 切换源

nnrm 同时绑定了四个命令 `nnrm`, `nrm`, `nyrm`, `yrm`。

npm 可以使用 `nnrm` 或 `nrm` 切换。

yarn 可以使用 `nyrm` 或 `yrm` 切换。

```bash
nnrm use taobao
# nrm use taobao
# yrm use npm
```

### 添加/删除自有源

```bash
nnrm add example https://example.com
nnrm remove example
```

---

Q.E.D.
