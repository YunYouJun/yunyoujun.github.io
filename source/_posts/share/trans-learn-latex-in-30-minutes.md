---
title: 【译】30分钟学会 LaTeX
date: 2019-10-28 16:02:36
updated: 2019-10-28 16:02:36
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
不过到您完成时，您将会已经编写了您的第一个LaTeX文档，并且如果顺利的话，您将能够对 LaTeX 提供的一些基本功能有很好地了解。

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

![Firstdocsmall.PNG](https://cdn.overleaf.com/learn-scripts/images/0/01/Firstdocsmall.PNG)

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

<!-- 可以在标题命令的大括号内在作者的姓名之后添加此名称。它将在括号内添加上标和脚注以及文本。
如果您需要在文章中感谢一个机构，该功能将非常有用。 -->

## 添加注释

---

To Be Continued.
