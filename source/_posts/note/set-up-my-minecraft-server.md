---
title: 搭建自己的 Minecraft 服务器
date: 2019-02-21 15:27:40
updated: 2019-03-01 15:27:40
tags:
  - Minecraft
  - 笔记
categories:
  - 云游的小笔记
---

## 闲话

腾讯云的学生机其实续费了几年，也没怎么使用它。
阿里云的学生机更是到前几个月，干脆让它过期了。

如今，既别无他用，有想到群内的小伙伴们之前一起在玩 MC ，便索性用来搭建一个私服。
记录下过程，以便看官参考，或自己日后复现。

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
yum -y install java-latest-openjdk
# ubuntu
# apt install default-jdk
```

### Install Minecraft Server

安装 Minecraft 服务器版本

[下载 MINECRAFT ：JAVA 版的服务器](https://www.minecraft.net/zh-hans/download/server/)

#### Download

几经辗转，发现官服是安装不了插件的。

<http://mineplugin.org>

如有兴趣，可参考百科安装不同服务器版本。

你可以在 [这里](https://www.minecraft.net/zh-hans/download/server/) 下载官方 JAVA 版的最新版本服务器。（替换下方下载链接）

```sh
mkdir /opt/minecraft
cd /opt/minecraft
# 若没有 wget，需先安装
# yum -y wget
wget https://launcher.mojang.com/v1/objects/bb2b6b1aefcd70dfd1892149ac3a215f6c636b07/server.jar
# 1.14.4
```

```sh
# 编译安装
java -Xms512M -Xmx1024M -jar server.jar nogui
# 初次允许结束会返回一个错误，将会生成一个新的 eula.txt 文件
```

配置可自行修改

- `-Xms512M` 服务端能使用的最小内存
- `-Xmx1024M` 最大内存

需要同意文件里的协议，通过下面这条命令将 `eula=true` 添加到文件中：

```sh
sed -i.orig 's/eula=false/eula=true/g' eula.txt
# 再次运行
java -Xms512M -Xmx1024M -jar server.jar nogui
```

### 编写自动化脚本

```sh
nano /opt/minecraft/start-mc.sh
```

键入以下内容

```sh
#!/bin/bash
cd /opt/minecraft/ && java -Xms2048M -Xmx3472M -jar server.jar nogui
# 保存并退出
# 按 ctrl+x y 回车
```

```sh
# 给予执行权限
chmod +x /opt/minecraft/start-mc.sh
```

退出 SSH 时，服务端也会关闭。

需要开启新的 screen 会话。

```sh
# 若没有 screen，需先安装
# yum -y screen
screen -S mc
/opt/minecraft/start-mc.sh
```

### 加入自启动

使 Linux 重启时，自动运行该脚本

```sh
nano /etc/rc.local
```

进入文件，加入以下内容

```sh
screen -dm -S mc /opt/minecraft/start-mc.sh
exit 0
```

### Backup

若想要备份服务器世界的地图

#### Backup.sh

编写备份脚本

> 打算使用 git 来进行备份，别打我

- [腾讯云开发者平台](https://dev.tencent.com)

```sh
# /opt/minecraft/mc-server-backup.sh
cd /opt/minecraft/ && git add -A && git commit -m "mc-server-world-backup" && git push
# 注意 linux 和 windows 换行符
# cd /opt/minecraft
# git add -A
# git commit -m "mc-server-world-backup"
# git push -u origin master
```

设置定时备份任务

```sh
vi /etc/crontab
```

键入以下内容

```sh
30 2 * * * root /opt/minecraft/mc-server-backup.sh
# 每天 2:30 执行备份任务
```

## Q&A

### 登入失败：无效会话

服务器默认会对版权进行校验，如果不是使用正版 MC 登陆，会出现 `登入失败：无效会话`。
需要将服务器中 `server.properties` 文件中， `online-mode` 对应值修改为 `false`。

### 内网穿透

发现小伙伴的一篇文章 [白嫖超算来开服 — 天河二号超级计算机白嫖教程](https://2890.ltd/blog/white-whoring-can-be-used-to-run-minecraft-1.html)

得知[超算习堂](https://easyhpc.net/)这个网站，进入任意课程会分配一台 48 G 内存的虚拟机。
可以连外网，于是也尝试部署了一下 MC 服务器，并用 [Sakura Ftp](https://www.natfrp.com/) 做了内网穿透，竟然成功了。
初始进入的速度很快。

用了 screen，然后关闭浏览器页面，竟然没有立刻终端。结果几分钟还是被收回了，白高兴一场。（~~白嫖失败~~）
似乎找台服务器一直挂着页面可以一直持续下去。因为不小心关掉就没办法备份数据等考虑，还是继续用我的小水管服务器吧。

不过的确算是找到了一个可以实验的地方。

## Command

记录 Minecraft 中常用的指令

### Server

服务端执行

```sh
# 赋予管理权限
/op 用户名
```

### Client

```sh
# 死亡不掉落
/gamerule keepInventory true
```

### gamemode

更改游戏模式

```sh
# Example
# 改变红色组别所有玩家的游戏模式为创造模式
/gamemode creative @a[team=Red]
```

| Params | Description    |
| ------ | -------------- |
| @p     | 距离最近的玩家 |
| @r     | 随机玩家       |
| @a     | 所有玩家       |
| @e     | 所有实体       |

| Params | Description  |
| ------ | ------------ |
| m      | 游戏模式     |
| team   | 队伍         |
| r      | 小于半径区域 |
| rm     | 大于半径区域 |
| type   | 实体种类     |

- `[r=R]` 只选择以指令的执行处为中心，半径小于 R 的区块里的目标。
- `[rm=RM]` 只选择以指令的执行处为中心，半径大于 RM 的区块里的目标。

### scoreboard

```sh
/scoreboard teams add <队伍名称> [显示名称]
```

```sh
/scoreboard teams remove <队伍名称>
```

```sh
# 加入队伍
/scoreboard teams join <队伍名称> [玩家]
```

```sh
# 设置
/scoreboard teams option <队伍名称> <选项> <值>
```

Example:

```sh
/scoreboard teams option <队伍名称> color red
/scoreboard teams option <队伍名称> friendlyfire false
/scoreboard teams option <队伍名称> nametagVisbility hideForOtherTeams
```

| Params                 | Description            | Options                                       | Default |
| ---------------------- | ---------------------- | --------------------------------------------- | ------- |
| friendlyfire           | 队友伤害               | true/false                                    | true    |
| nametagVisbility       | 名称标签可见形式       | never/hideForOtherTeams/hideForOwnTeam/always | always  |
| deathMessageVisibility | 死亡时如何显示死亡讯息 | never/hideForOtherTeams/hideForOwnTeam/always | always  |

可选颜色

- black(黑色)
- dark_blue(深蓝色)
- dark_green(深绿色)
- dark_aqua (深水蓝色)
- dark_red(深红色)
- dark_purple(深紫色)
- gold(金色)
- gray(灰色)
- dark_gray(深灰色)
- blue(蓝色)
- green(绿色)
- aqua(水蓝色)
- red(红色)
- light_purple(亮紫色)
- yellow(黄色)
- white(白色)
- reset(恢复到预设的颜色)

## 插件

一些有趣的插件

### [Dragon Mounts 2 | 龙骑士]

孵化末影龙

[官网下载地址](https://minecraft.curseforge.com/projects/dm2/files)

依赖 [llibrary](https://minecraft.curseforge.com/projects/llibrary)

## Reference

- [如何搭建“我的世界”服务器](https://linux.cn/article-9480-1.html)
- [指令(游戏[Minecraft]中的运算机制)](https://baike.baidu.com/item/指令/18765029)

## 后话

因为服务器全天在线，所以时间也会相应流逝，颇有些加速世界的无限制中立空间的感觉。

## More

- [Minecraft 生存日记](https://www.yunyoujun.cn/diary/minecraft-survival-diary/)

---

Q.E.D.
