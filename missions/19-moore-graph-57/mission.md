# 19 — The missing Moore graph of degree 57

## Problem

A diameter-2 Moore graph of degree `d` has exactly `d^2 + 1` vertices, no
triangles or 4-cycles, and every pair of nonadjacent vertices has one common
neighbor. Hoffman--Singleton theory permits `d = 2, 3, 7, 57`; only the
degree-57 case (3,250 vertices) is unknown.

## Score

`score = 1` for a valid degree-57 graph and `0` for a known smaller Moore graph
used as a sanity seed.

## Witness format

```json
{"mission":"19-moore-graph-57","score":0,"witness":{"degree":2,"adjacency":[[1,4],[0,2],[1,3],[2,4],[0,3]]}}
```

`witness` contains integer `degree` and `adjacency`, a list of sorted neighbor
lists indexed from zero. The verifier checks a simple undirected regular graph
on `d^2+1` vertices and confirms every radius-2 neighborhood covers it exactly
once. Only `d` in `{2,3,7,57}` is accepted.

## Literature record

Existence at degree 57 remains open; Faber and Keegan correct a claimed
nonexistence proof in *Existence of a Moore graph of degree 57 is still open*
([arXiv:2210.09577](https://arxiv.org/abs/2210.09577)). Recent optimization
work also treats it as the missing case
([doi:10.1016/j.jocs.2023.101938](https://doi.org/10.1016/j.jocs.2023.101938)).

## Known approaches

Exploit the strongly regular parameters `(3250,57,0,1)`, spectral constraints,
automorphism restrictions, SAT/CP, permutation systems, and local optimization.
