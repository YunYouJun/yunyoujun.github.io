# Hexo 站点源文件

[![GitHub Pages](https://github.com/YunYouJun/yunyoujun.github.io/workflows/GitHub%20Pages/badge.svg)](https://github.com/YunYouJun/yunyoujun.github.io/actions)
[![Netlify Status](https://api.netlify.com/api/v1/badges/4acb3c9b-fbcd-488e-be70-18942eb2669f/deploy-status)](https://app.netlify.com/sites/yunyoujun/deploys)

Hexo 主题：[Yun](https://github.com/YunYouJun/hexo-theme-yun/)

- 主站：[yunyoujun.cn](https://www.yunyoujun.cn) | [yunyoujun.github.io](https://yunyoujun.github.io)
- 备用：<https://yunyoujun.netlify.app>
- 笔记：<https://notes.yunyoujun.cn>
- 赞助：<https://sponsors.yunyoujun.cn>

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

- [Comment | Waline](https://waline.yunyoujun.cn/ui/)

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

- Prefix: <https://cdn.jsdelivr.net/gh/YunYouJun/cdn/> | <https://cdn.yunyoujun.cn>

> 由于 `cdn.jsdelivr.net` 已被污染，建议使用 `https://fastly.jsdelivr.net`（也被污染，使用自建 CDN `https://upyun.yunyoujun.cn`）。

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
  <img src="https://cdn.yunyoujun.cn/img/logo/upyun-logo.png" width="100" alt="upyun">
</a>

图床：又拍云云存储 + PicGo = <https://upyun.yunyoujun.cn>

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

### submodule

[.gitmodules](.gitmodules)

```sh
git submodule add https://github.com/YunYouJun/hexo-theme-yun themes/yun
```
