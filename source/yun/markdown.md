---
title: Yun - Markdown
date: 2020-02-10 02:02:15
updated: 2020-02-10 02:02:15
---

## Blockquote

> Primary

<div class="success">

> Success

</div>

<div class="warning">

> Warning

</div>

<div class="danger">

> Danger

</div>

<div class="info">

> Info

</div>

<details>
<summary>使用方式</summary>
```markdown
> Primary

<div class="success">

> Success

</div>

<div class="warning">

> Warning

</div>

<div class="danger">

> Danger

</div>

<div class="info">

> Info

</div>
```
</details>

### 为什么不用 Hexo Tag ?

使用 HTML 标签的方式，而非 Hexo Tag 的方式，以便于兼容任意 Markdown 预览。

譬如 Hexo Tag 的形式如下：

```markdown
{% blockquote [author[, source]] [link] [source_link_title] %}
content
{% endblockquote %}
```

当你用本地的其他 Markdown 编辑器/或在 GitHub 上预览时会很丑。
而直接使用 HTML 标签，即便不支持该样式，`div` 也会被正常解析，变为默认的引用块，在预览中可正常显示。
