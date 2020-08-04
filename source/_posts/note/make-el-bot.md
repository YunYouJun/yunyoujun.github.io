---
title: el-bot & mirai-ts 制作笔记
date: 2020-06-22 02:16:53
updated: 2020-08-02 20:16:53
tags:
  - 项目
  - 笔记
  - 分享
  - GitHub
categories: 云游的小笔记
---

> 2020-08-02  
> mirai 已清空仓库，故 el-bot 与 mirai-ts 也将停止维护。
> 虽然想过终有一天会结束，但没想到来得这么快。

---

> 没有未来的未来不是我想要的未来。
> —— 神原秋人 「境界的彼方」

[mirai-ts](https://github.com/YunYouJun/mirai-ts) 是 [mirai-api-http](https://github.com/mamoe/mirai-api-http) 的 TypeScript/JavaScript SDK。
[el-bot](https://github.com/ElpsyCN/el-bot) 是一个基于 [mirai-ts](https://github.com/YunYouJun/mirai-ts) 使用 TypeScript/JavaScript 编写，可配置、可自定义插件的 QQ 机器人。

- GitHub: [mirai-ts](https://github.com/YunYouJun/mirai-ts)
- GitHub: [el-bot](https://github.com/ElpsyCN/el-bot)
- Docs: [mirai-ts API 文档](https://yunyoujun.cn/mirai-ts/)
- Docs: [el-bot 文档](https://docs.bot.elpsy.cn/)

el-bot 展示了整个 mirai-ts 的使用流程，并内置了一些如自动应答、转发、命令行、RSS 等常用功能（默认插件），开箱即用。
你只需要一些自定义的配置，而不再需要编写繁琐的脚本内容。
但这并不是束缚，在插件系统中你仍然可以调用机器人所有的上下文，并通过编写插件的形式快速实现你想要的功能。

照例只是非正经开发日志的历程记录。

<!-- more -->

## 前言

**为什么会有这个东西？**

谁不想有一个可爱专属的辅助机器人呢，而 QQ 又是国内最为常用的聊天工具。

> Telegram 国情便决定其不可能成为国内所有人常用的社交工具，而微信的残疾让我也没有太大兴趣。

- 譬如基于此的我的机器人小云，就会自动抓取我的博客的 RSS 源，并转发到我的群中。（毕竟自己主动分享还有些羞耻。）
- 譬如你发现了一张有趣的图或者文字，想要分享给多个群，一个个转发实在太麻烦，直接发给小云，她便可以帮你转发多个群。
- 譬如问一句小云 `在吗`，她会回道 `主人我在`，而别人问则只会回答 `爪巴` 来彰显尊贵身份。
- 譬如：……

此前我也曾经尝试使用诸如 [qqbot](https://github.com/pandolia/qqbot)、酷 Q 的 [nonebot](https://github.com/nonebot/nonebot) 搭建过 QQ 机器人。

还有过两篇黑历史一样的文章，[小爱是云游最好的女朋友（大雾）](https://www.yunyoujun.cn/project/QQ-XiaoAi/) 和 [酷 Q 使用笔记](https://www.yunyoujun.cn/note/coolq-use-note/)。

> 真的猛士，敢于直面惨淡的博客，敢于正视羞耻的历史。

但很遗憾，前者 qqbot 因为 WebQQ 的关闭而宣告落幕。后者酷 Q 虽然仍在运营，但说好听点与我的开源理念想冲突，难听点则是为什么基础的发图功能都不能白嫖。

其次酷 Q 的跨平台能力实在太差，挂在 Linux 服务器上竟然还需要专门 wine，以及 [docker](https://github.com/CoolQ/docker-wine-coolq) 竟然足足有 559 MB 之大（mirai jar 包合计未超过 50 M）。配置也很麻烦，但无奈当初再无其他可替代品。

搭建完后，很快兴趣寥寥无几，丢在一旁。

后来在 [阔落](https://guhub.cn/) 的群里碰巧得知了 [mirai](https://github.com/mamoe/mirai) 这个框架。
虽然尚未发布 1.0 版本，但看起来不错，更应了我心心念念的开源之思，便再度回想起当初弃坑多次的 QQ 机器人，暗道，爷的青春又回来了。（~~到底有几个青春啊~~）

> 文章的建立日期是 2020-04-25，所以大约是这个时候

## 起步

万事开头难，命名第一位。

因为我曾经的一个机器人叫作小爱，为了与之不同，新者便打算叫作小艾尔。

> 一来是发音相近（还挺好听），二来是自己有个闲置许久的 [elpsy.cn](https://docs.bot.elpsy.cn) 的域名。
> El Psy Congroo | Steins;Gate

此前 Yun 主题群内，有位手写操作系统、对 CRC 执念很深的男人 [ADD-SP](https://www.addesp.com/) ~~吸引了我~~。

兴趣盎然，日更数篇博文，我说你这么闲，要不要一起来写个东西。无知少年，欣然应允。

造东西，我信仰两个原则，要么有趣，要么有用。两者兼有，再好不过。

> 人生亦是如此。
> 顺带一提，我发现无论在什么话后加上人生这句，都会高大上起来。
> 例：我今天睡懒觉迟到了，人生亦是如此。

我不打算实现像微软小冰那样类似的聊天机器人，说实话那种聊天或者猜谜、成语接龙的传统小游戏对我来说毫无吸引力，且觉得使得群内信息过于冗余。

我希望她能成为日常生活中的一个辅助，譬如帮你通过 RSS 订阅信息，一键将沙雕图转发多个沙雕群，提供一些关键的信息，或冷不丁的一句让大家开心的话。

> 小米的小爱同学，能够联动智能家居的这一实用功能，我便很喜欢。开关灯、空调很有用，而我也不至于真寂寞到每天和她聊天。

并作为一个平台，已有的功能可以通过配置文件快速使用，也可以通过插件的形式实现任意想要自定义的功能。

所以我相信 QQ 机器人应该会是个有趣且有用的东西。

[未来道具研究所](https://github.com/ElpsyCN)，el-bot 项目就此开始。

mirai 是 Kotlin 编写，Java 黑的我不会也不打算学。而其社区已经有了一些基于 mirai-api-http 实现的 SDK。

其中 [python-mirai](https://github.com/NatriumLab/python-mirai) 最受欢迎。

只用 Python 刷过 LeetCode 简单中等题的我问道，会 Python 么？

ADD-SP 答略懂略懂。

> 此时，原本 ADD-SP 倾向于从头封装 SDK，而我则倾向于使用现成的轮子。（最后的结果则恰恰相反。）最后定了使用 python-mirai 来开发 [el-bot](https://github.com/ElpsyCN/el-bot-py)（已经咕了）。

于是，两个菜鸡的 Python 之旅就开始了，而这个旅程也并没有持续多久。

## 承接

定下这个计划时，我其实正在驾校等着练习科目三，于是白天练车，傍晚实验室干活，晚上才能抽空写写机器人。

毕竟是自己拉人入坑的，一开始就不写代码空嚷嚷的事不能干。

虽然起初搭了小小的结构，后来在整体的架构上我们的想法起了冲突，推进十分缓慢。我和 ADD-SP 的编程与思维习惯也恰为相反，同时分别为动态/静态语言的爱好者。

此前写东西基本是自己一人埋头干，说实话没什么合作经验。实验室的活倒是多人合作，但老师给了我很大的权限，除了一些特殊的要求外，前端架构上基本是我的一言堂（也一人干）。

后来看到 python-mirai 作者开了个 ISSUE，说将会重构，变动很多，同时因学业问题，7 月末前不会进行任何形式的开发。（本以为是个高考大佬，结果是个初中生巨佬。）

加之自己也诸事繁多，便约好索性等到新版本发布再写好了。

后来闲不住的 ADD-SP 发现了 gomirai，于是新开了个 [el-bot-go](https://github.com/ElpsyCN/el-bot-go)（el-bot 的 go 语言版本） 来实验自己的想法。

而考完驾照的我则开了个 [el-bot-web](https://github.com/ElpsyCN/el-bot-web)（咕了会儿，但会填的），作为控制面板，直接在网页实现与 mirai-api-http 的交互。

## 转折

el-bot-go 的开发如火如荼，很快发布了可用版本。而我（go 只过了一遍教程的水平）偶尔参与讨论下配置的语法设计。

但 ADD-SP 很快遇到了一个问题，QQ 机器人想要足够实用，那么必然会用到一些自定义插件的地方。而 go 作为编译型语言，没办法动态加载插件。

我则嘀咕，这些用 js 就可以了嘛。

加之自己的确很想动手试试，自己 go 的水平又一言难尽，索性选回老本行，js 开干。

起初没有选用 js 的 SDK 开发，一是觉得 [node-mirai](https://github.com/RedBeanN/node-mirai/) 维护并不活跃且文档太草，二是想借机练习下 Python 技巧。

> 嘛，感觉除了深度学习之类的 Python 库最多，其他基本 Python 能干的事，Node.js 都能干，JavaScript 的优势则在于前端/浏览器。

于是正式开坑 [el-bot-js](https://github.com/ElpsyCN/el-bot)，作为 el-bot 的 js（~~女子小学生~~）版本，适合于认为 JavaScript 是世界上最好的语言的用户。

动态加载插件是其一大优势，以及附带了些启动 mirai-console（自动登录）、webhook 等实用脚本。

### 2020-06-21 TypeScript Yes! node-mirai No!

写着写着，node-mirai 的很多设计不合口味，语义不明，文档也不完善，且提了几个 ISSUE 也始终没有收到回应。以及缺少一些更易用的辅助函数，控制台的输出消息不明确，axios 没有做统一配置和响应拦截，一些语法习惯也有所冲突。
……我是不是抱怨太多了。~~虽然我自己也好不到哪里去。~~

加之之前整了 el-bot-web，便索性自力更生，直接根据 mirai-api-http 封装 SDK。后续机器人的上游问题，也不用再操心。

为了与 node-mirai 相区别，并提供更好的代码提示，我决定使用 TypeScript 编写，并命名为 [mirai-ts](https://github.com/YunYouJun/mirai-ts)。

> 封装 SDK 中消息格式有很多，使用 TypeScript 规范代码要更为合适一些。
> 类型检查、动态语言，我全都要。

el-bot-js 也使用 TypeScript 进行了一番重构，并完全去除了 node-mirai 的依赖，转为使用 mirai-ts。

### 2020-06-27 长大的 mirai-ts

刚好赶在了端午假期结束前。mirai-ts 终于可以独当一面（完全封装实现 mirai-api-http）后，从 el-bot-js 的 packages 目录下，分离出来发布了 npm 包 [mirai-ts](http://npmjs.com/package/mirai-ts/)。

> 🤣 也算是回馈社区了，只要 mirai 还在，mirai-ts 我就会尽可能坚持维护下去的，毕竟相当于我自己也在用自己封的库。

简而言之，[el-bot-py](https://github.com/ElpsyCN/el-bot-py) 也就是最早的 el-bot 应该是打算彻底咕了，毕竟本质要做的事一样，基于的协议一样，SDK 自己也特意重封了，没有必要再重复劳作。

我和 ADD-SP 则将分别维护 js 和 go 版本的 el-bot，按照各自不同的架构实现下去。

> 顺带一提，中途因为屁股起了包（没有想到更优雅的措辞），没办法坐着写代码。实验室汇报干活的时候，又觉得直说怪怪的，便改说身体不舒服，所以这周活儿干的有点少。（作为借口是重点。）
> 老师则说快多注意休息。我说好的，于是开完会趴在椅子上继续写起 el-bot-js。

### 2020-07-07 Bye, EBG

ADD-SP 决定放弃 el-bot-go 的维护，后续参与 el-bot-js 的维护。

因为 [ElpsyCN](https://github.com/ElpsyCN) 日后大概也只会有此一个版本的机器人，于是决定将 el-bot-js 重命名为 [el-bot](https://github.com/ElpsyCN/el-bot/)。

### 2020-07-26 v0.3 npm 包

此前我设想的 el-bot 是一个机器人模版，目标是简单的 clone 即可使用，其余一切需求通过 `.env` 设置环境变量或在 `config/cusom` 中配置和编写自定义插件解决。

因为使用 TypeScript 编写，所以每次使用时还需自行编译。（不得不说，这一定程度上受到了此前写 Hexo 主题的习惯影响。）

仔细想来何不直接编译后作为 npm 包发布呢？（~~当然是因为之前还有 mirai 的结构~~）

> 途中受到了 [koishi](https://github.com/koishijs/koishi)（不过是基于 Coolq 的） 的许多启发。但并没有决定使用 monorepo 的形式。

于是现在 [el-bot](https://github.com/ElpsyCN/el-bot) 定位更改为开发框架，新建了 [el-bot-template](https://github.com/ElpsyCN/el-bot-template) 作为可用的快速启动模版。

官方插件 [el-bot-plugins](https://github.com/ElpsyCN/el-bot-plugins) 也都发布于 `@el-bot` 的命名空间下。

提高了启动速度，自定义的程度也更高了。

### 2020-08-02 晨风被捕，mirai 跑路？

半夜，通宵中。忽闻晨风机器人作者被捕，随后 [酷 Q](https://cqp.cc/) 亦关闭论坛，其余机器人也似乎多是跑路，mirai 群内讨论后开启禁言，仅剩开发者群在讨论事宜。

本想 mirai 及其相关项目皆为开源，且未作盈利用途，当并无大碍，但却无人可以断言。QQ 相比 Telegram、Discord 等本就没有提供 API 机制，还如此作为，难免有些失望。

el-bot 与 mirai-ts 将暂时停止开发维护，观望 mirai 最终去向再作决定。（~~好像还变向给自己腾出了时间~~）

---

mirai 已经清库跑路，el-bot 与 mirai-ts 也将停止开发。

---

虽然想过终有一天会结束，但没想到来得这么快。

<!--
[![QQ Group](https://img.shields.io/badge/qq%20group-707408530-12B7F5)](https://shang.qq.com/wpa/qunwpa?idkey=5b0eef3e3256ce23981f3b0aa2457175c66ca9194efd266fd0e9a7dbe43ed653)

最最后附上交流群号 707408530，征集小白鼠。（我自己目前使用基本没有问题。）

> QQ 机器人的交流群要是不是 QQ 群就实在太奇怪了。
-->

---

To Be Continued.

<!-- Q.E.D. -->
