---
title: Python 学习笔记
date: 2018-01-23 09:50:57
updated: 2018-09-01 13:15:57
tags:
  - Python
  - 学习
  - 笔记
categories:
  - 云游的小笔记
---

# Intro

记录一些关于 Python 学习过程中的规范、问题与技巧。

<!-- more -->

# About

## 教程

- [Python 教程 - 廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000) （内容详细）
- [《简明 Python 教程》](https://bop.mol.uno/) （排版舒适）
- [Crossin 的编程教室](http://crossincode.com/home/) （适合初学）

## Code

- [python-learn](https://github.com/YunYouJun/python-learn)

## 编辑器

- [VS Code](https://code.visualstudio.com/)（自己目前使用的是这个，需要配置。因为自己还写些其他语言代码，为省事便配置在了一起。）
- [PyCharm](https://www.jetbrains.com/pycharm/)

### 配置

`ctrl + p`

安装插件 `Python` （就叫 Python），输入如下命令，或直接在扩展里搜索。

```sh
ext install python
```

`ctrl + shift + b` 运行，或者右键选择在终端中运行 Python 文件。

记得还会自动提示安装 `pylint` (python 代码规范提示工具)。

如果安装失败，decoding 之类的，根据代码提示，ctrl + 路径进入文件，修改出错行编码 `utf-8` 为 `gbk` 。

### 技巧

（文件 -> 首选项 -> 设置）

强迫症患者，`C0111` 这类警告可以在用户设置里添加如下代码去掉。

```json
...
"python.linting.pylintArgs": ["--disable=C,R"],
...
```

因为平时写 js 用的是 tab 替换为两个空格， python 我看教程一般用的是四个空格缩进，就单独对 python 进行四个空格缩进设置了。

用户设置中添加如下代码：

```json
...
    "[python]": {
        "editor.tabSize": 4
    },
...
```

## 规范

### 缩进规范

官方推荐使用 4 个空格缩进

### 命名规范

#### 模块

文件名

- 尽量使用小写命名
- 首字母保持小写
- 尽量不要用下划线(除非多个单词，且数量不多的情况)

```py
snake_case
# 正确的模块名
import decoder
import html_parser

# 不推荐的模块名
import Decoder
```

#### 类名

使用驼峰(CamelCase)命名风格

- 首字母大写
- 私有类可用一个下划线开头

```py
class Farm():
    pass

class AnimalFarm(Farm):
    pass

class _PrivateFarm(Farm):
    pass
```

#### 函数

- 全小写
- 可使用下划线连接

```py
def func():
    pass

def func_with_some():
    pass
class Person():
    # 私有函数
    def _private_func():
        pass
```

#### 变量名

- 全小写
- 可使用下划线连接

```py
if __name__ == '__main__':
    count = 0
    school_name = ''

# 常量采用全大写，如有多个单词，使用下划线隔开
MAX_NUM = 100
MAX_IQ = 1000
```

## Python2 & Python3

### urllib

Python2 中的 `urllib2`, 在 Python3 中为 `urllib.request`

```py
import urllib2
# 修改为
import urllib.request
```

### 线程

Python3:

- \_thread
- threading(推荐使用)

Python2 `thread` 模块已被废弃。用户可以使用 threading 模块代替。所以，在 Python3 中不能再使用"thread" 模块。为了兼容性，Python3 将 thread 重命名为 "\_thread"。

[Python3 多线程 | 菜鸟教程](http://www.runoob.com/python3/python3-multithreading.html)

# Q&A

## 如何退出解释器提示符

### Linux & OS X

按下 <kbd>ctrl</kbd> + <kbd>d</kbd> 组合键或输入 `exit()` 并敲下 <kbd>enter</kbd>

### Windows

按下 <kbd>ctrl</kbd> + <kbd>z</kbd> 组合键并敲击 <kbd>enter</kbd>

## 获取帮助

如果你需要获得 Python 中有关任何函数或语句的快速信息，你可以使用其内置的 `help` 功能。

例如，运行 `help('len')` 命令——这将显示出有关 len 函数的帮助，了解其是用来计算项目数量的。

> 按下 <kbd>q</kbd> 键可以退出帮助。

# TIMELINE

- [x] 2018-01-23 ~ 2018-02-20 Crossin 的编程教室 - Python 入门
- [ ] 2018-09-01 Python 教程 - 廖雪峰的官方网站
- [x] 2018-09-01 ~ 2018-12-28 简明 Python 教程

---

To Be Continued.
