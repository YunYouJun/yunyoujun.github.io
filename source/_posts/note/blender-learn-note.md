---
title: Blender 学习笔记
date: 2019-06-26 10:49:33
updated: 2019-08-11 10:49:33
tags:
  - 学习
  - 笔记
  - Blender
categories:
  - 云游的小笔记
---

[Blender]((https://www.blender.org/)): Free and Open 3D Creation Software.

<!-- more -->

Blender 是一款轻量且自由开源的 3D 创意软件。
3D 软件应接不暇，但若立志进入游戏/动画行业，自然也非得掌握一种不可。
于是我选择了 Blender，当然其中最吸引我的莫过于开源二字。
在对比后，2.8 之后的颜值也是不得不称道的事情。

## Ref

- [ ] [Blender 官方参考手册](https://docs.blender.org/manual/zh-hans/latest/)
- [ ] [Blender 官方中文基础视频 - YouTube](https://www.youtube.com/playlist?list=PLa1F2ddGya_-UvuAqHAksYnB0qL9yWDO6&feature=share)
- [x] [从0开始学习Blender 2.8 | 饼干教育](http://www.bgteach.com/my/course/60)
- [ ] [Blender 学习笔记 - 语雀](https://www.yuque.com/ziguiti/blender)（私货）

### Other Video

- [Blender 创造者谈及它的未来 - bilibili](https://www.bilibili.com/video/av22732936/?spm_id_from=333.788.videocard.0)（充满热情的创造者）

> But I was never interested in money.
> It's not interesting.
> I call myself a maker, I want to make stuff.
> I want to make stuff, that's my passion.
> -- Ton Roosendaal (Blender 之父)

## 常用快捷键

`Windows` 替换 <kbd>⌘</kbd> 为 <kbd>Ctrl</kbd> ，<kbd>⌥</kbd> 为 <kbd>Alt</kbd>即可

Mac:

<kbd>⌘</kbd>: <kbd>Cmd</kbd>
<kbd>⌥</kbd>: <kbd>Option</kbd>
<kbd>⇧</kbd>: <kbd>Shift</kbd>
<kbd>⌃</kbd>: <kbd>Ctrl</kbd>

### 窗口

| 快捷键 | 功能 |
| --- | --- |
| <kbd>T</kbd> | 隐藏左侧工具栏 |
| <kbd>N</kbd> | 显示当前视图相关属性 |
| <kbd>Q</kbd> | Quick Favorites 快捷（键）收藏夹 |
| <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>Space</kbd> | 切换全屏（与 Mac Finder 搜索快捷键冲突） |

### 视图

| 快捷键 | 功能 |
| --- | --- |
| <kbd>⇧</kbd> + 鼠标中键 | 平移视图 |
| <kbd>`</kbd> | 打开视图切换 - 饼菜单 |
| <kbd>⌃</kbd> + <kbd>⌥</kbd> + <kbd>Q</kbd> | 四格视图 |
| (<kbd>⌘</kbd>) <kbd>1</kbd> | 前（后）视图 |
| (<kbd>⌘</kbd>) <kbd>3</kbd> | 右（左）视图 |
| <kbd>7</kbd> | 顶视图 |
| <kbd>9</kbd> | 底视图 |
| <kbd>5</kbd> | 正交透视视图切换 |
| <kbd>0</kbd> | 摄影机视图 |
| <kbd>⌘</kbd> + <kbd>0</kbd> | 将选择的物体设置为激活的摄影机 |
| <kbd>.</kbd> | 最大化选择的物体匹配到视图 |
| <kbd>2/4/6/8</kbd> | 翻转视图 |
| <kbd>⇧</kbd> <kbd>~</kbd> |步行模式|

### 选择

| 快捷键 | 功能 |
| --- | --- |
| <kbd>A</kbd> | 全选 |
| <kbd>B</kbd> | 框选 |
| <kbd>C</kbd> | 绘选 |
| <kbd>⇧</kbd> + <kbd>G</kbd> | Select Grouped (根据物体相同的属性组进行选择) |
| <kbd>⇧</kbd> + <kbd>L</kbd> | Select Linked (根据物体关联的属性组进行选择) |

### 基础操作

| 快捷键 | 功能 |
| --- | --- |
| <kbd>⇧</kbd> + 鼠标右键 | 3D 光标 |
| <kbd>⇧</kbd> <kbd>S</kbd> | 打开 3D 光标菜单 |
| (<kbd>⌥</kbd>) <kbd>R</kbd> | (清除)旋转 |
| (<kbd>⌥</kbd>) <kbd>G</kbd> | (清除)位移 |
| (<kbd>⌥</kbd>) <kbd>S</kbd> | (清除)缩放 |
| <kbd>H</kbd> | 隐藏选择的物体 |
| <kbd>⌥</kbd> + <kbd>H</kbd> | 显示选择的物体 |
| <kbd>⇧</kbd> + <kbd>H</kbd> | 隔离显示选择的物体 |
| <kbd>⇧</kbd> + <kbd>D</kbd> | 复制 |
| <kbd>⌥</kbd> + <kbd>D</kbd> | 关联复制 |
| <kbd>⇧</kbd> + <kbd>R</kbd> | 重复上一次的命令 |

### 物体 Object

| 快捷键 | 功能 |
| --- | --- |
| <kbd>⇧</kbd> + <kbd>A</kbd> | 新建物体 |
| <kbd>⌘</kbd> + <kbd>P</kbd> | 设置父子关系（先子后父） |
| <kbd>⌥</kbd> + <kbd>P</kbd> | 清除父子连接关系|
| <kbd>M</kbd> | Move to Collection |
| <kbd>⌘</kbd> + <kbd>L</kbd> | Make Links... （设置关联，先选关联到后选） |

### 显示

| 快捷键                    | 功能                       |
| ------------------------- | -------------------------- |
| <kbd>⇧</kbd> <kbd>Z</kbd> | 当前模式与线框模式相互切换 |

### 坐标系

| 快捷键        | 功能                       |
| ------------- | -------------------------- |
| <kbd>，</kbd> | 激活 |
| <kbd>，</kbd> | 激活 |

## Nav

### 摄影机视图

进入行走模式： `View > Navigation > Walk Navigation`

## Tips

### 导出

推荐导出 `.abc` 格式。

> [三维文件格式知多少](http://www.bgteach.com/article/132)

...

---

To Be Continued.
