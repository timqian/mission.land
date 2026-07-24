#!/usr/bin/env python3
"""Deterministic verifier for mission 15-schur-6."""

import json
import sys


MISSION = "15-schur-6"
NUM_PARTS = 6


def fail(reason: str) -> None:
    print(f"INVALID: {reason}")
    raise SystemExit(1)


def main() -> None:
    if len(sys.argv) != 2:
        fail("usage: verify.py <witness.json>")

    try:
        with open(sys.argv[1], encoding="utf-8") as witness_file:
            data = json.load(witness_file)
    except Exception as exc:
        fail(f"cannot parse JSON: {exc}")

    if not isinstance(data, dict):
        fail("witness file must contain a JSON object")
    if data.get("mission") != MISSION:
        fail(f"mission field must be {MISSION!r}")

    claimed = data.get("score")
    if not isinstance(claimed, int) or isinstance(claimed, bool) or claimed < 1:
        fail("score must be a positive integer")

    witness = data.get("witness")
    parts = witness.get("parts") if isinstance(witness, dict) else None
    if not isinstance(parts, list) or len(parts) != NUM_PARTS:
        fail(f"witness.parts must be a list of exactly {NUM_PARTS} lists")

    seen = set()
    for index, part in enumerate(parts):
        if not isinstance(part, list):
            fail(f"part {index} must be a list")
        for value in part:
            if not isinstance(value, int) or isinstance(value, bool):
                fail(f"part {index} must contain only integers")
            if value < 1:
                fail(f"part {index} contains non-positive integer {value}")
            if value in seen:
                fail(f"integer {value} appears more than once")
            seen.add(value)

    computed = len(seen)
    expected = set(range(1, computed + 1))
    if seen != expected:
        missing = min(expected - seen)
        fail(f"parts must cover 1..n exactly; {missing} is missing")
    if claimed != computed:
        fail(f"claimed score {claimed} != computed score {computed}")

    for index, part in enumerate(parts):
        members = set(part)
        ordered = sorted(members)
        for left_index, left in enumerate(ordered):
            for right in ordered[left_index:]:
                total = left + right
                if total > computed:
                    break
                if total in members:
                    fail(f"part {index} contains {left} + {right} = {total}")

    print(f"VALID score={computed}")


if __name__ == "__main__":
    main()
