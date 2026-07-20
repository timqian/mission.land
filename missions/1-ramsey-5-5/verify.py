#!/usr/bin/env python3
"""Verifier for 3-ramsey-5-5.

Usage: python3 verify.py <witness.json>
Prints "VALID score=<n>" and exits 0, or "INVALID: <reason>" and exits 1.

Checks that no 5 vertices induce a monochromatic K_5, using neighborhood
bitmasks: a mono K_5 through edge (u,v) of color c is a c-triangle inside
the common c-neighborhood of u and v.
"""
import json
import sys
from itertools import combinations

MISSION = "3-ramsey-5-5"


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
    rows = data.get("witness", {}).get("rows")
    if not isinstance(rows, list) or not rows:
        fail("witness.rows must be a non-empty list of strings")

    n = len(rows) + 1
    adj = [[None] * n for _ in range(n)]
    for i, row in enumerate(rows):
        if not isinstance(row, str) or len(row) != n - 1 - i:
            fail(f"rows[{i}] must be a string of length {n - 1 - i}")
        if set(row) - {"0", "1"}:
            fail(f"rows[{i}] may only contain '0' and '1'")
        for k, ch in enumerate(row):
            j = i + 1 + k
            adj[i][j] = adj[j][i] = int(ch)

    # neighborhood bitmask per color
    nbr = [[0] * n for _ in range(2)]
    for u in range(n):
        for v in range(u + 1, n):
            c = adj[u][v]
            nbr[c][u] |= 1 << v
            nbr[c][v] |= 1 << u

    for u in range(n):
        for v in range(u + 1, n):
            c = adj[u][v]
            common = nbr[c][u] & nbr[c][v]
            members = [w for w in range(v + 1, n) if common >> w & 1]
            for a, b, e in combinations(members, 3):
                if adj[a][b] == c and adj[a][e] == c and adj[b][e] == c:
                    fail(
                        f"monochromatic K5 on vertices {(u, v, a, b, e)} color={c}"
                    )

    if claimed != n:
        fail(f"claimed score {claimed} != computed score {n}")

    print(f"VALID score={n}")
    sys.exit(0)


if __name__ == "__main__":
    main()
