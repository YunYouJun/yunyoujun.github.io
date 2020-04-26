# Hexo 站点源文件

[![GitHub Pages](https://github.com/YunYouJun/yunyoujun.github.io/workflows/GitHub%20Pages/badge.svg)](https://github.com/YunYouJun/yunyoujun.github.io/actions)

Hexo 主题：[Yun](https://github.com/YunYouJun/hexo-theme-yun/)

## Use

### 日常发布

发布时，同时推送至 GitHub 与 Coding 的 hexo 分支备份，使用 CI （GitHub Actions） 生成静态页面推送至 GitHub

```sh
npm run backup
# or
# yarn backup
# or
sh backup.sh
# sh backup.sh 'change info'
```

- [Comment | Valine](https://valine.yunyoujun.cn)

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

- [~~yunyoujun.github.io - Travis CI~~](https://www.travis-ci.com/YunYouJun/yunyoujun.github.io)
- [GitHub Actions](https://github.com/YunYouJun/yunyoujun.github.io/actions): 现已改为使用 GitHub Actions

### Install Theme

```sh
git clone https://github.com/YunYouJun/hexo-theme-yun themes/yun
```

> More info about [hexo-theme-yun](https://yun.yunyoujun.cn)

## CDN

### JSDELIVR

[![JSDELIVR](https://www.jsdelivr.com/img/logo-horizontal.svg)](https://www.jsdelivr.com/)

- Prefix: <https://cdn.jsdelivr.net/gh/YunYouJun/cdn/>

### 腾讯云

[![Tencent Cloud](https://imgcache.qq.com/open_proj/proj_qcloud_v2/gateway/portal/css/img/nav/logo-bg-color.svg)](https://cloud.tencent.com/)

#### 刷新目录

```sh
# 注意这里的参数是 Array
tccli cdn PurgePathCache --Paths '["https://www.yunyoujun.cn/links/"]' --FlushType flush
```

#### 刷新路径

```sh
tccli cdn PurgeUrlsCache --Urls '["https://www.yunyoujun.cn/links/index.html"]'
```

### 又拍云

<a href="https://console.upyun.com/register/?invite=SyeQw09Bz" title="又拍云" target="_blank">
  <img src="https://cdn.jsdelivr.net/gh/YunYouJun/cdn/img/logo/upyun-logo.png" width="100" alt="upyun">
</a>

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
