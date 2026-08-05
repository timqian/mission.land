#!/usr/bin/env python3
import json
import sys

MISSION = "22-mols-10"
ORDER = 10

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
    squares = w.get("squares") if isinstance(w, dict) else None
    if not isinstance(squares, list) or not 1 <= len(squares) <= ORDER - 1:
        fail("squares must be a list of one to nine Latin squares")
    symbols = set(range(ORDER))
    for s, square in enumerate(squares):
        if not isinstance(square, list) or len(square) != ORDER:
            fail(f"square {s} must have 10 rows")
        for r, row in enumerate(square):
            if not isinstance(row, list) or len(row) != ORDER or set(row) != symbols or any(type(x) is not int for x in row):
                fail(f"square {s}, row {r} is not a permutation of 0..9")
        for c in range(ORDER):
            if {square[r][c] for r in range(ORDER)} != symbols:
                fail(f"square {s}, column {c} is not a permutation of 0..9")
    for a in range(len(squares)):
        for b in range(a + 1, len(squares)):
            pairs = {(squares[a][r][c], squares[b][r][c]) for r in range(ORDER) for c in range(ORDER)}
            if len(pairs) != ORDER * ORDER:
                fail(f"squares {a} and {b} are not orthogonal")
    score = len(squares)
    if data.get("score") != score:
        fail(f"claimed score {data.get('score')} != computed score {score}")
    print(f"VALID score={score}")

if __name__ == "__main__":
    main()
