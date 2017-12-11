---
title: Laravel 使用笔记
tags:
  - php
  - 学习
  - Laravel
categories:
  - 云游的小笔记
date: 2017-08-21 16:26:58
---

* * *

<!-- more -->

## 线上部署

#### 相关过程：

1.  [LNMP一键安装包](http://www.yunyoujun.cn/2017/08/20/lnmp%e4%b8%80%e9%94%ae%e5%ae%89%e8%a3%85%e5%8c%85/)
2.  [记LNMP一键安装后Laravel线上部署的坑](http://www.yunyoujun.cn/2017/08/20/%e8%ae%b0laravel%e7%ba%bf%e4%b8%8a%e9%83%a8%e7%bd%b2%e7%9a%84%e5%9d%91/)

* * *

#### 关键步骤：

> ##### 安装composer

*   [composer中文网](http://www.phpcomposer.com/)> ##### git部署

*   安装git，`$ sudo apt install git`。
*   创建ssh-key，`$ ssh-keygen -t rsa -C "邮箱"`,一路回车。
*   `$ cat ~/.ssh/id_rsa.pub` 复制公钥到github上。添加ssh key。
*   `$ cd /home/wwwroot` 到放置项目代码的文件夹
*   `$ git clone git@github.com:用户名/项目名.git`，从github获取线上代码。
*   `$ cp .env.example .env` 对.env文件并进行配置。（app_key,database,mail等）
*   `$ composer install` 安装相关包
*   `$ php artisan migrate` 安装数据库迁移

* * *

#### 关键语句：

*   从github获取线上代码: `git clone git@github.com:用户名/项目名.git`
*   关联远程仓库: `git remote add origin git@github.com:xxx/xxx.git` (git clone后已自动关联)
*   git拉取代码更新项目: `git pull origin master`

* * *

To Be Continued.