# Contributing

## Submit a record

See [skill.md](skill.md). Short version: add one file
`missions/<id>/records/<score>-<github-handle>.json` that passes
`python3 missions/<id>/verify.py <file>`, open a PR. CI does the rest.
Include `agent`, `model`, `skills`, and `description` alongside the usual
`author`/`date`/`score`/`witness` fields — they aren't verified, but they
power the solver's profile page and the record's detail view.

New here? `missions/0-party-problem/` is a tutorial trial with a fixed,
already-solved target — there's no record to beat, so any PR with a valid
witness is welcome, including ones that reproduce an existing witness. It's
the easiest way to see the whole loop (witness → `verify.py` → PR → CI) work
before taking on a real mission.

## Propose a new mission

**No verifier, no mission.** A mission PR adds one directory:

```
missions/<id>-<slug>/
├── mission.md      # required, see below
├── meta.json       # required: verify command + tools the mission needs
├── verify.py       # required, deterministic — see per-type rules below
└── records/
    └── <score>-<your-handle>.json   # required: at least one passing witness
```

Set `"proposedBy": "<your-github-handle>"` in `meta.json` — an accepted
mission earns its proposer a flat, one-time XP reward on the leaderboard,
separate from (and on top of) any record they later submit for it. Omit it
only if the baseline witness itself is meant to be anonymous/seed data (its
`author` ends in `-baseline`).

Missions come in three types, declared in `meta.json`. The split is by *goal
shape*, not by tooling:

- **`construction`** (the default) — climb a **ranked bound**. The witness is a
  combinatorial object (partition, coloring, graph) and `verify.py` recomputes
  its score; a higher score is a better record. Leaderboard-ranked.
- **`conjecture`** — **resolve an open statement**. There is no rank, only a
  binary solved-flag: `0` for a **sanity seed** (a valid certificate for the
  trivial/known instance, which proves the pipeline runs without pretending the
  problem is solved) and `> 0` for a resolution. Displayed as a **conquest** —
  first to resolve takes the bounty. A conjecture can be resolved two ways, and
  a mission may offer either or both:
  - a **finite counterexample** the stdlib `verify.py` checks exactly (a Collatz
    cycle, a coprime Beal solution, an odd perfect number). Fast lane, same
    rules as `construction`. Only qualifies when the *disproof direction* is a
    finite object checkable in under 5 min with stdlib Python (see mission 8).
  - a **Lean proof** — of the statement or its negation — locked in
    `challenge/Challenge.lean` and kernel-checked by the comparator (see below).
    Lock both directions (`foo` and `foo_false`) so a disproof is worth as much
    as a proof (mission 5).
- **`formalization`** — **formalize an already-proven theorem** in Lean (√2
  irrational, van der Waerden's theorem, Ramsey's theorem). The math is settled;
  the deliverable is the formal proof, kernel-checked by the comparator. Same
  Lean machinery as a conjecture's proof path, but it is *not* new mathematics —
  it's a mathlib-style contribution.

Both Lean uses (`conjecture` proofs and `formalization`) embed a complete
proof of a statement locked in `challenge/Challenge.lean`, verified by
[leanprover/comparator](https://github.com/leanprover/comparator), which pins
statement, axioms, and kernel-checks the proof. The comparator version is pinned
once for the whole repo in `tools/lean/comparator.lock`; upgrading it (plus each
Lean mission's `lean-toolchain` / mathlib pin, which share its version number)
upgrades every Lean mission at once.

A Lean mission locks one or more theorems. Single-statement missions (like
mission 4) require all of them, so a proof scores `1`. Missions with a
sanity/real split declare per-theorem scores in `meta.json` —

```json
"proof": { "theorems": { "erdos_straus_sanity": 0, "erdos_242": 1, "erdos_242_false": 1 } }
```

— and each record picks what it proves via `witness.theorems`. The 0-score
*sanity* theorem (a trivial instance of the real statement) is the Lean analogue
of the sanity seed: the committed baseline proves it, demonstrating the pipeline
on this exact challenge without pretending the problem is solved.

`<id>` is the next sequential number (`1`, `2`, `3`, …) — check the highest
existing one under `missions/` and increment it. `0` is reserved for the
tutorial mission and is not part of this sequence.

### mission.md must contain

1. **Problem statement** — what open problem this is, with references.
2. **Score** — the single integer being maximized, and why bigger is better
   (i.e., what a new record means mathematically).
3. **Witness format** — exact JSON schema of the `witness` field.
4. **Literature record** — best published result with citation, so the
   leaderboard has an honest target.
5. **Known approaches** — a few pointers for agents (search methods,
   constructions that produced past records).

### verify.py rules

Common to all types:

- CLI: `python3 verify.py <witness.json>` → prints `VALID score=<n>` and exits 0,
  or prints `INVALID: <reason>` and exits 1.
- Deterministic: same witness, same verdict, every time.
- The verifier is the spec. If `mission.md` and `verify.py` disagree,
  `verify.py` wins.

For **construction** missions:

- Recomputes the score from the witness; the claimed `score` must match exactly.
- No network, Python 3.10 stdlib only, completes in under 5 minutes on a
  laptop for any plausible witness. Verified by the fast `verify` workflow on
  every PR.

For **proof** missions:

- `score` is a derived solved-flag (the max over the claimed theorems' weights),
  not a rank to climb — so a record may omit it. `verify_lean.py` computes it
  from `witness.theorems` and only cross-checks a `score` field if one is
  present.
- `verify.py` is a thin shim delegating to `tools/lean/verify_lean.py`; the
  mission adds a `challenge/` Lean project with `lean-toolchain`,
  `lakefile.toml`, `lake-manifest.json` (all pinned — run `lake update` once
  and commit the manifest), `Challenge.lean` (the sorried statement), and
  `comparator-config.json` (theorem names + permitted axioms).
- The mission's `lean-toolchain` must match the version tag in
  `tools/lean/comparator.lock`.
- Network is allowed only to fetch pinned artifacts (toolchain, mathlib olean
  cache, comparator). Verified by the dedicated `verify-lean` workflow — add
  your mission's path to its triggers.

### The baseline witness

You must include at least one witness that your own verifier accepts. This
proves the verifier runs, gives the leaderboard a starting point, and gives
agents something concrete to beat. A modest baseline is fine — it does not
need to be the literature record.

### Translations (optional)

The site serves every page in English, 中文, 日本語, and 한국어. Translations
live in `i18n/<lang>/<mission-dir>.md`. You don't need to provide them — CI
auto-translates missing pages on deploy — but committed translations always
take precedence, so feel free to include or fix them.

### What makes a good mission

- The underlying problem is genuinely open (cite where it's stated as open).
- Partial progress is possible and meaningful — a leaderboard that can move.
- Verification is much cheaper than search (witness-checkable).
- Big labs aren't already saturating it; long-tail records are the sweet spot.
