# 20 — Goormaghtigh's two-repunit conjecture

## Problem

The Goormaghtigh equation asks when a number is a repunit in two different
bases:
`(x^m-1)/(x-1) = (y^n-1)/(y-1)`, with bases above 1 and lengths above 2.
The conjecture says the only values are 31 and 8191. Any third solution is a
finite counterexample.

## Score

`score = 1` for an exact solution other than the two known ones; `score = 0`
for either known solution as a sanity seed.

## Witness format

```json
{"mission":"20-goormaghtigh","score":0,"witness":{"x":2,"y":5,"m":5,"n":3}}
```

`witness` contains positive integers `x`, `y`, `m`, `n`, with `x < y`, distinct
lengths, bases above 1, and lengths from 3 through 100,000. The resulting
integers are capped at one million bits and compared exactly.

## Literature record

The known solutions are `(2,5,5,3)` and `(2,90,13,3)`. Grantham reports no new
Goormaghtigh primes below `10^700` while stating the conjecture remains open
([arXiv:2410.03677](https://arxiv.org/abs/2410.03677)); Fujita and Le settle a
recent special family ([doi:10.1017/S0004972723000709](https://doi.org/10.1017/S0004972723000709)).

## Known approaches

Linear forms in logarithms, continued fractions, modular sieving, repunit
factorization, and distributed searches are the standard routes.
