---
title: VS Code 配置笔记
date: 2018-01-29 15:39:20
updated: 2018-01-29 15:39:20
tags:
 - VS Code
 - 笔记
categories:
 - 云游的小笔记
---
# Intro

记录一些 `VS Code` 的一些常用配置。

<!-- more -->

# 配置

文件 -> 首选项 -> 设置

输入到右侧 `用户设置` 里覆盖默认设置即可

```json
{

}
```

## 自动换行

```json
"editor.wordWrap": "on",  // 超出显示范围，自动换行（只是显示效果上，并没有真正换行）
```

## TAB 转空格

```json
"editor.tabSize": 2,  // tab 键替换为 2 空格
```

## 终端改为 Git Bash

```json
"terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",
```

# 常用快捷键

快捷键|命令|位置
---|---|---
`Ctrl+K Ctrl+S`|键盘快捷方式|文件 -> 首选项 -> 键盘快捷方式
`Ctrl+Shift+P`|显示所有命令|
`Ctrl+` `|切换集成终端|

# 相关

 [Python 配置](https://yunyoujun.cn/note/python-growth-path/#编辑器)

---

To Be Continued.