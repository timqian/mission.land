# 25 — van der Waerden number W(2,8)

## Problem

Color `{1,...,N}` red or blue while avoiding a monochromatic arithmetic
progression of length 8. Every valid coloring proves `W(2,8) > N`; the exact
number is open.

## Score

`score = N`, the length of the coloring. Bigger is a stronger lower bound.

## Witness format

```json
{"mission":"25-vdw-2-8","score":4,"witness":{"colors":[0,1,0,1]}}
```

`witness.colors` is a list of `N` integers, each 0 or 1, with `1 <= N <=
20,000`. The verifier enumerates every start and positive common difference
whose eight terms fit, and rejects monochromatic progressions.

## Literature record

The published record is `W(2,8) > 11,495`, obtained with cyclic zippers by
Rabung and Lotts, *Improving the use of cyclic zippers in finding lower bounds
for van der Waerden numbers*
([doi:10.37236/2388](https://doi.org/10.37236/2388)). General constructive
lower-bound methods are surveyed by Gasarch and Haeupler
([arXiv:1005.3749](https://arxiv.org/abs/1005.3749)).

## Known approaches

Cyclic zippers, SAT with symmetry breaking, randomized local search,
Moser--Tardos resampling, block substitutions, and palindromic colorings apply.
