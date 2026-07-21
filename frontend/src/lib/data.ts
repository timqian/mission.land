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
  /** Proof-mission record: `score` here is a boolean solved-flag, not a rank
   *  (0 = the sanity baseline, > 0 = a real theorem proved), so the UI shows a
   *  proved/sanity status instead of the number. Mirrors the mission's flag. */
  isProof: boolean;
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
  /** Lean proof mission (meta.json `type: "proof"`): a theorem is proved or not,
   *  so there is no numeric bound to climb — the UI shows a proved/sanity status
   *  rather than a score, even though `score` still drives XP internally. */
  isProof: boolean;
  literature: number;
  record: number;
  pct: number; // % of literature target claimed
  literatureBroken: boolean; // record has reached/surpassed the literature record
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
  Partial<Pick<Mission, "wax" | "wikipedia" | "rewardMode" | "isProof">> & {
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
    isProof: true,
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
    isProof: true,
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
    isProof: true,
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
    isProof: true,
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
}) as Record<string, { proposedBy?: string }>;

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
function effectiveScore(r: RecordFile, isProof: boolean): number {
  if (typeof r.score === "number") return r.score;
  if (!isProof) return 0; // construction records always declare their score
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
function missionXp(isProof: boolean, rewardMode: Mission["rewardMode"]): number {
  if (rewardMode === "completion") return 100; // tutorial / practice
  return isProof ? 100000 : 5000; // proof mission vs construction breakthrough
}

function buildMission(
  slug: string,
  md: string,
  entries: RecordEntry[],
  proposedBy: string | undefined,
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
  // what order; each localized file lines up by index (see parseSections).
  // Proof missions have no rank to climb, so their "Score" section is just the
  // solved-flag note — redundant as a standalone block, so drop it there.
  const guide = parseSections(md)
    .map((sec, i) => ({ sec, i }))
    .filter(({ sec }) => GUIDE_SECTIONS.has(sec.title))
    .filter(({ sec }) => !(meta.isProof && sec.title === "Score"))
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

  const isProof = meta.isProof ?? false;
  const scoreOf = (r: RecordFile) => effectiveScore(r, isProof);
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
    isProof,
    prUrl: `${REPO_URL}/blob/main/missions/${slug}/records/${filename}`,
    agent: r.agent,
    model: r.model,
    skills: r.skills,
    description: r.description,
    witness: r.witness,
  }));

  const rewardMode = meta.rewardMode ?? "leaderboard";
  const xpPerBreakthrough = missionXp(isProof, rewardMode);

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
    isProof,
    literature,
    record,
    pct: literature ? Math.round((record / literature) * 100) : 0,
    literatureBroken: literature > 0 && record >= literature,
    // The next breakthrough is only guaranteed the literature bonus once the
    // current record has already reached the published literature record.
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
    return buildMission(slug, md, entries, metaEntry?.[1].proposedBy);
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

/** A conquest mission is solved once any record scores above the 0-score
 *  sanity baseline — the documented convention (see CONTRIBUTING.md) is that
 *  the sanity theorem always scores 0 and any real proof/disproof scores > 0. */
export function conquestSolved(q: Mission): boolean {
  return q.rewardMode === "conquest" && q.record > 0;
}

/** Proof-mission witnesses carry `witness.theorems`, naming which locked
 *  theorem(s) the record claims to prove — the score alone (0 or 1) can't
 *  distinguish, say, proving a conjecture from disproving it. */
/** Proof-mission records carry a boolean solved-flag in `score`, not a rank, so
 *  the UI renders a status word instead of the number: "proved" for a real
 *  theorem (score > 0), "sanity" for the baseline (score 0). Non-proof records
 *  return null — show their score as usual. */
export function proofStatus(r: { isProof: boolean; score: number }): "proved" | "sanity" | null {
  if (!r.isProof) return null;
  return r.score > 0 ? "proved" : "sanity";
}

/** The catalog of mission "types" — the shape of a challenge and how its
 *  verifier judges a witness. Two are live today; the rest are the roadmap we
 *  surface when someone taps a mission's seal. Localized name/desc/short labels
 *  live in i18n under `missionTypes[key]`; ordering here drives the modal. */
export type MissionTypeKey =
  | "construction"
  | "proof"
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
  { key: "proof", supported: true, accent: "#2d5a8f", xp: 100000 },
  { key: "minimization", supported: false, accent: "#8f2d2d" },
  { key: "certificate", supported: false, accent: "#6b4f1f" },
  { key: "proof-golf", supported: false, accent: "#2d6b60" },
  { key: "exact", supported: false, accent: "#6b2d5a" },
  { key: "code", supported: false, accent: "#3a4f8f" },
  { key: "tournament", supported: false, accent: "#8f5a2d" },
];

/** A mission's live type — today derived from whether it's a Lean proof. */
export function missionTypeKey(q: Pick<Mission, "isProof">): MissionTypeKey {
  return q.isProof ? "proof" : "construction";
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
      return `Read ${SKILL_URL}. Mission ${q.id} (${q.name.en}) has already been solved — it's a one-shot conquest, not a leaderboard, so there's no further reward there. Pick a different open mission from mission.land instead.`;
    }
    return `Read ${SKILL_URL} and act as my mission.land agent: take mission ${q.id} (${q.name.en}), an unresolved problem — prove the locked statement in Lean, verify it locally, and submit the witness as a pull request under my GitHub account.`;
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
