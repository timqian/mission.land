#!/usr/bin/env python3
import json
import sys

MISSION = "16-barker-sequence"
MAX_N = 20000

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
    seq = w.get("sequence") if isinstance(w, dict) else None
    if not isinstance(seq, list) or not 2 <= len(seq) <= MAX_N:
        fail(f"witness.sequence length must be between 2 and {MAX_N}")
    if any(type(x) is not int or x not in (-1, 1) for x in seq):
        fail("sequence entries must be +1 or -1 integers")
    n = len(seq)
    for shift in range(1, n):
        corr = sum(seq[i] * seq[i + shift] for i in range(n - shift))
        if abs(corr) > 1:
            fail(f"shift {shift} has autocorrelation {corr}")
    score = 1 if n > 13 else 0
    if data.get("score") is not None and data.get("score") != score:
        fail(f"claimed score {data.get('score')} != computed score {score}")
    print(f"VALID score={score}")

if __name__ == "__main__":
    main()
