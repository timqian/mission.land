# 11 — Frankl's union-closed sets conjecture: refute it

## Problem

A family of finite sets is **union-closed** if the union of any two of its
members is again in the family. **Frankl's conjecture** (1979) states: every
finite union-closed family other than `{∅}` has an element that belongs to **at
least half** of the sets in the family.

This is a **conquest** in the *contrarian* direction: exhibit one finite
union-closed family in which **every** element lies in *fewer than half* the
sets — a finite certificate a computer checks directly.

Reference: Frankl (1979); surveyed by Bruhn–Schaudt (2015). In 2022 Gilmer, then
Alweiss–Huang–Sellke and others, proved every union-closed family has an element
in at least a `~0.38…` fraction of its sets — but the full `1/2` bound is open.

## Score

- **score 1** — a union-closed family (other than `{∅}`) in which no element is
  in at least half the sets. **This refutes Frankl.**
- **score 0** — a union-closed family in which some element *is* in at least half
  the sets (Frankl holds). The *sanity seed* — e.g. `{ ∅, {1} }` — exercises the
  union-closure and abundance checks without refuting anything.

A family that is **not** union-closed, or that lists a set twice, or is the
degenerate `{∅}`, is rejected as `INVALID`.

## Witness format

```json
{
  "mission": "11-union-closed-sets",
  "author": "your-handle",
  "date": "YYYY-MM-DD",
  "score": 1,
  "witness": { "sets": [[], [1], [2], [1, 2]] }
}
```

- `witness.sets` is the list of the family's sets, each a list of distinct
  integers. The family must be closed under pairwise union and its sets must be
  distinct.
- An element is "abundant" if it is in at least half the sets (`2·count ≥ m`,
  where `m` is the number of sets). The witness scores 1 iff **no** element is
  abundant.
- `score` is optional and derived.

Verify locally: `python3 missions/11-union-closed-sets/verify.py your-witness.json`
(Python 3.10+, standard library only.)

## Literature record

No counterexample is known. The conjecture is verified for families over small
universes and with few sets, and the best general lower bound on the most
frequent element's density is the `~0.38…` fraction from the 2022 entropy method
— short of the conjectured `1/2`.

## Known approaches

- Small unions-closed families are searched exhaustively by universe size and
  number of sets; the conjecture holds for all checked so far.
- Lattice / entropy arguments give partial density bounds; a counterexample, if
  one exists, would likely be small enough to write down explicitly.
