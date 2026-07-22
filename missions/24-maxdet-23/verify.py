#!/usr/bin/env python3
import json
import sys

MISSION = "24-maxdet-23"
ORDER = 23

def fail(reason):
    print(f"INVALID: {reason}")
    raise SystemExit(1)

def determinant(matrix):
    a = [row[:] for row in matrix]
    sign, previous = 1, 1
    for k in range(ORDER - 1):
        pivot_row = next((r for r in range(k, ORDER) if a[r][k]), None)
        if pivot_row is None:
            return 0
        if pivot_row != k:
            a[k], a[pivot_row] = a[pivot_row], a[k]
            sign = -sign
        pivot = a[k][k]
        for i in range(k + 1, ORDER):
            for j in range(k + 1, ORDER):
                a[i][j] = (a[i][j] * pivot - a[i][k] * a[k][j]) // previous
            a[i][k] = 0
        previous = pivot
    return sign * a[-1][-1]

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
    if not isinstance(w, dict):
        fail("witness must be an object")
    if w.get("family") == "J-2I" and "matrix" not in w:
        matrix = [[-1 if i == j else 1 for j in range(ORDER)] for i in range(ORDER)]
    else:
        matrix = w.get("matrix")
    if not isinstance(matrix, list) or len(matrix) != ORDER:
        fail(f"matrix must have {ORDER} rows")
    for i, row in enumerate(matrix):
        if not isinstance(row, list) or len(row) != ORDER or any(type(x) is not int or x not in (-1, 1) for x in row):
            fail(f"row {i} must contain {ORDER} sign integers")
    score = abs(determinant(matrix))
    if data.get("score") != score:
        fail(f"claimed score {data.get('score')} != computed score {score}")
    print(f"VALID score={score}")

if __name__ == "__main__":
    main()
