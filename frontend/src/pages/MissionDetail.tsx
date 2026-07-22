import { useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Footer, GithubAvatar, Nav, Sheet, authorLabel } from "../components/chrome";
import { RecordModal } from "../components/RecordModal";
import { MissionTypesModal } from "../components/MissionTypesModal";
import {
  LITERATURE_BREAKTHROUGH_XP,
  MISSION_PROPOSAL_XP,
  REPO_URL,
  agentPrompt,
  conquestSolved,
  missionByNum,
  missionTypeAccent,
  missionTypeKey,
  recordStatus,
  roman,
  userPath,
  witnessTheorems,
} from "../lib/data";
import type { MissionRecord } from "../lib/data";
import { formatDateI18n, formatNumber, useI18n, withLang } from "../lib/i18n";
import { useSound } from "../lib/sound";

export default function MissionDetail() {
  const { num } = useParams();
  const q = missionByNum(Number(num));
  const { t, lang } = useI18n();
  const { tick, chime, arpeggio } = useSound();
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const summonRef = useRef<HTMLDivElement>(null);
  const recordLogRef = useRef<HTMLDivElement>(null);
  const [openRecord, setOpenRecord] = useState<MissionRecord | null>(null);
  const [typesOpen, setTypesOpen] = useState(false);

  if (!q) return <Navigate to="/" replace />;

  const prompt = agentPrompt(q);
  const typeKey = missionTypeKey(q);
  const accent = missionTypeAccent(typeKey);

  const copy = () => {
    void navigator.clipboard?.writeText(prompt).catch(() => {});
    arpeggio();
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1800);
  };

  const accept = () => {
    chime();
    summonRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="bg-tavern-deep min-h-screen">
      <div className="mx-auto max-w-[1120px] px-5 pb-[60px] pt-6 text-[#3a2c1a] max-md:px-3">
        <div className="mb-5">
          <Nav back />
        </div>
        <Sheet>
          {/* mission header */}
          <div className="mb-[26px] flex items-start justify-between gap-4 border-b-2 border-divider pb-[22px]">
            <div className="min-w-0">
              <div className="mb-2 font-display text-[14px] tracking-[5px] text-ink-soft">
                {t.missionId(q.id)}
              </div>
              <h1 className="mb-2 font-display text-[42px] font-black leading-tight text-ink max-md:text-[28px]">
                {q.name[lang]}
              </h1>
              <div className="text-[22px] text-ink-body max-md:text-[18px]">{q.tagline[lang]}</div>
            </div>
            <button
              type="button"
              onMouseEnter={tick}
              onClick={() => setTypesOpen(true)}
              title={t.missionTypes[typeKey].name}
              aria-label={t.missionTypes[typeKey].name}
              className="seal flex h-[74px] w-[74px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 px-1 text-center font-display text-[15px] font-black leading-none text-[#f7dede] transition-transform hover:scale-105"
              style={{
                background: `radial-gradient(circle at 38% 32%, color-mix(in srgb, ${accent} 55%, #fff), ${accent})`,
              }}
            >
              {t.missionTypes[typeKey].short}
            </button>
          </div>

          {/* record + actions */}
          <div className="mb-7 grid grid-cols-2 gap-[26px] max-md:grid-cols-1">
            <div className="qcard px-6 py-[22px]">
              {q.rewardMode === "completion" ? (
                <button
                  type="button"
                  onMouseEnter={tick}
                  onClick={() =>
                    recordLogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
                >
                  <div className="mb-0.5 text-[18px] text-ink-muted">{t.tutorialBadge}</div>
                  <div className="font-display text-[52px] font-black leading-[1.05] text-ink">
                    {q.adventurers}
                  </div>
                  <div className="mt-2 text-[17px] text-ink-muted">{t.tutorialCompleted}</div>
                  <div className="mt-1 text-[15px] text-crimson">{t.tutorialSeeRecords} ↓</div>
                </button>
              ) : q.rewardMode === "conquest" ? (
                conquestSolved(q) ? (
                  <>
                    <div className="mb-0.5 text-[18px] text-ink-muted">{t.conquestBadge}</div>
                    <div className="font-display text-[44px] font-black leading-[1.1] tracking-[2px] text-gold">
                      {t.conquestSolvedBadge}
                    </div>
                    <div className="mt-2 text-[17px] text-ink-muted">{t.conquestSolvedHint}</div>
                  </>
                ) : (
                  <>
                    <div className="mb-0.5 text-[18px] text-ink-muted">{t.conquestBadge}</div>
                    <div className="font-display text-[44px] font-black leading-[1.1] tracking-[2px] text-crimson">
                      {t.conquestOpen}
                    </div>
                    <div className="mt-2 text-[17px] text-ink-muted">{t.conquestHint}</div>
                  </>
                )
              ) : (
                <>
                  <div className="mb-0.5 text-[18px] text-ink-muted">{t.verifiedRecord}</div>
                  <div className="font-display text-[72px] font-black leading-[.9] text-ink">
                    {q.record}
                  </div>
                  <div className="mt-4 mb-1.5 h-4 border border-divider bg-bar-track">
                    <div
                      className="h-full"
                      style={{
                        width: `${Math.min(q.pct, 100)}%`,
                        background: q.literatureBroken ? "var(--color-gold)" : "var(--color-quest-green)",
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[17px] text-ink-muted">
                    <span>{t.pctClaimed(q.pct)}</span>
                    <span>{t.literatureTarget(q.literature)}</span>
                  </div>
                  {q.literatureBroken ? (
                    <div className="mt-2.5 text-[15px] font-bold text-gold">
                      {t.literatureRecordBroken}
                    </div>
                  ) : (
                    <div className="mt-2.5 text-[15px] text-ink-soft">
                      {t.literatureBonusHint(formatNumber(LITERATURE_BREAKTHROUGH_XP, lang))}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between border border-cardline bg-card px-5 py-4">
                <span className="text-[20px]">{t.bountyReward}</span>
                <b className="font-display text-[24px] text-gold">
                  {formatNumber(q.bounty, lang)} {t.xp}
                </b>
              </div>
              <a
                href={`${REPO_URL}/pulls?q=${encodeURIComponent(`is:pr label:mission-${q.id}`)}`}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={tick}
                title={t.adventurersTriedHint}
                className="flex items-center justify-between border border-cardline bg-card px-5 py-4 transition-colors hover:bg-card-hover"
              >
                <span className="text-[20px]">{t.adventurersTried}</span>
                <span className="text-[15px] text-crimson">GitHub ↗</span>
              </a>
              <button
                type="button"
                className="btn-quest p-4 text-[22px]"
                onMouseEnter={tick}
                onClick={accept}
              >
                {t.acceptMission}
              </button>
            </div>
          </div>

          {/* lore, straight from mission.md's Problem section */}
          <div className="mb-7 border-l-[5px] border-divider bg-lore px-[22px] py-[18px]">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-display text-[16px] tracking-[2px] text-ink-soft">
                {t.theChallenge}
              </span>
              {q.wikipedia && (
                <a
                  href={q.wikipedia}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={tick}
                  className="text-[15px] text-crimson underline underline-offset-2"
                >
                  Wikipedia ↗
                </a>
              )}
            </div>
            <div className="lore-md" dangerouslySetInnerHTML={{ __html: q.loreHtml[lang] }} />
          </div>

          {/* remaining mission.md sections (Score, Witness format, Reward,
              Known approaches) — collapsed so a raw witness isn't the only
              thing a reader has to go on */}
          {q.guide.length > 0 && (
            <div className="mb-7 flex flex-col gap-2">
              {q.guide.map((g) => (
                <details key={g.title.en} className="group border border-cardline bg-card px-[18px] py-3">
                  <summary
                    onMouseEnter={tick}
                    className="cursor-pointer list-none font-display text-[16px] tracking-[1px] text-ink-soft marker:content-none [&::-webkit-details-marker]:hidden"
                  >
                    <span className="mr-2 inline-block text-crimson transition-transform group-open:rotate-90">
                      ▸
                    </span>
                    {g.title[lang]}
                  </summary>
                  <div
                    className="lore-md mt-3 border-t border-divider pt-3"
                    dangerouslySetInnerHTML={{ __html: g.html[lang] }}
                  />
                </details>
              ))}
            </div>
          )}

          {/* summon your agent */}
          <div ref={summonRef} className="mb-[30px] rounded bg-darkbox px-[22px] py-5 text-callout">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="font-display text-[16px] tracking-[2px] text-gold-bright">
                {t.summonYourAgent}
              </span>
              <button
                type="button"
                onMouseEnter={tick}
                onClick={copy}
                className="cursor-pointer rounded-[3px] border-0 bg-gold-bright px-4 py-[7px] font-body text-[17px] text-darkbox transition-colors duration-150 hover:bg-[#f0cf6a]"
              >
                {copied ? t.copiedToClipboard : t.copyPrompt}
              </button>
            </div>
            <code className="block font-mono text-[16px] leading-[1.6] text-[#d6c39a]">
              {prompt}
            </code>
          </div>

          {/* mission proposer — a quiet one-line credit, not a content band */}
          {q.proposedBy && (
            <div className="mb-[22px] flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-ink-soft">
              <span>{t.missionProposer}</span>
              <Link
                to={withLang(userPath(q.proposedBy), lang)}
                onMouseEnter={tick}
                className="inline-flex items-center gap-1.5 text-ink-body hover:text-crimson"
              >
                <GithubAvatar author={q.proposedBy} size={20} border="#b89a63" />
                {authorLabel(q.proposedBy)}
              </Link>
              <span className="text-ink-soft">·</span>
              <span className="font-bold text-gold">
                {t.proposalRewardXp(formatNumber(MISSION_PROPOSAL_XP, lang))}
              </span>
            </div>
          )}

          {/* record log */}
          <div ref={recordLogRef} className="mb-[30px] scroll-mt-4">
            <div className="mb-3.5 font-display text-[16px] tracking-[3px] text-ink-soft">
              {q.rewardMode === "completion"
                ? t.recordLogTutorial
                : q.rewardMode === "conquest"
                  ? t.recordLogConquest
                  : t.recordLog}
            </div>
            <div className="flex flex-col gap-2">
              {q.records.map((r) => {
                const theorems = witnessTheorems(r.witness);
                const status = recordStatus(r);
                const solved = status === "proved" || status === "refuted" || status === "formalized";
                return (
                  <div
                    key={`${r.score}-${r.author}`}
                    onMouseEnter={tick}
                    onClick={() => setOpenRecord(r)}
                    className="qrow qrow-slide grid cursor-pointer grid-cols-[70px_44px_1fr_150px] items-center gap-3.5 px-4 py-[9px] max-md:grid-cols-[56px_40px_1fr]"
                  >
                    {status ? (
                      <span
                        className={`font-display text-[15px] font-black leading-tight ${
                          solved ? "text-quest-green" : "text-ink-soft"
                        }`}
                      >
                        {status === "proved"
                          ? `✓ ${t.proofProved}`
                          : status === "refuted"
                            ? `✓ ${t.proofRefuted}`
                            : status === "formalized"
                              ? `✓ ${t.proofFormalized}`
                              : t.proofSanity}
                      </span>
                    ) : (
                      <span className="font-display text-[26px] font-black text-ink">{r.score}</span>
                    )}
                    {r.seed ? (
                      <GithubAvatar author={r.author} size={36} border="#b89a63" />
                    ) : (
                      <Link
                        to={withLang(userPath(r.author), lang)}
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={tick}
                      >
                        <GithubAvatar author={r.author} size={36} border="#b89a63" />
                      </Link>
                    )}
                    <span className="text-[19px] text-ink-body">
                      {authorLabel(r.author)}
                      {theorems && theorems.length > 0 && (
                        <span className="ml-2 text-[14px] text-ink-soft">
                          · {t.recordProves.toLowerCase()}: {theorems.join(", ")}
                        </span>
                      )}
                      {r.seed ? (
                        <span className="ml-2 text-[15px] italic text-ink-soft">
                          {status === "sanity" || status === "seed" ? t.sanitySeed : t.guildSeed}
                        </span>
                      ) : (
                        <a
                          href={r.prUrl}
                          target="_blank"
                          rel="noreferrer"
                          onMouseEnter={tick}
                          onClick={(e) => e.stopPropagation()}
                          className="ml-2 text-[14px] text-crimson underline underline-offset-2"
                        >
                          file ↗
                        </a>
                      )}
                    </span>
                    <span className="text-right text-[16px] text-ink-soft max-md:hidden">
                      {formatDateI18n(r.date, lang)}
                      {q.rewardMode === "conquest"
                        ? r.score > 0 && ` · ${t.conquestAccepted}`
                        : r.current && q.rewardMode !== "completion" && ` · ${t.current}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* champions of this mission */}
          <div className="border-t-2 border-divider pt-[22px]">
            <div className="mb-3.5 font-display text-[16px] tracking-[3px] text-ink-soft">
              {t.championsOfThisMission}
            </div>
            <div className="flex max-w-[640px] flex-col gap-2">
              {q.champions.length === 0 ? (
                <div className="py-3 text-[18px] italic text-ink-soft">{t.noChampionYet}</div>
              ) : (
                q.champions.map((c, i) => (
                  <Link
                    key={c.author}
                    to={withLang(userPath(c.author), lang)}
                    onMouseEnter={tick}
                    className="qrow grid grid-cols-[44px_44px_1fr_120px] items-center gap-3.5 px-4 py-[9px] max-md:grid-cols-[32px_36px_minmax(0,1fr)_auto] max-md:gap-2.5 max-md:px-3"
                  >
                    <span className="text-center font-display text-[22px] text-medal-gold max-md:text-[16px]">
                      {roman(i + 1)}
                    </span>
                    <GithubAvatar author={c.author} size={36} border="#c9a227" />
                    <span className="truncate text-[19px] text-ink-body max-md:text-[16px]">
                      {authorLabel(c.author)}
                    </span>
                    <span className="whitespace-nowrap text-right text-[16px] font-bold text-gold max-md:text-[14px]">
                      {formatNumber(c.xp, lang)} {t.xp}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </Sheet>
        <Footer />
      </div>
      {openRecord && (
        <RecordModal
          record={openRecord}
          missionName={q.name[lang]}
          onClose={() => setOpenRecord(null)}
        />
      )}
      {typesOpen && (
        <MissionTypesModal currentKey={typeKey} onClose={() => setTypesOpen(false)} />
      )}
    </div>
  );
}
