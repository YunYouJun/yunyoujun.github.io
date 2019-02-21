---
title: 搭建自己的 Minecraft 服务器
date: 2019-02-21 15:27:40
updated: 2019-02-21 15:27:40
tags:
categories:
---

# Minecraft Server

## 闲话

腾讯云的学生机其实续费了几年，也没怎么使用它。
阿里云的学生机更是到前几个月，干脆让它过期了。

如今，既别无他用，有想到群内的小伙伴们之前一起在玩 MC ，便索性用来搭建一个私服。
记录下过程，已便看官参考，或自己日后复现。

<!-- more -->

## About

本实验设备为 CentOS 7，其他 Linux 服务器可举一反三。

## Set up

想让 Minecraft 在 Linux 上运行，自然需要其 Java 版本。

### Install Java

```sh
# 查看可获得的 java 版本
yum -y list java*
```

```sh
# 安装 java
yum -y install java-1.8.0-openjdk
# apt-get
```

### Install Minecraft Server

安装 Minecraft 服务器版本

#### Download

```sh
mkdir /opt/minecraft
cd /opt/minecraft
# 若没有 wget，需先安装
# yum -y wget
wget https://s3.amazonaws.com/Minecraft.Download/versions/1.12.2/minecraft_server.1.12.2.jar
```

```sh
# 编译安装
java -Xms512M -Xmx1024M -jar minecraft_server.1.12.2.jar nogui
# 初次允许结束会返回一个错误，将会生成一个新的 eula.txt 文件
```

配置可自行修改

- `-Xms512M` 服务端能使用的最小内存
- `-Xmx1024M` 最大内存

需要同意文件里的协议，通过下面这条命令将 `eula=true` 添加到文件中：

```sh
sed -i.orig 's/eula=false/eula=true/g' eula.txt
# 再次运行
java -Xms512M -Xmx1024M -jar minecraft_server.1.12.2.jar nogui
```

### 编写自动化脚本

```sh
nano /opt/minecraft/startminecraft.sh
```

键入以下内容

```sh
#!/bin/bash
cd /opt/minecraft/ && java -Xms2048M -Xmx3472M -jar minecraft_server.1.12.2.jar nogui
# 保存并退出
# 按 ctrl+x y 回车
```

```sh
# 给予执行权限
chmod +x /opt/minecraft/startminecraft.sh
```

退出 SSH 时，服务端也会关闭。

需要开启新的 screen 会话。

```sh
# 若没有 screen，需先安装
# yum -y screen
screen -S minecraft
/opt/minecraft/startminecraft.sh
```

### Backup

若想要备份服务器世界的地图

#### Backup.sh

编写备份脚本

> 打算使用 git 来进行备份，别打我

- [腾讯云开发者平台](https://dev.tencent.com)

```sh
cd xxx
git add -A
git commit -m "mc-server-world-backup"
git push
```

设置定时备份任务

```sh
vi /etc/crontab
```

键入以下内容

```sh
30 2 * * * root /backup/xxx-backup.sh
# 每天 2:30 执行备份任务
```

## Q&A

### 登入失败：无效会话

服务器默认会对版权进行校验，如果不是使用正版 MC 登陆，会出现 `登入失败：无效会话`。
需要将服务器中 `server.properties` 文件中， `online-mode` 对应值修改为 `false`。

## Referene

- [如何搭建“我的世界”服务器](https://linux.cn/article-9480-1.html)

---

To be contined.