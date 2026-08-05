# 18 — Lehmer's totient problem

## Problem

Lehmer asked whether a composite integer `N` can satisfy `phi(N) | N - 1`.
None is known. A witness supplies `N` together with its complete prime
factorization, letting the verifier recompute Euler's totient exactly.

## Score

`score = 1` when the composite candidate satisfies the divisibility; `score =
0` for a completely factored composite sanity seed that does not.

## Witness format

```json
{"mission":"18-lehmer-totient","score":0,"witness":{"n":33,"factors":[[3,1],[11,1]]}}
```

`witness` has `n` and `factors`, where each factor is `[prime, exponent]`.
Factors must be distinct increasing primes below `2^64`; their product must be
exactly `n`. Deterministic 64-bit Miller--Rabin checks primality.

## Literature record

The problem remains open and every solution must have many prime factors; see
Grau and Oller-Marcen, *On The Lehmer Numbers, I*
([arXiv:1510.00923](https://arxiv.org/abs/1510.00923)). No composite Lehmer
number is known.

## Known approaches

Combine Korselt-style divisibility constraints, bounds on the number and size
of prime factors, integer programming, and searches over square-free products.
