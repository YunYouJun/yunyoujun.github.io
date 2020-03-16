---
title: 开发常用命令笔记
tags:
  - PHP
  - 学习
  - 笔记
categories:
  - 云游的小笔记
date: 2017-08-21 23:49:30
updated: 2018-02-19 22:49:30
---

Some Commands Record.

## Bash

### [Linux](https://yunyoujun.cn/note/linux-learn-note/)

### [Git](https://yunyoujun.cn/note/git-learn-note/)

### 环境变量

- 显示所有环境变量 `env`
- 导出变量 `export NODE_ENV='production'`
- 删除变量 `unset NODE_ENV`

> `NODE_ENV` 为举例变量名，可使用任意名称

### 命令行打开网页或文件夹

- Linux : `open xxx`
- Windows : 打开网页 `start xxx` | 打开文件资源管理器 `explorer`

#### Example

打开网址 <yunyoujun.cn>：
`start yunyoujun.cn`

打开当前目录：
`explorer .`

### && 与 ||

- `;` 如果被分号(;)所分隔的命令会连续的执行下去，就算是错误的命令也会继续执行后面的命令。
- 如果第一个命令执行成功，与操作符 ( && )才会执行第二个命令
- 如果第一个命令执行失败，或操作符 ( || )才会执行第二个命令

```sh
# algolia.sh
export HEXO_ALGOLIA_INDEXING_KEY=xxx
hexo clean
hexo algolia
```

- 如上文件在 `git bash` 中执行时为逐行执行，执行完 `hexo clean` 后（不管从成功还是失败）执行 `hexo alglolia`

- `hexo clean && hexo algolia` 则意味着 `hexo clean` 执行成功，才会执行 `hexo algolia`

---

### Java MVN

- 编译 Java :
  `mvn compile (默认放在 src/main/java 目录下)`

- 执行 java 类 :
  `mvn exec:java -Dexec.mainClass="bean.User"`

- 运行服务器 :
  `mvn tomcat7:run`

---

To Be Continued.
