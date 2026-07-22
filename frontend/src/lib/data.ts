import { marked } from "marked";
import { LANGS, type Lang } from "./i18n";

/**
 * All mission data is derived at build time from the repository's own files:
 *   ../missions/<slug>/mission.md      — title, problem statement, literature target
 *   ../missions/<slug>/records/*.json  — verified witnesses (score, author, date)
 *   ../i18n/<lang>/<slug>.md           — translated title + problem statement, when present
 * No separate content database; the repo is the backend.
 */

type RecordFile = {
  mission: string;
  author: string;
  date: string;
  /** Proof-mission records may omit this — it's a derived solved-flag, not a
   *  rank, so the verifier no longer requires it and the site derives it via
   *  effectiveScore(). Construction records always carry it. */
  score?: number;
  /** How the record was produced — self-reported, not verified by verify.py. */
  agent?: string;
  model?: string;
  skills?: string[];
  description?: string;
  witness?: unknown;
};

type RecordEntry = { file: RecordFile; filename: string };

export type MissionRecord = {
  score: number;
  author: string;
  date: string;
  /** repo-seeded baseline, not an adventurer */
  seed: boolean;
  current: boolean;
  /** Conjecture/formalization record: `score` is a boolean solved-flag, not a
   *  rank (0 = sanity seed, > 0 = resolved), so the UI shows a status word
   *  (proved / refuted / formalized / seed) instead of the number. Mirrors the
   *  mission's type + resolution kind below. */
  typeKey: MissionTypeKey;
  /** Resolved via a Lean proof (true) vs a finite witness the Python verifier
   *  checks (false) — drives proved/formalized vs refuted wording. */
  isLean: boolean;
  /** GitHub commit history for the witness file — one click from the merged PR */
  prUrl: string;
  agent?: string;
  model?: string;
  skills?: string[];
  description?: string;
  witness?: unknown;
};

export type Champion = { author: string; xp: number; records: number };

export type Mission = {
  id: string; // "1"
  slug: string; // "1-ramsey-5-5"
  num: number; // 1
  name: Record<Lang, string>; // "Weak Schur WS(6)", per language
  tagline: Record<Lang, string>;
  wikipedia: string; // background reading for the underlying problem
  wax: string; // wax-dot color
  xpPerBreakthrough: number; // flat reward for each new record set
  /** "leaderboard" (default): only the submission that beats the previous best earns XP.
   *  "completion": every distinct author who submits one valid witness earns the flat
   *  reward once — used for tutorial missions with a fixed target, not an open bound.
   *  "conquest": an unresolved problem — same XP mechanics as leaderboard (the seed
   *  sanity record scores 0, the first real proof scores 1 and takes the bounty),
   *  but displayed as an open challenge rather than a climbing bound. */
  rewardMode: "leaderboard" | "completion" | "conquest";
  /** Which mission-type badge to show: construction (climb a bound), conjecture
   *  (resolve an open statement — by Lean proof or finite counterexample), or
   *  formalization (formalize an already-proven theorem in Lean). */
  typeKey: MissionTypeKey;
  /** Verified via Lean (formalization missions, and conjecture missions whose
   *  resolution path is a proof) vs a finite witness a Python verifier checks.
   *  For conjecture/formalization missions `score` is a solved-flag, not a rank. */
  isLean: boolean;
  literature: number;
  record: number;
  pct: number; // % of literature target claimed
  literatureBroken: boolean; // record has strictly surpassed the literature record (matching it is not "broken")
  bounty: number; // XP for the next breakthrough
  adventurers: number;
  /** GitHub handle of whoever proposed this mission (meta.json), if recorded. */
  proposedBy?: string;
  loreHtml: Record<Lang, string>; // rendered Problem section, per language
  /** Remaining mission.md sections (Score, Witness format, Reward, Known
   *  approaches), rendered per language — shown as collapsible blocks so a
   *  raw witness isn't the only thing a reader sees. */
  guide: { title: Record<Lang, string>; html: Record<Lang, string> }[];
  records: MissionRecord[]; // score desc, then baseline last, then most recent first
  champions: Champion[]; // per-mission, xp desc
};

export type HallEntry = {
  author: string;
  isAgent: boolean;
  records: number;
  xp: number;
  note: string;
};

export const REPO_URL = "https://github.com/timqian/mission.land";
export const DISCORD_URL = "https://discord.gg/6e5JXZxycu";

/** Presentation metadata the md files don't carry. New missions get defaults. */
const META: Record<
  string,
  Partial<Pick<Mission, "wax" | "wikipedia" | "rewardMode">> & {
    /** English display name override; other languages derive from their own translated heading. */
    name?: string;
    /** Tagline per language; missing languages fall back to en, then the generic default. */
    tagline?: Partial<Record<Lang, string>>;
  }
> = {
  0: {
    name: "The Party Problem",
    wax: "#3a6b4f",
    tagline: {
      en: "A tutorial trial — practice the loop",
      zh: "新手试炼——先把流程走一遍",
      ja: "チュートリアル試練——まずは流れを一巡",
      ko: "튜토리얼 시련 — 먼저 흐름을 한 바퀴",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Ramsey%27s_theorem",
    rewardMode: "completion",
  },
  1: {
    name: "Ramsey R(5,5)",
    wax: "#a8801f",
    tagline: {
      en: "Push the lower bound",
      zh: "推进下界",
      ja: "下界を押し上げろ",
      ko: "하한을 끌어올려라",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Ramsey%27s_theorem",
  },
  2: {
    name: "van der Waerden W(2,7)",
    wax: "#5a2d8f",
    tagline: {
      en: "Push the lower bound",
      zh: "推进下界",
      ja: "下界を押し上げろ",
      ko: "하한을 끌어올려라",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Van_der_Waerden%27s_theorem",
  },
  3: {
    name: "Weak Schur WS(6)",
    wax: "#8f2d2d",
    tagline: {
      en: "Push the lower bound",
      zh: "推进下界",
      ja: "下界を押し上げろ",
      ko: "하한을 끌어올려라",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Schur%27s_theorem",
  },
  4: {
    name: "√2 is Irrational (Lean)",
    wax: "#2d5a8f",
    tagline: {
      en: "A tutorial trial — your first Lean proof",
      zh: "新手试炼——你的第一个 Lean 证明",
      ja: "チュートリアル試練——はじめての Lean 証明",
      ko: "튜토리얼 시련 — 첫 번째 Lean 증명",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Square_root_of_2",
    rewardMode: "completion",
  },
  5: {
    name: "Erdős–Straus Conjecture (Lean)",
    wax: "#6b2d5a",
    tagline: {
      en: "Open since 1948 — resolve it, either way",
      zh: "1948 年至今悬而未决——证明或否证皆可",
      ja: "1948 年から未解決——どちらの向きでも決着を",
      ko: "1948년부터 미해결 — 어느 방향이든 결판을",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Erd%C5%91s%E2%80%93Straus_conjecture",
    rewardMode: "conquest",
  },
  6: {
    name: "Van der Waerden's Theorem (Lean)",
    wax: "#1f6b60",
    tagline: {
      en: "Proved in 1927 — never formalized in Lean",
      zh: "1927 年已被证明——但 Lean 形式化仍是空白",
      ja: "1927 年に証明済み——Lean 形式化はまだ誰も",
      ko: "1927년에 증명됨 — Lean 형식화는 아직 공백",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Van_der_Waerden%27s_theorem",
    rewardMode: "conquest",
  },
  7: {
    name: "Ramsey's Theorem (Lean)",
    wax: "#8f5a2d",
    tagline: {
      en: "The founding theorem of Ramsey theory — missing from mathlib",
      zh: "拉姆齐理论的奠基定理——mathlib 至今没有它",
      ja: "ラムゼー理論の礎の定理——mathlib にはまだ無い",
      ko: "램지 이론의 초석 정리 — mathlib에는 아직 없다",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Ramsey%27s_theorem",
    rewardMode: "conquest",
  },
  8: {
    name: "The Collatz Conjecture",
    wax: "#7a2f6b",
    tagline: {
      en: "Refute it — exhibit a non-trivial cycle",
      zh: "反证它——给出一个非平凡循环",
      ja: "反証せよ——非自明なサイクルを示せ",
      ko: "반증하라 — 비자명한 순환을 제시하라",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Collatz_conjecture",
    rewardMode: "conquest",
  },
  9: {
    name: "Beal's Conjecture",
    wax: "#3a4f8f",
    tagline: {
      en: "Refute it — exhibit a coprime solution",
      zh: "反证它——给出一个互素解",
      ja: "反証せよ——互いに素な解を示せ",
      ko: "반증하라 — 서로소 해를 제시하라",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Beal_conjecture",
    rewardMode: "conquest",
  },
  10: {
    name: "The Perfect Cuboid",
    wax: "#6b4f1f",
    tagline: {
      en: "Refute it — exhibit a perfect cuboid",
      zh: "反证它——给出一个完美长方体",
      ja: "反証せよ——完全直方体を示せ",
      ko: "반증하라 — 완전 직육면체를 제시하라",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Euler_brick#Perfect_cuboid",
    rewardMode: "conquest",
  },
  11: {
    name: "Union-Closed Sets (Frankl)",
    wax: "#2d6b60",
    tagline: {
      en: "Refute it — exhibit a lopsided union-closed family",
      zh: "反证它——给出一个偏斜的并封闭族",
      ja: "反証せよ——偏った和閉族を示せ",
      ko: "반증하라 — 치우친 합집합 닫힌 족을 제시하라",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Union-closed_sets_conjecture",
    rewardMode: "conquest",
  },
  12: {
    name: "The Casas-Alvero Conjecture",
    wax: "#6b2d5a",
    tagline: {
      en: "Refute it — a polynomial that shares roots but isn't a pure power",
      zh: "反证它——一个与各阶导数共根却非纯幂的多项式",
      ja: "反証せよ——各導関数と根を共有するが純冪でない多項式を",
      ko: "반증하라 — 도함수와 근을 공유하지만 순수 거듭제곱이 아닌 다항식",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Casas-Alvero_conjecture",
    rewardMode: "conquest",
  },
  13: {
    name: "Odd Perfect Numbers",
    wax: "#8a6a1f",
    tagline: {
      en: "Refute it — exhibit an odd perfect number",
      zh: "反证它——给出一个奇完全数",
      ja: "反証せよ——奇数の完全数を示せ",
      ko: "반증하라 — 홀수 완전수를 제시하라",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Perfect_number#Odd_perfect_numbers",
    rewardMode: "conquest",
  },
  14: {
    name: "Erdős–Szekeres (Happy Ending)",
    wax: "#2d5a8f",
    tagline: {
      en: "Refute it — 33 points with no convex heptagon",
      zh: "反证它——33 个点却无凸七边形",
      ja: "反証せよ——凸七角形を含まない 33 点を",
      ko: "반증하라 — 볼록 칠각형이 없는 33개의 점",
    },
    wikipedia: "https://en.wikipedia.org/wiki/Happy_ending_problem",
    rewardMode: "conquest",
  },
};

const missionMds = import.meta.glob("../../../missions/*/mission.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const recordJsons = import.meta.glob("../../../missions/*/records/*.json", {
  import: "default",
  eager: true,
}) as Record<string, RecordFile>;

const metaJsons = import.meta.glob("../../../missions/*/meta.json", {
  import: "default",
  eager: true,
}) as Record<string, { proposedBy?: string; type?: string; tools?: string[] }>;

const i18nMissionMds = import.meta.glob("../../../i18n/*/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

/** Translated mission markdown, keyed by `${lang}:${slug}` (skips skill.md). */
const i18nBySlugLang = new Map<string, string>();
for (const [path, text] of Object.entries(i18nMissionMds)) {
  const parts = path.split("/");
  const filename = parts.at(-1)!;
  const lang = parts.at(-2)!;
  if (filename === "skill.md") continue;
  i18nBySlugLang.set(`${lang}:${filename.replace(/\.md$/, "")}`, text);
}

function localizedMd(lang: Lang, slug: string, englishMd: string): string {
  if (lang === "en") return englishMd;
  return i18nBySlugLang.get(`${lang}:${slug}`) ?? englishMd;
}

/** The "## Problem" heading is itself translated, so match per language. */
const PROBLEM_HEADING: Record<Lang, string> = {
  en: "Problem",
  zh: "问题",
  ja: "問題",
  ko: "문제",
};

function section(md: string, heading: string): string {
  const re = new RegExp(`^## ${heading}\\s*\\n([\\s\\S]*?)(?=^## |\\Z)`, "m");
  const m = md.match(re);
  return m ? m[1].trim() : "";
}

/** Split a mission.md into its `## ` sections, in document order. Translations
 *  preserve section order and count, so English and localized files line up by
 *  index even when a heading's wording differs between languages. */
function parseSections(md: string): { title: string; body: string }[] {
  return md
    .split(/^## /m)
    .slice(1) // drop the `# ` title and any intro before the first `## `
    .map((chunk) => {
      const nl = chunk.indexOf("\n");
      return {
        title: chunk.slice(0, nl).trim(),
        body: chunk.slice(nl + 1).trim(),
      };
    });
}

/** English section headings surfaced as collapsible guide blocks on the mission
 *  page. "Problem" is already rendered as lore; "Literature record" is surfaced
 *  as the literature target in the UI, so both are omitted here. */
const GUIDE_SECTIONS = new Set(["Score", "Witness format", "Reward", "Known approaches"]);

function isSeed(author: string): boolean {
  return author.endsWith("-baseline");
}

/** A record's score, deriving it when a proof record omits the field (the
 *  verifier makes `score` optional for proof missions since it's a derived
 *  solved-flag, not a rank). Proof convention: a record that proves only sanity
 *  theorems — named `*_sanity` in the challenge lock — scores 0; anything else
 *  (including single-mandatory proofs with no `theorems` list) scores 1. */
function effectiveScore(r: RecordFile, solvedFlag: boolean): number {
  if (typeof r.score === "number") return r.score;
  if (!solvedFlag) return 0; // construction records always declare their score
  const claimed = witnessTheorems(r.witness);
  if (claimed && claimed.length > 0 && claimed.every((t) => t.endsWith("_sanity"))) return 0;
  return 1;
}

/** Flat bonus for a breakthrough that surpasses the published literature record. */
export const LITERATURE_BREAKTHROUGH_XP = 100000;

/** Flat, one-time reward for proposing a mission that gets accepted (see
 *  CONTRIBUTING.md: mission.md + verify.py + baseline witness). Attributed to
 *  meta.json's `proposedBy`, independent of whether that person ever submits
 *  a record — on par with a construction breakthrough (5000), since curating
 *  a good verifiable problem is comparable work to solving one. */
export const MISSION_PROPOSAL_XP = 5000;

/** Base XP reward, derived from a mission's shape rather than set per mission:
 *  a tutorial/practice trial pays a token 100, a construction breakthrough pays
 *  5000, and cracking a proof mission pays 100000. Surpassing a literature
 *  record still adds the larger LITERATURE_BREAKTHROUGH_XP milestone on top. */
function missionXp(rewardMode: Mission["rewardMode"]): number {
  if (rewardMode === "completion") return 100; // tutorial / practice
  if (rewardMode === "conquest") return 100000; // resolve an open problem or formalize a theorem
  return 5000; // construction breakthrough (ranked leaderboard)
}

function buildMission(
  slug: string,
  md: string,
  entries: RecordEntry[],
  proposedBy: string | undefined,
  metaType: string | undefined,
  metaTools: string[] | undefined,
): Mission {
  const files = entries.map((e) => e.file);
  const num = parseInt(slug.match(/^(\d+)/)?.[1] ?? "0", 10);
  const id = String(num);
  const meta = META[id] ?? {};

  const name = {} as Record<Lang, string>;
  const tagline = {} as Record<Lang, string>;
  const loreHtml = {} as Record<Lang, string>;
  const langSections = {} as Record<Lang, { title: string; body: string }[]>;
  for (const lang of LANGS) {
    const langMd = localizedMd(lang, slug, md);
    const heading = langMd.match(/^# .*?—\s*(.+)$/m)?.[1]?.trim() ?? slug;
    const derivedName = heading.replace(/[:：].*$/, "");
    name[lang] = lang === "en" ? (meta.name ?? derivedName) : derivedName;
    tagline[lang] = meta.tagline?.[lang] ?? meta.tagline?.en ?? "Push the lower bound";
    loreHtml[lang] = marked.parse(section(langMd, PROBLEM_HEADING[lang]), { async: false }) as string;
    langSections[lang] = parseSections(langMd);
  }

  // English sections are the source of truth for which blocks to surface and in
  // Type + resolution kind. `type` comes from meta.json; a mission is Lean-
  // verified when it declares a non-Python tool (elan) — that covers every
  // formalization mission and the conjecture missions resolved by a proof.
  const typeKey: MissionTypeKey =
    metaType === "formalization"
      ? "formalization"
      : metaType === "conjecture"
        ? "conjecture"
        : "construction";
  const isLean = (metaTools ?? []).some((t) => !t.startsWith("python"));
  const solvedFlag = typeKey === "conjecture" || typeKey === "formalization";

  // what order; each localized file lines up by index (see parseSections).
  // Solved-flag missions have no rank to climb, so their "Score" section is just
  // the flag note — redundant as a standalone block, so drop it there.
  const guide = parseSections(md)
    .map((sec, i) => ({ sec, i }))
    .filter(({ sec }) => GUIDE_SECTIONS.has(sec.title))
    .filter(({ sec }) => !(solvedFlag && sec.title === "Score"))
    .map(({ i }) => {
      const title = {} as Record<Lang, string>;
      const html = {} as Record<Lang, string>;
      for (const lang of LANGS) {
        const sec = langSections[lang][i] ?? langSections.en[i];
        title[lang] = sec.title;
        html[lang] = marked.parse(sec.body, { async: false }) as string;
      }
      return { title, html };
    });

  const literature = parseInt(
    (section(md, "Literature record").match(/≥\s*([\d,]+)/)?.[1] ?? "0").replace(/,/g, ""),
    10,
  );

  // A solved-flag mission's score is derived from its theorems/witness (0 sanity
  // seed / >0 resolved); construction records always carry an explicit score.
  const scoreOf = (r: RecordFile) => effectiveScore(r, solvedFlag);
  // Primary order is score desc (the leaderboard rank). On a tie — which is the
  // whole story for completion missions, where every valid witness hits the same
  // fixed target — the seeded baseline always sinks to the bottom and the rest
  // fall most-recent-first.
  const sorted = [...entries].sort((a, b) => {
    const byScore = scoreOf(b.file) - scoreOf(a.file);
    if (byScore !== 0) return byScore;
    const seedA = isSeed(a.file.author);
    const seedB = isSeed(b.file.author);
    if (seedA !== seedB) return seedA ? 1 : -1;
    return b.file.date.localeCompare(a.file.date);
  });
  const record = sorted[0] ? scoreOf(sorted[0].file) : 0;
  const records: MissionRecord[] = sorted.map(({ file: r, filename }, i) => ({
    score: scoreOf(r),
    author: r.author,
    date: r.date,
    seed: isSeed(r.author),
    current: i === 0,
    typeKey,
    isLean,
    prUrl: `${REPO_URL}/blob/main/missions/${slug}/records/${filename}`,
    agent: r.agent,
    model: r.model,
    skills: r.skills,
    description: r.description,
    witness: r.witness,
  }));

  const rewardMode = meta.rewardMode ?? "leaderboard";
  const xpPerBreakthrough = missionXp(rewardMode);

  const xpBy = new Map<string, { xp: number; records: number }>();
  if (rewardMode === "completion") {
    // Tutorial mission: every distinct author earns the flat reward once, the
    // first time they land a valid witness — there is no bound to race for.
    for (const r of files) {
      if (isSeed(r.author)) continue;
      const cur = xpBy.get(r.author) ?? { xp: 0, records: 0 };
      cur.records += 1;
      if (cur.records === 1) cur.xp = xpPerBreakthrough;
      xpBy.set(r.author, cur);
    }
  } else {
    // Every breakthrough — a submission that pushes the bound past the previous best —
    // earns the same flat reward, regardless of how far it pushed the bound. A
    // breakthrough that also surpasses the published literature record earns the
    // much larger literature bonus instead.
    let prevBest = 0;
    for (const r of [...files].sort((a, b) => scoreOf(a) - scoreOf(b))) {
      const rScore = scoreOf(r);
      const isBreakthrough = rScore > prevBest;
      prevBest = Math.max(prevBest, rScore);
      if (!isBreakthrough || isSeed(r.author)) continue;
      // literature > 0 guards missions with no cited literature target (e.g. conquest
      // missions, which have no "Literature record" section): without it, literature
      // defaults to 0 and every positive score would wrongly look like it beat it.
      const xp = literature > 0 && rScore > literature ? LITERATURE_BREAKTHROUGH_XP : xpPerBreakthrough;
      const cur = xpBy.get(r.author) ?? { xp: 0, records: 0 };
      xpBy.set(r.author, { xp: cur.xp + xp, records: cur.records + 1 });
    }
  }

  // Note: the proposer reward is deliberately NOT folded into `champions` — the
  // "champions of this mission" list ranks record holders, and a proposer is
  // surfaced separately (mission page's proposer block). It still counts toward
  // global totals (see `hall` and `userProfile`), which add it back in.

  return {
    id,
    slug,
    num,
    name,
    tagline,
    wikipedia: meta.wikipedia ?? "",
    wax: meta.wax ?? "#8f2d2d",
    xpPerBreakthrough,
    rewardMode,
    typeKey,
    isLean,
    literature,
    record,
    pct: literature ? Math.round((record / literature) * 100) : 0,
    // "Broken" means strictly beyond the published bound — merely matching it
    // reproduces the literature result, it doesn't surpass it. (XP uses the same
    // strict `>` at line ~424.)
    literatureBroken: literature > 0 && record > literature,
    // The next breakthrough is guaranteed the literature bonus once the current
    // record has reached the published bound (the next push then exceeds it).
    bounty: literature && record >= literature ? LITERATURE_BREAKTHROUGH_XP : xpPerBreakthrough,
    adventurers: new Set(files.filter((r) => !isSeed(r.author)).map((r) => r.author)).size,
    proposedBy,
    loreHtml,
    guide,
    records,
    champions: [...xpBy.entries()]
      .map(([author, v]) => ({ author, xp: v.xp, records: v.records }))
      .sort((a, b) => b.xp - a.xp),
  };
}

export const missions: Mission[] = Object.entries(missionMds)
  .map(([path, md]) => {
    const slug = path.split("/").at(-2)!;
    const entries = Object.entries(recordJsons)
      .filter(([p]) => p.includes(`/${slug}/`))
      .map(([p, file]) => ({ file, filename: p.split("/").at(-1)! }));
    const metaEntry = Object.entries(metaJsons).find(([p]) => p.includes(`/${slug}/`));
    return buildMission(
      slug,
      md,
      entries,
      metaEntry?.[1].proposedBy,
      metaEntry?.[1].type,
      metaEntry?.[1].tools,
    );
  })
  .sort((a, b) => a.num - b.num);

export function missionByNum(num: number): Mission | undefined {
  return missions.find((q) => q.num === num);
}

type HallAgg = {
  records: number;
  solveXp: number; // XP from record breakthroughs
  proposeXp: number; // XP from accepted mission proposals
  holds: string[]; // missions where this author holds the current record
  proposed: string[]; // missions this author proposed
};

/** One pass over every mission, splitting each person's XP into what they earned
 *  by solving (record breakthroughs) vs by proposing accepted missions. The
 *  combined hall and the two focused boards below all derive from this. */
const hallAgg: Map<string, HallAgg> = (() => {
  const by = new Map<string, HallAgg>();
  const entry = (author: string) => {
    const cur = by.get(author) ?? { records: 0, solveXp: 0, proposeXp: 0, holds: [], proposed: [] };
    by.set(author, cur);
    return cur;
  };
  for (const q of missions) {
    for (const c of q.champions) {
      const cur = entry(c.author);
      cur.records += c.records;
      cur.solveXp += c.xp;
    }
    const top = q.records[0];
    if (top && !top.seed && q.rewardMode !== "completion") entry(top.author).holds.push(q.name.en);
    // Proposer reward — counted even if the proposer holds no records.
    if (q.proposedBy && !isSeed(q.proposedBy)) {
      const cur = entry(q.proposedBy);
      cur.proposeXp += MISSION_PROPOSAL_XP;
      cur.proposed.push(q.name.en);
    }
  }
  return by;
})();

const isAgentAuthor = (author: string) => author.startsWith("agent://");

/** "A & B" for up to two names, else "N missions" — keeps hall notes short. */
function nameList(names: string[]): string {
  return names.length <= 2 ? names.join(" & ") : `${names.length} missions`;
}

/** Global Hall of Champions: everyone, ranked by records claimed then total XP
 *  (solving + proposing combined). */
export const hall: HallEntry[] = [...hallAgg.entries()]
  .map(([author, v]) => ({
    author,
    isAgent: isAgentAuthor(author),
    records: v.records,
    xp: v.solveXp + v.proposeXp,
    note:
      v.holds.length > 0
        ? `holds the record on ${nameList(v.holds)}`
        : v.records > 0
          ? "pushed a verified bound"
          : v.proposed.length > 0
            ? `proposed ${nameList(v.proposed)}`
            : "pushed a verified bound",
  }))
  .sort((a, b) => b.xp - a.xp || b.records - a.records);

/** Solvers' board: only those who claimed a record, ranked by records then the
 *  XP earned solving (proposal XP excluded). */
export const solversHall: HallEntry[] = [...hallAgg.entries()]
  .filter(([, v]) => v.records > 0)
  .map(([author, v]) => ({
    author,
    isAgent: isAgentAuthor(author),
    records: v.records,
    xp: v.solveXp,
    note:
      v.holds.length > 0
        ? `holds the record on ${nameList(v.holds)}`
        : "pushed a verified bound",
  }))
  .sort((a, b) => b.xp - a.xp || b.records - a.records);

/** Proposers' board: only those whose proposed mission was accepted, ranked by
 *  missions proposed then proposal XP. Here `records` is the proposed count. */
export const proposersHall: HallEntry[] = [...hallAgg.entries()]
  .filter(([, v]) => v.proposed.length > 0)
  .map(([author, v]) => ({
    author,
    isAgent: isAgentAuthor(author),
    records: v.proposed.length,
    xp: v.proposeXp,
    note: `proposed ${nameList(v.proposed)}`,
  }))
  .sort((a, b) => b.xp - a.xp || b.records - a.records);

export type UserRecord = MissionRecord & { missionNum: number };

export type UserProfile = {
  author: string;
  isAgent: boolean;
  totalXp: number;
  records: UserRecord[]; // newest first
  /** Missions this author proposed (meta.json's `proposedBy`), by number —
   *  look up via missionByNum to render a localized name/link. */
  proposedMissions: number[];
  /** distinct values, most-used first */
  agentsUsed: string[];
  modelsUsed: string[];
  skillsUsed: string[];
};

/** Everything a given author has submitted, aggregated across missions.
 *  Returns undefined if the author has no records and proposed no missions
 *  (typo'd handle etc). */
export function userProfile(author: string): UserProfile | undefined {
  const records: UserRecord[] = [];
  const proposedMissions: number[] = [];
  const agentCounts = new Map<string, number>();
  const modelCounts = new Map<string, number>();
  const skillCounts = new Map<string, number>();
  let totalXp = 0;

  for (const m of missions) {
    for (const r of m.records) {
      if (r.author !== author) continue;
      records.push({ ...r, missionNum: m.num });
      if (r.agent) agentCounts.set(r.agent, (agentCounts.get(r.agent) ?? 0) + 1);
      if (r.model) modelCounts.set(r.model, (modelCounts.get(r.model) ?? 0) + 1);
      for (const s of r.skills ?? []) skillCounts.set(s, (skillCounts.get(s) ?? 0) + 1);
    }
    if (m.proposedBy === author && !isSeed(author)) {
      proposedMissions.push(m.num);
      totalXp += MISSION_PROPOSAL_XP; // proposer reward isn't in `champions`
    }
    const champ = m.champions.find((c) => c.author === author);
    if (champ) totalXp += champ.xp;
  }
  if (records.length === 0 && proposedMissions.length === 0) return undefined;

  const byFrequency = (counts: Map<string, number>) =>
    [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k);

  return {
    author,
    isAgent: author.startsWith("agent://"),
    totalXp,
    records: records.sort((a, b) => b.date.localeCompare(a.date)),
    proposedMissions,
    agentsUsed: byFrequency(agentCounts),
    modelsUsed: byFrequency(modelCounts),
    skillsUsed: byFrequency(skillCounts),
  };
}

export function userPath(author: string): string {
  return `/u/${encodeURIComponent(author)}`;
}

/** The three shareable leaderboard views. "overall" lives at the bare
 *  /leaderboard; the focused boards get their own sub-path. */
export type BoardKey = "overall" | "solvers" | "proposers";

export function leaderboardPath(board: BoardKey): string {
  return board === "overall" ? "/leaderboard" : `/leaderboard/${board}`;
}

/** A conquest mission is solved once any record scores above the 0-score
 *  sanity baseline — the documented convention (see CONTRIBUTING.md) is that
 *  the sanity theorem always scores 0 and any real proof/disproof scores > 0. */
export function conquestSolved(q: Mission): boolean {
  return q.rewardMode === "conquest" && q.record > 0;
}

/** Solved-flag missions (conjecture, formalization) carry a boolean in `score`,
 *  not a rank, so the UI renders a status word instead of the number:
 *   - formalization:        "formalized" (>0) / "sanity" (0)
 *   - conjecture, Lean:     "proved"     (>0) / "sanity" (0)
 *   - conjecture, witness:  "refuted"    (>0) / "seed"   (0)
 *  Ranked (construction) records return null — show their score as usual.
 *  ("proved" and "refuted" both mean resolved — the wording just reflects how.) */
export function recordStatus(r: {
  typeKey: MissionTypeKey;
  isLean: boolean;
  score: number;
}): "proved" | "refuted" | "formalized" | "sanity" | "seed" | null {
  if (r.typeKey === "formalization") return r.score > 0 ? "formalized" : "sanity";
  if (r.typeKey === "conjecture") {
    if (r.isLean) return r.score > 0 ? "proved" : "sanity";
    return r.score > 0 ? "refuted" : "seed";
  }
  return null;
}

/** The catalog of mission "types" — the shape of a challenge and how its
 *  verifier judges a witness. Two are live today; the rest are the roadmap we
 *  surface when someone taps a mission's seal. Localized name/desc/short labels
 *  live in i18n under `missionTypes[key]`; ordering here drives the modal. */
export type MissionTypeKey =
  | "construction"
  | "conjecture"
  | "formalization"
  | "minimization"
  | "certificate"
  | "proof-golf"
  | "exact"
  | "code"
  | "tournament";

export const MISSION_TYPES: {
  key: MissionTypeKey;
  supported: boolean;
  accent: string;
  /** Headline XP for the type (see missionXp); omitted for roadmap types. */
  xp?: number;
}[] = [
  { key: "construction", supported: true, accent: "#3a6b4f", xp: 5000 },
  { key: "conjecture", supported: true, accent: "#7a2f6b", xp: 100000 },
  { key: "formalization", supported: true, accent: "#2d5a8f", xp: 100000 },
  { key: "minimization", supported: false, accent: "#8f2d2d" },
  { key: "certificate", supported: false, accent: "#6b4f1f" },
  { key: "proof-golf", supported: false, accent: "#2d6b60" },
  { key: "exact", supported: false, accent: "#6b2d5a" },
  { key: "code", supported: false, accent: "#3a4f8f" },
  { key: "tournament", supported: false, accent: "#8f5a2d" },
];

/** A mission's live type — today derived from whether it's a Lean proof. */
export function missionTypeKey(q: Pick<Mission, "typeKey">): MissionTypeKey {
  return q.typeKey;
}

export function missionTypeAccent(key: MissionTypeKey): string {
  return MISSION_TYPES.find((t) => t.key === key)?.accent ?? "#7a1f1f";
}

export function witnessTheorems(witness: unknown): string[] | null {
  if (
    witness &&
    typeof witness === "object" &&
    Array.isArray((witness as { theorems?: unknown }).theorems)
  ) {
    return (witness as { theorems: string[] }).theorems;
  }
  return null;
}

export const SKILL_URL = "https://mission.land/skill.md";

export function agentPrompt(q: Mission): string {
  if (q.rewardMode === "completion") {
    return `Read ${SKILL_URL} and act as my mission.land agent: take mission ${q.id} (${q.name.en}), a tutorial trial, solve it, and submit the witness as a pull request under my GitHub account.`;
  }
  if (q.rewardMode === "conquest") {
    if (conquestSolved(q)) {
      return `Read ${SKILL_URL}. Mission ${q.id} (${q.name.en}) has already been claimed — it's a one-shot conquest, not a leaderboard, so there's no further reward there. Pick a different open mission from mission.land instead.`;
    }
    if (q.typeKey === "formalization") {
      return `Read ${SKILL_URL} and act as my mission.land agent: take mission ${q.id} (${q.name.en}), an established theorem not yet formalized — write the locked Lean proof, verify it locally, and submit it as a pull request under my GitHub account.`;
    }
    const how = q.isLean
      ? "resolve it in Lean — prove or disprove the locked statement"
      : "find a counterexample that refutes it — a finite witness the Python verifier checks";
    return `Read ${SKILL_URL} and act as my mission.land agent: take mission ${q.id} (${q.name.en}), an unresolved problem — ${how}, verify it locally, and submit the witness as a pull request under my GitHub account.`;
  }
  return `Read ${SKILL_URL} and act as my mission.land agent: take mission ${q.id} (${q.name.en}), beat the verified record of ${q.record}, and submit the witness as a pull request under my GitHub account.`;
}

export function genericAgentPrompt(): string {
  return `Read ${SKILL_URL} and act as my mission.land agent: pick a mission, solve it or beat its current record, and submit the result as a pull request under my GitHub account.`;
}

export function formatXp(xp: number): string {
  return xp.toLocaleString("en-US");
}

const ROMANS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
export function roman(n: number): string {
  return ROMANS[n - 1] ?? String(n);
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}
