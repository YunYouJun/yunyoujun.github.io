# 小云梦工坊视频专栏

专栏使用 Valaxy collections，地址为 `/collections/xiaoyun/`；旧 `/studio/` 地址自动跳转。合集总览为 `/collections/`。导航与侧栏入口配置在 `theme.config.ts`。

## 增加一期视频

1. 在 `config/studio.ts` 的 `studioVideos` 中以文章路径为键加入公开的视频资料。日期使用视频实际发布日期，不保存会过期的播放量。
2. 在 `pages/posts/` 中新增配套文章，设置标题、文章日期、分类和标签。标题包含 `#` 时使用引号。
3. 在 `pages/collections/xiaoyun/index.ts` 的 `items` 中通过 `link` 引用文章。此列表是合集归属和阅读顺序的唯一来源；专栏按此顺序展示视频。文章加入返回 `/collections/xiaoyun/` 的链接，并使用 `StudioVideo` 展示视频。
4. 运行 `pnpm test`、`pnpm lint`、`pnpm typecheck` 和 `pnpm test:browser`。

播放器只在点击后加载，关闭自动播放；B 站直达链接始终保留。封面加载失败时显示文字回退。无需将视频二进制文件加入博客仓库。

## AI 参与说明

文章可使用以下自定义 frontmatter，文章头部会在标签下方居中展示轻量图标标识，与标题和日期保持同一视觉轴线。桌面悬浮或键盘聚焦显示说明浮层，手机轻点查看，点击外部或按 Esc 关闭；浮层不会撑开正文，并适配亮暗模式：

```yaml
ai:
  mode: generated # assisted：实质性辅助；generated：生成主要正文
  reviewed: false # 仅在作者确实审阅后改为 true
  note: 本文由 AI 根据作者提供的素材整理撰写。
```

未设置该字段的文章不显示标识，不推测历史文章的来源。不要将视频的 AI 制作说明直接等同于文章的 AI 创作说明。

## 浏览器回归

首次运行需要 `pnpm exec playwright install chromium`。`pnpm test:browser` 会构建静态站点，在 `http://localhost:4851` 启动生产预览，覆盖桌面、手机和深色模式。已有预览服务会被复用；代码更新后请先停止旧预览，确保重新构建。

截图与失败 trace 默认写入 `/tmp/yunyoujun-blog-playwright`，可使用 `PLAYWRIGHT_OUTPUT_DIR` 修改。测试替换第三方播放器响应，验证按需加载、键盘交互和跳转；B 站实际播放需另行人工检查。导航回归使用系统字体，避免字体服务超时阻塞页面加载。

CI 会运行单元测试与浏览器回归。生产发布仍由仓库现有的部署工作流完成。

## 主题合集导航

Yun 主题的合集目录支持多个合集切换、文章高亮和手机折叠目录。普通 `/posts/` 文章通过 `items.link` 识别所属合集，保留原地址。未归属合集的文章继续显示个人侧栏；同一文章属于多个合集时，目录默认采用配置顺序中的首个合集。

小云梦工坊设置 `collapse: false`，不额外生成首页合集卡片，原文章仍正常出现在首页和 RSS 中。

主题实现位于 `YunYouJun/valaxy` 的 `packages/valaxy-theme-yun`。在包含此功能的主题版本发布前，博客通过 `patches/valaxy-theme-yun@1.0.0-rc.8.patch` 使用相同实现。升级到包含该改动的版本后，移除 `pnpm-workspace.yaml` 中的对应 `patchedDependencies` 和补丁文件，并重新安装依赖、运行回归。不要修改 `node_modules` 或添加本地仓库路径依赖。

## 项目展示样式

视频元数据的 `projectName` 用于项目入口文案；可选的 `appearance: 'ak-ui'` 为该期卡片和视频启用局部战术面板样式。未设置 `appearance` 时使用默认 Yun 卡片。合集目录、栏目介绍与文章正文不随项目换肤。

项目配色集中在 `styles/studio-projects.css`，亮暗模式跟随站点的 `.dark` 状态。新增项目外观时同时定义表面、文字、次要文字、边框、强调色和按钮配色；保留键盘焦点与封面失败回退。这里使用局部 CSS 表达项目设计语言，不加载 ak-ui 的全局样式或运行时。
