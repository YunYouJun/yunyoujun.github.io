---
title: Color Dust
date: 2020-06-23 16:27:24
updated: 2020-06-23 16:27:24
layout: slide
slide:
  theme: white
  config:
    history: true
    mouseWheel: true
---

<link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet">

<!-- 6-最后一节课讲解数据来源，数据质量，数据清洗过程，实现细节，创意设计，可以准备 PPT，互评打分（给每个同学打分，不给自己和同组的同学打分，60%分值） -->

## Color Dust

![color.svg](https://www.yunyoujun.cn/color-dust/color.svg)

<small>
色尘，佛教语。“六尘”之一。

即眼根（视觉）所触及的尘境。
</small>

---

> 色尘知有数，劫烬岂无年。  
> —— 唐·李绅《题法华寺》

---

## 数据来源

<i class="ri-image-line" style="font-size: 6rem;"></i>

~~

## 图片即数据

> 像素 =>
> <span style="color:red">R</span> <span style="color:green">G</span> <span style="color:blue">B</span>

### <i class="ri-file-upload-line"></i>

```js
new FileReader();
```

### <i class="ri-links-line"></i>

```js
new XMLHttpRequest();
```

Note: 图片便是数据的一种表现形式，一张图片往往相比文本蕴藏着海量的数据。通过上传文件或链接去请求加载图片。

~~

## 随机图片

<i class="ri-gallery-line"></i>

测试数据，在线切换

Note: 我也准备了一些随机图片，届时可以点击切换效果。

---

## 数据清洗

<i class="ri-drop-line" style="font-size: 6rem;"></i>

~~

### Canvas 图片像素

```js
...
for (let row = 1; row < imageData.height - 1; ) {
  for (let col = 1; col < imageData.width - 1; ) {
    r = imageData.data[row * imageData.width * 4 + col * 4]
    g = imageData.data[row * imageData.width * 4 + col * 4 + 1]
    b = imageData.data[row * imageData.width * 4 + col * 4 + 2]
    hsl = rgbToHsl(r, g, b)
    ...
  }
}
```

RGB <i class="ri-arrow-left-right-line"></i> HSL

H 色相、S 饱和度、L 明度

Note: 使用 Canvas 读取图片像素，便可以获得 RGB 的信息，我们可以再将其转换为 HSL 以供后续使用。

~~

## <i class="ri-contrast-drop-line"></i>

忽略太亮/太暗

```js
if (hsl[2] > 97 || (hsl[2] > 95 && hsl[1] < 30)) {
  col += pixelStep;
  continue; // too bright
}
if (hsl[2] < 3 || (hsl[2] < 5 && hsl[1] < 30)) {
  col += pixelStep;
  continue; // too dark
}
```

Note: 照盘全收没有必要，去除无用的信息。

~~

## K-Means

K = 6

挑选 K 个初始种子（忽略差距过小的颜色）

<i class="ri-seedling-line"></i>

```js
for (j = 0; j < l; j++) {
  const hDiff = Math.abs(initSeed[j].h - color.h);
  const sDiff = Math.abs(initSeed[j].s - color.s);
  const lDiff = Math.abs(initSeed[j].l - color.l);
  if (hDiff + sDiff + lDiff < 45) {
    break;
  }
}
```

Note: 我这里并没有使用相关的类库，这有利于进行更加细粒化的操作。开始记录相关信息（迭代次数、时间、颜色数量）

~~

## 分类

<i class="ri-leaf-line"></i>

```js
while (len--) {
  const distance =
    Math.abs(classes[len].h - color.h) +
    Math.abs(classes[len].s - color.s) +
    Math.abs(classes[len].l - color.l);
  if (distance < min) {
    min = distance;
    minIndex = len;
  }
}
// 颜色所属的类别
color.category = minIndex;
```

与某一个种子距离最小

Note: 遍历像素，将其不断划分到初始种子的相关类别。

~~

## 性能优化

<i class="ri-flask-line"></i>

HEX 作为 key 会很慢（实测）

```js
hKey = Math.floor(hsl[0] / 10) * 10000;
sKey = Math.floor(hsl[1] / 5) * 100;
lKey = Math.floor(hsl[2] / 5);
key = hKey + sKey + lKey;
```

使用 HSL 计算为整型索引

Note: 差异明显

~~

## [达夫设备](https://zh.wikipedia.org/wiki/%E8%BE%BE%E5%A4%AB%E8%AE%BE%E5%A4%87)

<i class="ri-thumb-up-line"></i>

串行复制数据，每次迭代可赋值八次

```js
while (count--) {
  this.classifyColor(colors[--len], seeds);
  this.classifyColor(colors[--len], seeds);
  this.classifyColor(colors[--len], seeds);
  this.classifyColor(colors[--len], seeds);
  this.classifyColor(colors[--len], seeds);
  this.classifyColor(colors[--len], seeds);
  this.classifyColor(colors[--len], seeds);
  this.classifyColor(colors[--len], seeds);
}
```

Note: 最早是 C 语言上用的。色彩像素很多，达夫设备在少量数据时并没有什么效果，但大量数据处理时的确有性能提升。

~~

## K-Means 信息

### <i class="ri-node-tree"></i>

- 记录过滤后的颜色 HSL RGB HEX
- 所属分类
- 按数量排序
- 迭代次数与花费时间
- 主色、平均色

<i class="ri-information-line"></i>
<i class="ri-folder-4-line"></i>
<i class="ri-sort-desc"></i>
<i class="ri-timer-line"></i>
<i class="ri-numbers-line"></i>

Note: HEX（十六进制颜色代码）、主色排名前三的色彩

~~

## 新的种子

### <i class="ri-seedling-line"></i>

```js
const flag = hslCount.every((ele, index) => {
  return (
    Math.abs(ele.h - seeds[index].h) < 0.5 &&
    Math.abs(ele.s - seeds[index].s) < 0.5 &&
    Math.abs(ele.l - seeds[index].l) < 0.5
  );
});
...
```

计算真正的聚类种子

（聚类中附近的颜色差值最小）

---

## 数据可视化

开始

<i class="ri-play-line"></i>

Note: 想要的数据都拿到了，那么数据可视化开始。集中在一个页面，对同一数据源的不同表现形式。

~~

## K-Means 生成的簇色彩

<i class="ri-palette-line"></i>

可自由调节种子数量

（太多影响性能）

Note: 也就是刚刚最后生成的新种子

~~

## 主色

<i class="ri-home-line"></i>

取数量前三色彩生成渐变条

```js
background() {
  if (this.colors.length > 1) {
    let linearGradient = 'linear-gradient(to right'
    this.colors.forEach((color) => {
      linearGradient += ',' + color
    })
    linearGradient += ')'
    return {
      background: linearGradient,
    }
  } else {
    ...
  }
}
```

~~

## 平均色

<i class="ri-calculator-line"></i>

各色彩 RGB 数平均

```js
this.averageColor = rgbToHex({
  r: Math.floor(rCount / fCount),
  g: Math.floor(gCount / fCount),
  b: Math.floor(bCount / fCount),
});
```

~~

## 绑定网站前后背景色

Vue.js + Nuxt.js + Vuex + Vuetify

存储状态树 + CSS 变量

<i class="ri-vuejs-line"></i>
<i class="ri-css3-line"></i>

可切换亮暗/可交换前后背景色

<i class="ri-contrast-drop-line"></i>
<i class="ri-swap-line"></i>

平均色 => 主色调 ｜ 色彩量最多 => 强调色

~~

## 数据信息

- 色彩数量
- 提取颜色花费时间
- 迭代次数与 K-Means 算法时间
- 色彩占比

<i class="ri-numbers-line"></i>
<i class="ri-timer-line"></i>
<i class="ri-calculator-line"></i>
<i class="ri-percent-line"></i>

~~

## 直方图

### <i class="ri-bar-chart-2-line"></i>

色彩数量与颜色十六进制

自由设置绘制数量

（按照色彩总数排序）

Note: 直方条不留间隙，更方便颜色对比。

~~

## 饼图

### <i class="ri-pie-chart-line"></i>

色彩数量占比（灰色代表剩余色彩）

自由设置绘制数量

（按照色彩总数排序）

~~

## 力导向图

<i class="ri-links-line"></i>

最初的聚类中心点与相关聚类色彩

Note: 意外的效果很不错

~~

## 词云

<i class="ri-file-word-line"></i>

十六进制颜色代码与对应颜色

（根据最大最小缩放比例）

点击复制颜色代码

<i class="ri-clipboard-line"></i>
<i class="ri-code-line"></i>

~~

## 气泡图

<i class="ri-bubble-chart-line"></i>

各色彩气泡

（根据最大最小缩放比例）

可切换刷新

点击复制颜色代码

<i class="ri-clipboard-line"></i>
<i class="ri-code-line"></i>

---

## 这就结束了

<i class="ri-question-mark"></i>

<i class="ri-stop-circle-line"></i>

### NO

---

## 最后一公里

<i class="ri-run-line"></i>

细节决定成败

> 故不积跬步，无以至千里；  
> 不积小流，无以成江海。  
> —— 荀子 「劝学」

~~

## 调色盘

<i class="ri-palette-line"></i>
<i class="ri-bookmark-line"></i>

在画布上绘制图片与聚类色彩

<i class="ri-download-2-line"></i>

~~

## 亮暗判断

<i class="ri-contrast-line"></i>

灰度计算

```js
function isDark(color) {
  color = hexToRgb(color);
  return color.r * 0.299 + color.g * 0.578 + color.b * 0.114 <= 192;
}
```

文字切换相反色

~~

## 国际化

<i class="ri-translate-2"></i>

中英翻译

多图标少文字

~~

## 提示信息

<i class="ri-chat-check-line" style="color:#4CAF50"></i>
<i class="ri-chat-delete-line" style="color:#F44336"></i>

点击复制直接色彩时，显示色彩提示信息

未上传图片、链接时提示对应信息

阴影与背景区分

加载条

<i class="ri-loader-line"></i>

...

~~

## 配色字体

<i class="ri-palette-line"></i>
<i class="ri-font-color"></i>

统一左边框卡片风格、多彩配色

等宽字体 `Source Code Pro`，数字字母宽度一致

阴影与背景区分

<i class="ri-character-recognition-line"></i>

~~

## 工具类库

<i class="ri-tools-line"></i>

rgbToHsl, hslToRgb, rgbToHex, isDark, getHslKey

封装复用

Color Dust？ Yes!

色彩提取和分类信息同样是一个可独立使用的包

快速移植到任意网站

<i class="ri-archive-line"></i>
<i class="ri-global-line"></i>

~~

## PWA 与部署

渐进式 Web 应用

离线使用，一次加载长久缓存

<i class="ri-wifi-off-line"></i>
<i class="ri-flashlight-line"></i>

部署（CDN）

<i class="ri-cloud-line"></i>

---

## 谢谢

<i class="ri-emotion-line"></i>

敬请老师和各位同学指正
