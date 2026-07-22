#!/usr/bin/env python3
import json
import sys

MISSION = "17-circulant-hadamard"
MAX_N = 10000

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
    row = w.get("first_row") if isinstance(w, dict) else None
    if not isinstance(row, list) or not 4 <= len(row) <= MAX_N or len(row) % 4:
        fail(f"first_row length must be a multiple of 4 between 4 and {MAX_N}")
    if any(type(x) is not int or x not in (-1, 1) for x in row):
        fail("first_row entries must be +1 or -1 integers")
    n = len(row)
    for shift in range(1, n // 2 + 1):
        corr = sum(row[i] * row[(i + shift) % n] for i in range(n))
        if corr != 0:
            fail(f"periodic shift {shift} has autocorrelation {corr}")
    score = 1 if n > 4 else 0
    if data.get("score") is not None and data.get("score") != score:
        fail(f"claimed score {data.get('score')} != computed score {score}")
    print(f"VALID score={score}")

if __name__ == "__main__":
    main()
