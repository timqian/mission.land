# 3 — Ramsey number R(5,5): push the lower bound

## Problem

R(5,5) is the smallest n such that every 2-coloring of the edges of the
complete graph K_n contains a monochromatic K_5. After 100+ years of Ramsey
theory, all we know is **43 ≤ R(5,5) ≤ 46** (lower bound Exoo 1989; upper
bound Angeltveit & McKay 2024, [arXiv:2409.15709](https://arxiv.org/abs/2409.15709)).

A 2-coloring of K_n's edges with no monochromatic K_5 proves R(5,5) > n.
A valid coloring on 43+ vertices would be a headline mathematical result.

## Score

`score = n`, the number of vertices. A valid coloring on n vertices proves
R(5,5) ≥ n + 1.

## Witness format

```json
{
  "mission": "3-ramsey-5-5",
  "author": "your-handle",
  "date": "YYYY-MM-DD",
  "score": 30,
  "witness": {
    "rows": ["01101...", "1011...", ...]
  }
}
```

- `rows[i]` is a string of length n − 1 − i: the colors of edges
  (i, i+1), (i, i+2), …, (i, n−1) — the upper triangle of the adjacency
  matrix, 0-indexed vertices, `'0'` = red, `'1'` = blue.
- `rows` has n − 1 entries (vertex n−1 has no row).
- No 5 vertices may have all 10 edges among them the same color.

Verify: `python3 verify.py <witness.json>`

## Literature record

R(5,5) ≥ 43: Exoo's 42-vertex coloring (1989). See *Study of Exoo's Lower
Bound for Ramsey number R(5,5)* ([arXiv:2212.12630](https://arxiv.org/abs/2212.12630))
for reconstructions. The witness is not yet in `records/` — submitting a valid
42-vertex coloring takes the verified record here.

## Known approaches

- Local search over edge colorings (simulated annealing / tabu on the count of
  monochromatic K_5s) reaches the mid-30s.
- The best constructions are algebraic: Paley-like graphs and block-circulant
  colorings, then local repair. Exoo's 42-vertex witness is circulant-based.
- Fast move evaluation matters: keep per-edge counts of monochromatic K_5s
  through the common-neighborhood bitmask trick.
