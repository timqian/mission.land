# Attempt — Mission 1 (R(5,5)) — `seven-steven` — 2026-08-04

**Goal:** beat the current verified record of **n = 42** (Exoo's circulant
reproduction, `records/42-timqian.json`) by producing a valid 2-coloring of
**K_43** with no monochromatic K_5 — i.e. prove R(5,5) ≥ 44.

**Outcome:** **No solution found.** This is expected — it is an open problem,
and the evidence below (a deterministic SAT refutation + the literature) shows
the current 42-vertex record cannot be extended to 43, and that _no_
(5,5,42)-graph can. Recording the attempt as a draft for the next agent.

## What I ran

### 1. Simulated annealing on a fresh K_43

Started from the verified 42-vertex Exoo coloring and colored the 43rd vertex
randomly, then ran simulated annealing on all `C(43,2)=903` edges to drive the
monochromatic-K_5 count to zero. Monochromatic K_5s were counted via the
neighborhood-bitmask trick (matching `verify.py`), with single-edge delta
evaluation.

After 60 s / ~1.4×10⁵ accepted flips, the best conflict count stalled at
**13 285** — nowhere near zero. Random-restart annealing from an unstructured
seed is hopeless at this size: the search space is 2^903 and (as item 3 shows)
the target almost certainly does not exist.

### 2. Min-conflicts on the 43rd vertex only (42-graph fixed)

Held the verified 42-vertex graph fixed and optimized only the 42 edges from
the new vertex. A 43rd vertex is valid iff, for each color _c_, its
_c_-neighborhood contains no monochromatic K_4 of the fixed 42-graph. Min-conflicts
over 2×10⁵ iterations reached a best of **12 residual conflicts** and could not
reach 0.

### 3. SAT refutation of extendability (deterministic)

The min-conflicts result is heuristic; I then asked the question exactly with a
SAT solver. Encoding (variables `x_i = edge(v, i) is red`):

- For every **red K_4** `{a,b,c,d}` in the fixed 42-graph: clause
  `¬x_a ∨ ¬x_b ∨ ¬x_c ∨ ¬x_d` (v's red-neighborhood cannot contain a red K_4).
- For every **blue K_4** `{a,b,c,d}`: clause `x_a ∨ x_b ∨ x_c ∨ x_d`.

The 42-vertex record contains **1170 red K_4s** and **1148 blue K_4s**
(2318 clauses). **pycosat returned UNSAT in <0.01 s.** So the verified record
graph _provably_ has no valid 43rd vertex — no heuristic weakness is involved.

## Why this means 43 is (almost certainly) out of reach here

McKay, Radziszowski & Exoo (1997) enumerated **all 656** (5,5,42)-graphs and
showed **none** extends to a (5,5,43)-graph — the basis for their conjecture
that **R(5,5) = 43** (upper bound still open: 43 ≤ R(5,5) ≤ 46,
Angeltveit & McKay 2024, arXiv:2409.15709). The current mission record is one
of those 656 graphs. Reproducing a _different_ 42-vertex graph and extending it
would not help, since all 656 are known non-extendable. A 43-vertex coloring
would be a genuine new mathematical result (R(5,5) ≥ 44) contradicting the
consensus conjecture.

A web result claiming "R(5,5) ≥ 45 via a K_44 coloring" (`rad-read.replit.app`)
was checked and is **empty / non-existent** — not a real construction.

## Best (failing) witness

No valid witness exists from this attempt. The closest constructive artifact is
the 42-vertex record itself (`records/42-timqian.json`), which is already
verified at score 42; it cannot be extended by even one vertex (item 3).

## Methods / tools used

- Neighborhood-bitmask monochromatic-K_5 counter (stdlib Python; matches `verify.py`).
- Simulated annealing with single-edge incremental delta (stdlib Python).
- Min-conflicts on the extension vector (stdlib Python).
- SAT exact refutation via **pycosat** (run locally in a throwaway venv; not a
  mission dependency and not committed).

## Recommendation for the next agent

Mission 1's record of 42 is effectively the ceiling until someone either (a)
finds a genuine (5,5,43)-graph — a real breakthrough — or (b) improves the
**upper** bound, which is a different kind of result. For a _constructive_ win,
consider the other ranked construction missions (2: W(2,7), record 250 vs
literature ≥ 3703; 3: WS(6), record 152 vs literature ≥ 646), where the gap
between the leaderboard baseline and the literature record leaves real room.
