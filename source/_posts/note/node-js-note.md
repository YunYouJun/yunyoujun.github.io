---
title: Node.js 笔记
tags:
  - Node.js
  - 学习
  - 笔记
categories:
  - 云游的小笔记
date: 2017-09-19 15:24:02
updated: 2017-09-19 15:24:02
---

# Node.js

## Intro

学习 Node.js 中的一些笔记与资源。

<!-- more -->

## FAQ

### Node.js 部署

- 使用git安装 `nvm` (Git install) : `git clone https://github.com/creationix/nvm.git .nvm` (使用 `cd ~/` ，在root目录下安装即可。)
- 安装稳定版本 `node.js` : `nvm install stable`

参见：[https://github.com/creationix/nvm](https://github.com/creationix/nvm)

### Node.js 在LNMP环境下部署

- lnmp 创建虚拟主机
- 进入 `/usr/local/nginx/conf/vhost` 文件夹下修改conf虚拟主机配置。
- 将conf配置文件中 `location` 内容全部替换为如下内容：

```conf
    location / {
        proxy_redirect off;
        proxy_set_header   X-Real-IP            $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   Host                   $http_host;
        proxy_set_header   X-NginX-Proxy    true;
        proxy_set_header   Connection "";
        proxy_http_version 1.1;
        proxy_pass        http://127.0.0.1:3000;
        //此处端口号，应与设置中nodejs监听的端口号一致
    }
```

- 重启 `nginx` 服务器

### Node.js 实战教程

- [N-blog](https://github.com/nswbmw/N-blog) (使用 Express + MongoDB 搭建多人博客)

---

To Be Continued.