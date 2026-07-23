# 24 — Hadamard maximal determinant at order 23

## Problem

Among all `23 x 23` matrices with entries `+1` or `-1`, maximize the absolute
determinant. Exact maxima are known through order 22; order 23 is the smallest
open case of Hadamard's maximal determinant problem.

## Score

`score = |det(A)|`, recomputed with exact integer arithmetic. Bigger is better.

## Witness format

```json
{"mission":"24-maxdet-23","score":88080384,"witness":{"family":"J-2I"}}
```

Normally `witness.matrix` is a 23-by-23 list of sign rows. For the compact
baseline only, `witness.family` may be `"J-2I"`, denoting the matrix with `-1`
on the diagonal and `+1` elsewhere.

## Literature record

The current candidate record is commonly tabulated as
`2^22 * 662,671,875`, while optimality is unresolved. See OEIS A003432/A003433
and Browne et al., *A Survey of the Hadamard Maximal Determinant Problem*
([arXiv:2104.06756](https://arxiv.org/abs/2104.06756)).

## Known approaches

Search feasible Gram matrices, decompose them into sign matrices, apply
switching and signed row/column equivalence, use D-optimal design theory, and
run exact local or annealing searches.
