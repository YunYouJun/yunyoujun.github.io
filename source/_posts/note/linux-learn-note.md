---
title: Linux 学习笔记
date: 2019-04-08 17:56:47
updated: 2019-04-08 17:56:47
tags:
  - 学习
  - 笔记
  - Linux
categories:
  - 云游的小笔记
---

记录一些笔记与坑

<!-- more -->

## Ref

- [鸟哥的 Linux 私房菜](http://linux.vbird.org/)

## Install

### Version

#### [Deepin](https://www.deepin.org/)

- [Deepin 使用笔记](../deepin-use-note/)

### Virtual Machine

- [Virual Box](https://www.virtualbox.org/)

### Some tools

#### nscd

管理 DNS 缓存

```sh
sudo apt install nscd
sudo service nscd restart
# or
# sudo /etc/init.d/nscd restart
```

## Dev

### Shell

#### [oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)

需要先安装 `zsh`

GitHub 上星数很多的一个项目，自己还没有搞明白，不过大致是可以帮助更方便使用 bash 的工具。

配置插件

```sh
# vim ~/.zshrc
plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
  node
  npm
  python
  sudo
  autojump
)
```

- [oh-my-zsh | wiki](https://github.com/robbyrussell/oh-my-zsh/wiki)
- [oh-my-zsh 常用插件配置指南](https://www.yuque.com/yunyoujun/notes/oh-my-zsh)

#### Other

配置环境变量

```sh
code ~/.zshrc
# 进入文件
export PATH="应用程序路径:$PATH"
# $PATH 不可丢掉，是环境中别的变量，冒号为分隔符。
```

### Git

```sh
sudo apt-get install git
```

#### git config --global

```sh
git config --global user.email "me@yunyoujun.cn"
git config --global user.name "YunYouJun"
```

记住密码

```sh
git config --global credential.helper store
```

> [Git-工具-凭证存储](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%87%AD%E8%AF%81%E5%AD%98%E5%82%A8)

### [Node.js](https://github.com/nodejs/help/wiki/Installation)

[nvm](https://github.com/nvm-sh/nvm)

Linux 安装 `Node.js` 的最方便的工具

如果速度太慢，可以更换为国内镜像：

```sh
vim ~/.zshrc
export NVM_NODEJS_ORG_MIRROR=http://npm.taobao.org/mirrors/node
```

#### 安装 nvm

> https://github.com/nvm-sh/nvm#installation-and-update
> 参考官方文档使用最新的安装脚本

如果仍然 `command not found`，可以添加进 `~/.bashrc`, `~/.zshrc`。

```sh
# vim ~/.zshrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

#### 安装 Node

```sh
# install latest node
nvm install node
# install stable node
nvm install stable
```

#### 安装 Python3

使用 [淘宝镜像](https://npm.taobao.org/mirrors/python/3.7.3/) 快一些

<https://npm.taobao.org/mirrors/python/3.7.3/>

```sh
wget https://npm.taobao.org/mirrors/python/3.7.3/Python-3.7.3.tgz
tar -xvzf Python-3.7.3.tgz
cd Python-3.7.3
# 这个需要提前安装 否则 make install 可能报错
sudo apt-get install libffi-dev
sudo apt install libssl-dev libncurses5-dev libsqlite3-dev libreadline-dev libtk8.5 libgdm-dev libdb4o-cil-dev libpcap-dev
./configure --with-ssl
make
sudo make install
```

> [pip is configured with locations that require TLS/SSL, however the ssl module in Python is not available](https://stackoverflow.com/questions/45954528/pip-is-configured-with-locations-that-require-tls-ssl-however-the-ssl-module-in)

临时解决方案

```sh
pip3 install -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com ssl xxx
```

通用解决方案

```sh
sudo apt install libssl-dev libncurses5-dev libsqlite3-dev libreadline-dev libtk8.5 libgdm-dev libdb4o-cil-dev libpcap-dev
# 随后重新编译安装
```

## Command

### apt apt-get

`apt` = `apt-get` + `apt-cache` + `apt-config`

简单来说就是：apt = apt-get、apt-cache 和 apt-config 中最常用命令选项的集合。

```sh
sudo apt update
sudo apt install xxx
sudo apt remove xxx
```

> 常用命令

- 为文件目录树全部赋予权限：`chmod 775 -R filename`
- 迭代删除文件夹中所有内容：`rm -rf &lt;filename or dirname&gt;`

### 挂载数据盘

- 查看已有磁盘：`fdisk -l`
- 挂载磁盘：`mount /dev/vdb1 /home/data`

## FAQ

### Virtual Box 安装 CentOS 时，鼠标不显示

- Virtual Box 6.0
- CentOS 7.x

Solution:

> 设置 -> 显示 -> 屏幕 -> 显卡控制器 -> 切换为 VBoxVGA

---

To Be Continued.
