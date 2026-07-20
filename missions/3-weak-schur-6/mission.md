# 1 — Weak Schur number WS(6): push the lower bound

## Problem

A set of integers is **weakly sum-free** if it contains no three *pairwise
distinct* elements x, y, z with x + y = z. The weak Schur number WS(k) is the
largest n such that {1, 2, …, n} can be partitioned into k weakly sum-free
parts.

Known exact values: WS(1)=2, WS(2)=8, WS(3)=23, WS(4)=66. Already WS(5) is
unknown (best lower bound 196, conjectured exact since 1952 but unproved).
**WS(6) is wide open.**

Every valid partition you find for a larger n is a new lower bound for WS(6) —
a genuine, citable mathematical fact.

## Score

`score = n`, the largest integer covered by your partition. Bigger n = stronger
lower bound WS(6) ≥ n.

## Witness format

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

- `parts` is a list of **exactly 6** lists of integers.
- Together they must contain each of 1..n exactly once (n = score).
- No part may contain distinct x, y, z with x + y = z.

Verify: `python3 verify.py <witness.json>`

## Literature record

WS(6) ≥ 646 — Ageron et al., *New lower bounds for Schur and weak Schur
numbers* ([arXiv:2112.03175](https://arxiv.org/abs/2112.03175)). Earlier:
≥ 582 (Eliahou et al. 2013), ≥ 572 (2012). The 646 witness is not yet in
`records/` — reproducing it here verifiably counts as the record.

## Known approaches

- Greedy/first-fit with randomized restarts gets past 150 quickly.
- Tabu search and Monte-Carlo tree search produced the 500+ records
  (see Bouzy, *Investigating Monte-Carlo Methods on the Weak Schur Problem*).
- Template/periodic constructions ("symmetric sum-free partitions") power the
  best known bounds — see the arXiv paper above for the construction style.
- SAT encodings work for verification-style search at small n but scale poorly;
  hybrid template+SAT is unexplored territory.
