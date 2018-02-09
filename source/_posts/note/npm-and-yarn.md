---
title: npm & yarn 常用包与命令
tags:
  - Node.js
  - 分享
  - 笔记
categories:
  - 云游的小笔记
date: 2017-10-06 15:56:20
updated: 2018-02-07 15:04:44
---
# Intro

## [npm](https://www.npmjs.com/)

NPM 是随同 NodeJS 一起安装的包管理工具，能解决NodeJS代码部署上的很多问题，常见的使用场景有以下几种：

- 允许用户从 NPM 服务器下载别人编写的第三方包到本地使用。
- 允许用户从 NPM 服务器下载并安装别人编写的命令行程序到本地使用。
- 允许用户将自己编写的包或命令行程序上传到NPM服务器供别人使用。

摘自：[http://www.runoob.com/nodejs/nodejs-npm.html](http://www.runoob.com/nodejs/nodejs-npm.html)

## [yarn](https://yarnpkg.com/zh-Hans/)

Yarn 对你的代码来说是一个包管理器， 你可以通过它使用全世界开发者的代码，或者分享自己的代码。 Yarn 做这些快捷、安全、可靠，所以你不用担心什么。

通过 Yarn 你可以使用其他开发者针对不同问题的解决方案，使自己的开发过程更简单。 使用过程中遇到问题，你可以将其上报或者贡献解决方案。一旦问题被修复，Yarn会更新保持同步。

代码通过包（package）（或者称为模块（module））的方式来共享。 一个包里包含所有需要共享的代码，以及描述包信息的文件，称为 package.json。

> 实质上，yarn 使用的还是 npm 中的包。

<!-- more -->

---

# Package

---

## Tools

> ### nvm

* 简介：可用来安装与管理 `node.js`与 `npm` 版本。(严格来说，并不算npm的工具包，不过是管理 `node.js` 与 `npm` 的好工具。)
* GitHub : https://github.com/creationix/nvm
* 使用方法 ： 参见GitHub主页说明。（推荐使用git方式安装，更新方便。）

    //从github克隆nvm项目代码
    git clone https://github.com/creationix/nvm.git
    //安装稳定版本
    nvm install stable 或者 latest

Windows 系统下，可下载 [nvm-setup.zip](https://github.com/coreybutler/nvm-windows/releases) 解压后使用 exe 文件直接安装即可。

> ### nrm

* 简介： nrm 可以帮助你方便快捷地在不同的 `npm registries` 中切换。(不同 npm 工具包下载源) 现包括: `npm`, `cnpm`, `taobao`, `nj(nodejitsu)`, `rednpm` .
* GitHUb : [https://github.com/Pana/nrm](https://github.com/Pana/nrm)
* 使用方法 ： 可参见 GitHub 主页说明。

> ### yrm

作用和使用方法都与 [nrm](#nrm) 类似，可切换 `yarn registries`。

```sh
npm install -g yrm
```

---

## Framework

> ### express

* 简介： 基于 `Node.js` 平台，快速、开放、极简的 web 开发框架。
* GitHub : [https://github.com/expressjs/express](https://github.com/expressjs/express)
* 使用方法 ： 可参见GitHub主页说明。
* 安装方法 ： `npm install express`
* 官网 ： [https://expressjs.com/](https://expressjs.com/)
* 中文网 ： [http://www.expressjs.com.cn/](http://www.expressjs.com.cn/)

> ### [koa](http://koajs.com/)

---

## Others

...

---

# Command

## npm

### npm package
- `npm login` 登陆 npm (若使用其他镜像，需要切换回官网 `npm config set registry http://registry.npmjs.org` )
- `npm publish` 发布 npm 包
- `npm version major | minor | patch` 更新不同版本号

- 使用 `npm update <package>` 可以把当前目录下node_modules子目录里边的对应模块更新至最新版本。
- 使用 `npm update <package> -g` 可以把全局安装的对应命令行程序更新至最新版。

### update

- 更新 npm : `npm install npm -g` 

---

## yarn

### [upgrade](https://yarnpkg.com/lang/en/docs/cli/upgrade/)

- 更新 yarn : `yarn upgrade [package]`
- 强制更新 : `yarn upgrade [package] --latest`


---

To Be Continued.