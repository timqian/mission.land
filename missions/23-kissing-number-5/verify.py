#!/usr/bin/env python3
import json
import sys

MISSION = "23-kissing-number-5"
DIMENSION = 5
MAX_POINTS = 1000

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
    raw = w.get("vectors") if isinstance(w, dict) else None
    if not isinstance(raw, list) or not 1 <= len(raw) <= MAX_POINTS:
        fail(f"vectors must contain between 1 and {MAX_POINTS} vectors")
    vectors = []
    for i, vector in enumerate(raw):
        if not isinstance(vector, list) or len(vector) != DIMENSION or any(type(x) is not int for x in vector):
            fail(f"vector {i} must contain five integers")
        vectors.append(tuple(vector))
    if len(set(vectors)) != len(vectors):
        fail("vectors must be distinct")
    norms = {sum(x * x for x in vector) for vector in vectors}
    if len(norms) != 1 or next(iter(norms)) == 0:
        fail("vectors must be nonzero and have one common squared norm")
    norm = next(iter(norms))
    for i, left in enumerate(vectors):
        for right in vectors[i + 1:]:
            dot = sum(a * b for a, b in zip(left, right))
            if 2 * dot > norm:
                fail(f"vectors {left} and {right} are too close")
    score = len(vectors)
    if data.get("score") != score:
        fail(f"claimed score {data.get('score')} != computed score {score}")
    print(f"VALID score={score}")

if __name__ == "__main__":
    main()
