# 14 — Erdős–Szekeres (Happy Ending): refute the exact bound

## Problem

The **Erdős–Szekeres conjecture** (exact "Happy Ending" form): for every
`n ≥ 3`, any set of `2^(n−2) + 1` points in general position (no three
collinear) contains `n` points in **convex position** — and this count is sharp.

This is a **conquest** in the *contrarian* direction: exhibit a set of exactly
`2^(n−2) + 1` points in general position that contains **no convex `n`-gon**,
disproving that this many points always force one. It is a finite certificate —
a list of coordinates the verifier scans exactly.

The bound is proven for `n ≤ 6` (`ES(6) = 17`, Szekeres–Peters 2006). The
smallest open case is `n = 7`: **33 points**, a strikingly small potential
certificate.

Reference: Erdős–Szekeres (1935); Szekeres–Peters (2006) for `n = 6`; the exact
conjecture `ES(n) = 2^(n−2) + 1` is open for all `n ≥ 7`.

## Score

- **score 1** — a general-position set of `2^(n−2)+1` points with **no** convex
  `n`-gon. **This refutes the conjecture for that `n`.**
- **score 0** — such a set that *does* contain a convex `n`-gon (consistent with
  the conjecture). The *sanity seed* is the settled case `n = 4`: five points
  always contain a convex quadrilateral (the original Happy Ending theorem).

A witness that is not in general position, or has the wrong number of points, is
rejected as `INVALID`.

## Witness format

```json
{
  "mission": "14-erdos-szekeres",
  "author": "your-handle",
  "date": "YYYY-MM-DD",
  "score": 1,
  "witness": { "n": 7, "points": [[x0, y0], [x1, y1], ...] }
}
```

- `n ≥ 3`; `points` is exactly `2^(n−2) + 1` distinct integer coordinate pairs,
  in general position (no three collinear).
- The verifier reports 1 iff **no** `n`-subset is in convex position.
- Compute is capped so the scan stays exact and fast — this covers `n ≤ 7`
  (`C(33, 7) ≈ 4.3M` subsets, a few seconds). `score` is optional and derived.

Verify locally: `python3 missions/14-erdos-szekeres/verify.py your-witness.json`
(Python 3.10+, standard library only.)

## Literature record

The exact value `ES(n) = 2^(n−2) + 1` is confirmed for `n ≤ 6`. For `n = 7` the
best-known lower-bound construction gives 32 points with no convex heptagon, so
the question is whether **33** points always force one — unresolved.

## Known approaches

- The `2^(n−2)` lower-bound constructions (Erdős–Szekeres) are the starting
  point; the open question is whether adding one more point can still avoid a
  convex `n`-gon at `n = 7`.
- SAT/constraint encodings of "no convex 7-gon" over 33 points drive the search.
