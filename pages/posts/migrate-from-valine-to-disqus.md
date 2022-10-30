---
title: 如何从 Valine 迁移至 Disqus
date: 2020-10-03 15:09:13
updated: 2020-10-06 15:09:13
tags:
  - Disqus
  - Valine
categories:
  - 云游的小笔记
---

此前我在 [第三方评论系统之我见](https://www.yunyoujun.cn/posts/third-party-comment-system/) 中简要对比了使用过的一些评论系统，但仍旧没有得出一个尽善尽美的方案。

我很长一段时间评论系统都是使用的 Valine，但因为后来博客第一次收到了一些[不友好的评论](https://twitter.com/YunYouJun/status/1310547458997415936)，以至于我有一瞬间地冲动想要从 Valine 彻底迁移到 Disqus。

但是 Valine 本身加载速度确实很快，用着也挺好，且文章的访问量统计也依赖于此。又实在没有办法下定决心切换至 Disqus。

> 「任何可以用 JavaScript 编写的应用程序最终都将用 JavaScript 编写。」  
> In 2007, Jeff Atwood made the quote that was popularly referred to as Atwood's Law: “Any application that can be written in JavaScript, will eventually be written in JavaScript.”

看到许多小伙伴们最终都选择了 Disqus。

> 任何带有评论系统的独立博客最终都将使用 Disqus 评论。
> ——我瞎说的

也许终有一天，我确实会彻底从 Valine 切换至 Disqus，那么过去大家留下的评论便就此抛弃吗？又着实有些不忍心。

若能将 Valine 中的评论导出并很方便地将其导入 Disqus，那么在决定切换至 Disqus 之前，我都可以放心地使用 Valine。

![给我也整一个！](https://r2.yunyoujun.cn/images/make-one-for-me-too.jpg)

<!-- more -->

## 开整

### 导出 Valine 数据

进入 [LeanCloud API 在线测试工具](https://leancloud.cn/dashboard/apionline/index.html)（为什么选择这个？因为丫后台导出竟然是限制为每天中午 12 点前才可以导出。）

![其他猫能做得到吗？](https://i.loli.net/2020/10/03/Ac4nzjQbWJCTek5.jpg)

选择 App，`yunyoujun.cn`。

因为我的评论总额目前是四百多条，选择 `GET /classes/{class}`，简单配置下 `class` 名称，并放宽 `limit`。

- class: `Comment`
- limit: 500

点击发送请求，获取相应的 JSON。（类似再导出一下 `Counter`，因为 url 对应的标题信息存在了这里面。也可以不导出，标题就默认用链接。）

还挺长，便顺带提一个大家可能已经知道也可能像过去的我一样还不知道的小技巧。（在要复制的内容开始点击一下，按住 <kbd>Shift</kbd>，拖动滚动条到内容结尾，再在末尾点击，选中完成！）

复制粘贴，存储为 JSON 文件（比如 `valine-comment.json`），一气呵成。

> 等等，你问我为什么不直接再写个脚本爬数据？……因为手动操作并不麻烦，脚本还要处理登录状态信息什么的，写这个有点得不偿失了。后面转换的部分倒是写了脚本。

### 转换为 Disqus 的数据格式

源数据拿到了，Disqus 这样的大厂商必然是支持导入评论的，那么我们再想办法将其转化为 Disqus 可导入的格式。

> [Custom XML Import Format | Disqus](https://help.disqus.com/en/articles/1717222-custom-xml-import-format)

Disqus 的格式本质是一个 XML 文件，我们只要将原先的 JSON 数据按照规定的格式通过脚本写成 XML 文件就可以了。

好的，禅师，我悟了。那么脚本哪里找呢？

![我自己去整一个吧！](https://i.loli.net/2020/10/03/IiOc7BsHzCULVNR.jpg)

……当然是自己动手，丰衣足食。
当然秉持开源理念，我自然会将我写好的脚本放出来，大家就不用重复劳作了。
~~如果有帮到你，就不要脸地求个 Star 吧！~~

> GitHub: [valine-to-disqus](https://github.com/YunYouJun/valine-to-disqus)

使用方法就请直接看 README 吧。（记得改一下站点 URL，默认是我的……）

> 用 [Node.js](https://nodejs.org/) 写的，有用 Valine 的人，应该基本都有 Node.js 环境吧！

不过头像只有你配置过 [SSO](https://help.disqus.com/en/articles/1717160-integrating-single-sign-on) 才能使用，Disqus 格式中也没有其他包括头像的字段。所以 Valine 本来根据邮箱调用的 Gravatar 头像会丢失。
暂时没有想到什么好的解决办法。（不过可以去 Admin -> Setting -> General 处设置一下默认头像，换成其他好看点的。）

### 导入 Disqus

前往 <https://你的名字.disqus.com/admin/discussions/import/platform/wordpress/> 或 <https://import.disqus.com/>（这个可以看到导入的进度和状况） 进行导入。

> 对了，Disqus 官方提示最长可能需要 24 h 才能完成。（我也不知道为什么要这么久，目前还挺快的……）

![让我先整整你](https://i.loli.net/2020/10/03/p8QgJs4TtEhOzX3.jpg)

![2000 YEARS LATER](https://i.loli.net/2020/10/06/14Ih5AyknRNxajl.png)

---

整完了！（切换下面的评论系统看看效果吧）
