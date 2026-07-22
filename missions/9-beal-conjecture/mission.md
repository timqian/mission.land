# 9 — Beal's conjecture: refute it with a coprime solution

## Problem

**Beal's conjecture** states: if

```
A^x + B^y = C^z
```

with `A, B, C` positive integers and integer exponents `x, y, z ≥ 3`, then
`A, B, C` share a common prime factor.

This is a **conquest** in the *contrarian* direction: rather than prove it, you
try to **disprove** it. A counterexample is a single **coprime** solution —
positive integers and exponents `≥ 3` satisfying the equation with
`gcd(A, B, C) = 1`. It is a finite certificate anyone can check with a few
multiplications.

Reference: Beal (1993); the conjecture generalizes Fermat's Last Theorem, and
the [Beal Prize](https://www.ams.org/profession/prizes-awards/ams-supported/beal-prize)
offers \$1,000,000 for a proof or counterexample. No coprime solution is known;
searches have covered bases and exponents into the tens of thousands.

## Score

A refutation is binary — you either exhibit a counterexample or you don't:

- **score 1** — a valid solution with `gcd(A, B, C) = 1`. **This refutes Beal.**
- **score 0** — a solution that shares a common factor (e.g. `2³ + 2³ = 2⁴`).
  It is consistent with the conjecture, so it is the *sanity seed*: it exercises
  the arithmetic check on this exact challenge without pretending the problem is
  solved.

The record sits at 0 (open) until someone submits a coprime solution.

## Witness format

```json
{
  "mission": "9-beal-conjecture",
  "author": "your-handle",
  "date": "YYYY-MM-DD",
  "score": 1,
  "witness": { "a": A, "b": B, "c": C, "x": x, "y": y, "z": z }
}
```

- All six are integers; `A, B, C ≥ 1` and `x, y, z ≥ 3`, with `A^x + B^y = C^z`.
- `score` is optional — the verifier computes it (1 if `gcd(A,B,C)=1`, else 0)
  and only cross-checks a value if you include one.

Verify locally: `python3 missions/9-beal-conjecture/verify.py your-witness.json`
(Python 3.10+, standard library only.)

## Literature record

No coprime solution is known. Many special cases are settled — Fermat's Last
Theorem (`x = y = z`), the Fermat–Catalan / Darmon–Granville results for fixed
exponent triples with `1/x + 1/y + 1/z < 1` — but the general statement is open.

## Known approaches

- Fix a small exponent triple `(x, y, z)` and search bases with congruence and
  modular sieving; most of the search space is eliminated by residue classes.
- The `1/x + 1/y + 1/z < 1` regime has only finitely many coprime solutions for
  each triple (Darmon–Granville) — a natural place to hunt.
