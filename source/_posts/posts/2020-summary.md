---
title: 做猪呢，最重要的是开心
date: 2021-02-12 21:42:43
updated: 2021-02-14 21:42:43
tags:
  - 年终总结
  - 养猪
categories:
  - 云游的小日记
aplayer: true
---

![做🐷呢 最重要的是开心](https://cdn.jsdelivr.net/gh/YunLeFun/assets//images/happy-is-important-for-a-pig.jpg)

> [如何养猪 | wikiHow](https://zh.wikihow.com/%E5%85%BB%E7%8C%AA)

养猪指南？不对，是猪的成长日志。

<!-- more -->

## 猪的前言

在网络上游荡许久，时常会看到许多博主有趣丰富的年终总结，令人心生羡慕。

![真是令人感到羡慕...](https://upyun.yunyoujun.cn/images/really-enviable.jpg)

回想起自己过去似乎从来没有写过所谓的年终总结，加之很久没有更新（~~水~~），尽管没有什么特别有趣的事情，但不妨回顾一番。

因为叫作年终总结，有些平平无奇。而高中时，我尤为喜欢王小波文章中的最后这段话：

> 我已经四十岁了，除了这只猪，还没见过谁敢于如此无视对生活的设置。相反，我倒见过很多想要设置别人生活的人，还有对被设置的生活安之若素的人。因为这个原故，我一直怀念这只特立独行的猪。
> ——王小波「一只特立独行的猪」

所以我决定做一只特立独行的猪，至少就标题上而言。

一只猪的寿命大约为 15 ～ 20 年，但其从猪仔到出栏仅需不到一年的时间，如果搭配上科学的养殖手法甚至不到半年。

<div class="info">

> 猪、羊等其他动物长到屠宰重量叫出栏。

</div>

猪犹如此，人何以堪？

> 树犹如此，人何以堪？——北周·庾信《枯树赋》

从人类尺度上来说，时间是连续的，所谓的年也不过是人为根据天体运行规律与气候所做的尺度划分。
虽然从回忆中单单拎出任何一件事来说，都不足以道，但是聚在一起，反倒如潮水般，暗流奔涌。

今年确实对我来说发生了许多让人变化的事情，倒也值得回顾一番。且容我慢慢道来。

## 猪的 1/24 生

一头完整的成年猪只需要大约 1.85 平方米的空间。正与我在学校宿舍狭窄的空间类似。
但如果想让猪长得真正健康，你应该给每头猪大约 4.6 平方米的空间。
这大概便是我更想宅家，哪怕是呆在实验室的缘故。

### 开源社区

托疫情的（福）祸，这一年的学生生涯，大部分在家中度过。我也得以有最大的自由度调配我的活动时间（昼伏夜出）。

因此 2020 年在开源社区很勤勉，总计有 3407 contributions，日均 9.46 个 contribution。（~~都是些垃圾代码还真是对不起了！~~）
当然其中一部分是 CI 的缘故，所以大概可以折个半。

除了中途的出差、少数几日的实验室活动或其他琐事，导致了空白，其他的绿点都还坚持闪耀着。

![2020-2021 GitHub Contributions](https://upyun.yunyoujun.cn/images/2021-github-contributions.jpg)_2020-02-09 —— 2020-02-13_

![云游君's GitHub Stats](https://upyun.yunyoujun.cn/images/2021-github-stats.jpg)

[![GitHub followers](https://img.shields.io/github/followers/YunYouJun?style=social)_204 Followers_](https://github.com/YunYouJun)

<div class="success">

> 这一年我做了什么？

</div>

#### [hexo-theme-yun](https://github.com/YunYouJun/hexo-theme-yun)

☁️ A fast & light & lovely theme for Hexo. 一个对可爱自以为是的 Hexo 主题。还做了一个 PV [Strato - Hexo 主题「Yun」版本宣传 PV](https://www.bilibili.com/video/BV17t4y1S7tz)。（做视频的末尾显示了当时的 Star 者，则写了个 [github-stargazers](https://github.com/YunYouJun/github-stargazers) 获取。）

Yun 也就是本博客正在使用的主题，虽然应该算是前年开坑的项目，但是真正花功夫迭代开发维护是在去年。也因此遇到了很多小伙伴。

> 主要概况则记录在了 [hexo-theme-yun 制作笔记](https://www.yunyoujun.cn/note/make-hexo-theme-yun/) 中。

对了，还写了几个相关的小插件。

- [hexo-tag-common](https://github.com/YunYouJun/hexo-tag-common): 通用的一些标签，如可切换的 Tab。
- [hexo-widget-tree](https://github.com/YunYouJun/hexo-widget-tree): 挂件树，方便浏览站点的所有文章和目录。

#### [mirai-ts](https://github.com/YunYouJun/mirai-ts)

🔧 Mirai(QQ Bot) JavaScript/TypeScript SDK

因为突然出现了 [mirai](https://github.com/mamoe/mirai) 这一相比酷 Q 更得我（白嫖）心意的 QQ 框架，加之想要有一个辅助用的 QQ 机器人（用来转发沙雕图）。

但是我是 Java 黑（没有贬义），mirai 又是使用的与 Java 紧密相连的 Kotlin 写就。
加之对其他现有的语言 SDK 不大满意，以及练习 TypeScript 的目的，开发了 mirai-ts 这一 SDK 以便用宇宙第一流行的语言 JS/TS 来开发机器人。

后续的不断迭代，使之成为目前唯一一个可游走于 JavaScript/TypeScript/Browser(浏览器端) 且带代码提示的 SDK，自己还算颇为得意。

以及确实借此机会意识到了 TypeScript 的许多优势之处。

#### [el-bot](https://github.com/YunYouJun/el-bot)

🤖 基于 mirai-ts，运行于 Node.js，可配置、可自定义插件的 QQ 机器人框架。

最初打算写个机器人模版，写着写着，然后一想干嘛不抽象成框架开源给大家呢，开发着开发着，对现有的 JS SDK 设计和功能不是很满意，以及提 ISSUE 基本没有响应。
索性自行开发 SDK，也无需再等待上下游的反馈，同时 TS + VS Code 的代码提示也真的很好用。

> 实质这中间也有许多波折故事，则大部分记录在了 [el-bot & mirai-ts 制作笔记](https://www.yunyoujun.cn/note/make-el-bot/) 中。

#### xiao-yun 小云

小云，性别女，喜欢的人是云游君！（对不起，我只能在这里寻找一下存在感了。）

![我太菜了，对不起！](https://upyun.yunyoujun.cn/images/sorry-i-am-so-vegetable.jpg)

小云当然就是基于以上 el-bot 与 mirai-ts 开发的功能性机器人啦，或者说其实是因为想要让小云诞生，所以有了前两者。
但我个人其实不是很喜欢在群里聊一长串天或是提供确实没什么意思的小游戏之类的机器人，语义理解/好感系统做的再完善，它也终究只是数值的展示。
你和她聊天的时间，与网络上其他真实的可爱的人产生交集不是更好吗？（等等，由我这种死宅说这种话是不是不大妙？）
与其在群里干扰大家的交流，我觉得作为个人的辅助工具或偶尔活跃一下气氛反而更有意义一些。

#### [valine-to-disqus](https://github.com/YunYouJun/valine-to-disqus)

一个可以将 Valine 评论转换为 Disqus 可导入评论的脚本工具

至于过程与使用方法则记录在了 [如何从 Valine 迁移至 Disqus](https://www.yunyoujun.cn/posts/migrate-from-valine-to-disqus/)

因为虚荣，其实在使用的是 [Waline](https://waline.js.org/) （一个带后端的 Valine） 的解决方案。

静态博客评论系统的选择着实有虚度苦恼之处，评论的对比可以参见 [第三方评论系统之我见](https://www.yunyoujun.cn/share/third-party-comment-system/)。

#### [gaussian-blur](https://github.com/YunYouJun/gaussian-blur)

一个简单的高斯模糊 Demo。

> [写写高斯模糊——从 CSS 模糊滤镜的白边说起](https://www.yunyoujun.cn/posts/gaussian-blur-for-image/)

#### [is-teacher-here](https://github.com/YunYouJun/is-teacher-here)

今天老师来了吗？

虽然有链接，但是是私密的，嘿嘿嘿。

用 tensorflow.js + yolo + nuxt 搭建了一个 Web 端的检测，可以借助 PC 的摄像头对老师的位置进行目标检测，若有人进入或离开，则拍照并上报给小云发送到我们实验室的 QQ 群里。

这样就能悄悄知道老师在实验室没有，以调整自己的作息计划。（顺带借此把大家从微信群骗到了 QQ 群里。）

> 对了，这大概也是某样事情开始转动的起点。

#### [air-conditioner](https://github.com/YunYouJun/air-conditioner)

云空调，便携小空调，为你的夏日带去清凉！翻新以前的一个沙雕项目。

发了个帖子 [创业项目（雾）-便携小空调](https://www.v2ex.com/t/721700)，意外地受欢迎。

#### [color-dust](https://github.com/YunYouJun/color-dust)

Image theme color extraction. 色尘知有数，劫烬岂无年。

色彩可视化，上传图片抽取色彩，以及显示色彩的相关信息可视化。

#### [ak-ui](https://github.com/YunYouJun/ak-ui)

[预览](https://ak-ui.yunyoujun.cn/)

明日方舟风格的 UI 框架，大部分使用 CSS 特性实现，练习产物。写了些，后来没啥时间，加之方舟也渐渐长草了，就没有继续完善了。（日后还会拾起来？）

#### [go-far-away](https://github.com/YunYouJun/go-far-away)

在地图上找到离你最远的地方。简单更新了一下以前的依赖。

#### [wives](https://github.com/YunYouJun/wives)

给老婆们一个家，为喜欢的（尽管基本是单向的）女孩子们生成 JSON 数据。其实是 [girls 页面](https://www.yunyoujun.cn/girls/) 的数据来源。

不知道该用爱还是闲来形容好，我把喜欢的角色录入了遍名字/作品/豆瓣 ID/ AniList Character ID 之类的数据。

#### [baidu-image-spider](https://github.com/YunYouJun/baidu-image-spider)

百度图片爬虫小工具，可以通过终端快速爬取关键字的图片并下载到指定文件夹。

#### [utils](https://github.com/YunYouJun/utils)

封装了一些简单的工具方法，以便快速写一些脚本。

> 以上两者是 [如何找到你朋友的社交账号](https://www.yunyoujun.cn/posts/find-npy-social-account/) 的副产物。

#### [sponsors](https://github.com/YunYouJun/sponsors)

最后是 [赞助者名单](https://sponsors.yunyoujun.cn/)

自动生成 JSON 数据，网站展示页面和手动添加赞助者的脚本工具。

虽然挂着收款二维码之类的，但是真的没想到真的能够收到大家许许多多的支持。
而之所以有动力写开源项目，此部分原因自然占了大半。虽然金额对于花同等时间去打工兼职之类的来说，可能不值一提。
但是这除了数字上来说，更像是一种精神上的鼓舞，反而更有意义。我知道我做的某样工作的确是有意义的，是值得认可的。

说句大言不惭的话，我对钱没有兴趣。

![我对钱没有兴趣](https://upyun.yunyoujun.cn/images/i-am-not-interested-in-money.jpg)

但是我知道，它是必不可少的。想要在世间立足，保持尊严，便不可能将其绕开。世间比钱有趣的事情数不胜数，却往往需要它作为媒介。
所以应该说我对攫取大额的金钱没有兴趣，我只希望在满足各类生活娱乐需求之外，能够有足够的时间做自己喜欢的事情。而不是成为资本的奴隶。
如果理想的共产主义社会真的存在的话，到那时应该是每个人都不用顾及生活的繁琐，而放心做自己想做的事情。

总之，真的十分感谢你们！

<details>
<summary>
一些在鸽或流产的内容
</summary>

- [advjs](https://github.com/YunYouJun/advjs): 🎮 面向未来与前端的 ADV 文字冒险游戏引擎。基于 Vue3 + Vite + TypeScript。Deving...
- [vtuber](https://github.com/YunYouJun/vtuber): 从零开始的 Vtuber，想要造一个能在 Web 端跑的 Vtuber。
- [augma](https://github.com/YunYouJun/augma): 以刀剑神域序列之争中 Augma 设备为名，希望打造一款面向增强现实的 UI 框架。
- [nasa-vis](https://github.com/YunYouJun/nasa-vis): NASA 一些数据的可视化，有点意义不明，感觉内容不是很有趣，没有继续完善下去了。
- [jdy-report](https://github.com/YunYouJun/jdy-report): 简道云每日自动填报，理论上是能用的，但是因为 Session 过期太快，而且登录需要微信扫二维码，所以流产了。
- [jd-second-kill](https://github.com/YunYouJun/jd-second-kill): 京东秒杀，买 Swicth + 健身环优惠套餐竟然没货了，干脆让脚本帮忙吧！[puppeteer](https://developers.google.com/web/tools/puppeteer) 感觉也很酷。虽然最后买的时候其实货源充足了！

再其他大概就是提都不值得一提的东西了。

</details>

技术很酷，但出于实力精力所限，如今的我更希望能用趁手的工具在有限的时间内做出有用有意思的东西。

流水账般罗列了下无聊的展品，但其实每样展品背后都或多或少关联着当时的故事与心境。

每个项目维护迭代，每个 Commit 差不多便贯穿了今年的人生。

但是人生也不只有代码不是么？

### 影音平台

影音平台通常有着年度总结，不过大部分是以 2021-01-01 为分割点的。

<div class="success">

> 这一年我看与听了什么？

</div>

#### [豆瓣](https://www.douban.com/people/yunyoujun/)

仍旧看了不少番剧，基本都标注在了豆瓣。

> 毕竟只要还有动画，生活就还有希望。

![豆瓣 2020](https://upyun.yunyoujun.cn/images/douban-2020.jpg)

有数部电影是实验室的大家一起看的。

#### [网易云音乐](https://music.163.com/#/user/home?id=247102977)

![网易云音乐 2020 年度歌手](https://upyun.yunyoujun.cn/images/netease-cloud-music-2020-singer.jpg)
![网易云音乐 2020 年度歌单](https://upyun.yunyoujun.cn/images/netease-cloud-music-2020-songs.jpg)

因为为了节约流量，听歌的时候往往是没有联网的时候，所以可能未必准确。

我对听歌没什么讲究，不过我接触到新的歌曲通常是看番时候的 OP/ED 主题曲，或是心动推荐，所以大部分还是死宅向的日文歌，我也很喜欢听歌时回忆起背后故事的感觉（动漫的 OP/ED 便是如此）。

{% meting "22736708" "netease" "song" "theme:#C20C0C" %}

[UPLIFT SPICE](https://music.163.com/#/artist?id=22191) 是目前很喜欢的一个乐队，风格和歌词都很酷，仿佛在讲述故事。

#### [bilibili](https://space.bilibili.com/1579790)

想过直播出道写代码成为偶像，但是实际上尝试直播了一次后，粉丝数减一。

很久没有做过视频了，难得的产物是 [Strato - Hexo 主题「Yun」版本宣传 PV](https://www.bilibili.com/video/BV17t4y1S7tz)，做了一些 MG 动画。

### 我的小站

<div class="success">

> 这一年我写了什么？

</div>

大部分的内容与上述项目息息相关。可以直接在 [2020 归档](https://www.yunyoujun.cn/archives/2020/) 中看到。

#### [教你如何从零开始搭建一个属于自己的网站](https://www.yunyoujun.cn/share/how-to-build-your-site/)

写的一个还算详尽的教程，至少是自己还是小白时希望能够看到的文章。

#### [👴 就是二次元，故尝试证明。](https://www.yunyoujun.cn/share/i-am-er-ci-yuan-and-try-to-prove/)

[「理科生坠入情网，故尝试证明。」](https://www.bilibili.com/bangumi/play/ep307476) 的简单影评与遐想，表达了作者对于二次元的喜爱和~~美好恋爱的向往~~。

好巧不巧的是，当时我发在了豆瓣上，并自动转发到了微博。而没多久微博不知为何竟被导师关注了。达成了微妙的社死氛围。

以至于后来被老师称作了「二次元的粉丝」。

#### [人生不是一场马拉松](https://www.yunyoujun.cn/diary/life-is-not-a-marathon/)

[路漫漫其修远兮](https://www.yunyoujun.cn/diary/after-entering-cuc/)的后续，也就是接受平凡。

#### [我与小镇与家](https://www.yunyoujun.cn/essay/i-and-town-and-home/)

回顾一点人生与思考未来。

#### [关于我打算当老师并报考教师资格证这件事](https://www.yunyoujun.cn/diary/try-to-become-a-teacher/)

决定成为一名人民教师。

#### [第三方评论系统之我见](https://www.yunyoujun.cn/share/third-party-comment-system/)

静态博客评论的确有很多难以取舍之处。

#### [ADV 游戏引擎计划](https://www.yunyoujun.cn/posts/make-an-avg-engine/)

一项宏伟的（画饼）与咕咕咕计划

#### [如何找到你朋友的社交账号](https://www.yunyoujun.cn/posts/find-npy-social-account/)

如题，一则看起来很闲的故事，但实际有着明面的 A 面与隐藏的 B 面。

---

其他的笔记则大致与上述代码项目相关，不再一一赘述。

#### 关于小站

内容方面，今年没有任何文艺方面的业余创作，小说也没有在投稿，画画也没有在联系，更多的时间花在了代码与番剧上。
而小站的内容也更加趋向于个性化的长文，过去一些零零散散的笔记则删掉或移动到了 [学习笔记 | 语雀](https://www.yuque.com/yunyoujun/notes/) 上。
我希望留在个人站点上的能是更加有趣/个性化的一些东西，而语雀之类的在线编辑也更适合笔记之类的内容。

其他方面，本以为只要和平相处，便不会有恶意对本存在感很低的小站下毒手。
但评论还是被刷了两次，所以也更换了几次评论系统。收到过一条不友好的评论，好在也仅此一条。

除此之外也从邮件/评论/还是其他平台收到了很多小伙伴的鼓励和认可。

![渊和](https://upyun.yunyoujun.cn/images/comment-from-yuanhe.jpg)

![bigbigbigbook](https://upyun.yunyoujun.cn/images/comment-from-bigbigbigbook.jpg)

真的非常非常感谢！

我也相信，人与人是联系在一起的，这也是网络诞生的初心。

![也无法避免和人产生联系](https://upyun.yunyoujun.cn/images/cannot-avoid-contact-with-people.jpg)

[最后祝大家新年快乐！](https://www.yunyoujun.cn/spring-festival/#/?name=%E5%A4%A7%E5%AE%B6)

<div class="danger">

> -完-

</div>

下面放送演职人员名单：

| 角色       | 演员             |
| ---------- | ---------------- |
| 云游君     | 云游君           |
| 猫耳女仆   | 小云             |
| 可爱女主角 | 可爱 JK 美少女   |
| 富婆       | 实验室的松树盆栽 |
| 伙伴       | 床               |
| ...        | ...              |

等等，是不是混入了奇怪的东西，可爱女主角真的存在吗？

## 猪的现实

所以这就结束了吗？并不，线上与线下如同两个平行世界，各自按照各自的规律行进着。

![线上与线下](https://upyun.yunyoujun.cn/images/online-and-offline.gif)_线上与线下_

但是除了还算丰富多彩的线上生活，线下的现实也在悄然改变着。

譬如 GitHub 绿点消失的那几天，与之相对的便是现实。

因为各类矛盾的心理，我将它藏在了最后。

实不相瞒，或者说显而易见，我属于线下唯唯诺诺，线上重拳出击的类型。如同线上人格一般，躲在屏幕背后，我便敢于把平时生活中不敢或者说没有地方倾诉的东西写出来。
称作懦弱、胆小、虚伪、中二也罢，我就是如此，今后可能也不会发生改变。

### 联系

那么回到 [如何找到你朋友的社交账号](https://www.yunyoujun.cn/posts/find-npy-social-account/) A 面的最初，我为何要寻找 LM 同学的豆瓣账号。

豆瓣此前几乎是我使用最少的社交平台，除了每次看完番剧与电影时会标记并写上无关痛痒的影评。
但凭此也许可以大致明白各自观影喜好的类型。

尽管在网上东奔西走，甚至羞耻地将胡思乱想的内心剖出示众，但在现实中我却几乎从未尝试过主动与人建立联系。

> 「你能明白吗，像白痴一样在大热天里，或者手指都冻僵了的大雪天里一个人骑车上学回家的辛苦。你们在那喊着好热啊好冷啊受不了啊之类的互相欺骗唬弄掩饰的时候我全靠一个人坚持过来。」——比企谷八幡

入学来，一个人吃饭，一个人上课，一个人做作业，如非必要定然一个人组队，甚至室友之间也没怎么说过话，在实验室里本就是外来人口且离门口最近的透明人，大家说话时也几乎不会插上话，以至于今年大家回顾去年实验室发生的相关事件时，我却时常仿佛从未在场过一般。

我几乎以为要这样过完我的研究生生活了。

疫情间，除了在家念的一学期，寒假与暑假连在了一起。其他的各种方面也都各种意义上发生了改变。比如我对未来的想法，人与人的联系。

当然我也无法确定，如果没有所谓的疫情，是否还是这样的结果。

在家的这段日子，L 老师给我们分配了开发任务，而我确实真的很感激 L 老师的收留之恩，也卖力地干着活儿。

> 说来惭愧，入校之初大致情况如[路漫漫其修远兮](https://www.yunyoujun.cn/diary/after-entering-cuc/)中所述，我大致如同武侠小说中没有人要的练武废物，无门可投。最后侥幸得 W 老师与 L 老师收留。

也许稍微有些自夸，但我确实负责了项目的大半工作。
我们拉了一个「前端摸鱼小组」，以便大家的对接工作。返校后，又有了一个「现充学习小组」。
可能借于此，大家（或者说只是我和大家）直到暑假之后，才真正熟络了起来。

返校后，由于师兄师姐已经毕业，空出了一个绝佳的~~摸鱼~~位置，得以从门口处逃离与老师面面相觑的工位。
透明的我也如同逐渐实体化一般。

![凡尔赛学习小组](https://upyun.yunyoujun.cn/images/versailles-study-group.jpg)

而我则更换了原先玉子的微信头像，以示自己的蜕变。（下一次换头像，就等下一个特殊的时刻到来吧。）

![如何在新班级里快速确认哪个人是二次元](https://upyun.yunyoujun.cn/images/how-to-find-er-ci-yuan-in-new-class.jpg)

![幼年北白川玉子](https://upyun.yunyoujun.cn/images/kitashirakawa-tamako-as-a-child.jpg)_我的旧微信头像_

此后还拉了 QQ 群，利用实验室空余的摄像头做了目标检测，并让我的机器人助手小云来播报老师位置的动态。
利用空闲的 VR 设备，买了节奏光剑给大家玩，虽然自己想玩是一部分原因。
因为中二（El Psy Congroo），买了件白大褂在实验室穿，并为之设计了个实验室 LOGO，大家还轮流拍了照。

> 白大褂也成功成为了我在实验室的工作服，原因自然源于 [命运石之门](https://baike.baidu.com/item/%E5%91%BD%E8%BF%90%E7%9F%B3%E4%B9%8B%E9%97%A8/10823) 与 [理科生坠入情网，故尝试证明。](https://baike.baidu.com/item/%E7%90%86%E7%A7%91%E7%94%9F%E5%9D%A0%E5%85%A5%E6%83%85%E7%BD%91%EF%BC%8C%E6%95%85%E5%B0%9D%E8%AF%95%E8%AF%81%E6%98%8E%E3%80%82/23243616)

我开始尽我所能地试图为实验室创造些有趣的东西，以加强和大家的联系。

> 干啥啥不行，整活第一名。

大家有时会客套地称赞着我厉害，而我也客套地回应着。因为我知道，大家都是这样和和气气地客套着，碍于各类的人际关系，从来不会说出自己的心里话。
畏惧现实人际关系的僵硬，而总是保持温柔。

> 所谓的和人好好应对的行为，不过就是欺骗自己，欺骗对方，对方知道自己被骗，自己也被对方所骗，这样的连锁循环而已。说到底也不过是虚伪、猜疑和欺瞒而已。
> ——比企谷八幡「我的青春恋爱物语果然有问题」

我确实还算享受这种虚假的状态。

只是一旦离开了群聊，离开了实验室的封闭空间，我又说不出话来。

在电梯即将关闭时，我必然不会赶上前去，而是装作恰巧路过的样子，等待下一次的电梯。即便晚间肚子很饿，也不会好意思去路边的小摊询问价格。
当聚会的同时在场人数超过一定阈值时，头脑便会发生宕机，说不出话来。
有时会想，啊绝对不要发现我，请完全把我当做不存在吧！却又有时会想，拜托，谁都好，随便和我说几句话，让我看起来不是那么奇怪吧。

以至于某次聚餐后，老师在某一周的例会上，径直让大家多和我说说话，并劝我去跑步改变自己。

我问大家要不要一起跑步，开始跟着大家一起去食堂吃饭，开始和大家每晚去操场散步。
周末的大家会在实验室里看部电影，或者玩把桌游。
明明已经是入学第二年了，却完成了人生许多第一次的壮举。
以至于连我都飘飘然有了现充的错觉。

> 人与人之间的联结，一定是一剂麻药。人会不知不觉地依赖这种关系，心也会跟着一点一点地被腐蚀。一段时间以后，如果不依赖别人的话，这个人将会变得什么都做不到。
> ——比企谷八幡「我的青春恋爱物语果然有问题」

2019 年的 11 月 30 日 VS 2020 年 11 月 30 日

![2019-11-30 | 一本日记](https://upyun.yunyoujun.cn/images/1diary-2019-11-30.jpg)_2019-11-30_
![2020-11-30 | 一本日记](https://upyun.yunyoujun.cn/images/1diary-2020-11-30.jpg)_2020-11-30_

### 猪的思春期

#### 错觉

我的错觉大抵也是因此而产生的。

除了小学外，从初中到高中，我的同桌从来都是男生，大学则基本宅在寝室，打交道的也只有室友。

虽然初入学的几年还有参与社团，但社恐的形象已根深蒂固，甚至留下了聚餐不敢与女生同桌的传说。

简而言之，我与现实女性打交道的次数屈指可数。

我喜欢可爱而有趣的人与事物，而现实中的前者显然往往是与绝缘体的我无缘的。
或者我也无法想象我到底如何能够与之产生联系。

![因为过往的人生与女生无缘](https://upyun.yunyoujun.cn/images/the-past-life-without-girls.jpg)

![我只要一靠近女生 就会紧张 心跳加速](https://upyun.yunyoujun.cn/images/the-heart-beats-faster-with-girl.jpg)

![又不是值得得意的事情](https://upyun.yunyoujun.cn/images/not-something-to-be-proud-of.jpg)

研究生时期，重心则从寝室转到了实验室，我们实验室的男女比例则差不多是 1:2。

![男生是那种只要女生对自己稍微好一点](https://upyun.yunyoujun.cn/images/one-of-the-three-illusions-in-life.jpg)

是的，我突然有些太飘了点。我想你差不多该猜到下面的内容会是什么了。我仿佛找到了希望能够成为自己人生轻小说女主角的人选。

尽管我看着甜甜的恋爱番剧，嘴上说着真好啊真好，🍋，但我却从来没有试图付出行动过，并且其实很享受所谓孤独的状态，而片面地认为今后的我也将如此。

![对处男稍微好一点他就会爱上你现象](https://upyun.yunyoujun.cn/images/be-nice-to-a-boy-he-will-love-you.jpg)_阿松_

但是不可知的某一天，看到 LM 同学的笑容，突然觉得很可爱，我开始希望更多地了解 LM 同学，想要与之建立联系。

因为入学分配到的 PC 是同款，而我们却都是 Mac 用户。
因为位置合适，老师的目标检测系统放在了她不用的主机上。
因为方向相同，老师经常会分派一些共同的任务。
因为同样喜欢睡懒觉。
因为同样可以不戴眼镜玩节奏光剑。
因为帮我夹起了我夹了半天没有夹起的菜。
因为她会不经意间坐到实验室聚餐 KTV 房间里手足无措孑然一身的我旁边。
因为她率先担当了我定制来的白大褂的模特。
因为她最先响应了我最初大家一起跑步/散步的提议，支持了第一次观影活动「紫罗兰永恒花园外传」的提案。
因为看我孤零零太可怜，陪我去散步。
因为吃米线的时候，会端坐到我旁边。
因为很可爱……

> 我讨厌温柔的女孩子。打一句招呼便会在意，互发邮件心中便会小鹿乱撞。在打电话来的日子一看见来信履历表情会不由的舒缓下来。但是，我知道。这叫做温柔。对我温柔的人也会对其他人温柔，这件事好像不知不觉就忘了。总是期待着，总是出差错，从何时开始就不再抱有希望。
> ——比企谷八幡「我的青春恋爱物语果然有问题」

我在实验室用米家小相机对准自己的座位拍了一周的延时摄影，一年后再看，却发现会出现在我的座位旁与我说话的也大概只有她。

#### 黎明

人和人是联系在一起的。

> 还有比老夫的感冒更麻烦的病菌在肆虐，已经是晚期啦！
> 似乎有比老夫更加饱受孤独之苦的年轻人。
> 你有什么头绪吗？
> 你想到的就是那个人了
>
> 还记得「窟嚓嚓」的故事吗？
> 那辆白色的火车头是有目的地的……
> 而你也同样存在一个终点站吧
>
> 是的
> **黎明**将近了
> 春宵苦短 前进吧 少女！

![LM将近了](https://upyun.yunyoujun.cn/images/dawn-is-near.jpg)

我与她相遇的那一天，应当是个春寒料峭之日。

> 也就是 [北线无战事](https://www.yunyoujun.cn/diary/after-2nd-postgraduate-re-exam/) 之时。

那是入学时的复试，微不足道的我坐在等候处没有任何值得记住的存在感。
而她退出面试考场时则似光芒万丈，耀眼无比。我决定将其定义为「黎明能量」。

父母询问了复试事宜，还随口问了句漂亮吗，我迟疑了片刻，却点了点头。

私下则暗道，大概今后便如相交后的直线一般，自此之后不会再产生交集。就像往常许许多多的事情一样。

却未曾想，我们之间仍旧产生了交集，人与人的联系是奇妙的。

我的人生是紊乱的，似乎总有很多个岔路口供我选择，事实上无论过去的哪一个环节发生了偏差，我都不会在这个时间出现在这所学校，这个实验室，与她相遇。

> 黎明能量：LM 同学身边散发的耀眼光芒

我开始在意起来。开学前的唯一想法便是，不想上学。

在此之后，我悄悄地将原先 GitHub 与博客头像旁 `不想上学 😭` 的 status 修改为了 `Fall in love. 💘`。

因为连续 24h 没有见到，而如同奥特曼胸前闪烁的红灯一般「黎明能量」不足。

会因为奇怪的话语没有得到回复，而想自己是不是被讨厌了。

![比你喜欢的人回复快](https://upyun.yunyoujun.cn/images/reply-faster-than-someone-you-love.jpg)

> 只要稍微打个招呼就会胡思乱想，要是互相发短信，心中还会起波澜，接到对方来电的那一整天，都会对着来电记录傻笑，可是我知道，那只是温柔，对我温柔的人对别人也同样温柔，这种事差点就忘记了，如果说真相是残酷的，谎言肯定是温柔的，所以温柔是谎言，一次又一次期待，一次又一次落空，不知从何时开始，便不再怀抱希望。
> ——比企谷八幡「我的青春恋爱物语果然有问题」

是的，因为她太温柔了，以至于自己总会一厢情愿的误解与自作多情。

而我则如同「春宵苦短，少女前进吧」中的主人公，试图实施「进她眼」作战。尽管偶尔吹响冲锋的号角，也均以失败告终。

![升入大学院来将求职活动暂且延后](https://upyun.yunyoujun.cn/images/night-is-short-no-work.jpg)

> 升入大学院来将求职活动暂且延后
> 不懂当机立断，也没什么才能
> 没有存款 没有力气 也没有韧劲
> 没有人望 也不是小猪般让人想贴脸蛋的可爱男孩

![要什么没什么](https://upyun.yunyoujun.cn/images/nothing-to-ask-in-the-world.jpg)

> 我在寻找自己不知被埋没在哪里的宝贵才能时
> 想起好像 1 年级时把才能的储蓄罐藏在了抽屉里

![从零做起 一点一滴](https://upyun.yunyoujun.cn/images/start-from-zero-bit-by-bit.jpg)_储蓄罐中的纸条_

> 与她相遇一年有余
> 我等一味强化掩埋护城河的功能
> 偏离了正确的恋爱道路
> 堕落为「护城河掩埋永动机械」的原因是什么？
> 因为连直接打探她的心意都不敢
> 是个值得唾弃的胆小鬼。
> 那是不是实际上根本没有爱上她啊
> 那样就不至于太丢脸了！
> 那既然说爱她，对她又了解多少呢？
> 除了她几乎被盯穿的后脑勺 不是毫无了解吗
> 利用她的存在来填补内心空虚

---

> 这种懦弱的动机实在可耻
> 像不倒翁一样脸红腮鼓地面壁思过吧

![不要被世间风评所摆布](https://upyun.yunyoujun.cn/images/dont-be-manipulated-by-the-world.jpg)

> 世间有种认为大学生就应该有恋人的邪恶偏见
> 但受这种偏见驱使 埋头乱撞 宁滥勿缺
> 造成了什么货色都有恋人这种诡异现象
> 这只会加剧偏见的力量

---

> 他们只是想排解孤独罢了！

---

> 难道不是因为看不到未来 所以逃避到恋爱中吗

---

> 卑鄙小人！咬紧牙关吧！
> 应该马上去探明她的心意

---

> 这不行！要冷静思考！

---

> 说起来，谈恋爱这种细致入微的事情能搞定吗？

---

> 笨蛋，能个屁啊

---

> 仅仅是想摸一两下乳房这种下流欲望上了头吧

---

> 确实下流的欲望满脑子都是 但也不只是这样啊
> 应该还有很多 还有更美好的东西

---

> 要是粉身碎骨了该怎么办

---

> 哪怕真的能和她实现首次约会
> 当晚如果她投怀送抱
> 你打算如何应对呢

---

> 她绝不是那种速食泡面一样的女性

---

> 如果她当晚送出胸部给你摸 你能拒绝吗

---

> 那倒是不会的...

---

> 你看看吧 还不是个下流胚子吗
> 快给她跪下道歉

---

> 卑鄙！叛徒！白痴！流氓！莽撞！

---

> 肃静！但是各位！
> 如果真要考虑到那样巨细无靡的话
> 男女起初究竟是如何开始交际的呢
> 诸君追求的那种纯爱型的开端原本就是不可能的
> 越是多方取证并彻底地自我分析
> 我们岂不越是会止步不前吗
> 性欲也好 虚荣也好 逐流也好 妄想也好 愚蠢也好
> 依然清浊并济 即使面临的是失恋的深渊
> 有时候不是仍应该举身跃向黑暗吗

---

> 能做到的话就不用烦恼了

---

> 此时此刻不跳出去
> 岂不就永远都会困在昏暗青春的莫比乌斯环里了吗？
> 将对她的心意一直尘封在心底
> 明天若孤独地死去的话 有谁敢说自己不后悔呢！

---

> 有就他妈的给我站出来！！！

---

> ———「春宵苦短，少女前进吧」

我的脑海中也时常如此般冒出众多的我，开始争吵。

但我却不知道自己何时能迈出那一步。

### 家

在我寒假回家没多久，便突然得知姐姐年底结婚的消息。而我却基本没有得到任何风声。
父母则抱怨我因为基本没有和家里电话联系。但我知道，即便如此，我也无话可说。
事实上，客套话从来都是留给亲人以外的人的。倘若哪天，我突然对着洗衣做饭的爸爸和包饺子的妈妈说一句谢谢，准是要被怀疑今天是不是没睡醒。

姐姐的婚礼很快便举行了，父亲让我祝词。
而我说完了客套话，则念了句 12 月放到 QQ 个性签名的话，并附言希望你们今日的心情也能如此长存。

> 一辈子很短，如白驹过隙，转瞬即逝。可这种心情很长，如高山大川，连绵不绝。——吕秀才「武林外传」

这句话是武林外传刚开始，吕秀才对小郭说的话。
前一句话则是，一旦喜欢上谁，就别无所求，只要每天能见到她，就已经觉得很庆幸了。于是小郭问，你就这么点要求啊，那你这种心情能保持多久啊？

拖婚礼的福，家中一段时间的零食饮料不愁。但也因此与许多亲友相逢，而问候的话必然是引到我的未来之上，让人哑然。

姐姐去对方家过年，家里则仿佛成了三口之家。

大年三十，回老家贴对联的也变成了只有我和我爸。（堂兄也去女方家送礼了。）

![对联](https://upyun.yunyoujun.cn/images/spring-couplets-at-old-home.jpg)

[人生不是一场马拉松](https://www.yunyoujun.cn/diary/life-is-not-a-marathon/#终点) 里的桃花早已凋零。

不知道闲暇地看着家后池塘打水漂与任凭花开花落云卷云舒的日子什么时候能够实现。

![家后的池塘](https://upyun.yunyoujun.cn/images/pond-and-fields-behind-home.jpg)

而临近过年，也不再像过去一样一家围在电视前看春节晚会。

爸妈看了会儿电视，便上床睡觉。

我和大学室友则一起玩了一年一度的和平精英，顺带放了烟花。

![PUBG 烟花](https://upyun.yunyoujun.cn/images/pubg-mobile-with-friends.jpg)

遗憾的是最高一次也只获得了第二名，而没有像去年一样顺利吃鸡。

尽管也鸽掉了许多其他的计划，心境、现况还是未来目标也发生了许许多多变化，但总的来说，2020 年是还算开心的一年。但也因此，我变得更贪心起来，有着更多的愿望想要实现。

猪的出栏时间一年足矣，而明年的我也差不多出栏，决定起最终的去向。

吃了睡，睡了吃的猪样生活，也会一去不复返。

为了尽管未必能实现的目标尽力去做，遵循本心去做开心有趣但未必有收益的事情，期盼可能永远不会实现的愿望，也没有什么不好的。

因为，做猪呢，最重要的是开心！

> 啊，对了，虽然要做特立独行的猪，但我其实是属牛的来着。所以大年初一的胖次是红色的。（~~滚啊！谁要知道这个啊！~~）

Q.E.D.