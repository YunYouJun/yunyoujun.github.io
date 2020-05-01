---
title: Laravel 使用笔记
tags:
  - PHP
  - 学习
  - Laravel
categories:
  - 云游的小笔记
date: 2017-08-21 16:26:58
updated: 2017-08-21 16:26:58
---

Laravel 框架使用过程中的一些笔记。

<!-- more -->

## 线上部署

### 相关过程

1. [LNMP 一键安装包](/note/lnmp-install/)
2. [记 LNMP 一键安装后 Laravel 线上部署的坑](/note/a-trap-about-laravel-deploy/)

---

### 关键步骤

#### 安装 composer

- [Composer 官网](https://getcomposer.org/)
- [阿里云 Composer 全量镜像](https://developer.aliyun.com/composer)

#### git 部署

- 安装 git，`$ sudo apt install git`。
- 创建 ssh-key，`$ ssh-keygen -t rsa -C "邮箱"`,一路回车。
- `$ cat ~/.ssh/id_rsa.pub` 复制公钥到 github 上。添加 ssh key。
- `$ cd /home/wwwroot` 到放置项目代码的文件夹
- `$ git clone git@github.com:用户名/项目名.git`，从 github 获取线上代码。
- `$ cp .env.example .env` 对.env 文件并进行配置。（app_key,database,mail 等）
- `$ composer install` 安装相关包
- `$ php artisan migrate` 安装数据库迁移

## FAQ

### 数据库字符长度过长

参见 [Laravel 5.4 migrate 时报错: Specified key was too long error](https://segmentfault.com/a/1190000008416200)

```sh
1071 Specified key was too long; max key length is 767 bytes
```

MySql 支持的 utf8 编码最大字符长度为 3 字节，如果遇到 4 字节的宽字符就会出现插入异常。三个字节 UTF-8 最大能编码的 Unicode 字符是 0xffff ，即 Unicode 中的基本多文种平面（BMP）。因而包括 Emoji 表情（Emoji 是一种特殊的 Unicode 编码）在内的非基本多文种平面的 Unicode 字符都无法使用 MySql 的 utf8 字符集存储。

这也应该就是 Laravel 5.4 改用 4 字节长度的 utf8mb4 字符编码的原因之一。不过要注意的是，只有 MySql 5.5.3 版本以后才开始支持 utf8mb4 字符编码（查看版本：selection version();）。如果 MySql 版本过低，需要进行版本更新。

#### 解决方案（二选一）

1. 升级 MySql 版本到 5.5.3 以上。
2. 手动配置迁移命令 migrate 生成的默认字符串长度，在 `app\Providers\AppServiceProders` 中调用 `Schema::defaultStringLength` 方法来实现配置：

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

## 模版插件

### Laravel-admin

- GitHub: [https://github.com/z-song/laravel-admin](https://github.com/z-song/laravel-admin)
- 中文文档： [http://laravel-admin.org/docs/#/zh/](http://laravel-admin.org/docs/#/zh/)
- 官网：[http://laravel-admin.org](http://laravel-admin.org)
- Demo: [http://laravel-admin.org/demo/auth/login](http://laravel-admin.org/demo/auth/login)

To Be Continued.
