---
title: Everyday Auto Xuexiqiangguo
date: 2019-05-16 21:51:55
updated: 2019-05-16 21:51:55
tags:
  - 学习
  - 笔记
categories:
  - 云游的小笔记
---

You know what I mean.

<!-- more -->

GitHub: [Fuck-XueXiQiangGuo](https://github.com/fuck-xuexiqiangguo/Fuck-XueXiQiangGuo)

## Install

[直接在命令行界面运行](https://github.com/fuck-xuexiqiangguo/Fuck-XueXiQiangGuo#直接在命令行界面运行)

`github` 源下载很慢，可以试试[镜像2](https://cdn.staticaly.com/gh/fuck-xuexiqiangguo/Fuck-XueXiQiangGuo/master/Fuck%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD-linux.zip)。

网站说明文档提供的是 `Ubuntu` 系列安装方法，与 `CentOS` 系列略有区别。

```sh
# CentOS
yum update
yum upgrade
yum install -y \
    wget \
    unzip \
    Xvfb \
    gtk3 \
    libXScrnSaver \
    # alsa-lib-devel.x86_64

Xvfb -ac -screen scrn 1280x2000x24 :9.0 &
export DISPLAY=:9.0

# 下载并解压程序
wget -O fuck-xuexiqiangguo.zip https://cdn.staticaly.com/gh/fuck-xuexiqiangguo/Fuck-XueXiQiangGuo/master/Fuck学习强国-linux.zip
unzip -q -d ./fuck-xuexiqiangguo/ fuck-xuexiqiangguo.zip

cd fuck-xuexiqiangguo
chmod +x ./Fuck学习强国

# 运行程序
./Fuck学习强国 --headless

# 等待片刻，使用学习强国APP扫描屏幕上的二维码登录
```

## Help

```sh
./Fuck学习强国 --help
```

## Auto

编写每天随机时间执行脚本。

```sh
# vim /etc/crontab
0 8 * * * root /home/yunyou/bash/start-xxqg.sh
```

```sh
# vim /home/yunyou/bash/start-xxqg.sh
# start-xxqg.sh
python3 /home/yunyou/bash/close-xxqg.py
screen -r xxqg
# sleep ${RANDOM}'s'
export DISPLAY=:9.0
cd /home/yunyou/github/fuck-xuexiqiangguo
./Fuck学习强国 --headless
```

```py
# kill xuexiqiangguo
# vim /home/yunyou/bash/close-xxqg.py
# close-xxqg.py
import os
import signal
list = os.popen("ps -ef|grep ./Fuck|grep headless|grep -v grep|awk '{print $2}'").readlines()
for pid in list:
    os.kill(int(pid),signal.SIGKILL)
```