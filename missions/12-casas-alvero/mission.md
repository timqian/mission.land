# 12 — The Casas-Alvero conjecture: refute it with a polynomial

## Problem

The **Casas-Alvero conjecture** (2001): if a degree-`n` polynomial `f` (over a
field of characteristic 0) shares **at least one root** with each of its
derivatives `f', f'', …, f^(n-1)` — each derivative separately, not necessarily
the same root — then `f = c(x − a)^n`: a single root of multiplicity `n`.

This is a **conquest** in the *contrarian* direction: exhibit a polynomial that
satisfies the hypothesis (shares a root with every derivative) but is **not** a
pure power `c(x − a)^n`. It is a finite certificate, checkable exactly with
rational arithmetic.

The conjecture is known to hold when `n` is a prime power (Graf von Bothmer–
Labs–Schicho–van de Woestijne, 2007); the general case is open, so any
counterexample would have degree with at least two distinct prime factors
(6, 10, 12, 14, 15, …).

Reference: Casas-Alvero (2001); Graf von Bothmer et al., "The Casas-Alvero
conjecture for infinitely many degrees" (2007).

## Score

- **score 1** — `f` shares a root with every derivative yet has **≥ 2 distinct
  roots** (not a pure power). **This refutes Casas-Alvero.**
- **score 0** — `f = c(x − a)^n`, a single `n`-fold root (e.g. `(x − 1)^3`). It
  satisfies the conjecture's conclusion, so it is the *sanity seed*: it exercises
  the shared-root / gcd machinery without refuting anything.

A polynomial that does **not** satisfy the hypothesis — some derivative shares no
root (a constant gcd) — is rejected as `INVALID`; it isn't a counterexample
candidate.

## Witness format

```json
{
  "mission": "12-casas-alvero",
  "author": "your-handle",
  "date": "YYYY-MM-DD",
  "score": 1,
  "witness": { "coeffs": [c0, c1, ..., cn] }
}
```

- `coeffs` are the **integer** coefficients of `f`, constant term first, leading
  term last (`cn ≠ 0`), degree `n ≥ 2`. Rational coefficients are fine in
  principle — scale to clear denominators; it changes neither the roots nor the
  shared-root structure.
- The verifier computes `gcd(f, f^(i))` over ℚ with exact rational arithmetic.
- `score` is optional and derived.

Verify locally: `python3 missions/12-casas-alvero/verify.py your-witness.json`
(Python 3.10+, standard library only.)

## Literature record

No counterexample is known in any degree. The conjecture is proven for degrees
`p^k` and for all degrees up to a bound; the smallest fully-open degrees are the
non-prime-powers `6, 10, 12, …`.

## Known approaches

- Restrict to a fixed open degree (e.g. 6) and search over rational coefficient
  families; the shared-root conditions become a polynomial system.
- Toric / Gröbner-basis analyses of the shared-root variety (Graf von Bothmer et
  al.) both prove infinitely many cases and point at where a counterexample
  could hide.
