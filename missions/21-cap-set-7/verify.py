#!/usr/bin/env python3
import json
import sys

MISSION = "21-cap-set-7"
DIMENSION = 7
MAX_POINTS = 288

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
    raw = w.get("points") if isinstance(w, dict) else None
    if not isinstance(raw, list) or not 1 <= len(raw) <= MAX_POINTS:
        fail(f"points must contain between 1 and {MAX_POINTS} points")
    points = []
    for i, point in enumerate(raw):
        if not isinstance(point, list) or len(point) != DIMENSION or any(type(x) is not int or x not in (0, 1, 2) for x in point):
            fail(f"point {i} must be a length-{DIMENSION} ternary list")
        points.append(tuple(point))
    members = set(points)
    if len(members) != len(points):
        fail("points must be distinct")
    for i, left in enumerate(points):
        for right in points[i + 1:]:
            third = tuple((-a - b) % 3 for a, b in zip(left, right))
            if third in members:
                fail(f"points {left}, {right}, {third} are collinear")
    score = len(points)
    if data.get("score") != score:
        fail(f"claimed score {data.get('score')} != computed score {score}")
    print(f"VALID score={score}")

if __name__ == "__main__":
    main()
