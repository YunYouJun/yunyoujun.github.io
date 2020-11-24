---
title: 怎样找到你朋友的社交账号
date: 2020-11-12 11:46:38
updated: 2020-11-12 11:46:38
tags:
  - 爬虫
  - 深度学习
  - 前进吧
categories:
  - 云游的小日记
---

前些日子，其实就是咱考完教师证（10.31）的第二天，便要前往出差。

晚间也成功地错过了万圣节。但想来这种现充的节日，也本就与我无缘。故也无从惋惜。

尽管是流水账，但勉强作为日记记录下来，以作为引入正题的前言。

> 春宵苦短，少女前进吧！

<!-- more -->

## 旅程

11.01

与同行的小伙伴 LM 约定好早间地铁站汇合，但其同样有睡懒觉的习惯，且此后发现闹钟定成了下午……（仿佛看到某个过去的自己）

![我们是兄弟，我怎么会🐦你呢](https://cdn.jsdelivr.net/gh/YunYouJun/cdn/img/meme/we-are-brothers.jpg)

于是改签了后续的高铁，座位也就此错开。

抵达目的地，L 老师与她的爱人也是 L 老师接我们。

> 顺带一提，因为此次所见之人 L/Y/Z 姓众多，我愿称之为 LYZ 三方会谈。

主要活动便是，吃饭，围观，吃饭，围观，吃饭，围观……（偶尔干点体力活）

遵循惯例，吃饭时自动开启自闭模式。全程靠 LM 同学接话。

此外也很害怕被提到吃素而受特别关照引人注目。

略去无关紧要的琐事，简而言之，因为出差事项无聊，开始探寻同行小伙伴社交账号的活动。

> 所谓的和人好好应对的行为，不过就是欺骗自己，欺骗对方，对方知道自己被骗，自己也被对方所骗，这样的连锁循环而已。说到底也不过是虚伪、猜疑和欺瞒而已。

## 探寻

因为鄙人各个平台均基本使用同一个 ID，且基本没有什么重名，所以基本属于裸奔状态。

而 LM 同学则声称各平台均使用了不同 ID，导致我无从下手。尝试使用相同 ID 在各平台检索，得到的似是而非的结果也被一一否定。

> 因为有些不服输，使用了特殊手段加谷歌/百度检索搜寻到了知乎账号，但也只有知乎账号。

![小狗努力.jpeg](https://i.loli.net/2020/11/21/GznUCVA9OqEMokf.jpg)

至于微博账号，苦觅不得，决定放弃。

最后由于是太过可怜，陆续获得了一些关于豆瓣账号的提示信息。

- 豆瓣线索 1: 头像下半部分灰色调
- 豆瓣线索 2: 头像中有游戏手柄
- 豆瓣线索 3: [快乐 memers 小组](https://www.douban.com/group/702484)

![游戏手柄.png](https://i.loli.net/2020/11/21/5hBlGJSt1mbzHjv.png)

## 开整

终于进入正题。

想着既然有了这些线索，那么便可以尝试寻找一下。

因为想着暴力搜索或许是最简单的方式，于是我决定先启用 A 方案——人工检索（即手动翻页查看用户头像）。

在我进行检索之日，快乐 memers 小组共有 11534 位成员，豆瓣小组成员每页展示 35 人，共 330 页。
但很遗憾在翻完了 330 页的小组成员，也许是过于草率，并未能找到类似的头像。

此时，我也成功意识到，「人类是有极限的。」

于是我决定启用 B 方案。

爬取下小组中所有成员的头像及对应信息，跑一个目标检测的模型检测图像中是否存在游戏手柄，以及可以计算图像下半部分的饱和度与亮度均值，排除掉亮色的图片。

新建私有仓库 [find-lm](https://github.com/YunYouJun/find-lm)（404 警告），开整。

### 爬取豆瓣

豆瓣的反爬规则是出了名的。而其官方 API 也在前几年全部神隐，第三方的一些代理或文档如 [douban-api-docs](https://github.com/zce/douban-api-docs) 也逐渐消亡殆尽。因此只得自行去 HTML 页面爬取。

首先豆瓣小组成员页面的链接格式是 `https://www.douban.com/group/702484/members?start=0`。可以通过设置 `start` 参数进行查询，而每页最多显示 35 位成员。

所以我决定先用 [cheerio](https://github.com/cheeriojs/cheerio) 通过 class 选择器去获取成员列表，并记录几个最重要的信息，如 UID、姓名、城市。当然最重要的是头像啦，但是成员列表中的头像其实是缩略图，并不清晰。为了此后的处理，一定是获取大图更为合适。

一般情况下，用户的头像其实和之前爬出来的 UID 有关。

```js
/**
 * 根据 UID 获取大头像
 * @param {*} uid 用户ID
 */
function getAvatarUrlByUid(uid) {
  return `https://img2.doubanio.com/icon/ul${uid}.jpg`;
}
```

但是测试时，发现又并非如此。此前获取 UID 其实是通过用户的个人链接进行截取所得。

```js
/**
 * 根据链接获取 UID
 * @param {string} link 链接
 */
function getUidByLink(link) {
  const url = new URL(link);
  const uid = url.pathname.split("/")[2];
  return uid;
}
```

但是，有些用户其实会自定义用户名，比如我就喜欢自定义域名，我的豆瓣主页便是 <https://www.douban.com/people/yunyoujun/>，最后的 ID 为 `yunyoujun` 而非一般的数字 ID，而我无法确定 LM 同学是否也有这个习惯，所以最好也做一下兼容处理。

所以一般数字 ID 的用户头像原图可以通过简单拼接链接获取，而自定义域名的用户还需要再访问一下用户页面进行获取。

```js
/**
 * 根据用户 url 获取高清的头像
 * @param {string} url
 */
async function getAvatarByLink(url) {
  const html = await axios.get(url).then((res) => {
    return res.data;
  });
  const $ = cheerio.load(html);
  const avatarUrl = $(".basic-info img").attr("src");
  return avatarUrl;
}
```

OK，万事俱备。整一个循环来获取用户信息，并下载头像吧！

（对了，因为防止被关小黑屋，一定要慢一点爬……）

至于我为什么知道？（爬取个人用户信息的时候，还需要提供一下用户的 Cookie，可以在登录后的豆瓣页面用控制台工具找到。）

![403-Forbidden.png](https://i.loli.net/2020/11/21/njtpChGLiEWeFwv.png)

![你的账号已被锁定.png](https://i.loli.net/2020/11/21/UjlBAaIOvhWxG5f.png)

```js
/**
 * 睡觉！
 * @param {*} ms
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

/**
 * 获取所有成员
 */
async function getAllMembers(groupId) {
  const totalPages = 330;
  let memberList = [];
  for (let i = 0; i < totalPages; i++) {
    // 休息一下
    await sleep(5000);
    console.warn("休息五秒，防止太快，被关小黑屋！");
    console.info(`爬取第 ${i + 1} 页...`);

    const list = await getMemberListByPage(groupId, i);
    memberList = memberList.concat(list);
  }
  return memberList;
}
```

2826s 后完成了该项工作。用户信息的 JSON 数据 683KB，头像的图片一共为 151.7MB。（搜完咱会删掉的～）

![2826s.png](https://i.loli.net/2020/11/21/ZFnATt5rpCMOz8R.png)

![members.jpeg](https://i.loli.net/2020/11/21/Z9bwKFvCPga5Hxl.jpg)

想来 LM 同学的头像也应当位于其中。

于是可以进行后续的过滤工作。

### 准备训练数据

本来想使用 [Bing Image Search API](https://www.microsoft.com/en-us/bing/apis/bing-image-search-api) 来获取做训练的图片。

> 突然发现微软竟然还支持 GitHub 登录了。

但是咱没有信用卡……，但是天无绝人之路，搜到了[面向学生的 Azure](https://azure.microsoft.com/zh-cn/free/students/)，似乎使用学校邮箱，便可无需信用卡。

但是发现使用学校邮箱也还是不行。

还是老老实实地自己爬吧！

写了一半，突然想起可以试试网上有没有现成的轮子。

[BaiduImageSpider](https://github.com/kong36088/BaiduImageSpider)

### 过滤

顺带借机学习一下 [Tensorflow.js](https://www.tensorflow.org/js/)。

<details>
<summary></summary>

</details>

## 终点

旅程终有尽时。

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

![LM将近了.png](https://i.loli.net/2020/11/21/VkqveQMHoWAgfuh.png)

---

To Be Continued.

<!-- Q.E.D. -->
