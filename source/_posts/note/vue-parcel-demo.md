---
title: Parcel.js + Vue 搭配笔记
date: 2018-02-20 21:13:42
updated: 2018-02-20 21:13:42
tags:
  - Vue
  - Parcel
categories:
  - 云游的小笔记
---
# 前言

去年年末便听得新一代打包工具 Parcel.js 的风风火火，今日也终于得以静下心来试一试。

---

## [Parcel](https://parceljs.org)

如官网所述，极速零配置 Web 应用打包工具。

- GitHub : <https://github.com/parcel-bundler/parcel>

## [Vue](https://cn.vuejs.org)

鼎鼎大名,自不多言。

---

Vue 官方提供的模板 [vuejs-template/webpack](https://github.com/vuejs-templates/webpack) 是基于 Webpack 打包的。所以尝试着用 parcel.js 来替代 webpack 与 vue 结合在一起。

<!-- more -->

# 过程

## 初始化

基本可以参照 [vuejs-template/webpack](https://github.com/vuejs-templates/webpack) 进行修改。

`vue init webpack vue-parcel-demo` 使用 vue 脚手架生成 webpack 模板

```sh
? Project name vue-parcel-demo
? Project description A Vue.js project
? Author YunYouJun <me@yunyoujun.cn>
? Vue build runtime | Runtime-only
? Install vue-router? Yes
? Use ESLint to lint your code? No
? Set up unit tests No
? Setup e2e tests with Nightwatch? No
? Should we run `npm install` for you after the project has been created? (recommended) yarn
```

- 删除 `build`, `config`, `static`, `node_modules`（之后重装） 文件夹与 `.editorconfig`, `.postcssrc.js`, `package.json`（之后重新生成） 文件。

- `README.md`（可以重写）

- 进入文件夹下，执行 `yarn init` （配置默认即可）

## 安装依赖

```sh
yarn add vue vue-router parcel-bundler parcel-plugin-vue babel-preset-env --dev
```

此时安装的过程中会提示同级依赖的警告。

```sh
> warning "parcel-plugin-vue > vueify-bolt@1.0.2" has unmet peer dependency "vue-template-compiler@~2".
> warning "parcel-plugin-vue > vueify-bolt > vue-loader@13.7.1" has unmet peer dependency "css-loader@*".
> warning "parcel-plugin-vue > vueify-bolt > vue-loader@13.7.1" has unmet peer dependency "vue-template-compiler@^2.0.0".
> warning " > parcel-plugin-vue@1.5.0" has unmet peer dependency "vue-template-compiler@~2".
```

本强迫症就又根据提示安装了这几个包

```sh
yarn add vue-template-compiler css-loader -D
// -D 与 --dev 一个意思，将依赖安装在 devDependencies
```

## Babel 配置

[Babel 中文网](https://babeljs.cn/)

修改 `.babelrc` 文件如下

```
{
  "presets": ["env"]
}

```

## index.html

```html
<html lang="zh-cmn-Hans">
```

[网页头部的声明应该是用 lang="zh" 还是 lang="zh-cn"？ - 知乎](https://www.zhihu.com/question/20797118)

emmm, 纠结地搜到了这个答案。简体中文页面原来是用 `lang="zh-cmn-Hans"`

### 引入 `main.js`

```html
...
<body>
  <div id="app"></div>
  <script src="./src/main.js"></script>
</body>
...
```

## `package.json` 添加 `scripts` 字段

```
{
  "name": "vue-parcel-demo",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "https://github.com/YunYouJun/vue-parcel-demo",
  "author": "YunYouJun <me@yunyoujun.cn>",
  "license": "MIT",
  "scripts": {
    "dev": "parcel index.html",
    "build": "parcel build index.html --public-url /"
  },
  "devDependencies": {
    "babel-preset-env": "^1.6.1",
    "css-loader": "^0.28.9",
    "parcel-bundler": "^1.6.2",
    "parcel-plugin-vue": "^1.5.0",
    "vue": "^2.5.13",
    "vue-router": "^3.0.1",
    "vue-template-compiler": "^2.5.13"
  }
}
```

## Command

- `npm run dev` 运行 
- `npm run build` 构建

输入 `npm run dev` 运行试试。

出现如下报错：

> Server running at http://localhost:1234
×  C:\Users\YunYou\Documents\GitHub\vue-parcel-demo\src\router\index.js:3:23: Cannot resolve dependency '@/components/HelloWorld'

原因是 `@` 是 webpack 默认配置中使用 alias (别名) 指代 src 文件夹的符号。

```
// 位于 build/webpack.base.conf

resolve: {
    // 路径别名
    alias: {
        '@': resolve('src'),
        'vue$': 'vue/dist/vue.esm.js' // 这一个之后解释
    }
},
```

进入 `src/router/index.js` , 将路径修改为相对路径

```
import HelloWorld from '@/components/HelloWorld'
---
import HelloWorld from '../components/HelloWorld'
```


# FAQ

## [运行时 + 编译器 vs. 只包含运行时](https://cn.vuejs.org/v2/guide/installation.html#%E8%BF%90%E8%A1%8C%E6%97%B6-%E7%BC%96%E8%AF%91%E5%99%A8-vs-%E5%8F%AA%E5%8C%85%E5%90%AB%E8%BF%90%E8%A1%8C%E6%97%B6)

在使用 vue 脚手架 `vue init webpack vue-parcel-demo` 生成 vue-webpack 模板过程中，有如下提示：

```
? Vue build (Use arrow keys)
> Runtime + Compiler: recommended for most users
  Runtime-only: about 6KB lighter min+gzip, but templates (or any Vue-specific HTML) are ONLY allowed in .vue files - render functions are required elsewhere
```

如果选择 `Runtime + Compiler` ,此后会发生如下报错。

> [Vue warn]: You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.(found in )

因为 [vuejs-templates/webpack](https://github.com/vuejs-templates/webpack) 的 `main.js` 源码如下

[vuejs-templates/webpack/template/src/main.js](https://github.com/vuejs-templates/webpack/blob/develop/template/src/main.js)

```js
new Vue({
  el: '#app',
  {{#router}}
  router,
  {{/router}}
  {{#if_eq build "runtime"}}
  render: h => h(App)
  {{/if_eq}}
  {{#if_eq build "standalone"}}
  components: { App },
  template: '<App/>'
  {{/if_eq}}
})
```

如果选择 `Runtime + Compiler`, `main.js` 为 
```
...
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
```

如果选择 `Runtime-only`, `main.js` 则为
```
...
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
```

Vue 模板中 webpack 的默认配置通过 alias 设置了 vue 的别名，引用了完整版的 vue 。

```
// 位于 build/webpack.base.conf

resolve: {
    // 路径别名
    alias: {
        '@': resolve('src'),
        'vue$': 'vue/dist/vue.esm.js' // 这一个之后解释
    }
},
```

最终打好的包里实际上是不需要编译器的，所以只用运行时版本即可。

Parcel 使用 `runtime-only`, 修改 `main.js` 中内容为 `Runtime-only` 形式 `render: h => h(App)` 即可。

