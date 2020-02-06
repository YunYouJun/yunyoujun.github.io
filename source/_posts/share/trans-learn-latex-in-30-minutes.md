---
title: 【译】30 分钟学会 LaTeX
date: 2019-10-28 16:02:36
updated: 2019-11-05 16:09:36
tags:
  - LaTeX
  - 译文
  - 教程
  - 分享
categories:
  - 云游的小安利
---

> 译自 [Overleaf - Learn LaTeX in 30 minutes](https://cn.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes)
> 云游君 (YunYouJun) <me@yunyoujun.cn>

在本指南中，我们希望为您初步介绍一下 LaTeX 。
该指南不需要您具有任何 LaTeX 的[先验知识](https://baike.baidu.com/item/先验知识)，
不过到您完成时，您将会已经编写出您的第一个 LaTeX 文档，并且如果顺利的话，您将能够对 LaTeX 提供的一些基本功能有很好地了解。

<!-- more -->

## 什么是 LaTeX ？

LaTeX （发音为 LAY-tek or LAH-tek） 是个用于创建专业外观文档的工具。
它基于“所见即所得”的思想，这意味着您仅需要关注您文档的内容，接下来计算机会帮你搞定格式。
用户们可以输入纯文本并让 LaTeX 来处理剩余部分，而不是像 Microsoft Word 或 LibreOffice Writer 那样在页面上分割文本去控制格式。

> 译者注：英式英语：/'leɪteks/ ｜ 美式英语：/'letɛks/

## 为什么学习 LaTeX ？

LaTeX 在世界范围内用于科学文档，书籍以及许多其他形式的出版。
它不仅可以创建精美的排版文档，而且还允许用户非常快速地处理排版更为复杂的部分，例如输入数学公式、创建目录、饮用和创建书目以及在所有章节中保持一致的布局。
由于可用的开源软件包数量众多（稍后会详细介绍），所以 LaTeX 的可能性是无穷的。
这些软件包允许用户使用 LaTeX 做更多的事情，比如添加脚注、绘制图表格、创建表格等。

人们使用 LaTeX 最重要的原因之一是它分离了文档的内容和样式。
这意味着您一旦写好了文档的内容，我们就可以轻松改变它的外观。
同样，您可以创建一种文档的样式，用来标准化许多不同文档的外观。
这使得科学期刊可以为投稿创建模版。这些模版拥有一个预制布局，而仅需要添加内容。
实际上，从简历到幻灯片的所有内容有上百种可用的模版。

## 来写你的第一篇 LaTeX 吧

第一步是创建一个新的 LaTeX 项目。
您可以通过创建新的 `.tex` 文件来在自己的计算机上做这件事，或者您也可以在 Overleaf 中开始一个新项目。
让我们从最简单的工作示例开始吧：

```latex
\documentclass{article}

\begin{document}
First document. This is a simple example, with no 
extra parameters or packages included.
\end{document}
```

![Firstdocsmall.PNG](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/0/01/Firstdocsmall.PNG)

你可以看到 LaTeX 已经通过缩进段落的第一行，为你处理了第一段格式。
让我们来仔细看一下我们代码的每个部分的功能。

[Open an example in Overleaf](https://www.sharelatex.com/project/new/template?zipUrl=/project/582dbc33f220531c2d4bda27/download/zip&templateName=Learn%20LaTeX%20in%2020%20minutes:%20Part%201&compiler=pdflatex)

代码的第一行声明来文档的类型，叫做类。这个类控制文档的整体外观。
不同类型的文档将会需要不同的类，即简历相比一篇科学论文将需要一个不同的类。
在这种情况下，这个类是 `article`，一种最简单最常见的 LaTeX 类。
您如果正在处理其他类型的文档，那可能需要不同的类，例如 `book` 或者 `report`。

在此之后，您编写封装在 `\begin{document}` 和 `\end{document}` 标签里的文档内容。
这就是文档的主体。你可以在这里开始编写，并根据你的需要来修改文本。
你必须编译文档，才能在 `PDF` 中查看这些更改的结果。
你只需点击 `Recompile` 便可在 Overleaf 中执行此操作。
（你也可以通过点击 `Recompile` 按钮旁的小尖头，并设置 `Auto Compile` 为开，来将项目设置为在编辑文件时自动重新编译。）

如果你使用的是基础文本编辑器，例如 `gedit`、`emacs`、`vim`、`sublime`、`notepad`等，你将不得不手动编译文档。
为此，只需在你的计算机终端/命令行中运行 `pdflatex <你的文档>`。
有关如何执行此操作的更多信息，请参见[此处](https://en.wikibooks.org/wiki/LaTeX/Basics#Compilation)。

如果你正在使用[专用的 LaTeX 编辑器](https://en.wikibooks.org/wiki/LaTeX/Installation#Editors)比如 `TeXmaker` 或者 `TeXworks`，只需点击 `Recompile` 按钮。
如果你不确定位置在哪里，请查阅程序文档。

现在您已经了解了如何向文档中添加内容，那么下一步就是给它起个标题。 为此，我们必须简短地谈一下 `preamble` （preamble 有引言、序文之意，但是这里主要指 LaTeX 中的代码部分，所以保留原词）。

## 一篇文档的序文

在上一个示例中，文本是被输入在 `\begin {document}` 命令之后的。
在此之前，`.tex` 文件中的的所有内容都被称为 `preamble`。
在 `preamble` 中，你定义要编写的文档的类型，编写所用的语言，想要使用的包（稍后会详细介绍）和其他几个元素。
例如，普通文档的 `preamble` 将如下所示：

```latex
\documentclass[12pt, letterpaper]{article}
\usepackage[utf8]{inputenc}
```

下面是每行的详细说明：

```latex
\documentclass[12pt, letterpaper]{article}
```

如前所述，这定义了文档的类型。一些包含在方括号里的附加参数可以被传递给命令。
这些参数必须用逗号分隔。在示例中，额外的参数设置字体大小（12pt）和纸张尺寸（letterpaper）。
当然，可以使用其他字体大小（9pt，11pt，12pt），但是如果没有指定，则默认大小为 `10pt`。
至于纸张尺寸，其他可能的值是 `a4paper` 和 `legalpaper``；
请参阅有关页面大小和边距的文章，以获取有关此内容的更多详细信息。

```latex
\usepackage[utf8]{inputenc}
```

这是文档的编码。它可以被省略或更改为其他编码，但建议使用 `utf-8`。
除非您特别需要其他编码，否则如果你还不确定的话，请将此行添加到 `preamble` 中。

## 添加标题、作者和日期

要将标题，作者和日期添加到文档中，您必须在 `preamble`（不是文档的主体）中添加三行。
这些行是

```latex
\title{First document}
```

这是文档的标题。

```latex
\author{Hubert Farnsworth}
```

在此处输入作者的姓名，并且作为一个可选项，你可以添加接下来的命令：

```latex
\thanks{funded by the Overleaf team}
```

这可以被添加在标题命令的大括号里作者的姓名之后。它将会添加上标和有着括号内文本的脚注。
如果您需要在文章中感谢一个机构，该功能将非常有用。

```latex
\date{February 2014}
```

您可以手动输入日期或使用命令 `\today`，以便在编译文档时自动更新日期。

添加这些行后，您的 `preamble` 应该看起来像这样

``` latex
\documentclass[12pt, letterpaper, twoside]{article}
\usepackage[utf8]{inputenc}

\title{First document}
\author{Hubert Farnsworth \thanks{funded by the Overleaf team}}
\date{February 2017}
```

现在，您已经为文档指定了标题，作者和日期，您可以使用 `\maketitle` 命令在文档上打印此信息。这应被包含在文档的 `body`（主体，原文加粗，作为 LaTeX 术语） 中您像要打印标题的位置。

```latex
\begin{document}

\maketitle

We have now added a title, author and date to our first \LaTeX{} document!

\end{document}
```

![Learnlatex1.PNG](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/e/e9/Learnlatex1.PNG)

[Open an example in Overleaf](https://www.sharelatex.com/project/new/template?zipUrl=/project/582dbeacf220531c2d4bdaaa/download/zip&templateName=Learn%20LaTeX%20in%2020%20minutes:%20Part%202&compiler=pdflatex)

## 添加注释

与任何你正在编写的任何代码一样，包含注释通常会很有用。注释是您可以包含在文档中的几段文字，这些文字不会被打印，也不会以任何方式影响文档。在调试时，它们对于组织工作，做笔记或注释行/节很有用。要在 LaTeX 中进行注释，只需在行首写一个 ％ 符号，如下所示：

```latex
\begin{document}

\maketitle

We have now added a title, author and date to our first \LaTeX{} document!

% This line here is a comment. It will not be printed in the document.

\end{document}
```

![Learnlatex1.PNG](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/e/e9/Learnlatex1.PNG)

[Open an example in Overleaf](https://www.sharelatex.com/project/new/template?zipUrl=/project/58a308db13712fef4e9deff7/download/zip&templateName=Learn%20LaTeX%20in%2020%20minutes:%20Part%203&compiler=pdflatex)

## 粗体，斜体和下划线

现在，我们来看一些简单的文本格式命令。

- **粗体**：LaTeX 中的粗体文本使用 `\textbf{...}` 命令编写。
- *斜体*：LaTeX 中的斜体文本使用 `\textit{...}` 命令编写。
- <u>下划线</u>：LaTeX 中带下划线的文本使用 `\underline{...}` 命令编写。

下面展示了其中每个实例的示例：

```latex
Some of the \textbf{greatest}
discoveries in \underline{science}
were made by \textbf{\textit{accident}}.
```

![Biu1.png](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/a/a9/Biu1.png)

另一个非常有用的命令是 `\emph{...}` 命令。实际上，`\emph` 命令使用其参数的操作取决于上下文 - 在普通文本中，强调的文本是斜体，但是如果在斜体文本中使用，则此行为是相反的 - 请参见以下示例：

```latex
Some of the greatest \emph{discoveries}
in science
were made by accident.

\textit{Some of the greatest \emph{discoveries}
in science
were made by accident.}

\textbf{Some of the greatest \emph{discoveries}
in science
were made by accident.}
```

![Biu5.png](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/5/5d/Biu5.png)

此外，某些软件包，例如 [`Beamer`](https://cn.overleaf.com/learn/Beamer)，更改了 `\emph` 命令的行为方式。

[Open an example in Overleaf](https://www.sharelatex.com/project/new/template?zipUrl=/project/58a30a6813712fef4e9df06b/download/zip&templateName=Learn%20LaTeX%20in%2020%20minutes:%20Part%204&compiler=pdflatex)

## 添加图像

现在，我们将研究如何将图像添加到 LaTeX 文档中。在 Overleaf 上，您首先必须[上传图像](https://cn.overleaf.com/learn/Including_images_in_ShareLaTeX)。

以下是一个如何包含图片的示例。

> 译者注：前文使用的是 image ，这里使用的是 picture ，所以分别译为图像、图片。

```latex
\documentclass{article}
\usepackage{graphicx}
\graphicspath{ {images/} }

\begin{document}
The universe is immense and it seems to be homogeneous, 
in a large scale, everywhere we look at.

\includegraphics{universe}

There's a picture of a galaxy above
\end{document}
```

![InsertingImagesEx1.png](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/9/9d/InsertingImagesEx1.png)

[Open an example in Overleaf](https://www.sharelatex.com/project/new/template?zipUrl=/project/58a30b7413712fef4e9df0a8/download/zip&templateName=Learn%20LaTeX%20in%2020%20minutes:%20Part%205&compiler=pdflatex)

LaTeX 不能单独管理图像，因此您需要使用一个包。包可用于更改 LaTeX 文档的默认外观，或允许更多功能。
这种情况下，您需要在我们的文档中包含一个图像，因此您应该使用 `graphicx` 包。
该软件包提供了新命令 `\includegraphics{...}` 和 `\graphicspath{...}`。
要使用 `graphicx` 包，请在你的 `preamble` 中包含以下行：`\usepackage{graphicx}`。

命令 `\graphicspath{ {images/} }告诉 LaTeX，图像被保存在当前目录下名为 *images* 的文件夹中。

`\includegraphics{universe}` 是将图像实际包含在文档中的命令。
这里的 *universe*（宇宙）是包含图像的文件不带扩展名时的名称，所以 *universe.PNG* 就变成了 *universe*。
图像的文件名不应包含空格或多个点。

> 注意：文件扩展名是被允许包括进来的，但是最好忽略它。如果省略文件扩展名，它将提示 LaTeX 搜索所有支持的格式。在上传图像文件时，通常也建议使用小写字母作为文件扩展名。有关更多详细信息，请参见[生成高分辨率和低分辨率图像](https://cn.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes#Generating_high-res_and_low-res_images)的部分。
> 译者注：该段落原文给出的链接无法跳转到相应的信息部分。

## 标题，标签和参考

可以通过图形环境对图像添加标题、标签和引用，如下所示：

```latex
\begin{figure}[h]
    \centering
    \includegraphics[width=0.25\textwidth]{mesh}
    \caption{a nice plot}
    \label{fig:mesh1}
\end{figure}

As you can see in the figure \ref{fig:mesh1}, the
function grows near 0. Also, in the page \pageref{fig:mesh1}
is the same example.
```

![InsertingImages.PNG](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/2/25/InsertingImages.PNG)

[Open an example in Overleaf](https://www.sharelatex.com/project/new/template?zipUrl=/project/58a30c5613712fef4e9df0e8/download/zip&templateName=Learn%20LaTeX%20in%2020%20minutes:%20Part%206&compiler=pdflatex)

该示例中包含三个重要的命令：

- `\caption{a nice plot}`：您可能会期望此命令为图形设置标题。如果你创建了一个图形列表，那么标题将会被用在这里。您可以将其放在图的上方或下方。
- `\label{fig:mesh1}`：如果您需要在文档中引用图像，请使用此命令设置标签。标签将为图像编号，并与下一个命令结合使用，以供您参考。
- `\ref{fig:mesh1}`：该代码将替换为与参考图相对应的数字。

将图像放置在 LaTeX 文档中时，我们应始终将它们放置在图形环境或类似环境中，以便 LaTeX 可以用适合您剩余文本的方式放置图像。

> 注意：如果您在自己的计算机上使用标题和参考，那你将必须编译两次文档才能使参考正常工作。Overleaf 会自动为您完成此操作。

## 在 LaTeX 中创建列表

在 LaTeX 中创建列表非常简单。您可以使用不同的列表环境创建列表。
环境是我们文档中您希望以与文档其余部分不同方式进行呈现的部分。
它们以 `\begin{...}` 命令开始，以 `\end{...}` 命令结束。

列表主要有两种不同的类型，有序列表和无序列表。各自将使用不同的环境。

### 无序列表

无序列表是由 `itemize`（逐项列记之意，原文为专有名词）环境生成的。每个条目之前必须带有控制序列 `\item`，如下所示。

```latex
\begin{itemize}
  \item The individual entries are indicated with a black dot, a so-called bullet.
  \item The text in the entries may be of any length.
\end{itemize}
```

![Itemize.png](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/e/ea/Itemize.png)

默认情况下，各个独立的条目都用黑点标示，即所谓的项目符号。条目中的文本可以有任意长度。

[Open an example in Overleaf](https://www.sharelatex.com/project/new/template?zipUrl=/project/52fe74766a6237452e000088/download/zip&templateName=Lists%20Examples&compiler=pdflatex)

### 有序列表

在不同环境中，有序列表具有相同的句法规则。我们使用 `enumerate`（枚举之意，原文为专有名词）环境制作有序列表：

```latex
\begin{enumerate}
  \item This is the first entry in our list
  \item The list numbers increase with each entry we add
\end{enumerate}
```

![Enumerate.png](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/3/3a/Enumerate.png)

与无序列表一样，每个条目之前必须带有控制序列 `\item`，它将自动生成标记该项目的数字。枚举标签由从 1 开始的序列号组成。

[Open an example in Overleaf](https://www.sharelatex.com/project/new/template?zipUrl=/project/52fe74766a6237452e000088/download/zip&templateName=Lists%20Examples&compiler=pdflatex)

## 为 LaTeX 添加数学符号

LaTeX 的主要优点之一是易于编写数学表达式。
LaTeX 允许两种用于数学表达式的书写模式：`inline`（内联）模式和 `display`（显示）模式。
第一种方式用于编写作为文本一部分的公式。第二种方式用于编写不属于文本或段落的表达式，因此被放在单独的行上。
让我们看一个 `inline` 模式的例子：

```latex
In physics, the mass-energy equivalence is stated 
by the equation $E=mc^2$, discovered in 1905 by Albert Einstein.
```

![Einstein1.png](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/d/db/Einstein1.png)

要使用 `inline` 模式来放置方程式，请使用以下定界符之一：`\( ... \)`，`$ ... $` 或 `\begin{math} ... \end{math}`。它们都能够起作用，选择那种取决于个人口味。

`displayed` 模式有两种版本：已编号和未编号。

```latex
The mass-energy equivalence is described by the famous equation

\[ E=mc^2 \]

discovered in 1905 by Albert Einstein. 
In natural units ($c = 1$), the formula expresses the identity

\begin{equation}
E=m
\end{equation}
```

![Einstein2.png](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/3/3a/Einstein2.png)

要在 `display` 模式下打印方程式，请使用以下定界符之一：`\[ ... \]`，`\begin{displaymath} ... \end{displaymath}` 或 `\begin{equation} ... \end{equation}`。
[不鼓励](https://texfaq.org/FAQ-dolldoll)使用 `$$ ... $$`，因为它会产生不一致的间距，并且和某些数学程序包一起使用时可能表现得不是很好。

> 重要说明：equation* 环境是由外部软件包提供的，请参阅 [amsmath](https://cn.overleaf.com/learn/Aligning_equations) 的文章。

[Open an example in Overleaf](https://www.sharelatex.com/project/new/template?zipUrl=/project/52ec4e44b43917a25a000e96/download/zip&templateName=Math%20Expressions&compiler=pdflatex)

许多数学模式命令都需要 `amsmath` 程序包，因此在编写数学公式时请确保将其包括在内。
下面显示了一些基本数学模式命令的示例。

```latex
Subscripts in math mode are written as $a_b$ and superscripts are written as $a^b$. These can be combined an nested to write expressions such as

\[ T^{i_1 i_2 \dots i_p}_{j_1 j_2 \dots j_q} = T(x^{i_1},\dots,x^{i_p},e_{j_1},\dots,e_{j_q}) \]

We write integrals using $\int$ and fractions using $\frac{a}{b}$. Limits are placed on integrals using superscripts and subscripts:

\[ \int_0^1 \frac{1}{e^x} =  \frac{e-1}{e} \]

Lower case Greek letters are written as $\omega$ $\delta$ etc. while upper case Greek letters are written as $\Omega$ $\Delta$.

Mathematical operators are prefixed with a backslash as $\sin(\beta)$, $\cos(\alpha)$, $\log(x)$ etc.
```

![Math.PNG](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/2/22/Math.PNG)

[Open an example in Overleaf](https://www.sharelatex.com/project/new/template?zipUrl=/project/58a30cfd13712fef4e9df123/download/zip&templateName=Learn%20LaTeX%20in%2020%20minutes:%20Part%207&compiler=pdflatex)

在 LaTeX 中数学的可能性是无穷的，不可能在这里将它们都列出来。
请务必查看我们这儿的其他文章

- [数学表达式 - Mathematical expressions](https://cn.overleaf.com/learn/Mathematical_expressions)
- [下标和上标 - Subscripts and superscripts](https://cn.overleaf.com/learn/Subscripts_and_superscripts)
- [方括号和圆括号 - Brackets and Parentheses](https://cn.overleaf.com/learn/Brackets_and_Parentheses)
- [分数和二项式 - Fractions and Binomials](https://cn.overleaf.com/learn/Fractions_and_Binomials)
- [对齐等式 - Aligning Equations](https://cn.overleaf.com/learn/Aligning_equations_with_amsmath)
- [运算符 - Operators](https://cn.overleaf.com/learn/Operators)
- [数学模式下的间距 - Spacing in math mode](https://cn.overleaf.com/learn/Spacing_in_math_mode)
- [积分，总和与极限 - Integrals, sums and limits](https://cn.overleaf.com/learn/Integrals,_sums_and_limits)
- [在数学模式下显示样式 - Display style in math mode](https://cn.overleaf.com/learn/Display_style_in_math_mode)
- [希腊字母和数学符号列表 - List of Greek letters and math symbols](https://cn.overleaf.com/learn/List_of_Greek_letters_and_math_symbols)
- [数学字体 - Mathematical fonts](https://cn.overleaf.com/learn/Mathematical_fonts)

## 基本格式

现在，我们将研究如何编写摘要，以及如何将 LaTeX 文档格式化为不同的章、节和段落。

### 摘要

在科学文献中，通常的做法是简要概述论文的主题。
在 LaTeX 中有一个 `abstract`（摘要）的环境。`abstract` 环境会将文本以特殊格式放在你文档的顶部。

```latex
\begin{document}

\begin{abstract}
This is a simple paragraph at the beginning of the 
document. A brief introduction about the main subject.
\end{abstract}
\end{document}
```

![Abstractsmall.PNG](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/d/db/Abstractsmall.PNG)

[Open an example in Overleaf](https://www.sharelatex.com/project/new/template?zipUrl=/project/58a30dd713712fef4e9df14e/download/zip&templateName=Learn%20LaTeX%20in%2020%20minutes:%20Part%208&compiler=pdflatex)

### 段落和换行符

```latex
\begin{document}

\begin{abstract}
This is a simple paragraph at the beginning of the 
document. A brief introduction about the main subject.
\end{abstract}

Now that we have written our abstract, we can begin writing our first paragraph.

This line will start a second Paragraph.
\end{document}
```

![Abstractnonewline.PNG](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/d/d3/Abstractnonewline.PNG)

[Open an example in Overleaf](https://www.sharelatex.com/project/new/template?zipUrl=/project/58a30dd713712fef4e9df14e/download/zip&templateName=Learn%20LaTeX%20in%2020%20minutes:%20Part%208&compiler=pdflatex)

在编写文档内容时，如果需要开始新的段落，你必须按两次 “Enter” 键（以插入双空行）。
注意，LaTeX 会自动缩进段落。

想要开始新行而不实际开始新段落，请插入一个*换行*点，这可以通过 \\（在示例中为双反斜杠）或 `\newline` 命令来实现。

注意不要使用多个 \\ 或 `\newlines` 来“模拟”段落之间具有较大间距的段落，因为这可能会干扰 LaTeX 的排版算法。
推荐的方法是继续使用双空行创建没有任何 \\ 的新段落，然后将 `\usepackage{parskip}` 添加到序言中。

您可以在 [段落和换行](https://cn.overleaf.com/learn/Paragraphs_and_new_lines) 文章中找到更多信息。

### 章节

组织文档的命令因文档类型而异，最简单的组织形式是分段，所有格式均可用。

```latex
\chapter{First Chapter}

\section{Introduction}

This is the first section.

Lorem  ipsum  dolor  sit  amet,  consectetuer  adipiscing  
elit.   Etiam  lobortisfacilisis sem.  Nullam nec mi et 
neque pharetra sollicitudin.  Praesent imperdietmi nec ante. 
Donec ullamcorper, felis non sodales...

\section{Second Section}

Lorem ipsum dolor sit amet, consectetuer adipiscing elit.  
Etiam lobortis facilisissem.  Nullam nec mi et neque pharetra 
sollicitudin.  Praesent imperdiet mi necante...

\subsection{First Subsection}
Praesent imperdietmi nec ante. Donec ullamcorper, felis non sodales...

\section*{Unnumbered Section}
Lorem ipsum dolor sit amet, consectetuer adipiscing elit.  
Etiam lobortis facilisissem
```

![Sections1.PNG](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/7/7c/Sections1.PNG)

[Open an example in Overleaf](https://www.sharelatex.com/project/new/template?zipUrl=/project/58a30e7b13712fef4e9df182/download/zip&templateName=Learn%20LaTeX%20in%2020%20minutes:%20Part%209&compiler=pdflatex)

命令 `\section{}` 标记新节的开始，在大括号内设置标题。
段编号是自动生成的，可以通过在段命令中包含 * 作为 `\section*{} 来禁用。
我们也可以有 `\subsection{}s，甚至还有 `\subsubsection{}s。下面列出了基本的深度级别：

| -1 | \part{part} |
| --- | --- |
| 0 | \chapter{chapter} |
| 1 | \section{section} |
| 2 | \subsection{subsection} |
| 3 | \subsubsection{subsubsection} |
| 4 | \paragraph{paragraph} |
| 5 | \subparagraph{subparagraph} |

请注意，`\part` 和 `\chapter` 仅在 `report`（报告）和 `book`（书籍）文档类中可用。

有关文档结构的更完整讨论，请参见[有关节和章的文章](https://cn.overleaf.com/learn/Sections_and_chapters)。

## 创建表格

### 在 LaTeX 中创建一个简单的表

下面，您可以看到一个表格最简单的工作示例

```latex
\begin{center}
\begin{tabular}{ c c c }
 cell1 & cell2 & cell3 \\
 cell4 & cell5 & cell6 \\  
 cell7 & cell8 & cell9
\end{tabular}
\end{center}
```

![TablesEx1.png](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/c/c2/TablesEx1.png)

`tabular`（表格）环境是 LaTeX 创建表格的默认方法。您必须为此环境指定一个参数，在这种情况下为 `{c c c}`。
这告诉 LaTeX 这里将有三列，并且每列中的文本必须居中。您也可以使用 `r` 将文本向右对齐，使用 `l` 进行左对齐。
对齐符号 `＆` 用于指定表格条目中的分隔符。每行中的对齐符号必须始终少于列数。
要转到表格的下一行，我们使用*换行*命令 `\\`。我们将整个表格包装在 `center`（中心）环境中，以便它出现在页面的中心。

[Open an example in Overleaf](https://www.sharelatex.com/project/new/template?zipUrl=/project/58a3101d13712fef4e9df258/download/zip&templateName=Learn%20LaTeX%20in%2020%20minutes:%20Part%2010&compiler=pdflatex)

### 添加边框

`tabular` 环境更加灵活，您可以在每列之间放置分隔线。

```latex
\begin{center}
\begin{tabular}{ |c|c|c| }
 \hline
 cell1 & cell2 & cell3 \\
 cell4 & cell5 & cell6 \\
 cell7 & cell8 & cell9 \\
 \hline
\end{tabular}
\end{center}
```

![TablesEx2.png](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/2/25/TablesEx2.png)

您可以使用水平线命令 `\hline` 和垂直线参数 `|` 添加边框。

- `{ |c|c|c| }`：这声明了被垂直线分割的三列，并将被应用在表格中。`|` 符号指定这些列应由一条垂直线分隔。
- `\hline`：这将插入一条水平线。在这里，我们在表格的顶部和底部包括了水平线。你使用 `\hline` 的次数没有限制。

在下面您可以看到第二个示例。

```latex
\begin{center}
 \begin{tabular}{||c c c c||}
 \hline
 Col1 & Col2 & Col2 & Col3 \\ [0.5ex]
 \hline\hline
 1 & 6 & 87837 & 787 \\
 \hline
 2 & 7 & 78 & 5415 \\
 \hline
 3 & 545 & 778 & 7507 \\
 \hline
 4 & 545 & 18744 & 7560 \\
 \hline
 5 & 88 & 788 & 6344 \\ [1ex]
 \hline
\end{tabular}
\end{center}
```

![TablesEx3.png](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/2/2c/TablesEx3.png)

有时在 LaTeX 中创建表格可能会有些棘手，因此您可能想使用 [TablesGenerator.com](https://www.tablesgenerator.com/) 在线工具导出表格的 [LaTeX] 代码。`File > Paste table data`（文件 > 粘贴表格数据）选项使您可以从电子表格应用程序复制和粘贴数据。

[Open an example in Overleaf](https://www.sharelatex.com/project/new/template?zipUrl=/project/58a3101d13712fef4e9df258/download/zip&templateName=Learn%20LaTeX%20in%2020%20minutes:%20Part%2010&compiler=pdflatex)

### 表格说明（标题），标签和参考

您可以使用与图像几乎相同的方式添加标题和引用表格。唯一的区别是，使用 `table`（表）环境代替了 `figure`（图）环境。

```latex
Table \ref{table:data} is an example of referenced \LaTeX{} elements.

\begin{table}[h!]
\centering
\begin{tabular}{||c c c c||}
 \hline
 Col1 & Col2 & Col2 & Col3 \\ [0.5ex]
 \hline\hline
 1 & 6 & 87837 & 787 \\
 2 & 7 & 78 & 5415 \\
 3 & 545 & 778 & 7507 \\
 4 & 545 & 18744 & 7560 \\
 5 & 88 & 788 & 6344 \\ [1ex]
 \hline
\end{tabular}
\caption{Table to test captions and labels}
\label{table:data}
\end{table}
```

![Ourtablelabel.PNG](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/2/26/Ourtablelabel.PNG)

[Open an example in Overleaf](https://www.sharelatex.com/project/new/template?zipUrl=/project/58a3101d13712fef4e9df258/download/zip&templateName=Learn%20LaTeX%20in%2020%20minutes:%20Part%2010&compiler=pdflatex)

> 注意：如果您在自己的计算机上使用标题说明和参考，则必须编译两次文档才能使参考正常工作。Overleaf 会自动为您完成此操作。

### 添加目录

创建目录很简单，命令 `\tableofcontents` 为您完成所有的工作：

```latex
\documentclass{article}
\usepackage[utf8]{inputenc}

\title{Sections and Chapters}
\author{Gubert Farnsworth}
\date{ }

\begin{document}

\maketitle

\tableofcontents

\section{Introduction}

This is the first section.

Lorem  ipsum  dolor  sit  amet,  consectetuer  adipiscing  
elit.   Etiam  lobortisfacilisis sem.  Nullam nec mi et 
neque pharetra sollicitudin.  Praesent imperdietmi nec ante. 
Donec ullamcorper, felis non sodales...

\addcontentsline{toc}{section}{Unnumbered Section}
\section*{Unnumbered Section}

Lorem ipsum dolor sit amet, consectetuer adipiscing elit.  
Etiam lobortis facilisissem.  Nullam nec mi et neque pharetra 
sollicitudin.  Praesent imperdiet mi necante...

\section{Second Section}

Lorem ipsum dolor sit amet, consectetuer adipiscing elit.  
Etiam lobortis facilisissem.  Nullam nec mi et neque pharetra 
sollicitudin.  Praesent imperdiet mi necante...

\end{document}
```

![TableOfContentsEx1.png](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/6/6d/TableOfContentsEx1.png)

节，小节和章将自动被包含在目录中。要手动添加条目（例如，当您想要一个未编号的部分时），请使用示例中的命令 `\addcontentsline`。

[Open an example in Overleaf](https://www.sharelatex.com/project/new/template?zipUrl=/project/58a3103d13712fef4e9df25b/download/zip&templateName=Learn%20LaTeX%20in%2020%20minutes:%20Part%2011&compiler=pdflatex)

## 下载你完成的文件

您可以通过从上方的左侧菜单中点击 PDF 下载你完成的 PDF。
还有一个更快的选择就是单击 PDF 查看器上的 `Download PDF`（下载 PDF）按钮，如下所示。

![Downloadpdf.PNG](https://sharelatex-wiki-cdn-671420.c.cdn77.org/learn-scripts/images/6/6c/Downloadpdf.PNG)
