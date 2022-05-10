---
title: Color Dust
date: 2020-06-23 16:27:24
updated: 2020-06-23 16:27:24
layout: slide
slide:
  theme: white
  config:
    slideNumber: "c/t"
    history: true
    mouseWheel: true
---

<link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet">

<style>
.reveal {
  font-family: PingFang SC;
  font-weight: 300;
}
</style>

<small>

## Color-Dust: A Data Visualization Application of Image Color Based on K-Means Algorithm

Paper ID: 4057

RUI YANG, CHUNFANG LI, YUJUN WEN

Communication University of China

2020.11.30

</small>

Note: Hello everyone, it is an honor to share our research content here.
Our topic is Color-Dust: A Data Visualization Application of Image Color Based on K-Means Algorithm.
My name is Yang Rui. The other two authors are CHUNFANG LI and YUJUN WEN. They are my instructors.
Below I will briefly introduce the content and process of the article.

~~

## Color Dust

![color.svg](https://www.yunyoujun.cn/color-dust/color.svg)

<small>
Color dust, Buddhist language. One of the "six dusts".

It is the dusty environment touched by the eye root (vision).
</small>

---

Lust and dust know the number of years, and embers have no years.

<small>
色尘知有数，劫烬岂无年。  
—— 唐·李绅《题法华寺》
</small>

Note: An ancient Chinese poem said.

---

## Data Source

<i class="ri-image-line" style="font-size: 6rem;"></i>

Note: Let's look at the data source.

~~

## Image Is Data

> Pixel =>
> <span style="color:red">R</span> <span style="color:green">G</span> <span style="color:blue">B</span>

### <i class="ri-file-upload-line"></i>

```js
new FileReader();
```

### <i class="ri-links-line"></i>

```js
new XMLHttpRequest();
```

Note: Images are a form of data, and a single image often contains an enormous amount of data compared to text. Request a picture to be loaded by uploading a file or link.

~~

## Random Image

<i class="ri-gallery-line"></i>

Test data, online switching

Note: I've also prepared some random images that you can click to switch the effect.

---

## Data Cleaning

<i class="ri-drop-line" style="font-size: 6rem;"></i>

~~

### Canvas Picture Pixels

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

H Hue、S Saturation、L Lightness

Note:

Use Canvas to read the picture pixels, you can get the RGB information, we can convert it to HSL for subsequent use.

~~

## <i class="ri-contrast-drop-line"></i>

Ignore too bright/too dark

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

Note: It is not necessary to collect all the photos, we can remove useless information.

---

## Data Processing

<i class="ri-archive-drawer-line" style="font-size: 6rem;"></i>

~~

## K-Means

K = 6

Pick K initial seeds

(ignore colors that are too small)

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

Note: I did not use the relevant class library here, which is conducive to more fine-grained operations. Start recording relevant information (number of iterations, time, number of colors)

~~

## Classify

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

Minimum distance to a certain seed

Note: Iterate through the pixels and divide them into the relevant categories of the initial seed.

~~

## Change Seed

<img width="500" src="https://i.loli.net/2020/11/30/xPSMzwtdGWBH1VL.png">

~~

## Performance Optimization

<i class="ri-flask-line"></i>

HEX as a key will be very slow (measured)

```js
hKey = Math.floor(hsl[0] / 10) * 10000;
sKey = Math.floor(hsl[1] / 5) * 100;
lKey = Math.floor(hsl[2] / 5);
key = hKey + sKey + lKey;
```

Use HSL to calculate as an integer index

Note: The difference is obvious

~~

## [Duff's Device](https://zh.wikipedia.org/wiki/%E8%BE%BE%E5%A4%AB%E8%AE%BE%E5%A4%87)

<i class="ri-thumb-up-line"></i>

Serial copy data, each iteration can be assigned eight times.

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

~~

<a href="https://sm.ms/image/Kl4CoyXLim2IV9Z" target="_blank"><img src="https://i.loli.net/2020/11/30/Kl4CoyXLim2IV9Z.png" ></a>

Note: It was first used in C language. There are a lot of color pixels, and the Duff's device does not have any effect when there is a small amount of data, but it does improve performance when processing a large amount of data.

~~

## K-Means Information

### <i class="ri-node-tree"></i>

- Record the filtered color HSL RGB HEX
- Category
- Sort by quantity
- Number of iterations and time spent
- Main color, Average color

<i class="ri-information-line"></i>
<i class="ri-folder-4-line"></i>
<i class="ri-sort-desc"></i>
<i class="ri-timer-line"></i>
<i class="ri-numbers-line"></i>

Note: HEX (Hexadecimal color code), the top three main colors

~~

## New Seed

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

Calculate the true cluster seed

(The color difference in the vicinity of the cluster is the smallest)

~~

<a href="https://sm.ms/image/2LfpDcZgGYlAkwI" target="_blank"><img src="https://i.loli.net/2020/11/30/2LfpDcZgGYlAkwI.png" ></a>

---

## Data Visualization

Start

<i class="ri-play-line"></i>

Note: If you get all the data you want, then data visualization begins. Concentrated on one page, different representations of the same data source.

~~

## Cluster colors generated by K-Means

<i class="ri-palette-line"></i>

Freely adjust the number of seeds

(Too much affects performance)

Note: Which is the new seed just last generated

~~

## Main Color

<i class="ri-home-line"></i>

<small>
Take the first three colors to generate a gradient bar
</small>

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

## Average Color

<i class="ri-calculator-line"></i>

Average RGB number of each color

```js
this.averageColor = rgbToHex({
  r: Math.floor(rCount / fCount),
  g: Math.floor(gCount / fCount),
  b: Math.floor(bCount / fCount),
});
```

~~

<small>

## The background color before and after binding the website

Vue.js + Nuxt.js + Vuex + Vuetify

Storage state tree + CSS variables

<i class="ri-vuejs-line"></i>
<i class="ri-css3-line"></i>

Switchable light and dark background color

<i class="ri-contrast-drop-line"></i>
<i class="ri-swap-line"></i>

Average color => main color ｜ the most amount of color => accent color

</small>

~~

## Data Information

- Number of colors
- Extracting colors takes time
- Number of iterations and K-Means algorithm time
- Percentage of Colors

<i class="ri-numbers-line"></i>
<i class="ri-timer-line"></i>
<i class="ri-calculator-line"></i>
<i class="ri-percent-line"></i>

~~

## Bar Chart

### <i class="ri-bar-chart-2-line"></i>

<small>
Color number and color hexadecimal

Set the drawing quantity freely

(Sorted by the total number of colors)
</small>

<a href="https://sm.ms/image/dhIETq4Q2DozpUj" target="_blank"><img width="600" src="https://i.loli.net/2020/11/30/dhIETq4Q2DozpUj.png" ></a>

Note: The bars leave no gaps, making it easier to compare colors.

~~

## Pie Chart

### <i class="ri-pie-chart-line"></i>

<small>
The proportion of the number of colors (gray represents the remaining colors)

Set the drawing quantity freely

(Sorted by the total number of colors)
</small>

<a href="https://sm.ms/image/KUZCicPDE67Iahv" target="_blank"><img width="300" src="https://i.loli.net/2020/11/30/KUZCicPDE67Iahv.png" ></a>

~~

<small>

## <i class="ri-links-line"></i> Force-directed Graph

The proportion of the number of colors (gray represents the remaining colors)
</small>

<a href="https://sm.ms/image/FoEeC32mKuxGaD9" target="_blank"><img width="500" src="https://i.loli.net/2020/11/30/FoEeC32mKuxGaD9.png" ></a>

Note: Unexpectedly good result

~~

<small>

## <i class="ri-file-word-line"></i> Word Cloud

Hexadecimal color codes and corresponding colors

(According to the maximum and minimum scaling)

Click to copy the color code

<i class="ri-clipboard-line"></i>
<i class="ri-code-line"></i>

</small>

<a href="https://sm.ms/image/wsv41dijQMkDAhI" target="_blank"><img src="https://i.loli.net/2020/11/30/wsv41dijQMkDAhI.png" ></a>

~~

<small>

## Bubble Chart

<i class="ri-bubble-chart-line"></i>

Color Bubbles

(Also according to the maximum and minimum scaling)

Click on a blank to toggle refresh

Click to copy the color code

<i class="ri-clipboard-line"></i>
<i class="ri-code-line"></i>

</small>

<a href="https://sm.ms/image/3qgaBQlwLuvJRyb" target="_blank"><img width="300" src="https://i.loli.net/2020/11/30/3qgaBQlwLuvJRyb.png" ></a>

---

## Is this the end?

<i class="ri-question-mark"></i>

<i class="ri-stop-circle-line"></i>

### NO

---

## The Last Mile

<i class="ri-run-line"></i>

The Details Make the Difference

<a href="https://sm.ms/image/UkPD9EZcRtVLblu" target="_blank"><img width="600" src="https://i.loli.net/2020/11/30/UkPD9EZcRtVLblu.png" ></a>

~~

Therefore, each step adds up to a thousand miles; each small stream adds up to a river and a sea.

<small>
故不积跬步，无以至千里；  
不积小流，无以成江海。  
—— 荀子 「劝学」
</small>

~~

## Color Palette

<i class="ri-palette-line"></i>
<i class="ri-bookmark-line"></i>

Drawing pictures on canvas with clustered colors.

<i class="ri-download-2-line"></i>

~~

## Light and dark judgment

<i class="ri-contrast-line"></i>

Grayscale Calculation

```js
function isDark(color) {
  color = hexToRgb(color);
  return color.r * 0.299 + color.g * 0.578 + color.b * 0.114 <= 192;
}
```

Text Switch in Opposite Color

~~

<a href="https://sm.ms/image/f8Kq1wzHS9LJotm" target="_blank"><img src="https://i.loli.net/2020/11/30/f8Kq1wzHS9LJotm.png" ></a>

~~

## Internationalization

<i class="ri-translate-2"></i>

Chinese-English Translation

More icons, less text

~~

## Information Tips

<i class="ri-chat-check-line" style="color:#4CAF50"></i>
<i class="ri-chat-delete-line" style="color:#F44336"></i>

Displays color cues when you click Copy Direct Color

the Contrast of shadow and background

Loading Bar

...

<i class="ri-loader-line"></i>

...

~~

## Color Schemes

<i class="ri-palette-line"></i>
<i class="ri-font-color"></i>

Left border card, colorful color

Equal-width fonts `Source Code Pro`

<i class="ri-character-recognition-line"></i>

~~

## Tool Library

<i class="ri-tools-line"></i>

rgbToHsl, hslToRgb, rgbToHex, isDark, getHslKey

Package reuse

Color Dust？ Yes!

Color extraction and classification information is also a package that can be used independently

Quickly migrate to any website

<i class="ri-archive-line"></i>
<i class="ri-global-line"></i>

~~

## PWA and Deployment

Progressive web application

Use offline, load long-term cache once

<i class="ri-wifi-off-line"></i>
<i class="ri-flashlight-line"></i>

Deployment (CDN)

<i class="ri-cloud-line"></i>

---

## Thank you

<i class="ri-emotion-line"></i>

Thanks for listening my speech.
