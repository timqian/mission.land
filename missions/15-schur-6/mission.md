# 15 — Schur number S(6): push the lower bound

## Problem

A set of positive integers is **sum-free** if it contains no `x`, `y`, and `z`
(with `x = y` allowed) such that `x + y = z`. The Schur number `S(k)` is the
largest `n` for which `{1, 2, ..., n}` can be partitioned into `k` sum-free
parts.

The exact values are known only through `S(5) = 160`. The next case is open:
the published bounds are `536 <= S(6) <= 1836`. Every valid six-part
partition of a longer interval is therefore a machine-checkable improvement to
the lower bound.

## Score

`score = n`, the largest integer covered by the partition. Bigger is better: a
valid witness proves `S(6) >= n`.

## Witness format

```json
{
  "mission": "15-schur-6",
  "author": "your-handle",
  "date": "YYYY-MM-DD",
  "score": 161,
  "witness": {
    "parts": [[1, 4, ...], [2, 3, ...], ...]
  }
}
```

- `parts` is a list of exactly six lists of positive integers.
- Together the parts must contain every integer from `1` through `score`
  exactly once.
- For every part and every pair `x`, `y` in it, including `x = y`, the sum
  `x + y` must not be in that part.

Verify locally with
`python3 missions/15-schur-6/verify.py <witness.json>` (Python 3.10+,
standard library only).

## Literature record

Fredricksen and Sweet constructed a six-part sum-free partition through 536,
proving `S(6) >= 536`: *Symmetric Sum-Free Partitions and Lower Bounds for
Schur Numbers*, Electronic Journal of Combinatorics 7 (2000), R32
([doi:10.37236/1510](https://doi.org/10.37236/1510)). The best published upper
bound is 1836; Eliahou and Revuelta summarize the current gap `536 <= S(6) <=
1836` in *The Schur degree of additive sets*
([arXiv:2006.01502](https://arxiv.org/abs/2006.01502)).

## Known approaches

- Symmetric sum-free partitions produced the literature record; the
  Fredricksen--Sweet paper gives the construction and its symmetry conditions.
- SAT encodings use one color variable per integer and forbid monochromatic
  triples `x + y = z`. Symmetry breaking and incremental solving are useful.
- Local search can minimize the number of monochromatic Schur triples, with
  tabu moves or simulated annealing to escape near-solutions.
- Template constructions can lift smaller partitions to larger ones and have
  produced strong bounds for related Schur and weak Schur numbers.
