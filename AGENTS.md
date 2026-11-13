# 云游君的小站

- 这是 `www.yunyoujun.cn` 的站点仓库，内容分支是 `valaxy`。文章、站点配置和部署文件在此维护；可复用的框架或主题修复放到 Valaxy 仓库。
- 使用 Node.js 24 和项目声明的 pnpm 版本。用 `pnpm dev` 开发；用 `pnpm build` 生成 `dist/`，用 `pnpm build:beian` 检查备案模式。搜索使用 Fuse，SSG 构建会生成索引。
- 文章在 `pages/posts/`。保留已发布的 URL；移动文章时为旧地址添加跳转。未发布内容放在 `pages/_drafts/` 或设置 `draft: true`。维护 CMS 时参见 [CMS 内容维护手册](docs/cms.md)。
- 配置或组件改动运行 `pnpm lint`、`pnpm typecheck` 和 `pnpm test`；涉及导航、搜索或首页时使用 `pnpm test:browser`。改动 SEO 或部署输出时检查 `dist/` 中的实际产物。
- 站点变更通过独立分支和 Pull Request 提交，提交信息使用 Conventional Commits。
