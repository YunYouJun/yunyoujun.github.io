---
title: Composer使用笔记
tags:
  - 学习
  - 笔记
  - PHP
categories:
  - 云游的小笔记
date: 2017-09-02 18:55:29
updated: 2017-09-02 18:55:29
---

<!-- more -->

> #### autoload

在 `composer.json` 中找到 `autoload` 字段

```json
"files": [
            "app/Helpers.php"
        ]
```

添加上述代码，可以增加全局自动加载的文件,即可以在全局使用 `Helpers.php` 中定义的函数。

需在命令行下运行 `composer dump-autoload` ,让 composer 重建加载信息，再在其他的文件中使用这个类了。

---

To Be Continued.
