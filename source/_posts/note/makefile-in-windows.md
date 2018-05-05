---
title: 在 Windows 中使用 Makefile
date: 2018-05-05 20:52:13
updated: 2018-05-05 20:52:13
tags:
  - makefile
  - 笔记
categories:
  - 云游的小笔记
---
# Intro

在 Windows 上使用 Makefile

<!-- more -->

## Reason

使用 Latex 的过程中用到了 Makefile ，但是 Makefile 是 Linux 上带的

## Process

安装 [MinGW](https://sourceforge.net/projects/mingw/)

安装好后记得勾选 `mingw32-make`

Installation -> apply

找到 `make.exe` 所处路径，为 Windows 系统新增环境变量

```cmd
C:\MinGW\msys\1.0\bin
```