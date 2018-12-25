# Hexo 站点源文件

[![Build Status](https://www.travis-ci.org/YunYouJun/yunyoujun.github.io.svg?branch=hexo)](https://www.travis-ci.org/YunYouJun/yunyoujun.github.io)

## Use

### 日常发布

```sh
npm run backup
# 同时推送至 GitHub 与 Coding 的 hexo 分支
# 线上 Travis 会自动进行构建生成静态页面推送至 GitHub 与 Coding 的 master 分支
```

## BackUp

- [GitHub](https://github.com/YunYouJun/yunyoujun.github.io)
- [Coding](https://coding.net/u/YunYouJun/p/yunyoujun.coding.me)

## Build

- use Travis-ci
- git clone themes/next
- git clone theme-next-third-plugin

## FAQ

### Travis Bad decrypt (Because of Windows)

Remove ssh_rsa env
