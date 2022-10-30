---
title: char-dust 一个图片转字符画的 npm 包与示例站点
date: 2021-03-13 01:08:46
updated: 2021-03-14 02:51:46
tags:
  - npm
  - ascii
categories:
  - 云游的小项目
katex: true
---

![夹心酱](https://r2.yunyoujun.cn/images/char-dust-jashin.jpg)

如题，它的全部作用就是将图片变成字符画（又称 [ASCII 艺术](https://zh.wikipedia.org/wiki/ASCII%E8%89%BA%E6%9C%AF)）。

- GitHub: <https://github.com/YunYouJun/char-dust/>
- 示例站点: <https://www.yunyoujun.cn/char-dust/>

似乎有些老生常谈，那么为什么会有它的诞生呢？

<!-- more -->

## Why char-dust?

[![npm](https://img.shields.io/npm/v/char-dust)](http://npmjs.com/package/char-dust)

有一部电影叫做[「星尘 Stardust」](https://movie.douban.com/subject/1867335/)，名字挺酷。

- ~~星尘龙（游戏王） Stardust Dragon~~
- ~~星尘斗士（JOJO） Stardust Crusaders~~
- ~~「与星尘握手」 命运石之门~~

字符（char）+ 尘埃（dust）= 字尘（char-dust）

> 「星尘」是恒星死亡时在太空中形成微小颗粒般的固体物质，它们飘散在宇宙中，继续碰撞、凝结，甚至会因此诞生出新的恒星。

是死亡，也是新生。既渺小，又伟大。

我相当喜欢这个名字，也因此将其命名为 `char-dust`。

那么乍看似乎已经有些被玩烂的东西，为啥又要重复造轮子呢？（当然其实最重要的原因在后话里。）

### Features

- 可自定义的图片大小
- 可自定义的字符串
- 线上方便快捷
  - 可自定义缩放 textarea
  - 方便全选复制
- 兼容 node 与 browser 的 npm 包
- TypeScript 类型

```bash
npm install char-dust
```

首先，虽然各类语言都能实现类似的效果，但是想要拿到前端展示，那么必须得用万能的 JavaScript，其次想要使其变成方便使用且带声明的包，就得用无敌的 TypeScript。

> Google 甚至还有一个专门的 repo [gif-for-cli](https://github.com/google/gif-for-cli)。

## 思路

虽然有把过程步骤详细介绍讲解的想法，但苦于杂务繁多，不妨鸽到日后再说（没错，我就是懒）。

思路其实很简单，将图片读到 canvas 上，获取 [ImageData](https://developer.mozilla.org/zh-CN/docs/Web/API/ImageData)，读取像素，通过 RGB 计算出灰度（亮度）。

> RGB 转灰度有一个专门的心理学公式（至于为什么就只能请您移步 [Grayscale](https://en.wikipedia.org/wiki/Grayscale) 了）

$$ R \cdot 0.299 + G \cdot 0.587 + B \cdot 0.114 = Brightness $$

代码写久了，会有一种想要将各功能都抽象的强迫症。专门处理色彩的类库也必然是有的，于是我改为使用 [tinycolor](https://github.com/scttcper/tinycolor) 获取亮度。

拿到亮度后，我们再定义一串字符串来分配给不同的亮度。譬如从暗到亮分别为 `@#&$%863!i1uazvno~;*^+-. `。（当然其他也完全可以）

均分亮度，得到不同等级，根据每个像素分配对于亮度级别的字符即可。

此外，图片很大的时候，对每个像素处理无疑是很慢的，我们可以设置一个字符宽度来跳着处理，间隔的像素则可以忽略，毕竟已经转成字符了，精度早就下降没了。（高度同理）

但我的目的并不是仅仅放到前端展示，我希望它在 node 端也能即时地读取图片并转换。

> 为什么呢，因为我最近打算整一个终端的文字冒险游戏，可能会成为 [ADV 游戏引擎计划](https://www.yunyoujun.cn/posts/make-an-avg-engine/) 的一些试水，而在终端回车显示对话，选项，偶尔用字符串来展示图片应该也会是比较酷的事情，当然这就是他话了。

对于 Node 来说，并没有 `document` 的存在，当然也就没有 `canvas` 的 `ImageData`，但是我们可以通过 [node-canvas](https://github.com/Automattic/node-canvas) 来实现。

node-canvas 是使用 `C++` 原生编写，再打包交由 Node 调用，因此需要安装 [node-pre-gyp](https://www.npmjs.com/package/node-pre-gyp)，而这家伙可以说是「臭名昭著」了，国内的安装速度极为缓慢，还未必成功。

面向用户的产物，不能期望每个人都能成功安装使用它，所以我们应该寻求其他更方便可靠的方式。

我最后找到的方案则是 [jimp](https://github.com/oliver-moran/jimp) + [@canvas/image-data](https://github.com/node-gfx/image-data)。

`jimp` 是纯粹使用 JavaScript 编写的图片处理库，与原生性能的差距也完全可以容忍。

当我们想要在 Node 端运行时，只需要再安装 `jimp` 与 `@canvas/image-data` 便可。
在国内镜像的加持下，也无需担心。

> 既然说到这了，就顺带再打个 nnrm 的广告。[nnrm - 一个极简的 npm/yarn registry 切换管理器](https://www.yunyoujun.cn/posts/nnrm-new-nrm/)

`jimp` 读取图像数据，`@canvas/image-data` 负责将其转化为标准的 `ImageData`，再交给 `char-dust`。

```bash
yarn add jimp @canvas/image-data
```

```typescript
import jimp from "jimp";
import ImageData from "@canvas/image-data";
import { imageToText } from "char-dust";
import { resolve } from "path";

jimp.read(resolve(__dirname, "./cat-of-the-rebellion.jpg")).then((image) => {
  image.scale(5);
  const imageData = new ImageData(
    Uint8ClampedArray.from(image.bitmap.data),
    image.bitmap.width,
    image.bitmap.height
  );

  const text = imageToText(imageData);
  console.log(text);
});
```

万事大吉。

其他则是细节的处理，效率优化，UI 样式，图片缩放，打包，node 端的兼容之类的。

## 实现

![five-year](https://cdn.jsdelivr.net/gh/YunYouJun/cdn/img/meme/five-year.gif)

这其实是我三年前开的坑，🐦，咕咕咕，没错我就是鸽子，但我还是好好地填上了。

![准备迎接夸奖](https://r2.yunyoujun.cn/images/ready-for-compliments.jpg)

所以重构的时候，直接将原先的 `vue2` + `@vue/cli` + `webpack` + `element-ui(2)` 换成了 `vue3` + `vite` + `element-plus(3)`。

看起来好像和 element 还有点不一样？

那是因为我用了独家的极简主题 [element-theme-ink](https://github.com/YunYouJun/element-theme-ink)。

> 也是三年前开的坑，没想到换成 Vue3 + Element3 也还能用，最近用 Vuepress 重写了遍文档，以前的网站还是用 Webpack 搭的。那时 Vuepress 还没诞生，现在却连 Vuepress 都要用 TypeScript 重构了，有种物是人非的感觉。

## 后话

在动工前，我也检索了是否已有满足上述需求的类似产物存在，但很遗憾我并没有发现。

相关性最大且 Star 最多的一个项目是 [jscii](https://github.com/EnotionZ/jscii/issues/9)。

> 早在三年前我提了一个 Issue: [Suggestion: How about packaging it into a library？](https://github.com/EnotionZ/jscii/issues/9)

作者则告诉我这是他六年前写的项目，那时候 npm 还不算个东西。（我的蹩脚翻译）不过他答应说会在关闭 Issue 前 publish 一个包。（但是直到三年后的今天，它还是 Open 的。）

![three-years-ago.jpg](https://i.loli.net/2021/03/13/aqnJHGFcERipIWs.jpg)

三年前的某一天我也曾决定自己尝试实现一下这样的程序，只是最后也和 JSCII 作者一样因鸽子的天性而就此遗忘了。

而直到前几日，我才终于再次将其捡起，并下定决心完成它。

那么这个原因到底是什么呢？大致可以类比于雄性织巢鸟需要建造精美的巢穴用以吸引异性。

所以三年后的我终于完成了它，因为「这是计划的一部分」。

---

只是当我在 VSCode 里勤勤恳恳时，几小时前我尝试安装的 [VSCode 彩虹屁插件](https://github.com/SaekiRaku/vscode-rainbow-fart) 突然蹦出了一句话，「你这么喜欢写代码，一定没有女朋友吧」。

让人不禁潸然泪下。

![别骂了别骂了再骂人要傻了](https://r2.yunyoujun.cn/images/dont-scold-me.jpg)

---

Q.E.D.
