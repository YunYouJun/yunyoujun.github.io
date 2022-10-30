---
title: Web Notification 为博客推送通知（咕了）
date: 2020-05-30 03:02:13
updated: 2020-05-30 03:02:13
tags:
categories:
---

<!-- more -->

## Web Notification

什么是 Web Notification？

它可以通过浏览器给你推送消息通知。

- [开放式平台](https://developer.mozilla.org/zh-CN/docs/Web/API/Push_API)
- [使用 Web Notifications](https://developer.mozilla.org/zh-CN/docs/Web/API/notification/Using_Web_Notifications)

## 其他

我一开始是想使用 [webpushr](https://www.webpushr.com/)，但是建立好 Site 后不知为何总是显示 404。

![webpushr-404](https://r2.yunyoujun.cn/images/webpushr-404.jpg)

于是转为使用了 [PushBots](https://app.pushbots.com/)。（而 GitHub 学生账号会送 6 个月的高级会员。）

所以并没有使用 [hexo-web-push-notification](https://github.com/glazec/hexo-web-push-notification) 这个插件。

### PushBots

为博客添加该功能的方式非常简单。你直接按照 PushBots 给的引导方式来安装它即可。

## 后话

PushBots 也慢慢积累了有一千七百多用户，也早已超过 PushBots 免费推送的用户额度。

以及我真的需要通知吗？

为每位用户添加推送真的是有必要的吗？

网页应当是自由的，而真正对博客有兴趣的人，大可通过 [RSS](https://www.yunyoujun.cn/atom.xml) 或是 [feedly](https://feedly.com/) 等平台进行订阅。

而我自添加该功能以来，使用过的次数也屈指可数。何必留着影响体验和速度。

最终我决定去除了它。

---

Q.E.D.
