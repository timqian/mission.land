#!/usr/bin/env python3
"""Enforce one-mission-per-PR (see skill.md: "One PR = one mission = one record").

Fails if a PR's changed files touch more than one mission's directory under
missions/, or add more than one new records/ witness. Catches branches that
kept accumulating commits for different missions instead of being reopened
from main each time.

Usage: python3 tools/check_pr_scope.py <base-sha> <head-sha>
"""
import re
import subprocess
import sys

MISSION_RE = re.compile(r"^missions/([0-9]+-[^/]+)/")
RECORD_RE = re.compile(r"^missions/[0-9]+-[^/]+/records/[^/]+\.json$")


def _diff(base, head, extra_args):
    out = subprocess.run(
        ["git", "diff", "--name-only", *extra_args, f"{base}...{head}"],
        capture_output=True, text=True, check=True,
    ).stdout
    return [line for line in out.splitlines() if line.strip()]


def main():
    if len(sys.argv) != 3:
        print("usage: check_pr_scope.py <base-sha> <head-sha>")
        sys.exit(2)
    base, head = sys.argv[1], sys.argv[2]

    changed = _diff(base, head, [])
    missions_touched = sorted({
        match.group(1) for f in changed if (match := MISSION_RE.match(f))
    })
    if len(missions_touched) > 1:
        print("FAIL: this PR touches more than one mission: " + ", ".join(missions_touched))
        print("One PR = one mission. Split this into separate branches/PRs, each from main — see skill.md.")
        sys.exit(1)

    added = _diff(base, head, ["--diff-filter=A"])
    new_records = [f for f in added if RECORD_RE.match(f)]
    if len(new_records) > 1:
        print("FAIL: this PR adds more than one record: " + ", ".join(new_records))
        print("One record per PR — see skill.md.")
        sys.exit(1)

    scope = missions_touched[0] if missions_touched else "(no mission files changed)"
    print(f"OK: PR is scoped to a single mission ({scope})")


if __name__ == "__main__":
    main()
