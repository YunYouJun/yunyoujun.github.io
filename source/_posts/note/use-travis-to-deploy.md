---
title: Travis-CI 持续集成部署
date: 2018-05-24 15:04:42
updated: 2018-05-24 15:04:42
tags:
  - 笔记
categories:
  - 云游的小笔记
---

# Travis-CI

<!-- more -->

- [heroku](https://www.heroku.com/)
- [now.sh](https://zeit.co/now)

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
    - CD_REF: git.coding.net/YunYouJun/yunyoujun.coding.me.git
```

---

To Be Continued.
