# 1 — 弱 Schur 数 WS(6)：推进下界

## 问题

若一个整数集合中不存在**两两不同**的三个元素 x、y、z 满足 x + y = z，则称它是**弱无和**（weakly sum-free）的。弱 Schur 数 WS(k) 定义为最大的 n，使得 {1, 2, …, n} 能被划分成 k 个弱无和的部分。

已知的精确值只到 WS(1)=2、WS(2)=8、WS(3)=23、WS(4)=66。到 WS(5) 就已经是未解决问题（目前最好的下界是 196；自 1952 年起人们就猜想这是精确值，但始终没有证明）。**WS(6) 则完全悬而未决。**

你为更大的 n 找到的每一个有效划分，都是 WS(6) 的一个新下界——一个货真价实、可以被引用的数学事实。

## 得分

`score = n`，即你的划分所覆盖的最大整数。n 越大，下界 WS(6) ≥ n 就越强。

## Witness 格式

```json
{
  "mission": "1-weak-schur-6",
  "author": "your-handle",
  "date": "YYYY-MM-DD",
  "score": 160,
  "witness": {
    "parts": [[1, 2, 4, ...], [3, 5, ...], ...]
  }
}
```

- `parts` 是一个列表，其中**恰好有 6 个**整数列表。
- 它们合在一起必须恰好包含 1..n 中的每个整数各一次（n = score）。
- 任何一个部分中都不得存在两两不同的 x、y、z 满足 x + y = z。

验证方式：`python3 verify.py <witness.json>`

## 文献纪录

WS(6) ≥ 646 —— Ageron 等，*New lower bounds for Schur and weak Schur numbers*（[arXiv:2112.03175](https://arxiv.org/abs/2112.03175)）。更早的结果：≥ 582（Eliahou 等，2013）、≥ 572（2012）。646 对应的 witness 尚未收录进 `records/`——在这里以可验证的方式复现它，同样算作纪录。

## 已知方法

- 贪心/first-fit 配合随机重启，可以很快突破 150。
- 禁忌搜索（tabu search）与蒙特卡洛树搜索曾产出 500+ 的纪录（参见 Bouzy，*Investigating Monte-Carlo Methods on the Weak Schur Problem*）。
- 目前最好的下界都来自模板/周期构造（“对称无和划分”）——构造思路见上面的 arXiv 论文。
- SAT 编码适合在较小的 n 上做验证式搜索，但扩展性很差；模板 + SAT 的混合方法则是尚无人涉足的领域。
