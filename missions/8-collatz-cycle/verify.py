#!/usr/bin/env python3
"""Verifier for 8-collatz-cycle.

A **counterexample** (refutation) mission: the witness is a finite certificate
that would DISPROVE the Collatz conjecture — a non-trivial cycle of the Collatz
map T(n) = n/2 (n even), 3n+1 (n odd). The conjecture says every positive
integer eventually reaches 1; equivalently the only cycle of T on the positive
integers is the trivial 1 -> 4 -> 2 -> 1. A cycle that avoids 1 refutes it.

Scoring mirrors the Lean proof missions' sanity/real split — a binary
solved-flag, not a rank:
  score 1 = a genuine non-trivial cycle (Collatz refuted)
  score 0 = the trivial cycle {1, 2, 4} (sanity baseline: proves the checker
            runs on this exact challenge without claiming the conjecture is
            disproven — the "no verifier, no mission" seed)

Only the cycle direction is finitely certifiable; a divergent trajectory (the
other way Collatz could fail) has no finite witness, so it is out of scope here.

Usage: python3 verify.py <witness.json>
Prints "VALID score=<n>" and exits 0, or "INVALID: <reason>" and exits 1.
"""
import json
import sys

MISSION = "8-collatz-cycle"


def fail(reason: str):
    print(f"INVALID: {reason}")
    sys.exit(1)


def collatz(n: int) -> int:
    return n // 2 if n % 2 == 0 else 3 * n + 1


def main():
    if len(sys.argv) != 2:
        fail("usage: verify.py <witness.json>")
    try:
        data = json.load(open(sys.argv[1]))
    except Exception as e:
        fail(f"cannot parse JSON: {e}")

    if data.get("mission") != MISSION:
        fail(f"mission field must be {MISSION!r}")

    cycle = data.get("witness", {}).get("cycle")
    if not isinstance(cycle, list) or len(cycle) == 0:
        fail("witness.cycle must be a non-empty list of positive integers")
    # bool is a subclass of int in Python — reject it explicitly.
    if not all(isinstance(x, int) and not isinstance(x, bool) for x in cycle):
        fail("witness.cycle must contain only integers")
    if any(x < 1 for x in cycle):
        fail("witness.cycle must contain only positive integers (Collatz is stated on n >= 1)")
    if len(set(cycle)) != len(cycle):
        fail("witness.cycle must list each element once (a simple cycle has distinct elements)")

    # A genuine cycle under T: T(cycle[i]) must be the next listed element.
    k = len(cycle)
    for i, n in enumerate(cycle):
        nxt = collatz(n)
        want = cycle[(i + 1) % k]
        if nxt != want:
            fail(f"not a cycle: T({n}) = {nxt}, but the next listed element is {want}")

    # A cycle through 1 is forced to be the trivial 1 -> 4 -> 2 -> 1, so
    # "contains 1" exactly characterises the trivial cycle.
    score = 0 if 1 in cycle else 1

    claimed = data.get("score")
    if claimed is not None and claimed != score:
        fail(f"claimed score {claimed} != computed score {score}")

    print(f"VALID score={score}")
    sys.exit(0)


if __name__ == "__main__":
    main()
