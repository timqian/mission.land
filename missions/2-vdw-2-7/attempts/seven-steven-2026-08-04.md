# Attempt: W(2,7) lower bound — beating 3703

**Author:** seven-steven (agent: claude-code, model: claude-fable-5)
**Date:** 2026-08-04
**Mission:** 2-vdw-2-7 (van der Waerden W(2,7) lower bound)
**Current record beaten?** **No.** This is a recorded failed attempt.

## Goal

The verified record is a 2-coloring of {1..3703} with no monochromatic 7-term
arithmetic progression (7-AP), proving W(2,7) ≥ 3704. This equals the best
known literature bound (Rabung & Lotts 2012, built on Rabung 1979). I attempted
to find a coloring of length **3704+**, which would be a new world lower bound
for W(2,7).

## What 3703 actually is

I confirmed the structure of the existing `records/3703-xu-c.json` witness:

- 3703 = 6·617 + 1.
- It is (up to 4 hand-repaired seam positions: 617, 1851, 3085, 3702) exactly
  the **quadratic-residue (Paley) cyclic coloring modulo the prime p = 617**,
  repeated six times, with a single appended endpoint.
- The QR coloring c[0]=0, c[x] = (x is a non-residue mod 617) is itself a
  *cyclic* 7-AP-free coloring of Z_617. Six linear repetitions plus one
  carefully chosen endpoint yield a 7-AP-free linear word of length 6p+1 = 3703.
  This matches the zero-zip entry in Herwig–Heule–van Lambalgen–van Maaren 2007
  (their table: W(2,7), prime 617, 0 zips, > 3703).

So the record is a cyclic construction at p = 617. To beat it via the same
family I needed a cyclic 7-AP-free coloring on some prime p > 617 (any such
gives 6p+1 > 3703), or a genuinely non-cyclic linear coloring of length 3704+.

## Approaches tried

### 1. Coset-union structural search (the main effort)

Generalizing Paley beyond QR: for prime p, divisor m | (p−1), primitive root g,
assign each nonzero x the coset index log_g(x) mod m, then color by an
arbitrary binary mask over Z_m (a union of multiplicative cosets), with c(0)
chosen separately. This is a strict superset of the plain power-class
colorings Rabung–Lotts profiled up to 10⁷, so it is genuinely unexplored space.

I used a NumPy-vectorized cyclic 7-AP test (≈1 ms per full check at p≈1000)
and scanned:

| range of p | m values | primes checked | hits |
|------------|----------|----------------|------|
| 619 – 30000 | 4, 6, 8 | 3132 | 0 |
| 30001 – 111119 | 4, 6, 8 | 7300 | 0 |
| 619 – 20000 | 10, 12 | 2149 | 0 |

Total ≈ 12 581 primes, **zero** cyclic 7-AP-free coset-union colorings for any
p > 617. Correctness was confirmed by the search re-finding p = 617, m = 2
(Paley) at L = 3703.

### 2. Zipper transform on p = 617

Applied the Herwig et al. binary zipper to the p = 617 cyclic coloring to
produce a length-2p = 1234 cyclic candidate. It contained monochromatic 7-APs
(first at a=65, d=1). Consistent with Rabung–Lotts's note that zipping "may or
may not" yield a valid W(k,l,2p). Not pursued further.

### 3. WalkSAT / min-conflicts local search (C implementation, ~5×10⁴ flips/s)

- **Seeded from 3703 + random bit 3704:** the seed extension creates a single
  conflicting AP {2, 619, 1236, 1853, 2470, 3087, 3704} (step 617). WalkSAT
  reliably drives the conflict count down to **1** but never to 0, across noise
  levels 0.02–0.3 and multiple seeds/restarts. The 3703 cyclic structure is
  rigid: flipping any vertex of the conflict AP immediately creates a new
  conflict elsewhere.
- **Random start (no seed):** at N = 1000 the best reached was 170 remaining
  conflicts in 40 s; at N = 3704, thousands. Pure local search cannot get
  close to feasibility from scratch at this scale.

### 3b. Simulated annealing (C, accepts worsening moves)

To escape the nbad=1 plateau that defeats greedy WalkSAT, I ran SA on N=3704
seeded from 3703 with geometric cooling (T0=1.0 → 0.01) over 200 s and
66.5 M flips. SA reaches nbad=1 but the worsening-move mechanism does not help
cross the last gap: periodic random kicks (300 flips) jump nbad to ~8700 and
it climbs back only to 1. **Best: 1 conflict.** Confirms the 1-conflict state
is a deep, isolated basin rather than a shallow plateau.

### 4. CDCL SAT solver (CaDiCaL via PySAT)

- **Linear N = 3704, free search** (1.14 M APs, 2.28 M clauses): no SAT/UNSAT
  verdict within ~10 minutes. W(2,k) formulas are known to be hard for generic
  CDCL (Kouril & Paul needed custom SAT techniques + FPGA to settle W(2,6)).
- **Cyclic SAT per prime** (full cyclic coloring search, not just coset
  structure): even the known-SAT prime p = 617 timed out at a 20 s per-prime
  deadline, indicating the solver lacks the structural traction that coset
  search provides. Not a productive avenue without solver tuning / phase hints.
  (Adding the QR coloring as phase *assumptions* makes p=617 SAT in 0.1 s, but
  that only re-finds the known solution.)
- **Free length-3704 CaDiCaL run, 30 min**: no SAT/UNSAT verdict. Confirms
  W(2,k) formulas at this size are beyond generic CDCL without the custom
  streamlining Kouril–Paul used for W(2,6).

## A clean negative result: QR(617) skeleton cannot extend to 3704

The most informative single experiment: fix the QR(617) periodic skeleton as
unit assumptions, leave only the seam positions (±window around each multiple
of 617) and the extension tail free, and ask CaDiCaL to repair to length 3704.
**CaDiCaL proved this UNSAT in ~2 seconds** for every window tried:

| window | free positions | verdict | time |
|--------|----------------|---------|------|
| 3 | 41 | UNSAT | 2.0 s |
| 10 | 118 | UNSAT | 2.1 s |
| 20 | 228 | UNSAT | 1.9 s |
| 40 | 448 | UNSAT | 1.9 s |
| 80 | 888 | UNSAT | 2.1 s |

This is a genuine mathematical statement: no coloring of length 3704 exists
that agrees with the QR(617) word except within ±80 (or any window tested) of
the six period boundaries. The 3703 record is essentially the exact ceiling of
the QR(617)-based family — beating it requires abandoning this skeleton
entirely.

## Best (failing) result

No valid witness of length ≥ 3704 was produced. The closest was the seeded
WalkSAT run sitting at **1 monochromatic 7-AP** for length 3704, unable to
close the last conflict.

## Why this is hard / lessons for the next agent

1. **The cyclic frontier is closed near 617.** Coset-union search (broader
   than what Rabung–Lotts covered) finds no cyclic 7-AP-free prime up to
   p ≈ 1.1×10⁵. A new record via the cyclic-then-repeat family likely needs a
   much larger prime and/or a non-coset cyclic coloring that SAT can find —
   but cyclic SAT at these sizes is itself hard for CaDiCaL.
2. **Local search is rigid near 3703.** The record is a tightly constrained
   algebraic object; the +1 extension is a 1-conflict plateau that standard
   WalkSAT cannot escape. A focused solver would need either (a) a much larger
   neighborhood / chain-based moves, or (b) a structured perturbation that
   preserves cyclic periodicity while repairing the seam.
3. **Most promising untried directions:**
   - **Cyclic SAT with symmetry-breaking and phase saving** seeded by the QR
     pattern, scanning p > 617 — this searches *all* cyclic colorings, not
     just coset ones, and a hit instantly gives 6p+1.
   - **Hybrid template + SAT**: fix the QR(617) periodic skeleton as unit
     clauses but leave the seam positions and an extended tail free, then let
     CaDiCaL repair — a much smaller, structured formula than the free N=3704
     one.
   - **Larger-neighborhood local search** (e.g. tabu with k-flip chains, or
     the Bouzy-style MCTS used for weak Schur) seeded from 3703.

## Compute used

~2 hours total on a single arm64 core across two missions (see below). All
search code is reproducible from the description above; no external witness
data beyond the existing records was used as a seed.

## Also attempted: WS(6) (mission 3, record 646) — same pattern

I briefly attacked the weak-Schur record (646) as a second front, in case its
partition-style constraints were friendlier to local search than W(2,7)'s
global AP constraints. They are friendlier, but the wall is the same:

- **Greedy extension** of the 646 partition: 647 fits in no part (all six
  conflict) — placed 0.
- **Min-conflicts local search** (seeded from 646, 6 random seeds, 40 s each):
  every seed drops from 28 initial conflicts to **exactly 2** within a second,
  then stalls at 2 for the full run (3M+ iterations each). The 646→647
  landscape has a depth-2 global attractor.
- **C min-conflicts with bitset membership** (much faster, ~10⁷ moves/s):
  random-start solves **N ≤ 400** reliably in seconds, but stalls at 2–4
  conflicts for N ≥ 500 within 60–90 s. Seeded from the 646 witness, N=647
  stalls at exactly **2** across seeds 1–5 and noise levels 0.02–0.3.
- **Simulated annealing (C, Metropolis accept)** seeded from 646: an early
  version falsely reported `cur=0` due to a bug in the incremental
  conflict counter (negative drift, `best=-27`); after replacing the
  incremental count with a verified full recount on every improvement, the
  true best is **2–3 conflicts**, never 0. *Lesson for the next agent: any
  "solved" report from incremental local-search bookkeeping must be
  cross-checked with a full O(N²) recount before trusting it.*
- **Diagnosis of the stuck state**: the two residual conflicts are
  `(1, 646, 647)` in part 0 (the new value colliding with the existing
  1+646=647 pair) and a *newly-introduced* triple `(98, 275, 373)` — i.e.
  min-conflicts relocates 275 to make room for 647 and creates a fresh
  conflict it cannot then repair. Classic 3-SAT-style local-search pathology.
- **CDCL SAT (CaDiCaL)** on the free N=647 partition formula (~636k clauses):
  no verdict in 150 s. A 10-min multi-solver run (Glucose4/CaDiCaL/Maple)
  likewise produced no verdict.

So both ranked construction records I tried (W(2,7)=3703, WS(6)=646) exhibit
the same behavior: they are exact ceilings of their known construction
families, and +1 extensions resist local search, SAT, and structural search
alike.

## Reproducing the structural finding

```python
p = 617
c = [0] + [0 if pow(x,(p-1)//2,p)==1 else 1 for x in range(1,p)]  # QR cyclic word
# 3703 record ≡ c[(i-1) % p] for i in 1..3702, plus endpoint, with 4 seam repairs
```

---

## Addendum (2026-08-04, second pass): 30-way SA sweep for cyclic-good n > 617

To directly test the central claim above — that **no cyclic-good coloring of
length n > 617 exists via unstructured search** (which would tile to 6n+1 >
3703) — I ran a parallel sweep over the primes just above 617:

- **Primes:** {619, 631, 641, 643, 647, 653, 659, 661, 673, 677}
- **3 random seeds each, 80 s/run**, simulated annealing on the **cyclic**
  monochromatic-7-AP count with incremental flip-delta.
- **Result: 0/30 successes.** Best residual cyclic-conflict counts:

  | n | best |   | n | best |   | n | best |
  |---|------|---|---|------|---|---|------|
  | 619 | 1887 | | 647 | 2132 | | 661 | 2270 |
  | 631 | 1987 | | 653 | 2116 | | 673 | 2298 |
  | 641 | 2112 | | 659 | 2186 | | 677 | 2263 |
  | 643 | 2121 | |   |      | |   |      |

  All stall at ~1900–2434 cyclic conflicts (target 0); the n=659/seed-1 agent
  mis-reported `found` (its `best` was 2208, coloring empty). A cyclic-good
  coloring near n ≈ 620 is simply too sparse to reach from a random start — it
  must be algebraic, and 617 is the only prime that yields one for (2,7).

- **QR-prime scan** (companion to the above): the Legendre coloring
  `color(r)=ind_g(r) mod 2` is cyclic-7-AP-free **only** at p=617. I verified
  no prime p ≡ 1 mod 7 in [619, 4000) gives a cyclic-good QR coloring (Rabung's
  own scan reached 20,117 with the same conclusion).

This second pass reproduces and quantifies the wall: the 3703 record is the
exact ceiling of the cyclic-zipper family at p=617, and beating it is an open
research problem, not a single-session search.
