---
title: rollup 使用笔记
date: 2019-02-07 13:55:36
updated: 2019-02-07 13:55:36
tags:
  - rollup
  - 笔记
  - 学习
categories:
  - 云游的小笔记
---

# [rollup.js](https://rollupjs.org)

## Intro

rollup.js 使用笔记

<!-- more -->

```sh
# install
npm install --global rollup
```

## Command

> More Info [command-line-flags](https://rollupjs.org/guide/en#command-line-flags)

```sh
rollup -c -w
```

| 参数 | 描述 |
| - | - |
| -c | 表示使用配置文件进行打包，若未指定使用的配置文件，则使用默认的配置文件 `rollup.config.js` |
| -w | 监听文件变化并打包 |

## Example

- [rollup-starter-lib](https://github.com/rollup/rollup-starter-lib)
- [rollup-starter-app](https://github.com/rollup/rollup-starter-app)

## Plugin

### Minify

- [rollup-plugin-uglify](https://www.npmjs.com/package/rollup-plugin-uglify) for ES5
- [rollup-plugin-terser](https://github.com/TrySound/rollup-plugin-terser) for ES6