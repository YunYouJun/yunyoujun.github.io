---
title: 酷 Q 使用笔记
date: 2019-05-15 19:45:31
updated: 2019-05-15 19:45:31
tags:
  - 学习
  - 笔记
  - CoolQ
categories:
  - 云游的小笔记
---

<!-- 2020-04-03 19:45:31 -->

## Intro

[Webqq](https://web2.qq.com/) 早已于 2019-01-01 起正式停止服务。

那么以此为基础的 qq 机器人便全部失效。以前折腾的也已作废。

- [qqbot](https://github.com/pandolia/qqbot)

因此，所剩的尚跨可靠的选择似乎只有 [酷 Q](https://cqp.cc/) 还说得过去。

本文便用于记录配置过程中的坑。

<!-- more -->

## Progress

想要长久在线，自然是要挂在服务器上的。
那么 Linux 便是跨不过去的坎。

想让 酷 Q 在 Linux 上运行则推荐使用 [docker](https://www.docker.com/) 。

[[发布]酷 Q on Docker](https://cqp.cc/t/34558)

> 当前版本为 3.1

### Install Docker

Linux 不同主流发行版本在官方文档中都有详细的安装过程。

> [Get Docker CE](https://docs.docker.com/install/linux/docker-ce/debian/)

CentOS:

```sh
yum install docker
# 启动 Docker
systemctl start docker
```

但 Deepin (即深度) 基于 Debian 进行了定制，本以为按照 Debian 进行安装就可以，但没能成功。
无法找到 Deepin 的安装版本。

[深度系统如何安装 docker？](https://bbs.deepin.org/forum.php?mod=viewthread&tid=139514&page=1&authorid=76809)

尝试了文中的做法也没有成功。
问题出在 `sudo add-apt-repository` 。

尝试修改了 `/etc/lsb-release`，竟然成功了。

```ini
; DISTRIB_ID=Deepin
DISTRIB_ID=Debian
DISTRIB_RELEASE="15.10"
DISTRIB_DESCRIPTION="Deepin 15.10"
; DISTRIB_CODENAME=stable
DISTRIB_CODENAME=wheezy
```

等安装好后，为防止以后系统更新等 Bug，又改回了 `Deepin/stable`。

### 安装 酷 Q

#### 下载 酷 Q Docker 镜像

```sh
docker pull coolq/wine-coolq
```

在任意目录创建一个空文件夹，用于持久化存放 酷 Q 数据：

```sh
mkdir /root/coolq-data # 任意路径均可
```

运行 酷 Q 镜像

```sh
docker run --name=coolq --rm -p 8080:9000 -v /root/coolq-data:/home/user/coolq -e VNC_PASSWD=12345678 -e COOLQ_ACCOUNT=123456 coolq/wine-coolq
```

Example:

```sh
docker run --name=coolq --rm -p 8080:9000 -v /root/coolq-data:/home/yunyou/coolq -e VNC_PASSWD=yunyou -e COOLQ_ACCOUNT=xiaoai coolq/wine-coolq
docker run --name=coolq -d -p 8080:9000 -v /root/coolq-data:/home/yunyou/coolq -e VNC_PASSWD=yunyou -e COOLQ_ACCOUNT=xiaoai coolq/wine-coolq
```

#### 后台服务

启动容器

`--rm` 替换为 `-d`

```sh
docker run --name=coolq -d -p 8080:9000 -v /root/coolq-data:/home/user/coolq -e VNC_PASSWD=12345678 -e COOLQ_ACCOUNT=123456 coolq/wine-coolq
```

| Argument     | Example          |
| ------------ | ---------------- |
| 远程监听端口 | 8080             |
| 数据存放位置 | /root/coolq-data |
| 远程访问密码 | 12345678         |
| 机器人帐号   | 123456           |

查看日志

```sh
docker logs coolq
```

启动/停止服务

```sh
docker start coolq
docker stop coolq
```

### 安装 [CoolQ HTTP API 插件](https://cqhttp.cc/)

```sh
docker pull richardchien/cqhttp:latest
```

或者 [手动安装](https://cqhttp.cc/docs/4.10/#/?id=手动安装)

#### Run Coolq

```sh
docker run -ti --rm --name cqhttp-test \
            -v $(pwd)/coolq:/home/user/coolq \  # 将宿主目录挂载到容器内用于持久化 酷Q 的程序文件
            -p 9000:9000 \  # noVNC 端口，用于从浏览器控制 酷Q
            -p 5700:5700 \  # HTTP API 插件开放的端口
            -e COOLQ_ACCOUNT=123456 \ # 要登录的 QQ 账号，可选但建议填
            -e CQHTTP_POST_URL=http://example.com:8080 \  # 事件上报地址
            -e CQHTTP_SERVE_DATA_FILES=yes \  # 允许通过 HTTP 接口访问 酷Q 数据文件
            richardchien/cqhttp:latest
```

进入容器内部，添加需改环境变量

```sj
docker exec -ti 容器ID/容器名  /bin/bash
```

### 安装 NoneBot

因为自己 C++ 并不怎么熟悉，所以打算使用 api 插件，来使用 Node.js/Python 来开发。

随后发现了 [NoneBot](https://github.com/richardchien/nonebot) 这样封装好的框架，使用 Python 。

参见文档进行安装。

```sh
# pip 为 python 的包管理工具，请提前安装好 Python , pip 。
# More Info: https://yunyoujun.cn/note/linux-learn-note/
pip install nonebot
```

使用参见 [NoneBot 文档](https://nonebot.cqp.moe/)

### GitHub Webhook

[WebHooks-自动部署](https://yunyoujun.cn/project/QQ-XiaoAi/#WebHooks-自动部署)

## FAQ

### 端口号未开启

T^T 这个问题找了我好久

```sh
iptables -I INPUT 4 -p tcp -m state --state NEW -m tcp --dport 8080 -j ACCEPT
service iptables save #保存iptables规则
```

## Example

GitHub: [xiao-ai](https://github.com/YunYouJun/xiao-ai)

---

TO BE CONTINUED.
