---
title: Git 常用语句与学习笔记
tags:
  - 学习
  - 笔记
  - Git
categories:
  - 云游的小笔记
date: 2017-08-21 16:46:13
---
# Intro

记录 Git 的一些常用指令与问题解决方案。

<!-- more -->

# 常用指令

## 拉取代码

- 从远程仓库获取线上代码: `git clone git@github.com:用户名/项目名.git`
- 关联远程仓库: `git remote add origin git@github.com:xxx/xxx.git` (git clone后已自动关联)
- git拉取代码更新项目: `git pull origin master`

---

## 远程仓库

- 删除远程仓库地址： `git remote rm origin`
- 增加远程仓库地址： `git remote add origin git@github.com:xxx/xxx.git` ( origin 为远程仓库命名)
- 查看远程库信息： `git remote -v`

- 关联多个远程仓库:

```sh
git remote add github git@github.com:xxx/xxx.git
git remote add gitee git@gitee.com:xxx/xxx.git
git remote add coding git@git.coding.net:xxx/xxx.git
```

---

## 代码推送

- git 初始化： `git init`
- 保存到暂存区： `git add -A`
- 输入描述信息并提交到本地的 Git： `git commit -m "Say something"`
- 修改已经提交的描述： `git commit --amend`
- 将代码推送到 GitHub： `git push` or `git push -u origin master` ( `-u` 选项指定一个默认主机,后面就可以不加任何参数使用 `git push` )
- 强制推送： `git push -u origin master -f`
- [git push 详解](#git-push-详解)
- 清空文件夹的本地缓存: `git rm -r --cached <path>`

---

## 代码回滚

- 回滚到上一版本：`git reset --hard HEAD^`

在Git中，用HEAD表示当前版本，，上一个版本就是HEAD^，上上一个版本就是HEAD^^，当然往上100个版本写100个^比较容易数不过来，所以写成HEAD~100。

- 回退到指定版本 `git rest --hard id` (id 为 commit 版本号，填写前数位保证不重复即可)
- 通过 `git log` 查看历史版本

---

## 分支管理
- 显示当前分支 `git branch -v`
- 显示远程分支 `git remote -v`
- 将当前分支切换到 master 分支上: `git checkout master`
- 创建一个名为 xxx 的新分支: `git checkout -b xxx` , `-b` 选项表示创建指定名称的新分支。
- 新建远程分支： `git push origin 推送的分支:远程的分支`
- 合并分支： `git merge fake-branch`
- 删除分支： `git branch -d fake-branch`
- 删除远程分支：`git push origin –delete 分支名`

---

# 问题解决方案

## 合并代码冲突

- 如果系统中有一些配置文件在服务器上做了配置修改,然后后续开发又新添加一些配置项的时候,
在发布这个配置文件的时候,会发生代码冲突:

```sh
error: Your local changes to the following files would be overwritten by merge:
        protected/config/main.php
Please, commit your changes or stash them before you can merge.
```

- 如果希望保留生产服务器上所做的改动,仅仅并入新配置项, 处理方法如下:

```sh
git stash
git pull
git stash pop
```

- 反过来,如果希望用代码库中的文件完全覆盖本地工作版本. 方法如下:

```sh
git reset --hard //重置到上次提交的状态
git pull
```

> 参见：[http://blog.csdn.net/iefreer/article/details/7679631](http://blog.csdn.net/iefreer/article/details/7679631)

## 提交至 GitHub 时出现 invalid-email-address

- 查看git设置：
`cat $HOME/.gitconfig`
- 正常情况应显示 [user]name 与 email 的信息。
- 若无，通过如下代码修改 git 配置。

```sh
git config --global user.name "用户名"
git config --global user.email "Git账户邮箱"
```

- 修改已经使用 invalid-email 提交的 commit 信息
- (若不知道无效邮箱的具体地址，可通过 `git log` 查看提交时的邮箱地址。)

{% blockquote Esen Sagynov "https://github.com/kadishmal/tilchi.com/wiki/GitHub-Fix-invalid-email-address-in-Repository-History" "GitHub Fix invalid email address in Repository Historys" %}
Create a `fix_repo.sh` file in your repo:

	cd my_repo
	nano fix_repo.sh

And add the following code:

	#!/bin/sh

	git filter-branch --env-filter '

	am="$GIT_AUTHOR_EMAIL"
	cm="$GIT_COMMITTER_EMAIL"

	if [ "$GIT_COMMITTER_EMAIL" = "none@none" ]
	then
	    cm="kadishmal@gmail.com"
	fi
	if [ "$GIT_AUTHOR_EMAIL" = "none@none" ]
	then
	    am="kadishmal@gmail.com"
	fi

	export GIT_AUTHOR_EMAIL="$am"
	export GIT_COMMITTER_EMAIL="$cm"
	'

Don't forget to leave the single quote (') at the end of the last line and at the end of the first line.

Set the file to be executable:

	chmod a+x fix_repo.sh

Run the file:

	./fix_repo.sh
{% endblockquote %}

## 合并两个不同的项目，出现错误

- `fatal: refusing to merge unrelated histories`
- 因为他们是两个不同的项目，要把两个不同的项目合并，git需要添加一句代码，在`git pull`后添加`--allow-unrelated-histories`
- 假如我们的源是 `origin` ，分支是 `master`: `git pull origin master ----allow-unrelated-histories`

> 参见：[http://blog.csdn.net/lindexi_gd/article/details/52554159](http://blog.csdn.net/lindexi_gd/article/details/52554159)

## 删除已经上传至 GitHub 中的文件

上传项目的时候有些需要忽略的文件夹并未加入 `.gitignore` 文件中，导致上传了一些并不想上传的文件。

我们想要在github上面删除，但又不想在本地删除。

Example:

```sh
git rm -r --cached .idea  #--cached不会把本地的 .idea 删除
git commit -m 'delete .idea dir'
git push -u origin master
```

---

# 详解

## git push 详解

- `git push origin master`

上面命令表示，将本地的 master 分支推送到 origin 主机的 master 分支。如果 master 不存在，则会被新建。

如果当前分支与远程分支之间存在追踪关系，则本地分支和远程分支都可以省略。

```sh
git push origin
```

上面命令表示，将当前分支推送到 origin 主机的对应分支。如果当前分支只有一个追踪分支，那么主机名都可以省略,使用 `git push`。

如果当前分支与多个主机存在追踪关系，则可以使用 `-u` 选项指定一个默认主机，这样后面就可以不加任何参数使用 `git push`。

```sh
git push -u origin master
```

上面命令将本地的 `master` 分支推送到 `origin` 主机，同时指定 `origin` 为默认主机，后面就可以不加任何参数使用 `git push` 了。

不带任何参数的 `git push` ，默认只推送当前分支，这叫做 `simple` 方式。此外，还有一种 `matching` 方式，会推送所有有对应的远程分支的本地分支。Git 2.0版本之前，默认采用 `matching` 方法，现在改为默认采用 `simple` 方式。如果要修改这个设置，可以采用 `git config` 命令。

```sh
$ git config --global push.default matching
# or
$ git config --global push.default simple
```

还有一种情况，就是不管是否存在对应的远程分支，将本地的所有分支都推送到远程主机，这时需要使用–all选项。

```sh
git push --all origin
```

上面命令表示，将所有本地分支都推送到 `origin` 主机。

> 参见: [http://www.yiibai.com/git/git_push.html](http://www.yiibai.com/git/git_push.html)

---

To Be Continued.