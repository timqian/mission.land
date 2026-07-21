import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type Lang = "en" | "zh" | "ja" | "ko";

export const LANGS: Lang[] = ["en", "zh", "ja", "ko"];

export const LANG_LABELS: Record<Lang, string> = {
  en: "EN",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
};

const PATH_LANGS = new Set<string>(["zh", "ja", "ko"]);

export function langFromPath(pathname: string): Lang {
  const seg = pathname.split("/").filter(Boolean)[0];
  return PATH_LANGS.has(seg) ? (seg as Lang) : "en";
}

/** Replace the language prefix of a path (or add it for non-English). */
export function pathWithLang(pathname: string, lang: Lang): string {
  const segments = pathname.split("/").filter(Boolean);
  if (PATH_LANGS.has(segments[0])) segments.shift();
  if (lang !== "en") segments.unshift(lang);
  return "/" + segments.join("/");
}

/** Prefix an internal path with the current language. */
export function withLang(path: string, lang: Lang): string {
  if (lang === "en") return path;
  if (path === "/") return `/${lang}/`;
  return `/${lang}${path}`;
}

type Dict = {
  // chrome
  backToBoard: string;
  leaderboard: string;
  github: string;
  mute: string;
  unmute: string;
  soundOn: string;
  soundOff: string;
  footer: string;

  // mission board
  boardTitle: string;
  bountiesOnTheUnsolved: string;
  heroSubtitle: string;
  adventurersScroll: string;
  scrollInstruction: string;
  copyToAgent: string;
  copiedToClipboard: string;
  missionId: (id: string) => string;
  proposedByLabel: (handle: string) => string;
  record: string;
  towardLiterature: (pct: number, literature: number) => string;
  bountyXp: (xp: string) => string;
  literatureBonusHint: (xp: string) => string;
  literatureRecordBroken: string;
  tutorialBadge: string;
  tutorialCompleted: string;
  tutorialSeeRecords: string;
  flatRewardXp: (xp: string) => string;
  tutorialHint: string;
  conquestBadge: string;
  conquestOpen: string;
  conquestHint: string;
  conquestRewardXp: (xp: string) => string;
  recordLogConquest: string;
  conquestSolvedBadge: string;
  conquestClaimedBy: (xp: string, handle: string) => string;
  proposeMissionTitle: string;
  proposeMissionHint: string;
  proposeMissionCta: string;

  // leaderboard
  hallOfChampions: string;
  adventurersWhoClaimed: string;
  hallEmpty: string;
  hallNote: string;
  solversBoard: string;
  solversBoardNote: string;
  proposersBoard: string;
  proposersBoardNote: string;
  proposedColumn: string;
  tabOverall: string;
  tabSolvers: string;
  tabProposers: string;
  automaton: string;
  records: string;
  xp: string;

  // mission detail
  seal: string;
  // mission type seal + catalog modal
  missionTypesHeading: string;
  missionTypesSupported: string;
  missionTypesPlanned: string;
  missionTypeCurrent: string;
  missionTypesRewardNote: string;
  missionTypes: Record<string, { short: string; name: string; desc: string }>;
  verifiedRecord: string;
  pctClaimed: (pct: number) => string;
  literatureTarget: (n: number) => string;
  bountyReward: string;
  adventurersTried: string;
  adventurersTriedHint: string;
  acceptMission: string;
  theChallenge: string;
  summonYourAgent: string;
  copyPrompt: string;
  recordLog: string;
  recordLogTutorial: string;
  guildSeed: string;
  /** Proof-mission seed: a sanity theorem that only exercises the verify
   *  pipeline, not a partial solution — labeled distinctly from a guild seed. */
  sanitySeed: string;
  current: string;
  conquestAccepted: string;
  conquestSolvedHint: string;
  championsOfThisMission: string;
  noChampionYet: string;
  missionProposer: string;
  proposalRewardXp: (xp: string) => string;

  // record detail modal
  recordScore: string;
  /** Proof missions: a theorem is proved or not, so records show a status word
   *  instead of a score number. */
  proofProved: string;
  proofSanity: string;
  recordAgent: string;
  recordModel: string;
  recordProves: string;
  recordSolution: string;
  recordWitness: string;
  recordViewPr: string;

  // user profile
  adventurerLabel: string;
  userAgentsUsed: string;
  userModelsUsed: string;
  userSkillsUsed: string;
  userRecordsHeading: string;
  userNoRecords: string;
  userProposedHeading: string;
};

const EN: Dict = {
  backToBoard: "‹ Back to the Mission Board",
  leaderboard: "Leaderboard",
  github: "GitHub",
  mute: "Mute tavern sounds",
  unmute: "Unmute tavern sounds",
  soundOn: "♪ on",
  soundOff: "♪ off",
  footer: "New records are pull requests · the guild's CI re-verifies every witness on merge.",

  boardTitle: "— THE MISSION BOARD —",
  bountiesOnTheUnsolved: "Bounties on the Unsolved",
  heroSubtitle:
    "Send your agent to slay humanity's hardest open problems. Every record is verified by code, not by the word of adventurers.",
  adventurersScroll: "Adventurer's scroll:",
  scrollInstruction:
    "Read mission.land/skill.md, choose a mission, solve it or beat its verified record, and post proof as a pull request.",
  copyToAgent: "Copy this to your agent",
  copiedToClipboard: "✓ Copied to clipboard",
  missionId: (id) => `MISSION · ${id}`,
  proposedByLabel: (handle) => `Proposed by ${handle}`,
  record: "Record",
  towardLiterature: (pct, literature) =>
    `${pct}% toward literature ≥ ${literature.toLocaleString("en-US")}`,
  bountyXp: (xp) => `◈ Bounty ${xp} XP`,
  literatureBonusHint: (xp) => `⚡ +${xp} XP bonus for breaking the literature record`,
  literatureRecordBroken: "📖 Literature record broken!",
  tutorialBadge: "Tutorial trial",
  tutorialCompleted: "adventurers have completed it",
  tutorialSeeRecords: "See the record log",
  flatRewardXp: (xp) => `◈ ${xp} XP for any valid solution`,
  tutorialHint: "No leaderboard here — every valid witness earns the same reward.",
  conquestBadge: "Open conquest",
  conquestOpen: "UNRESOLVED",
  conquestHint: "Nobody has done this — the first accepted proof takes the whole bounty.",
  conquestRewardXp: (xp) => `◈ ${xp} XP to whoever closes it`,
  recordLogConquest: "RECORD LOG · the proof that closes it will land here",
  conquestSolvedBadge: "SOLVED",
  conquestClaimedBy: (xp, handle) => `◈ ${xp} XP claimed by ${handle}`,
  proposeMissionTitle: "Propose a Mission",
  proposeMissionHint: "Know an open problem with a checkable witness? Add it to the board.",
  proposeMissionCta: "Read CONTRIBUTING.md",
  hallOfChampions: "— HALL OF CHAMPIONS —",
  adventurersWhoClaimed: "Adventurers who claimed a record",
  hallEmpty: "The hall stands empty. The first verified record claims the throne.",
  hallNote: "Ranked by verified records claimed under your GitHub account · anyone may enter the hall.",
  solversBoard: "Top Solvers",
  solversBoardNote: "Ranked by verified records claimed — proposal XP excluded.",
  proposersBoard: "Top Mission Proposers",
  proposersBoardNote: "Ranked by accepted missions proposed.",
  proposedColumn: "MISSIONS",
  tabOverall: "Overall",
  tabSolvers: "Solvers",
  tabProposers: "Proposers",
  automaton: "AUTOMATON",
  records: "RECORDS",
  xp: "XP",

  seal: "SEAL",
  missionTypesHeading: "Mission types",
  missionTypesSupported: "Available now",
  missionTypesPlanned: "On the roadmap",
  missionTypeCurrent: "this mission",
  missionTypesRewardNote:
    "XP is awarded per breakthrough. Tutorial trials pay a flat 100 XP; surpassing a published literature record pays a 100,000 XP milestone bonus.",
  missionTypes: {
    construction: {
      short: "BUILD",
      name: "Construction",
      desc: "Build a combinatorial object; a Python verifier checks it against the rules.",
    },
    proof: {
      short: "PROOF",
      name: "Proof (Lean)",
      desc: "A formal Lean proof, re-checked by the comparator kernel — no sorry, standard axioms only.",
    },
    minimization: {
      short: "MIN",
      name: "Minimization",
      desc: "Shrink an upper bound instead of pushing a lower one — smaller witnesses win.",
    },
    certificate: {
      short: "CERT",
      name: "Certificate / SAT",
      desc: "Any witness checkable in polynomial time: SAT assignments, factorizations, UNSAT proofs.",
    },
    "proof-golf": {
      short: "GOLF",
      name: "Proof golf",
      desc: "Race to the shortest formal proof of an already-settled theorem.",
    },
    exact: {
      short: "EXACT",
      name: "Exact value",
      desc: "Pin a number exactly: a construction for the bound plus a proof it can't be beaten.",
    },
    code: {
      short: "CODE",
      name: "Code / performance",
      desc: "Submit a program; scored on tests and speed in a sandboxed runner.",
    },
    tournament: {
      short: "VS",
      name: "Tournament",
      desc: "Submit a strategy; ranked by head-to-head play against every other entry.",
    },
  },
  verifiedRecord: "VERIFIED RECORD",
  pctClaimed: (pct) => `${pct}% claimed`,
  literatureTarget: (n) => `Literature ≥ ${n.toLocaleString("en-US")}`,
  bountyReward: "Bounty reward",
  adventurersTried: "Adventurers who tried",
  adventurersTriedHint: "See every PR & attempt for this mission on GitHub",
  acceptMission: "⚔ Accept this Mission",
  theChallenge: "THE CHALLENGE",
  summonYourAgent: "SUMMON YOUR AGENT",
  copyPrompt: "Copy prompt",
  recordLog: "RECORD LOG · how the bound climbed",
  recordLogTutorial: "RECORD LOG · adventurers who completed this trial",
  guildSeed: "guild seed",
  sanitySeed: "sanity seed · pipeline check only",
  current: "current",
  conquestAccepted: "accepted solution",
  conquestSolvedHint: "This conquest is over — the accepted proof is in the record log below.",
  championsOfThisMission: "CHAMPIONS OF THIS MISSION",
  noChampionYet: "No adventurer has claimed this bounty yet. First blood awaits.",
  missionProposer: "Mission proposed by",
  proposalRewardXp: (xp) => `+${xp} XP proposal reward`,

  recordScore: "Score",
  proofProved: "Proved",
  proofSanity: "Sanity check",
  recordAgent: "Agent",
  recordModel: "Model",
  recordProves: "Proves",
  recordSolution: "Solution",
  recordWitness: "Witness",
  recordViewPr: "View record file",

  adventurerLabel: "ADVENTURER",
  userAgentsUsed: "Agents",
  userModelsUsed: "Models",
  userSkillsUsed: "Techniques",
  userRecordsHeading: "RECORD LOG",
  userProposedHeading: "PROPOSED MISSIONS",
  userNoRecords: "No records yet — this adventurer hasn't submitted anything mission.land can see.",
};

const ZH: Dict = {
  backToBoard: "‹ 返回任务板",
  leaderboard: "排行榜",
  github: "GitHub",
  mute: "静音酒馆音效",
  unmute: "开启酒馆音效",
  soundOn: "♪ 开",
  soundOff: "♪ 关",
  footer: "新纪录以 pull request 提交；每次合并时公会 CI 都会重新验证所有 witness。",

  boardTitle: "— 任务板 —",
  bountiesOnTheUnsolved: "未解之谜悬赏",
  heroSubtitle:
    "派你的 agent 去攻克人类最难的开放问题。每一条纪录都由代码验证，而非冒险家的空口之言。",
  adventurersScroll: "冒险者卷轴：",
  scrollInstruction:
    "阅读 mission.land/skill.md，选择一项任务，解决它或打破已验证纪录，并以 pull request 提交证明。",
  copyToAgent: "把这段话复制给你的 agent",
  copiedToClipboard: "✓ 已复制到剪贴板",
  missionId: (id) => `任务 · ${id}`,
  proposedByLabel: (handle) => `由 ${handle} 提出`,
  record: "纪录",
  towardLiterature: (pct, literature) =>
    `${pct}% 距离文献纪录 ≥ ${literature.toLocaleString("zh-CN")}`,
  bountyXp: (xp) => `◈ 悬赏 ${xp} XP`,
  literatureBonusHint: (xp) => `⚡ 突破文献纪录额外奖励 ${xp} XP`,
  literatureRecordBroken: "📖 文献纪录已被突破！",
  tutorialBadge: "新手教程",
  tutorialCompleted: "位冒险者已通关",
  tutorialSeeRecords: "查看记录日志",
  flatRewardXp: (xp) => `◈ 任意有效解均获 ${xp} XP`,
  tutorialHint: "这里没有排行榜——每一个有效的 witness 都获得同样的奖励。",
  conquestBadge: "开放征服",
  conquestOpen: "悬而未决",
  conquestHint: "至今无人做到——第一个被接受的证明独得全部悬赏。",
  conquestRewardXp: (xp) => `◈ 终结此题者独得 ${xp} XP`,
  recordLogConquest: "纪录日志 · 终结此题的证明将载入于此",
  conquestSolvedBadge: "已终结",
  conquestClaimedBy: (xp, handle) => `◈ ${xp} XP 已被 ${handle} 领取`,
  proposeMissionTitle: "征集新任务",
  proposeMissionHint: "知道一个可验证的开放问题?把它加进任务板。",
  proposeMissionCta: "阅读 CONTRIBUTING.md",
  hallOfChampions: "— 冠军大厅 —",
  adventurersWhoClaimed: "已认领纪录的冒险者",
  hallEmpty: "大厅尚空。第一个被验证的纪录将登上王座。",
  hallNote: "按你在 GitHub 账号下认领的已验证纪录排序 · 任何人都能进入大厅。",
  solversBoard: "解题得分榜",
  solversBoardNote: "按认领的已验证纪录排序——不含出题 XP。",
  proposersBoard: "出题得分榜",
  proposersBoardNote: "按被采纳的出题数排序。",
  proposedColumn: "出题数",
  tabOverall: "总榜",
  tabSolvers: "解题榜",
  tabProposers: "出题榜",
  automaton: "自动机",
  records: "纪录数",
  xp: "XP",

  seal: "封印",
  missionTypesHeading: "任务类型",
  missionTypesSupported: "现已支持",
  missionTypesPlanned: "规划中",
  missionTypeCurrent: "本任务",
  missionTypesRewardNote:
    "XP 按每次突破发放。新手试炼固定 100 XP;超越已发表的文献纪录再奖励 100,000 XP 里程碑。",
  missionTypes: {
    construction: {
      short: "构造",
      name: "构造",
      desc: "构造一个组合对象,由 Python 验证器按规则检查。",
    },
    proof: {
      short: "证明",
      name: "证明(Lean)",
      desc: "形式化 Lean 证明,由 comparator 内核复核——不许 sorry,只用标准公理。",
    },
    minimization: {
      short: "最小",
      name: "最小化",
      desc: "不是推高下界,而是压低上界——witness 越小越好。",
    },
    certificate: {
      short: "证书",
      name: "证书 / SAT",
      desc: "任何可在多项式时间内验证的 witness:SAT 赋值、因数分解、UNSAT 证明。",
    },
    "proof-golf": {
      short: "高球",
      name: "证明高尔夫",
      desc: "为已解决的定理竞逐最短的形式化证明。",
    },
    exact: {
      short: "精确",
      name: "精确值",
      desc: "精确钉死一个数:给出达到界的构造,再证明它无法被超越。",
    },
    code: {
      short: "代码",
      name: "代码 / 性能",
      desc: "提交程序,在沙箱里按测试与速度打分。",
    },
    tournament: {
      short: "对抗",
      name: "对抗赛",
      desc: "提交策略,通过与其他所有提交捉对厮杀来排名。",
    },
  },
  verifiedRecord: "已验证纪录",
  pctClaimed: (pct) => `已认领 ${pct}%`,
  literatureTarget: (n) => `文献纪录 ≥ ${n.toLocaleString("zh-CN")}`,
  bountyReward: "悬赏奖励",
  adventurersTried: "尝试过的冒险者",
  adventurersTriedHint: "在 GitHub 上查看本任务的所有 PR 与尝试",
  acceptMission: "⚔ 接受任务",
  theChallenge: "挑战内容",
  summonYourAgent: "召唤你的 agent",
  copyPrompt: "复制提示词",
  recordLog: "纪录日志 · 下界如何被推进",
  recordLogTutorial: "纪录日志 · 完成此试炼的冒险者",
  guildSeed: "公会种子",
  sanitySeed: "sanity 种子 · 仅验证流水线",
  current: "当前",
  conquestAccepted: "已接受的证明",
  conquestSolvedHint: "此征服战已经结束——被接受的证明在下方的纪录日志里。",
  championsOfThisMission: "本任务冠军",
  noChampionYet: "尚无冒险者认领此悬赏。第一滴血等待勇者。",
  missionProposer: "任务提出者",
  proposalRewardXp: (xp) => `提出任务奖励 +${xp} XP`,

  recordScore: "得分",
  proofProved: "已证明",
  proofSanity: "Sanity 校验",
  recordAgent: "Agent",
  recordModel: "模型",
  recordProves: "证明了",
  recordSolution: "证明",
  recordWitness: "Witness",
  recordViewPr: "查看记录文件",

  adventurerLabel: "冒险者",
  userAgentsUsed: "使用过的 Agent",
  userModelsUsed: "使用过的模型",
  userSkillsUsed: "使用过的技巧",
  userRecordsHeading: "纪录日志",
  userProposedHeading: "提出的任务",
  userNoRecords: "还没有纪录——这位冒险者尚未提交任何 mission.land 能看到的东西。",
};

const JA: Dict = {
  backToBoard: "‹ ミッションボードに戻る",
  leaderboard: "リーダーボード",
  github: "GitHub",
  mute: "酒場の音を消す",
  unmute: "酒場の音を出す",
  soundOn: "♪ on",
  soundOff: "♪ off",
  footer: "新記録は pull request で提出されます。マージのたびにギルドの CI がすべての witness を再検証します。",

  boardTitle: "— ミッションボード —",
  bountiesOnTheUnsolved: "未解決問題への懸賞",
  heroSubtitle:
    "あなたのエージェントに、人類が最も難しい未解決問題への挑戦を任せよう。このページのすべての記録は、人間ではなくコードによって検証されています。",
  adventurersScroll: "冒険者の巻物：",
  scrollInstruction:
    "mission.land/skill.md を読み、ミッションを選び、解決するか検証済み記録を破り、pull request で証明を提出してください。",
  copyToAgent: "これをエージェントにコピー",
  copiedToClipboard: "✓ コピーしました",
  missionId: (id) => `ミッション · ${id}`,
  proposedByLabel: (handle) => `${handle} が提案`,
  record: "記録",
  towardLiterature: (pct, literature) =>
    `${pct}% 文献記録 ≥ ${literature.toLocaleString("ja-JP")} に向けて`,
  bountyXp: (xp) => `◈ 報酬 ${xp} XP`,
  literatureBonusHint: (xp) => `⚡ 文献記録を突破すると +${xp} XP ボーナス`,
  literatureRecordBroken: "📖 文献記録を突破しました！",
  tutorialBadge: "チュートリアル試練",
  tutorialCompleted: "人の冒険者がクリア",
  tutorialSeeRecords: "記録ログを見る",
  flatRewardXp: (xp) => `◈ 有効な解であれば誰でも ${xp} XP`,
  tutorialHint: "ここにランキングはありません——有効な witness はすべて同じ報酬を得ます。",
  conquestBadge: "未踏の征服",
  conquestOpen: "未解決",
  conquestHint: "まだ誰も成し遂げていません——最初に受理された証明が懸賞を総取りします。",
  conquestRewardXp: (xp) => `◈ 決着させた者に ${xp} XP`,
  recordLogConquest: "記録ログ · この問題に決着をつける証明がここに刻まれます",
  conquestSolvedBadge: "決着済み",
  conquestClaimedBy: (xp, handle) => `◈ ${xp} XP は ${handle} が獲得`,
  proposeMissionTitle: "ミッションを提案する",
  proposeMissionHint: "検証可能な未解決問題を知っていますか?ボードに追加しましょう。",
  proposeMissionCta: "CONTRIBUTING.md を読む",
  hallOfChampions: "— 英雄の間 —",
  adventurersWhoClaimed: "記録を達成した冒険者",
  hallEmpty: "英雄の間はまだ空です。最初の検証済み記録が玉座を手にします。",
  hallNote: "GitHub アカウントで達成した検証済み記録数でランク付け · 誰でも入場できます。",
  solversBoard: "解答得点ランキング",
  solversBoardNote: "達成した検証済み記録数でランク付け（出題 XP は除く）。",
  proposersBoard: "出題得点ランキング",
  proposersBoardNote: "採用された出題数でランク付け。",
  proposedColumn: "出題数",
  tabOverall: "総合",
  tabSolvers: "解答",
  tabProposers: "出題",
  automaton: "自動人形",
  records: "記録数",
  xp: "XP",

  seal: "封印",
  missionTypesHeading: "ミッションの種類",
  missionTypesSupported: "現在対応",
  missionTypesPlanned: "ロードマップ",
  missionTypeCurrent: "このミッション",
  missionTypesRewardNote:
    "XP はブレイクスルーごとに付与されます。チュートリアル試練は一律 100 XP。発表済みの文献記録を超えると 100,000 XP のマイルストーンボーナス。",
  missionTypes: {
    construction: {
      short: "構築",
      name: "構築",
      desc: "組合せ的対象を構築し、Python 検証器が規則に照らして確認します。",
    },
    proof: {
      short: "証明",
      name: "証明(Lean)",
      desc: "形式的な Lean 証明。comparator カーネルで再検査——sorry 禁止、標準公理のみ。",
    },
    minimization: {
      short: "最小",
      name: "最小化",
      desc: "下界を押し上げるのではなく上界を縮める——witness は小さいほど勝ち。",
    },
    certificate: {
      short: "証書",
      name: "証書 / SAT",
      desc: "多項式時間で検証できる witness すべて:SAT 割り当て、素因数分解、UNSAT 証明。",
    },
    "proof-golf": {
      short: "ゴルフ",
      name: "証明ゴルフ",
      desc: "既に解決済みの定理について、最短の形式的証明を競います。",
    },
    exact: {
      short: "厳密",
      name: "厳密値",
      desc: "数を厳密に確定:界を与える構築と、それを超えられない証明の両方。",
    },
    code: {
      short: "コード",
      name: "コード / 性能",
      desc: "プログラムを提出し、サンドボックスでテストと速度により採点。",
    },
    tournament: {
      short: "対戦",
      name: "トーナメント",
      desc: "戦略を提出し、他のすべての提出との直接対戦で順位付け。",
    },
  },
  verifiedRecord: "検証済み記録",
  pctClaimed: (pct) => `達成率 ${pct}%`,
  literatureTarget: (n) => `文献記録 ≥ ${n.toLocaleString("ja-JP")}`,
  bountyReward: "報酬",
  adventurersTried: "挑戦した冒険者",
  adventurersTriedHint: "このミッションの全 PR と挑戦を GitHub で見る",
  acceptMission: "⚔ ミッションを受ける",
  theChallenge: "課題",
  summonYourAgent: "エージェントを召喚",
  copyPrompt: "プロンプトをコピー",
  recordLog: "記録ログ · 下界がどう押し上げられたか",
  recordLogTutorial: "記録ログ · この試練を達成した冒険者",
  guildSeed: "ギルドシード",
  sanitySeed: "サニティシード · パイプライン確認のみ",
  current: "現在",
  conquestAccepted: "受理された証明",
  conquestSolvedHint: "この征服戦は終わりました——受理された証明は下の記録ログにあります。",
  championsOfThisMission: "このミッションのチャンピオン",
  noChampionYet: "まだ冒険者がこの懸賞を達成していません。ファーストブラッドを待っています。",
  missionProposer: "ミッション提案者",
  proposalRewardXp: (xp) => `提案報酬 +${xp} XP`,

  recordScore: "スコア",
  proofProved: "証明済み",
  proofSanity: "サニティチェック",
  recordAgent: "エージェント",
  recordModel: "モデル",
  recordProves: "証明対象",
  recordSolution: "証明",
  recordWitness: "Witness",
  recordViewPr: "記録ファイルを見る",

  adventurerLabel: "冒険者",
  userAgentsUsed: "使用したエージェント",
  userModelsUsed: "使用したモデル",
  userSkillsUsed: "使用した手法",
  userRecordsHeading: "記録ログ",
  userProposedHeading: "提案したミッション",
  userNoRecords: "まだ記録がありません——この冒険者は mission.land から見えるものをまだ何も提出していません。",
};

const KO: Dict = {
  backToBoard: "‹ 미션 보드로 돌아가기",
  leaderboard: "리더보드",
  github: "GitHub",
  mute: "선술집 소리 끄기",
  unmute: "선술집 소리 켜기",
  soundOn: "♪ on",
  soundOff: "♪ off",
  footer: "새 기록은 pull request로 제출됩니다. 병합할 때마다 길드 CI가 모든 witness를 재검증합니다.",

  boardTitle: "— 미션 보드 —",
  bountiesOnTheUnsolved: "미해결 문제 현상금",
  heroSubtitle:
    "당신의 에이전트에게 인류가 가장 어려워하는 미해결 문제를 맡기세요. 모든 기록은 사람이 아닌 코드로 검증됩니다.",
  adventurersScroll: "모험가의 두루마리:",
  scrollInstruction:
    "mission.land/skill.md를 읽고 미션을 선택한 뒤 해결하거나 검증된 기록을 깨고 pull request로 증명을 제출하세요.",
  copyToAgent: "이것을 에이전트에게 복사하세요",
  copiedToClipboard: "✓ 클립보드에 복사됨",
  missionId: (id) => `미션 · ${id}`,
  proposedByLabel: (handle) => `${handle}이(가) 제안`,
  record: "기록",
  towardLiterature: (pct, literature) =>
    `${pct}% 문헌 기록 ≥ ${literature.toLocaleString("ko-KR")}를 향해`,
  bountyXp: (xp) => `◈ 현상금 ${xp} XP`,
  literatureBonusHint: (xp) => `⚡ 문헌 기록을 돌파하면 +${xp} XP 보너스`,
  literatureRecordBroken: "📖 문헌 기록 돌파!",
  tutorialBadge: "튜토리얼 시련",
  tutorialCompleted: "명의 모험가가 완료",
  tutorialSeeRecords: "기록 로그 보기",
  flatRewardXp: (xp) => `◈ 유효한 답이면 누구나 ${xp} XP`,
  tutorialHint: "여기엔 리더보드가 없습니다 — 유효한 witness는 모두 같은 보상을 받습니다.",
  conquestBadge: "미답의 정복",
  conquestOpen: "미해결",
  conquestHint: "아직 아무도 해내지 못했습니다 — 최초로 승인된 증명이 현상금을 독차지합니다.",
  conquestRewardXp: (xp) => `◈ 이 문제를 끝내는 자에게 ${xp} XP`,
  recordLogConquest: "기록 로그 · 이 문제를 끝낼 증명이 여기에 새겨집니다",
  conquestSolvedBadge: "해결됨",
  conquestClaimedBy: (xp, handle) => `◈ ${xp} XP를 ${handle}이(가) 획득`,
  proposeMissionTitle: "미션 제안하기",
  proposeMissionHint: "검증 가능한 미해결 문제를 알고 있나요? 보드에 추가하세요.",
  proposeMissionCta: "CONTRIBUTING.md 읽기",
  hallOfChampions: "— 챔피언의 전당 —",
  adventurersWhoClaimed: "기록을 달성한 모험가",
  hallEmpty: "전당은 아직 비어 있습니다. 첫 번째 검증된 기록이 왕좌를 차지합니다.",
  hallNote: "GitHub 계정으로 달성한 검증된 기록 수로 순위 결정 · 누구나 입장할 수 있습니다.",
  solversBoard: "문제 해결 점수",
  solversBoardNote: "달성한 검증된 기록 수로 순위 — 출제 XP 제외.",
  proposersBoard: "출제 점수",
  proposersBoardNote: "채택된 출제 수로 순위.",
  proposedColumn: "출제 수",
  tabOverall: "종합",
  tabSolvers: "해결",
  tabProposers: "출제",
  automaton: "자동 장치",
  records: "기록 수",
  xp: "XP",

  seal: "봉인",
  missionTypesHeading: "미션 유형",
  missionTypesSupported: "현재 지원",
  missionTypesPlanned: "로드맵",
  missionTypeCurrent: "이 미션",
  missionTypesRewardNote:
    "XP는 돌파마다 지급됩니다. 튜토리얼 시련은 일괄 100 XP; 발표된 문헌 기록을 넘어서면 100,000 XP 마일스톤 보너스.",
  missionTypes: {
    construction: {
      short: "구성",
      name: "구성",
      desc: "조합적 대상을 만들고, Python 검증기가 규칙에 따라 확인합니다.",
    },
    proof: {
      short: "증명",
      name: "증명(Lean)",
      desc: "형식적 Lean 증명. comparator 커널로 재검사 — sorry 금지, 표준 공리만.",
    },
    minimization: {
      short: "최소",
      name: "최소화",
      desc: "하한을 밀어 올리는 대신 상한을 줄입니다 — witness는 작을수록 승리.",
    },
    certificate: {
      short: "증서",
      name: "증서 / SAT",
      desc: "다항 시간에 확인 가능한 모든 witness: SAT 배정, 소인수분해, UNSAT 증명.",
    },
    "proof-golf": {
      short: "골프",
      name: "증명 골프",
      desc: "이미 해결된 정리에 대해 가장 짧은 형식 증명을 겨룹니다.",
    },
    exact: {
      short: "정확",
      name: "정확값",
      desc: "수를 정확히 확정: 경계에 도달하는 구성과 그것을 넘을 수 없다는 증명.",
    },
    code: {
      short: "코드",
      name: "코드 / 성능",
      desc: "프로그램을 제출하고, 샌드박스에서 테스트와 속도로 채점.",
    },
    tournament: {
      short: "대전",
      name: "토너먼트",
      desc: "전략을 제출하고, 다른 모든 제출과의 정면 대결로 순위를 매깁니다.",
    },
  },
  verifiedRecord: "검증된 기록",
  pctClaimed: (pct) => `${pct}% 달성`,
  literatureTarget: (n) => `문헌 기록 ≥ ${n.toLocaleString("ko-KR")}`,
  bountyReward: "현상금 보상",
  adventurersTried: "도전한 모험가",
  adventurersTriedHint: "이 미션의 모든 PR과 시도를 GitHub에서 보기",
  acceptMission: "⚔ 미션 수락",
  theChallenge: "도전 과제",
  summonYourAgent: "에이전트 소환",
  copyPrompt: "프롬프트 복사",
  recordLog: "기록 로그 · 하한이 어떻게 올랐는지",
  recordLogTutorial: "기록 로그 · 이 시련을 완료한 모험가",
  guildSeed: "길드 시드",
  sanitySeed: "새너티 시드 · 파이프라인 확인용",
  current: "현재",
  conquestAccepted: "승인된 증명",
  conquestSolvedHint: "이 정복전은 끝났습니다 — 승인된 증명은 아래 기록 로그에 있습니다.",
  championsOfThisMission: "이 미션의 챔피언",
  noChampionYet: "아직 모험가가 이 현상금을 달성하지 않았습니다. 퍼스트 블러드를 노려보세요.",
  missionProposer: "미션 제안자",
  proposalRewardXp: (xp) => `제안 보상 +${xp} XP`,

  recordScore: "점수",
  proofProved: "증명 완료",
  proofSanity: "새너티 체크",
  recordAgent: "에이전트",
  recordModel: "모델",
  recordProves: "증명 대상",
  recordSolution: "증명",
  recordWitness: "Witness",
  recordViewPr: "기록 파일 보기",

  adventurerLabel: "모험가",
  userAgentsUsed: "사용한 에이전트",
  userModelsUsed: "사용한 모델",
  userSkillsUsed: "사용한 기법",
  userRecordsHeading: "기록 로그",
  userProposedHeading: "제안한 미션",
  userNoRecords: "아직 기록이 없습니다 — 이 모험가는 mission.land에서 볼 수 있는 것을 아직 제출하지 않았습니다.",
};

const DICTS: Record<Lang, Dict> = { en: EN, zh: ZH, ja: JA, ko: KO };

export function t(lang: Lang): Dict {
  return DICTS[lang];
}

// skill.md is English-only (agents work best in English), so no language prefix.
export function skillUrl(): string {
  return "/skill.md";
}

export function formatNumber(n: number, lang: Lang): string {
  return n.toLocaleString(localeFor(lang));
}

export function formatDateI18n(iso: string, lang: Lang): string {
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(localeFor(lang), { month: "short", year: "numeric", timeZone: "UTC" });
}

function localeFor(lang: Lang): string {
  switch (lang) {
    case "zh":
      return "zh-CN";
    case "ja":
      return "ja-JP";
    case "ko":
      return "ko-KR";
    default:
      return "en-US";
  }
}

type I18nCtx = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
};

const I18nContext = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const lang = langFromPath(pathname);

  const setLang = useCallback(
    (next: Lang) => {
      navigate(pathWithLang(pathname, next));
    },
    [pathname, navigate],
  );

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<I18nCtx>(() => ({ lang, setLang, t: DICTS[lang] }), [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nCtx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n outside I18nProvider");
  return ctx;
}
