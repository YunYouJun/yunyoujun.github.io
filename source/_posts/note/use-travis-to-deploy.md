---
title: Travis-CI 持续集成部署
date: 2018-05-24 15:04:42
updated: 2018-06-10 15:04:42
tags:
  - 笔记
categories:
  - 云游的小笔记
---

# Travis-CI

> Travis CI - Test and Deploy Your Code with Confidence

[travis-ci.org](https://www.travis-ci.org/)

<!-- more -->

## Intro

正如字面上的意思，Travis 可以用来测试和帮助自己部署网站。

一般自己闲来会写些并无卵用的小玩意儿，纯静态的页面话，便会部署在 [GitHub Pages](https://pages.github.com/) 上。
而动态网站则部署在自己的服务器上，又或是如下有一些可以部署测试的动态服务。（当然那样的话，自定义域名之类的服务就要收费了。）

- [heroku](https://www.heroku.com/)
- [now.sh](https://zeit.co/now)

---

```sh
language: node_js
node_js:
  - lts/*
cache:
  directories:
    - "node_modules"
branches:
  only:
  - master
addons:
  apt:
    packages:
    - sshpass
install:
  - yarn install
script:
  - npm run build
after_success:
  - export SSHPASS=$VPS_PWD
  - sshpass -e ssh -o stricthostkeychecking=no root@139.199.22.90 "sh /data/wwwroot/coc.yunyoujun.cn/deploy-ci.sh $TOKEN"
```

## 加密 Token

使用 [Travis CI](https://github.com/travis-ci/travis.rb#readme) 的命令行工具加密 GitHub 的 Personal Access Token。

```sh
travis encrypt -r YunYouJun/repo GH_TOKEN=XXX
```

## Token

### GitHub Pages

```sh
git push --force "https://${GH_TOKEN}@${GH_REF}" master:master
```

### Coding Pages

Coding 还需要加 用户名 前缀 `https://xxx:${CODING_TOKEN}@${CD_REF}`

```sh
git push --force "https://yunyoujun:${CODING_TOKEN}@${CD_REF}" master:master
```

```yml
env:
  global:
    - GH_REF: github.com/YunYouJun/yunyoujun.github.io.git
    - CD_REF: git.dev.tencent.com/YunYouJun/yunyoujun.coding.me.git
```

---

To Be Continued.
