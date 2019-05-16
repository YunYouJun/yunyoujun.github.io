---
title: Deepin 使用笔记
date: 2019-04-29 18:23:47
updated: 2019-04-29 18:23:47
tags:
  - 学习
  - 笔记
  - Linux
categories:
  - 云游的小笔记
---

[Deepin](https://www.deepin.org/)

深度操作系统 - Linux 发行版

<!-- more -->

## 前言

因为最近电脑中了恶意软件的圈套，清除又恨麻烦。
想到兴许还有几月便可以换上新装备，而现今有没有对电脑的稳定需求，便索性安装成 Linux 尝尝鲜。
早便听得 Deepin 的本土化和常用软件兼容性做得很好，便以其为主，记录一下还原当初 Windows 工作环境的过程。

More info: [Linux 使用笔记](../linux-use-note/)

## Install

[Wiki](https://wiki.deepin.org/)

安装过程很简单，下载镜像，刻入 U 盘。

U 盘启动器制作工具：

- [etcher](https://etcher.io/)
- [rufus](https://rufus.ie/)

### System

安装好后最好切换为阿里云的 CDN ，比官方的速度还要快些。

不需要 `vim /etc/apt/sources.list` 修改

`系统设置菜单 > 更新 > 更新设置 > 切换镜像源` 即可，若为显示 `切换镜像源`，需要先关闭 `智能镜像源`。

#### 蓝牙键盘

我的蓝牙键盘罗技 Keyboard K480，连接时还需要输入配对码，所以不能简单通过系统自带蓝牙连接上。

##### bluetoothctl

```sh
sudo service bluetooth start # 打开系统蓝牙
bluetoothctl # 进入bluetoothctl
power on
agent on
default-agent
scan on # 扫描其它蓝牙设备
pair YourDeviceMacAddress # 与设备配对（请把 YourDeviceMacAddress 换成你蓝牙键盘的 MAC 地址）
# 这时终端应该会显示如下类似信息
# [agent] Passkey: 123456
# 在键盘上输入配对码后回车
trust YourDeviceMacAddress # 信任该设备
connect YourDeviceMacAddress # 连接该设备
# 这时候键盘上的指示灯不再闪烁，则键盘已成功连接
```

or

##### blueman

一款功能强大的蓝牙管理器

```sh
sudo apt install blueman
```

> [deepin连接罗技蓝牙键盘K380](https://www.lolimay.cn/2018/11/07/deepin-keyboard-k380/)

#### 打印机

[打印机 - deepin wiki](https://wiki.deepin.org/wiki/打印机)

[Deepin上使用惠普打印机 - deepin wiki](https://wiki.deepin.org/wiki/Deepin上使用惠普打印机)

首先按照官方教程，安装好相关厂商打印机的驱动。

##### 无线打印机

Linux 下似乎识别不了 `169.254.x.x` 网段，所以如果在此段的打印机需要先将无线打印机地址设置为 `DHCP`。
（我是先用家里另外一台 Windows 系统电脑，进入 `169.254.x.x` 设置的。）

设置为 `DHCP`后，会自动切换到 `192.168.x.x`。
此时再输入 `hp-setup` 设置无线打印机，最后 `ho-setup 192.168.x.x` 添加无线打印机。

---

To Be Continued.