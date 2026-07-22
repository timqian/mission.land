#!/usr/bin/env python3
"""Verifier for 10-perfect-cuboid (a counterexample / refutation mission).

The perfect cuboid problem: there is no box with integer edges a, b, c whose
three face diagonals and space diagonal are all integers. A counterexample is a
"perfect cuboid" — all four are integers.

To be a meaningful certificate the witness must at least be an **Euler brick**
(edges + three face diagonals integral); the score then turns on the space
diagonal:

  score 1 = space diagonal is also an integer  → a perfect cuboid, refutes it
  score 0 = the space diagonal is not integral (a plain Euler brick) — the
            sanity seed: the smallest Euler brick (44, 117, 240)

Usage: python3 verify.py <witness.json>
Prints "VALID score=<n>" and exits 0, or "INVALID: <reason>" and exits 1.
"""
import json
import sys
from math import isqrt

MISSION = "10-perfect-cuboid"


def fail(reason: str):
    print(f"INVALID: {reason}")
    sys.exit(1)


def is_square(n: int) -> bool:
    if n < 0:
        return False
    r = isqrt(n)
    return r * r == n


def main():
    if len(sys.argv) != 2:
        fail("usage: verify.py <witness.json>")
    try:
        data = json.load(open(sys.argv[1]))
    except Exception as e:
        fail(f"cannot parse JSON: {e}")

    if data.get("mission") != MISSION:
        fail(f"mission field must be {MISSION!r}")

    w = data.get("witness", {})
    edges = w.get("edges") if isinstance(w, dict) else None
    if not (isinstance(edges, list) and len(edges) == 3):
        fail("witness.edges must be a list of three positive integers [a, b, c]")
    if not all(isinstance(e, int) and not isinstance(e, bool) for e in edges):
        fail("witness.edges must contain only integers")
    a, b, c = edges
    if a < 1 or b < 1 or c < 1:
        fail("edges must be positive integers")

    # Must be an Euler brick: the three face diagonals are integers.
    faces = {"a,b": a * a + b * b, "b,c": b * b + c * c, "a,c": a * a + c * c}
    for name, val in faces.items():
        if not is_square(val):
            fail(f"not an Euler brick: face diagonal over edges ({name}) — sqrt({val}) is not an integer")

    space = a * a + b * b + c * c
    score = 1 if is_square(space) else 0

    claimed = data.get("score")
    if claimed is not None and claimed != score:
        fail(f"claimed score {claimed} != computed score {score}")

    print(f"VALID score={score}")
    sys.exit(0)


if __name__ == "__main__":
    main()
