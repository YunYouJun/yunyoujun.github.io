---
title: Laravel 使用笔记
tags:
  - php
  - 学习
  - Laravel
categories:
  - 云游的小笔记
date: 2017-08-21 16:26:58
updated: 2017-08-21 16:26:58
---

Laravel 框架使用过程中的一些笔记。

<!-- more -->

# 线上部署

## 相关过程

1. [LNMP一键安装包](http://www.yunyoujun.cn/2017/08/20/lnmp%e4%b8%80%e9%94%ae%e5%ae%89%e8%a3%85%e5%8c%85/)
2. [记LNMP一键安装后Laravel线上部署的坑](http://www.yunyoujun.cn/2017/08/20/%e8%ae%b0laravel%e7%ba%bf%e4%b8%8a%e9%83%a8%e7%bd%b2%e7%9a%84%e5%9d%91/)

* * *

## 关键步骤：

> ### 安装composer

* [composer中文网](http://www.phpcomposer.com/)> ##### git部署

* 安装git，`$ sudo apt install git`。
* 创建ssh-key，`$ ssh-keygen -t rsa -C "邮箱"`,一路回车。
* `$ cat ~/.ssh/id_rsa.pub` 复制公钥到github上。添加ssh key。
* `$ cd /home/wwwroot` 到放置项目代码的文件夹
* `$ git clone git@github.com:用户名/项目名.git`，从github获取线上代码。
* `$ cp .env.example .env` 对.env文件并进行配置。（app_key,database,mail等）
* `$ composer install` 安装相关包
* `$ php artisan migrate` 安装数据库迁移

* * *

## 关键语句：

* 从github获取线上代码: `git clone git@github.com:用户名/项目名.git`
* 关联远程仓库: `git remote add origin git@github.com:xxx/xxx.git` (git clone后已自动关联)
* git拉取代码更新项目: `git pull origin master`

---

## FAQ

### 数据库字符长度过长

参见 [Laravel 5.4 migrate时报错: Specified key was too long error](https://segmentfault.com/a/1190000008416200)

```
1071 Specified key was too long; max key length is 767 bytes
```

MySql 支持的 utf8 编码最大字符长度为3字节，如果遇到 4 字节的宽字符就会出现插入异常。三个字节 UTF-8 最大能编码的 Unicode 字符是 0xffff ，即 Unicode 中的基本多文种平面（BMP）。因而包括 Emoji 表情（Emoji 是一种特殊的 Unicode 编码）在内的非基本多文种平面的 Unicode 字符都无法使用 MySql 的 utf8 字符集存储。

这也应该就是 Laravel 5.4 改用4字节长度的 utf8mb4 字符编码的原因之一。不过要注意的是，只有 MySql 5.5.3 版本以后才开始支持 utf8mb4 字符编码（查看版本：selection version();）。如果 MySql 版本过低，需要进行版本更新。

#### 解决方案（二选一）

1. 升级MySql版本到5.5.3以上。
2. 手动配置迁移命令migrate生成的默认字符串长度，在 `app\Providers\AppServiceProders` 中调用 `Schema::defaultStringLength` 方法来实现配置：

```php
use Illuminate\Support\Facades\Schema;

/**
* Bootstrap any application services.
*
* @return void
*/
public function boot()
{
   Schema::defaultStringLength(191);
}
```

To Be Continued.