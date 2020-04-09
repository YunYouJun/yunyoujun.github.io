---
title: Yun Test
date: 2020-03-23 02:02:15
updated: 2020-03-23 02:02:15
type:
katex: true
---

## KaTeX

- <https://katex.org/docs/autorender.html>

注意，在 Markdown 文件中直接书写时，你需要多一个 `\` 来转译 `\`。

使用 `\\[ E = mc^2 \\]` 而不是 `\[ E = mc^2 \]`。

如果你有过多需要转译的字符，你可以直接使用 HTML 标签包裹它（内部的字符将不会被作为 Markdown 解析），而无需使用多个 `\` 来转译。

譬如：

<div>
\[ E = mc^2 \]
</div>

```html
<div>
  \[ E = mc^2 \]
</div>
```

---

$$ E = mc^2 $$

```latex
$$ E = mc^2 $$
```

---

\\[ E = mc^2 \\]

```latex
\[ E = mc^2 \]
```

---

\\( E = mc^2 \\)

```latex
\( E = mc^2 \)
```
