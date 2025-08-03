---
title: 写写高斯模糊——从 CSS 模糊滤镜的白边说起
date: 2020-10-18 22:04:45
updated: 2020-10-22 22:04:45
katex: true
tags:
  - 高斯模糊
  - Canvas
  - CSS
categories:
  - 云游的小笔记
---

## 前言

通常我们可以很容易地使用 PhotoShop 中的「高斯模糊」来模糊图片。

这也是一种很好的艺术效果，苹果惯用的毛玻璃效果本质便是高斯模糊，而我们将图片模糊后作为网站背景，既减小了图片的体积，也能别有一番风味。（譬如咱站点的背景也是高斯模糊后的产物。）

![Gaussian Blur | Photoshop](https://cos.yunle.fun/images/photoshop-gaussian-blur.jpg)

而 CSS3 提供了滤镜 [filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter)/[backdrop-filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/backdrop-filter)，其中的模糊功能同样也是高斯模糊。（Canvas 中的 [filter](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/filter) 亦是如此。）

只是当我们为图片背景添加 CSS 滤镜时，便会出现不和谐的白边。

虽然有一些奇技淫巧（比如放大图片再截去模糊的边）去解决，但皆治标不治本，我们不妨借此机会探究一下高斯模糊，并尝试自己实现它。

正文**多图预警**

<!-- more -->

## 简介

高斯模糊看一下[维基百科](https://zh.wikipedia.org/wiki/%E9%AB%98%E6%96%AF%E6%A8%A1%E7%B3%8A)便能了解个一二。不过中文维基百科相比英文百科漏了几条简介。

高斯（Carl Friedrich Gauss），没错，就是我们平常知道的那位高斯，是历史上最为知名、最为重要的数学家之一。而高斯模糊本身并非由它提出，而是这个算法本身使用了高斯分布（也就是概率论中的[正态分布](https://zh.wikipedia.org/wiki/%E6%AD%A3%E6%80%81%E5%88%86%E5%B8%83)）。

$$ {\displaystyle f(x)={\frac {1}{\sigma {\sqrt {2\pi }}}}e^{-{\frac {\left(x-\mu \right)^{2}}{2\sigma ^{2}}}}} $$

> 看到公式不要怕，我们只要会用它。

不过，高斯分布也并非由高斯提出，其最先由德国的数学家和天文学家棣莫弗（Abraham de Moivre）于 1733 年首次提出，而高斯最先将其应用于了天文学研究，影响深远。

## 实验

对了，咱前面提到图片体积可以压缩得更小。嘛，虽然是理所当然的事情，但是本着严谨起见，还是用数据说话。

同一张图片模糊前后，并使用 [Squoosh](https://squoosh.app/) 压缩。

![模糊后](https://cos.yunle.fun/images/a-image-after-blur.jpg)_589\*600 blur:30px 模糊后 7.15KB_

![模糊前](https://cos.yunle.fun/images/a-image-before-blur.jpg)_589\*600 模糊前 29.71KB_

此外，CSS 滤镜本身还是挺占性能的（Safari 好像优化的更好一些？），之前写[主题](https://github.com/YunYouJun/hexo-theme-yun)尝试加了一堆模糊效果，虽然挺好看的，但是发现风扇嗡嗡响，最终还是忍痛割爱。

不过还有件神奇的事情。🤔️ Photoshop 处理的图片为什么就没有白边呢？

（后两张是网页中的效果，你可能会发现后者比 PhotoShop 模糊的厉害，单纯因为我在网页中缩小了图片再模糊以方便截图。本质效果是一样的。）

> 红色边框是原本图片所在的范围。

![原图](https://cos.yunle.fun/images/blur-source-image.jpg)_原图_

![Photoshop 高斯模糊 30px](https://cos.yunle.fun/images/photoshop-gaussian-blur-30px.jpg)_2419\*1209 Photoshop 高斯模糊 30px_

![CSS filter 白色背景](https://cos.yunle.fun/images/css-filter-white-30px.jpg)_1119\*559 CSS filter 高斯模糊 30px 白色背景_

![CSS filter 黑色背景](https://cos.yunle.fun/images/css-filter-black-30px.jpg)_1119\*559 CSS filter 高斯模糊 30px 黑色背景_

我们可以发现 CSS filter 模糊后的边界，准确来说并不是白边。而是透明的，我们应当叫它透明边或者 Alpha 边更为合适。

## 猜测

高斯模糊本质是根据设定的模糊范围（30px 便是模糊半径为 30 像素），随后根据正态（高斯）分布计算出一个权重矩阵，因为要保证权重之和为 1，所以再进行归一化，再将其放到图片进行计算（将图片中的一个像素以及其模糊半径中的像素进行加权求和）得到模糊后的像素。（彩色图片则 RGB 三通道分别计算，带 Alpha 通道同理。）

所以我们可以大胆的猜测，在模糊的过程中，浏览器应该是把周围缺少的像素补足为完全透明的像素来计算高斯模糊。

而 Photoshop 则可能只将附近有的像素参与加权平均、或是将周边的像素翻转过去或者采用了什么更为神奇高端的算法猜测弥补了图片以进行高斯模糊。（因为看不到源码，所以只能猜猜了。）

## 实践

我们不妨自己来实现一下（直接用 HTML5 的 Canvas 比较方便），看看是否能达成相似的效果。

计算过程中，免不了要写一些运算。譬如将高斯分布得到的权重矩阵，和模糊半径构成的像素矩阵进行点乘，最后求和，得到模糊后的像素。虽然遍历的时候就顺带求和更迅速，不过拆分成点乘和求和，更方便理解一些，也能使用一下现成的库。

> [Matrix math for the web](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Matrix_math_for_the_web)

- [mathjs](https://github.com/josdejong/mathjs): JavaScript 数学扩展库
- [gl-matrix](https://github.com/toji/gl-matrix): （MDN 上钦点的）高性能 WebGL 应用程序的 Javascript 矩阵和矢量库（不过看起来原生支持优化了 2/3/4 维矩阵，主要用于 WebGL，但是我们模糊时的矩阵维数根据模糊半径可能很大，所以应该用不到。~~至于拆分矩阵，不如直接写完整的矩阵更易于理解和实现~~）

### 高斯矩阵

每次都去计算高斯分布显然是不合理的，所以我们应该先根据模糊半径算出一个权重矩阵，后续直接用来计算即可。

从维基百科偷一个高斯矩阵（σ = 0.84089642）7\*7 示例：

|            |            |            |            |            |            |            |
| ---------- | ---------- | ---------- | ---------- | ---------- | ---------- | ---------- |
| 0.00000067 | 0.00002292 | 0.00019117 | 0.00038771 | 0.00019117 | 0.00002292 | 0.00000067 |
| 0.00002292 | 0.00078633 | 0.00655965 | 0.01330373 | 0.00655965 | 0.00078633 | 0.00002292 |
| 0.00019117 | 0.00655965 | 0.05472157 | 0.11098164 | 0.05472157 | 0.00655965 | 0.00019117 |
| 0.00038771 | 0.01330373 | 0.11098164 | 0.22508352 | 0.11098164 | 0.01330373 | 0.00038771 |
| 0.00019117 | 0.00655965 | 0.05472157 | 0.11098164 | 0.05472157 | 0.00655965 | 0.00019117 |
| 0.00002292 | 0.00078633 | 0.00655965 | 0.01330373 | 0.00655965 | 0.00078633 | 0.00002292 |
| 0.00000067 | 0.00002292 | 0.00019117 | 0.00038771 | 0.00019117 | 0.00002292 | 0.00000067 |

一维正态分布：

$$ {\displaystyle f(x)={\frac {1}{\sigma {\sqrt {2\pi }}}}e^{-{\frac {\left(x-\mu \right)^{2}}{2\sigma ^{2}}}}} $$

> μ 是 x 的均值，$σ^2$ 是 x 的方差。记作 $X \sim N(μ,σ^2)$。

因为我们使用中心点作为原点，那么均值 μ 便取 0。（取 1 的时候便是标准正态分布。）
但看了好多文章（发现很多最后都是抄自阮一峰的那篇……），都是直接假定 σ 为某一个数值，却没有说明原因。

而 OpenCV 源码中则当没有设置 σ 或 σ 不合法时，按照 $σ=0.3*((ksize-1)*0.5-1)+0.8$ 计算得出。而这个 ksize 正是中心点像素及周边像素的矩阵的尺寸，即 2\*模糊半径+1。（OpenCV 文档中也说明其应当是一个奇数，印证了这一观点。）

> [getGaussianKernel()](https://docs.opencv.org/master/d4/d86/group__imgproc__filter.html#gac05a120c1ae92a6060dd0db190a61afa)

N 维空间正态分布方程：

$$ G(r) = \frac{1}{\sqrt{2\pi \sigma^2}^N} e^{-r^2/(2 \sigma^2)} $$

二维空间中的高斯分布：

$$ G(u,v) = \frac{1}{2\pi \sigma^2} e^{-(u^2 + v^2)/(2 \sigma^2)} $$

> $$ r^2 = u^2 + v^2 $$

---

> 理论上来讲，图像中每点的分布都不为零，这也就是说每个像素的计算都需要包含整幅图像。在实际应用中，在计算高斯函数的离散近似时，在大概 3σ 距离之外的像素都可以看作不起作用，这些像素的计算也就可以忽略。通常，图像处理程序只需要计算 $(6 \sigma + 1) \times (6 \sigma + 1)$ 的矩阵就可以保证相关像素影响。对于边界上的点，通常采用复制周围的点到另一面再进行加权平均运算。 ——摘自维基百科

设「模糊半径」为 `r`，$\sigma=0.3*(r - 1)+0.8$ 这么取应当便是为了避免计算一些几乎无用的数值。

> 对一幅图像进行多次连续高斯模糊的效果与一次更大的高斯模糊可以产生同样的效果，大的高斯模糊的半径是所用多个高斯模糊半径平方和的平方根。例如，使用半径分别为 6 和 8 的两次高斯模糊变换得到的效果等同于一次半径为 10 的高斯模糊效果，$\sqrt{6\times6 + 8\times8} = 10$ 。根据这个关系，使用多个连续较小的高斯模糊处理不会比单个高斯较大处理时间要少。

此外因为缩小矩阵多次处理并不会减少处理时间，我们就直接上手吧！

TypeScript 代码：

```typescript
// 用了里面的矩阵（虽然自己遍历也行）
import * as math from 'mathjs'
/**
 * 计算高斯权重数值
 * @param x X坐标
 * @param y Y坐标
 * @param sigma
 */
function calculateGaussianWeight(x: number, y: number, sigma: number) {
  const PI = Math.PI
  // 方差
  const variance = sigma * sigma
  const weight
    = (1 / (2 * PI * variance)) * Math.exp(-(x * x + y * y) / (2 * variance))
  return weight
}

/**
 * 生成高斯矩阵
 * @param radius 模糊半径
 * @param sigma σ 0.3*(radius - 1)+0.8
 */
export function generateGaussianMatrix(radius: number, sigma?: number) {
  if (!sigma) {
    sigma = 0.3 * (radius - 1) + 0.8
  }

  // 矩阵尺寸
  const mSize = radius * 2 + 1
  let gMatrix = math.matrix(math.ones(mSize, mSize))

  gMatrix.forEach((val, index) => {
    const x = index[0] - radius
    const y = index[1] - radius
    gMatrix.set(index as any, calculateGaussianWeight(x, y, sigma))
  })

  gMatrix = normalization(gMatrix)
  return gMatrix
}
```

### 归一化

```typescript
/**
 * 归一化
 * @param matrix
 */
function normalization(matrix: math.Matrix) {
  const sum = math.sum(matrix)
  return math.divide(matrix, sum) as math.Matrix
}
```

### 高斯加权求和

[Uint8ClampedArray](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray): 类型化数组表示一个由值固定在 0-255 区间的 8 位无符号整型组成的数组；如果你指定一个在 [0,255] 区间外的值，它将被替换为 0 或 255；如果你指定一个非整数，那么它将被设置为最接近它的整数。

```typescript
export function blur(
  imageData: ImageData,
  width: number,
  height: number,
  options: BlurOptions
) {
  const data = imageData.data
  const originData = new Uint8ClampedArray(imageData.data)

  /**
   * 获取像素
   * @param x
   * @param y
   */
  function getPixel(x: number, y: number) {
    if (x < 0 || x >= height || y < 0 || y >= width) {
      return [0, 0, 0, 0]
    }
    else {
      const p = (x * width + y) * 4
      return originData.subarray(p, p + 4)
    }
  }

  const gMatrix = generateGaussianMatrix(
    options.radius,
    options.sigma ? options.sigma : null
  )

  const radius = options.radius

  let i = 0
  for (let x = 0; x < height; x++) {
    for (let y = 0; y < width; y++) {
      let r = 0
      let g = 0
      let b = 0
      let a = 0
      gMatrix.forEach((val, index) => {
        const dx = index[0] - radius
        const dy = index[1] - radius

        const pixel = getPixel(x + dx, y + dy)
        r += val * pixel[0]
        g += val * pixel[1]
        b += val * pixel[2]
        a += val * pixel[3]
      })
      data.set([r, g, b, a], i)
      i += 4
    }
  }
  return imageData
}
```

遍历图片中的每个像素，并按照高斯权重矩阵进行计算。绘制出计算后的图像。

好，收工。

- 完整示例代码见 [gaussian-blur](https://github.com/YunYouJun/gaussian-blur)
- 在线地址见：[Gaussian Blur Demo](https://www.yunyoujun.cn/gaussian-blur/)

![gaussian-blur-30px-137007ms](https://cos.yunle.fun/images/gaussian-blur-30px-137007ms.jpg)

emmm，可是速度很慢，1119\*559 模糊半径 30px 便花了足足 137007ms。（MacBook Pro 15-inch 2019）

### 优化？

本来没打算有这个环节，但是发现纯粹按照高斯模糊本身的思路来写，实在是慢到不可思议。

我们来寻找是否有更迅速的方案达成类似的效果。

首先这个高斯矩阵是根据坐标来进行计算的，所以左上、左下、右上、右下的数值翻转后其实是完全一样的。
所以这期间每个像素有很多重复计算可以缓存下来以优化。（但是因为太懒，我就不写来……）

看到 [基于 Canvas 实现的高斯模糊](https://zhuanlan.zhihu.com/p/98356516) 提到可以将高斯模糊使用一维的高斯函数分别对 x 和 y 轴进行运算以优化速度，但仍旧还是有点慢的。

此外还可以缩小图片、间隔指定数量的像素去计算等。

而在 CodePen 上发现了一个 [canvas Blur](https://codepen.io/zhaojun/pen/zZmRQe) 几乎可以立即实现类似的效果。

其代码也不复杂，我们可以继续稍微优化一下。（其实就是改成先把矩阵算出来。）

```typescript
// 复用计算高斯权重的函数
import { calculateGaussianWeight } from './index'

export class Blur {
  radius: number
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  constructor(options: BlurOptions) {
    this.radius = options.radius || 3
  }

  initCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
  }

  gaussianBlur() {
    const radius = this.radius
    const canvas = this.canvas
    const ctx = this.ctx

    // 矩阵尺寸
    const mSize = radius * 2 + 1
    const gMatrix = math.matrix(math.ones(mSize, mSize))

    let sum = 0
    const sigma = 0.3 * (radius - 1) + 0.8
    const step = radius < 3 ? 1 : 2

    // 跳着计算出高斯权重（所以总和不一样）
    for (let y = -radius; y <= radius; y += step) {
      for (let x = -radius; x <= radius; x += step) {
        const weight = calculateGaussianWeight(x, y, sigma)
        gMatrix.set([x + radius, y + radius], weight)
        sum += weight
      }
    }

    // 绘制不同透明度的原图，并偏移不同位置，叠加到原图上。
    for (let y = -radius; y <= radius; y += step) {
      for (let x = -radius; x <= radius; x += step) {
        ctx.globalAlpha
          = (gMatrix.get([x + radius, y + radius]) / sum) * radius
        ctx.drawImage(canvas, x, y)
      }
    }

    ctx.globalAlpha = 1
  }
}
```

![Gaussian Blur Demo](https://cos.yunle.fun/images/gaussian-blur-demo.jpg)

很神奇地也能实现类似效果，但模糊程度还是略有不同的。（可以看到 Canvas 的高斯模糊也是有白边的。）

![Fast Gaussian Blur 100px](https://cos.yunle.fun/images/fast-gaussian-blur-100px-1043ms.jpg)_100px 1043ms_

不过好像有点玻璃上有水滴流下来的那种感觉。

## 结论

当然本质上，我们使用浏览器 Canvas 中 filter 的模糊要更快。（而 CSS 的 filter 白边问题我们仍旧无法从底层解决。）

最后一种方法可以迅速获得还不错的模糊效果，并消除所谓的白边。（而原生的高斯模糊算法在没有优化的情况下则完全不能用于生产。）

## Reference

- [Gaussian blur | WIKIPEDIA](https://en.wikipedia.org/wiki/Gaussian_blur)
- [高斯模糊的算法 | 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2012/11/gaussian_blur.html)

## 后话

虽然起初想着实现起来应该不会太难，但仍旧粗心大意踩了些坑，也花了不少的时间。希望也能帮助大家加深一些理解吧。
难得水了一篇技术类文章，因为堆积的其他事务比较多，超出了自己预想的时间，最后有点草草结尾，还请见谅。
如有谬误，欢迎指正。

---

Q.E.D.
