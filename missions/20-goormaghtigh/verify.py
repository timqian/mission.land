#!/usr/bin/env python3
import json
import sys

MISSION = "20-goormaghtigh"
MAX_BITS = 1_000_000
KNOWN = {(2, 5, 5, 3), (2, 90, 13, 3)}

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
    values = [w.get(k) for k in ("x", "y", "m", "n")] if isinstance(w, dict) else []
    if len(values) != 4 or any(type(v) is not int for v in values):
        fail("witness requires integer x, y, m, n")
    x, y, m, n = values
    if not 1 < x < y or not 3 <= m <= 100000 or not 3 <= n <= 100000 or m == n:
        fail("require 1 < x < y, distinct lengths, and 3 <= m,n <= 100000")
    if x.bit_length() * m > MAX_BITS or y.bit_length() * n > MAX_BITS:
        fail(f"repunit values may use at most {MAX_BITS} bits")
    left = (pow(x, m) - 1) // (x - 1)
    right = (pow(y, n) - 1) // (y - 1)
    if left != right:
        fail("the two repunits are not equal")
    score = 0 if (x, y, m, n) in KNOWN else 1
    if data.get("score") is not None and data.get("score") != score:
        fail(f"claimed score {data.get('score')} != computed score {score}")
    print(f"VALID score={score}")

if __name__ == "__main__":
    main()
