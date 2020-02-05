# Hexo 站点源文件

[![Build Status](https://www.travis-ci.com/YunYouJun/yunyoujun.github.io.svg?branch=hexo)](https://www.travis-ci.com/YunYouJun/yunyoujun.github.io)

## Use

### 日常发布

```sh
npm run backup
# 同时推送至 GitHub 与 Coding 的 hexo 分支
# 线上 Travis 会自动进行构建生成静态页面推送至 GitHub
# or
sh backup.sh
# sh backup.sh 'change info'
```

## BackUp

- [GitHub](https://github.com/YunYouJun/yunyoujun.github.io)
- [Coding](https://e.coding.net/YunYouJun/yunyoujun.coding.me)

```sh
git clone https://github.com/YunYouJun/yunyoujun.github.io
# coding
git remote add coding https://e.coding.net/YunYouJun/yunyoujun.coding.me.git
```

### 同时推送

```sh
git remote set-url --add origin https://e.coding.net/YunYouJun/yunyoujun.coding.me.git
```

## Build

[yunyoujun.github.io - Travis CI](https://www.travis-ci.com/YunYouJun/yunyoujun.github.io)

### Install Theme

```sh
git clone https://github.com/YunYouJun/hexo-theme-starry themes/starry
```

## Commit Lint

[gitmoji](https://gitmoji.carloscuesta.me/)

```sh
git commit -m 'xxx'
```

### 更新博客内容

```sh
📝 update
```

### Fixing typos

```sh
✏️ typo
```

### UI

```sh
💄 xxx
```

### Improving structure / format of the code

```sh
🎨 xxx
```

### Fixing CI Build

```sh
💚 travis
```

### Changing configuration files

```sh
🔧 config
```

### Other

```sh
chore(xxx): xxx
```

## FAQ

### Travis Bad decrypt (Because of Windows)

Remove ssh_rsa env

## Change Log

- 2019-01-22 return to github pages
