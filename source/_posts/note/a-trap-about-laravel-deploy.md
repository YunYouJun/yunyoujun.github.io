---
title: 记 Laravel 线上部署的坑
tags:
  - Laravel
  - 学习
  - 笔记
categories:
  - 云游的小笔记
date: 2017-08-20 22:48:22
---

> 采用lnmp一键安装包部署基础环境。
> 
>   [lnmp一键安装包](http://www.yunyoujun.cn/2017/08/20/lnmp%E4%B8%80%E9%94%AE%E5%AE%89%E8%A3%85%E5%8C%85/)

<!-- more -->

---
> **1.php函数功能被关闭**

*   [Symfony\Component\Process\Exception\RuntimeException]
The Process class relies on proc_open, which is not available on your PHP installation.
*   [ErrorException]
proc_get_status() has been disabled for security reasons

* * *
**原因应该是php默认某些函数功能未启用。**

* * *
**解决方法：**

打开php.ini，搜索disable_functions段类似代码：

    disable_functions = passthru,exec,system,chroot,scandir,chgrp,chown,shell_exec,proc_get_status,popen,ini_alter,ini_restore,dl,openlog,syslog,readlink,symlink,popepassthru,stream_socket_server
    `</pre>

    从中将proc_open以及proc_get_status删除即可。

    * * *
    > **2.目录权限问题**

    为了运行 Laravel，我们需要为一些项目目录配置权限.

    <pre class="line-numbers prism-highlight" data-start="1">`sudo chmod 775 /home/blog/storage
    sudo chmod 775 /home/blog/bootstrap/cache
    `</pre>

    LNMP一键安装包中含有`.user.ini`,权限会被拒绝。
    需使用：

    <pre class="line-numbers prism-highlight" data-start="1">`chattr -i /{目录}/.user.ini
    `</pre>

    并删除：

    <pre class="line-numbers prism-highlight" data-start="1">`rm .user.ini
    `</pre>

    参见：
    **防跨目录设置**
    [https://lnmp.org/faq/lnmp-vhost-add-howto.html#user.ini](https://lnmp.org/faq/lnmp-vhost-add-howto.html#user.ini)

    * * *
    > **3.nginx配置文件**

    打开`/usr/local/nginx/conf/nginx.conf`文件，并找到server{}字段中如下代码。

    <pre class="line-numbers prism-highlight" data-start="1">`#include enable-php.conf;
    `</pre>

    此处需注释，不然会报错500。
    **原因：**
    引入了php 配置，其中有句 try_files 开启就有报错.

    <pre class="line-numbers prism-highlight" data-start="1">`#新增 支持laravel 优雅链接，在laravel 文档里有说明
    location / {
                try_files $uri $uri/ /index.php?$query_string;
    }

    #新增 支持php 的配置 
    location ~ \.php$ {

    #不能有下面这句 try_files ,不然报错500
    # try_files $uri /index.php =404;

    fastcgi_split_path_info ^(.+\.php)(/.+)$;

    #这句注意 后面是.sock 不是127.0.0..1

    fastcgi_pass  unix:/tmp/php-cgi.sock;
    fastcgi_index index.php;

    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
    `</pre>

    参见：
    [http://blog.csdn.net/dahuzix/article/details/73197718](http://blog.csdn.net/dahuzix/article/details/73197718)

    * * *
    > **4.nginx配置遭遇No inputfile specified**

    <pre class="line-numbers prism-highlight" data-start="1">` php.ini（/etc/php5/cgi/php.ini）的配置中这两项
    cgi.fix_pathinfo=1  （这个是自己添加的）
    doc_root=
    `</pre>

    > **5.lnmp重启**

    修改nginx、php等配置后一定要进行重启。

    <pre class="line-numbers prism-highlight" data-start="1">`lnmp restart  (全部重启)
    lnmp nginx restart （nginx重启）
    `</pre>

    * * *
    > **6.Laravel中seeder执行失败**

*   当第一次执行完`php artisan db:seed` 后，增加新的seeder文件时执行会报错。错误信息如下`[ReflectionException] Class ***TableSeeder does not exist`
*   确保新的seeder文件和全局database seeder是在同一个seeder目录下了，仍然会出现这个问题的原因是:**我们需要清理下之前执行生成的classmap信息。**
*   在控制台中执行`composer dump-autoload`,然后再执行`php artisan db:seed`.

    参见：[http://www.jianshu.com/p/27a76e702d71](http://www.jianshu.com/p/27a76e702d71)

    > **7.记得生成密钥**

    <pre class="line-numbers prism-highlight" data-start="1">`php artisan key:generate

* * *

To be continued.