#!/usr/bin/env python3
"""Verifier for 9-beal-conjecture (a counterexample / refutation mission).

Beal's conjecture: if A^x + B^y = C^z with A, B, C positive integers and
integer exponents x, y, z >= 3, then A, B, C share a common prime factor.
A counterexample is a *coprime* solution.

  score 1 = a solution with gcd(A, B, C) = 1  → refutes Beal
  score 0 = a solution sharing a common factor (e.g. 2^3 + 2^3 = 2^4) — the
            sanity seed: exercises the arithmetic check without refuting anything

Usage: python3 verify.py <witness.json>
Prints "VALID score=<n>" and exits 0, or "INVALID: <reason>" and exits 1.
"""
import json
import sys
from math import gcd

MISSION = "9-beal-conjecture"
KEYS = ("a", "b", "c", "x", "y", "z")


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

    w = data.get("witness", {})
    if not isinstance(w, dict):
        fail("witness must be an object with keys a, b, c, x, y, z")
    vals = {}
    for k in KEYS:
        v = w.get(k)
        if not isinstance(v, int) or isinstance(v, bool):
            fail(f"witness.{k} must be an integer")
        vals[k] = v
    a, b, c, x, y, z = (vals[k] for k in KEYS)

    if a < 1 or b < 1 or c < 1:
        fail("A, B, C must be positive integers")
    if x < 3 or y < 3 or z < 3:
        fail("exponents x, y, z must each be >= 3")
    if a**x + b**y != c**z:
        fail(f"not a solution: {a}^{x} + {b}^{y} != {c}^{z}")

    score = 1 if gcd(gcd(a, b), c) == 1 else 0

    claimed = data.get("score")
    if claimed is not None and claimed != score:
        fail(f"claimed score {claimed} != computed score {score}")

    print(f"VALID score={score}")
    sys.exit(0)


if __name__ == "__main__":
    main()
