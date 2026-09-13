# 主题补丁

`valaxy-theme-yun@1.0.0-rc.8.patch` 保留本仓库已有的合集修复，并同步尚未发布的主题外观能力：

- `banner.grid`：首页网格开关、渐隐与可选鼠标局部提亮。
- `postCard.excerptGradient` / `titleClass`：摘要遮罩和列表标题样式配置。
- `navbar.glass`：滚动后或始终显示磨砂，并支持实色降级。
- Fuse 搜索改为原生模态全屏磨砂搜索，保留宽搜索框与衬线字体：精简摘要、深浅色适配、键盘选择、焦点返回、加载失败重试与移动端布局。
- 导航磨砂使用独立伪元素，避免限制搜索遮罩的固定定位范围和背景模糊。
- 标题、摘要和导航的 CSS 变量；键盘焦点与减少动态效果适配。

对应源码位于 Valaxy 仓库的 `packages/valaxy-theme-yun`，配置说明见该包的 `docs/zh-CN/config.md`。补丁只是主题发布前的过渡，博客的 `_appearance.scss` 与 `_dark.scss` 仅保留个人外观变量；不要再通过组件或工具类选择器覆盖这些能力。

升级到包含上述实现的正式主题版本后，确认合集修复也已包含，再移除该补丁及 `pnpm-workspace.yaml` 的对应 `patchedDependencies` 项并重新安装依赖。
