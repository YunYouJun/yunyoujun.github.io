---
title: Python成长之路
date: 2018-01-23 09:50:57
updated: 2018-01-29 13:15:57
tags:
  - Python
  - 学习
  - 笔记
categories:
  - 云游的小笔记
---

# 前言

最近和朋友一起学 Python 啦。

记录一些学习路上的问题与技巧。

# 准备
## 教程
网上随便搜了搜，排去火热的培训班。
剩下两个感觉似乎还不错的教程。
 
- [Crossin的编程教室](http://crossincode.com/home/)
- [《简明 Python 教程》](https://bop.mol.uno/)

初步决定使用第一个教程，顺便注册个账号可以记录自己学习到的进度。每天看几课。

## 编辑器

教程里使用的还是 Windows 上 Python 附带的 IDLE ( IDE )。
不是很符合自己的审美，加之成了 `VS Code` 粉。便配置配置 `VS Code` 当 Python 的 IDE 了。

### 配置

`ctrl + p`

安装插件 `Python` （就叫 Python），输入如下命令，或者直接在扩展里搜就可以了。
```
ext install python
```

`ctrl + shift + b` 运行，或者右键选择在终端中运行 Python 文件。

记得还会自动提示安装 `pylint` (python 代码规范提示工具)。

如果安装失败，decoding 之类的，根据代码提示，ctrl + 路径进入文件，修改出错行编码 `utf-8` 为 `gbk` 。

### 技巧
（文件 -> 首选项 -> 设置）

强迫症患者，`C0111` 这类警告可以在用户设置里添加如下代码去掉。
```
...
"python.linting.pylintArgs": ["--disable=C,R"],
...
```
因为平时写 js 用的是 tab 替换为两个空格， python 我看教程一般用的是四个空格缩进，就单独对 python 进行四个空格缩进设置了。
用户设置中添加如下代码：
```
...
    "[python]": {
        "editor.tabSize": 4
    },
...
```

## 命名规范

Python 文件名和变量名推荐的命名规范是 `snake_case`

- 全小写
- 可使用下划线连接

---

To Be Continued.