---
title: Minecraft 常用命令
date: 2019-03-01 21:25:29
updated: 2019-03-01 21:25:29
tags:
  - Minecraft
  - 笔记
categories:
  - 云游的小笔记
---

# Command Note

## Intro

记录 Minecraft 中常用的命令

<!-- more -->

## Command

### gamemode

/gamemode

```sh
# Example
# 改变红色组别所有玩家的游戏模式为创造模式
/gamemode creative @a[team=Red]
```

|Params|Description|
|-|-|
|@p|距离最近的玩家|
|@r|随机玩家|
|@a|所有玩家|
|@e|所有实体|

|Params|Description|
|-|-|
|m|游戏模式|
|team|队伍|
|r|小于半径区域|
|rm|大于半径区域|
|type| 实体种类 |

- `[r=R]` 只选择以命令的执行处为中心，半径小于R的区块里的目标。
- `[rm=RM]` 只选择以命令的执行处为中心，半径大于RM的区块里的目标。

### scoreboard

```sh
/scoreboard teams add <队伍名称> [显示名称]
```

```sh
/scoreboard teams remove <队伍名称>
```

```sh
# 加入队伍
/scoreboard teams join <队伍名称> [玩家]
```

```sh
# 设置
/scoreboard teams option <队伍名称> <选项> <值>
```

Example:

```sh
/scoreboard teams option <队伍名称> color red
/scoreboard teams option <队伍名称> friendlyfire false
/scoreboard teams option <队伍名称> nametagVisbility hideForOtherTeams
```

| Params | Description | Options | Default |
|-|-|-|-|
| friendlyfire | 队友伤害 | true/false | true |
| nametagVisbility | 名称标签可见形式 | never/hideForOtherTeams/hideForOwnTeam/always | always |
| deathMessageVisibility | 死亡时如何显示死亡讯息 | never/hideForOtherTeams/hideForOwnTeam/always | always |

可选颜色

- black(黑色)
- dark_blue(深蓝色)
- dark_green(深绿色)
- dark_aqua (深水蓝色)
- dark_red(深红色)
- dark_purple(深紫色)
- gold(金色)
- gray(灰色)
- dark_gray(深灰色)
- blue(蓝色)
- green(绿色)
- aqua(水蓝色)
- red(红色)
- light_purple(亮紫色)
- yellow(黄色)
- white(白色)
- reset(恢复到预设的颜色)

## Reference

- [指令(游戏[Minecraft]中的运算机制)](https://baike.baidu.com/item/指令/18765029)