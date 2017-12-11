---
title: Composer使用笔记
tags:
  - 学习
id: 530
categories:
  - 未分类
date: 2017-09-02 18:55:29
---

> #### autoload

在 `composer.json` 中找到 `autoload` 字段

    "files": [
                "app/Helpers.php"
            ]

添加上述代码，可以增加全局自动加载的文件,即可以在全局使用 `Helpers.php` 中定义的函数。

需在命令行下运行 `composer dump-autoload` ,让composer重建加载信息，再在其他的文件中使用这个类了。

* * *

To Be Continued.