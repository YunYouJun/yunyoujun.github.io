---
title: Hexo 静态博客搭建笔记
tags:
  - 分享
  - 学习
  - 笔记
categories:
  - 云游的小笔记
date: 2017-10-13 12:40:32
updated: 2017-02-02 12:40:32
---

> Wordpress 你放心，我暂时是不会抛弃你的。
> 2017.12.11 正式抛弃 2333

---

## Intro

[Hexo](https://hexo.io/)：快速、简洁且高效的博客框架

<!-- more -->

## 优点

- 多语言文档（含中文）
- 静态博客，无需服务器
- 部署、迁移、备份方便
- Geek

## 部署

跟随文档步骤即可：[https://hexo.io/zh-cn/docs/](https://hexo.io/zh-cn/docs/)

## 推荐主题

- [hexo-theme-yun](https://github.com/YunYouJun/hexo-theme-yun)：没错，是私货
- [hexo-theme-next](https://github.com/theme-next/hexo-theme-next)：应该是最出名的 Hexo 主题

---

## 一些解决方案

### 备份自己的 Hexo 源文件

- 在本地的 GitHub Pages 的项目(xxx.github.io)中,通过 `git bash` 建立新的分支 hexo
  (可以现在 GitHub 上新建再 clone 自自己的文件夹)

```bash
git checkout -b hexo
```

- `git checkout hexo` 切换至 hexo 分支
- 此后对 hexo 源文件的配置修改等操作，默认在此分支下操作即可
- 将修改推送至远程分支

```bash
git add -A
git commit -m 'update hexo backup'
git push origin hexo
```

### 每次命令执行繁琐，使用批处理

- 在 Hexo 根目录下新建批处理文件 `update.sh`,并编辑如下内容。

```bash
hexo clean # 清除缓存
hexo d -g # 重新部署 Hexo
git add -A
git commit -m 'update hexo backup'
git push origin hexo # 备份 Hexo 源文件
```

- 在 Hexo 根目录下，通过如下命令执行。

```bash
./update.sh
```

### [集成 Algolia 搜索插件](https://www.npmjs.com/package/hexo-algolia)

#### [Algolia](https://www.algolia.com/)

The Most Reliable Platform for Building Search.

在 hexo 的 `_config.yml` 文件中，添加 algolia 配置。（注释记得去掉）

```yml
algolia:
  applicationID: 'xxx'
  apiKey: 'xxx'
  indexName: 'my-hexo-blog' // 填写在 aloglia 中设置的名称
  chunkSize: 5000
  fields:
    - excerpt
    - excerpt:strip
    - gallery
    - permalink
    - photos
    - slug
    - tags
    - title
```

```sh
npm install hexo-algolia --save // 使用 npm 安装 hexo-algolia 插件
export HEXO_ALGOLIA_INDEXING_KEY=xxx // xxx 为 apiKey
hexo clean
hexo algolia // 生成index
```

### 为 Next 主题添加阅读次数统计

[**LeanCloud**](http://leancloud.cn)
采用第三方 LeanCloud 服务实现

[Next](http://theme-next.iissnan.com/) 主题集成了 LeanCloud 统计。

- 进入官网，注册账号，创建应用（开发版为免费使用）
- 进入创建的应用中，选择左侧导航栏中的“存储”，随后点击“创建 Class”，将 Class 名称填为 Counter，并选择**无限制**选项。
- 进入 Next 主题配置文件 `_config.yml` ，配置 `leancloud_visitors` 属性 `enable` 为 `true`，并配置对应的 `App ID` 与 `App Key` 。 (在 `LeanCloud` 左侧导航栏的设置界面，单击“应用 Key”可以看到应用的 App ID 和 App Key。)

---

## 小技巧

### 配置 theme/next

可以在 `source` 文件夹(含有 `_post` 的文件夹)下新建 `_data` 文件夹，并在其中新建 `next.yml`。其后将需要特定的配置从 `theme/next/_config.yml` 中复制过来即可。

如果需要覆盖 `_config.yml` 默认配置， 修改 `next.yml` 中 `override: true`。

### 自动生成目录

开启 toc (Table of Contents)，

```md
---
title: xxx
toc: true
---

...
```

也可以在设置 `next.yml`中设置默认开启。

```yml
# Table Of Contents in the Sidebar
toc:
  enable: true
```

## Example

在 [GitHub Pages](https://yunyoujun.github.io) 和 [Coding Pages](https://yunyoujun.coding.me) 上都进行了部署。

`_config.yml` 可参考 [GitHub Address](https://github.com/YunYouJun/yunyoujun.github.io)
