#!/usr/bin/env python3
import json
import sys

MISSION = "19-moore-graph-57"
DEGREES = {2, 3, 7, 57}

def fail(reason):
    print(f"INVALID: {reason}")
    raise SystemExit(1)

def main():
    if len(sys.argv) != 2:
        fail("usage: verify.py <witness.json>")
    try:
        with open(sys.argv[1], encoding="utf-8") as f:
            data = json.load(f)
    except Exception as exc:
        fail(f"cannot parse JSON: {exc}")
    if not isinstance(data, dict) or data.get("mission") != MISSION:
        fail(f"mission field must be {MISSION!r}")
    w = data.get("witness")
    d = w.get("degree") if isinstance(w, dict) else None
    adjacency = w.get("adjacency") if isinstance(w, dict) else None
    if type(d) is not int or d not in DEGREES or not isinstance(adjacency, list):
        fail("degree must be one of 2, 3, 7, 57 and adjacency must be a list")
    n = d * d + 1
    if len(adjacency) != n:
        fail(f"adjacency must contain exactly {n} vertices")
    neighbors = []
    for v, row in enumerate(adjacency):
        if not isinstance(row, list) or len(row) != d or row != sorted(row):
            fail(f"vertex {v} needs {d} sorted neighbors")
        if any(type(x) is not int or x < 0 or x >= n for x in row) or len(set(row)) != d or v in row:
            fail(f"vertex {v} has an invalid neighbor list")
        neighbors.append(set(row))
    for v in range(n):
        for u in neighbors[v]:
            if v not in neighbors[u]:
                fail(f"edge {v}-{u} is not symmetric")
    for v in range(n):
        reached = {v}
        reached.update(neighbors[v])
        for u in neighbors[v]:
            for x in neighbors[u]:
                if x == v:
                    continue
                if x in reached:
                    fail(f"radius-2 neighborhood of {v} repeats vertex {x}")
                reached.add(x)
        if len(reached) != n:
            fail(f"radius-2 neighborhood of {v} has size {len(reached)}, expected {n}")
    score = 1 if d == 57 else 0
    if data.get("score") is not None and data.get("score") != score:
        fail(f"claimed score {data.get('score')} != computed score {score}")
    print(f"VALID score={score}")

if __name__ == "__main__":
    main()
