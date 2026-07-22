#!/usr/bin/env python3
"""Verifier for 13-odd-perfect (a counterexample / refutation mission).

An integer n is perfect if sigma(n) = 2n (sigma = sum of divisors). All known
perfect numbers are even; whether an ODD perfect number exists is a famous open
problem. A counterexample is a single odd perfect number.

The witness gives n together with its full prime factorization, and — because
sigma is computed from that factorization — each claimed prime factor must be
*proved* prime, or the check could be gamed by passing off a composite as a
prime. Primality is proved by a Pratt (Lucas) certificate, verified exactly.

  score 1 = a perfect number that is odd   → an odd perfect number, refutes it
  score 0 = an even perfect number (e.g. 6) — the sanity seed: it exercises the
            factorization/sigma/primality machinery without refuting anything

A witness whose factorization is wrong, or whose sigma != 2n, or whose factors
are not certified prime, is rejected as INVALID.

Usage: python3 verify.py <witness.json>
Prints "VALID score=<n>" and exits 0, or "INVALID: <reason>" and exits 1.
"""
import json
import sys

MISSION = "13-odd-perfect"


def fail(reason: str):
    print(f"INVALID: {reason}")
    sys.exit(1)


def _is_int(x) -> bool:
    return isinstance(x, int) and not isinstance(x, bool)


def is_prime_pratt(p, cert):
    """Verify a Pratt/Lucas certificate that p is prime. Returns (ok, reason).

    For p = 2 the certificate is trivial. For odd p the certificate gives a base
    a and the full prime factorization of p-1 (each factor itself certified):
    if a^(p-1) = 1 (mod p) and a^((p-1)/q) != 1 (mod p) for every prime q | p-1,
    then a has order p-1, so p is prime.
    """
    if not _is_int(p) or p < 2:
        return False, f"{p!r} is not an integer >= 2"
    if p == 2:
        return True, ""
    if p % 2 == 0:
        return False, f"{p} is even and > 2 (composite)"
    if not isinstance(cert, dict):
        return False, f"missing Pratt certificate for {p}"
    a = cert.get("a")
    factors = cert.get("factors")
    if not _is_int(a) or not (1 < a < p):
        return False, f"cert for {p}: base 'a' must be an integer in (1, {p})"
    if not isinstance(factors, list) or not factors:
        return False, f"cert for {p}: 'factors' must be a non-empty list of [q, e, cert_q]"
    if pow(a, p - 1, p) != 1:
        return False, f"cert for {p}: a^(p-1) != 1 (mod {p})"

    prod = 1
    distinct_q = set()
    for item in factors:
        if not (isinstance(item, list) and len(item) == 3):
            return False, f"cert for {p}: each factor must be [q, e, cert_q]"
        q, e, cq = item
        if not _is_int(q) or not _is_int(e) or e < 1:
            return False, f"cert for {p}: bad factor entry {item!r}"
        ok, why = is_prime_pratt(q, cq)
        if not ok:
            return False, f"cert for {p}: factor {q} not certified prime — {why}"
        prod *= q**e
        distinct_q.add(q)
    if prod != p - 1:
        return False, f"cert for {p}: factors multiply to {prod}, not p-1 = {p - 1}"
    for q in distinct_q:
        if pow(a, (p - 1) // q, p) == 1:
            return False, f"cert for {p}: a^((p-1)/{q}) = 1 (mod {p}) — 'a' is not a primitive root"
    return True, ""


def main():
    if len(sys.argv) != 2:
        fail("usage: verify.py <witness.json>")
    try:
        data = json.load(open(sys.argv[1]))
    except Exception as e:
        fail(f"cannot parse JSON: {e}")

    if data.get("mission") != MISSION:
        fail(f"mission field must be {MISSION!r}")

    w = data.get("witness", {})
    n = w.get("n")
    fac = w.get("factorization")
    if not _is_int(n) or n < 2:
        fail("witness.n must be an integer >= 2")
    if not isinstance(fac, list) or not fac:
        fail("witness.factorization must be a non-empty list of [prime, exponent, pratt_cert]")

    product = 1
    sigma = 1
    seen = set()
    for item in fac:
        if not (isinstance(item, list) and len(item) == 3):
            fail("each factorization entry must be [prime, exponent, pratt_cert]")
        p, e, cert = item
        if not _is_int(p) or not _is_int(e) or e < 1:
            fail(f"bad factorization entry {item[:2]!r} — need integer prime and exponent >= 1")
        if p in seen:
            fail(f"prime {p} listed more than once")
        seen.add(p)
        ok, why = is_prime_pratt(p, cert)
        if not ok:
            fail(f"factor {p} not certified prime — {why}")
        product *= p**e
        sigma *= (p ** (e + 1) - 1) // (p - 1)

    if product != n:
        fail(f"factorization multiplies to {product}, not n = {n}")
    if sigma != 2 * n:
        fail(f"not a perfect number: sigma(n) = {sigma}, but 2n = {2 * n}")

    score = 1 if n % 2 == 1 else 0

    claimed = data.get("score")
    if claimed is not None and claimed != score:
        fail(f"claimed score {claimed} != computed score {score}")

    print(f"VALID score={score}")
    sys.exit(0)


if __name__ == "__main__":
    main()
