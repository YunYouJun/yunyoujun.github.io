---
title: 开发常用命令笔记
tags:
  - php
  - 学习
  - 笔记
categories:
  - 云游的小笔记
date: 2017-08-21 23:49:30
updated: 2018-02-19 22:49:30
---

> # Linux

- 迭代删除文件夹中所有内容 ： `rm -rf &lt;filename or dirname&gt;`

## Bash

### 命令行打开网页或文件夹

- Linux : `open xxx`
- Windows : 打开网页 `start xxx` | 打开文件资源管理器 `explorer`

#### Example

打开网址 <www.yunyoujun.cn>：
`start www.yunyoujun.cn`

打开当前目录：
`explorer .`

### && 与 ||

- 如果第一个命令执行成功，与操作符 ( && )才会执行第二个命令

- 如果第一个命令执行失败，或操作符 ( || )才会执行第二个命令

```sh
# algolia.sh
export HEXO_ALGOLIA_INDEXING_KEY=xxx
hexo clean
hexo algolia
```

- 如上文件在 `git bash` 中执行时为逐行执行，执行完 `hexo clean` 后（不管从成功还是失败）执行 `hexo alglolia`

- `hexo clean && hexo algolia` 则意味着 `hexo clean` 执行成功，才会执行 `hexo algolia`


---

> ## Laravel

### 前端

*   将 .scss 文件编译为 .css 正常使用，编译命令如下： `npm run dev`
*   在每次检测到 .scss 文件发生更改时，自动将其编译为 .css 文件： `npm run watch-poll`

> 此处实质是 npm 内 package.json 的 scripts 字段，预先定义的脚本操作。

---

> ## Git

[Git常用语句](http://www.yunyoujun.cn/2017/08/21/git%e5%b8%b8%e7%94%a8%e8%af%ad%e5%8f%a5/)

---

To Be Continued.