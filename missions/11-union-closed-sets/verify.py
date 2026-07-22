#!/usr/bin/env python3
"""Verifier for 11-union-closed-sets (a counterexample / refutation mission).

Frankl's union-closed sets conjecture: every finite family of sets that is
closed under pairwise union — other than the family {∅} — has some element that
belongs to at least half of the sets in the family.

The witness is a finite family (a list of sets). To be a valid instance it must
be union-closed and not the degenerate family {∅}. The score turns on Frankl's
condition:

  score 1 = every element lies in *fewer than half* the sets  → refutes Frankl
  score 0 = some element lies in at least half the sets (Frankl holds) — the
            sanity seed: e.g. the family { ∅, {1} }

Usage: python3 verify.py <witness.json>
Prints "VALID score=<n>" and exits 0, or "INVALID: <reason>" and exits 1.
"""
import json
import sys
from collections import Counter

MISSION = "11-union-closed-sets"


def fail(reason: str):
    print(f"INVALID: {reason}")
    sys.exit(1)


def main():
    if len(sys.argv) != 2:
        fail("usage: verify.py <witness.json>")
    try:
        data = json.load(open(sys.argv[1]))
    except Exception as e:
        fail(f"cannot parse JSON: {e}")

    if data.get("mission") != MISSION:
        fail(f"mission field must be {MISSION!r}")

    raw = data.get("witness", {}).get("sets")
    if not isinstance(raw, list) or len(raw) == 0:
        fail("witness.sets must be a non-empty list of sets (each a list of integers)")

    family = []
    for i, s in enumerate(raw):
        if not isinstance(s, list) or not all(isinstance(x, int) and not isinstance(x, bool) for x in s):
            fail(f"set {i} must be a list of integers")
        fs = frozenset(s)
        if len(fs) != len(s):
            fail(f"set {i} lists an element more than once")
        family.append(fs)

    fset = set(family)
    if len(fset) != len(family):
        fail("the family lists the same set more than once — a family is a set of distinct sets")

    # Degenerate family {∅} is explicitly excluded by the statement.
    if fset == {frozenset()}:
        fail("the family {∅} is excluded by the conjecture; give a non-degenerate family")

    # Must be closed under pairwise union.
    for X in family:
        for Y in family:
            if (X | Y) not in fset:
                fail(f"not union-closed: {sorted(X)} ∪ {sorted(Y)} = {sorted(X | Y)} is not in the family")

    m = len(family)
    counts = Counter()
    for s in family:
        for e in s:
            counts[e] += 1

    # An element is "abundant" if it is in at least half the sets: 2*count >= m.
    # Frankl fails exactly when no element is abundant.
    abundant = any(2 * c >= m for c in counts.values())
    score = 0 if abundant else 1

    claimed = data.get("score")
    if claimed is not None and claimed != score:
        fail(f"claimed score {claimed} != computed score {score}")

    print(f"VALID score={score}")
    sys.exit(0)


if __name__ == "__main__":
    main()
