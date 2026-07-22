# 13 — Odd perfect numbers: refute it by exhibiting one

## Problem

A positive integer `n` is **perfect** if `σ(n) = 2n`, where `σ` is the sum of
all divisors (so `6 = 1+2+3` and `28 = 1+2+4+7+14`). Every known perfect number
is even; whether an **odd** perfect number exists has been open since antiquity.

This is a **conquest** in the *contrarian* direction: exhibit a single odd
perfect number — a finite certificate. Because `σ` is computed from the prime
factorization, the witness must give `n`'s full factorization **and prove each
factor prime**, so a composite can't be smuggled in to fake `σ(n) = 2n`.
Primality is proved with a **Pratt (Lucas) certificate**, checked exactly.

Reference: no odd perfect number exists below `10^1500` (Ochem–Rao); one would
have at least 101 prime factors (Nielsen) and a special form (Euler). A real
counterexample would be an extraordinary result.

## Score

- **score 1** — a perfect number that is **odd**. **This refutes the conjecture.**
- **score 0** — an even perfect number (e.g. `6`). The *sanity seed* — it
  exercises the factorization, `σ`, and primality-certificate checks without
  refuting anything.

A witness whose factorization is wrong, whose `σ(n) ≠ 2n`, or whose factors are
not certified prime is rejected as `INVALID`.

## Witness format

```json
{
  "mission": "13-odd-perfect",
  "author": "your-handle",
  "date": "YYYY-MM-DD",
  "score": 1,
  "witness": {
    "n": 6,
    "factorization": [
      [2, 1, { "prime": 2 }],
      [3, 1, { "a": 2, "factors": [[2, 1, { "prime": 2 }]] }]
    ]
  }
}
```

- `factorization` is `n`'s distinct prime powers as `[p, e, cert]`, where `cert`
  proves `p` prime:
  - `{ "prime": 2 }` for `p = 2`;
  - `{ "a": <base>, "factors": [[q, e, cert_q], ...] }` for odd `p`, where the
    `q` are the primes of `p−1` (each with its own certificate). The verifier
    checks `a^(p−1) ≡ 1 (mod p)` and `a^((p−1)/q) ≢ 1 (mod p)` for each `q`.
- The factorization must multiply to `n`; the verifier recomputes `σ(n)` and
  requires `σ(n) = 2n`. `score` is optional and derived (1 iff `n` is odd).

Verify locally: `python3 missions/13-odd-perfect/verify.py your-witness.json`
(Python 3.10+, standard library only.)

## Literature record

No odd perfect number is known, and none exists below `10^1500`. Known
constraints (Euler form, ≥ 101 prime factors, large components) heavily
restrict any candidate but do not rule one out.

## Known approaches

- Odd-perfect searches are structured around Euler's form
  `n = p^a · m²` with `p ≡ a ≡ 1 (mod 4)` and the divisor-sum constraints — not
  brute force. A candidate arrives already factored, so the Pratt certificate is
  a natural byproduct.
