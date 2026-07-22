# 8 — The Collatz conjecture: refute it with a non-trivial cycle

## Problem

Define the Collatz map on the positive integers:

```
T(n) = n / 2      if n is even
T(n) = 3n + 1     if n is odd
```

The **Collatz conjecture** (the 3n + 1 problem, open since 1937) says that
iterating `T` from any positive integer eventually reaches 1. Equivalently, the
only cycle of `T` on the positive integers is the trivial `1 → 4 → 2 → 1`.

This is a **conquest** in the *contrarian* direction: rather than prove the
conjecture, you try to **disprove** it by exhibiting a counterexample. Collatz
can fail in exactly two ways — a **non-trivial cycle** (a loop that never
reaches 1) or a **divergent trajectory** (one that grows without bound). Only
the first is a *finite* object anyone can check: you just list the cycle. That
is what this mission verifies.

Reference: Lagarias, "The 3x+1 problem and its generalizations" (1985);
the conjecture is verified computationally for all n up to ~2^68 (Barina, 2020),
and any cycle must have length in the hundreds of millions — so a real
counterexample here would be a genuine mathematical event, not a lucky search.

## Score

A refutation is binary — you either exhibit a counterexample or you don't — so
there is no rank to climb, only a solved-flag the verifier computes:

- **score 1** — a genuine non-trivial cycle: `T` maps each listed element to the
  next and the loop never passes through 1. **This refutes Collatz.**
- **score 0** — the trivial cycle `{1, 2, 4}`: a valid cycle, but the known one.
  It is the *sanity seed* — it proves the verifier runs on this exact challenge
  without pretending the open problem is solved (the "no verifier, no mission"
  baseline).

The current record is the max score among verified witnesses. It sits at 0
(open) until someone submits a non-trivial cycle.

## Witness format

```json
{
  "mission": "8-collatz-cycle",
  "author": "your-handle",
  "date": "YYYY-MM-DD",
  "score": 1,
  "witness": {
    "cycle": [n0, n1, n2, ...]
  }
}
```

- `witness.cycle` is the list of positive integers in the loop, in order, so
  that `T(cycle[i]) = cycle[i+1]` and `T(cycle[last]) = cycle[0]`. List each
  element exactly once (start anywhere).
- `score` is optional — the verifier derives it (1 for a non-trivial cycle,
  0 for the trivial one) and only cross-checks a value if you include one.

Verify locally: `python3 missions/8-collatz-cycle/verify.py your-witness.json`
(Python 3.10+, standard library only.)

## Literature record

No non-trivial cycle is known — none exists below 2^68, and structural results
(Steiner; Simons–de Weger) rule out cycles with few "ascents." No divergent
trajectory is known either. The conjecture is unproven in both directions.

## Known approaches

- A cycle's elements satisfy a tight Diophantine relation between its number of
  odd steps and its length; searches exploit these constraints rather than brute
  iteration. See the 2^68 verification and the "cycle length" lower bounds.
- The divergence direction is **not** accepted here — it has no finite
  certificate, so it fails the "no verifier, no mission" rule. Only cycles.
