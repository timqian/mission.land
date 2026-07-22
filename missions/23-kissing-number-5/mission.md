# 23 — The five-dimensional kissing number

## Problem

How many nonoverlapping unit balls can touch one unit ball in `R^5`? After
normalizing their centers to a common sphere, distinct vectors must have inner
product at most half their common squared norm. The exact answer is still
between 40 and 44.

## Score

`score` is the number of submitted vectors. Bigger gives a stronger explicit
lower bound on the five-dimensional kissing number.

## Witness format

```json
{"mission":"23-kissing-number-5","score":2,"witness":{"vectors":[[1,0,0,0,0],[-1,0,0,0,0]]}}
```

`witness.vectors` is a list of distinct nonzero integer 5-vectors, all with the
same squared norm. For each distinct pair `u,v`, the verifier requires
`2*(u dot v) <= norm`. Up to 1,000 vectors are accepted.

## Literature record

The current bounds are `40 <= K(5) <= 44`. The classical `D5` roots attain 40;
Szollosi found a new nonisometric 40-point arrangement
([arXiv:2301.08272](https://arxiv.org/abs/2301.08272)). A 2026 study still
reports 44 as the proved upper bound
([doi:10.1007/s00454-026-00841-x](https://doi.org/10.1007/s00454-026-00841-x)).

## Known approaches

Root systems, spherical codes, semidefinite programming, contact-graph search,
exact Gram matrices, and sign modifications of lattice configurations apply.
