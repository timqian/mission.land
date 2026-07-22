#!/usr/bin/env python3
"""Verifier for 14-erdos-szekeres (a counterexample / refutation mission).

The Erdős–Szekeres "Happy Ending" conjecture (exact form): for every n >= 3,
any set of 2^(n-2) + 1 points in general position (no three collinear) contains
n points in convex position. A counterexample is a set of exactly 2^(n-2) + 1
points in general position that contains NO convex n-gon.

  score 1 = a general-position set of 2^(n-2)+1 points with no convex n-gon
            → refutes the conjecture (for this n)
  score 0 = such a set that DOES contain a convex n-gon — the sanity seed
            (the case n = 4, five points, always has a convex quadrilateral —
            the original Happy Ending theorem)

The conjecture is proved for n <= 6 (ES(6) = 17, Szekeres–Peters 2006); the
smallest open case is n = 7 (33 points). To stay exactly checkable in time, the
verifier caps the search at ~10M n-subsets, which covers n <= 7.

Usage: python3 verify.py <witness.json>
Prints "VALID score=<n>" and exits 0, or "INVALID: <reason>" and exits 1.
"""
import json
import sys
from itertools import combinations
from math import comb

MISSION = "14-erdos-szekeres"
SUBSET_CAP = 10_000_000


def fail(reason: str):
    print(f"INVALID: {reason}")
    sys.exit(1)


def orient(o, a, b) -> int:
    """Sign of the cross product (a-o) x (b-o): >0 left turn, <0 right, 0 collinear."""
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])


def in_convex_position(pts) -> bool:
    """True iff every point of `pts` is a vertex of their convex hull. Assumes
    no three of the points are collinear (guaranteed by the general-position
    check on the whole set)."""
    P = sorted(pts)
    if len(P) < 3:
        return True

    def half(seq):
        h = []
        for p in seq:
            while len(h) >= 2 and orient(h[-2], h[-1], p) <= 0:
                h.pop()
            h.append(p)
        return h

    hull = len(half(P)) + len(half(P[::-1])) - 2
    return hull == len(pts)


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
    n = w.get("n")
    raw = w.get("points")
    if not (isinstance(n, int) and not isinstance(n, bool)) or n < 3:
        fail("witness.n must be an integer >= 3 (the convex-polygon size to avoid)")
    if not isinstance(raw, list):
        fail("witness.points must be a list of [x, y] integer coordinates")

    pts = []
    for i, p in enumerate(raw):
        if not (isinstance(p, list) and len(p) == 2 and all(isinstance(c, int) and not isinstance(c, bool) for c in p)):
            fail(f"point {i} must be [x, y] with integer coordinates")
        pts.append((p[0], p[1]))

    if len(set(pts)) != len(pts):
        fail("points must be distinct")

    need = 2 ** (n - 2) + 1
    if len(pts) != need:
        fail(f"a witness for n={n} must have exactly 2^(n-2)+1 = {need} points, got {len(pts)}")

    # General position: no three points collinear.
    for a, b, c in combinations(pts, 3):
        if orient(a, b, c) == 0:
            fail(f"points {a}, {b}, {c} are collinear — the set must be in general position")

    total = comb(len(pts), n)
    if total > SUBSET_CAP:
        fail(f"n={n} needs checking {total} subsets (> {SUBSET_CAP}); this verifier covers n up to 7")

    has_convex_ngon = any(in_convex_position(sub) for sub in combinations(pts, n))
    score = 0 if has_convex_ngon else 1

    claimed = data.get("score")
    if claimed is not None and claimed != score:
        fail(f"claimed score {claimed} != computed score {score}")

    print(f"VALID score={score}")
    sys.exit(0)


if __name__ == "__main__":
    main()
