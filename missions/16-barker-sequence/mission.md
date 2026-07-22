# 16 — Barker sequence beyond length 13

## Problem

A Barker sequence is a sign sequence `a[0..n-1]` whose aperiodic
autocorrelations `C(k) = sum(a[i] * a[i+k], i=0..n-k-1)` satisfy
`|C(k)| <= 1` for every nonzero shift. The Barker conjecture says none exists
for `n > 13`. Odd lengths above 13 are ruled out, but the even case remains
open. A longer sequence is a finite counterexample.

## Score

`score = 1` for a valid Barker sequence of length above 13; `score = 0` for a
known short sequence used as a sanity seed.

## Witness format

```json
{"mission":"16-barker-sequence","score":0,"witness":{"sequence":[1,1,-1]}}
```

`witness.sequence` is a JSON list of `+1` and `-1`, of length at most 20,000.
The verifier recomputes every autocorrelation exactly.

## Literature record

The longest known Barker sequence has length 13. Schmidt and Willms prove the
odd-length case and summarize the remaining even case in *Barker sequences of
odd length* ([arXiv:1501.06035](https://arxiv.org/abs/1501.06035)).

## Known approaches

Field descent, cyclic difference-set restrictions, autocorrelation-preserving
search, SAT, and branch-and-bound are the main tools for the even case.
