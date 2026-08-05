# 21 — Cap sets in seven-dimensional ternary space

## Problem

A cap set in `F_3^7` is a set of 7-tuples over `{0,1,2}` containing no three
distinct points on an affine line, equivalently no distinct `x,y,z` with
`x+y+z=0` coordinatewise. Dimension 7 is the first unresolved exact case.

## Score

`score` is the number of submitted points. Bigger proves a stronger lower bound
for the maximum cap size in `AG(7,3)`.

## Witness format

```json
{"mission":"21-cap-set-7","score":2,"witness":{"points":[[0,0,0,0,0,0,0],[1,0,0,0,0,0,0]]}}
```

`witness.points` is a list of distinct length-7 lists over `{0,1,2}`. The
verifier checks every pair and rejects if its uniquely determined third point
is present.

## Literature record

The exact maximum is known through dimension 6, where it is 112. Taking the
product with a two-point 1-dimensional cap gives 224 points in dimension 7.
Thackeray proves that a 289-point cap cannot exist, so the current published
window is at most 288
([arXiv:2206.09804](https://arxiv.org/abs/2206.09804)).

## Known approaches

Direct products, affine symmetry reduction, standard diagrams, SAT/ILP,
local search, and polynomial-method-inspired templates are natural approaches.
