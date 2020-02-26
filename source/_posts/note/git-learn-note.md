---
title: Git 学习笔记
tags:
  - 学习
  - 笔记
  - Git
categories:
  - 云游的小笔记
date: 2017-08-21 16:46:13
updated: 2020-02-03 16:46:13
---

记录 Git 的一些常用指令与问题解决方案。

<!-- more -->

## ref

- [git-tips](https://github.com/git-tips/tips)
- [Git 的奇技淫巧](https://github.com/521xueweihan/git-tips)

## 常用指令

### 拉取代码

- 从远程仓库获取线上代码: `git clone git@github.com:用户名/项目名.git`
- 关联远程仓库: `git remote add origin git@github.com:xxx/xxx.git` (git clone 后已自动关联)
- git 拉取代码更新项目: `git pull origin master`

---

### 远程仓库

- 删除远程仓库地址： `git remote rm origin`
- 增加远程仓库地址： `git remote add origin git@github.com:xxx/xxx.git` or `git remote add origin https://github.com/xxx/xxx` ( origin 为远程仓库命名)
- 查看远程库信息： `git remote -v`

- 关联多个远程仓库:

```sh
git remote add github git@github.com:xxx/xxx.git
git remote add gitee git@gitee.com:xxx/xxx.git
git remote add coding git@git.coding.net:xxx/xxx.git
```

---

### 代码推送

- git 初始化： `git init`
- 保存到暂存区： `git add -A`
- 输入描述信息并提交到本地的 Git： `git commit -m "Say something"`
- 修改已经提交的描述： `git commit --amend` [修改已提交内容](#修改已提交内容)
- 将代码推送到 GitHub： `git push` or `git push -u origin master` ( `-u` 选项指定一个默认主机,后面就可以不加任何参数使用 `git push` )
- 强制推送： `git push -u origin master -f`
- [git push 详解](#git-push-详解)
- 清空文件夹的本地缓存: `git rm -r --cached <path>`

---

### 代码回滚

在 Git 中，用 HEAD 表示当前版本，，上一个版本就是 HEAD^，上上一个版本就是 HEAD^^，当然往上 100 个版本写 100 个^比较容易数不过来，所以写成 HEAD~100。

`--hard` 会包括当前源码回到上次状态。
保留当前更改，只回退 commit 信息可使用 `--soft`。
清除缓存区中准备提交的内容，只保留修改的状态，可不加参数，或使用 `--mixed`。

- 回滚到上一版本：`git reset --hard HEAD^`
- 回退到指定版本 `git reset --hard id` (id 为 commit 版本号，填写前数位保证不重复即可)
- 通过 `git log` 查看历史版本

[More Info](#git-reset)

---

### 分支管理

- 显示当前分支 `git branch -v`
- 显示远程分支 `git remote -v`
- 将当前分支切换到 master 分支上: `git checkout master`
- 创建一个名为 xxx 的新分支: `git checkout -b xxx` , `-b` 选项表示创建指定名称的新分支。
- 新建远程分支： `git push origin 推送的分支:远程的分支`
- 合并分支： `git merge fake-branch`
- 删除分支： `git branch -d fake-branch`
- 删除远程分支：`git push origin –-delete 分支名`
- 修改分支名称：`git branch -m old_branch_name new_branch_name`

### 清除缓存

- `git rm --cached [文件路径]`

  - `-r` 递归
  - `-f` 强制

Example: `git rm -r --cached .`

## Q&A

### 合并代码冲突

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

### 提交至 GitHub 时出现 invalid-email-address

- 查看 git 设置：`cat $HOME/.gitconfig`
- 正常情况应显示 [user]name 与 email 的信息。
- 若无，通过如下代码修改 git 配置。

```sh
git config --global user.name "用户名"
git config --global user.email "Git账户邮箱"
```

- 修改已经使用 invalid-email 提交的 commit 信息
- (若不知道无效邮箱的具体地址，可通过 `git log` 查看提交时的邮箱地址。)

> [GitHub Fix invalid email address in Repository History](https://github.com/kadishmal/tilchi.com/wiki/GitHub-Fix-invalid-email-address-in-Repository-History)

### 合并两个不同的项目，出现错误

- `fatal: refusing to merge unrelated histories`
- 因为他们是两个不同的项目，要把两个不同的项目合并，git 需要添加一句代码，在`git pull`后添加`--allow-unrelated-histories`
- 假如我们的源是 `origin` ，分支是 `master`: `git pull origin master ----allow-unrelated-histories`

> 参见：[http://blog.csdn.net/lindexi_gd/article/details/52554159](http://blog.csdn.net/lindexi_gd/article/details/52554159)

### 删除已经上传至 GitHub 中的文件

上传项目的时候有些需要忽略的文件夹并未加入 `.gitignore` 文件中，导致上传了一些并不想上传的文件。

我们想要在 github 上面删除，但又不想在本地删除。

Example:

```sh
git rm -r --cached .idea  #--cached不会把本地的 .idea 删除
git commit -m 'delete .idea dir'
git push -u origin master
```

### 修改已提交内容

```sh
git commit --amend
# 修改 commit message
```

> 参考: [git 修改已提交的内容 - CSDN](http://blog.csdn.net/sodaslay/article/details/72948722)

### 修改之前已经上传的提交

#### 修改方法一

```sh
git rebase -i HEAD~1   #当前版本的倒数第一次状态
```

- 显示结果如下，修改 `pick` 为 `edit` ，并按 `esc` 输入 `:wq` 保存退出

```sh
pick 578ba7a hexo backup

# Rebase eeb9c17..578ba7a onto eeb9c17 (1 command)
#
# Commands:
#  pick = use commit
#  edit = use commit, but stop for amending //改上面的 pick 为 edit
#  squash = use commit, but meld into previous commit
#
# If you remove a line here THAT COMMIT WILL BE LOST.
# However, if you remove everything, the rebase will be aborted.
#
```

#### 修改方法二

```sh
# 修改需要修改的地方（只是修改 commit message 就不用做)
git add . #这一步如果只是修改 commit message 不用输入
git commit --amend
# 输入修改后的 commit message，保存
```

- 输入 `git rebase –continue` 完成操作

- 推送

```sh
git push <remote> <branch>
# Example: git push origin add-something
```

#### 修改方法三

找到想要修改的 commit 的父 commit id

- `git rebase -i <父 commit id>`

```sh
pick 578ba7a hexo backup
...
```

`pick` 修改为 `reword`, `:wq` 退出。

此时可以修改更改 `reword` 的 commit message，`wq` 退出。

剩余的 `git rebase --skip`

> [How to modify existing, unpushed commit messages?](https://stackoverflow.com/questions/179123/how-to-modify-existing-unpushed-commit-messages)

### 增加子模块

```sh
git submodule add https://github.com/XXX/XXX
```

> [Git 工具 - 子模块](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97)

---

## 详解

### git push

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

不带任何参数的 `git push` ，默认只推送当前分支，这叫做 `simple` 方式。此外，还有一种 `matching` 方式，会推送所有有对应的远程分支的本地分支。Git 2.0 版本之前，默认采用 `matching` 方法，现在改为默认采用 `simple` 方式。如果要修改这个设置，可以采用 `git config` 命令。

```sh
$ git config --global push.default matching
# or
$ git config --global push.default simple
```

还有一种情况，就是不管是否存在对应的远程分支，将本地的所有分支都推送到远程主机，这时需要使用–all 选项。

```sh
git push --all origin
```

上面命令表示，将所有本地分支都推送到 `origin` 主机。

> 参见: [http://www.yiibai.com/git/git_push.html](http://www.yiibai.com/git/git_push.html)

#### 推送给多个远程仓库

```sh
git remote set-url --add origin https://xxx
```

### git add

- `git add -u` 提交被修改(modified)和被删除(deleted)文件，不包括新文件(new)
- `git add .` 提交新文件(new)和被修改(modified)文件，不包括被删除(deleted)文件
- `git add -A` 提交所有变化（`git add --all` 的缩写）

### git reset

[git reset | Git Docs](https://git-scm.com/docs/git-reset)

index 也被称为 staging area ，是指一整套即将被下一个提交的文件集合。

`git add -A` 便是将当前修改文件加入 staging area 。

#### --mixed

默认方式，回退到某个版本，只保留源码，回退 commit 和 index 信息。

#### --hard

彻底回退到某个版本，本地源码变为上一个版本内容。

#### --soft

回退到某个版本，只回退 commit 的信息，保留 index 信息。
譬如如果还要提交，直接 commit 即可。

---

To Be Continued.
