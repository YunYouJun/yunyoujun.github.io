# 使用云栈维护内容

日常内容维护可以直接使用 [云栈（Yunle CMS）](https://cms.yunle.fun/)。云栈只读取和编辑仓库中的 Markdown，不执行本仓库的 Valaxy 配置、组件或插件；所有正式变更仍通过独立分支和 Pull Request 发布。

## 第一次连接

1. 登录云栈，并确认已关联 GitHub 账号 `@YunYouJun`。
2. 选择仓库 `YunYouJun/yunyoujun.github.io`。
3. 目标分支保持 `valaxy`，项目目录保持 `.`。
4. CMS 会读取仓库根目录的 [`.yunlefun/cms.json`](../.yunlefun/cms.json)，把内容分成“文章”“草稿”和“独立页面”。

进入工作区后，先核对顶部的仓库名和分支，再开始编辑。首次进入会显示本站专用指引；之后可以通过“帮助 → 查看本站编辑指引”重新打开。

## 日常工作流

1. 从左侧集合打开内容，也可以通过路径搜索。
2. 修改正文或右侧字段，等待右下角状态变为“已保存”。
3. 使用“独立预览”检查通用 Markdown 排版。
4. 点击“审阅并发布”，核对真实差异和目标分支。
5. 创建 Pull Request，等待 CI 生成站点预览。
6. 在站点预览中检查 Valaxy 组件、主题样式和链接，再合并到 `valaxy`。

## 与 Studio 联动

为公众号准备长文时，正文仍只维护在本仓库：写作中的内容放在 `pages/_drafts/*.md`，正式博客文章放在 `pages/posts/**/*.md`。

Studio 的微信公众号发布包可以记录对应文件路径，并通过“在云栈编辑”直接打开当前文章。编辑并保存后回到 Studio 刷新源稿；Studio 会重新读取 Markdown、固定 GitHub revision 和内容 hash，再生成公众号预览与可复制的富文本正文。标题默认读取 `title`，分享摘要优先读取 `description`，正文不会在 Studio 中另存一份需要独立维护的文案。

CMS 的内容预览不会运行仓库代码，因此 `::: tip` 等 Valaxy/VitePress 容器、Vue 组件和主题专用能力可能与最终页面不同。最终效果以 Pull Request 的站点预览为准。

## 文章

“文章”对应 `pages/posts/**/*.md`。

- 新文件建议使用英文小写和短横线，例如 `my-new-post.md`。
- `title` 为必填标题。
- `date`、`updated` 沿用仓库现有格式：`YYYY-MM-DD HH:mm:ss`。
- 只需要日期时也可以使用 `YYYY-MM-DD`。
- `categories`、`tags` 在表单中用逗号分隔，保存后仍会写回 YAML 列表。
- `draft` 用于暂不发布的内容。
- `end`、`type`、`url`、`katex` 只在文章需要对应能力时设置。

日期在 CMS 中使用文本输入，是为了兼容仓库里同时存在的“仅日期”和“日期加时间”两种 Valaxy 写法，避免浏览器日期控件把合法旧值显示为空。

## 草稿

“草稿”只包含 `pages/_drafts/*.md` 下仍在维护的顶层文件。

- `pages/_drafts/abandon/` 是不再继续的内容。
- `pages/_drafts/old/` 是因失效而移除的旧内容。
- `pages/_drafts/README.md` 是目录说明。

这三类文件默认不进入可编辑集合，避免误发布；需要查看时可以开启“显示仓库其他文件”，它们会保持只读。准备发布草稿时，建议在同一个 Pull Request 中把文件移动到 `pages/posts/`，并再次确认日期、分类和标签。

## 独立页面

“独立页面”对应 `pages/` 下除文章、草稿和 README 之外的 Markdown，例如 About、友链、项目、赞助、归档和标签页。

这些页面经常依赖专用 `layout`、`icon`、`toc`、`aside`、`nav`、`reward` 或评论开关。CMS 没有列出的未知 frontmatter 字段会原样保留；不确定字段用途时，先查看源码和 Pull Request 预览，不要删除。

## 已知体验注意事项

在 CMS 修复以下问题前，编辑时遵循这些保护动作：

- 切换站点或文章后，等待正文、面包屑和右侧标题同时更新，再开始输入。
- 从“帮助 → 关于云栈”返回后重新确认站点选择器仍是 `YunYouJun/yunyoujun.github.io`。
- 发布弹窗可能仍写“不会直接修改 main”；本仓库实际目标分支应为 `valaxy`，以顶部和 Pull Request 的 base branch 为准。
- `::: tip`、Vue 组件和主题样式不会在安全 Markdown 预览中完整还原，以 CI 生成的站点预览为准。

## 清单维护

CMS 接入配置位于 `.yunlefun/cms.json`，使用 [Yunle CMS Manifest v1 Schema](https://cms.yunle.fun/spec/manifest.v1.schema.json)。

修改清单时请保持：

- 集合目录彼此不重叠。
- 工作流目标分支为 `valaxy`。
- 日期字段兼容现有的完整时间格式。
- 新增或重命名集合后同步更新 onboarding 的 `collectionId`。
- 只有希望所有编辑者再次看到更新后的指引时，才增加 `onboarding.version`。

CMS 暂时不可用时，可以继续直接修改 `pages/` 中的文件，执行本地检查后按正常 Git 流程提交。
