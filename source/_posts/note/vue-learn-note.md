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
# [Vue](https://cn.vuejs.org)

使用 Vue.js 过程中的一些笔记。

<!-- more -->

## FAQ

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

---

To Be Continued.