#!/usr/bin/env python3
import json
import sys

MISSION = "25-vdw-2-8"
LENGTH = 8
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
    colors = w.get("colors") if isinstance(w, dict) else None
    if not isinstance(colors, list) or not 1 <= len(colors) <= MAX_N:
        fail(f"colors length must be between 1 and {MAX_N}")
    if any(type(color) is not int or color not in (0, 1) for color in colors):
        fail("colors entries must be integer 0 or 1")
    n = len(colors)
    for start in range(n):
        for step in range(1, (n - 1 - start) // (LENGTH - 1) + 1):
            color = colors[start]
            if all(colors[start + step * offset] == color for offset in range(1, LENGTH)):
                fail(f"monochromatic progression starts at {start + 1} with step {step}")
    if data.get("score") != n:
        fail(f"claimed score {data.get('score')} != computed score {n}")
    print(f"VALID score={n}")

if __name__ == "__main__":
    main()
