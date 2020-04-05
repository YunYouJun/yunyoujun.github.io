---
title: 导出《你的日记》
date: 2019-01-31 16:38:03
updated: 2019-01-31 16:38:03
tags:
  - 笔记
categories:
  - 云游的小笔记
---

## 前言

待补充...

...

<!-- more -->

## 正文

首先，下载免费的抓包工具 [fiddler](https://www.telerik.com/fiddler) 与请求调试工具 [Postman](https://www.getpostman.com/)。

### Fiddle 配置

`Tools > Options...`

跳出弹框

`HTTPS` 面板

可见默认端口为 `8888` (可自定义)

- [x] Decrypt HTTPS trafic

一路同意，出现新选项

- [x] Ignore server certificate errors (unsafe)

点击 OK, 重启。

### PC 配置

进入 `Windows` 命令行， 输入命令，查看本机 IP 地址 (IPv4 地址)

```sh
ipconfig
```

```sh
无线局域网适配器 WLAN:

   连接特定的 DNS 后缀 . . . . . . . :
   本地链接 IPv6 地址. . . . . . . . : fe80::9cb2:89dc:46d1:52c7%19
   IPv4 地址 . . . . . . . . . . . . : 192.168.31.87
   子网掩码  . . . . . . . . . . . . : 255.255.255.0
   默认网关. . . . . . . . . . . . . : 192.168.31.1
```

### 手机配置

进入已连接的局域网 `WIFI` 设置手动代理

主机名为方才查看到的 `IPv4` 地址 `192.168.31.87` (因人而异) ，端口为方才默认的 `8888`

![config-phone](https://cos.yunyoujun.cn/blog/posts/use-fiddle-export-your-diary-1.png)

可手机直接访问 IPv4:端口号(例如：`192.168.31.87:8888`) ，如有返回页面则说明设置成功。

### Operation

打开应用，操作刷新。

观察排除点一些系统的请求，fiddle 界面中含有一条这样的链接。

```sh
CONNECT http://ohshenghuo.com:443
200 Connection Established ()
```

访问地址后，我发现使用 `你的日记` 的账号密码便可直接登录。

注销回到登录界面，`F12` 进入谷歌浏览器控制面板进行调试。

`Sources` 面板中有网站的静态资源，其中 js 可以直接看出使用了 JQuery ，没有进行混淆压缩，可以直接分析代码。

其中与登录表单相关的部分代码

```js
$.post("/api/login/", form.serialize(), function (e) {
  if (e && e.token) {
    OhUtil.login(e.token);
  } else {
    $("#login-form .msg_error").text("邮箱或密码输入错误").show();
    $("#login-form .submit").removeClass("inactive").attr("value", "登录");
  }
});
```

由此可见登录 api 为 `api/login`

表单内容进行 [`serialize`](https://api.jquery.com/serialize/#serialize) (jQuery 方法，序列化)

| KEY                 | VALUE |
| ------------------- | ----- |
| csrfmiddlewaretoken | -     |
| email               | -     |
| password            | -     |

```text
csrfmiddlewaretoken=ZcJkWtMdfyjBNKxp3ms0i8REkTJcSKw4&email=xxx&password=xxx
```

表单还含有 csrfmiddlewaretoken （可以在 html 页面中的登录表单看到,如下），用来防止跨站请求伪造。（也就是防止我们使用 Postman，但是我们可以手动加入表单）

```html
<input
  type="hidden"
  name="csrfmiddlewaretoken"
  value="ZcJkWtMdfyjBNKxp3ms0i8REkTJcSKw4"
/>
```

`Network` 面板可查看到请求头内容和表单数据等。（csrfmiddlewaretoken 也可在此处的 Form data 中看到）

接下来使用 [Postman](https://www.getpostman.com/) 进行 API 调试。

便可成功获取到 token 等相关信息。

可继续尝试使用拉取日记等信息，不再赘述。

### 《你的日记》 API 整理

API Address: <https://ohshenghuo.com/api/>

[你的日记 API DOC - Postman](https://documenter.getpostman.com/view/3326320/Rztmr8pE)

```sh
GET
```

#### Get Diary

##### Get Diary By Id

```url
GET diary/:diaryId
```

Example

```url
diary/8808906/
```

Response

```json
{
  "version": "3bf998217a5b712eb4d5e3f7a9baf87f",
  "diary": {
    "deleteddate": "None",
    "status": "0",
    "mood": "",
    "title": " 少女生活小百科",
    "space": "boy",
    "ts": "2018-12-22 10:14:52+00:00",
    "content": "xxx",
    "date_word": "40天前",
    "weather": "",
    "user": "177636",
    "createddate": "2018-12-22",
    "createdtime": "2018-12-22 10:14:52+00:00",
    "id": "8808906",
    "weekday": "星期六"
  },
  "error": 0
}
```

##### Get Diary By Month

```url
GET diary/simple_by_month/:year/:month/
```

Example

```url
diary/simple_by_month/2019/1/
```

Response

```json
{
  "version": "845d9a3c64d93623e05e2ab7735c2804",
  "diaries": {
    "2019-01-29": 9329359,
    "2019-01-02": 8974069,
    "2019-01-01": 8966164
  },
  "error": 0
}
```

| Attribute  | Description           | Type   | Default |
| ---------- | --------------------- | ------ | ------- |
| diaries    | 包含当月各天日记的 ID | Object | -       |
| yyyy-MM-dd | 当月日记 ID           | Number | -       |

...

---

To Be Continued.
