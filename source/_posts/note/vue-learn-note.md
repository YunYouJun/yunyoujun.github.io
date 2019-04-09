---
title: Vue 学习笔记
date: 2018-02-20 21:00:24
updated: 2019-01-28 17:58:24
tags:
  - Vue
  - 笔记
  - 学习
categories:
  - 云游的小笔记
---

使用 [Vue.js](https://cn.vuejs.org) 过程中的一些笔记。

<!-- more -->

## FAQ

记录一些细节问题以及不易搜索到的解决方法。

### [Parcel.js + Vue](https://yunyoujun.cn/note/vue-parcel-demo/)

### [非父子组件的通信](https://cn.vuejs.org/v2/guide/components.html#%E9%9D%9E%E7%88%B6%E5%AD%90%E7%BB%84%E4%BB%B6%E7%9A%84%E9%80%9A%E4%BF%A1)

- [Vue2.0 组件之间通信 - CSDN](http://blog.csdn.net/sinat_17775997/article/details/59025563)

### Build Lib Without Dependencies

使用 `vue-cli@3.x` 构建自己的库时，因为又引入了第三方组件，打包后将代码合在了一起显得很大。
所以应当只打包自己的组件，而不打包内部引入组件的代码。（依赖自然会安装）

Webpack 文档中存在这样的选项，也就是注明 `externals`。
[外部扩展 - Webpack](https://webpack.docschina.org/configuration/externals/#externals)

可以在 `vue.config.js` 中定义 Webpack 配置。
[configureWebpack](https://cli.vuejs.org/zh/config/#configurewebpack)

```js
module.exports = {
  configureWebpack: {
    // externals: ['v-tooltip']
    // 但是连字符可能识别有问题, 不能这么写
    externas: {
      VTooltip: 'v-tooltip'
    }
  }
}
```

### SPA 预渲染

使用[HTML5 History 模式](https://router.vuejs.org/zh/guide/essentials/history-mode.html#html5-history-%E6%A8%A1%E5%BC%8F)可以使 URL 显得更美观。
但与此同时，由于是单页应用，没有后台配置支持的话，直接访问相关路由或刷新时会导致页面访问 404。
这时，又不想配置后台，又不想放弃 History 模式，则还有另外一条出路。

也就是进行预渲染。

可用的插件：

- [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin)

Install

```sh
yarn add -D prerender-spa-plugin
```

Config

```js
// vue.config.js
const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')

module.exports = {
  configureWebpack: {
    plugins: [
      new PrerenderSPAPlugin({
        // Required - The path to the webpack-outputted app to prerender.
        staticDir: path.join(__dirname, 'dist'),
        // Required - Routes to render.
        routes: ['/', '/go', '/unit']
      })
    ]
  }
}

```

---

To Be Continued.