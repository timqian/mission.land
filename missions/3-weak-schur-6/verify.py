#!/usr/bin/env python3
"""Verifier for 1-weak-schur-6.

Usage: python3 verify.py <witness.json>
Prints "VALID score=<n>" and exits 0, or "INVALID: <reason>" and exits 1.
"""
import json
import sys

MISSION = "1-weak-schur-6"
NUM_PARTS = 6


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
    claimed = data.get("score")
    parts = data.get("witness", {}).get("parts")
    if not isinstance(parts, list) or len(parts) != NUM_PARTS:
        fail(f"witness.parts must be a list of exactly {NUM_PARTS} lists")

    seen = set()
    for i, part in enumerate(parts):
        if not isinstance(part, list) or not all(isinstance(x, int) for x in part):
            fail(f"part {i} must be a list of integers")
        for x in part:
            if x < 1:
                fail(f"part {i} contains non-positive integer {x}")
            if x in seen:
                fail(f"integer {x} appears more than once")
            seen.add(x)

    n = len(seen)
    if seen != set(range(1, n + 1)):
        missing = min(set(range(1, n + 1)) - seen)
        fail(f"parts must cover 1..n exactly; {missing} is missing")

    # weakly sum-free: no pairwise-distinct x, y, z in one part with x + y = z
    for i, part in enumerate(parts):
        s = set(part)
        elems = sorted(s)
        for ai, x in enumerate(elems):
            for y in elems[ai + 1:]:
                z = x + y
                if z > n:
                    break
                if z in s and z != x and z != y:
                    fail(f"part {i} contains {x} + {y} = {z}")

    if claimed != n:
        fail(f"claimed score {claimed} != computed score {n}")

    print(f"VALID score={n}")
    sys.exit(0)


if __name__ == "__main__":
    main()
