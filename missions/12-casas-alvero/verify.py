#!/usr/bin/env python3
"""Verifier for 12-casas-alvero (a counterexample / refutation mission).

The Casas-Alvero conjecture: if a degree-n polynomial f shares at least one root
with each of its derivatives f', f'', ..., f^(n-1) (each derivative separately),
then f = c(x - a)^n — a single root of multiplicity n.

A counterexample is a polynomial that satisfies the hypothesis (shares a root
with every derivative) yet is NOT a pure power. We accept rational-coefficient
polynomials, given as an integer coefficient list (scaling to clear denominators
changes neither the roots nor the shared-root structure). Everything is checked
with exact rational arithmetic — no floating point.

  score 1 = hypothesis holds and f has >= 2 distinct roots  → refutes it
  score 0 = f = c(x - a)^n, a single n-fold root — the sanity seed, consistent
            with the conjecture (e.g. (x - 1)^3)

"Shares a root with f^(i)" means gcd(f, f^(i)) is non-constant; a witness that
fails the hypothesis (some gcd is constant) is rejected as INVALID.

Usage: python3 verify.py <witness.json>
Prints "VALID score=<n>" and exits 0, or "INVALID: <reason>" and exits 1.
"""
import json
import sys
from fractions import Fraction

MISSION = "12-casas-alvero"


def fail(reason: str):
    print(f"INVALID: {reason}")
    sys.exit(1)


def normalize(c):
    """Strip leading (high-degree) zero coefficients; keep as Fractions."""
    c = [Fraction(x) for x in c]
    while len(c) > 1 and c[-1] == 0:
        c.pop()
    return c


def degree(c):
    c = normalize(c)
    if len(c) == 1 and c[0] == 0:
        return -1  # the zero polynomial
    return len(c) - 1


def derivative(c):
    c = normalize(c)
    if len(c) <= 1:
        return [Fraction(0)]
    return [Fraction(i) * c[i] for i in range(1, len(c))]


def poly_mod(a, b):
    """Remainder of a divided by b over Q (b must be non-zero)."""
    a = normalize(a)
    b = normalize(b)
    db = degree(b)
    while degree(a) >= db and degree(a) >= 0:
        coef = a[-1] / b[-1]
        shift = degree(a) - db
        for i in range(len(b)):
            a[i + shift] -= coef * b[i]
        a = normalize(a)
    return a


def poly_gcd(a, b):
    a, b = normalize(a), normalize(b)
    while degree(b) >= 0:
        a, b = b, poly_mod(a, b)
    return normalize(a)


def main():
    if len(sys.argv) != 2:
        fail("usage: verify.py <witness.json>")
    try:
        data = json.load(open(sys.argv[1]))
    except Exception as e:
        fail(f"cannot parse JSON: {e}")

    if data.get("mission") != MISSION:
        fail(f"mission field must be {MISSION!r}")

    coeffs = data.get("witness", {}).get("coeffs")
    if not isinstance(coeffs, list) or len(coeffs) < 2:
        fail("witness.coeffs must be a list [c0, c1, ..., cn] of the polynomial's integer coefficients (constant term first)")
    if not all(isinstance(x, int) and not isinstance(x, bool) for x in coeffs):
        fail("witness.coeffs must contain only integers")

    f = normalize(coeffs)
    n = degree(f)
    if n < 2:
        fail("polynomial degree must be at least 2 (below that the conjecture is trivial)")

    # Hypothesis: f shares a root with each of f', ..., f^(n-1).
    fi = f
    for i in range(1, n):
        fi = derivative(fi)
        if degree(poly_gcd(f, fi)) < 1:
            fail(f"hypothesis fails: f shares no root with its derivative of order {i} (gcd is constant)")

    # Pure power test: f = c(x - a)^n iff f has a single distinct root, i.e.
    # gcd(f, f') has degree n - 1. Otherwise f has >= 2 distinct roots.
    single_root = degree(poly_gcd(f, derivative(f))) == n - 1
    score = 0 if single_root else 1

    claimed = data.get("score")
    if claimed is not None and claimed != score:
        fail(f"claimed score {claimed} != computed score {score}")

    print(f"VALID score={score}")
    sys.exit(0)


if __name__ == "__main__":
    main()
