---
title: 旋转吧！徽章！
date: 2021-09-05 21:46:11
updated: 2021-09-19 21:46:11
tags:
  - 蚂蚁森林
  - 徽章
  - 动画
categories:
  - 云游的小笔记
katex: true
---

如何实现一个徽章惯性旋转动画？

> 标题我只能说：懂得都懂。[如何评价「懂的都懂」这句话？｜知乎](https://www.zhihu.com/question/393670234)

## 前言

距离上一次写技术文章过去了多久呢？大概已经屈指不可数了。
与此前相比，无论心境还是境遇也都变化了许多，而我本打算记录的实习生涯还未动笔，便已接近尾声。但愿还有机会一叙。

在家中慵懒地躺了数日，自觉不应继续如此，方翻了个身，决定将此文修整完，以略表奋发之意。
总之，也由衷地希望大家能从中学习到什么或是给我一些更好的改进建议。

那么，……，先旋转起来吧？

<!-- more -->

## 简介

本篇文章原本来自于写「🐜 蚂蚁 🌲 森林 🐒 神奇动物」徽章动画时总结的技术分享，考虑到各种因素，已去除了敏感资源。
并编写了更为抽象（~~高内聚、低耦合~~）的代码作为示例。

- 示例（去除敏感资源）：<https://explosions.yunyoujun.cn/badge-rotation/>
- PPT (slidev): <https://badge-rotation.explosions.yunyoujun.cn/>
  - 一份大致技术流程的分享 Slide
- 简化后可以参考的代码：<https://github.com/YunYouJun/explosions/blob/main/src/pages/badge-rotation/>

~~这也是我离开腾讯后，前去蚂蚁实习做的第一个项目。~~

## 长啥样

那么首先，我们来看看这个动画的效果。

<div class="success">

> 进入 「蚂蚁森林」 左上角 - 点击发现神奇物种（继续点左上角）

</div>

<video src="https://uss.yunyoujun.cn/videos/demo/ant-forest-animal-badge-rotation.mp4" alt="徽章旋转" controls></video>

> 那么我实现了什么？

- 拖动 3D 徽章
- 根据拖动速度展现的惯性动画
- 停止时总是停留在正/反面
- 进入时的晃动动画
- 轻拍晃动效果 👏
- 陀螺仪效果（晃动手机） 📱

尽管这是一个简单的效果，但也同样有着一些细节和需要注意的问题。
接下来将主要就我选取的实现方案和遇到的问题进行分享。

顺便放一个简单的示例（可以直接拖动哦～）：

<iframe style="height: 85vh" src="https://explosions.yunyoujun.cn/badge-rotation"></iframe>

## 我的实现方案

我们的首要任务是实现拖动徽章，松开手后的惯性动画。

而神奇动物中的徽章使用 tiny3d（蚂蚁开源的一个 3D 渲染库 [tiny](http://tinyjs.net/) + tiny-plugin-three） 在 canvas 上渲染的 3D 模型。我们只需要按照帧率改变徽章的旋转角度使其形成动画即可。

> 你问我为什么不用 Three.js？懂得都懂。
> 当然 Three.js 较大，且业务可能存在很多定制需求，这也是一部分原因。

### 如何拖动徽章？

首先，我们至少要保证徽章是可拖动的。
那么我们只需要计算屏幕触摸点横向移动的差值（delta X），按比例赋值给徽章饶 Y 轴旋转的角度（欧拉角 y）。

> So easy? 此时还基本无需考虑动画的问题。因为手指移动是连续的，旋转就是连续的。

```typescript
const deltaX = curPos.x - this.lastPos.x;
model.eulerAngles.y += deltaX;
```

> setInterval VS setTimeout VS requestAnimationFrame

当我们的滑动停止后，徽章仍继续转动，这意味着这应当是一个动画。
在实现动画之前，我们先来考虑一下动画的机制。

> 屏幕的渲染帧率通常是：60fps

<div class="warning">

> 但实际上这里还有个坑，iOS 省电模式下会降低帧率，导致不同情况下表现不一致。反而不如使用 `setInterval` 替代 `requestAnimationFrame`。
> 不过如果你业余写的小玩具用户量并没有达到蚂蚁森林的千万级别，也许还并不需要花心思考虑这些。更简洁才更优雅。

</div>

定时函数 setTimeout(callback, 16) （设置为每 16 ms 执行一次），便可以达到类似的效果。
但是我们还有更为优雅的方式，[requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)。

<div class="info">

> 你准备更新动画时你应该调用此方法。这将使浏览器在下一次重绘之前调用你传入给该方法的动画函数(即你的回调函数)。
> 回调函数执行次数通常是每秒 60 次，与浏览器屏幕刷新次数相匹配。

</div>

### 分析动画

接下来，我们对动画的状态进行一下分解。

- 拖动徽章（此时无需考虑动画、但要避免拖动与惯性动画冲突）
- 手离开屏幕，徽章旋转速度逐渐衰减（需要得知初速度）
- 最终总是停留在正面或是反面（在平面上的不同区间赋予对应方向的加速度）

🤔，可能简短的文字难以描述清楚，我们来看一下具体的实现步骤。

## 详细步骤

事实上，我们将其抽象理解为物理世界中的速度，最后再根据不同阶段计算得出的速度，去算出对应旋转的角度，在每帧渲染时赋值给徽章即可。

### 初速度

惯性动画，意味着徽章本身结束动应当有一个初速度。

<div class="info">

> 牛顿三大定律-第一定律：假若施加于某物体的外力为零，则该物体的运动速度不变（惯性定律）

</div>

好吧，其实和惯性定律关系不大。（~~我只是想放个定律在这里显得高大上一点。~~）
简而言之，我们可以在拖动结束时，即监听 `touchEnd` 时间时赋予徽章一个初速度。

而该初速度可通过手指在屏幕上横向滑动的距离与滑动时间的比值计算而得。

$$ v = \frac{\Delta x}{\Delta t} $$

> Talk is cheap, show me your code.

```typescript
// 创建动画实例，具体实现见后文
const inertiaAnimation = createInertiaAnimation({...})

// 滑动距离
const deltaX =
  e.changedTouches[0].clientX - this.prePos.x;

const touchEndTime = new Date().valueOf();
// 滑动时间
const deltaTime = touchEndTime - touchStartTime;

/**
 * 初始速度，每 ms 旋转速度（设顺时针为正数）
 * deltaX <= 0 为顺时针
 */
let speed = - deltaX / deltaTime;

// 将速度赋予动画实例，播放动画
inertiaAnimation.playAnimation = true;
inertiaAnimation.speed = speed;
inertiaAnimation.run();
```

### 徽章旋转衰减

根据有限的中学物理知识，我们可以有两种方案来模拟衰减。

- 方案 1: 模拟物理重力，使用加速度来计算速度
- 方案 2: 模拟摩擦力，采用摩擦系数一样的衰减系数

我决定采用 `方案 2`，其更简便、更符合逻辑。
譬如，当速度变为相反方向（徽章反着转）这时无需考虑数值的正反，只需乘以衰减系数即可。
此外，加速度模式在之后模拟水平方向上的重力会用到，可以避免两边的逻辑混杂在一起，难以编写。

在经过尝试后，我决定将每帧的衰减系数设定为 0.95。

> `u: 0.95`

```typescript
/**
 * 每一步动画
 * @param {number} timestamp
 */
function step(timestamp) {
  ...
  speed *= u;
  ...
}
```

### 平面重力

速度衰减，意味着徽章最后可能停止在任意角度。但这并不是我们想要的，我们希望它能总是保持正/反面。

![旋转到一半停了](https://uss.yunyoujun.cn/images/badge-rotate-to-middle.jpg)

同样我们可以从物理角度进行思考，在水平面施加一个「重力」，使其总是保持正/反面。
这个重力（加速度）在徽章的左右区间正负是不一样的。

> 假设从徽章顶部看，顺时针方向为正 ，同时我们可以划分为四个区间。

随后从屏幕看向徽章：（徽章的左半部分，且处于靠近屏幕外的位置时，简称为 左半外。）

| 重力范围 | 加速度方向     | 数值 |
| -------- | -------------- | ---- |
| 左半外   | 加速度向屏幕内 | +    |
| 左半内   | 加速度向屏幕外 | -    |
| 右半外   | 加速度向屏幕内 | -    |
| 右半内   | 加速度向屏幕外 | +    |

同时我们需要做一些细节的处理，比如旋转角度大于 180 的时候，负数的时候。
最后给不同旋转区间的角度时的徽章速度赋予不同的加速度。

> 经过尝试后，我决定将水平重力影响系数设置为 0.008。`gravity: 0.008`

```typescript
// 一些乱七八糟的取余处理（因为会大于 180 嘛）
const remainder = getRotation() % 180;
const positiveRemainder = remainder < 0 ? remainder + 180 : remainder;

if (positiveRemainder >= 90 && positiveRemainder < 180) {
  speed -= gravity;
} else if (positiveRemainder > 0 && positiveRemainder < 90) {
  speed += gravity;
}
```

### 如何停止

速度配合水平面的重力加速度，并根据衰减系数逐渐衰减，数字尽管越来越小，但其仍旧是浮点数。

> 正所谓，「日取其半，万世不竭」。——《庄子》

因此我们需要明确徽章趋近于静止时的一个界限（可以被忽略的参数大小）。

- `toleratedSpeed`: 0.001 可以被忽略的速度
- `toleratedAngle`: 5 可以被忽略的角度

此外，拖拽时会与加速度动画、以及后续的陀螺仪动画产生冲突，我们需要通过状态来使得他们互相独立。

`_this.playAnimation` 是否允许播放动画（外部可修改，来决定是否允许播放动画）
`_this.isPlaying` 记录状态，是否正在播放动画（仅用来记录内部是否正在播放的状态）

```typescript
function step(timestamp) {
  // 继续播放动画的条件（需要避免和后续的陀螺仪/拖动等冲突）
  if (
    _this.playAnimation &&
    (Math.abs(speed) > toleratedSpeed ||
      (positiveRemainder > toleratedAngel
      && positiveRemainder < 180 - toleratedAngel))
  ) {
    // 记录是否正在播放动画
    _this.isPlaying = true;

    ...
    // 根据时间和速度，计算每一帧徽章应该旋转的角度
    const deltaRotation = speed * elapsed;
    setRotation(deltaRotation);
    ...
    // 继续播放动画
    window.requestAnimationFrame(step);
  } else {
    _this.isPlaying = false;
  }
}
```

### 抽象函数

到这里，功能便实现的差不多了，但我们仍旧可以对代码进一步进行优化。

- 使用 TypeScript 编写（增强类型提示）
- 抽象出可配置的参数
- 函数内部默认提供默认参数

```typescript
export interface InertiaAnimationOptions {
  /**
   * 初速度
   */
  speed?: number;
  /**
   * 水平重力影响系数
   */
  gravity?: number;
  /**
   * 衰减系数
   */
  u?: number;
  /**
   * 最后可忽略的速度
   */
  toleratedSpeed?: 0.0005;
  /**
   * 最后可忽略的角度
   */
  toleratedAngel?: 3;
  /**
   * 获取旋转角度
   */
  getRotation?: () => number;
  /**
   * 设置旋转角度
   */
  setRotation?: (deltaRotation: number) => void;
}
```

- 函数式而非 Class（有一定争议，但 react 后来的 hooks 和 vue 的 createXXX 很明显都更加青睐函数）
  - `createInertiaAnimation`

```typescript
/**
 * 创建旋转惯性动画
 *
 * @param {*} options
 * @param {Function} callback 回调函数 设置状态
 */
export function createInertiaAnimation(
  options: InertiaAnimationOptions
) {
  return {
    ...
  }
}
```

### 可复用

还有什么可以优化的点？
此处动画的应用场景是 3D 模型，但倘若是换为图片、DOM？

> 譬如 CSS 编写而成的立体徽章，CSS 原教旨主义
> 示例：<https://explosions.yunyoujun.cn/badge-rotation/>
> 使用 TypeScript + VueUse + CSS + createInertiaAnimation 搭建，顺便给 Vususe 中 swipe 缺失的 `touchcancel` 事件提了个 PR。

我们还可以进一步解耦，允许用户（开发者）可以任意自定义旋转方式。
暴露两个可以控制 rotation 的方法。

- `setRotation`: 设置旋转角度 `transform: rotateY(${val}deg)`
- `getRotation`: 获取旋转角度 `getComputedStyle`

```typescript
// 创建动画实例
const inertiaAnimation = createInertiaAnimation({
  speed: 0.2,
  getRotation() {
    return rotateY.value;
  },
  setRotation(deltaRotation) {
    rotateY.value -= deltaRotation;
  },
});
```

### 最后一公里

事实上，交给我的徽章动画工作的确到这里就结束了。
但是真的结束了吗？我们还可以自己尝试继续加一点点优化，细节决定成败。

#### 初始晃动效果

> 用户打开徽章时，进行缓动，让用户知道它是可拖动的。此外这可以和此后的惯性动画共用一个实例，仅需赋予一个开始的初速度，即可快速实现。（也体现了此前优化封装的好处）

```typescript
const inertiaAnimation = createInertiaAnimation();
...
game.run(options, () => {
  inertiaAnimation.playAnimation = true;
  // 赋予一个微小的初速度，并播放动画
  inertiaAnimation.speed = 0.2;
  inertiaAnimation.run();
})
```

#### 轻拍晃动

> 原本的初速度是根据移动距离和时间计算的，那么用户仅仅想拍一下徽章呢？
> 这时没有反馈是不大好的，且较小数值的移动距离和时间，容易出现边界计算的问题。
> 当移动距离和时间小于一定数值时触发，并判断为左侧还是右侧。（同样公用一个动画实例，仅需赋予一个初速度，即可快速实现。）

```typescript
// 轻拍
const tapSpeed = 0.3;
if (Math.abs(deltaX) < 5 && deltaTime < 200) {
  const pageWidth = document.documentElement.clientWidth;
  speed = this.prePos.x > pageWidth / 2 ? -tapSpeed : tapSpeed;
}
```

#### 陀螺仪

> 用户微微晃动手机，徽章总是面向用户，也是增强体验不错的方式。
> 但也存在一些小问题... 🐛

- 与惯性动画冲突造成抖动
  - 通过各类状态判断，当用户在拖动、仍在播放惯性动画时，陀螺仪效果不生效（与拖动和惯性动画之间的冲突处理逻辑类似）
- 陀螺仪因为用户初始拿的位置便具有数值（应当使用相对数值）
- 超过 90 度会突变为负数 `90 -> -89`
- 数值频率变化敏感
  - 通过相对计算，并进行缓动，过大变化时舍去
- 网页 API `deviceorientation` iOS 兼容问题

```typescript
window.addEventListener("deviceorientation", (event) => {
  ...
  // gamma: 从左到右
  let deltaGamma = event.gamma - this.lastGamma;
  ...
}, true);
```

> 查询 [DeviceOrientationEvent API | Can I use](https://caniuse.com/mdn-api_deviceorientationevent) 其实可以发现 iOS 网页的这个事件有兼容问题。
> 平时只能自求多福了。（支付宝的话则可以调用其自身的原生 API）

## 总结

至此，一个完整的徽章旋转动画，便算告一段落了。
后续，我们甚至还可以进一步将其封装为一个 npm 包 [`@explosions/badge-rotation`](https://www.npmjs.com/package/@explosions/badge-rotation)，通过导入的方式来快速使用它。

> 我在 npm 上建立了一个 [explosions](https://www.npmjs.com/settings/explosions/packages) 的 org，打算在这个 scope 下发些有趣的动效。
> 如果你也有些想法和兴趣，可以到[这里](https://github.com/YunYouJun/explosions)来点 PR 或 Issue。

```bash
npm install @explosions/badge-rotation
```

```typescript
import { createInertiaAnimation } from "@explosions/badge-rotation";
const inertiaAnimation = createInertiaAnimation();
```

以上便是我在实现过程中的一些方案、问题与思考，从零开始去尝试如何实现是一件很有趣的事情，但想必也一定存在更优雅的方案和优化，所以有任何建议也欢迎给我留言。谢谢！

下次再有什么有趣的事情时候见！

---

Q.E.D.
