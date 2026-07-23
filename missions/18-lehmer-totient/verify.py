#!/usr/bin/env python3
import json
import sys

MISSION = "18-lehmer-totient"
LIMIT = 1 << 64
BASES = (2, 325, 9375, 28178, 450775, 9780504, 1795265022)

def fail(reason):
    print(f"INVALID: {reason}")
    raise SystemExit(1)

def is_prime(n):
    if n < 2:
        return False
    for p in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37):
        if n % p == 0:
            return n == p
    d, s = n - 1, 0
    while d % 2 == 0:
        s += 1
        d //= 2
    for a in BASES:
        if a % n == 0:
            continue
        x = pow(a, d, n)
        if x in (1, n - 1):
            continue
        for _ in range(s - 1):
            x = x * x % n
            if x == n - 1:
                break
        else:
            return False
    return True

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
    n = w.get("n") if isinstance(w, dict) else None
    factors = w.get("factors") if isinstance(w, dict) else None
    if type(n) is not int or n < 4 or not isinstance(factors, list) or not factors:
        fail("witness requires composite integer n and a nonempty factors list")
    product, phi, previous = 1, 1, 1
    for item in factors:
        if not isinstance(item, list) or len(item) != 2:
            fail("each factor must be [prime, exponent]")
        p, exponent = item
        if type(p) is not int or type(exponent) is not int or not previous < p < LIMIT or exponent < 1:
            fail("factors must be increasing 64-bit primes with positive exponents")
        if not is_prime(p):
            fail(f"factor {p} is not prime")
        product *= p ** exponent
        phi *= (p - 1) * p ** (exponent - 1)
        previous = p
    if product != n:
        fail("factorization product does not equal n")
    if len(factors) == 1 and factors[0][1] == 1:
        fail("n must be composite")
    score = 1 if (n - 1) % phi == 0 else 0
    if data.get("score") is not None and data.get("score") != score:
        fail(f"claimed score {data.get('score')} != computed score {score}")
    print(f"VALID score={score}")

if __name__ == "__main__":
    main()
