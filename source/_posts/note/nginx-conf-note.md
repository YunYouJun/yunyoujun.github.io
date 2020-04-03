---
title: Nginx 配置笔记
date: 2018-05-24 15:08:41
updated: 2018-05-24 15:08:41
tags:
  - 笔记
categories:
  - 云游的小笔记
---

<!-- more -->

## Nginx 反向代理

```conf
upstream nuxt {
    server 127.0.0.1:3000; #nuxt项目 监听端口
    keepalive 64;
}

server {
    listen 80;
    server_name coc.yunyoujun.cn;
    location / {
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Nginx-Proxy true;
        proxy_cache_bypass $http_upgrade;
        proxy_pass http://nuxt; #反向代理
    }
}
```

### API 代理

```conf
server {
# ...
  location /api/ {
    proxy_http_version 1.1;
    proxy_pass http://api.clashofclans.com/v1/;

    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "POST, GET, OPTIONS";
    add_header Access-Control-Allow-Headers "Origin, Authorization, Accept";
    add_header Access-Control-Allow-Credentials true;
  }
# ...
}
```

---

## 参考

> [next.js、nuxt.js 等服务端渲染框架构建的项目部署到服务器，并用 PM2 守护程序](https://segmentfault.com/a/1190000012774650)

---

To Be Continued.
