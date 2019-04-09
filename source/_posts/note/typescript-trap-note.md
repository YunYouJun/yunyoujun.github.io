---
title: TypeScript 踩坑记
date: 2018-01-29 15:04:44
updated: 2018-01-29 15:04:44
tags:
  - TypeScript
  - JavaScript
  - 学习
  - 笔记
categories:
  - 云游的小笔记
---

记录 TypeScript 使用过程中遇到的小问题和解决方案。

<!-- more -->

## Trap

### cannot find name 'require'

```js
const i18n = require('LanguageData');
```

`2.x` 版本的 TypeScript 可以直接使用如下命令解决。

```sh
npm install @types/node --save-dev
```

> <https://stackoverflow.com/questions/31173738/typescript-getting-error-ts2304-cannot-find-name-require>