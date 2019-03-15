# 微信 / 支付宝小程序 loader

> 解析拆分单页面模块`<template>` `<script>` `<style>`至对应的 html,js,css 文件

### 安装

```bash
npm install miniapp-loader --save-dev
```

### 配置使用 (以配置微信小程序为例)

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        // 可自行设置需要的模板后缀
        test: /\.mini-vue$/,
        loader: 'miniapp-loader',
        options: {
          // 配置解析html后缀
          htmlExt: 'wxml',
          // 配置解析wxss后缀
          cssExt: 'wxss',
          // 配置解析js后缀
          jsExt: 'js',
        },
      },
    ],
  },
}
```

### 单页面的结构

参照 vue 的设计单例（可以根据需要设置 template 的 lang 语法以及 style 的 lang 语法）

```
<template lang="pug">
  view.container
    text.userinfo 我哦我我我
</template>

<script>
const a = 1
</script>
<style lang="less" scoped>
.userinfo {
  color: red;
  &-text {
    font-size: 20px;
  }
}
</style>
```
