---
title: Travis-CI 持续集成部署
date: 2018-05-24 15:04:42
updated: 2018-05-24 15:04:42
tags:
  - 笔记
categories:
  - 云游的小笔记
---

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

---

To Be Continued.
