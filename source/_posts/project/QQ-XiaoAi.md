---
title: 小爱是云游最好的女朋友（大雾）
date: 2018-01-01 18:46:48
updated: 2018-01-01 18:46:48
tags:
  - 学习
  - Python
  - 小玩意儿
categories:
  - 云游的小项目
---

鉴于某群的朋友，总会说着‘反正云游不在，赶紧撤回。’之类的话语，就想着可不可以写一个小脚本，来监测 QQ 群内的信息，根据关键词，自动回复指定信息。

标题似乎有点死宅。
没错，最后诞生的她我就叫作小爱了。

<!-- more -->

这种东西，凭自己的能力和惰性肯定是要先找找有没有现成的轮子可以使用啦。

便直接上 `github` 搜了搜关键词 qq ，按 star 数量排下来，和 qq 相关，又是符合自己期待的回复相关的便是一个 python 写的 qqbot 。

> 项目源地址： <https://github.com/pandolia/qqbot>

- 语言： python
- 环境： Linux, Windows or Mac OSX
- 使用 SmartQQ 协议（即过去的 WebQQ）

## 一些废话

（中途嫌弃文档麻烦，又试了试所谓的酷 Q 之类的软件，但可定制性不强，还有收费权限之类的）
最好还是决定好好来看看 qqbot 的使用文档。（~~没错，我就是想白嫖~~）

虽然没学过 python （等我有空，我会来学的，请等着我啊！），不过看起来使用也很方便。语法的差异，便边百度边学了。（虽然踩了些小坑，但结果上来说还是满意的。）

## 过程

### 需要先安装 python (起先是自己在 Windows 上先试验看看的)，官网下载地址 <https://www.python.org/download>

Windows 64 位的话下载 `Windows x86-64 executable installer` 版本即可，其他系统也各自对应。

### 安装 qqbot

参照 qqbot 文档 <https://github.com/pandolia/qqbot>

```sh
pip install qqbot
```

### 启动 qqbot

进入命令行窗口，`git bash` 或者 `cmd` 都可以。
推荐 `cmd` , `git bash` 中文可能会乱码。

```sh
qqbot -q xxxx // 这里填自己想要登陆的qq号（建议还是用小号安全些啦）
```

直接输入 qqbot ,用想要登陆的 qq 号扫弹出的二维码也可以。（当然上面那样也是要扫的，只是多个号时方便区分，并且会存储一定时间的登陆信息。）

### 指令操作

需要再打开一个命令行窗口，以便对 qqbot 进行指令操作。（指令可参照项目文档）

### 自定义消息响应

自己使用 python 的语法进行各种逻辑编写即可，提供的接口和属性可参见文档。

示例代码：

```py
# -*- coding: utf-8 -*-

def onQQMessage(bot, contact, member, content):
    if content == '-hello':
        bot.SendTo(contact, '你好，我是QQ机器人')
    elif content == '-stop':
        bot.SendTo(contact, 'QQ机器人已关闭')
        bot.Stop()
```

- content 即收到的文本信息，if 判断文本消息是否位 '-hello'，执行相应的操作。
- bot.SendTo(contact, '回复的消息') 让机器人进行回复

```py
···
if '小爱' in content and not bot.isMe(contact, member):
      if '你好' in content:
        bot.SendTo(contact, '你好，我是云游酱的女朋友~')
···
```

> 可参见：<https://github.com/YunYouJun/xiao-ai/tree/qqbot>

- Python 中语法使用 in 判断是否包含这个词，缩进进行嵌套，还有 if 后的冒号，也要切记。
- isMe() 判断是否为自己所发的消息 （之前自己就作死写了个自己触发自己的循环，结果在群里触发 bug 刷屏了）

将以上代码另存为 `sample.py` （名字可以随便取，注意保存为 utf8 编码的文件）。放到 `~/.qqbot-tmp/plugins/` 目录下（ ~ 代表用户主目录， windows 下为 `C:\Users\xxx\.qqbot-tmp\plugins\`, xxx 代表用户名 ），或系统中可以 `import` 到的目录下（如 `python` 的安装目录下的 `Lib/site-packages` 目录）。

### 加载自定义插件（即刚刚自己编写的逻辑）

```sh
qq plug sample
```

这些操作过程中不要关闭运行 qqbot 的命令行窗口。这是后，机器人就可以对收到的 qq 消息进行爬去检测，并进行自定义的回复了。

### 挂载至服务器

以上通过编写逻辑代码，已经基本可以完成自定义消息回复的功能。但是实际是自己的电脑充当服务器功能，当把执行有 qqbot 的命令行窗口关闭时，便无法继续检测了。

这时就需要挂载到 24h 运行的服务器上了。自己这里买了阿里学生云的主机，便直接拿来使用了。

安装 python （我使用的是 Linux Ubuntu 系统）

```sh
sudo apt-get install python3.5
```

（其他不同系统安装皆可百度或谷歌解决）

Linux 插件目录为 `~/.qqbot-tmp/plugins/`(~ 代表用户主目录 `/root`)

---

Linux 远程服务器的话，当然没法弹出二维码扫描了，这时需要进行配置。

参考：<https://github.com/pandolia/qqbot#七二维码管理器qqbot-配置命令行参数以及工作目录>

进入 '~/.qqbot-tmp/v2.x.conf' 文件，进行修改。
（使用 sftp 类型的软件或者 vim 皆可 ）

```conf
# 用户 somebody 的配置
    "somebody" : {
      ···
      # 自动登录的 QQ 号
        "qq" : "xxx",
      # 接收二维码图片的邮箱账号
        "mailAccount" : "xxx@qq.com",
      # 该邮箱的 IMAP/SMTP 服务授权码
        "mailAuthCode" : "xxxxxxxxxxxx",
      # 在后台运行 qqbot ( daemon 模式)
        "daemon": False,   // 修改为 True
      ···
    }
```

主要填写修改以上几处即可。

使用如下命令加载配置：

```sh
qqbot -u somebody // 此处 somebody 为上述自行定义的配置，名称也可修改
```

### WebHooks 自动部署

每次突然想要修改小爱的某个回复之类的，还要重新传输文件部署，也是很麻烦的事情。所以这时候就需要配合 GitHub 搭建 WebHooks , 当自己在本地提交修改时，服务器上的小爱也接收到消息，自动进行修改并部署。

首先要将自己的自定义插件 git 化， 在 github 上创建自己的项目，并将自己的自定义代码提交到其上。
（此后的 WebHooks 是基于 GitHub 所提供的功能，当自己提交代码时， GitHub 将会向事先设定好的地址端口发送 Post 信息，再在自己服务器这边监听端口于收到的消息，执行 pull 与 插件加载等自动化脚本。）

> repo > Settings > Webhooks

接下来，编写脚本(这几个文件可以和自定义消息的脚本 `sample.py` 放在一起，便于 git 备份)

#### start_webkook.py

```py
# coding=utf-8
# start_webkook.py
#!/usr/bin/env python
from wsgiref.simple_server import make_server
# 导入我们自己编写的application函数
from webhook import application
# 创建一个服务器，IP地址为空，端口是8000，处理函数是application:
httpd = make_server('', 8000, application)
print('Serving HTTP on port 8000...')
# 开始监听HTTP请求:
httpd.serve_forever()
```

#### webhook.py

```py
# coding=utf-8
# webhook.py
import os
def application(environ, start_response):
    start_response('200 OK', [('Content-Type', 'text/html')])
    DeployPath = '/root/.qqbot-tmp/plugins'
    os.system('cd ' + DeployPath)
    os.system('git reset --hard')
    os.system('git pull')  // 这里强制使得服务器代码与本地提交的代码，保持一致
    os.system('qq plug custom')
    print('XiaoAi pull finish')
    return [b'Hello, XiaoAi!'] // b 代表 bytes ,将 unicode 转为 bytes
    // 此处返回值，用户告诉 GitHub 的 Webhooks 已接收到信息，并进行了处理
```

- `# coding=utf-8` 这个一定要放在定义行，指定编码格式

最后在文件所在的目录，执行：

```sh
nohup python start_webhook.py & // nohup 与 & 连用使得脚本在后台执行
```

### 就此结束，只要在本地 git 提交修改小爱的代码，服务器就可以收到请求并自动部署啦。

## 后记

自己对 python 语法并不熟悉，只能日后有时间再深入进行学习。买的小米多功能网关以及种种也都到货了，现在终于可以在床上叫小爱帮忙关灯了。

小米的 AI 音箱，我想着要是有个开放的云平台就好了，让大家可以自己编程生成更多有趣的技能，也能接入小爱的智能平台。结果一搜，真的有，不过看了看，很多还不完善，有的还显示敬请期待。不过，既然有这份心思，让我对小爱的好感又升一层了。

> 水滴平台-小米开放平台 <https://shuidi.mi.com/>

试着申请了开发者权限，要是能将 qqbot 的这个小爱接入到真正的小爱上就好了。

新的一年，也终于到来了。希望自己能继续努力，取得新的成长吧~
