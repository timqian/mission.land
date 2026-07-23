# 22 — Three mutually orthogonal Latin squares of order 10

## Problem

Two order-10 Latin squares are known to be mutually orthogonal, but whether
three exist is a longstanding open problem. More generally, maximize a
pairwise mutually orthogonal family (MOLS): every ordered symbol pair must
occur exactly once when any two squares are superimposed.

## Score

`score` is the number of pairwise orthogonal order-10 Latin squares. A score of
3 would resolve the central open case; larger scores are stronger.

## Witness format

```json
{"mission":"22-mols-10","score":1,"witness":{"squares":["one 10x10 array over 0..9"]}}
```

`witness.squares` is a list of one to nine `10 x 10` arrays over symbols
`0..9`. Every row and column must be a permutation, and every pair of squares
must contain all 100 ordered pairs once.
See `records/1-xu-c.json` for a complete concrete array.

## Literature record

The accepted bounds are `2 <= N(10) <= 6`; the immediate frontier is a triple.
Rubin et al. study modern IP/CP searches for that triple
([arXiv:2103.11018](https://arxiv.org/abs/2103.11018)), and a 2025 SAT study
revisits Myrvold's claimed reductions
([arXiv:2503.10504](https://arxiv.org/abs/2503.10504)).

## Known approaches

SAT, exact cover, integer/constraint programming, permutation codes, group
actions, and aggressive isotopy/paratopy symmetry breaking are standard.
