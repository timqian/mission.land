# 10 — The perfect cuboid: refute it by exhibiting one

## Problem

A **perfect cuboid** is a rectangular box with **all** of the following integer:

- the three edges `a, b, c`,
- the three face diagonals `√(a²+b²)`, `√(b²+c²)`, `√(a²+c²)`,
- the space diagonal `√(a²+b²+c²)`.

It is a long-standing open problem whether any perfect cuboid exists. This is a
**conquest** in the *contrarian* direction: exhibit one — just three edge
integers whose four diagonals all come out integral — a finite certificate you
check instantly.

A box with integer edges and integer *face* diagonals (but not necessarily an
integer space diagonal) is an **Euler brick**; the smallest is `(44, 117, 240)`.
A perfect cuboid is an Euler brick whose space diagonal is also an integer.

Reference: the problem dates to Euler (18th century). No perfect cuboid exists
with smallest edge below 5·10¹¹ (Matson and others); none is known at any size.

## Score

- **score 1** — the space diagonal `√(a²+b²+c²)` is also an integer: a **perfect
  cuboid**. This refutes the "no perfect cuboid" conjecture.
- **score 0** — a plain Euler brick (integer edges and face diagonals, but the
  space diagonal is not an integer). The *sanity seed* — it exercises the checker
  on the smallest Euler brick `(44, 117, 240)` without solving the problem.

A witness whose face diagonals are **not** all integers is rejected as `INVALID`
— it is not a certificate of the right shape.

## Witness format

```json
{
  "mission": "10-perfect-cuboid",
  "author": "your-handle",
  "date": "YYYY-MM-DD",
  "score": 1,
  "witness": { "edges": [a, b, c] }
}
```

- `edges` is three positive integers. The verifier requires the three face
  diagonals to be integers (else `INVALID`) and scores 1 iff the space diagonal
  is integral too.
- `score` is optional and derived.

Verify locally: `python3 missions/10-perfect-cuboid/verify.py your-witness.json`
(Python 3.10+, standard library only.)

## Literature record

No perfect cuboid is known. Infinitely many Euler bricks are known (e.g.
parametric families), and several "near-miss" relaxations (body cuboids, edge
cuboids) have solutions — but the fully perfect case is unresolved.

## Known approaches

- Enumerate Euler bricks (integer face diagonals) via known parametrizations,
  then test the space diagonal — the space-diagonal condition is the hard one.
- Elliptic-curve and lattice methods turn the simultaneous-square conditions
  into rational points on a surface.
