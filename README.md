# [云游君的小站](https://www.yunyoujun.cn)站点源文件

[![Deploy Valaxy site to GitHub Pages](https://github.com/YunYouJun/yunyoujun.github.io/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/YunYouJun/yunyoujun.github.io/actions/workflows/gh-pages.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/4acb3c9b-fbcd-488e-be70-18942eb2669f/deploy-status)](https://app.netlify.com/sites/yunyoujun/deploys)

- 已迁移至 [valaxy](https://github.com/YunYouJun/valaxy) + [valaxy-theme-yun](https://github.com/YunYouJun/valaxy/tree/main/packages/valaxy-theme-yun)
- 旧版 Hexo 主题：[Yun](https://github.com/YunYouJun/hexo-theme-yun/)

- 主站：[yunyoujun.cn](https://www.yunyoujun.cn) | [yunyoujun.github.io](https://yunyoujun.github.io)
- 备用：<https://yunyoujun.netlify.app>
  - Hexo 版本存档：<https://hexo.yunyoujun.cn>
- 笔记：<https://notes.yunyoujun.cn>
- 赞助：<https://www.yunyoujun.cn/sponsors/>

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

### 备案模式

备案期间默认使用备案模式构建：

```bash
pnpm build
# 等同于
pnpm build:beian
```

需要构建完整站点时使用：

```bash
pnpm build:normal
```

本地开发默认展示完整站点，可通过 `pnpm dev:beian` 预览备案模式。备案模式由环境变量 `VITE_BEIAN_MODE=true` 控制，仅隐藏广告、赞助、群聊、评论、搜索等公开入口，原有文章和子页面 URL 仍然保留。

<details>
<summary>旧版 - Hexo 版本</summary><br />

### Install Theme

```bash
git clone https://github.com/YunYouJun/hexo-theme-yun themes/yun
```

> More info about [hexo-theme-yun](https://yun.yunyoujun.cn)

</details>

## CDN

### JSDELIVR

[![JSDELIVR](https://www.jsdelivr.com/img/logo-horizontal.svg)](https://www.jsdelivr.com/)

- Prefix: <https://cdn.yunyoujun.cn/>

### 腾讯云

[![Tencent Cloud](https://imgcache.qq.com/open_proj/proj_qcloud_v2/gateway/portal/css/img/nav/logo-bg-color.svg)](https://cloud.tencent.com/)

```bash
# https://cloud.tencent.com/document/product/440/111345
tccli auth login
```

#### EdgeOne 刷新缓存

```bash
# EdgeOne yunyoujun.cn
# https://cloud.tencent.com/document/product/1552/70759
tccli teo CreatePurgeTask --ZoneId zone-32usfya3lb5o --Type purge_host --Targets '["www.yunyoujun.cn"]'
```

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
  <img src="https://cdn.yunyoujun.cn/img/logo/upyun-logo.png" width="100" alt="upyun">
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
