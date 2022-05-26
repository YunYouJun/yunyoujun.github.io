---
title: Element Plus 的主题系统改造了哪些
date: 2021-07-13 21:47:46
updated: 2021-07-13 21:47:46
tags:
categories:
---

<!-- more -->

说说 Sass 预处理器

Sass VS Less VS Stylus

我经常举的例子就是，原先由 Less 编写的 [Bootstrap](https://github.com/twbs/bootstrap) 改为了使用 Sass 重构。

Stylus 编写的 [Vuetify](https://github.com/vuetifyjs/vuetify/) 改为了使用 Sass 重构。

[Element](https://github.com/element-plus/element-plus) 从一开始便使用 Sass 编写。

除此之外，[quasar](https://github.com/quasarframework/quasar) 等一些知名 UI 库均采用 Sass 构建。

## 变量名

### 规范变量名（scss 与 css var）

- `-background-color` -> `-bg-color`
- `-font-color` -> `-text-color`

> 与 [Tailwindcss](https://tailwindcss.com/) 一致

可以自定义 button 色彩，自动计算 hover active color

### `sass:map` 组织组件变量

```scss
$button: () !default;
```

### 通过 sass 自动生成 css var

```scss
// set all css var for component by map
@mixin set-component-css-var($name, $--variables) {
  @each $attribute, $value in $--variables {
    --el-#{$name}-#{$attribute}: #{$value};
  }
}

// use
@include b(alert) {
  @include set-component-css-var("alert", $alert);
  // ...
}
```

## FAQ

### vite import scss 无法互相影响

比方说，在 vite 中导入 scss 文件：

```ts
import 'a.scss'
import 'b.scss'
```

这完全没问题。
但是 a 和 b 本质是相互独立的（好处是热加载只需编译对应的文件），如果 b 想要使用 a 中已有的变量，这该如何是好？

而 element-plus 重构了主题系统，本身很多的变量依赖与一个全局的变量文件。

譬如，修改主色调为绿色，我们自然希望 button 主色调变成绿色，而 tag 主色调也变成绿色。

---

scss 编译

`@use` 替代 `@import`

> Sass 文档写到，
> Sass 扩展了 CSS 的 @import 规则，能够导入 Sass 和 CSS 样式表，提供对 mixin、函数和变量的访问，并将多个样式表的 CSS 组合在一起。 与需要浏览器在呈现页面时发出多个 HTTP 请求的普通 CSS 导入不同，Sass 导入完全在编译期间处理。

<div class="danger">

> Sass 团队不鼓励继续使用 `@import` 规则。 Sass 将在未来几年逐步淘汰它，并最终将其从语言中完全删除。 更喜欢 `@use` 规则。 （请注意，目前只有 Dart Sass 支持 `@use`。其他实现的用户必须改用 `@import` 规则。）

</div>

`@import` 的缺点：

- `@import` 使所有变量、mixins 和函数都可以全局访问。 这使得人们（或工具）很难分辨出这些是在哪里定义的。
- 因为一切都是全局的，lib 必须为其所有成员添加前缀以避免命名冲突。
- `@extend` 规则也是全局的，这使得很难预测将扩展哪些样式规则。
- 每次 @imported（被导入） 时都会执行每个样式表并 emitted（发出）其 CSS，这会增加编译时间并产生臃肿的输出。
- 无法定义下游样式表中无法访问的私有成员或占位符选择器。

> [@import | Sass](https://sass-lang.com/documentation/at-rules/import)

> [@use and @import rules in SCSS](https://www.liquidlight.co.uk/blog/use-and-import-rules-in-scss/)

`@forward`

> `@forward` 规则加载 Sass 样式表，并在使用 `@use` 规则加载样式表时使其 mixin、函数和变量可用。它使得跨多个文件组织 Sass 库成为可能，同时允许用户加载单个入口文件。

```scss
// packages/theme-chalk/src/date-picker.scss
@import "./date-picker/date-table.scss";
@import "./date-picker/month-table.scss";
@import "./date-picker/year-table.scss";
@import "./date-picker/time-spinner.scss";
@import "./date-picker/picker.scss";
@import "./date-picker/date-picker.scss";
@import "./date-picker/date-range-picker.scss";
@import "./date-picker/time-range-picker.scss";
@import "./date-picker/time-picker.scss";
```

```scss
// packages/theme-chalk/src/date-picker.scss
@forward "./date-picker/date-table.scss";
@forward "./date-picker/month-table.scss";
@forward "./date-picker/year-table.scss";
@forward "./date-picker/time-spinner.scss";
@forward "./date-picker/picker.scss";
@forward "./date-picker/date-picker.scss";
@forward "./date-picker/date-range-picker.scss";
@forward "./date-picker/time-range-picker.scss";
@forward "./date-picker/time-picker.scss";
```

有点绕，来一个更加明显的例子。

`mixins.scss` 文件中需要用到 `config.scss` 文件中的变量。
我们可以这样使用。

```scss
// mixins.scss
@use "config" as *;
// ...
```

这时我们 `button` 组件需要用到 `mixins.scss`，那么我们就可以在 `button.scss` 中引入 `mixins.scss`。

```scss
// button.scss
@use "mixins" as *;
// ...
```

此时，sass 的模块化机制会保证 `config.scss` 中的变量只能在 `mixins.scss` 中使用。`button.scss` 则无法使用。

但是 button 组件中可能也需要使用 `config.scss` 中的变量，而我们已知每个组件都导入了 `mixins.scss`，我们再去在每个组件的 scss 文件中导入 `config.scss` 既麻烦，又增加了复杂性。比如以后我们需要再导入 `c` `d` 文件，每次都再去头部加一遍吗？

这时候我们就可以利用 `@forward` 将其转发至 `mixins.scss` 中。(`@forward` 与 `@use` 是可以同时使用的)

```scss
// mixins.scss
@forward "config";
@use "config" as *;
// ...
```

这时，我们的 `button.scss` 已经 `@use "mixins" as *;`，那么转发的 `config` 变量也可以在 `button.scss` 中使用了。

## 每天一个小细节

还有个有趣的事情是。

`/* */` 书写的 scss 注释会被编译到最终产物，因为这被当作 CSS 的注释。
而 `//` 的注释方式则不会。

为了保持最终产物最小，我们应当使用 `//` 注释代码，除非你希望你的注释也能显示在最终产物被大家看到。

## Why Scss module

> [Introducing Sass Modules](https://css-tricks.com/introducing-sass-modules/)

最开始主要是有人提了一个 Issue，想要按需加载的同时自定义主题。
通过自己按需导入 scss 的方法可以正常实现。
但是每引入一个组件，就需要自己导入 scss 很明显是不优雅的。

我们有一个 [unplugin-element-plus](https://github.com/element-plus/unplugin-element-plus) 插件，可以作为 Vite/Webpack 等插件使用。

> 可以配置其中的 `useSource` 来使用 `scss`。

但这也有一个问题，unplugin-element-plus 的机制本质是拼接了一个 `import 'xxx.scss'` 的 ts 文件，这就回到了之前提到的问题，import 进来的 scss 文件之间的编译是互相独立的。
所以它们无法使用额外 scss 自定义的变量。

而我们可以通过自定义 `vite.config.ts` 中 `scss.additionalData` 来在编译 scss 时默认带上自己设置的全局变量。

```ts
// vite.config.ts
export default defineConfig({
  // ...
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "./styles/element/index.scss" as *;',
      },
    },
  },
  // ...
  plugins: [
    vue(),
  ],
})
```

你以为这么简单就结束了？

我起初在 `additionalData` 使用了 `@import` 的方式来导入 scss 文件，这是编译就会出现问题，提示你应当将 `@use` 写在

---

## 如何覆盖模块默认变量

> With @import, libraries are often configured by setting global variables that override !default variables defined by those libraries. Because variables are no longer global with @use, it supports a more explicit way of configuring libraries: the with clause.

`@use` 与 `!default` 与 `with`

```scss
// common/var.scss
$colors: () !default;
```

```scss
@forward "element-plus/theme-chalk/src/common/var.scss" with ($colors: (
  primary: (
    base: green,
  ),
);
```

> <https://github.com/sass/sass/blob/main/accepted/module-system.md#configuring-libraries>

## 构建工具 gulp

gulp 目前实际上是没有替代品的。

严格上来说 gulp 并不是一个打包工具

ts

---

To Be Continued.

<!-- Q.E.D. -->
