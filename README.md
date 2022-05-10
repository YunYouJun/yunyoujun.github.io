# Hexo 站点源文件

[![GitHub Pages](https://github.com/YunYouJun/yunyoujun.github.io/workflows/GitHub%20Pages/badge.svg)](https://github.com/YunYouJun/yunyoujun.github.io/actions)
[![Netlify Status](https://api.netlify.com/api/v1/badges/4acb3c9b-fbcd-488e-be70-18942eb2669f/deploy-status)](https://app.netlify.com/sites/yunyoujun/deploys)

Hexo 主题：[Yun](https://github.com/YunYouJun/hexo-theme-yun/)

- 主站：[yunyoujun.cn](https://www.yunyoujun.cn) | [yunyoujun.github.io](https://yunyoujun.github.io)
- 备用：<https://yunyoujun.netlify.app>
  - Hexo 版本存档：<https://hexo.yunyoujun.cn>
- 笔记：<https://notes.yunyoujun.cn>
- 赞助：<https://sponsors.yunyoujun.cn>

## Use

### 日常发布

发布时，同时推送至 GitHub 与 Coding 的 hexo 分支备份，使用 CI （GitHub Actions） 生成静态页面推送至 GitHub

```bash
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

```bash
git clone https://github.com/YunYouJun/yunyoujun.github.io
# coding
git remote add coding https://e.coding.net/YunYouJun/yunyoujun.coding.me.git
```

### 同时推送

```bash
git remote set-url --add origin https://e.coding.net/YunYouJun/yunyoujun.coding.me.git
```

## Build

- [~~yunyoujun.github.io - Travis CI~~](https://www.travis-ci.com/YunYouJun/yunyoujun.github.io)
- [GitHub Actions](https://github.com/YunYouJun/yunyoujun.github.io/actions): 现已改为使用 GitHub Actions

### Install Theme

```bash
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

```bash
# 注意这里的参数是 Array
tccli cdn PurgePathCache --Paths '["https://www.yunyoujun.cn/links/"]' --FlushType flush
```

#### 刷新路径

```bash
tccli cdn PurgeUrlsCache --Urls '["https://www.yunyoujun.cn/links/index.html"]'
```

### 又拍云

<a href="https://console.upyun.com/register/?invite=SyeQw09Bz" title="又拍云" target="_blank">
  <img src="https://cdn.jsdelivr.net/gh/YunYouJun/cdn/img/logo/upyun-logo.png" width="100" alt="upyun">
</a>

图床：又拍云云存储 + PicGo = <https://upyun.yunyoujun.cn>

## Commit Lint

[gitmoji](https://gitmoji.carloscuesta.me/)

```bash
git commit -m 'xxx'
```

### 更新博客内容

```bash
📝 update
```

### Fixing typos

```bash
✏️ typo
```

### UI

```bash
💄 xxx
```

### Improving structure / format of the code

```bash
🎨 xxx
```

### Fixing CI Build

```bash
💚 travis
```

### Changing configuration files

```bash
🔧 config
```

### Other

```bash
chore(xxx): xxx
```

## FAQ

### submodule

[.gitmodules](.gitmodules)

```bash
git submodule add https://github.com/YunYouJun/hexo-theme-yun themes/yun
```
