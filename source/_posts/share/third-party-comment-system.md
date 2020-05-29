---
title: 第三方评论系统之我见
date: 2020-05-17 13:30:40
updated: 2020-05-17 13:30:40
tags:
  - 评测
  - Disqus
  - Gitalk
  - Valine
  # - LiveRe
categories:
  - 云游的小分享
---

静态博客纵有万般好，但不得不承认其常常需要很多奇技淫巧，方能实现~~甚至无法实现~~动态网站仅需数行代码便可实现的功能。

评论系统便是其代表之一。

我尝试过数种第三方评论系统（Disqus/Gitalk/Valine/LiveRe(来必力)/畅言），并在其中反复横跳，丢失了不少可爱的评论，也很遗憾未能找到一款真正百无挑剔的评论系统。

> 一个事物的发展往往是一个波浪式前进、循环往复式上升的过程。

我将简单对我使用过的评论系统之利弊进行对比分析（可能包含许多个人色彩），以便各位看官参考。

<!-- more -->

![反复横跳.jpg](https://cos.yunyoujun.cn/blog/posts/jump-repeatedly.jpg)

---

## 评论系统

### [Disqus](http://disqus.com/)

[Disqus](http://disqus.com/) 作为当前最大的第三方评论系统，功能强大，也不用担心数据跑路。
使用广泛，一个账号可以通用许多博客评论，甚至可以和均使用 Disqus 作为评论系统的网站建立联系，形成社区。

但对于国内来说，却有一个致命缺点，需要科学上网。

> 还可以使用 [DisqusJS](https://github.com/SukkaW/DisqusJS)，为无法连通 Disqus 的访客通过 Disqus API 在前端页面渲染一个评论列表。但真正想要评论，仍须科学上网。
> [disqus-php-api](https://github.com/fooleap/disqus-php-api) 则可以代理 Disqus，我尝试使用了一下，填写作者的 API 时，竟然直接创建到[作者的讨论](https://disqus.com/home/forum/fooleap/)里了……也就是说还是需要自建，又稍微脱离了使用第三方评论的初心。

我原本已经痛定思痛准备更换 Disqus 了，却发现其加载的请求与资源相当多（即便我已经关闭了 Disqus 的追踪和返利链接），最终还是退缩起来。

以下是小伙伴们的一些可以参考的优化手段。

> [使 Disqus 不再拖累性能和页面加载 | Sukka's Blog](https://blog.skk.moe/post/prevent-disqus-from-slowing-your-site/)  
> [在特殊地区科学使用 Disqus 评论系统 | ChrAlpha 的幻想乡](https://blog.ichr.me/post/use-disqus-conveniently/)

其实如果不是因为被墙，我还是很想直接用 Disqus 的，但是我还是有评论就很高兴的人，所以不想因此而有过高门槛。

### [Gitalk](https://gitalk.github.io/)

在 [Gitalk](https://github.com/gitalk/gitalk) 诞生之前，还有一款 [Gitment](https://github.com/imsun/gitment/)。

应该说 Gitment 是第一款利用 GitHub Issues 的评论系统。但是作者前后维护不到三个月便弃坑了。
虽然开源项目无可指责，但自己作为满怀期待的初期用户着实还是有些不开心。

Gitalk 相比 Gitment 则持续维护了很久。所以首先肯定与感谢作者的开源精神与贡献。

不过中途因为 GitHub API 的安全策略改变，每次进入文章都会调用 Gitalk 而收到了一大堆的安全警告邮件。

> 现在已经修复 [GitHub app API query parameter deprecation](https://github.com/gitalk/gitalk/issues/343)

而关闭了一段时间，也一直没有再启用。

以及 Gitalk 调用 OAuth 时会申请获取对所有公开项目的读**写**权限，如下图所示。

![gitalk-security.jpg](https://i.loli.net/2020/05/17/FOLHuTXn1JZYmrb.jpg)

你可以到[此处](https://gitalk.github.io/)尝试登陆。

> 这似乎是因为 GitHub 无法继续划分权限。

也就是说使用 Gitalk 评论的用户必须完全相信博主的 OAuth 不会作恶，同时因为 GitHub OAuth 不支持 CORS ([OAuth web flow endpoints don't support CORS](https://github.com/isaacs/github/issues/330))，`access_token` 还必须经过 `https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token` 这一代理才能获取。

当然也可以选择自建，但是不是有些脱离选择静态博客的初心了呢。~~没错，我就是懒。~~

所以我着实有些不放心，也从用户的角度没有自信能完全取得游客的信任。（有些用户使用 GitHub OAuth 时可能没有注意到这里，所以也算提个醒。）

我最理想的情况是 gitalk 在不传入 `clientSecret` 等参数，只提供必要的 `repo` 时，可以渲染文章对应标题的 Issue 评论内容。（类似于 Sukka 的 [DisqusJS](https://github.com/SukkaW/DisqusJS)）

> 感觉理论上是可以实现的，毕竟本来 Issue 就都是公开的。GitHub 也有完备的 [API](https://developer.github.com/v3/)。

然后当用户想要评论时，点击链接跳转到对应 Issue 进行回复即可。这样登陆验证等全交给 GitHub 来做就可以了。

> 我尝试提了个 ISSUE: [[Feature Request] Only render issues content without clientSecret](https://github.com/gitalk/gitalk/issues/383)
> 如果能得到回复和实现就再好不过。（不行的话，就日后有空尝试自己能不能写出来，嗯，有空，咕咕咕。）

### [Valine](https://valine.js.org/)

当 Gitalk 关闭后，[Valine](https://github.com/xCss/Valine) 一直是我在使用的方案。

> 关于邮件提醒等功能则可以使用 [Valine-Admin](https://github.com/DesertsP/Valine-Admin)

但是最近 Valine 不知何故在 [README](https://github.com/xCss/Valine/blob/master/README.md) 里写上了 `由于某些原因，src目录将从v1.4.0后暂停更新.`。

也就是说 Valine 相当于开始闭源。

且在闭源后，作者在其中加入了百度统计（[v1.4.2, v1.4.1 will always load stats plugin from hm.baidu.com](https://github.com/xCss/Valine/issues/258)），我翻看了 [v1.14.14](https://cdn.jsdelivr.net/npm/valine@1.4.14/dist/Valine.min.js) 似乎没有再找到相关代码。

加之昨日，LeanCloud 始终登不上去（只是我个人，询问了其他朋友都正常，自己睡了一觉后也正常了），让我有点担忧起评论的数据。
说到底，其实一直都是在白嫖的 [LeanCloud](https://leancloud.cn/) 开发版的免费资源，而这数据本身就算丢失了 LeanCloud 也无需对此负责。

所以对于是否继续使用 Valine 也有所动摇起来。

### [畅言](http://changyan.kuaizhan.com/)

国内搜狐旗下的评论系统。（算是国内还幸存的屈指可数的几家）（多说、网易云跟帖均已关闭。）

但是，都 2020 年了，官网还没有强制 `https` 跳转还是比较稀奇的。

过去我曾经使用过，印象里它会自行给你插广告且占位很大，此外用户还须绑定手机号。

所以基本不考虑。

### [来必力 LiveRe](https://livere.com/)

[LiveRe 来必力](https://livere.com/) 是一家来自韩国的评论系统，支持多种 SNS 账号连接登陆（QQ、微信、GitHub、百度、微博、豆瓣、Twitter 等等），很接地气。
且好处是**不**需要科学上网（官网甚至是备案过的），但是国内访问速度还是比较慢。

因其体量，仍旧担心是否能够坚持下去不倒闭。毕竟国外用户大多数会直接选择 Disqus，而这也不是国内本土产品。截至目前官网显示的客户量竟然只有 1,350 个，对于已经运行数年的网站来说，是不是有些过少了呢？

但光就其功能上来说，还是值得一用的。

## 对比

| 第三方评论系统 | 开源         | 速度 | 是否被墙 | 可否实现 PJAX                                         | 数据可靠性                               |
| :------------- | :----------- | :--- | :------- | :---------------------------------------------------- | ---------------------------------------- |
| Disqus         | 否           | 慢   | 是       | 可以                                                  | 市场占有率高，可靠                       |
| Gitalk         | 是           | 中等 | 否       | [不可以](https://github.com/gitalk/gitalk/issues/205) | GitHub 还在一天，就永远不用担心          |
| LiveRe         | 否           | 较慢 | 否       | 不可以                                                | 存疑                                     |
| Valine         | 薛定谔的开源 | 快   | 否       | 可以                                                  | 取决于 LeanCloud（看你是不是付费用户了） |

以下是同一个页面加载不同评论系统时 `Dev Tools -> Network` 的信息。（None 为不加载评论系统）

> Gitalk 懒得配置了，速度应该在 LiveRe 与 Valine 之间，影响不大。

| name   | request | transferred | resources | Finish  | DOMCOntentLoaded | Load   |
| :----- | :------ | :---------- | :-------- | :------ | :--------------- | :----- |
| None   | 35      | 315 kB      | 850 kB    | 1.53 s  | 672 ms           | 1.52s  |
| Disqus | 94      | 1.9 MB      | 4.0 MB    | 16.51 s | 1.38 s           | 2.24 s |
| LiveRe | 60      | 1.1 MB      | 3.2 MB    | 13.06 s | 1.14 s           | 1.98 s |
| Valine | 43      | 408 kB      | 1.1 MB    | 5.66 s  | 1.29 s           | 1.83 s |

简而言之，Disqus 最重最慢，Valine 最轻最快。与之对应的自然是功能强弱。

## 总结

回顾下来，我现在最能信任的还是 GitHub 与 Disqus。体量足够大，不用担心跑路。
虽然很想直接用 Disqus，但是我本身就不是产出硬核技术文章的人，对于想要评论的游客要求科学上网未免有些苛刻。

GitHub 倒是既慷慨又实用，所以要是能渲染 Issue 评论预览，想评论的点击链接跳转对应 Issue 就好了。

所以我目前的解决方案是 Valine 和 GitHub Issues 混用。（但是结果大家基本都是直接用的 Valine ……）

评论区的 GitHub Issues 我设置了跳转搜索对应文章标题的 Issue，当没有相关 Issue 时，大家也可以通过预置的 Comment 评论模版，新建 Issue。

> 但是因为要多跳几个链接，无法直接显示在评论区中预览，所以基本没有人用。
> 不过我认为相比 Valine 的数据（保不准哪天我就因为各种原因不得不抛弃它了），显然 GitHub 要更为可靠些。所以重要的留言可以考虑留在 Issue 里哦～

GitHub 最近则在内测 [Discussions](https://github.com/zeit/now/discussions/) 感觉也是一个不错的交流方式，值得期待。

---

Q.E.D.
