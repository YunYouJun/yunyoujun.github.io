# Hexo 站点源文件

[![Build Status](https://www.travis-ci.com/YunYouJun/yunyoujun.github.io.svg?branch=hexo)](https://www.travis-ci.com/YunYouJun/yunyoujun.github.io)

## Use

### 日常发布

```sh
npm run backup
# 同时推送至 GitHub 与 Coding 的 hexo 分支
# 线上 Travis 会自动进行构建生成静态页面推送至 GitHub 与 Coding 的 master 分支
# or
sh backup.sh 'change info'
```

## BackUp

- [GitHub](https://github.com/YunYouJun/yunyoujun.github.io)
- [Coding](https://git.dev.tencent.com/YunYouJun/yunyoujun.coding.me.git)

```sh
git clone https://github.com/YunYouJun/yunyoujun.github.io
# coding
git remote add coding https://dev.tencent.com/u/YunYouJun/p/yunyoujun.coding.me
```

## Build

- use Travis-ci
- git clone themes/next

## Commit Lint

```sh
git commit -m 'xxx'
```

### 更新博客内容

```sh
blog: update content
```

### 页面

```sh
blog(page): xxx
```

### Other

```sh
chore(xxx): xxx
xxx: xxx
```

## FAQ

### Travis Bad decrypt (Because of Windows)

Remove ssh_rsa env

## Change Log

- 2019-01-22 return to github pages