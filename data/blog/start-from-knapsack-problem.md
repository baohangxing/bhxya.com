---
title: '从背包问题开始解决Leetcode上的类似问题'
date: '2021-11-21'
tags: ['Algorithm', 'Dynamic programming']
draft: false
summary: '背包九讲是对于这一类的动态规划的算法问题的很好的总结和归纳，本文从背包问题开始，并尝试解决Leetcode上的类似的问题'
---

## 背包问题

[背包问题](https://zh.wikipedia.org/wiki/背包问题) （Knapsack problem）是一种[组合优化](https://zh.wikipedia.org/wiki/组合优化)的[NP 完全](https://zh.wikipedia.org/wiki/NP完全)问题。[tianyicui 的 背包问题九讲 ](https://github.com/tianyicui/pack)将该问题结合动态规划进行了九小章节的讲解，本文不再复述，只给出思考和代码实现。

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

分组的背包问题将彼此互斥的若干物品称为一个组，这建立了一个很好的模型。由分组的背包问题进一步可 定义**“泛化物品”**的概念，十分有利于解题。

### 有依赖的背包问题

> 这种背包问题的物品间存在某种“依赖”的关系。也就是说，物品 `i` 依赖于物品 `j`，
> 表示若选物品 `i`，则必须选物品 `j`。为了简化起见，我们先设没有某个物品既依赖于别
> 的物品，又被别的物品所依赖；另外，没有某件物品同时依赖多件物品。

将不依赖于别的物品的物品称为“主件”，依赖于某主件的物品称为“附件”。

由这个问题的简化条件可知所有的物品由若干主件和依赖于每个主件的一个附件集合组成。 按照背包问题的一般思路，仅考虑一个主件和它的附件集合。可是，可用的策略非 常多，包括：一个也不选，仅选择主件，选择主件后再选择一个附件，选择主件后再选 择两个附件……无法用状态转移方程来表示如此多的策略。

事实上，设有 `n `个附件，则 策略有 `2 n + 1` 个，为指数级。 考虑到所有这些策略都是互斥的（也就是说，你只能选择一种策略），所以一个主 件和它的附件集合实际上对应于分组的背包问题中的一个物品组，每个选择了主件又选择了若干个附 件的策略对应于这个物品组中的一个物品，其费用和价值都是这个策略中的物品的值的 和。但仅仅是这一步转化并不能给出一个好的算法，因为物品组中的物品还是像原问题 的策略一样多。 再考虑对每组内的物品应用完全背包问题中的优化。

> 完全背包问题有一个很简单有效的优化，是这样的：若两件物品 `i`、`j` 满足 `Ci ≤ Cj` 且 `Wi ≥ Wj`，则将可以将物品 `j` 直接去掉，不用考虑。
>
> 这个优化的正确性是显然的：任何情况下都可将价值小费用高的`j `换成物美价廉的` i`，得到的方案至少不会更差。对于随机生成的数据，这个方法往往会大大减少物品的 件数，从而加快速度。然而这个并不能改善最坏情况的复杂度，因为有可能特别设计的 数据可以一件物品也去不掉。
>
> 这个优化可以简单的 `O(N*N)` 地实现，一般都可以承受。另外，针对背包问题而言， 比较不错的一种方法是：首先将费用大于`V` 的物品去掉，然后使用类似计数排序的做法，计算出费用相同的物品中价值最高的是哪个，可以 `O(V + N)` 地完成这个优化。

我们可以想到，对于第 `k` 个物品组中的 物品，所有费用相同的物品只留一个价值最大的，不影响结果。所以，可以对主件 `k` 的 “附件集合”先进行一次 01 背包，得到费用依次为 `0. . .V − Ck` 所有这些值时相应的最 大价值 `Fk[0 . . . V − Ck]`。

那么，这个主件及它的附件集合相当于 `V − Ck + 1 `个物品的 物品组，其中费用为 v 的物品的价值为 `Fk[v − Ck] + Wk`，`v `的取值范围是 `Ck ≤ v ≤ V` 。 也就是说，原来指数级的策略中，有很多策略都是冗余的，通过一次 01 背包后， 将主件` k` 及其附件转化为 `V − Ck + 1` 个物品的物品组，就可以直接应用分组的背包问题的算法解决问题了。

[金明的预算方案](https://www.acwing.com/problem/content/description/489/)

```js
/**
 * @param {*} V 总体积
 * @param {*} n 希望购买物品的个数
 * @param {*} master 主件 [[v(价格), p(价值)]]
 * [[800, 1600], [400, 1200], [500, 1000]],
 * @param {*} appendix 附件 [[[v, p], [v, p]]]
 * [[400, 2000], [300, 1500]], [], []]
 * master.length === appendix.length
 * @returns {Number} 最大价值
 */
function maxValueInDependentPack(V, n, master = [], appendix = []) {
  let dp = new Array(V + 1).fill(0).map((x) => new Array(n + 1).fill(0))
  //dp[v][n] 使用v体积购买最多n件物品获得的最大价值
  let len = master.length

  for (let i = 0; i < len; i++) {
    for (let j = V; j; j -= 10) {
      for (let l = n; l > 0; l--) {
        // 物品价格都是10的整数倍
        // 最里2层循环拆解了选择第i组物品（组件）的所有情况
        for (let u = 0; u < 1 << appendix[i].length; u++) {
          // 计算每种情况的总体积、总价值，带入公式
          // 附件最多2个，也就是4种情况00，01，10，11
          // 还有一种情况是主件也不选，这种情况等价于状态计算中的不选该组物品
          let [v, w] = master[i] // 主件体积、价值（重要度乘机为价值）
          // 对于附件的每种情况都要重新初始化定义，下面会进行计算改变值
          for (let k = 0; k < appendix[i].length; k++) {
            // 对上层循环的每种情况进行拆解，
            //例如01，（位运算）计算只选第2个附件的价值。依次计算并取最大值
            if ((u >> k) & 1) {
              // 查看当前策略（00～11）选中了哪些附件
              // 位运算：u依次向右移动1～k位，再判断最后一位是否为1，1为选中
              const [vv, ww] = appendix[i][k]
              // 附件体积、价值 （重要度乘机为价值）
              v += vv
              w += ww
            }
          }
          if (j >= v) {
            // 当下标j - v不为负数，才计算当前情况 剩余空间要比当前物品体积大
            dp[j][l] = Math.max(dp[j][l], dp[j - v][l - 1] + w)
          }
        }
      }
    }
  }
  return dp[V][n]
}
```

> 更一般的问题是：依赖关系以图论中 “森林” 的形式给出。也就是说，主件的附件仍然可以具有自己的附件集合。限制只是每个物品最多只依赖于一个物品（只有一个主件）且不出现循环依赖。
>
> 解决这个问题仍然可以用将每个主件及其附件集合转化为物品组的方式。唯一不同的是，由于附件可能还有附件，就不能将每个附件都看作一个一般的 `01 背包中`的物了。若这个附件也有附件集合，则它必定要被先转化为物品组，然后用分组的背包问题 解出主件及其附件集合所对应的附件组中各个费用的附件所对应的价值。
>
> 事实上，这是一种`树形动态规划`，其特点是，在用动态规划求每个父节点的属性之前，需要对它的各个儿子的属性进行一次动态规划式的求值。

### 泛化物品

> 考虑这样一种物品，它并没有固定的费用和价值，而是它的价值随着你分配给它的 费用而变化。这就是泛化物品的概念。

> 更严格的定义之。在背包容量为 V 的背包问题中，泛化物品是一个定义域为 `0 . . . V` 中的整数的函数 `h`，当分配给它的费用为 `v` 时，能得到的价值就是 `h(v)`。

> 一个背包问题中，可能会给出很多条件，包括每种物品的费用、价值等属性，物品 之间的分组、依赖等关系等。但肯定能将问题对应于某个泛化物品。也就是说，给定了所有条件以后，就可以对每个非负整数 `v` 求得：若背包容量为 `v`，将物品装入背包可得 到的最大价值是多少，这可以认为是定义在非负整数集上的一件泛化物品。这个泛化物 品——或者说问题所对应的一个定义域为非负整数的函数——包含了关于问题本身的高 度浓缩的信息。一般而言，求得这个泛化物品的一个子定义域（例如 `0. . .V` ）的值之后， 就可以根据这个函数的取值得到背包问题的最终答案。
>
> 综上所述，一般而言，求解背包问题，即求解这个问题所对应的一个函数，即该问 题的泛化物品。而求解某个泛化物品的一种常用方法就是将它表示为若干泛化物品的和 然后求之。

这里其他的就不复制粘贴 推荐看[原文](https://github.com/tianyicui/pack)

### 背包问题问法的变化

- **输出方案**: 记录下每个状态的最优值是由状态转移方程的哪 14 一项推出来的，换句话说，记录下它是由哪一个策略推出来的。便可根据这条策略找到 上一个状态，从上一个状态接着向前推即可。
- **输出字典序最小的最优方案**: 要在转移时注意策略
- **求方案总数**: 一般只需将状态转移方程中的 max 改成 sum 即可
- **最优方案的总数**
- **求次优解、第 K 优解**: 对于求次优解、第 K 优解类的问题，如果相应的最优解问题能写出状态转移方程、 用动态规划解决，那么求次优解往往可以相同的复杂度解决，第 K 优解则比求最优解 的复杂度上多一个系数 K。 其基本思想是，将每个状态都表示成有序队列，将状态转移方程中的 max/min 转 化成有序队列的合并。

至此，**背包神功**练到了第九重，开始实战！但是最后两层要活学活用也是至难了，呜呜呜

## Leetcode 里的背包问题

### 01背包

#### 例题：[416. 分割等和子集](https://leetcode-cn.com/problems/partition-equal-subset-sum/)

> 给你一个 **只包含正整数** 的 **非空** 数组 `nums` 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。

**示例 1：**

```
输入：nums = [1,5,11,5]
输出：true
解释：数组可以分割成 [1, 5, 5] 和 [11] 。
```

**提示：**

- `1 <= nums.length <= 200`
- `1 <= nums[i] <= 100`

分割成两个子集可以变相的看成是取值和值一半的方案，就是01背包问题，问题也从求最大值转换成了最小的数量的方案（方案只要存在就必定可以拆分）

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function (nums) {
    let halfSum = nums.reduce((a, b) => a + b, 0) / 2;
    if (Math.floor(halfSum) !== halfSum) return false; //不可整分的必然不行
    let dp = new Array(halfSum + 1).fill(Infinity);
    //dp[x]表示构成数x的最小的使用数字的数量
    dp[0] = 0;
    for (let i = 0; i < nums.length; i++) {
        for (let j = halfSum; j >= nums[i]; j--) {
            if (j - nums[i] >= 0) dp[j] = Math.min(dp[j], dp[j - nums[i]] + 1);
        }
    }
    return dp[halfSum] !== Infinity;
};
```

### 完全背包

#### 例题：[279. 完全平方数](https://leetcode-cn.com/problems/perfect-squares/)

> 给定正整数 n，找到若干个完全平方数（比如 1, 4, 9, 16, ...）使得它们的和等于 n。你需要让组成和的完全平方数的个数最少。
>
> 给你一个整数 n ，返回和为 n 的完全平方数的 最少数量 。
>
> 完全平方数 是一个整数，其值等于另一个整数的平方；换句话说，其值等于一个整数自乘的积。例如，1、4、9 和 16 都是完全平方数，而 3 和 11 不是。 

**示例 1：**

```
输入：n = 12
输出：3 
解释：12 = 4 + 4 + 4
```

**提示：**

- `1 <= n <= 1000`

求最小值的完全背包问题：物品就是完全平方数，价值就是完全平方数的大小，体积就是完全平方数的值的和：

```js
/**
 * @param {number} n
 * @return {number}
 */
var numSquares = function (n) {
    const arr = new Array(Math.ceil(Math.sqrt(n)))
        .fill(0)
        .map((x, i) => (i + 1) * (i + 1));
    let dp = new Array(n + 1).fill(Infinity); //dp[i] 表示构成i的最少的完全平方数的数量
    dp[0] = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j <= n; j++) {
            if (j - arr[i] >= 0) dp[j] = Math.min(dp[j], dp[j - arr[i]] + 1);
        }
    }
    return dp[n];
};
```

#### 例题： [322. 零钱兑换](https://leetcode-cn.com/problems/coin-change/)

> 给你一个整数数组 coins ，表示不同面额的硬币；以及一个整数 amount ，表示总金额。
>
> 计算并返回可以凑成总金额所需的 最少的硬币个数 。如果没有任何一种硬币组合能组成总金额，返回 -1 。
>
> 你可以认为每种硬币的数量是无限的。
>

**示例 1：**

```
输入：coins = [1, 2, 5], amount = 11
输出：3 
解释：11 = 5 + 5 + 1
```

**提示：**

- `1 <= coins.length <= 12`
- `1 <= coins[i] <= 2^31 - 1`
- `0 <= amount <= 104`

和上一题的思路完全一致，也是求最小值的完全背包问题：物品就是硬币，价值就是硬币的值，体积就是硬币的值的和：

```js
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function (coins, amount) {
    let dp = new Array(amount + 1).fill(Infinity);
    //dp[i] 表示构成金额i的最少的硬币的数量
    dp[0] = 0;
    for (let i = 0; i < coins.length; i++) {
        for (let j = 0; j <= amount; j++) {
            if (j - coins[i] >= 0)
                dp[j] = Math.min(dp[j], dp[j - coins[i]] + 1);
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount];
};
```

### 二维背包

#### 例题: [474. 一和零](https://leetcode-cn.com/problems/ones-and-zeroes/)

> 给你一个二进制字符串数组 strs 和两个整数 m 和 n 。
>
> 请你找出并返回 strs 的最大子集的长度，该子集中 最多 有 m 个 0 和 n 个 1 。
>
> 如果 x 的所有元素也是 y 的元素，集合 x 是集合 y 的 子集 。

**示例 1：**

```
输入：strs = ["10", "0001", "111001", "1", "0"], m = 5, n = 3
输出：4
解释：最多有 5 个 0 和 3 个 1 的最大子集是 {"10","0001","1","0"} ，因此答案是 4 。
其他满足题意但较小的子集包括 {"0001","1"} 和 {"10","1","0"} 。{"111001"} 不满足题意，因为它含 4 个 1 ，大于 n 的值 3 。
```

**提示：**

- `1 <= strs.length <= 600`
- `1 <= strs[i].length <= 100`
- `strs[i]` 仅由 `'0'` 和 `'1'` 组成
- `1 <= m, n <= 100`

二维背包问题，两个维度的限制：0和1的数量，求最大子集的长度：

```js
/**
 * @param {string[]} strs
 * @param {number} m 0
 * @param {number} n 1
 * @return {number}
 */
var findMaxForm = function (strs, m, n) {
    let arr = strs.map(x => {
        let zero = x.split('').filter(x => x === '0').length;
        return {
            zero: zero,
            one: x.length - zero,
        };
    });
    let dp = new Array(m + 1).fill(0).map(x => new Array(n + 1).fill(0));
    //dp[x][y] x个0和y个1最大子集的长度

    for (let i = 0; i < strs.length; i++) {
        for (let x = m; x >= 0; x--) {
            for (let y = n; y >= 0; y--) {
                if (x - arr[i].zero >= 0 && y - arr[i].one >= 0) {
                    dp[x][y] = Math.max(
                        dp[x][y],
                        dp[x - arr[i].zero][y - arr[i].one] + 1
                    );
                }
            }
        }
    }
    let ans = 0;
    for (let x of dp) {
        ans = Math.max(ans, ...x);
    }
    return ans;
};
```



### TODO

[1449. 数位成本和为目标值的最大数字](https://leetcode-cn.com/problems/form-largest-integer-with-digits-that-add-up-to-target/)

[1155. 掷骰子的N种方法](https://leetcode-cn.com/problems/number-of-dice-rolls-with-target-sum/)

[1049. 最后一块石头的重量 II](https://leetcode-cn.com/problems/last-stone-weight-ii/)

[879. 盈利计划](https://leetcode-cn.com/problems/profitable-schemes/)

[638. 大礼包](https://leetcode-cn.com/problems/shopping-offers/)

[518. 零钱兑换 II](https://leetcode-cn.com/problems/coin-change-2/)

[494. 目标和](https://leetcode-cn.com/problems/target-sum/)



