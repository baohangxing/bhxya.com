---
title: '从背包问题开始解决动态规划'
date: '2021-11-21'
tags: ['Algorithm', 'Dynamic programming']
draft: false
summary: '背包九讲是对于动态规划的算法问题的很好的总结和归纳，本文从背包问题开始，并尝试解决Leetcode上的经典动态规划题目'
---

# 从背包问题开始

## 背包问题

[**背包问题**]([背包问题 - 维基百科，自由的百科全书 (wikipedia.org)](https://zh.wikipedia.org/wiki/背包问题) )（Knapsack problem）是一种[组合优化](https://zh.wikipedia.org/wiki/组合优化)的[NP 完全](https://zh.wikipedia.org/wiki/NP完全)问题。[tianyicui 的 背包问题九讲 ](https://github.com/tianyicui/pack)将该问题结合动态规划进行了九小章节的讲解，本文不再复述，只给出思考和代码实现。

### 01 背包

> 有 `N` 件物品和一个容量为 `v` 的背包。放入第 `i `件物品耗费的费用是 `Ci`，得到的价值是 `Wi`。
> 求解将哪些物品装入背包可使价值总和最大。

`F[i, v]`表示使用`i`件物品放入`v`容积背包中能获得最大价值

其状态转移方程便是：` F[i, v] = max{F[i − 1, v], F[i − 1, v − Ci ] + Wi}`

实现的关键在于：使用倒序循环`v`消除了在第`i`个物体的每种价值可能性的取舍上**低价值对于高价值**的影响

```js
function maxValueIn01Pack(V, costs = [], values = []) {
  let dp = new Array(V + 1).fill(0), //dp[x]表示背包占用x体积能装下的最大的价值
    len = costs.length
  for (let i = 0; i < len; i++) {
    for (let j = V; j >= costs[i]; j--) {
      //对于每一种占用的情况考虑那或者是不拿
      if (j - costs[i] >= 0) dp[j] = Math.max(dp[j], dp[j - costs[i]] + values[i])
    }
  }
  return dp[dp.length - 1]
}
```

### 完全背包

> 有 `N` 件物品和一个容量为 `V` 的背包。每种物品都有无限件可用。放入第 `i` 件物品耗费的费用是 `Ci`，得到的价值是 `Wi`。
> 求解将哪些物品装入背包可使价值总和最大。

正循环`v`使得物品有无限件可拿

```js
function maxValueInCompletelyPack(V, costs = [], values = []) {
  let dp = new Array(V + 1).fill(0), //dp[x]表示背包占用x体积能装下的最大的价值
    len = costs.length
  for (let i = 0; i < len; i++) {
    //和01变化之处, 正方向使得物品有无限件可用的可能
    for (let j = costs[i]; j <= V; j++) {
      if (j - costs[i] >= 0) dp[j] = Math.max(dp[j], dp[j - costs[i]] + values[i])
    }
  }
  return dp[dp.length - 1]
}
```

### 多重背包

> 有 `N` 种物品和一个容量为 `V` 的背包。第`i`种物品最多有 `Mi `件可用，每件耗费的
> 空间是 `Ci`，价值是 `Wi`。求解将哪些物品装入背包可使这些物品的耗费的空间总和不超
> 过背包容量，且价值总和最大。

将数量不为 1 的物品平铺就是`01背包`了，使用循环模拟了这种操作

```js
function maxValueInMultiplePack(V, costs = [], quantities = [], values = []) {
  let dp = new Array(V + 1).fill(0), //dp[x]表示背包占用x体积能装下的最大的价值
    len = costs.length
  //类似01背包
  for (let i = 0; i < len; i++) {
    for (let j = V; j >= costs[i]; j--) {
      //和01背包的不同在于 有了数量的限制 遍历每种选择的情况
      for (let num = 1; num <= quantities[i]; num++) {
        if (j - num * costs[i] >= 0) {
          dp[j] = Math.max(dp[j], dp[j - num * costs[i]] + num * values[i])
        }
      }
    }
  }
  return dp[dp.length - 1]
}
```

### 混合背包

> 如果将前面 1、2、3 中的三种背包问题混合起来。也就是说，有的物品只可以取一
> 次（01 背包），有的物品可以取无限次（完全背包），有的物品可以取的次数有一个上限
> （多重背包）。应该怎么求解呢？

分情况区别处理

```js
function maxValueInMixedPack(V, costs = [], quantities = [], values = []) {
  let dp = new Array(V + 1).fill(0), //dp[x]表示背包占用x体积能装下的最大的价值
    len = costs.length
  for (let i = 0; i < len; i++) {
    if (quantities[i] === 'o') {
      //01背包
      for (let j = V; j >= costs[i]; j--) {
        if (j - costs[i] >= 0) dp[j] = Math.max(dp[j], dp[j - costs[i]] + values[i])
      }
    } else if (quantities[i] === 'a') {
      //完全背包
      for (let j = costs[i]; j <= V; j++) {
        if (j - costs[i] >= 0) dp[j] = Math.max(dp[j], dp[j - costs[i]] + values[i])
      }
    } else {
      //多重背包
      for (let j = V; j >= costs[i]; j--) {
        for (let num = 1; num <= quantities[i]; num++) {
          if (j - num * costs[i] >= 0) {
            dp[j] = Math.max(dp[j], dp[j - num * costs[i]] + num * values[i])
          }
        }
      }
    }
  }
  return dp[dp.length - 1]
}
```

### 二维费用的背包问题

二维费用的背包问题是指：对于每件物品，具有两种不同的费用，选择这件物品必
须同时付出这两种费用。对于每种费用都有一个可付出的最大值（背包容量）。问怎样
选择物品可以得到最大的价值。

> 设第 `i `件物品所需的两种费用分别为 `Ci `和 `Di`。两种费用可付出的最大值（也即两
> 种背包容量）分别为 `V` 和 `U`。物品的价值为 `Wi`。

费用加了一维，只需状态也加一维。基础是二维的 01 背包，在这基础上 完全 多重 混合其实也是类似，乃至于三维，四维，只要摸清了状态转移。

` F[i, v, u]` 表示前 `i `件物品付出两种费用 分别为 `v` 和 `u `时可获得的最大价值。

状态转移方程就是： `F[i, v, u] = max{F[i − 1, v, u], F[i − 1, v − Ci , u − Di ] + Wi}`

```js
function maxValueInDoubleCostPack(V, U, costsV = [], costsU = [], values = []) {
  let dp = new Array(V + 1).fill(0).map((x) => new Array(U + 1).fill(0)),
    //dp[x][y]表示背包占用x体积(V)和y体积(U)能装下的最大的价值
    len = costsV.length
  for (let i = 0; i < len; i++) {
    for (let k = U; k >= costsU[i]; k--) {
      for (let j = V; j >= costsV[i]; j--) {
        if (j - costsV[i] >= 0 && k - costsU[i] >= 0) {
          dp[j][k] = Math.max(dp[j][k], dp[j - costsV[i]][k - costsU[i]] + values[i])
        }
      }
    }
  }
  let res = 0
  for (let x of dp) {
    res = Math.max(res, ...x)
  }
  return res
}
```

### 分组的背包问题

> 有 `N` 件物品和一个容量为 `V` 的背包。第 `i` 件物品的费用是 `Ci`，价值是 `Wi`。这些
> 物品被划分为 `K` 组，每组中的物品互相冲突，最多选一件。求解将哪些物品装入背包
> 可使这些物品的费用总和不超过背包容量，且价值总和最大。

这个问题变成了每组物品有若干种策略：是选择本组的某一件，还是一件都不选。

也就是说设 `F[k, v]` 表示前 `k` 组物品花费费用 `v` 能取得的最大权值，则有： `F[k, v] = max{F[k − 1, v], F[k − 1, v − Ci ] + Wi | item i ∈ group k}`

```js
function maxValueInGroupPack(V, costs = [], values = []) {
  let dp = new Array(V + 1).fill(0), //dp[x]表示背包占用x体积能装下的最大的价值
    len = costs.length
  for (let i = 0; i < len; i++) {
    for (let j = V; j >= 0; j--) {
      for (let k = 0; k < costs[i].length; k++) {
        //对于每一种占用的情况考虑那或者是不拿
        if (j - costs[i][k] >= 0) dp[j] = Math.max(dp[j], dp[j - costs[i][k]] + values[i][k])
      }
    }
  }
  return Math.max(...dp)
}
```

### TODO 后面都是难的了 待更
